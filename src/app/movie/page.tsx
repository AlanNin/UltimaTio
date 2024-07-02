"use client";
import useMediaQuery from "~/hooks/useMediaQuery";
import Section from "../_shared/section/section";
import { getFeedMovie } from "~/server/queries/movie/tmdb.queries";
import { useEffect, useState } from "react";
import { Loading } from "~/utils/loading/loading";

type Feed = {
  trendingMovies: any[];
  popularMovies: any[];
  topRatedMovies: any[];
  upcomingMovies: any[];
};

const Home = () => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 900px)");

  const [isLoading, setIsLoading] = useState(true);
  const [feed, setFeed] = useState<Feed>({
    trendingMovies: [],
    popularMovies: [],
    topRatedMovies: [],
    upcomingMovies: [],
  });

  useEffect(() => {
    const fetchFeed = async () => {
      setIsLoading(true);
      try {
        const response = await getFeedMovie();
        setFeed(response);
      } catch (error) {
        console.error("Error fetching home feed:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeed();
  }, []);

  return (
    <section
      id="home"
      className={`w-full h-full min-h-screen relative max-w-[1920px] m-auto ${
        isAboveMediumScreens ? "pt-14 pb-10" : "pt-11 pb-16"
      }`}
    >
      {isLoading ? (
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
            {feed.trendingMovies.length > 0 && (
              <Section text="Trending" content={feed.trendingMovies} />
            )}
            {feed.popularMovies.length > 0 && (
              <Section text="Popular" content={feed.popularMovies} />
            )}
            {feed.topRatedMovies.length > 0 && (
              <Section text="Top Rated" content={feed.topRatedMovies} />
            )}
            {feed.upcomingMovies.length > 0 && (
              <Section text="Upcoming" content={feed.upcomingMovies} />
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default Home;
