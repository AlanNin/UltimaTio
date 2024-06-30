"use client";
import useMediaQuery from "~/hooks/useMediaQuery";
import Section from "../_shared/section/section";
import { getFeedMovie } from "~/server/queries/movie/tmdb.queries";
import { useEffect, useState } from "react";

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
    setIsLoading(true);
    const fetchFeed = async () => {
      const response = await getFeedMovie();
      setFeed(response);
    };
    fetchFeed();
    setIsLoading(false);
  }, []);

  return (
    <section
      id="home"
      className={`w-full h-full min-h-screen relative max-w-[1920px] m-auto ${
        isAboveMediumScreens ? "pt-14 pb-10" : "pt-11 pb-16"
      }`}
    >
      {isLoading ? (
        <></>
      ) : (
        <>
          <div className={`${isAboveMediumScreens ? "pt-10" : "pt-6"}`}>
            <Section text="Trending" content={feed.trendingMovies} />
            <Section text="Popular" content={feed.popularMovies} />
            <Section text="Top Rated" content={feed.topRatedMovies} />
            <Section text="Upcoming" content={feed.upcomingMovies} />
          </div>
        </>
      )}
    </section>
  );
};

export default Home;
