"use client";
import useMediaQuery from "~/hooks/useMediaQuery";
import Section from "../_shared/section/section";
import { getFeedTV } from "~/server/queries/tv/tmdb.queries";
import { useEffect, useState } from "react";
import { Loading } from "~/utils/loading/loading";

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
    const fetchFeed = async () => {
      setIsLoading(true);
      try {
        const response = await getFeedTV();
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
        isAboveMediumScreens ? "pt-16 pb-10" : "pt-14 pb-16"
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
            {feed.airingTodayTV.length > 0 && (
              <Section text="Airing Today" content={feed.airingTodayTV} />
            )}
            {feed.onTheAirTV.length > 0 && (
              <Section text="On The Air" content={feed.onTheAirTV} />
            )}
            {feed.popularTV.length > 0 && (
              <Section text="Popular" content={feed.popularTV} />
            )}
            {feed.topRatedTV.length > 0 && (
              <Section text="Top Rated" content={feed.topRatedTV} />
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default Home;
