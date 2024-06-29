import React from "react";
import useMediaQuery from "~/hooks/useMediaQuery";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Props = {
  similarContent: any;
};

const SimilarCard: React.FC<Props> = ({ similarContent }) => {
  const isAboveSmallScreens = useMediaQuery("(min-width: 480px)");

  const landscapeUrl =
    "https://media.themoviedb.org/t/p/original" + similarContent.backdrop_path;

  const posterUrl =
    !similarContent.poster_path ||
    similarContent.poster_path.includes("2Fw780null") ||
    similarContent.poster_path.includes("bestv2null")
      ? "null"
      : "https://media.themoviedb.org/t/p/w780" + similarContent.poster_path;

  const title = similarContent.original_title;
  const tmdbid = similarContent.id;

  const router = useRouter();

  if (posterUrl === "null") {
    return null;
  }

  return (
    <div className="relative cursor-pointer h-max w-max">
      <Image
        alt="Poster"
        src={posterUrl}
        className={`${
          isAboveSmallScreens ? "w-[208.5px] h-auto" : "w-[90px] h-auto"
        } h-auto bg-cover`}
        width={isAboveSmallScreens ? 208.5 : 90}
        height={isAboveSmallScreens ? 208.5 : 90}
      />
    </div>
  );
};

export default SimilarCard;
