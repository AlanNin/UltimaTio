"use server";
import axios from "axios";

// SCRAP VIDEO EMBED FROM RABBIT STREAM
export async function scrapVideoEmbed(
  title: string,
  year: string,
  media_type: string,
  tmdb_id: string,
  episode?: string,
  season?: string
): Promise<{
  success: boolean;
  response: any;
}> {
  try {
    // GET RABBIT TOKEN
    const response_rabbit_token = await axios.get(
      `https://api.braflix.ru/upcloud/sources-with-title?title=${title}&year=${year}&mediaType=${media_type}&episodeId=${
        episode || "1"
      }&seasonId=${season || "1"}&tmdbId=${tmdb_id}`
    );

    // DEFINE RABBIT TOKEN
    const rabbit_token = response_rabbit_token.data.replace(/\s+/g, "");

    // DEFINE MY SCRAPPER URL
    const scrapper_url = `https://rabbit-stream-scrap.vercel.app`;

    // SCRAP RABBIT URL
    const response_scrapper = await axios.get(
      `${scrapper_url}/api/${rabbit_token}`
    );

    return {
      success: true,
      response: response_scrapper.data,
    };
  } catch (error) {
    return { success: false, response: error };
  }
}

// SCRAP VIDEO RABBIT EMBED TOKEN FROM RABBIT STREAM
export async function scrapRabbitTokenEmbed(
  title: string,
  year: string,
  media_type: string,
  tmdb_id: string,
  episode?: string,
  season?: string
): Promise<{
  success: boolean;
  response: any;
}> {
  try {
    // GET RABBIT TOKEN
    const response_rabbit_token = await axios.get(
      `https://api.braflix.ru/upcloud/sources-with-title?title=${title}&year=${year}&mediaType=${media_type}&episodeId=${
        episode || "1"
      }&seasonId=${season || "1"}&tmdbId=${tmdb_id}`
    );

    // DEFINE RABBIT TOKEN
    const rabbit_token = response_rabbit_token.data.replace(/\s+/g, "");

    return {
      success: true,
      response: rabbit_token,
    };
  } catch (error) {
    return { success: false, response: error };
  }
}
