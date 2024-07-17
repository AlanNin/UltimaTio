"use server";
import axios from "axios";
import prisma from "~/server/prisma-client";
import { getCurrentProfile } from "../authMiddleware";

// GET FEED (MOVIE)
export async function getFeedMovie(): Promise<any | { error: string }> {
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

    let profileContent = null;
    let likeStatus = null;
    try {
      const profile_id = await getCurrentProfile();
      if (profile_id !== null) {
        const contentDB = await prisma.content.findFirst({
          where: {
            tmdb_id: content.id,
            category: "movie",
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
      title: fullDataResponse.data.title,
      tmdbid: content.id,
      date: new Date(fullDataResponse.data.release_date),
      duration: fullDataResponse.data.runtime * 60,
      rating: Math.round(content.vote_average * 10) / 10,
      description: content.overview,
      ContentStudio,
      ContentGenre,
      ContentActor: actors,
      similarContent,
      category: "movie",
      profileContent: profileContent || null,
      likeStatus: likeStatus || 0,
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

    const similarContent = response.data.results.map((content: any) => ({
      ...content,
      category: "movie",
    }));
    return similarContent;
  } catch (error) {
    console.error("Error fetching home feed:", error);
    return { error: "Error al obtener el feed de inicio" };
  }
}

// SEARCH TMDB FEED
async function searchTMDBFeedMovie(url: string): Promise<any | null> {
  const baseUrl = "https://api.themoviedb.org/3/";
  try {
    const response = await axios.get(`${baseUrl}${url}`, {
      params: {
        api_key: process.env.TMDB_APIKEY,
      },
    });

    const responseData = await Promise.all(
      response.data.results.map(async (content: any) => {
        try {
          const fullDataResponse = await axios.get(
            `${baseUrl}movie/${content.id}`,
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
            title: fullDataResponse.data.title,
            tmdbid: content.id,
            date: new Date(fullDataResponse.data.release_date),
            duration: fullDataResponse.data.runtime * 60,
            rating: Math.round(content.vote_average * 10) / 10,
            description: content.overview,
            ContentStudio,
            ContentGenre,
            ContentActor: actors,
            category: "movie",
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
