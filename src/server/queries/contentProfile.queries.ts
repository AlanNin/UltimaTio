"use server";
import axios from "axios";
import prisma from "../prisma-client";
import { getCurrentProfile, getUserFromAuth } from "./authMiddleware";

// SAVE PROFILE CONTENT PROGRESS
export async function saveProfileContentProgress(
  tmdb_id: number,
  category: string,
  progress: number,
  duration: number,
  season?: number,
  episode?: number
): Promise<any | null> {
  try {
    const profile_id = await getCurrentProfile();

    // VALIDATE IF PROFILE EXISTS
    const profile = await prisma.profile.findUnique({
      where: { id: profile_id },
    });
    if (!profile) {
      return null;
    }

    // VALIDATE IF CONTENT EXISTS
    let content;
    content = await prisma.content.findFirst({
      where: { tmdb_id, category },
    });
    if (!content) {
      content = await prisma.content.create({
        data: {
          tmdb_id,
          category,
        },
      });
    }

    // FIND IF PROFILE CONTENT EXISTS
    const profileContent = await prisma.profileContent.findFirst({
      where: {
        profile_id,
        content_id: content.id,
        season: category === "tv" || category === "anime" ? season : undefined,
        episode:
          category === "tv" || category === "anime" ? episode : undefined,
      },
    });

    if (profileContent) {
      // UPDATE PROFILE CONTENT PROGRESS
      await prisma.profileContent.update({
        where: {
          id: profileContent.id,
          content_id: content.id,
          season:
            category === "tv" || category === "anime" ? season : undefined,
          episode:
            category === "tv" || category === "anime" ? episode : undefined,
        },
        data: {
          watchProgress: progress,
          showResume: true,
        },
      });
      return { success: true, message: "Content progress updated" };
    } else {
      // CREATE PROFILE CONTENT
      await prisma.profileContent.create({
        data: {
          profile_id,
          content_id: content.id,
          watchProgress: progress,
          duration: duration,
          season:
            category === "tv" || category === "anime" ? season : undefined,
          episode:
            category === "tv" || category === "anime" ? episode : undefined,
          showResume: true,
        },
      });
      return { success: true, message: "Content progress updated" };
    }
  } catch (error) {
    return { success: false, message: "Failed to update content progress" };
  }
}

