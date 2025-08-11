"use client";
import useMediaQuery from "~/hooks/use-media-query";
import { getFeedMovie } from "~/server/queries/movie/tmdb.queries";
import { Loading } from "~/utils/loading/loading";
import Section from "~/components/section/section";
import { useQuery } from "@tanstack/react-query";

export default function MovieScreen() {
  const isAboveMediumScreens = useMediaQuery("(min-width: 900px)");

  const { data: feedData, isLoading: isFeedLoading } = useQuery({
    queryKey: ["movie-feed"],
    queryFn: () => getFeedMovie(),
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
            {feedData.trendingMovies && feedData.trendingMovies.length > 0 && (
              <Section text="Trending" content={feedData.trendingMovies} />
            )}
            {feedData.popularMovies && feedData.popularMovies.length > 0 && (
              <Section text="Popular" content={feedData.popularMovies} />
            )}
            {feedData.topRatedMovies && feedData.topRatedMovies.length > 0 && (
              <Section text="Top Rated" content={feedData.topRatedMovies} />
            )}
            {feedData.upcomingMovies && feedData.upcomingMovies.length > 0 && (
              <Section text="Upcoming" content={feedData.upcomingMovies} />
            )}
          </div>
        </>
      )}
    </section>
  );
}
