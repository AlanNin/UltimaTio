"use client";
import useMediaQuery from "~/hooks/useMediaQuery";
import Section from "../_shared/section/section";
import { geFeedAnime } from "~/server/queries/anime/tmdb.queries";
import { useEffect, useState } from "react";

type Feed = {
  airingTodayTV: any[];
  onTheAirTV: any[];
  popularTV: any[];
  topRatedTV: any[];
};

const Home = () => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 900px)");

  const [isLoading, setIsLoading] = useState(true);
  const [feed, setFeed] = useState<Feed>({
    airingTodayTV: [],
    onTheAirTV: [],
    popularTV: [],
    topRatedTV: [],
  });
  useEffect(() => {
    setIsLoading(true);
    const fetchFeed = async () => {
      const response = await geFeedAnime();
      console.log(response);
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
            <Section text="Airing Today" content={feed.airingTodayTV} />
            <Section text="On The Air" content={feed.onTheAirTV} />
            <Section text="Popular" content={feed.popularTV} />
            <Section text="Top Rated" content={feed.topRatedTV} />
          </div>
        </>
      )}
    </section>
  );
};

export default Home;
