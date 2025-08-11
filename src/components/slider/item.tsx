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
    return `/${content.category}/${content.tmdbid || content.content.tmdb_id}`;
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
      className="flex w-full h-full pr-4"
      onMouseEnter={() => (isAboveSmallTablet ? setIsHovered(true) : null)}
      onMouseLeave={() => (isAboveSmallTablet ? setIsHovered(false) : null)}
    >
      <div className="h-full w-max relative rounded-sm flex flex-col">
        <div className="h-full w-full relative rounded-sm">
          <Link href={handleGetNavigateHref()}>
            <img
              src={content?.posterUrl}
              alt="Content Image"
              loading="lazy"
              className={`object-cover w-full h-full cursor-pointer rounded-md transition-all duration-500`}
              style={{
                userSelect: "none",
                background:
                  "linear-gradient(180deg, rgb(143, 143, 143, 0.1), rgb(176, 176, 176, 0.1))",
              }}
            />
          </Link>

          {watchHistory && (
            <>
              {isAboveMediumScreens && (
                <>
                  <XMarkIcon
                    className={cn(
                      "absolute top-2.5 right-2.5 p-1 w-6 h-6 cursor-pointer  text-white bg-[rgba(0,0,0,0.6)] hover:bg-red-500/60 rounded-full transition-all duration-300",
                      isHovered ? "opacity-100" : "opacity-0"
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
                        "absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 cursor-pointer m-0 rounded-full transition-all duration-300 border-2 fill-[rgba(240,240,240,0.8)] hover:bg-[rgba(124,38,212,0.8)] hover:border-[rgba(124,38,212,0.8)]",
                        isAboveSmallTablet
                          ? "py-5 pl-5 pr-4"
                          : "py-2.5 pl-2.5 pr-1.5",
                        isHovered ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </Link>
                </>
              )}
              <Link
                href={handleGetNavigateHref()}
                className={`absolute bottom-2.5 left-0 right-0 h-1.5 w-full px-3 cursor-pointer`}
              >
                <div className="h-full w-full rounded-md bg-[rgba(255,255,255,0.4)]">
                  <div
                    className={`rounded-md bg-[#9231f5] h-full`}
                    style={{ width: watchPercentage + "%" }}
                  />
                </div>
              </Link>
            </>
          )}
          {isMobileMenuOpen && !isAboveMediumScreens && (
            <div className="w-full h-full absolute bottom-0 left-0 right-0 mx-auto bg-[rgba(18,18,18)] p-2 text-center flex flex-col items-center justify-center gap-2.5">
              <Link
                href={handleGetWatchHref()}
                className="w-full text-xs font-normal bg-[rgba(255,255,255,0.07)] py-1.5 rounded-md flex px-1 gap-2 items-center justify-center"
              >
                <PlayIcon strokeWidth={2} className="w-3 h-3" />
                Resume
              </Link>
              <span
                className="w-full text-xs font-normal bg-[rgba(255,255,255,0.07)] py-1.5 rounded-md flex px-1 gap-2 items-center justify-center"
                onClick={() => handleRemoveResumeWatching(content.id)}
              >
                <BackspaceIcon strokeWidth={2} className="w-3 h-3" />
                Remove
              </span>
              <Link
                href={handleGetNavigateHref()}
                className="w-full text-xs font-normal bg-[rgba(255,255,255,0.07)] py-1.5 rounded-md flex px-1 gap-2 items-center justify-center"
              >
                <Bars3BottomLeftIcon strokeWidth={2} className="w-3 h-3" />
                Details
              </Link>
            </div>
          )}
        </div>
        {!isAboveMediumScreens && watchHistory && (
          <div className="relative h-max w-full bg-[rgba(255,255,255,0.05)] rounded-b-md p-1">
            <EllipsisHorizontalIcon
              strokeWidth={1.8}
              className="w-4 h-4 text-white ml-auto"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SliderCard;
