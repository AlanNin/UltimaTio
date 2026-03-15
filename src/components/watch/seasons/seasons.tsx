"use client";
import React from "react";
import useMediaQuery from "~/hooks/use-media-query";
import SeasonBox from "./season-box";

type Props = {
  content: any;
  tmdbid: any;
  category: any;
  currentSeason: any;
};

const Seasons: React.FC<Props> = ({
  content,
  tmdbid,
  category,
  currentSeason,
}) => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 869px)");
  return (
    <div
      className={`flex w-full flex-col gap-3 ${
        !isAboveMediumScreens && "px-4"
      }`}
    >
      <h1 className="text-sm font-light text-[#adadad]">More Seasons</h1>
      <div
        className={`flex gap-4 ${
          isAboveMediumScreens ? "flex-wrap" : "overflow-x-auto pb-4"
        }`}
      >
        {content?.seasons?.map((season: any, index: number) => (
          <SeasonBox
            key={index}
            tmdbid={tmdbid!}
            category={category}
            currentSeason={currentSeason!}
            season={season.season}
            airDate={season.airDate}
          />
        ))}
      </div>
    </div>
  );
};

export default Seasons;
