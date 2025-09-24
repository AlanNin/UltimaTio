"use server";
import axios from "axios";
import { getCurrentProfile } from "../authMiddleware";
import prisma from "~/server/prisma-client";

// GET FEED (ANIME)
export async function getFeedAnime(): Promise<any | { error: string }> {
  try {
    const airingTodayAnime = await searchTMDBFeedAnime(
      "tv/airing_today?language=en-US",
    );

    const onTheAirAnime = await searchTMDBFeedAnime(
      "tv/on_the_air?language=en-US",
    );

    const popularAnime = await searchTMDBFeedAnime("tv/popular?language=en-US");

    const topRatedAnime = await searchTMDBFeedAnime(
      "tv/top_rated?language=en-US",
    );

    return { airingTodayAnime, onTheAirAnime, popularAnime, topRatedAnime };
  } catch (error) {
    console.error("Error fetching home feed:", error);
    return { error: "Error al obtener el feed de inicio" };
  }
}

// GET CONTENT (ANIME)
export async function getContentAnime(
  tmdbid: number,
): Promise<any | { error: string }> {
  try {
    const fullDataResponse = await axios.get(
      `https://api.themoviedb.org/3/tv/${tmdbid}`,
      {
        params: {
          api_key: process.env.TMDB_APIKEY,
          append_to_response: "credits",
        },
      },
    );

    const content = fullDataResponse.data;

    let profileContent = null;
    let likeStatus = null;
    try {
      const profile_id = await getCurrentProfile();
      if (profile_id !== null) {
        const contentDB = await prisma.content.findFirst({
          where: {
            tmdb_id: content.id,
            category: "anime",
          },
          include: {
            profile_likes: true,
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
          const profileLikes = await prisma.profileLike.findFirst({
            where: {
              profile_id,
              content_id: contentDB.id,
            },
          });
          if (profileLikes) {
            likeStatus = profileLikes.likeStatus;
          }
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
          },
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
                  pc.season === season.season_number,
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
          }),
        );

        return {
          season: {
            ...season,
            episodes,
          },
        };
      }),
    );

    const sortedSeasons = seasons.sort((a, b) => {
      if (a.season.season_number === 0) return 1;
      if (b.season.season_number === 0) return -1;
      return a.season.season_number - b.season.season_number;
    });

    const similarContent = await getSimilarContentAnime(content.id);

    const duration =
      (Array.isArray(content.episode_run_time) &&
      content.episode_run_time.length > 0
        ? content.episode_run_time[0] * 60
        : null) ||
      (content.last_episode_to_air?.runtime
        ? content.last_episode_to_air.runtime * 60
        : null) ||
      (content.next_episode_to_air?.runtime
        ? content.next_episode_to_air.runtime * 60
        : null) ||
      0;

    return {
      landscapeUrl:
        "https://media.themoviedb.org/t/p/original" + content.backdrop_path,
      posterUrl: "https://media.themoviedb.org/t/p/w780" + content.poster_path,
      title: fullDataResponse.data.name,
      tmdbid: content.id,
      date: new Date(content.first_air_date),
      duration,
      rating: Math.round(content.vote_average * 10) / 10,
      description: content.overview,
      ContentStudio,
      ContentGenre,
      ContentActor: actors,
      seasons: sortedSeasons,
      similarContent,
      category: "anime",
      profileContent: profileContent || null,
      likeStatus: likeStatus || 0,
    };
  } catch (error) {
    console.error("Error fetching content:", error);
    return { error: "Error al obtener el contenido" };
  }
}

// GET SIMILAR CONTENT (TV)
async function getSimilarContentAnime(
  tmdbid: number,
): Promise<any | { error: string }> {
  try {
    const original_language = "ja";

    const response = await axios.get(
      `https://api.themoviedb.org/3/tv/${tmdbid}/similar`,
      {
        params: {
          api_key: process.env.TMDB_APIKEY,
        },
      },
    );

    const similarContent = response.data.results
      .filter((content: any) => {
        return content.original_language === original_language;
      })
      .map((content: any) => ({
        ...content,
        category: "anime",
      }));

    return similarContent;
  } catch (error) {
    console.error("Error fetching home feed:", error);
    return { error: "Error al obtener el feed de inicio" };
  }
}

// SEARCH TMDB FEED
async function searchTMDBFeedAnime(url: string): Promise<any[] | null> {
  const baseUrl = "https://api.themoviedb.org/3/";

  // Exclude Anime
  const excludedGenreId = 16;
  const excludedCountry = "JP";

  let totalPages = 8;

  try {
    const responses = await Promise.all(
      Array.from({ length: totalPages }, (_, page) =>
        axios.get(`${baseUrl}${url}`, {
          params: {
            api_key: process.env.TMDB_APIKEY,
            language: "en-US",
            page: page + 1,
          },
        }),
      ),
    );

    const combinedResults = responses.flatMap(
      (response) => response.data.results,
    );

    const responseData = await Promise.all(
      combinedResults.map(async (content: any) => {
        try {
          const fullDataResponse = await axios.get(
            `${baseUrl}tv/${content.id}`,
            {
              params: {
                api_key: process.env.TMDB_APIKEY,
                append_to_response: "credits",
              },
            },
          );

          const isAnime =
            fullDataResponse.data.origin_country.includes(excludedCountry) &&
            fullDataResponse.data.genres.some(
              (genre: any) => genre.id === excludedGenreId,
            );

          if (!isAnime) {
            return null;
          }

          const studios = fullDataResponse.data.production_companies.map(
            (studio: any) => ({
              id: studio.id,
              name: studio.name,
              originCountry: studio.origin_country,
            }),
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
            }),
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
            category: "anime",
          };
        } catch (error) {
          console.error(
            "Error fetching full TMDB data for anime:",
            content.id,
            error,
          );
          return null;
        }
      }),
    );

    const filteredData = responseData.filter((data: any) => data !== null);
    return filteredData;
  } catch (error) {
    console.error("Error fetching TMDb search data:", error);
    return null;
  }
}
