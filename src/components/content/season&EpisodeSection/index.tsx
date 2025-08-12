"use client";
import { useMemo } from "react";
import SeasonCard from "./seasonCard";
import EpisodeCard from "./episodeCard";
import { parseAsInteger, useQueryState } from "nuqs";
import { useSmoothHorizontalWheelScroll } from "~/hooks/use-smooth-h-scroll";

type Props = {
  content: any;
  isLoading: boolean;
};

const SeasonAndEpisodeSection: React.FC<Props> = ({ content, isLoading }) => {
  const seasons: any[] = Array.isArray(content?.seasons) ? content.seasons : [];

  const [selectedSeasonNumber, setSelectedSeasonNumber] = useQueryState(
    "season",
    parseAsInteger.withDefault(1)
  );

  const selectedSeasonObj = useMemo(() => {
    if (seasons.length === 0) return undefined;
    const idx = Number(selectedSeasonNumber - 1);
    return seasons[idx];
  }, [seasons, selectedSeasonNumber]);

  const episodesList = useMemo<any[]>(() => {
    const s = selectedSeasonObj as any;
    if (!s) return [];
    if (Array.isArray(s.season)) return s.season;
    if (Array.isArray(s.episodes)) return s.episodes;
    if (Array.isArray(s?.season?.episodes)) return s.season.episodes;
    return [];
  }, [selectedSeasonObj]);

  const handleChangeSeason = (seasonIndex: number) => {
    const num = Number(seasonIndex + 1);
    setSelectedSeasonNumber(num);
  };

  const scrollRef = useSmoothHorizontalWheelScroll<HTMLDivElement>();

  if (isLoading) return null;

  return (
    <div className="flex flex-col w-full h-max mt-6 gap-2">
      <div
        ref={scrollRef}
        className="w-max max-w-full flex overflow-x-auto gap-5 pb-4 overscroll-x-contain"
      >
        {seasons.map((season: any, index: number) => (
          <SeasonCard
            key={season?.season_number ?? index}
            season={season}
            selectedSeason={selectedSeasonObj.season}
            handleChangeSeason={handleChangeSeason}
            index={index}
          />
        ))}
      </div>

      <div className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(320px,1fr))] pb-4 items-stretch">
        {episodesList.map((episode: any, index: number) => (
          <EpisodeCard
            key={episode?.id ?? episode?.episodeNumber ?? index}
            selectedSeason={selectedSeasonObj.season}
            episode={episode}
            content={content}
          />
        ))}
      </div>
    </div>
  );
};

export default SeasonAndEpisodeSection;
