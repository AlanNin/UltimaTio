"use client";
import useMediaQuery from "~/hooks/use-media-query";
import { getFeedAnime } from "~/server/queries/anime/tmdb.queries";
import { Loading } from "~/utils/loading/loading";
import Section from "~/components/section/section";
import { useSuspenseQuery } from "@tanstack/react-query";

export default function AnimeScreen() {
  const isAboveMediumScreens = useMediaQuery("(min-width: 900px)");

  const { data: feedData, isLoading: isFeedLoading } = useSuspenseQuery({
    queryKey: ["anime-feed"],
    queryFn: () => getFeedAnime(),
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
        </>
      )}
    </section>
  );
}
