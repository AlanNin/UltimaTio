import React, { useState } from "react";
import TMDBIcon from "~/assets/TMDB.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useMediaQuery from "~/hooks/useMediaQuery";

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

  if (history) {
    console.log(watchPercentage);
  }
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

  const handleNavigateHistory = () => {
    if (content.category === "movie") {
      router.push(
        `/watch?tmdbid=${content.tmdbid}&category=${content.category}`
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
      // onMouseEnter={() => (isAboveSmallTablet ? setIsHovered(true) : null)}
      // onMouseLeave={() => (isAboveSmallTablet ? setIsHovered(false) : null)}
    >
      <div
        className="h-full w-max overflow-hidden relative rounded-sm cursor-pointer"
        onClick={history ? handleNavigateHistory : handleNavigate}
      >
        <img
          src={content?.posterUrl}
          alt="Content Image"
          loading="lazy"
          className={`object-cover w-full h-full cursor-pointer rounded-sm transition-all duration-500 ${
            isHovered
              ? "scale-125 brightness-[0.25]"
              : "scale-100 brightness-100"
          }`}
          style={{
            userSelect: "none",
            pointerEvents: "none",
            background:
              "linear-gradient(180deg, rgb(143, 143, 143, 0.1), rgb(176, 176, 176, 0.1))",
          }}
        />
        <div
          className={`absolute inset-0 flex flex-col text-center items-center justify-center transition-opacity duration-500 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <h1 className="text-white text-lg">{content?.title}</h1>
          <div className="flex items-center justify-center gap-1.5">
            <Image alt="TMDB" src={TMDBIcon} className="w-6 h-6 object-cover" />
            <p className="text-md text-[#d8d7d7] font-normal">
              {content?.rating.toFixed(1)}{" "}
            </p>
          </div>
        </div>
        {history && (
          <div className={`absolute bottom-2 left-0 right-0 h-1.5 w-full px-2`}>
            <div className="h-full w-full rounded-md bg-[rgba(255,255,255,0.35)]">
              <div
                className={`rounded-md bg-[#7c26d4] h-full`}
                style={{ width: watchPercentage + "%" }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SliderCard;
