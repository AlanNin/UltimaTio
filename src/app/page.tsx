"use client";
import useMediaQuery from "~/hooks/use-media-query";
import { getHomeFeed } from "~/server/queries/tmdb.queries";
import { Loading } from "~/utils/loading/loading";
import HomeCarousel from "~/components/carousel";
import Section from "~/components/section/section";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { getProfileHistory } from "~/server/queries/contentProfile.queries";

export default function HomeScreen() {
  const isAboveMediumScreens = useMediaQuery("(min-width: 900px)");

  const { currentProfile } = useSelector((state: any) => state.profile);

  const { data: feedData, isLoading: isFeedLoading } = useQuery({
    queryKey: ["home-feed"],
    queryFn: () => getHomeFeed(),
    staleTime: 1000 * 60 * 15,
  });

  const {
    data: watchHistoryData,
    isLoading: isWatchHistoryLoading,
    dataUpdatedAt: watchHistoryVersion,
  } = useQuery({
    queryKey: ["watch-history", currentProfile ? currentProfile.id : undefined],
    queryFn: () => getProfileHistory(),
    enabled: !!currentProfile,
  });

  const isLoading = isFeedLoading || isWatchHistoryLoading;

  return (
    <section id="home">
      {isLoading ? (
        <div
          className={`flex w-full h-screen items-center justify-center ${
            isAboveMediumScreens ? "my-[-56px]" : "my-[-76px]"
          } `}
        >
          <Loading type="bars" />
        </div>
      ) : (
        <div
          className={`w-full h-full min-h-screen relative ${
            isAboveMediumScreens ? "pt-16 pb-10" : "pt-14 pb-16"
          }`}
        >
          <HomeCarousel content={feedData.trending} />
          <div
            className={`max-w-[1920px] m-auto ${
              isAboveMediumScreens ? "pt-10" : "pt-6"
            }`}
          >
            {currentProfile &&
              watchHistoryData &&
              watchHistoryData.length > 0 && (
                <Section
                  key={`wh-${watchHistoryVersion}`}
                  text="Continue Watching"
                  content={watchHistoryData}
                  watchHistory={true}
                />
              )}
            <Section text="Popular" content={feedData.popular} />
            <Section text="Top Rated" content={feedData.topRated} />
            <Section text="Upcoming" content={feedData.upcoming} />
          </div>
        </div>
      )}
    </section>
  );
}
