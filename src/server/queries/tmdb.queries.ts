"use server";
import axios from "axios";
import { unstable_cache } from "next/cache";
import pLimit from "p-limit";

const BASE_URL = "https://api.themoviedb.org/3/";
const ANIME_GENRE_ID = 16;
const ANIME_COUNTRY = "JP";
const EXCLUDED_TV_GENRES = new Set([
  "news",
  "talk",
  "documentary",
  "soap",
  "reality",
]);

const tmdb = axios.create({
  baseURL: BASE_URL,
  params: { api_key: process.env.TMDB_APIKEY, language: "en-US" },
});

const img = (
  path: string | null | undefined,
  size: "original" | "w780" = "original",
) => (path ? `https://media.themoviedb.org/t/p/${size}${path}` : null);

const movieRuntime = (data: any): number | null =>
  typeof data?.runtime === "number" ? data.runtime * 60 : null;

const tvRuntime = (data: any): number | null => {
  const minutes =
    data?.episode_run_time?.[0] ??
    data?.last_episode_to_air?.runtime ??
    data?.next_episode_to_air?.runtime ??
    null;
  return typeof minutes === "number" ? minutes * 60 : null;
};

const mapStudios = (companies: any[]) =>
  (companies ?? []).map((s) => ({
    studio: { id: s.id, name: s.name, originCountry: s.origin_country },
  }));

const mapGenres = (genres: any[]) =>
  (genres ?? []).map((g) => ({
    genre: {
      id: g.id,
      name: g.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  }));

const mapCast = (cast: any[]) =>
  (cast ?? []).slice(0, 15).map((a) => ({
    name: a.name,
    img: img(a.profile_path),
  }));

function mapMovie(item: any, detail: any): any | null {
  const description = detail?.overview || item?.overview || "";
  if (!description.trim()) return null;

  return {
    landscapeUrl: img(item.backdrop_path),
    posterUrl: img(item.poster_path, "w780"),
    title: detail.title,
    tmdbid: item.id,
    date: detail.release_date ? new Date(detail.release_date) : null,
    duration: movieRuntime(detail),
    rating: Math.round((item.vote_average ?? 0) * 10) / 10,
    description,
    ContentStudio: mapStudios(detail.production_companies),
    ContentGenre: mapGenres(detail.genres),
    ContentActor: mapCast(detail.credits?.cast),
    category: "movie" as const,
  };
}

function mapTV(item: any, detail: any): any | null {
  const genres: any[] = detail.genres ?? [];
  if (!genres.length) return null;

  const hasExcluded = genres.some((g) =>
    EXCLUDED_TV_GENRES.has((g.name ?? "").toLowerCase()),
  );
  if (hasExcluded) return null;

  const description = detail?.overview || item?.overview || "";
  if (!description.trim()) return null;

  const genreIds: number[] = item.genre_ids ?? genres.map((g: any) => g.id);

  const isAnime =
    Array.isArray(item.origin_country) &&
    item.origin_country.includes(ANIME_COUNTRY) &&
    genreIds.includes(ANIME_GENRE_ID);

  return {
    landscapeUrl: img(item.backdrop_path),
    posterUrl: img(item.poster_path, "w780"),
    title: detail.name,
    tmdbid: item.id,
    date: detail.first_air_date ? new Date(detail.first_air_date) : null,
    duration: tvRuntime(detail),
    rating: Math.round((item.vote_average ?? 0) * 10) / 10,
    description,
    ContentStudio: mapStudios(detail.production_companies),
    ContentGenre: mapGenres(genres),
    ContentActor: mapCast(detail.credits?.cast),
    category: (isAnime ? "anime" : "tv") as "anime" | "tv",
  };
}

type MediaType = "movie" | "tv";

function resolveType(item: any, fallback: MediaType): MediaType {
  if (item.media_type === "movie" || item.title) return "movie";
  if (item.media_type === "tv" || item.name) return "tv";
  return fallback;
}

async function enrichOne(item: any, type: MediaType): Promise<any | null> {
  try {
    const { data } = await tmdb.get(`${type}/${item.id}`, {
      params: { append_to_response: "credits" },
    });
    return type === "movie" ? mapMovie(item, data) : mapTV(item, data);
  } catch {
    return null;
  }
}

async function enrichAll(
  items: any[],
  fallbackType: MediaType,
  limiter: ReturnType<typeof pLimit>,
): Promise<any[]> {
  const results = await Promise.all(
    items.map((item) => {
      if (item.media_type === "person") return Promise.resolve(null);
      const type = resolveType(item, fallbackType);
      return limiter(() => enrichOne(item, type));
    }),
  );
  return results.filter(Boolean);
}

function interleave<T>(arr: T[]): T[] {
  const half = Math.ceil(arr.length / 2);
  const result: T[] = [];
  for (let i = 0; i < half; i++) {
    const a = arr[i];
    const b = arr[i + half];
    if (a !== undefined) result.push(a);
    if (b !== undefined) result.push(b);
  }
  return result;
}

async function fetchHomeFeed() {
  const [
    trendingRaw,
    popularMoviesRaw,
    popularTVRaw,
    topRatedMoviesRaw,
    topRatedTVRaw,
    upcomingRaw,
  ] = await Promise.all([
    tmdb.get("trending/all/week").then((r) => r.data.results as any[]),
    tmdb.get("movie/popular").then((r) => r.data.results as any[]),
    tmdb.get("tv/popular").then((r) => r.data.results as any[]),
    tmdb.get("movie/top_rated").then((r) => r.data.results as any[]),
    tmdb.get("tv/top_rated").then((r) => r.data.results as any[]),
    tmdb.get("movie/upcoming").then((r) => r.data.results as any[]),
  ]);

  const limiter = pLimit(15);

  const trendingList = trendingRaw
    .filter((i) => i.media_type !== "person")
    .slice(0, 16);

  const popularList = [
    ...popularMoviesRaw.slice(0, 8),
    ...popularTVRaw.slice(0, 8),
  ];
  const topRatedList = [
    ...topRatedMoviesRaw.slice(0, 8),
    ...topRatedTVRaw.slice(0, 8),
  ];
  const upcomingList = upcomingRaw.slice(0, 10);

  const [trending, popular, topRated, upcoming] = await Promise.all([
    enrichAll(trendingList, "movie", limiter),
    enrichAll(popularList, "movie", limiter),
    enrichAll(topRatedList, "movie", limiter),
    enrichAll(upcomingList, "movie", limiter),
  ]);

  return {
    trending: interleave(trending),
    popular: interleave(popular),
    topRated: interleave(topRated),
    upcoming,
  };
}

export const getHomeFeed = unstable_cache(fetchHomeFeed, ["tmdb-home-feed"], {
  revalidate: 60 * 60,
});
