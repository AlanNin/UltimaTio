import React, { useState } from "react";
import TMDBIcon from "~/assets/TMDB.png";
import Image from "next/image";

type Props = {
  content: any;
};

const SliderCard: React.FC<Props> = ({ content }) => {
  const [isHovered, setIsHovered] = useState(false);

  /*
  const handleNavigate = () => {
    if (content!.ContentCategory[0].category.name === "series") {
      navigate(`/tv/` + content!.id);
    } else if (content!.ContentCategory[0].category.name === "movie") {
      navigate(`/movies/${content!.id}`);
    } else {
      navigate(`/${content!.ContentCategory[0].category.name}/${content!.id}`);
    }
  };
*/

  const handleNavigate = () => {};

  return (
    <div
      className="flex w-full h-full pr-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="h-full w-max overflow-hidden relative rounded-sm cursor-pointer"
        onClick={handleNavigate}
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

export default SliderCard;
