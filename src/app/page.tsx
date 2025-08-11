"use client";
import useMediaQuery from "~/hooks/use-media-query";
import { getHomeFeed } from "~/server/queries/tmdb.queries";
import { Loading } from "~/utils/loading/loading";
import HomeCarousel from "~/components/carousel";
import Section from "~/components/section/section";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

export default function HomeScreen() {
  const isAboveMediumScreens = useMediaQuery("(min-width: 900px)");

  const { currentProfile } = useSelector((state: any) => state.profile);

  const { data: feedData, isLoading: isFeedLoading } = useSuspenseQuery({
    queryKey: ["home-feed", currentProfile.id ?? undefined],
    queryFn: () => getHomeFeed(),
    staleTime: 1000 * 60 * 15,
  });

  return (
    <section
      id="home"
      className={`w-full h-full min-h-screen relative ${
        isAboveMediumScreens ? "pt-16 pb-10" : "pt-14 pb-16"
      }`}
    >
      {isFeedLoading ? (
        <div
          className={`flex w-full h-screen items-center justify-center ${
            isAboveMediumScreens ? "my-[-56px]" : "my-[-76px]"
          } `}
        >
          <Loading type="bars" />
        </div>
      ) : (
        <>
          <HomeCarousel content={feedData.trending} />
          <div
            className={`max-w-[1920px] m-auto ${
              isAboveMediumScreens ? "pt-10" : "pt-6"
            }`}
          >
            {feedData.watchHistory && feedData.watchHistory.length > 0 && (
              <Section
                text="Continue Watching"
                content={feedData.watchHistory}
                watchHistory={true}
              />
            )}
            <Section text="Popular" content={feedData.popular} />
            <Section text="Top Rated" content={feedData.topRated} />
            <Section text="Upcoming" content={feedData.upcoming} />
          </div>
        </>
      )}
    </section>
  );
}
