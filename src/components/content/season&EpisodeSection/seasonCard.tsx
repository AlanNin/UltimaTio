"use client";
import React from "react";
import useMediaQuery from "~/hooks/use-media-query";

type Props = {
  season: any;
  selectedSeason: any;
  handleChangeSeason: any;
  index: any;
};

const SeasonCard: React.FC<Props> = ({
  season,
  selectedSeason,
  handleChangeSeason,
  index,
}) => {
  if (season.season.episode_count === 0) {
    return null;
  }

  const isAboveSmallScreens = useMediaQuery("(min-width: 480px)");
  return (
    <div
      className={`relative cursor-pointer h-max w-max py-1 px-2 rounded-md ${
        selectedSeason.name === season.season.name
          ? "bg-[rgba(181,181,181,0.3)]"
          : isAboveSmallScreens
          ? "hover:bg-[rgba(181,181,181,0.1)]"
          : ""
      }`}
      onClick={() => handleChangeSeason(index)}
    >
      <h1 className="whitespace-nowrap"> {season.season.name} </h1>
    </div>
  );
};

export default SeasonCard;
