"use client";
import useMediaQuery from "~/hooks/use-media-query";
import ExternalPlayer from "./external-player";
import { Provider } from "../page";
import { cn } from "~/utils/cn";

type Props = {
  title: string;
  tmdbid: number;
  anilistid: number;
  category: "movie" | "tv" | "anime";
  season: number;
  episode: number;
  year: string;
  currentProvider: Provider;
  currentTimeRef: any;
  contentDurationRef: any;
  startAt: number;
};

const Player: React.FC<Props> = ({
  tmdbid,
  anilistid,
  category,
  season,
  episode,
  currentProvider,
  currentTimeRef,
  contentDurationRef,
  startAt,
}) => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 869px)");

  // manage current time
  const handleCurrentTimeUpdate = (time: any) => {
    currentTimeRef.current = time;
  };

  // manage duration
  const handleDurationUpdate = (duration: any) => {
    contentDurationRef.current = duration;
  };

  return (
    <div
      className={cn(
        "mb-2 aspect-video h-auto w-full",
        isAboveMediumScreens && "max-w-5xl rounded-md",
      )}
      style={{
        background:
          "linear-gradient(180deg, rgb(143, 143, 143, 0.1), rgb(176, 176, 176, 0.1))",
      }}
    >
      <ExternalPlayer
        src={determineSrc(
          tmdbid,
          anilistid,
          category,
          season,
          episode,
          currentProvider,
          startAt,
        )}
        provider={currentProvider}
        handleCurrentTimeUpdate={handleCurrentTimeUpdate}
        handleDurationUpdate={handleDurationUpdate}
      />
    </div>
  );
};

export default Player;

const determineSrc = (
  tmdbid: number,
  anilistid: number,
  category: "movie" | "tv" | "anime",
  season: number,
  episode: number,
  provider: Provider,
  startAt: number,
) => {
  let src = "";

  switch (category) {
    case "movie":
      if (provider === "VidEasy") {
        src = `https://player.videasy.net/movie/${tmdbid}?color=eefdec&overlay=true&progress=${startAt}`;
      }
      if (provider === "VidLink") {
        src = `https://vidlink.pro/movie/${tmdbid}?startAt=${startAt}&primaryColor=a35fe8&secondaryColor=a35fe8&iconColor=eefdec&icons=default&player=jw&title=true&poster=true&autoplay=false&nextbutton=false`;
      }
      if (provider === "VidCore") {
        src = `https://vidcore.net/movie/${tmdbid}?autoPlay=true&theme=a35fe8&startAt=${startAt}&sub=en&hideServer=true`;
      }
      break;
    case "tv":
      if (provider === "VidEasy") {
        src = `https://player.videasy.net/tv/${tmdbid}/${season}/${episode}?overlay=true&progress=${startAt}&color=eefdec&nextEpisode=false&episodeSelector=false`;
      }
      if (provider === "VidLink") {
        src = `https://vidlink.pro/tv/${tmdbid}/${season}/${episode}?startAt=${startAt}&primaryColor=a35fe8&secondaryColor=a35fe8&iconColor=eefdec&icons=default&player=jw&title=true&poster=true&autoplay=false&nextbutton=false`;
      }
      if (provider === "VidCore") {
        src = `https://vidcore.net/tv/${tmdbid}/${season}/${episode}?autoPlay=true&theme=a35fe8&startAt=${startAt}&sub=en&hideServer=true`;
      }
      break;
    case "anime":
      if (provider === "VidEasy") {
        src = `https://player.videasy.net/anime/${anilistid}${episode && `/${episode}`}?overlay=true&progress=${startAt}&color=eefdec&nextEpisode=false&episodeSelector=false&dub=false`;
      }
      break;
  }
  return src;
};
