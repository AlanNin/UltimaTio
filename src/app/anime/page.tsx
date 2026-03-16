"use client";
import { getFeedAnime } from "~/server/queries/anime/tmdb.queries";
import { Loading } from "~/utils/loading/loading";
import Section from "~/components/section/section";
import { useQuery } from "@tanstack/react-query";

export default function AnimeScreen() {
  const { data: feedData, isLoading: isFeedLoading } = useQuery({
    queryKey: ["anime-feed"],
    queryFn: () => getFeedAnime(),
    staleTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
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
            {feedData.airingTodayAnime &&
              feedData.airingTodayAnime.length > 0 && (
                <Section
                  text="Airing Today"
                  content={feedData.airingTodayAnime}
                />
              )}
            {feedData.onTheAirAnime && feedData.onTheAirAnime.length > 0 && (
              <Section text="On The Air" content={feedData.onTheAirAnime} />
            )}
            {feedData.popularAnime && feedData.popularAnime.length > 0 && (
              <Section text="Popular" content={feedData.popularAnime} />
            )}
            {feedData.topRatedAnime && feedData.topRatedAnime.length > 0 && (
              <Section text="Top Rated" content={feedData.topRatedAnime} />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
