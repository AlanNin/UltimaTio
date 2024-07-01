"use client";
import { useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const Watch = () => {
  const searchParams = useSearchParams();
  const tmdbid = searchParams.get("tmdbid");
  const category = searchParams.get("category");
  const season = searchParams.get("season");
  const episode = searchParams.get("episode");
  const playerRef = useRef<any>(null);
  const router = useRouter();

  let src;

  if (category === "movie") {
    src = `https://player.smashy.stream/movie/${tmdbid}`;
  } else {
    src = `https://player.smashy.stream/tv/${tmdbid}?s=${season}&e=${episode}`;
  }

  const handlePlay = () => {
    if (playerRef.current && playerRef.current.contentWindow) {
      playerRef.current.contentWindow.postMessage({ event: "play" }, "*");
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <iframe
        ref={playerRef}
        src={src}
        width="100%"
        height="100%"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onCanPlay={handlePlay}
        sandbox="allow-forms allow-pointer-lock allow-same-origin allow-scripts"
      />
    </div>
  );
};

export default Watch;
