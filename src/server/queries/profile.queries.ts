"use server";
import prisma from "../prisma-client";
import { getUserFromAuth } from "./authMiddleware";

// GET PROFILE
export async function getProfile(profile_id: any): Promise<any | null> {
  try {
    const user_id = await getUserFromAuth();

    // FIND PROFILE
    const profile = await prisma.profile.findUnique({
      where: {
        id: profile_id,
      },
      include: {
        profileSettings: true,
      },
    });

    // VALIDATE PROFILE AND USER
    if (!profile) {
      return "Profile not found";
    }
    if (profile.user_id !== user_id) {
      return "Unauthorized: Profile does not belong to the user";
    }

    return profile;
  } catch (error) {
    return error;
  }
}

// GET ALL PROFILE
export async function getUserProfiles(): Promise<any | null> {
  try {
    const user_id = await getUserFromAuth();

    // FIND ALL PROFILES BELONGING TO THE USER
    const profiles = await prisma.profile.findMany({
      where: {
        user_id,
      },
      orderBy: {
        created_at: "asc",
      },
      include: {
        profileSettings: true,
      },
    });

    // CHECK IF PROFILES EXIST
    if (profiles.length === 0) {
      return "No profiles found for the user";
    }

    return profiles;
  } catch (error) {
    return error;
  }
}

// CREATE PROFILE
export async function createProfile(
  name: any,
  imgUrl: any
): Promise<any | null> {
  try {
    const user_id = await getUserFromAuth();

    // VALIDATE IF USER EXISTS
    const user = await prisma.user.findUnique({
      where: { id: user_id },
    });
    if (!user) {
      return "User not found";
    }

    // CREATE PROFILE
    const profile = await prisma.profile.create({
      data: {
        name,
        imgUrl,
        user_id,
        library: {
          createMany: {
            data: [
              { name: "Following" },
              { name: "Plan To Watch" },
              { name: "On Hold" },
              { name: "Completed" },
            ],
          },
        },
      },
      include: {
        library: true,
      },
    });

    return profile;
  } catch (error) {
    return error;
  }
}

// DELETE PROFILE
export async function deleteProfile(
  profile_id: string
): Promise<{ ok: boolean; error?: string; message?: string }> {
  try {
    const user_id = await getUserFromAuth();

    // FIND PROFILE (only select what we need)
    const profile = await prisma.profile.findUnique({
      where: { id: profile_id },
      select: { user_id: true },
    });

    if (!profile) {
      return { ok: false, error: "Profile not found" };
    }
    if (profile.user_id !== user_id) {
      return {
        ok: false,
        error: "Unauthorized: Profile does not belong to this user",
      };
    }

    // DELETE SETTINGS + PROFILE atomically
    await prisma.$transaction(async (tx) => {
      await tx.library.deleteMany({ where: { profile_id } });
      await tx.profileSettings.deleteMany({ where: { profile_id } });
      await tx.profile.delete({ where: { id: profile_id } });
    });

    return { ok: true, message: "Profile deleted successfully" };
  } catch (err) {
    console.error(err);
    const msg = err instanceof Error ? err.message : "Unknown error";
    // Return a plain object (serializable)
    return { ok: false, error: msg };
  }
}

// UPDATE PROFILE
export async function updateProfile(
  profile_id: any,
  name?: any,
  imgUrl?: any,
  appLanguage?: any,
  contentLanguage?: any,
  subtitlesLanguage?: any,
  autoPlay?: any,
  contentQuality?: any
): Promise<any | null> {
  try {
    const user_id = await getUserFromAuth();

    // FIND PROFILE
    const profile = await prisma.profile.findUnique({
      where: {
        id: profile_id,
      },
      select: {
        user_id: true,
      },
    });

    // VALIDATE PROFILE AND USER
    if (!profile) {
      return "Profile not found";
    }
    if (profile.user_id !== user_id) {
      return "Unauthorized: Profile does not belong to this user";
    }

    // UPDATE PROFILE
    const updatedProfile = await prisma.profile.update({
      where: {
        id: profile_id,
      },
      data: {
        name,
        imgUrl,
        profileSettings: {
          upsert: {
            create: {
              app_language: appLanguage,
              content_language: contentLanguage,
              subtitles_language: subtitlesLanguage,
              auto_play: autoPlay,
              content_quality: contentQuality,
            },
            update: {
              app_language: appLanguage,
              content_language: contentLanguage,
              subtitles_language: subtitlesLanguage,
              auto_play: autoPlay,
              content_quality: contentQuality,
            },
          },
        },
      },
      include: {
        profileSettings: true,
      },
    });

    return updatedProfile;
  } catch (error) {
    return error;
  }
}
