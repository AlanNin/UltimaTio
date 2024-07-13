"use client";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import useMediaQuery from "~/hooks/useMediaQuery";
import {
  getProfileContentProgress,
  saveProfileContentProgress,
} from "~/server/queries/contentProfile.queries";
import { Loading } from "~/utils/loading/loading";

type Props = {
  tmdbid: any;
  category: any;
  season: any;
  episode: any;
  provider: any;
  playerCurrentTimeRef: any;
  watchProgress: any;
  setWatchProgress: any;
  playerCurrentDurationRef: any;
};

const Player: React.FC<Props> = ({
  tmdbid,
  category,
  season,
  episode,
  provider,
  playerCurrentTimeRef,
  watchProgress,
  setWatchProgress,
  playerCurrentDurationRef,
}) => {
  const playerRef = useRef<HTMLIFrameElement>(null);
  const isAboveMediumScreens = useMediaQuery("(min-width: 869px)");
  const [, updateCurrentTime] = useState({});
  const [, updateCurrentDuration] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { currentProfile } = useSelector((state: any) => state.profile);
  const src = determineSrc(
    tmdbid,
    category,
    season,
    episode,
    provider,
    watchProgress
  );

  // SET LOADING ON SRC CHANGE
  useEffect(() => {
    setIsLoading(true);
  }, [src]);

  // FETCH PROFILE CONTENT PROGRESS
  useEffect(() => {
    if (currentProfile === null) {
      setIsLoading(false);
      return;
    }

    const fetchProfileContentProgress = async () => {
      try {
        const response = await getProfileContentProgress(
          tmdbid,
          category,
          season,
          episode
        );
        setWatchProgress(response.watchProgress);
      } catch (error) {
        console.error("Error getting profile content progress -->:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfileContentProgress();
  }, [src]);

  // SAVE PROFILE CONTENT PROGRESS BEFORE UNLOAD
  useEffect(() => {
    if (currentProfile === null) {
      setIsLoading(false);
      return;
    }
    const handleBeforeUnload = async () => {
      await saveProfileContentProgress(
        tmdbid,
        category,
        playerCurrentTimeRef.current,
        playerCurrentDurationRef.current!,
        season,
        episode
      );
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // UPDATE PROFILE CONTENT PROGRESS
  useEffect(() => {
    if (currentProfile === null) {
      setIsLoading(false);
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.origin === new URL(src).origin) {
        const data = event.data;

        if (data.event === "time") {
          playerCurrentTimeRef.current = data.time;
          updateCurrentTime({});
        }
        if (data.event === "duration") {
          playerCurrentDurationRef.current = data.duration;
          updateCurrentDuration({});
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [src]);

  return (
    <div
      className={`${isAboveMediumScreens ? "w-[854px] h-[480px]" : "w-full"}`}
    >
      <div
        style={{
          position: "relative",
          paddingBottom: "56.25%",
          height: 0,
          background:
            "linear-gradient(180deg, rgb(143, 143, 143, 0.1), rgb(176, 176, 176, 0.1))",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          {isLoading ? (
            <div className="w-full h-full justify-center items-center">
              <Loading type="spin" color="white" />
            </div>
          ) : (
            <iframe
              ref={playerRef}
              src={src}
              width="100%"
              height="100%"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className={`${isAboveMediumScreens && "rounded-md"}`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const determineSrc = (
  tmdbid: any,
  category: any,
  season: any,
  episode: any,
  provider: any,
  watchProgress: any
) => {
  let src = "";
  if (category === "movie") {
    if (provider === "Smashy") {
      src = `https://player.smashy.stream/movie/${tmdbid}?startTime=${watchProgress}`;
    } else if (provider === "VidSrcPro") {
      src = `https://vidsrc.xyz/embed/movie?tmdb=${tmdbid}&ds_lang=en`;
    } else if (provider === "2Embed") {
      src = `https://www.2embed.cc/embed/${tmdbid}`;
    } else if (provider === "VidSrc") {
      src = `https://vidsrc.to/embed/movie/${tmdbid}`;
    }
  } else {
    if (provider === "Smashy") {
      src = `https://player.smashy.stream/tv/${tmdbid}?s=${season}&e=${episode}&startTime=${watchProgress}`;
    } else if (provider === "VidSrcPro") {
      src = `https://vidsrc.xyz/embed/tv?tmdb=${tmdbid}&season=${season}&episode=${episode}&ds_lang=en`;
    } else if (provider === "2Embed") {
      src = `https://www.2embed.cc/embedtv/${tmdbid}&s=${season}&e=${episode}`;
    } else if (provider === "VidSrc") {
      src = `https://vidsrc.to/embed/tv/${tmdbid}/${season}/${episode}`;
    }
  }

  return src;
};

export default Player;
