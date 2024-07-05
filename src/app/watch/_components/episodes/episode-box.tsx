"use client";
import Link from "next/link";
import React from "react";
import useMediaQuery from "~/hooks/useMediaQuery";

type Props = {
  tmdbid: number;
  category: string;
  currentSeason: number;
  episode: number;
  currentEpisode: number;
};

const EpisodeBox: React.FC<Props> = ({
  tmdbid,
  category,
  currentSeason,
  episode,
  currentEpisode,
}) => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 854px)");
  return (
    <Link
      className={`!cursor-pointer min-w-12 w-14 text-center font-light text-[14px] border border-[rgba(255,255,255,0.1)] transition-colors duration-200 ${
        episode === currentEpisode &&
        "bg-[rgba(71,12,130,0.6)] hover:bg-[rgba(71,12,130,0.6)]"
      }
      ${isAboveMediumScreens && "hover:bg-[rgba(181,181,181,0.1)]"}
      `}
      href={`/watch?tmdbid=${tmdbid}&category=${category}&season=${currentSeason}&episode=${episode}`}
    >
      {episode}
    </Link>
  );
};

export default EpisodeBox;
