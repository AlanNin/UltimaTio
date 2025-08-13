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
  });

  return (
    <section id="home">
      {isFeedLoading ? (
        <div className="flex w-full h-screen items-center justify-center my-[-44px] md-screen:my-[-56px]">
          <Loading type="bars" />
        </div>
      ) : (
        <div className="w-full h-full min-h-screen relative max-w-[1920px] m-auto pt-[60px] pb-10 md-screen:pt-[69px] md-screen:pb-16">
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
