import React, { useState } from "react";
import useMediaQuery from "~/hooks/use-media-query";
import {
  BackspaceIcon,
  Bars3BottomLeftIcon,
  EllipsisHorizontalIcon,
  PlayIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { cn } from "~/utils/cn";
import Link from "next/link";

type Props = {
  content: any;
  watchHistory?: boolean;
  handleRemoveResumeWatching: (id: string) => void;
};

const SliderCard: React.FC<Props> = ({
  content,
  watchHistory,
  handleRemoveResumeWatching,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAboveSmallTablet = useMediaQuery("(min-width: 650px)");
  const isAboveMediumScreens = useMediaQuery("(min-width: 900px)");
  const watchPercentage = watchHistory
    ? Math.floor((content.watchProgress / content.duration) * 100)
    : null;

  const handleGetNavigateHref = () => {
    return `/${content.category}/${content.tmdbid || content.content?.tmdb_id || content.anilistid}`;
  };

  const handleGetWatchHref = () => {
    if (content.category === "movie") {
      return `/watch?tmdbid=${
        content.tmdbid || content.content.tmdb_id
      }&category=${content.category}`;
    } else {
      return `/watch?tmdbid=${
        content.tmdbid || content.content.tmdb_id
      }&category=${content.category}&season=${content.season}&episode=${
        content.episode
      }`;
    }
  };

  return (
    <div
      className="flex h-full w-full pr-4"
      onMouseEnter={() => (isAboveSmallTablet ? setIsHovered(true) : null)}
      onMouseLeave={() => (isAboveSmallTablet ? setIsHovered(false) : null)}
    >
      <div className="relative flex h-full w-max flex-col rounded-sm">
        <div className="relative h-full w-full rounded-sm">
          <Link
            href={handleGetNavigateHref()}
            className="flex h-full flex-col gap-y-2.5"
          >
            <img
              src={content?.posterUrl}
              alt="Content Image"
              loading="lazy"
              className={`h-full w-full cursor-pointer rounded-md object-cover transition-all duration-500`}
              style={{
                userSelect: "none",
                background:
                  "linear-gradient(180deg, rgb(143, 143, 143, 0.1), rgb(176, 176, 176, 0.1))",
              }}
            />
            <span className="line-clamp-1 w-full text-sm font-medium">
              {content?.title}
            </span>
          </Link>

          {watchHistory && (
            <>
              {isAboveMediumScreens && (
                <>
                  <XMarkIcon
                    className={cn(
                      "absolute right-2.5 top-2.5 h-6 w-6 cursor-pointer rounded-full bg-[rgba(0,0,0,0.6)] p-1 text-white transition-all duration-300 hover:bg-red-500/60",
                      isHovered ? "opacity-100" : "opacity-0",
                    )}
                    strokeWidth={2}
                    onClick={() =>
                      isAboveSmallTablet &&
                      handleRemoveResumeWatching(content.id)
                    }
                  />
                  <Link href={handleGetWatchHref()}>
                    <PlayIcon
                      strokeWidth={0.8}
                      height={75}
                      className={cn(
                        "absolute left-1/2 top-1/2 m-0 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full border-2 fill-[rgba(240,240,240,0.8)] transition-all duration-300 hover:border-[rgba(124,38,212,0.8)] hover:bg-[rgba(124,38,212,0.8)]",
                        isAboveSmallTablet
                          ? "py-5 pl-5 pr-4"
                          : "py-2.5 pl-2.5 pr-1.5",
                        isHovered ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </Link>
                </>
              )}
              <Link
                href={handleGetNavigateHref()}
                className={`absolute left-0 right-0 top-[85%] h-1.5 w-full cursor-pointer px-3`}
              >
                <div className="h-full w-full rounded-md bg-[rgba(255,255,255,0.4)]">
                  <div
                    className={`h-full rounded-md bg-[#9231f5]`}
                    style={{ width: watchPercentage + "%" }}
                  />
                </div>
              </Link>
            </>
          )}
          {isMobileMenuOpen && !isAboveMediumScreens && (
            <div className="absolute bottom-0 left-0 right-0 mx-auto flex h-full w-full flex-col items-center justify-center gap-2.5 bg-[rgba(18,18,18)] p-2 text-center">
              <Link
                href={handleGetWatchHref()}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-[rgba(255,255,255,0.07)] px-1 py-1.5 text-xs font-normal"
              >
                <PlayIcon strokeWidth={2} className="h-3 w-3" />
                Resume
              </Link>
              <span
                className="flex w-full items-center justify-center gap-2 rounded-md bg-[rgba(255,255,255,0.07)] px-1 py-1.5 text-xs font-normal"
                onClick={() => handleRemoveResumeWatching(content.id)}
              >
                <BackspaceIcon strokeWidth={2} className="h-3 w-3" />
                Remove
              </span>
              <Link
                href={handleGetNavigateHref()}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-[rgba(255,255,255,0.07)] px-1 py-1.5 text-xs font-normal"
              >
                <Bars3BottomLeftIcon strokeWidth={2} className="h-3 w-3" />
                Details
              </Link>
            </div>
          )}
        </div>
        {!isAboveMediumScreens && watchHistory && (
          <div className="relative h-max w-full rounded-b-md bg-[rgba(255,255,255,0.05)] p-1">
            <EllipsisHorizontalIcon
              strokeWidth={1.8}
              className="ml-auto h-4 w-4 text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SliderCard;
