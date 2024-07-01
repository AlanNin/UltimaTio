"use client";
import useMediaQuery from "~/hooks/useMediaQuery";
import HomeCarousel from "./_home-components/carousel";
import Section from "./_shared/section/section";
import { getHomeFeed } from "~/server/queries/tmdb.queries";
import { useEffect, useState } from "react";
import { Loading } from "~/utils/loading/loading";

type Feed = {
  trending: any[];
  popular: any[];
  topRated: any[];
  upcoming: any[];
};

const Home = () => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 900px)");

  const [isLoading, setIsLoading] = useState(true);
  const [feed, setFeed] = useState<Feed>({
    trending: [],
    popular: [],
    topRated: [],
    upcoming: [],
  });

  useEffect(() => {
    const fetchFeed = async () => {
      setIsLoading(true);
      try {
        const response = await getHomeFeed();
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
            isAboveMediumScreens ? "my-[-56px]" : "my-[-76px]"
          } `}
        >
          <Loading type="bars" />
        </div>
      ) : (
        <>
          <HomeCarousel content={feed.trending} />
          <div className={`${isAboveMediumScreens ? "pt-10" : "pt-6"}`}>
            <Section text="Popular" content={feed.popular} />
            <Section text="Top Rated" content={feed.topRated} />
            <Section text="Upcoming" content={feed.upcoming} />
          </div>
        </>
      )}
    </section>
  );
};

export default Home;
