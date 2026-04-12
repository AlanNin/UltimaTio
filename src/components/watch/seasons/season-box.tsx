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

  if (
    new Date(airDate) > new Date() ||
    season.air_date === null ||
    season.name?.toLowerCase().includes("special")
  ) {
    return null;
  }

  return (
    <Link
      href={handleGetHref()}
      className="relative flex h-16 w-32 min-w-32 cursor-pointer items-center justify-center overflow-clip border border-[rgba(255,255,255,0.1)] p-0 text-center text-[14px] font-light"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <img
        src={posterUrl}
        className={`absolute cursor-pointer bg-cover transition-all duration-500 ${
          !isCurrentSeason && !isHover && "blur-sm brightness-50 filter"
        }`}
      />
      <h1
        className={`z-10 cursor-pointer p-1 px-2 text-xs font-semibold transition-colors duration-300 ${
          isHover && "bg-[rgba(71,12,130)]"
        } ${isCurrentSeason && "bg-[rgba(71,12,130)]"}`}
      >
        {season.name}
      </h1>
    </Link>
  );
};

export default SeasonBox;
