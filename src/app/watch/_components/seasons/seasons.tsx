"use client";
import React, { useState } from "react";
import useMediaQuery from "~/hooks/useMediaQuery";
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
  const isAboveMediumScreens = useMediaQuery("(min-width: 854px)");
  return (
    <div
      className={`w-full flex flex-col gap-3 mb-8 ${
        !isAboveMediumScreens && "px-4"
      }`}
    >
      <h1 className="font-light text-sm text-[#adadad]">More Seasons</h1>
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
          />
        ))}
      </div>
    </div>
  );
};

export default Seasons;
