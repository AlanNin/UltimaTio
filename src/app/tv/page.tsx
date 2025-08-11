"use client";
import useMediaQuery from "~/hooks/use-media-query";
import { getFeedTV } from "~/server/queries/tv/tmdb.queries";
import { Loading } from "~/utils/loading/loading";
import Section from "~/components/section/section";
import { useQuery } from "@tanstack/react-query";

export default function TVShowsScreen() {
  const isAboveMediumScreens = useMediaQuery("(min-width: 900px)");

  const { data: feedData, isLoading: isFeedLoading } = useQuery({
    queryKey: ["tv-feed"],
    queryFn: () => getFeedTV(),
    staleTime: 1000 * 60 * 15,
  });

  return (
    <section
      id="home"
      className={`w-full h-full min-h-screen relative max-w-[1920px] m-auto ${
        isAboveMediumScreens ? "pt-16 pb-10" : "pt-14 pb-16"
      }`}
    >
      {isFeedLoading ? (
        <div
          className={`flex w-full h-screen items-center justify-center ${
            isAboveMediumScreens ? "my-[-56px]" : "my-[-44px]"
          } `}
        >
          <Loading type="bars" />
        </div>
      ) : (
        <>
          <div className={`${isAboveMediumScreens ? "pt-10" : "pt-6"}`}>
            {feedData.airingTodayTV && feedData.airingTodayTV.length > 0 && (
              <Section text="Airing Today" content={feedData.airingTodayTV} />
            )}
            {feedData.onTheAirTV && feedData.onTheAirTV.length > 0 && (
              <Section text="On The Air" content={feedData.onTheAirTV} />
            )}
            {feedData.popularTV && feedData.popularTV.length > 0 && (
              <Section text="Popular" content={feedData.popularTV} />
            )}
            {feedData.topRatedTV && feedData.topRatedTV.length > 0 && (
              <Section text="Top Rated" content={feedData.topRatedTV} />
            )}
          </div>
        </>
      )}
    </section>
  );
}
