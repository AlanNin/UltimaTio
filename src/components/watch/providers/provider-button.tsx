"use client";
import React from "react";
import useMediaQuery from "~/hooks/use-media-query";

type Props = {
  providerName: string;
  currentProvider: string;
  setProvider: (provider: string) => void;
  saveProfileProgress: any;
};

const ProviderButton: React.FC<Props> = ({
  providerName,
  currentProvider,
  setProvider,
  saveProfileProgress,
}) => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 869px)");
  return (
    <div
      className={`relative h-max w-max cursor-pointer rounded-sm px-2.5 py-1.5 transition-colors duration-200 ${
        providerName === currentProvider
          ? "bg-[rgba(71,12,130,0.6)]"
          : isAboveMediumScreens
            ? "hover:bg-[rgba(181,181,181,0.1)]"
            : ""
      }`}
      onClick={() => {
        saveProfileProgress();
        setProvider(providerName);
      }}
    >
      <h1 className="select-none whitespace-nowrap text-sm font-light">
        {" "}
        {providerName}{" "}
      </h1>
    </div>
  );
};

export default ProviderButton;
