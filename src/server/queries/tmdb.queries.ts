"use server";
import axios from "axios";

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
