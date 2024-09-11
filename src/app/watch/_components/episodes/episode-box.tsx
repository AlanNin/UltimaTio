"use client";
import { useRouter } from "next/navigation";
import React from "react";
import useMediaQuery from "~/hooks/useMediaQuery";

type Props = {
  tmdbid: number;
  category: string;
  currentSeason: number;
  episode: number;
  currentEpisode: number;
  saveProfileProgress: any;
  profileContent: any;
};

const EpisodeBox: React.FC<Props> = ({
  tmdbid,
  category,
  currentSeason,
  episode,
  currentEpisode,
  saveProfileProgress,
  profileContent,
}) => {
  const router = useRouter();
  const isAboveMediumScreens = useMediaQuery("(min-width: 869px)");

  const watchedEpisodes =
    profileContent?.filter((pc: any) => {
      const watchProgress = parseFloat(pc.watchProgress || "0");
      const duration = parseFloat(pc.duration || "0");
      const season = parseInt(pc.season);
      return (
        season === currentSeason &&
        watchProgress > 0 &&
        duration > 0 &&
        watchProgress / duration > 0.9
      );
    }) || [];

  const isCurrentEpisodeWatched = watchedEpisodes.some(
    (pc: any) =>
      parseInt(pc.episode) === episode && parseInt(pc.season) === currentSeason
  );

  return (
    <div
      className={`cursor-pointer min-w-12 w-14 text-center font-light text-[14px] border border-[rgba(255,255,255,0.1)] transition-colors duration-200 ${
        episode === currentEpisode &&
        "bg-[rgba(71,12,130,0.6)] hover:bg-[rgba(71,12,130,0.6)]"
      }
      ${isAboveMediumScreens && "hover:bg-[rgba(181,181,181,0.1)]"}
      ${isCurrentEpisodeWatched && "bg-[rgba(213,95,222,0.14)]"}
      `}
      onClick={() => {
        saveProfileProgress(() => {
          router.push(
            `/watch?tmdbid=${tmdbid}&category=${category}&season=${currentSeason}&episode=${episode}`
          );
        });
      }}
    >
      {episode}
    </div>
  );
};

export default EpisodeBox;
