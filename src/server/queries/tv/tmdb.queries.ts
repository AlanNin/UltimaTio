"use server";
import axios from "axios";
import prisma from "../../prisma-client";
import { getCurrentProfile } from ".././authMiddleware";

// GET FEED (TV)
export async function getFeedTV(): Promise<any | { error: string }> {
  try {
    const airingTodayTV = await searchTMDBFeedTV(
      "tv/airing_today?language=en-US"
    );

    const onTheAirTV = await searchTMDBFeedTV("tv/on_the_air?language=en-US");

    const popularTV = await searchTMDBFeedTV("tv/popular?language=en-US");

    const topRatedTV = await searchTMDBFeedTV("tv/top_rated?language=en-US");

    return { airingTodayTV, onTheAirTV, popularTV, topRatedTV };
  } catch (error) {
    console.error("Error fetching home feed:", error);
    return { error: "Error al obtener el feed de inicio" };
  }
}

// GET CONTENT (TV)
export async function getContentTV(
  tmdbid: number
): Promise<any | { error: string }> {
  try {
    const fullDataResponse = await axios.get(
      `https://api.themoviedb.org/3/tv/${tmdbid}`,
      {
        params: {
          api_key: process.env.TMDB_APIKEY,
          append_to_response: "credits",
        },
      }
    );

    const content = fullDataResponse.data;

    let profileContent = null;
    try {
      const profile_id = await getCurrentProfile();
      if (profile_id !== null) {
        const contentDB = await prisma.content.findFirst({
          where: {
            tmdb_id: content.id,
            category: "tv",
          },
        });
        if (contentDB) {
          profileContent = await prisma.profileContent.findMany({
            where: {
              content_id: contentDB.id,
              profile_id: profile_id,
            },
            orderBy: {
              updated_at: "desc",
            },
            include: {
              content: true,
              profile: true,
            },
          });
        }
      }
    } catch (error) {
      profileContent = null;
    }

    const studios = content.production_companies.map((studio: any) => ({
      id: studio.id,
      name: studio.name,
      originCountry: studio.origin_country,
    }));

    const ContentStudio = studios.map((studio: any) => ({
      studio,
    }));

    const ContentGenre = content.genres.map((genre: any) => ({
      genre: {
        id: genre.id,
        name: genre.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    }));

    const cast = content.credits.cast.slice(0, 15);

    const contentActors = cast.map((actor: any) => ({
      name: actor.name,
      imgUrl: actor.profile_path
        ? "https://media.themoviedb.org/t/p/original" + actor.profile_path
        : null,
    }));

    const actors = contentActors.map((actor: any) => ({
      name: actor.name,
      imgUrl: actor.imgUrl,
    }));

    const seasons = await Promise.all(
      content.seasons.map(async (season: any) => {
        const seasonDetailsResponse = await axios.get(
          `https://api.themoviedb.org/3/tv/${tmdbid}/season/${season.season_number}`,
          {
            params: {
              api_key: process.env.TMDB_APIKEY,
            },
          }
        );

        const seasonDetails = seasonDetailsResponse.data;

        const episodes = await Promise.all(
          seasonDetails.episodes.map(async (episode: any) => {
            let episodeWatchProgress = 0;
            let episodeDuration = episode.runtime * 60;

            // Check if there's profileContent available and find matching episode
            if (profileContent) {
              const matchedEpisode = profileContent.find(
                (pc: any) =>
                  pc.episode === episode.episode_number &&
                  pc.season === season.season_number
              );
              if (matchedEpisode) {
                episodeWatchProgress = matchedEpisode.watchProgress.toNumber();
                episodeDuration = matchedEpisode.duration
                  ? matchedEpisode.duration.toNumber()
                  : episodeDuration;
              }
            }

            return {
              episodeNumber: episode.episode_number,
              episodePoster: episode.still_path
                ? `https://media.themoviedb.org/t/p/w300_and_h450_bestv2${episode.still_path}`
                : null,
              rating: Math.round(episode.vote_average * 10) / 10,
              title: episode.name,
              airDate: new Date(episode.air_date),
              episodeDuration: episodeDuration,
              watchProgress: episodeWatchProgress,
              overview: episode.overview,
            };
          })
        );

        return {
          season: {
            ...season,
            episodes,
          },
        };
      })
    );

    const sortedSeasons = seasons.sort((a, b) => {
      if (a.season.season_number === 0) return 1;
      if (b.season.season_number === 0) return -1;
      return a.season.season_number - b.season.season_number;
    });

    const similarContent = await getSimilarContentTV(content.id);

    return {
      landscapeUrl:
        "https://media.themoviedb.org/t/p/original" + content.backdrop_path,
      posterUrl: "https://media.themoviedb.org/t/p/w780" + content.poster_path,
      title: fullDataResponse.data.name,
      tmdbid: content.id,
      date: new Date(content.first_air_date),
      duration:
        content.episode_run_time * 60 ||
        content.last_episode_to_air.runtime * 60,
      rating: Math.round(content.vote_average * 10) / 10,
      description: content.overview,
      ContentStudio,
      ContentGenre,
      ContentActor: actors,
      seasons: sortedSeasons,
      similarContent,
      category: "tv",
      profileContent: profileContent || null,
    };
  } catch (error) {
    console.error("Error fetching content:", error);
    return { error: "Error al obtener el contenido" };
  }
}

// GET SIMILAR CONTENT (TV)
async function getSimilarContentTV(
  tmdbid: number
): Promise<any | { error: string }> {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/tv/${tmdbid}/similar`,
      {
        params: {
          api_key: process.env.TMDB_APIKEY,
        },
      }
    );

    const similarContent = response.data.results.map((content: any) => ({
      ...content,
      category: "tv",
    }));

    return similarContent;
  } catch (error) {
    console.error("Error fetching home feed:", error);
    return { error: "Error al obtener el feed de inicio" };
  }
}

// SEARCH TMDB FEED
async function searchTMDBFeedTV(url: string): Promise<any | null> {
  const baseUrl = "https://api.themoviedb.org/3/";

  // Exclude Anime
  const excludedGenreId = 16;
  const excludedCountry = "JP";

  try {
    const response = await axios.get(`${baseUrl}${url}`, {
      params: {
        api_key: process.env.TMDB_APIKEY,
        language: "en-US",
      },
    });

    const responseData = await Promise.all(
      response.data.results.map(async (content: any) => {
        try {
          const fullDataResponse = await axios.get(
            `${baseUrl}tv/${content.id}`,
            {
              params: {
                api_key: process.env.TMDB_APIKEY,
                append_to_response: "credits",
              },
            }
          );

          const isAnime =
            fullDataResponse.data.origin_country.includes(excludedCountry) &&
            fullDataResponse.data.genres.some(
              (genre: any) => genre.id === excludedGenreId
            );

          if (isAnime) {
            return null; //
          }

          const studios = fullDataResponse.data.production_companies.map(
            (studio: any) => ({
              id: studio.id,
              name: studio.name,
              originCountry: studio.origin_country,
            })
          );

          const ContentStudio = studios.map((studio: any) => ({
            studio,
          }));

          const ContentGenre = fullDataResponse.data.genres.map(
            (genre: any) => ({
              genre: {
                id: genre.id,
                name: genre.name,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            })
          );

          const cast = fullDataResponse.data.credits.cast.slice(0, 15);

          const contentActors = cast.map((actor: any) => ({
            name: actor.name,
            img: actor.profile_path
              ? "https://media.themoviedb.org/t/p/original" + actor.profile_path
              : null,
          }));

          const actors = contentActors.map((actor: any) => ({
            name: actor.name,
            img: actor.img,
          }));

          return {
            landscapeUrl:
              "https://media.themoviedb.org/t/p/original" +
              content.backdrop_path,
            posterUrl:
              "https://media.themoviedb.org/t/p/w780" + content.poster_path,
            title: fullDataResponse.data.name,
            tmdbid: content.id,
            date: new Date(fullDataResponse.data.first_air_date),
            duration: fullDataResponse.data.runtime * 60,
            rating: Math.round(content.vote_average * 10) / 10,
            description: content.overview,
            ContentStudio,
            ContentGenre,
            ContentActor: actors,
            category: "tv",
          };
        } catch (error) {
          console.error(
            "Error fetching full TMDB data for movie:",
            content.id,
            error
          );
          return null;
        }
      })
    );

    return responseData.filter((data: any) => data !== null);
  } catch (error) {
    console.error("Error fetching TMDb search data:", error);
    return null;
  }
}
