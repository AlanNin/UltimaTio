"use client";
import { useEffect, useState } from "react";
import useMediaQuery from "~/hooks/use-media-query";
import ExternalPlayer from "./external-player";
import { useSelector } from "react-redux";
import {
  getProfileContentProgress,
  saveProfileContentProgress,
} from "~/server/queries/contentProfile.queries";

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
};

const Player: React.FC<Props> = ({
  tmdbid,
  category,
  season,
  episode,
  currentProvider,
  currentTimeRef,
  contentDurationRef,
}) => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 869px)");
  const { currentProfile } = useSelector((state: any) => state.profile);
  const [watchProgress, setWatchProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // FETCH PROFILE CONTENT PROGRESS
  useEffect(() => {
    setIsLoading(true);
    setWatchProgress(0);
    if (currentProfile === null) {
      setIsLoading(false);
      return;
    }

    const fetchProfileContentProgress = async () => {
      try {
        const response = await getProfileContentProgress(
          Number(tmdbid) || 0,
          category || "",
          Number(season) || 0,
          Number(episode) || 0
        );
        setWatchProgress(response.watchProgress);
      } catch (error) {
        //
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfileContentProgress();
  }, [season, episode, currentProvider, tmdbid]);

  // manage current time
  const handleCurrentTimeUpdate = (time: any) => {
    currentTimeRef.current = time;
  };

  // manage duration
  const handleDurationUpdate = (duration: any) => {
    contentDurationRef.current = duration;
  };

  // save profile progress before unload
  useEffect(() => {
    if (currentProfile === null || currentTimeRef.current === 0) {
      return;
    }
    const handleBeforeUnload = async () => {
      saveProfileContentProgress(
        Number(tmdbid) || 0,
        category!,
        currentTimeRef.current,
        contentDurationRef.current,
        Number(season) || 0,
        Number(episode) || 0
      );
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <div
      className={`${
        isAboveMediumScreens
          ? "w-[854px] h-[480px] rounded-md"
          : "w-full h-auto"
      }`}
      style={{
        background:
          "linear-gradient(180deg, rgb(143, 143, 143, 0.1), rgb(176, 176, 176, 0.1))",
      }}
    >
      <ExternalPlayer
        src={determineSrc(tmdbid, category, season, episode, currentProvider)}
        provider={currentProvider}
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
  provider: any
) => {
  let src = "";
  if (category === "movie") {
    if (provider === "VidSrcPro") {
      src = `https://vidsrc.xyz/embed/movie?tmdb=${tmdbid}&ds_lang=en`;
    } else if (provider === "Smashy") {
      src = `https://player.smashy.stream/movie/${tmdbid}`;
    } else if (provider === "Internal Player (Beta)") {
      src = "";
    }
  } else {
    if (provider === "VidSrcPro") {
      src = `https://vidsrc.xyz/embed/tv?tmdb=${tmdbid}&season=${season}&episode=${episode}&ds_lang=en`;
    } else if (provider === "Smashy") {
      src = `https://player.smashy.stream/tv/${tmdbid}?s=${season}&e=${episode}`;
    } else if (provider === "Internal Player (Beta)") {
      src = "";
    }
  }

  return src;
};
