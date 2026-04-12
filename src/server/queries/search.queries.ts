"use server";
import axios from "axios";

const TMDB_BASE_URL = "https://api.themoviedb.org/3/";
const ANILIST_BASE_URL = "https://graphql.anilist.co";
const ANIME_GENRE_ID = 16;
const ANIME_COUNTRY = "JP";

const tmdb = axios.create({
  baseURL: TMDB_BASE_URL,
  params: { api_key: process.env.TMDB_APIKEY, language: "en-US" },
});

export async function searchAniList(query: string): Promise<any[]> {
  const gqlQuery = `
    query ($search: String) {
      Page(page: 1, perPage: 40) {
        media(search: $search, type: ANIME, isAdult: false) {
          id
          title { romaji english native }
          coverImage { extraLarge large }
          bannerImage
          averageScore
          description(asHtml: false)
          genres
          format
          isAdult
        }
      }
    }
  `;

  try {
    const response = await axios.post(ANILIST_BASE_URL, {
      query: gqlQuery,
      variables: { search: query },
    });

    const media: any[] = response.data?.data?.Page?.media ?? [];

    return media
      .filter((item) => !item.isAdult)
      .map((item) => ({
        landscapeUrl: item.bannerImage ?? null,
        posterUrl:
          item.coverImage?.extraLarge ?? item.coverImage?.large ?? null,
        title: item.title.english ?? item.title.romaji ?? item.title.native,
        anilistid: item.id,
        rating: item.averageScore ? Math.round(item.averageScore) / 10 : null,
        description: item.description ?? null,
        category: "anime",
        source: "anilist",
      }));
  } catch (error) {
    console.error("Error fetching AniList data:", error);
    return [];
  }
}

export async function searchTMDB(query: string): Promise<any[]> {
  try {
    const [page1, page2] = await Promise.all([
      tmdb
        .get("search/multi", { params: { query, page: 1 } })
        .then((r) => r.data.results as any[]),
      tmdb
        .get("search/multi", { params: { query, page: 2 } })
        .then((r) => r.data.results as any[]),
    ]);

    const results = [...page1, ...page2].filter((item) => {
      if (item.media_type === "person") return false;

      const hasAnimeGenre =
        Array.isArray(item.genre_ids) &&
        item.genre_ids.includes(ANIME_GENRE_ID);

      const isAnime =
        item.media_type === "tv"
          ? Array.isArray(item.origin_country) &&
            item.origin_country.includes(ANIME_COUNTRY) &&
            hasAnimeGenre
          : item.original_language === "ja" && hasAnimeGenre;

      return !isAnime;
    });

    return results.map((item) => ({
      landscapeUrl: item.backdrop_path
        ? `https://media.themoviedb.org/t/p/original${item.backdrop_path}`
        : null,
      posterUrl: item.poster_path
        ? `https://media.themoviedb.org/t/p/w780${item.poster_path}`
        : null,
      title: item.title ?? item.name ?? null,
      tmdbid: item.id,
      rating: Math.round((item.vote_average ?? 0) * 10) / 10,
      description: item.overview ?? null,
      category: item.media_type as "movie" | "tv",
      source: "tmdb",
    }));
  } catch (error) {
    console.error("Error fetching TMDB search data:", error);
    return [];
  }
}

function scoreRelevance(title: string | null, query: string): number {
  if (!title) return 0;
  const t = title.toLowerCase();
  const q = query.toLowerCase();
  if (t === q) return 100;
  if (t.startsWith(q)) return 80;
  if (t.includes(q)) return 60;
  const words = q.split(/\s+/).filter(Boolean);
  const matched = words.filter((w) => t.includes(w));
  return matched.length ? Math.round((matched.length / words.length) * 40) : 0;
}

export async function search(query: string): Promise<any[]> {
  const [tmdbResults, anilistResults] = await Promise.all([
    searchTMDB(query),
    searchAniList(query),
  ]);

  return [...tmdbResults, ...anilistResults].sort(
    (a, b) => scoreRelevance(b.title, query) - scoreRelevance(a.title, query),
  );
}
