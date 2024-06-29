"use client";
import useMediaQuery from "~/hooks/useMediaQuery";
import HomeCarousel from "./_home-components/carousel";
import HomeSection from "./_home-components/section";
import { getHomeFeed } from "~/server/queries/tmdb.queries";
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
      const response = await getHomeFeed();
      setFeed(response);
    };
    fetchFeed();
    setIsLoading(false);
  }, []);

  return (
    <section
      id="home"
      className={`w-full h-full min-h-screen relative max-w-[1920px] m-auto ${
        isAboveMediumScreens ? "pt-14 pb-10" : "pt-11 pb-[172px]"
      }`}
    >
      {isLoading ? (
        <></>
      ) : (
        <>
          <HomeCarousel content={feed.trendingMovies} />
          <div className={`${isAboveMediumScreens ? "pt-10" : "pt-6"}`}>
            <HomeSection text="Popular" content={feed.popularMovies} />
            <HomeSection text="Top Rated" content={feed.topRatedMovies} />
            <HomeSection text="Upcoming" content={feed.upcomingMovies} />
          </div>
        </>
      )}
    </section>
  );
};

export default Home;
