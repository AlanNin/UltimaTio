import React from "react";
import useMediaQuery from "~/hooks/use-media-query";
import { Reveal } from "~/utils/framer-motion/reveal";
import TMDBIcon from "~/assets/icons/tmdb.png";
import { PlayIcon } from "@heroicons/react/24/outline";
import { cn } from "~/utils/cn";
import Link from "next/link";

type Props = {
  content: any;
  isCurrent: boolean;
};

const CarouselCard: React.FC<Props> = ({ content, isCurrent }) => {
  const isAboveSmallTablet = useMediaQuery("(min-width: 650px)");
  const isAboveSemiMediumScreens = useMediaQuery("(min-width: 900px)");
  const isAboveMediumScreens = useMediaQuery("(min-width: 1180px)");
  const landscapeMobile = content.landscapeUrl.replace("original", "w780");

  const handleGetNavigateHref = () => {
    if (content.category === "movie") {
      return `/movie/${content.tmdbid}`;
    }
    if (content.category === "tv") {
      return `/tv/${content.tmdbid}`;
    }
    if (content.category === "anime") {
      return `/anime/${content.tmdbid}`;
    }
    return "";
  };

  const handleGetWatchHref = () => {
    if (content.category === "movie") {
      return `/watch?tmdbid=${content.tmdbid}&category=${content.category}`;
    } else {
      return `/watch?tmdbid=${content.tmdbid}&category=${content.category}&season=1&episode=1`;
    }
  };

  return (
    <div className="flex h-full max-h-[calc(100vh-175px)] w-full items-center justify-center overflow-hidden 2xl:max-h-[calc(100vh-250px)]">
      <div className="relative flex h-full w-full">
        <img
          src={isAboveSmallTablet ? content?.landscapeUrl : landscapeMobile}
          alt="Content Image"
          loading="lazy"
          className="h-full w-full object-cover object-[50%_20%]"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent via-50% to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0F0F0F] via-transparent via-25% to-transparent" />
        <div className="via-transparentvia-70% pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0F0F0F] to-transparent" />

        {isCurrent && (
          <>
            {isAboveMediumScreens ? (
              <>
                <div className="absolute inset-0 flex w-full items-center justify-center">
                  <div className="w-full max-w-[1920px] p-10">
                    <Reveal delay={0.25}>
                      <>
                        <div>
                          <p className="text-sm font-medium text-[#a7a7a7] 2xl:text-base">
                            {content?.ContentGenre.map(
                              (genre: any, index: number) => (
                                <span key={`desktop-genre-${genre.genre.id}`}>
                                  {index > 0 &&
                                  index < content.ContentGenre.length - 1
                                    ? ", "
                                    : ""}
                                  {index === content.ContentGenre.length - 1 &&
                                  index > 0
                                    ? " & "
                                    : ""}
                                  {genre.genre.name.charAt(0).toUpperCase() +
                                    genre.genre.name.slice(1)}
                                </span>
                              ),
                            )}
                          </p>
                          <div className="flex items-center gap-5">
                            <p className="max-w-[1150px] text-5xl text-white 2xl:text-6xl">
                              {content?.title}
                            </p>
                          </div>
                        </div>
                        <div className="mt-1 flex items-center gap-7">
                          <p className="text-sm font-normal text-[#c2c2c2] 2xl:text-base">
                            {content?.date &&
                              new Date(content.date).getFullYear()}
                          </p>

                          {content?.duration && (
                            <p className="text-sm font-normal text-[#c2c2c2] 2xl:text-base">
                              {content?.duration &&
                                formatDuration(content.duration)}
                            </p>
                          )}

                          <div className="flex items-center justify-center gap-1.5">
                            <img
                              alt="TMDB"
                              src={TMDBIcon.src}
                              className="h-6 w-6"
                            />
                            <p className="text-sm font-normal  text-[#c2c2c2] 2xl:text-base">
                              {content?.rating.toFixed(1)}{" "}
                            </p>
                          </div>
                        </div>

                        <div className="mb-10 mt-3">
                          <p className="line-clamp-3 max-w-[650px] font-normal text-[#c2c2c2] 2xl:text-lg">
                            {content.description.length > 0
                              ? content.description
                              : "No description available"}
                          </p>
                        </div>

                        <div className="flex gap-6">
                          <Link
                            href={handleGetWatchHref()}
                            className="flex w-max cursor-pointer items-center gap-3 rounded-2xl transition-colors duration-500"
                          >
                            <PlayIcon
                              className="size-[36px] rounded-full bg-[#a35fe8] fill-white py-2.5 pl-2.5 pr-2 text-white 2xl:size-[40px]"
                              strokeWidth={0.8}
                            />
                            <h1 className="text-xl text-[#ebebeb] 2xl:text-2xl">
                              {" "}
                              Watch Now
                            </h1>
                          </Link>
                          <Link
                            href={handleGetNavigateHref()}
                            className="flex w-max cursor-pointer items-center justify-center gap-3 rounded-lg bg-[rgba(131,74,189,0.4)] px-4 py-1 transition-colors duration-500"
                          >
                            <h1 className="text-base font-medium text-[#ebebeb] 2xl:text-lg">
                              More Info
                            </h1>
                          </Link>
                        </div>
                      </>
                    </Reveal>
                  </div>
                </div>
              </>
            ) : (
              <>
                {isAboveSmallTablet ? (
                  <div
                    className={cn(
                      "absolute bottom-[15px] flex flex-col px-4 py-10",
                      isAboveSemiMediumScreens && "px-10",
                    )}
                  >
                    <Reveal delay={0.25}>
                      <>
                        <div>
                          <p className="text-sm font-medium text-[#a7a7a7]">
                            {content?.ContentGenre.map(
                              (genre: any, index: number) => (
                                <span key={`tablet-genre-${genre.genre.id}`}>
                                  {index > 0 &&
                                  index < content.ContentGenre.length - 1
                                    ? ", "
                                    : ""}
                                  {index === content.ContentGenre.length - 1 &&
                                  index > 0
                                    ? " & "
                                    : ""}
                                  {genre.genre.name.charAt(0).toUpperCase() +
                                    genre.genre.name.slice(1)}
                                </span>
                              ),
                            )}
                          </p>
                          <div className="flex items-center gap-5">
                            <p className="text-3xl text-white">
                              {content?.title}
                            </p>
                          </div>
                        </div>
                        <div className="mt-1 flex items-center gap-7">
                          <p className="text-sm font-normal text-[#c2c2c2]">
                            {content?.date &&
                              new Date(content.date).getFullYear()}
                          </p>

                          {content?.duration && (
                            <p className="text-sm font-normal text-[#c2c2c2]">
                              {content?.duration &&
                                formatDuration(content.duration)}
                            </p>
                          )}

                          <div className="flex items-center justify-center gap-1.5">
                            <img
                              alt="TMDB"
                              src={TMDBIcon.src}
                              className="h-4 w-4"
                            />
                            <p className="text-sm font-medium text-[#c2c2c2]">
                              {content?.rating.toFixed(1)}{" "}
                            </p>
                          </div>
                        </div>

                        <div className="mb-10 mt-3">
                          <p className="text-md line-clamp-2 max-w-[550px] font-normal text-[#c2c2c2]">
                            {content.description.length > 0
                              ? content.description
                              : "No description available"}
                          </p>
                        </div>

                        <div className="flex gap-6">
                          <Link
                            href={handleGetWatchHref()}
                            className="flex w-max cursor-pointer items-center gap-3 rounded-2xl transition-colors duration-500"
                          >
                            <PlayIcon
                              className="h-[35px] w-[35px] rounded-full bg-[#a35fe8] fill-white py-2 pl-2 pr-1.5 text-white"
                              strokeWidth={0.8}
                            />
                            <h1 className="text-lg text-[#ebebeb]">
                              {" "}
                              Watch Now
                            </h1>
                          </Link>
                          <Link
                            href={handleGetNavigateHref()}
                            className="flex w-max cursor-pointer items-center justify-center gap-3 rounded-lg bg-[rgba(131,74,189,0.4)] px-3 py-0.5 transition-colors duration-500"
                          >
                            <h1 className="text-sm font-medium text-[#ebebeb]">
                              More Info
                            </h1>
                          </Link>
                        </div>
                      </>
                    </Reveal>
                  </div>
                ) : (
                  <>
                    <div className="bg-black-100 absolute bottom-0 flex flex-col p-4">
                      <Reveal delay={0.25}>
                        <>
                          <div>
                            <p className="text-xs font-medium text-[#bebebe]">
                              {content?.ContentGenre.map(
                                (genre: any, index: number) => (
                                  <span key={`mobile-genre-${genre.genre.id}`}>
                                    {index > 0 &&
                                    index < content.ContentGenre.length - 1
                                      ? ", "
                                      : ""}
                                    {index ===
                                      content.ContentGenre.length - 1 &&
                                    index > 0
                                      ? " & "
                                      : ""}
                                    {genre.genre.name.charAt(0).toUpperCase() +
                                      genre.genre.name.slice(1)}
                                  </span>
                                ),
                              )}
                            </p>
                            <div className="flex items-center gap-3">
                              <p
                                className={`text-3xl text-white ${
                                  content?.title.length > 10 &&
                                  "max-w-[305px] truncate text-xl"
                                }`}
                              >
                                {content?.title}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-5">
                            <p className="text-xs font-normal text-[#c2c2c2]">
                              {content?.date &&
                                new Date(content.date).getFullYear()}
                            </p>

                            {content?.duration && (
                              <p className="text-xs font-normal text-[#c2c2c2]">
                                {content?.duration &&
                                  formatDuration(content.duration)}
                              </p>
                            )}

                            <div className="flex items-center justify-center gap-1.5">
                              <img
                                alt="TMDB"
                                src={TMDBIcon.src}
                                className="h-4 w-4 object-cover"
                              />
                              <p className="text-xs font-normal text-[#d8d7d7]">
                                {content?.rating.toFixed(1)}{" "}
                              </p>
                            </div>
                          </div>
                          <div className="mt-4 flex items-center gap-4">
                            <Link
                              href={handleGetWatchHref()}
                              className="flex h-max w-max cursor-pointer items-center gap-2.5 rounded-2xl"
                            >
                              <PlayIcon
                                className="h-[24px] w-[24px] rounded-full bg-[#a35fe8] fill-white py-1.5 pl-1.5 pr-1 text-white"
                                strokeWidth={0.8}
                              />
                              <h1 className="text-sm text-[#ebebeb]">
                                Watch Now
                              </h1>
                            </Link>
                            <Link
                              href={handleGetNavigateHref()}
                              className="flex h-max w-max cursor-pointer items-center justify-center gap-3 rounded-lg bg-[rgba(131,74,189,0.4)] px-2.5 py-1.5"
                            >
                              <h1 className="text-xs font-medium text-[#ebebeb]">
                                More Info
                              </h1>
                            </Link>
                          </div>
                        </>
                      </Reveal>
                    </div>
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

export default CarouselCard;
