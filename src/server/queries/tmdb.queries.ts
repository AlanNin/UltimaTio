"use server";
import axios from "axios";

// GET HOME FEED
export async function getHomeFeed(): Promise<any | { error: string }> {
  try {
    const trendingMovies = await searchTMDBFeedMovie(
      "trending/movie/week?language=en-US"
    );

    const popularMovies = await searchTMDBFeedMovie(
      "movie/popular?language=en-US"
    );

    const topRatedMovies = await searchTMDBFeedMovie(
      "movie/top_rated?language=en-US"
    );

    const upcomingMovies = await searchTMDBFeedMovie(
      "movie/upcoming?language=en-US"
    );

    return { trendingMovies, popularMovies, topRatedMovies, upcomingMovies };
  } catch (error) {
    console.error("Error fetching home feed:", error);
    return { error: "Error al obtener el feed de inicio" };
  }
}

// GET CONTENT (MOVIE)
export async function getContentMovie(
  tmdbid: number
): Promise<any | { error: string }> {
  try {
    const fullDataResponse = await axios.get(
      `https://api.themoviedb.org/3/movie/${tmdbid}`,
      {
        params: {
          api_key: process.env.TMDB_APIKEY,
          append_to_response: "credits",
        },
      }
    );

    const content = fullDataResponse.data;

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

    const ContentGenre = fullDataResponse.data.genres.map((genre: any) => ({
      genre: {
        id: genre.id,
        name: genre.name,
        createdAt: new Date().toISOString(), // Use the appropriate createdAt value
        updatedAt: new Date().toISOString(), // Use the appropriate updatedAt value
      },
    }));

    const cast = fullDataResponse.data.credits.cast.slice(0, 15);

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

    const similarContent = await getSimilarContentMovie(content.id);

    return {
      landscapeUrl:
        "https://media.themoviedb.org/t/p/original" + content.backdrop_path,
      posterUrl: "https://media.themoviedb.org/t/p/w780" + content.poster_path,
      title: content.original_title,
      tmdbid: content.id,
      date: new Date(fullDataResponse.data.release_date),
      duration: fullDataResponse.data.runtime * 60,
      rating: Math.round(content.vote_average * 10) / 10,
      description: content.overview,
      ContentStudio,
      ContentGenre,
      ContentActor: actors,
      similarContent,
    };
  } catch (error) {
    console.error("Error fetching content:", error);
    return { error: "Error al obtener el contenido" };
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

        const episodes = seasonDetails.episodes.map((episode: any) => ({
          episodeNumber: episode.episode_number,
          episodePoster: episode.still_path
            ? `https://media.themoviedb.org/t/p/w300_and_h450_bestv2${episode.still_path}`
            : null,
          rating: Math.round(episode.vote_average * 10) / 10,
          title: episode.name,
          airDate: new Date(episode.air_date),
          episodeDuration: episode.runtime * 60,
          overview: episode.overview,
        }));

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
      title: content.original_name,
      tmdbid: content.id,
      date: new Date(content.first_air_date),
      duration: content.episode_run_time * 60,
      rating: Math.round(content.vote_average * 10) / 10,
      description: content.overview,
      ContentStudio,
      ContentGenre,
      ContentActor: actors,
      seasons: sortedSeasons,
      similarContent,
    };
  } catch (error) {
    console.error("Error fetching content:", error);
    return { error: "Error al obtener el contenido" };
  }
}

// GET SIMILAR CONTENT (MOVIE)
async function getSimilarContentMovie(
  tmdbid: number
): Promise<any | { error: string }> {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${tmdbid}/similar`,
      {
        params: {
          api_key: process.env.TMDB_APIKEY,
        },
      }
    );

    const similarContent = response.data.results;
    return similarContent;
  } catch (error) {
    console.error("Error fetching home feed:", error);
    return { error: "Error al obtener el feed de inicio" };
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

    const similarContent = response.data.results;
    return similarContent;
  } catch (error) {
    console.error("Error fetching home feed:", error);
    return { error: "Error al obtener el feed de inicio" };
  }
}

// SEARCH TMDB FEED MOVIE
async function searchTMDBFeedMovie(url: string): Promise<any | null> {
  const baseUrl = "https://api.themoviedb.org/3/";
  try {
    const response = await axios.get(`${baseUrl}${url}`, {
      params: {
        api_key: process.env.TMDB_APIKEY,
      },
    });

    const responseData = await Promise.all(
      response.data.results.map(async (movie: any) => {
        try {
          const fullDataResponse = await axios.get(
            `${baseUrl}movie/${movie.id}`,
            {
              params: {
                api_key: process.env.TMDB_APIKEY,
                append_to_response: "credits",
              },
            }
          );

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
                createdAt: new Date().toISOString(), // Use the appropriate createdAt value
                updatedAt: new Date().toISOString(), // Use the appropriate updatedAt value
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
              "https://media.themoviedb.org/t/p/original" + movie.backdrop_path,
            posterUrl:
              "https://media.themoviedb.org/t/p/w780" + movie.poster_path,
            title: movie.original_title,
            tmdbid: movie.id,
            date: new Date(fullDataResponse.data.release_date),
            duration: fullDataResponse.data.runtime * 60,
            rating: Math.round(movie.vote_average * 10) / 10,
            description: movie.overview,
            ContentStudio,
            ContentGenre,
            ContentActor: actors,
          };
        } catch (error) {
          console.error(
            "Error fetching full TMDB data for movie:",
            movie.id,
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
