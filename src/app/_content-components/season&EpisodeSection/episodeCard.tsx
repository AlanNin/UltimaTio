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
  console.log(episode);
  const handleNavigateToWatch = () => {
    const seasonNumber = selectedSeason.seasonNumber - 1;
    const episodeNumber = episode.episodeNumber - 1;
    router.push(
      "/watch/" +
        content.id +
        "/" +
        content.seasons[seasonNumber].seasonNumber +
        "/" +
        content.seasons[seasonNumber].episodes[episodeNumber].episodeNumber
    );
  };
  const imageUrl =
    !episode.episodePoster ||
    episode.episodePoster.includes("questionmark") ||
    episode.episodePoster.includes("bestv2null")
      ? NotFound
      : episode.episodePoster;

  return (
    <div
      className="relative flex flex-col cursor-pointer h-[160px] w-[340px] rounded-md gap-3 bg-[rgba(181,181,181,0.1)] py-2 px-3"
      onClick={handleNavigateToWatch}
    >
      <div className="flex h-max w-max gap-4">
        <Image
          src={imageUrl}
          alt="Episode Image"
          className="w-[160px] h-[90px] object-cover rounded-md"
          width={160}
          height={90}
          style={{
            backgroundPosition: "center",
          }}
        />
        <div className="flex flex-col justify-center gap-1">
          <h1 className="text-xs font-base mb-1 max-w-[135px]">
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
      <h1 className="text-sm font-light text-[#c2c2c2] h-full flex items-center">
        {episode.overview
          ? truncateText(episode.overview, 70)
          : "No overview found for this episode"}
      </h1>
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
