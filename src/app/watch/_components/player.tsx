"use client";
import { useEffect, useState } from "react";
import useMediaQuery from "~/hooks/useMediaQuery";

import React, { ReactNode } from "react";

interface AspectRatioContainerProps {
  children: ReactNode;
}
type Props = {
  tmdbid: any;
  category: any;
  playerRef: any;
  season: any;
  episode: any;
  provider: any;
};

const Player: React.FC<Props> = ({
  tmdbid,
  category,
  playerRef,
  season,
  episode,
  provider,
}) => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 854px)");
  // SET AUTO SUBTITLES src = `https://vidsrc.xyz/embed/movie?tmdb=${tmdbid}&ds_lang=en`; https://vidsrc.xyz/embed/movie?tmdb=385687&sub_url=https%3A%2F%2Fvidsrc.me%2Fsample.srt

  let src;

  if (category === "movie") {
    if (provider === "Smashy") {
      src = `https://player.smashy.stream/movie/${tmdbid}`;
    } else if (provider === "2Embed") {
      src = `https://www.2embed.cc/embed/${tmdbid}`;
    } else if (provider === "VidSrc") {
      src = `https://vidsrc.to/embed/movie/${tmdbid}`;
    } else if (provider === "VidSrcXYZ") {
      src = `https://vidsrc.xyz/embed/movie?tmdb=${tmdbid}`;
    }
  } else {
    if (provider === "Smashy") {
      src = `https://player.smashy.stream/tv/${tmdbid}?s=${season}&e=${episode}`;
    } else if (provider === "2Embed") {
      src = `https://www.2embed.cc/embedtv/${tmdbid}&s=${season}&e=${episode}`;
    } else if (provider === "VidSrc") {
      src = `https://vidsrc.to/embed/tv/${tmdbid}/${season}/${episode}`;
    } else if (provider === "VidSrcXYZ") {
      src = `https://vidsrc.xyz/embed/tv?tmdb=${tmdbid}&season=${season}&episode=${episode}&ds_lang=en`;
    }
  }
  const AspectRatioContainer: React.FC<AspectRatioContainerProps> = ({
    children,
  }) => (
    <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        {children}
      </div>
    </div>
  );

  return (
    <div
      className={`${isAboveMediumScreens ? "w-[854px] h-[480px]" : "w-full"}`}
    >
      <AspectRatioContainer>
        <iframe
          ref={playerRef}
          src={src}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className={`${isAboveMediumScreens && "rounded-md"}`}
          style={{
            background:
              "linear-gradient(180deg, rgb(143, 143, 143, 0.1), rgb(176, 176, 176, 0.1))",
          }}
        />
      </AspectRatioContainer>
    </div>
  );
};

export default Player;
