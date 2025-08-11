"use client";
import React from "react";
import useMediaQuery from "~/hooks/use-media-query";
import EpisodeBox from "./episode-box";

type Props = {
  content: any;
  tmdbid: number;
  category: string;
  currentSeason: number;
  currentEpisode: number;
  saveProfileProgress: any;
  profileContent: any;
};

const Episodes: React.FC<Props> = ({
  content,
  tmdbid,
  category,
  currentSeason,
  currentEpisode,
  saveProfileProgress,
  profileContent,
}) => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 869px)");

  return (
    <div
      className={`w-full flex gap-3 gap-x-4 ${
        isAboveMediumScreens ? "flex-wrap" : "overflow-x-auto pb-4 px-3 mt-2"
      }`}
    >
      {content?.seasons?.[currentSeason - 1]?.season.episodes?.map(
        (episode: any, index: number) => (
          <EpisodeBox
            key={index}
            tmdbid={tmdbid!}
            category={category}
            currentSeason={currentSeason}
            episode={episode.episodeNumber}
            currentEpisode={currentEpisode}
            saveProfileProgress={saveProfileProgress}
            profileContent={profileContent}
          />
        )
      )}
    </div>
  );
};

export default Episodes;
