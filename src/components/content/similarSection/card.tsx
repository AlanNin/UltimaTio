import React from "react";
import Link from "next/link";

type Props = {
  similarContent: any;
};

const SimilarCard: React.FC<Props> = ({ similarContent }) => {
  const posterUrl =
    !similarContent.poster_path ||
    similarContent.poster_path.includes("2Fw780null") ||
    similarContent.poster_path.includes("bestv2null")
      ? "null"
      : "https://media.themoviedb.org/t/p/w780" + similarContent.poster_path;

  if (posterUrl === "null") return null;

  const handleGetNavigateHref = () => {
    return `/${similarContent.category}/${similarContent.id}`;
  };

  return (
    <Link
      href={handleGetNavigateHref()}
      className="relative w-full aspect-[2/3]"
    >
      <img
        alt="Poster"
        src={posterUrl}
        className="absolute inset-0 w-full h-full object-cover rounded-md"
        style={{
          background:
            "linear-gradient(180deg, rgba(143,143,143,0.1), rgba(176,176,176,0.1))",
        }}
        loading="lazy"
        decoding="async"
        draggable={false}
      />
    </Link>
  );
};

export default SimilarCard;
