"use client";
import React from "react";

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
  if (
    season.season.episode_count === 0 ||
    new Date(season.season.airDate) > new Date() ||
    season.season.air_date === null
  ) {
    return null;
  }

  return (
    <div
      className={`relative cursor-pointer h-max w-max py-1 px-2 rounded-md transition-colors duration-300 ${
        selectedSeason.name === season.season.name
          ? "bg-[rgba(181,181,181,0.3)]"
          : "hover:bg-[rgba(181,181,181,0.2)]"
      }`}
      onClick={() => handleChangeSeason(index)}
    >
      <h1 className="whitespace-nowrap"> {season.season.name} </h1>
    </div>
  );
};

export default SeasonCard;
