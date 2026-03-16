"use client";
import { getFeedMovie } from "~/server/queries/movie/tmdb.queries";
import { Loading } from "~/utils/loading/loading";
import Section from "~/components/section/section";
import { useQuery } from "@tanstack/react-query";

export default function MovieScreen() {
  const { data: feedData, isLoading: isFeedLoading } = useQuery({
    queryKey: ["movie-feed"],
    queryFn: () => getFeedMovie(),
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
        </div>
      )}
    </section>
  );
}
