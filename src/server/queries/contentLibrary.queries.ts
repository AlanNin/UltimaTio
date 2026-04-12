"use server";
import prisma from "../prisma-client";
import { getContentAnime } from "./anime/tmdb.queries";
import { getCurrentProfile } from "./authMiddleware";
import { getContentMovie } from "./movie/tmdb.queries";
import { getContentTV } from "./tv/tmdb.queries";

// GET LIBRARY FOR CONTENT
export async function getLibraryForContent(
  category: string,
  tmdb_id?: number,
  anilist_id?: number,
): Promise<any | null> {
  try {
    const profile_id = await getCurrentProfile();
    const profile = await prisma.profile.findUnique({
      where: { id: profile_id },
    });
    if (!profile) return null;

    const whereClause = anilist_id
      ? { anilist_id, category }
      : { tmdb_id, category };

    const content = await prisma.content.findFirst({ where: whereClause });
    if (!content) return null;

    return await prisma.library.findMany({
      where: {
        profile_id,
        library_content: { some: { content_id: content.id } },
      },
      include: {
        library_content: {
          where: { content_id: content.id },
          include: { content: true },
        },
      },
      orderBy: { updated_at: "desc" },
    });
  } catch {
    return { success: false, message: "Failed to get library" };
  }
}

// GET LIBRARY
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
              anilist_id: true,
              category: true,
            },
          },
        },
        orderBy: { updated_at: "desc" },
      },
    },
  });

  const result = await Promise.all(
    libraries.map(async (lib) => {
      const contentArray = await Promise.all(
        lib.library_content.map(async (lc) => {
          const { tmdb_id, anilist_id, category } = lc.content;

          let details: any = null;
          try {
            if (category === "anime" && anilist_id) {
              details = await getContentAnime(anilist_id);
            } else if (category === "movie" && tmdb_id) {
              details = await getContentMovie(tmdb_id);
            } else if (category === "tv" && tmdb_id) {
              details = await getContentTV(tmdb_id);
            }
          } catch (err) {
            console.error(
              `Error obteniendo detalles (${category} - ${tmdb_id ?? anilist_id}):`,
              err,
            );
          }

          return { tmdb_id, anilist_id, category, ...details };
        }),
      );

      return { id: lib.id, name: lib.name, content: contentArray };
    }),
  );

  return result;
}

// ADD OR REMOVE CONTENT FROM LIBRARY
export async function addOrRemoveContentFromLibrary(
  category: string,
  library_name: string,
  tmdb_id?: number,
  anilist_id?: number,
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

    const whereClause = anilist_id
      ? { anilist_id, category }
      : { tmdb_id, category };

    const createData = anilist_id
      ? { anilist_id, category }
      : { tmdb_id, category };

    let content = await prisma.content.findFirst({ where: whereClause });

    if (!content) {
      content = await prisma.content.create({ data: createData });
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
