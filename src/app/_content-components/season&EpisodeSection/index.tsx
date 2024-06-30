"use client";
import useMediaQuery from "~/hooks/useMediaQuery";
import { useEffect, useState } from "react";
import SeasonCard from "./seasonCard";
import EpisodeCard from "./episodeCard";

type Props = {
  content: any;
  isLoading: boolean;
};

const SeasonAndEpisodeSection: React.FC<Props> = ({ content, isLoading }) => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 900px)");
  const [seasons, setSeasons] = useState<any[]>([]);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [selectedSeason, setSelectedSeason] = useState(
    content?.seasons[0].season
  );
  const handleChangeSeason = (season: any) => {
    setSelectedSeason(content?.seasons[season].season);
  };

  useEffect(() => {
    setSeasons(content?.seasons);
  }, [content?.id]);

  useEffect(() => {
    setEpisodes(selectedSeason?.episodes);
  }, [selectedSeason]);

  if (isLoading) {
    return;
  }

  return (
    <>
      <div className="flex flex-col w-full h-max mt-6 gap-2">
        <div className="flex overflow-x-auto gap-5 pb-4">
          {seasons?.map((season: any, index: number) => (
            <SeasonCard
              key={index}
              season={season}
              selectedSeason={selectedSeason}
              handleChangeSeason={handleChangeSeason}
              index={index}
            />
          ))}
        </div>
        <div
          className={`flex gap-6 pb-4 items-center justify-center ${
            isAboveMediumScreens ? "flex-wrap" : "overflow-x-auto"
          }`}
        >
          {episodes?.map((episode: any, index: number) => (
            <EpisodeCard
              key={index}
              selectedSeason={selectedSeason}
              episode={episode}
              content={content}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default SeasonAndEpisodeSection;
