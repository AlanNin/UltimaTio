"use server";
import axios from "axios";

// GET HOME FEED (COMBINED)
export async function getHomeFeed(): Promise<any | { error: string }> {
  try {
    const trendingMovies = await searchTMDBFeed(
      "trending/movie/week?language=en-US"
    );
    const popularMovies = await searchTMDBFeed("movie/popular?language=en-US");
    const topRatedMovies = await searchTMDBFeed(
      "movie/top_rated?language=en-US"
    );
    const upcomingMovies = await searchTMDBFeed(
      "movie/upcoming?language=en-US"
    );
    const trendingTV = await searchTMDBFeed("trending/tv/week?language=en-US");

    const popularTV = await searchTMDBFeed("tv/popular?language=en-US");
    const topRatedTV = await searchTMDBFeed("tv/top_rated?language=en-US");

    const homeFeed = {
      trending: shuffleArray([
        ...trendingMovies.slice(0, 8),
        ...trendingTV.filter((item: any) => item.category === "tv").slice(0, 8),
      ]),
      popular: shuffleArray([
        ...popularMovies.slice(0, 8),
        ...popularTV.filter((item: any) => item.category === "tv").slice(0, 8),
      ]),
      topRated: shuffleArray([
        ...topRatedMovies.slice(0, 8),
        ...topRatedTV.filter((item: any) => item.category === "tv").slice(0, 8),
      ]),
      upcoming: shuffleArray([...upcomingMovies]),
    };

    return homeFeed;
  } catch (error) {
    console.error("Error fetching home feed:", error);
    return { error: "Error al obtener el feed de inicio" };
  }
}

// SEARCH TMDB FEED (COMBINED)
async function searchTMDBFeed(url: string): Promise<any[]> {
  const baseUrl = "https://api.themoviedb.org/3/";
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
          let contentType;
          if (url.includes("movie")) {
            contentType = "movie";
            const fullDataResponse = await axios.get(
              `${baseUrl}movie/${content.id}`,
              {
                params: {
                  api_key: process.env.TMDB_APIKEY,
                  append_to_response: "credits",
                },
              }
            );

            if (content.overview.length === 0) {
              return null;
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
                ? "https://media.themoviedb.org/t/p/original" +
                  actor.profile_path
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
              title: fullDataResponse.data.title,
              tmdbid: content.id,
              date: new Date(fullDataResponse.data.release_date),
              duration: fullDataResponse.data.runtime * 60,
              rating: Math.round(content.vote_average * 10) / 10,
              description: content.overview,
              ContentStudio,
              ContentGenre,
              ContentActor: actors,
              category: contentType,
            };
          } else if (url.includes("tv")) {
            contentType = "tv";
            const fullDataResponse = await axios.get(
              `${baseUrl}tv/${content.id}`,
              {
                params: {
                  api_key: process.env.TMDB_APIKEY,
                  append_to_response: "credits",
                },
              }
            );

            if (fullDataResponse.data.genres.length === 0) {
              return null;
            }

            const hasNewsGenre = fullDataResponse.data.genres.some(
              (genre: any) =>
                genre.name.toLowerCase() === "news" ||
                genre.name.toLowerCase() === "talk" ||
                genre.name.toLowerCase() === "documentary" ||
                genre.name.toLowerCase() === "soap" ||
                genre.name.toLowerCase() === "reality"
            );

            if (hasNewsGenre) {
              return null;
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
                ? "https://media.themoviedb.org/t/p/original" +
                  actor.profile_path
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
              duration:
                fullDataResponse.data.episode_run_time.length > 0
                  ? fullDataResponse.data.episode_run_time[0] * 60
                  : null,
              rating: Math.round(content.vote_average * 10) / 10,
              description: content.overview,
              ContentStudio,
              ContentGenre,
              ContentActor: actors,
              category: contentType,
            };
          } else {
            return null;
          }
        } catch (error) {
          console.error("Error fetching full TMDB data:", content.id, error);
          return null;
        }
      })
    );

    return responseData.filter((data: any) => data !== null);
  } catch (error) {
    console.error("Error fetching TMDb search data:", error);
    return [];
  }
}

// SHUFFLE ARRAY
function shuffleArray(array: any[]): any[] {
  const shuffledArray = [...array]; // Copia el array original para no modificarlo directamente
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Genera un índice aleatorio entre 0 e i (inclusive)
    // Intercambia los elementos en las posiciones i y j
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

// HANDLE SEARCH
export async function handleSearch(query: string): Promise<any> {
  const AnimeGenreId = 16;
  const AnimeCountry = "JP";
  const baseUrl = "https://api.themoviedb.org/3/";
  const apiKey = process.env.TMDB_APIKEY;
  const language = "en-US";

  try {
    // Search for multi content (movies, TV shows, etc.)
    const searchResults: any[] = [];

    // Function to fetch search results from TMDb
    const fetchSearchResults = async (page: number) => {
      const response = await axios.get(`${baseUrl}search/multi`, {
        params: {
          api_key: apiKey,
          query,
          language,
          page, // Specify the page number
        },
      });

      return response.data.results;
    };

    // Fetch results from page 1
    const resultsPage1 = await fetchSearchResults(1);
    searchResults.push(...resultsPage1);

    // Fetch results from page 2
    const resultsPage2 = await fetchSearchResults(2);
    searchResults.push(...resultsPage2);

    // Process search results
    const responseData = await Promise.all(
      searchResults.map(async (content: any) => {
        try {
          let category = content.media_type; // Default category based on media type

          if (content.media_type === "movie" || content.media_type === "tv") {
            // Determine if it's anime based on conditions
            const isAnime =
              content.origin_country &&
              content.origin_country.includes(AnimeCountry) &&
              content.genre_ids &&
              content.genre_ids.includes(AnimeGenreId);

            category = isAnime ? "anime" : content.media_type;
          }

          return {
            landscapeUrl: content.backdrop_path
              ? "https://media.themoviedb.org/t/p/original" +
                content.backdrop_path
              : null,
            posterUrl: content.poster_path
              ? "https://media.themoviedb.org/t/p/w780" + content.poster_path
              : null,
            title: content.title || content.name,
            tmdbid: content.id,
            rating: Math.round(content.vote_average * 10) / 10,
            description: content.overview,
            category,
          };
        } catch (error) {
          console.error("Error fetching full TMDB data:", content.id, error);
          return null;
        }
      })
    );

    // Filter out null entries
    const filteredData = responseData.filter((data) => data !== null);

    return filteredData;
  } catch (error) {
    console.error("Error fetching TMDb search data:", error);
    return [];
  }
}
