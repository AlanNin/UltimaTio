"use client";
import React from "react";
import useMediaQuery from "~/hooks/use-media-query";
import EpisodeBox from "./episode-box";

type Props = {
  content: any;
  tmdbid: number;
  anilistid: number;
  category: string;
  currentSeason: number;
  currentEpisode: number;
  profileContent: any;
};

const Episodes: React.FC<Props> = ({
  content,
  tmdbid,
  anilistid,
  category,
  currentSeason,
  currentEpisode,
  profileContent,
}) => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 869px)");

  const isAnime = category === "anime";

  const episodes = isAnime
    ? content?.episodes
    : content?.seasons?.[currentSeason - 1]?.season.episodes;

  return (
    <div
      className={`flex w-full gap-3 gap-x-4 ${
        isAboveMediumScreens ? "flex-wrap" : "mt-2 overflow-x-auto px-3 pb-4"
      }`}
    >
      {episodes?.map((episode: any, index: number) => (
        <EpisodeBox
          key={index}
          tmdbid={tmdbid!}
          anilistid={anilistid!}
          category={category}
          currentSeason={currentSeason}
          episode={episode.episodeNumber}
          currentEpisode={currentEpisode}
          profileContent={profileContent}
          airDate={episode.airDate}
        />
      ))}
    </div>
  );
};

export default Episodes;
