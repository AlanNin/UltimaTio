import React from "react";
import useMediaQuery from "~/hooks/use-media-query";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Props = {
  similarContent: any;
};

const SimilarCard: React.FC<Props> = ({ similarContent }) => {
  const isAboveSmallScreens = useMediaQuery("(min-width: 480px)");

  const posterUrl =
    !similarContent.poster_path ||
    similarContent.poster_path.includes("2Fw780null") ||
    similarContent.poster_path.includes("bestv2null")
      ? "null"
      : "https://media.themoviedb.org/t/p/w780" + similarContent.poster_path;

  const router = useRouter();

  if (posterUrl === "null") {
    return null;
  }

  const handleNavigate = () => {
    if (similarContent.category === "movie") {
      // HANDLE IF MOVIE
      router.push(`/movie/${similarContent.id}`);
    }
    if (similarContent.category === "tv") {
      // HANDLE IF TV
      router.push(`/tv/${similarContent.id}`);
    }
    if (similarContent.category === "anime") {
      router.push(`/anime/${similarContent.id}`);
    }
  };

  return (
    <div
      className="relative cursor-pointer h-max w-max"
      onClick={handleNavigate}
    >
      <Image
        alt="Poster"
        src={posterUrl}
        className={`${
          isAboveSmallScreens ? "w-[208.5px] h-auto" : "w-[90px] h-auto"
        } h-auto bg-cover`}
        width={isAboveSmallScreens ? 208.5 : 90}
        height={isAboveSmallScreens ? 208.5 : 90}
        style={{
          background:
            "linear-gradient(180deg, rgb(143, 143, 143, 0.1), rgb(176, 176, 176, 0.1))",
        }}
      />
    </div>
  );
};

export default SimilarCard;
