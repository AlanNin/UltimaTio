"use client";
import React from "react";
import useMediaQuery from "~/hooks/useMediaQuery";
import ProviderButton from "./provider-button";

type Props = {
  providers: any;
  currentProvider: any;
  setCurrentProvider: any;
};

const Providers: React.FC<Props> = ({
  providers,
  currentProvider,
  setCurrentProvider,
}) => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 854px)");

  return (
    <div
      className={`w-full flex items-center gap-4 py-4 ${
        isAboveMediumScreens ? "gap-6" : "gap-4 px-2"
      }`}
    >
      <p
        className={`bg-[rgba(0,0,0,0.5)] p-4 font-light text-xs text-center rounded-md ${
          isAboveMediumScreens ? "flex-[35%]" : "flex-[55%]"
        }`}
      >
        {isAboveMediumScreens ? (
          <>
            You are watching this media through the {currentProvider} provider
            (If current server doesn't work please try other servers beside)
          </>
        ) : (
          <>
            If current server doesn't work please try others (Swipe to the sides
            if you are a mobile user)
          </>
        )}
      </p>

      <div
        className={`flex overflow-x-auto gap-3 mb-[-16px] pb-3 ${
          isAboveMediumScreens ? "basis-[65%]" : "basis-[45%]"
        }`}
      >
        {providers.map((provider: any) => (
          <ProviderButton
            key={provider}
            providerName={provider}
            currentProvider={currentProvider}
            setProvider={setCurrentProvider}
          />
        ))}
      </div>
    </div>
  );
};

export default Providers;
