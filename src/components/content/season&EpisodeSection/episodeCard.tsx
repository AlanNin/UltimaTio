"use client";
import React from "react";
import Link from "next/link";
import { PlayIcon } from "lucide-react";

type Props = {
  selectedSeason?: any;
  episode: any;
  content: any;
};

const EpisodeCard: React.FC<Props> = ({ episode, selectedSeason, content }) => {
  const handleGetWatchHref = () => {
    const isAnime = content.category === "anime";
    const seasonNumber = selectedSeason?.season_number;
    const episodeNumber = episode.episodeNumber;
    const seasonParam = seasonNumber ? `&season=${seasonNumber}` : "";
    if (isAnime) {
      return `/watch?anilistid=${content.anilistid}&category=${content.category}${seasonParam}&episode=${episodeNumber}`;
    } else {
      return `/watch?tmdbid=${content.tmdbid}&category=${content.category}${seasonParam}&episode=${episodeNumber}`;
    }
  };

  if (new Date(episode.airDate) > new Date()) {
    return null;
  }

  const watchPercentage = episode?.watchProgress
    ? Math.floor((episode?.watchProgress / episode?.episodeDuration) * 100)
    : 0;

  return (
    <Link
      href={handleGetWatchHref()}
      className="relative flex h-auto w-full cursor-pointer items-center gap-x-3 overflow-hidden rounded-md bg-[rgba(181,181,181,0.1)] p-4 transition-colors duration-300 hover:bg-[rgba(181,181,181,0.2)]"
    >
      {watchPercentage > 0 && (
        <div
          className="absolute inset-0 z-0 h-full bg-gradient-to-r from-[rgba(135,15,73,0.4)] to-[rgba(124,38,212,0.4)]"
          style={{ width: watchPercentage + "%" }}
        />
      )}
      <PlayIcon className="z-10 size-4 shrink-0 fill-white/50 text-white/50" />
      <span className="z-10 truncate text-sm font-normal">
        <span className="font-bold">Ep. {episode.episodeNumber}:</span>{" "}
        {episode.title ?? "No title available"}
      </span>
    </Link>
  );
};

export default EpisodeCard;
