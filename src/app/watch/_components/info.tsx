"use client";
import { useRouter } from "next/navigation";
import React from "react";
import useMediaQuery from "~/hooks/useMediaQuery";

type Props = {
  content: any;
};

const Info: React.FC<Props> = ({ content }) => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 854px)");
  const title = content.title;
  const category = content.category;
  let validSeasons;
  let seasonsQuantity;
  if (category === "tv" || category === "anime") {
    validSeasons = content.seasons.filter(
      (season: any) =>
        season.season.air_date !== null && season.season.name !== "Specials"
    );
    seasonsQuantity = validSeasons.length;
  } else {
    validSeasons = null;
    seasonsQuantity = null;
  }

  const description = content.description;
  const rating = content.rating;

  const router = useRouter();

  const handleNavigateToContent = () => {
    router.push(`${content.category}/${content.tmdbid}`);
  };

  console.log(content);
  return (
    <div
      className={`w-full flex gap-6 mt-2 flex-wrap justify-center ${
        !isAboveMediumScreens && "px-4"
      }`}
    >
      <img
        src={content.posterUrl}
        alt="Poster"
        className="w-[180px] h-auto object-cover cursor-pointer"
        onClick={handleNavigateToContent}
      />
      <div
        className={`flex flex-col gap-2 max-w-[650px] ${
          !isAboveMediumScreens && "text-center"
        }`}
      >
        <h1
          className="font-normal text-lg cursor-pointer"
          onClick={handleNavigateToContent}
        >
          {title}
        </h1>
        <div
          className={`flex gap-2 items-center mb-2 ${
            !isAboveMediumScreens && "self-center"
          }`}
        >
          <p className="font-light text-xs text-white capitalize bg-[rgba(71,12,130)] py-0.5 px-2">
            {category === "tv" ? "TV" : category}
          </p>
          {(category === "tv" || category === "anime") && (
            <div className="flex gap-1 items-center bg-[rgba(173,173,173,0.2)] py-0.5 px-2">
              <p className="font-light text-xs text-white capitalize">
                {seasonsQuantity} {seasonsQuantity === 1 ? "Season" : "Seasons"}
              </p>
            </div>
          )}
        </div>
        <p
          className={`font-light text-sm text-[#c2c0c0] ${
            isAboveMediumScreens && "max-h-[100px] overflow-y-auto"
          }`}
        >
          {description}
        </p>
        <div
          className={`flex gap-2 items-center mt-4 ${
            !isAboveMediumScreens && "flex-col items-center mb-2"
          }`}
        >
          <span className="font-light text-xs text-[#adadad]"> Rating: </span>
          <span className="font-light text-xs text-[#cfcfcf]">
            {rating} on TMDB
          </span>
        </div>
        <div
          className={`flex gap-2 mt-2 w-full flex-wrap ${
            !isAboveMediumScreens && "flex-col items-center mb-2"
          }`}
        >
          <span className="font-light text-xs text-[#adadad]"> Genres: </span>
          <div className="flex gap-2 flex-wrap items-center justify-center">
            {content?.ContentGenre?.map((genre: any, _index: number) => (
              <span
                key={genre.id}
                className="bg-[rgba(191,191,191,0.15)] rounded-xl py-0 px-2 font-light text-xs cursor-pointer w-fit h-fit text-nowrap"
              >
                {genre &&
                  genre.genre.name.charAt(0).toUpperCase() +
                    genre.genre.name?.slice(1)}
              </span>
            ))}
          </div>
        </div>
        <div
          className={`flex gap-2 mt-2 w-full flex-wrap ${
            !isAboveMediumScreens && "flex-col items-center"
          }`}
        >
          <span className="font-light text-xs text-[#adadad]"> Studios: </span>
          <div className="flex gap-2 flex-wrap items-center justify-center">
            {content?.ContentStudio?.map((studio: any, _index: number) => (
              <span
                key={studio.id}
                className="bg-[rgba(191,191,191,0.15)] rounded-xl py-0 px-2 font-light text-xs cursor-pointer w-fit h-fit text-nowrap"
              >
                {studio &&
                  studio.studio.name.charAt(0).toUpperCase() +
                    studio.studio.name?.slice(1)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;
