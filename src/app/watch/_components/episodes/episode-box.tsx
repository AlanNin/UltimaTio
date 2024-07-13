"use client";
import Link from "next/link";
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
};

const EpisodeBox: React.FC<Props> = ({
  tmdbid,
  category,
  currentSeason,
  episode,
  currentEpisode,
  saveProfileProgress,
}) => {
  const router = useRouter();
  const isAboveMediumScreens = useMediaQuery("(min-width: 869px)");
  return (
    <div
      className={`cursor-pointer min-w-12 w-14 text-center font-light text-[14px] border border-[rgba(255,255,255,0.1)] transition-colors duration-200 ${
        episode === currentEpisode &&
        "bg-[rgba(71,12,130,0.6)] hover:bg-[rgba(71,12,130,0.6)]"
      }
      ${isAboveMediumScreens && "hover:bg-[rgba(181,181,181,0.1)]"}
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
