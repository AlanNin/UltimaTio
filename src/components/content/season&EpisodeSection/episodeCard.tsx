"use client";
import React from "react";
import NotFound from "~/assets/icons/no-image.png";
import Link from "next/link";

type Props = {
  selectedSeason: any;
  episode: any;
  content: any;
};

const EpisodeCard: React.FC<Props> = ({ episode, selectedSeason, content }) => {
  const handleGetWatchHref = () => {
    const seasonNumber = selectedSeason.season_number;
    const episodeNumber = episode.episodeNumber;

    return `/watch?tmdbid=${content.tmdbid}&category=${content.category}&season=${seasonNumber}&episode=${episodeNumber}`;
  };

  if (new Date(episode.airDate) > new Date()) {
    return null;
  }

  const imageUrl =
    !episode.episodePoster ||
    episode.episodePoster.includes("questionmark") ||
    episode.episodePoster.includes("bestv2null")
      ? NotFound
      : episode.episodePoster;

  const toImgSrc = (val: string | { src: string }) =>
    typeof val === "string" ? val : val?.src ?? "";

  const watchPercentage = episode?.watchProgress
    ? Math.floor((episode?.watchProgress / episode?.episodeDuration) * 100)
    : 0;

  return (
    <Link
      href={handleGetWatchHref()}
      className="relative flex flex-col cursor-pointer h-auto w-full rounded-md gap-3 transition-colors duration-300 bg-[rgba(181,181,181,0.1)] hover:bg-[rgba(181,181,181,0.2)] p-4"
    >
      <div className="flex gap-4">
        <div className="relative w-[160px] aspect-video shrink-0">
          <img
            src={toImgSrc(imageUrl)}
            alt="Episode Image"
            className="absolute inset-0 w-full h-full object-cover rounded-md"
            style={{
              background:
                "linear-gradient(180deg, rgb(143, 143, 143, 0.1), rgb(176, 176, 176, 0.1))",
              backgroundPosition: "center",
            }}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
          {episode?.watchProgress > 0 && (
            <div className="absolute bottom-2 right-2 left-2 h-1.5 rounded-md bg-[rgba(255,255,255,0.35)]">
              <div
                className="rounded-md bg-[#7c26d4] h-full"
                style={{ width: watchPercentage + "%" }}
              />
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center gap-1 min-w-0">
          <h1 className="text-xs font-base mb-1 line-clamp-3 ">
            {episode.episodeNumber}. {episode.title}
          </h1>
          <h1 className="text-xs font-base text-[#c2c2c2]">
            Rated: {episode.rating.toFixed(1)}
          </h1>
          <h1 className="text-xs font-base text-[#c2c2c2]">
            Duration: {formatDuration(episode.episodeDuration)}
          </h1>
        </div>
      </div>
      <label
        className="text-sm font-light text-[#c2c2c2] line-clamp-2"
        title={episode.overview ?? "No description available"}
      >
        {episode.overview ?? "No description available"}
      </label>
    </Link>
  );
};

function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

export default EpisodeCard;
