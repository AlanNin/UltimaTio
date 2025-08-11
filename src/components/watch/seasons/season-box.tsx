"use client";
import Link from "next/link";
import React, { useState } from "react";

type Props = {
  tmdbid: number;
  category: string;
  currentSeason: number;
  season: any;
  airDate: string;
};

const SeasonBox: React.FC<Props> = ({
  tmdbid,
  category,
  currentSeason,
  season,
  airDate,
}) => {
  const posterUrl =
    "https://media.themoviedb.org/t/p/w780" + season.poster_path;
  const [isHover, setIsHover] = useState(false);
  const isCurrentSeason = season.season_number === currentSeason;
  const firstEpisodeSeason = season?.episodes[0]?.episodeNumber;

  function handleGetHref() {
    return `/watch?tmdbid=${tmdbid}&category=${category}&season=${season.season_number}&episode=${firstEpisodeSeason}`;
  }

  if (new Date(airDate) > new Date() || season.air_date === null) {
    return null;
  }

  return (
    <Link
      href={handleGetHref()}
      className="relative overflow-clip cursor-pointer min-w-32 w-32 h-16 p-0 flex justify-center items-center text-center font-light text-[14px] border border-[rgba(255,255,255,0.1)]"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <img
        src={posterUrl}
        className={`bg-cover cursor-pointer absolute transition-all duration-500 ${
          !isCurrentSeason && !isHover && "filter brightness-50 blur-sm"
        }`}
      />
      <h1
        className={`z-10 cursor-pointer text-xs font-semibold p-1 px-2 transition-colors duration-300 ${
          isHover && "bg-[rgba(71,12,130)]"
        } ${isCurrentSeason && "bg-[rgba(71,12,130)]"}`}
      >
        {season.name}
      </h1>
    </Link>
  );
};

export default SeasonBox;
