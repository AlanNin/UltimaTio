"use client";
import Link from "next/link";
import React from "react";
import { env } from "~/env";
import useMediaQuery from "~/hooks/use-media-query";
import { cn } from "~/utils/cn";

type Props = {
  content: any;
  season?: any;
  episode?: any;
};

const Info: React.FC<Props> = ({ content, season, episode }) => {
  const showingProviders =
    env.NEXT_PUBLIC_SHOW_PROVIDERS === "true" ? true : false;
  const isAboveMediumScreens = useMediaQuery("(min-width: 869px)");
  const poster = content.posterUrl;
  const title = content.title;
  const category = content.category;

  const sNum = Number(season);
  const eNum = Number(episode);

  const seasonObj =
    content.seasons?.find(
      (s: any) =>
        (s.season?.season_number ?? s.season_number ?? s.number) === sNum,
    ) ?? content.seasons?.[sNum - 1];

  const episodeObj =
    seasonObj?.season?.episodes?.find(
      (ep: any) => (ep.episode_number ?? ep.number) === eNum,
    ) ?? seasonObj?.season?.episodes?.[eNum - 1];

  const description =
    content.category === "movie"
      ? (content.description ?? "")
      : (episodeObj?.overview ??
        seasonObj?.season?.overview ??
        content.description ??
        null);

  const rating =
    content.category === "movie"
      ? (content.rating ?? null)
      : (episodeObj?.rating ?? seasonObj?.season?.rating ?? null);

  const handleGetContentHref = () => {
    return `/${content.category}/${content.tmdbid}`;
  };

  return (
    <div
      className={cn(
        "flex w-full flex-wrap gap-6",
        !isAboveMediumScreens && "justify-center px-4",
        !showingProviders ? "mt-8" : "mt-2",
      )}
    >
      <Link href={handleGetContentHref()}>
        <img
          src={poster}
          alt="Poster"
          className="h-auto w-[180px] cursor-pointer object-cover"
        />
      </Link>
      <div
        className={`flex max-w-[650px] flex-col gap-2 ${
          !isAboveMediumScreens && "text-center"
        }`}
      >
        <Link
          href={handleGetContentHref()}
          className={`w-fit cursor-pointer text-lg font-normal ${
            !isAboveMediumScreens && "self-center"
          }`}
        >
          {title}
        </Link>
        <div
          className={`mb-2 flex items-center gap-2 ${
            !isAboveMediumScreens && "self-center"
          }`}
        >
          <p className="bg-[rgba(71,12,130)] px-2 py-0.5 text-xs font-light capitalize text-white">
            {category === "tv" ? "TV" : category}
          </p>
          {(category === "tv" || category === "anime") && (
            <>
              <div className="flex items-center gap-1 bg-[rgba(173,173,173,0.2)] px-2 py-0.5">
                <p className="text-xs font-light capitalize text-white">
                  Season {season}
                </p>
              </div>
              <div className="flex items-center gap-1 bg-[rgba(173,173,173,0.2)] px-2 py-0.5">
                <p className="text-xs font-light capitalize text-white">
                  Episode {episode}
                </p>
              </div>
            </>
          )}
        </div>
        <p
          className={`text-sm font-light text-[#c2c0c0] ${
            isAboveMediumScreens && "max-h-[100px] overflow-y-auto"
          }`}
        >
          {description && description.length > 0
            ? description
            : "Description is not available"}
        </p>
        <div
          className={`mt-4 flex items-center gap-2 ${
            !isAboveMediumScreens && "mb-2 flex-col items-center"
          }`}
        >
          <span className="text-xs font-light text-[#adadad]"> Rating: </span>
          <span className="text-xs font-light text-[#cfcfcf]">
            {rating ? `${rating} on TMDB` : "No rating available"}
          </span>
        </div>
        <div
          className={`mt-2 flex w-full flex-wrap gap-2 ${
            !isAboveMediumScreens && "mb-2 flex-col items-center"
          }`}
        >
          <span className="text-xs font-light text-[#adadad]"> Genres: </span>
          <div
            className={`flex flex-wrap items-center gap-2 ${
              !isAboveMediumScreens && "justify-center "
            }`}
          >
            {content?.ContentGenre?.map((genre: any, _index: number) => (
              <span
                key={genre.genre.id}
                className="h-fit w-fit cursor-pointer text-nowrap rounded-xl bg-[rgba(191,191,191,0.15)] px-2 py-0 text-xs font-light"
              >
                {genre &&
                  genre.genre.name.charAt(0).toUpperCase() +
                    genre.genre.name?.slice(1)}
              </span>
            ))}
          </div>
        </div>
        <div
          className={`mt-2 flex w-full flex-wrap gap-2 ${
            !isAboveMediumScreens && "flex-col items-center"
          }`}
        >
          <span className="text-xs font-light text-[#adadad]"> Studios: </span>
          <div
            className={`flex flex-wrap items-center gap-2 ${
              !isAboveMediumScreens && "justify-center "
            }`}
          >
            {content?.ContentStudio?.map((studio: any, _index: number) => (
              <span
                key={studio.studio.id}
                className="h-fit w-fit cursor-pointer text-nowrap rounded-xl bg-[rgba(191,191,191,0.15)] px-2 py-0 text-xs font-light"
              >
                {studio &&
                  studio.studio.name.charAt(0).toUpperCase() +
                    studio.studio.name?.slice(1)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;
