"use server";
import axios from "axios";
import { getCurrentProfile } from "../authMiddleware";
import prisma from "~/server/prisma-client";
import pLimit from "p-limit";

const ANILIST_URL = "https://graphql.anilist.co";

async function gql<T = any>(
  query: string,
  variables: Record<string, any> = {},
): Promise<T> {
  const response = await axios.post(ANILIST_URL, { query, variables });
  return response.data.data;
}

const MEDIA_CARD_FIELDS = `
  id
  title { romaji english native }
  coverImage { extraLarge large }
  bannerImage
  averageScore
  description(asHtml: false)
  genres
  format
  status
  episodes
  duration
  startDate { year month day }
  studios(isMain: true) { nodes { id name } }
`;

function mapCard(item: any) {
  return {
    landscapeUrl: item.bannerImage ?? null,
    posterUrl: item.coverImage?.extraLarge ?? item.coverImage?.large ?? null,
    title:
      item.title?.english ?? item.title?.romaji ?? item.title?.native ?? null,
    anilistid: item.id,
    rating: item.averageScore ? Math.round(item.averageScore) / 10 : null,
    description: item.description ?? null,
    date: item.startDate?.year
      ? new Date(
          `${item.startDate.year}-${item.startDate.month ?? 1}-${item.startDate.day ?? 1}`,
        )
      : null,
    duration: item.duration ? item.duration * 60 : null,
    episodes: item.episodes ?? null,
    genres: item.genres ?? [],
    format: item.format ?? null,
    status: item.status ?? null,
    ContentStudio: (item.studios?.nodes ?? []).map((s: any) => ({
      studio: { id: s.id, name: s.name },
    })),
    ContentGenre: (item.genres ?? []).map((name: string, idx: number) => ({
      genre: {
        id: idx,
        name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    })),
    category: "anime" as const,
  };
}

type FeedSort =
  | "TRENDING_DESC"
  | "POPULARITY_DESC"
  | "SCORE_DESC"
  | "START_DATE_DESC";

async function fetchAnimeFeed(
  sort: FeedSort,
  status?: "RELEASING" | "FINISHED",
  perPage = 30,
): Promise<any[]> {
  const withStatusQuery = `
      query ($sort: [MediaSort], $status: MediaStatus, $perPage: Int) {
        Page(page: 1, perPage: $perPage) {
          media(type: ANIME, isAdult: false, sort: $sort, status: $status) {
            ${MEDIA_CARD_FIELDS}
          }
        }
      }
    `;

  const withoutStatusQuery = `
      query ($sort: [MediaSort], $perPage: Int) {
        Page(page: 1, perPage: $perPage) {
          media(type: ANIME, isAdult: false, sort: $sort) {
            ${MEDIA_CARD_FIELDS}
          }
        }
      }
    `;

  try {
    const data = status
      ? await gql(withStatusQuery, { sort: [sort], status, perPage })
      : await gql(withoutStatusQuery, { sort: [sort], perPage });
    return (data?.Page?.media ?? []).map(mapCard);
  } catch (error) {
    console.error(`Error fetching AniList feed [${sort}]:`, error);
    return [];
  }
}

export async function getFeedAnime(): Promise<any | { error: string }> {
  try {
    const [airingTodayAnime, onTheAirAnime, popularAnime, topRatedAnime] =
      await Promise.all([
        fetchAnimeFeed("TRENDING_DESC", "RELEASING", 20),
        fetchAnimeFeed("START_DATE_DESC", "RELEASING", 30),
        fetchAnimeFeed("POPULARITY_DESC", undefined, 30),
        fetchAnimeFeed("SCORE_DESC", undefined, 30),
      ]);

    return { airingTodayAnime, onTheAirAnime, popularAnime, topRatedAnime };
  } catch (error) {
    console.error("Error fetching anime feed:", error);
    return { error: "Error al obtener el feed de anime" };
  }
}

export async function getContentAnime(
  anilistid: number,
): Promise<any | { error: string }> {
  const ANIME_FORMATS = new Set([
    "TV",
    "TV_SHORT",
    "MOVIE",
    "SPECIAL",
    "OVA",
    "ONA",
    "MUSIC",
  ]);

  const query = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        id
        idMal
        title { romaji english native }
        coverImage { extraLarge large }
        bannerImage
        averageScore
        description(asHtml: false)
        genres
        format
        status
        episodes
        duration
        startDate { year month day }

        studios(isMain: true) { nodes { id name } }

        characters(sort: ROLE, perPage: 15) {
          edges {
            role
            node {
              name { full }
              image { large }
            }
          }
        }

        relations {
          edges {
            relationType
            node {
              id
              type
              title { romaji english }
              coverImage { extraLarge large }
              bannerImage
              averageScore
              format
              status
              episodes
              genres
              startDate { year month day }
              studios(isMain: true) { nodes { id name } }
            }
          }
        }

        recommendations(page: 1, perPage: 12) {
          nodes {
            mediaRecommendation {
              id
              title { romaji english }
              coverImage { extraLarge large }
              bannerImage
              averageScore
              format
              status
              episodes
              genres
              startDate { year month day }
              studios(isMain: true) { nodes { id name } }
            }
          }
        }
      }
    }
  `;

  try {
    const data = await gql(query, { id: anilistid });
    const content = data?.Media;
    if (!content) return { error: "Contenido no encontrado" };

    let profileContent = null;
    let likeStatus = null;

    try {
      const profile_id = await getCurrentProfile();
      if (profile_id !== null) {
        const contentDB = await prisma.content.findFirst({
          where: { anilist_id: content.id, category: "anime" },
          include: { profile_likes: true },
        });

        if (contentDB) {
          profileContent = await prisma.profileContent.findMany({
            where: { content_id: contentDB.id, profile_id },
            orderBy: { updated_at: "desc" },
            include: { content: true, profile: true },
          });

          const profileLike = await prisma.profileLike.findFirst({
            where: { profile_id, content_id: contentDB.id },
          });

          if (profileLike) likeStatus = profileLike.likeStatus;
        }
      }
    } catch {
      profileContent = null;
    }

    const ContentStudio = (content.studios?.nodes ?? []).map((s: any) => ({
      studio: { id: s.id, name: s.name },
    }));

    const ContentGenre = (content.genres ?? []).map(
      (name: string, idx: number) => ({
        genre: {
          id: idx,
          name,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }),
    );

    const ContentActor = (content.characters?.edges ?? []).map((e: any) => ({
      name: e.node?.name?.full ?? null,
      imgUrl: e.node?.image?.large ?? null,
    }));

    const durationSeconds = content.duration ? content.duration * 60 : 0;
    const totalEpisodes = content.episodes ?? 0;
    let episodes: any[] = [];

    if (content.idMal) {
      try {
        // Step 1 — fetch episode list pages (basic metadata: title, aired, score, filler)
        const pageCount = Math.ceil(totalEpisodes / 100) || 1;
        const pages = await Promise.all(
          Array.from({ length: pageCount }, (_, i) =>
            axios
              .get(`https://api.jikan.moe/v4/anime/${content.idMal}/episodes`, {
                params: { page: i + 1 },
              })
              .then((r) => r.data.data as any[])
              .catch(() => [] as any[]),
          ),
        );
        const listEpisodes: any[] = pages.flat();

        // Step 2 — fetch individual episode detail for poster + synopsis
        // Jikan rate limit: 3 req/s, 60 req/min — use p-limit(3) to stay safe
        const limit = pLimit(3);

        const detailedEpisodes = await Promise.all(
          listEpisodes.map((ep) =>
            limit(() =>
              axios
                .get(
                  `https://api.jikan.moe/v4/anime/${content.idMal}/episodes/${ep.mal_id}`,
                )
                .then((r) => r.data.data)
                .catch(() => null),
            ),
          ),
        );

        episodes = listEpisodes.map((ep: any, idx: number) => {
          const detail = detailedEpisodes[idx];
          const episodeNumber = ep.mal_id;
          let watchProgress = 0;
          let episodeDuration = durationSeconds;

          if (profileContent) {
            const match = profileContent.find(
              (pc: any) => pc.episode === episodeNumber && pc.season === 1,
            );
            if (match) {
              watchProgress = match.watchProgress.toNumber();
              episodeDuration = match.duration
                ? match.duration.toNumber()
                : durationSeconds;
            }
          }

          return {
            episodeNumber,
            episodePoster:
              detail?.images?.jpg?.image_url ??
              detail?.images?.webp?.image_url ??
              null,
            rating: ep.score ? Math.round(ep.score * 10) / 10 : null,
            title: ep.title ?? ep.title_romanji ?? `Episode ${episodeNumber}`,
            airDate: ep.aired ? new Date(ep.aired) : null,
            episodeDuration,
            watchProgress,
            overview: detail?.synopsis ?? null,
            filler: ep.filler ?? false,
            recap: ep.recap ?? false,
          };
        });
      } catch {
        episodes = Array.from({ length: totalEpisodes }, (_, i) => ({
          episodeNumber: i + 1,
          episodePoster: null,
          rating: null,
          title: `Episode ${i + 1}`,
          airDate: null,
          episodeDuration: durationSeconds,
          watchProgress: 0,
          overview: null,
          filler: false,
          recap: false,
        }));
      }
    }

    const SEASON_TYPES = new Set(["SEQUEL", "PREQUEL", "PARENT", "SIDE_STORY"]);
    const relationsEdges: any[] = content.relations?.edges ?? [];

    const seasons = relationsEdges
      .filter(
        (e) =>
          SEASON_TYPES.has(e.relationType) && ANIME_FORMATS.has(e.node.format),
      )
      .map((e) => ({
        season: {
          anilistid: e.node.id,
          title:
            e.node.title?.english ?? e.node.title?.romaji ?? "Unknown Season",
          coverImage:
            e.node.coverImage?.extraLarge ?? e.node.coverImage?.large ?? null,
          format: e.node.format ?? null,
          status: e.node.status ?? null,
          episodes: e.node.episodes ?? null,
          year: e.node.startDate?.year ?? null,
          relationType: e.relationType,
        },
      }));

    const seenIds = new Set<number>();

    const relatedCards = relationsEdges
      .filter(
        (e) =>
          !SEASON_TYPES.has(e.relationType) &&
          e.node &&
          ANIME_FORMATS.has(e.node.format),
      )
      .map((e) => mapCard(e.node));

    const recommendedCards = (content.recommendations?.nodes ?? [])
      .map((n: any) =>
        n.mediaRecommendation && ANIME_FORMATS.has(n.mediaRecommendation.format)
          ? mapCard(n.mediaRecommendation)
          : null,
      )
      .filter(Boolean);

    const similarContent = [...relatedCards, ...recommendedCards].filter(
      (item) => {
        if (!item || seenIds.has(item.anilistid)) return false;
        seenIds.add(item.anilistid);
        return true;
      },
    );

    return {
      landscapeUrl: content.bannerImage ?? null,
      posterUrl:
        content.coverImage?.extraLarge ?? content.coverImage?.large ?? null,
      title:
        content.title?.english ??
        content.title?.romaji ??
        content.title?.native,
      anilistid: content.id,
      date: content.startDate?.year
        ? new Date(
            `${content.startDate.year}-${content.startDate.month ?? 1}-${content.startDate.day ?? 1}`,
          )
        : null,
      duration: durationSeconds,
      rating: content.averageScore
        ? Math.round(content.averageScore) / 10
        : null,
      description: content.description ?? null,
      format: content.format ?? null,
      status: content.status ?? null,
      totalEpisodes,
      ContentStudio,
      ContentGenre,
      ContentActor,
      episodes,
      seasons,
      similarContent,
      category: "anime" as const,
      profileContent: profileContent ?? null,
      likeStatus: likeStatus ?? 0,
    };
  } catch (error) {
    console.error("Error fetching anime content:", error);
    return { error: "Error al obtener el contenido" };
  }
}
