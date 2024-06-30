import React, { useState } from "react";
import TMDBIcon from "~/assets/TMDB.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useMediaQuery from "~/hooks/useMediaQuery";

type Props = {
  content: any;
};

const SearchCard: React.FC<Props> = ({ content }) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const isAboveSmallTablet = useMediaQuery("(min-width: 650px)");

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

  const posterUrl =
    !content.posterUrl ||
    content.posterUrl.includes("2Fw780null") ||
    content.posterUrl.includes("bestv2null")
      ? "null"
      : "https://media.themoviedb.org/t/p/w780" + content.posterUrl;

  if (posterUrl === "null") {
    return null;
  }

  return (
    <div
      className="flex w-max h-max"
      onMouseEnter={() => (isAboveSmallTablet ? setIsHovered(true) : null)}
      onMouseLeave={() => (isAboveSmallTablet ? setIsHovered(false) : null)}
    >
      <div
        className="h-full w-max overflow-hidden relative rounded-sm cursor-pointer"
        onClick={handleNavigate}
      >
        <img
          src={posterUrl}
          alt="Content Image"
          loading="lazy"
          className={`object-cover cursor-pointer rounded-sm transition-all duration-500
            ${isAboveSmallTablet ? "w-[200px] h-[295px]" : "w-[95px] h-[147px]"}
             ${
               isHovered
                 ? "scale-125 brightness-[0.25]"
                 : "scale-100 brightness-100"
             }`}
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
      </div>
    </div>
  );
};

export default SearchCard;
