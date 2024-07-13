"use client";
import { useEffect, useRef, useState } from "react";
import useMediaQuery from "~/hooks/useMediaQuery";

interface AspectRatioContainerProps {
  children: React.ReactNode;
}

type Props = {
  tmdbid: any;
  category: any;
  season: any;
  episode: any;
  provider: any;
};

const Player: React.FC<Props> = ({
  tmdbid,
  category,
  season,
  episode,
  provider,
}) => {
  const playerRef = useRef<HTMLIFrameElement>(null);
  const isAboveMediumScreens = useMediaQuery("(min-width: 869px)");
  const playerCurrentTimeRef = useRef(0);
  const [, updateCurrentTime] = useState({});
  const src = determineSrc(tmdbid, category, season, episode, provider);

  // HANDLE PLAYER CURRENT TIME
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin === new URL(src).origin) {
        const data = event.data;
        event.data.time === 20;

        if (data.event === "time") {
          playerCurrentTimeRef.current = data.time;
          updateCurrentTime({});
        }
      }
    };

    if (src) {
      window.addEventListener("message", handleMessage);
      return () => {
        window.removeEventListener("message", handleMessage);
      };
    }
  }, [src]);

  return (
    <div
      className={`${isAboveMediumScreens ? "w-[854px] h-[480px]" : "w-full"}`}
    >
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
  provider: any
) => {
  let src = "";

  if (category === "movie") {
    if (provider === "Smashy") {
      src = `https://player.smashy.stream/movie/${tmdbid}`;
    } else if (provider === "VidSrcPro") {
      src = `https://vidsrc.xyz/embed/movie?tmdb=${tmdbid}`;
    }

    /*
    else if (provider === "2Embed") {
      src = `https://www.2embed.cc/embed/${tmdbid}`;
    } else if (provider === "VidSrc") {
      src = `https://vidsrc.to/embed/movie/${tmdbid}`;
    }
    */
  } else {
    if (provider === "Smashy") {
      src = `https://player.smashy.stream/tv/${tmdbid}?s=${season}&e=${episode}`;
    } else if (provider === "VidSrcPro") {
      src = `https://vidsrc.xyz/embed/tv?tmdb=${tmdbid}&season=${season}&episode=${episode}&ds_lang=en`;
    }
    /*
    else if (provider === "2Embed") {
      src = `https://www.2embed.cc/embedtv/${tmdbid}&s=${season}&e=${episode}`;
    } else if (provider === "VidSrc") {
      src = `https://vidsrc.to/embed/tv/${tmdbid}/${season}/${episode}`;
    }
    */
  }

  return src;
};

export default Player;
