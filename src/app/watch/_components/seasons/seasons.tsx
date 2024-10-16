"use client";
import React from "react";
import useMediaQuery from "~/hooks/useMediaQuery";
import SeasonBox from "./season-box";

type Props = {
  content: any;
  tmdbid: any;
  category: any;
  currentSeason: any;
  saveProfileProgress: any;
};

const Seasons: React.FC<Props> = ({
  content,
  tmdbid,
  category,
  currentSeason,
  saveProfileProgress,
}) => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 869px)");
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
            saveProfileProgress={saveProfileProgress}
          />
        ))}
      </div>
    </div>
  );
};

export default Seasons;
