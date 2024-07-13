"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type Props = {
  tmdbid: number;
  category: string;
  currentSeason: number;
  season: any;
  saveProfileProgress: any;
};

const SeasonBox: React.FC<Props> = ({
  tmdbid,
  category,
  currentSeason,
  season,
  saveProfileProgress,
}) => {
  const router = useRouter();
  const posterUrl =
    "https://media.themoviedb.org/t/p/w780" + season.poster_path;
  const [isHover, setIsHover] = useState(false);
  const isCurrentSeason = season.season_number === currentSeason;
  const firstEpisodeSeason = season?.episodes[0]?.episodeNumber;

  if (season.air_date === null) {
    return null;
  }

  return (
    <div
      className="relative overflow-clip cursor-pointer min-w-32 w-32 h-16 p-0 flex justify-center items-center text-center font-light text-[14px] border border-[rgba(255,255,255,0.1)]"
      onClick={() => {
        saveProfileProgress(() => {
          router.push(
            `/watch?tmdbid=${tmdbid}&category=${category}&season=${season.season_number}&episode=${firstEpisodeSeason}`
          );
        });
      }}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <img
        src={posterUrl}
        alt="Season Poster"
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
    </div>
  );
};

export default SeasonBox;
