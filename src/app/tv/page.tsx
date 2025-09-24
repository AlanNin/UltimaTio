"use client";
import { getFeedTV } from "~/server/queries/tv/tmdb.queries";
import { Loading } from "~/utils/loading/loading";
import Section from "~/components/section/section";
import { useQuery } from "@tanstack/react-query";

export default function TVShowsScreen() {
  const { data: feedData, isLoading: isFeedLoading } = useQuery({
    queryKey: ["tv-feed"],
    queryFn: () => getFeedTV(),
    staleTime: 1000 * 60 * 15,
  });

  return (
    <section id="home">
      {isFeedLoading ? (
        <div className="my-[-44px] flex h-screen w-full items-center justify-center md-screen:my-[-56px]">
          <Loading type="bars" />
        </div>
      ) : (
        <div className="relative m-auto h-full min-h-screen w-full max-w-[1920px] pb-10 pt-[60px] md-screen:pb-16 md-screen:pt-[69px]">
          <div className="pt-6 md-screen:pt-8">
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
        </div>
      )}
    </section>
  );
}
