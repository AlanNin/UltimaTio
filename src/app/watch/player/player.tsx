"use client";
import useMediaQuery from "~/hooks/use-media-query";
import ExternalPlayer from "./external-player";
import { Provider } from "../page";

type Props = {
  title: any;
  tmdbid: any;
  category: any;
  season: any;
  episode: any;
  year: any;
  currentProvider: any;
  currentTimeRef: any;
  contentDurationRef: any;
  startAt: number;
};

const Player: React.FC<Props> = ({
  tmdbid,
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
      className={`${
        isAboveMediumScreens
          ? "h-[480px] w-[854px] rounded-md"
          : "h-auto w-full"
      }`}
      style={{
        background:
          "linear-gradient(180deg, rgb(143, 143, 143, 0.1), rgb(176, 176, 176, 0.1))",
      }}
    >
      <ExternalPlayer
        src={determineSrc(
          tmdbid,
          category,
          season,
          episode,
          currentProvider,
          startAt,
        )}
        handleCurrentTimeUpdate={handleCurrentTimeUpdate}
        handleDurationUpdate={handleDurationUpdate}
      />
    </div>
  );
};

export default Player;

const determineSrc = (
  tmdbid: any,
  category: any,
  season: any,
  episode: any,
  provider: Provider,
  startAt: number,
) => {
  let src = "";

  switch (category) {
    case "movie":
      if (provider === "VidLink") {
        src = `https://vidlink.pro/movie/${tmdbid}?startAt=${startAt}&primaryColor=a35fe8&secondaryColor=a35fe8&iconColor=eefdec&icons=default&player=jw&title=true&poster=true&autoplay=false&nextbutton=false`;
      }
      if (provider === "VidSrcPro") {
        src = `https://vidsrc.xyz/embed/movie?tmdb=${tmdbid}&ds_lang=en`;
      }
      break;
    default:
      if (provider === "VidLink") {
        src = `https://vidlink.pro/tv/${tmdbid}/${season}/${episode}?startAt=${startAt}&primaryColor=a35fe8&secondaryColor=a35fe8&iconColor=eefdec&icons=default&player=jw&title=true&poster=true&autoplay=false&nextbutton=false`;
      }
      if (provider === "VidSrcPro") {
        src = `https://vidsrc.xyz/embed/tv?tmdb=${tmdbid}&season=${season}&episode=${episode}&ds_lang=en`;
      }
      break;
  }
  return src;
};
