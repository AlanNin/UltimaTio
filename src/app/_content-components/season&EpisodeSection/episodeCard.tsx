"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import NotFound from "~/assets/NoImage.png";

type Props = {
  selectedSeason: any;
  episode: any;
  content: any;
};

const EpisodeCard: React.FC<Props> = ({ episode, selectedSeason, content }) => {
  const router = useRouter();
  const handleNavigateToWatch = () => {
    const seasonNumber = selectedSeason.season_number;
    const episodeNumber = episode.episodeNumber;
    router.push(
      `/watch?tmdbid=${content.tmdbid}&category=${content.category}&season=${seasonNumber}&episode=${episodeNumber}`
    );
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

  const watchPercentage = episode?.watchProgress
    ? Math.floor((episode?.watchProgress / episode?.episodeDuration) * 100)
    : 0;

  return (
    <div
      className="relative flex flex-col cursor-pointer h-[170px] w-[340px] rounded-md gap-3 bg-[rgba(181,181,181,0.1)] py-2 px-3"
      onClick={handleNavigateToWatch}
    >
      <div className="flex h-max w-max gap-4">
        <Image
          src={imageUrl}
          alt="Episode Image"
          className="w-[160px] h-[90px] object-cover rounded-md"
          width={160}
          height={90}
          priority
          unoptimized
          style={{
            background:
              "linear-gradient(180deg, rgb(143, 143, 143, 0.1), rgb(176, 176, 176, 0.1))",
            backgroundPosition: "center",
          }}
        />
        <div className="flex flex-col justify-center gap-1">
          <h1 className="text-xs font-base mb-1 max-w-[135px]">
            {episode.episodeNumber}. {truncateText(episode.title, 50)}
          </h1>
          <h1 className="text-xs font-base text-[#c2c2c2]">
            Rated: {episode.rating.toFixed(1)}
          </h1>
          <h1 className="text-xs font-base text-[#c2c2c2]">
            Duration: {formatDuration(episode.episodeDuration)}
          </h1>
        </div>
      </div>
      <h1 className="text-sm font-light text-[#c2c2c2] h-full flex max-h-[100px] overflow-y-auto ">
        {episode.overview}
      </h1>
      {episode?.watchProgress > 0 && (
        <div className="h-4 w-full rounded-md bg-[rgba(255,255,255,0.35)]">
          <div
            className={`rounded-md bg-[#7c26d4] h-full`}
            style={{ width: watchPercentage + "%" }}
          />
        </div>
      )}
    </div>
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

function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + "...";
}

export default EpisodeCard;
