import React, { useState } from "react";
import { useRouter } from "next/navigation";
import useMediaQuery from "~/hooks/useMediaQuery";
import { PlayIcon } from "@heroicons/react/24/outline";

type Props = {
  content: any;
  history?: boolean;
};

const SliderCard: React.FC<Props> = ({ content, history }) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const isAboveSmallTablet = useMediaQuery("(min-width: 650px)");
  const watchPercentage = history
    ? Math.floor((content.watchProgress / content.duration) * 100)
    : null;

  const handleNavigate = () => {
    if (content.category === "movie") {
      // HANDLE IF MOVIE
      router.push(`/movie/${content.tmdbid}`);
    }
    if (content.category === "tv") {
      // HANDLE IF TV
      router.push(`/tv/${content.tmdbid}`);
    }
    if (content.category === "anime") {
      router.push(`/anime/${content.tmdbid}`);
    }
  };

  console.log(content);

  const handleNavigateHistory = () => {
    if (content.category === "movie") {
      router.push(
        `/watch?tmdbid=${content.content.tmdb_id}&category=${content.category}`
      );
    } else {
      router.push(
        `/watch?tmdbid=${content.content.tmdb_id}&category=${content.category}&season=${content.season}&episode=${content.episode}`
      );
    }
  };

  return (
    <div
      className="flex w-full h-full pr-4"
      onMouseEnter={() => (isAboveSmallTablet ? setIsHovered(true) : null)}
      onMouseLeave={() => (isAboveSmallTablet ? setIsHovered(false) : null)}
    >
      <div
        className="h-full w-max relative rounded-sm cursor-pointer"
        onClick={history ? handleNavigateHistory : handleNavigate}
      >
        <img
          src={content?.posterUrl}
          alt="Content Image"
          loading="lazy"
          className={`object-cover w-full h-full cursor-pointer rounded-sm transition-all duration-500 `}
          style={{
            userSelect: "none",
            pointerEvents: "none",
            background:
              "linear-gradient(180deg, rgb(143, 143, 143, 0.1), rgb(176, 176, 176, 0.1))",
          }}
        />

        {history && (
          <>
            <PlayIcon
              strokeWidth={0.8}
              height={isAboveSmallTablet ? 90 : 50}
              className={`absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 cursor-pointer m-0 rounded-full transition-all duration-300 border-2 fill-[rgba(240,240,240,0.8)]
                ${
                  isAboveSmallTablet ? "py-5 pl-5 pr-4" : "py-2.5 pl-2.5 pr-1.5"
                }
                 ${
                   !isHovered
                     ? "text-[rgba(240,240,240,0.8)] bg-transparent border-white"
                     : "text-[rgba(240,240,240,0.8)] bg-[rgba(124,38,212,0.8)] border-[rgba(124,38,212,0.8)]"
                 }`}
            />
            <div
              className={`absolute bottom-2.5 left-0 right-0 h-1.5 w-full px-3`}
            >
              <div className="h-full w-full rounded-md bg-[rgba(255,255,255,0.4)]">
                <div
                  className={`rounded-md bg-[#9231f5] h-full`}
                  style={{ width: watchPercentage + "%" }}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SliderCard;
