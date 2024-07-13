"use client";
import React from "react";
import useMediaQuery from "~/hooks/useMediaQuery";

type Props = {
  providerName: string;
  currentProvider: string;
  setProvider: (provider: string) => void;
};

const ProviderButton: React.FC<Props> = ({
  providerName,
  currentProvider,
  setProvider,
}) => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 869px)");
  return (
    <div
      className={`relative cursor-pointer h-max w-max py-1.5 px-2.5 rounded-sm transition-colors duration-200 ${
        providerName === currentProvider
          ? "bg-[rgba(71,12,130,0.6)]"
          : isAboveMediumScreens
          ? "hover:bg-[rgba(181,181,181,0.1)]"
          : ""
      }`}
      onClick={() => {
        if (providerName !== currentProvider) {
          setProvider(providerName);
        }
      }}
    >
      <h1 className="whitespace-nowrap font-light text-sm"> {providerName} </h1>
    </div>
  );
};

export default ProviderButton;
