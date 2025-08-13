"use server";
import prisma from "../prisma-client";
import { getContentAnime } from "./anime/tmdb.queries";
import { getCurrentProfile } from "./authMiddleware";
import { getContentMovie } from "./movie/tmdb.queries";
import { getContentTV } from "./tv/tmdb.queries";

// GET LIBRARY FOR CONTENT
export async function getLibraryForContent(
  tmdb_id: number,
  category: string
): Promise<any | null> {
  try {
    const profile_id = await getCurrentProfile();
    const profile = await prisma.profile.findUnique({
      where: { id: profile_id },
    });
    if (!profile) {
      return null;
    }

    let content = await prisma.content.findFirst({
      where: { tmdb_id, category },
    });
    if (!content) {
      return null;
    }

    const librariesWithContent = await prisma.library.findMany({
      where: {
        profile_id: profile_id,
        library_content: {
          some: {
            content_id: content.id,
          },
        },
      },
      include: {
        library_content: {
          where: {
            content_id: content.id,
          },
          include: {
            content: true,
          },
        },
      },
      orderBy: {
        updated_at: "desc",
      },
    });

    return librariesWithContent;
  } catch (error) {
    return { success: false, message: "Failed to get library" };
  }
}

// ADD OR REMOVE CONTENT FROM LIBRARY
export async function addOrRemoveContentFromLibrary(
  tmdb_id: number,
  category: string,
  library_name: string
): Promise<any | null> {
  try {
    const profile_id = await getCurrentProfile();
    const profile = await prisma.profile.findUnique({
      where: { id: profile_id },
    });
    if (!profile) {
      return null;
    }

    let library = await prisma.library.findFirst({
      where: { name: library_name, profile_id: profile_id },
    });
    if (!library) {
      library = await prisma.library.create({
        data: {
          name: library_name,
          profile_id: profile_id,
        },
      });
    }

    let content = await prisma.content.findFirst({
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

    const libraryContent = await prisma.libraryContent.findFirst({
      where: {
        library_id: library.id,
        content_id: content.id,
      },
    });

    if (libraryContent) {
      // REMOVE CONTENT FROM LIBRARY
      await prisma.libraryContent.delete({
        where: { id: libraryContent.id },
      });
      return { success: true, message: "Content removed from library" };
    } else {
      // ADD CONTENT TO LIBRARY
      await prisma.libraryContent.create({
        data: {
          library_id: library.id,
          content_id: content.id,
        },
      });
      return { success: true, message: "Content added to library" };
    }
  } catch (error) {
    return { success: false, message: "Failed to update library" };
  }
}

export async function getLibrary(): Promise<any[]> {
  const profile_id = await getCurrentProfile();

  const profile = await prisma.profile.findUnique({
    where: { id: profile_id },
  });

  if (!profile) return [];

  const libraries = await prisma.library.findMany({
    where: { profile_id },
    select: {
      id: true,
      name: true,
      library_content: {
        select: {
          updated_at: true,
          content: {
            select: {
              tmdb_id: true,
              category: true,
            },
          },
        },
        orderBy: { updated_at: "desc" },
      },
    },
  });

  const fetcherByCategory: Record<string, (tmdbId: number) => Promise<any>> = {
    tv: getContentTV,
    movie: getContentMovie,
    anime: getContentAnime,
  };

  const result = await Promise.all(
    libraries.map(async (lib) => {
      const contentArray = await Promise.all(
        lib.library_content.map(async (lc) => {
          const { tmdb_id, category } = lc.content;
          const fetcher = fetcherByCategory[category];

          let details: any = null;
          if (fetcher) {
            try {
              details = await fetcher(tmdb_id);
            } catch (err) {
              console.error(
                `Error obteniendo detalles (${category} - ${tmdb_id}):`,
                err
              );
            }
          }

          return {
            tmdb_id,
            category,
            ...details,
          };
        })
      );

      return {
        id: lib.id,
        name: lib.name,
        content: contentArray,
      };
    })
  );

  return result;
}
