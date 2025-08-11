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

const MoviesProfileImages = [
  "https://i.pinimg.com/564x/e5/4c/1c/e54c1cabc44ba4765a6c546592bcfb3d.jpg",
  "https://i.pinimg.com/564x/2e/07/91/2e07912e865b810dbef7a21d23412200.jpg",
  "https://i.pinimg.com/564x/44/6b/5e/446b5ea1fe7f74ba30dbe808b85606a7.jpg",
  "https://i.pinimg.com/564x/fa/72/b6/fa72b6742c3dce2ffa55be12feab12d1.jpg",
  "https://i.pinimg.com/564x/2b/a1/e2/2ba1e244631c0f5568a9479d20884792.jpg",
  "https://i.pinimg.com/564x/8a/f6/6f/8af66f6078b057e693eae18aee633210.jpg",
  "https://i.pinimg.com/564x/00/30/8d/00308d733c40fc742a86c31ad4303570.jpg",
  "https://i.pinimg.com/564x/d5/1b/0f/d51b0fbf46344506bfb8c0d2c8434a67.jpg",
];

const TVShowsProfileImages = [
  "https://i.pinimg.com/564x/d5/31/7d/d5317d8b6d2a66c5d20555663ad7e411.jpg",
  "https://i.pinimg.com/564x/58/8e/0e/588e0e6b67116e43fa21064efc58d084.jpg",
  "https://i.pinimg.com/564x/77/04/be/7704be8b2bd6c8eb868d96b4039c3eb6.jpg",
  "https://i.pinimg.com/564x/c2/5a/e4/c25ae4d3f7858e110b39a321aa0ad6bb.jpg",
  "https://i.pinimg.com/564x/82/c7/01/82c7013be0f27b8b25effea94f481ad9.jpg",
];

const AnimeProfileImages = [
  "https://i.pinimg.com/564x/e3/99/3e/e3993e452c225b5809c9304ff9b525e3.jpg",
  "https://i.pinimg.com/736x/81/36/8d/81368dc5ddc862148b55d7bbecdeb363.jpg",
  "https://i.pinimg.com/564x/47/66/fb/4766fbaa4a132ce1d9c2f9b99a7c8dbd.jpg",
];

const CartoonProfileImages = [
  "https://i.pinimg.com/564x/9a/2a/b2/9a2ab298cd3d50454991ec5008ba04ae.jpg",
];

const KShowsProfileImages = [
  "https://i.pinimg.com/564x/57/3b/0e/573b0e504975225f204ceba8b8d2e58b.jpg",
];

const AllProfileImages = [
  ...MoviesProfileImages,
  ...TVShowsProfileImages,
  ...AnimeProfileImages,
  ...CartoonProfileImages,
  ...KShowsProfileImages,
];

export const getRandomProfilePicture = () => {
  const randomIndex = Math.floor(Math.random() * AllProfileImages.length);
  return AllProfileImages[randomIndex];
};

export const getAllProfilePictures = () => {
  return {
    MoviesProfileImages,
    TVShowsProfileImages,
    AnimeProfileImages,
    CartoonProfileImages,
    KShowsProfileImages,
    AllProfileImages,
  };
};
