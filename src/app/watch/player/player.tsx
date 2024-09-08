"use client";
import { useEffect, useRef, useState } from "react";
import useMediaQuery from "~/hooks/useMediaQuery";
import {
  scrapRabbitTokenEmbed,
  scrapVideoEmbed,
} from "~/server/queries/scrap.queries";
import { Loading } from "~/utils/loading/loading";
import InternalPlayer from "./internal-player";
import ExternalPlayer from "./external-player";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { MediaPlayerInstance } from "@vidstack/react";
import { useSelector } from "react-redux";
import {
  getProfileContentProgress,
  saveProfileContentProgress,
} from "~/server/queries/contentProfile.queries";
import { current } from "@reduxjs/toolkit";
import { set } from "zod";

type Props = {
  title: any;
  year: any;
  currentProvider: any;
  currentTimeRef: any;
  contentDurationRef: any;
};

const Player: React.FC<Props> = ({
  title,
  year,
  currentProvider,
  currentTimeRef,
  contentDurationRef,
}) => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 869px)");
  const { currentProfile } = useSelector((state: any) => state.profile);
  const encodedTitle = encodeURIComponent(title);
  const [watchProgress, setWatchProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // define search params
  const searchParams = useSearchParams();
  const tmdbidParam = searchParams.get("tmdbid");
  const categoryParam = searchParams.get("category");
  const seasonParam = searchParams.get("season") || "";
  const episodeParam = searchParams.get("episode") || "";

  /// define query for rabbit token
  const {
    data: rabbitToken,
    error: RabbitError,
    isLoading: RabbitIsLoading,
  } = useQuery({
    queryKey: [
      "rabbitToken",
      tmdbidParam,
      categoryParam,
      seasonParam,
      episodeParam,
    ],
    queryFn: () =>
      scrapRabbitTokenEmbed(
        encodedTitle,
        year,
        categoryParam || "",
        tmdbidParam || "",
        episodeParam || "1",
        seasonParam || "1"
      ),
    refetchOnWindowFocus: false,
  });

  /// define query for scrap data
  const {
    data: scrapData,
    isError: ScrapIsError,
    isLoading: ScrapIsLoading,
  } = useQuery({
    queryKey: [
      "content",
      tmdbidParam,
      categoryParam,
      seasonParam,
      episodeParam,
    ],
    queryFn: () =>
      scrapVideoEmbed(
        encodedTitle,
        year,
        categoryParam || "",
        tmdbidParam || "",
        episodeParam || "1",
        seasonParam || "1"
      ),
    refetchOnWindowFocus: false,
  });

  console.log(scrapData);
  if (ScrapIsError) {
    console.log("Error getting scrap data:", ScrapIsError);
  }

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
          Number(tmdbidParam) || 0,
          categoryParam || "",
          Number(seasonParam) || 0,
          Number(episodeParam) || 0
        );
        setWatchProgress(response.watchProgress);
      } catch (error) {
        //
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfileContentProgress();
  }, [seasonParam, episodeParam, currentProvider, tmdbidParam]);

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
        Number(tmdbidParam) || 0,
        categoryParam!,
        currentTimeRef.current,
        contentDurationRef.current,
        Number(seasonParam) || 0,
        Number(episodeParam) || 0
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
        isAboveMediumScreens ? "w-[854px] h-[480px] rounded-md" : "w-full"
      }`}
      style={{
        background:
          "linear-gradient(180deg, rgb(143, 143, 143, 0.1), rgb(176, 176, 176, 0.1))",
      }}
    >
      {(ScrapIsLoading && currentProvider === "Internal Player (Beta)") ||
      (RabbitIsLoading && currentProvider === "RabbitStream") ||
      isLoading ? (
        <div className="w-full h-full flex justify-center items-center">
          <Loading type="spin" color="white" />
        </div>
      ) : (
        <>
          {currentProvider === "Internal Player (Beta)" ? (
            <InternalPlayer
              scrapData={scrapData?.response}
              title={title}
              season={Number(seasonParam)}
              episode={Number(episodeParam)}
              handleCurrentTimeUpdate={handleCurrentTimeUpdate}
              handleDurationUpdate={handleDurationUpdate}
              watchProgress={watchProgress}
            />
          ) : (
            <ExternalPlayer
              src={determineSrc(
                tmdbidParam,
                categoryParam,
                seasonParam,
                episodeParam,
                currentProvider,
                rabbitToken?.response
              )}
              provider={currentProvider}
              handleCurrentTimeUpdate={handleCurrentTimeUpdate}
              handleDurationUpdate={handleDurationUpdate}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Player;

const determineSrc = (
  tmdbid: any,
  category: any,
  season: any,
  episode: any,
  provider: any,
  rabbit_token: any
) => {
  let src = "";
  if (category === "movie") {
    if (provider === "RabbitStream") {
      src = `https://rabbitstream.net/v2/embed-4/${rabbit_token}?_debug=true`;
    } else if (provider === "VidSrcPro") {
      src = `https://vidsrc.xyz/embed/movie?tmdb=${tmdbid}&ds_lang=en`;
    } else if (provider === "Smashy") {
      src = `https://player.smashy.stream/movie/${tmdbid}`;
    } else if (provider === "Internal Player (Beta)") {
      src = "";
    }
  } else {
    if (provider === "RabbitStream") {
      src = `https://rabbitstream.net/v2/embed-4/${rabbit_token}?_debug=true`;
    } else if (provider === "VidSrcPro") {
      src = `https://vidsrc.xyz/embed/tv?tmdb=${tmdbid}&season=${season}&episode=${episode}&ds_lang=en`;
    } else if (provider === "Smashy") {
      src = `https://player.smashy.stream/tv/${tmdbid}?s=${season}&e=${episode}`;
    } else if (provider === "Internal Player (Beta)") {
      src = "";
    }
  }

  return src;
};