// GET PROFILE CONTENT PROGRESS
export async function getProfileContentProgress(
  tmdb_id: number,
  category: string,
  season?: number,
  episode?: number
): Promise<any | null> {
  try {
    const profile_id = await getCurrentProfile();

    // VALIDATE IF PROFILE EXISTS
    const profile = await prisma.profile.findUnique({
      where: { id: profile_id },
    });
    if (!profile) {
      return null;
    }

    // VALIDATE IF CONTENT EXISTS
    const content = await prisma.content.findFirst({
      where: { tmdb_id, category },
    });
    if (!content) {
      return null;
    }

    // FIND IF PROFILE CONTENT EXISTS
    const profileContent = await prisma.profileContent.findFirst({
      where: {
        profile_id,
        content_id: content.id,
        season: category === "tv" || category === "anime" ? season : undefined,
        episode:
          category === "tv" || category === "anime" ? episode : undefined,
      },
    });
    if (profileContent) {
      return {
        id: profileContent.id,
        content_id: content.id,
        profile_id,
        season: profileContent.season,
        episode: profileContent.episode,
        watchProgress: Number(profileContent.watchProgress),
        created_at: profileContent.created_at,
        updated_at: profileContent.updated_at,
      };
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

// GET PROFILE HISTORY
export async function getProfileHistory(): Promise<any[] | null> {
  try {
    const profile_id = await getCurrentProfile();
    const user_id = await getUserFromAuth();

    const profile = await prisma.profile.findUnique({
      where: {
        id: profile_id,
      },
    });

    if (!profile) {
      return null;
    }
    if (profile.user_id !== user_id) {
      return null;
    }

    const profileHistory = await prisma.profileContent.findMany({
      where: {
        profile_id,
        showResume: true,
        watchProgress: {
          gt: 0,
        },
      },
      distinct: ["content_id"],
      orderBy: {
        updated_at: "desc",
      },
      include: {
        content: {
          select: {
            id: true,
            tmdb_id: true,
            category: true,
          },
        },
      },
    });

    const history = await Promise.all(
      profileHistory.map(async (item) => {
        try {
          const content = await fetchTMDBContent(
            item.content.tmdb_id.toString(),
            item.content.category
          );
          if (!content) {
            return null; //
          }

          return {
            id: item.id,
            content_id: item.content_id,
            profile_id: item.profile_id,
            season: item.season,
            episode: item.episode,
            watchProgress: Number(item.watchProgress),
            duration: Number(item.duration),
            created_at: item.created_at,
            updated_at: item.updated_at,
            showResume: item.showResume,
            content: {
              id: item.content.id,
              tmdb_id: item.content.tmdb_id,
              category: item.content.category,
            },
            ...content,
          };
        } catch (error) {
          console.error(
            "Error fetching TMDB content:",
            item.content.tmdb_id,
            error
          );
          return null;
        }
      })
    );

    return history.filter((item) => item !== null);
  } catch (error) {
    return null;
  }
}

// HIDE RESUME WATCHING
export async function hideResumeWatching(
  id: string
): Promise<{ success: boolean; message: string }> {
  try {
    const profile_id = await getCurrentProfile();
    const user_id = await getUserFromAuth();

    const profile = await prisma.profile.findUnique({
      where: {
        id: profile_id,
      },
    });

    if (!profile) {
      return {
        success: false,
        message: `Profile not found: ${profile_id}`,
      };
    }
    if (profile.user_id !== user_id) {
      return {
        success: false,
        message: `Unauthorized: Profile does not belong to the user: ${profile_id}`,
      };
    }

    const updateResumeState = await prisma.profileContent.update({
      where: {
        id,
      },
      data: {
        showResume: false,
      },
    });

    if (!updateResumeState) {
      return {
        success: false,
        message: `Failed to update resume state: ${id}`,
      };
    } else {
      return { success: true, message: "Resume watching hidden" };
    }
  } catch (error) {
    return {
      success: false,
      message: `Failed to hide resume watching: ${error}`,
    };
  }
}

// GET PROFILE ACTIVITY
export async function getProfileActivity(): Promise<any | null> {
  try {
    const profile_id = await getCurrentProfile();
    const user_id = await getUserFromAuth();

    // FIND PROFILE
    const profile = await prisma.profile.findUnique({
      where: {
        id: profile_id,
      },
    });

    // VALIDATE PROFILE AND USER
    if (!profile) {
      return "Profile not found";
    }
    if (profile.user_id !== user_id) {
      return "Unauthorized: Profile does not belong to the user";
    }

    const profileActivity = await prisma.profileContent.findMany({
      where: {
        profile_id,
        watchProgress: {
          gt: 0,
        },
      },
      orderBy: {
        updated_at: "desc",
      },
      include: {
        content: {
          select: {
            id: true,
            tmdb_id: true,
            category: true,
          },
        },
      },
    });

    const activity = profileActivity.map((item) => ({
      id: item.id,
      content_id: item.content_id,
      profile_id: item.profile_id,
      season: item.season,
      episode: item.episode,
      watchProgress: Number(item.watchProgress),
      created_at: item.created_at,
      updated_at: item.updated_at,
      content: {
        id: item.content.id,
        tmdb_id: item.content.tmdb_id,
        category: item.content.category,
      },
    }));

    return activity;
  } catch (error) {
    return error;
  }
}

// LIKE OR DISLIKE CONTENT
export async function handleLikeOrDislike(
  tmdb_id: number,
  category: string,
  likeStatus: number
): Promise<{ success: boolean; message: string; likeStatus?: number }> {
  try {
    const profile_id = await getCurrentProfile();

    let content = await prisma.content.findFirst({
      where: {
        tmdb_id,
        category,
      },
    });

    if (!content) {
      const createdContent = await prisma.content.create({
        data: {
          tmdb_id,
          category,
        },
      });
      content = createdContent;
    }

    const existingLike = await prisma.profileLike.findFirst({
      where: {
        content_id: content.id,
        profile_id,
      },
    });

    let newLikeStatus;
    if (!existingLike) {
      newLikeStatus = likeStatus;
    } else if (existingLike.likeStatus === likeStatus) {
      newLikeStatus = 0;
    } else {
      newLikeStatus = likeStatus;
    }

    if (!existingLike) {
      await prisma.profileLike.create({
        data: {
          content_id: content.id,
          profile_id,
          likeStatus: newLikeStatus,
        },
      });
    } else {
      await prisma.profileLike.update({
        where: {
          id: existingLike.id,
        },
        data: {
          likeStatus: newLikeStatus,
        },
      });
    }

    return {
      success: true,
      message: "Operation successful",
      likeStatus: newLikeStatus,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to update like status: " + error,
    };
  }
}

// Fetch TMDB CONTENT
async function fetchTMDBContent(
  tmdb_id: string,
  category: string
): Promise<any | null> {
  const baseUrl = "https://api.themoviedb.org/3/";
  try {
    let contentType;
    if (category === "movie") {
      contentType = "movie";
    } else if (category === "tv" || category === "anime") {
      contentType = "tv";
    } else {
      return null;
    }

    const response = await axios.get(`${baseUrl}${contentType}/${tmdb_id}`, {
      params: {
        api_key: process.env.TMDB_APIKEY,
        append_to_response: "credits",
        language: "en-US",
      },
    });

    return {
      landscapeUrl: response.data.backdrop_path
        ? `https://media.themoviedb.org/t/p/original${response.data.backdrop_path}`
        : null,
      posterUrl: response.data.poster_path
        ? `https://media.themoviedb.org/t/p/w780${response.data.poster_path}`
        : null,
      title: response.data.title || response.data.name,
      date: new Date(
        response.data.release_date || response.data.first_air_date
      ),
      rating: Math.round(response.data.vote_average * 10) / 10,
      description: response.data.overview,
      ContentStudio: response.data.production_companies.map((studio: any) => ({
        studio,
      })),
      ContentGenre: response.data.genres.map((genre: any) => ({ genre })),
      ContentActor: response.data.credits.cast
        .slice(0, 15)
        .map((actor: any) => ({
          name: actor.name,
          img: actor.profile_path
            ? `https://media.themoviedb.org/t/p/original${actor.profile_path}`
            : null,
        })),
      category,
    };
  } catch (error) {
    console.error("Error fetching TMDB content:", tmdb_id, error);
    return null;
  }
}
