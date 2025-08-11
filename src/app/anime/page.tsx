"use client";
import useMediaQuery from "~/hooks/useMediaQuery";
import { getFeedAnime } from "~/server/queries/anime/tmdb.queries";
import { useEffect, useState } from "react";
import { Loading } from "~/utils/loading/loading";
import Section from "~/components/section/section";

type Feed = {
  airingTodayAnime: any[];
  onTheAirAnime: any[];
  popularAnime: any[];
  topRatedAnime: any[];
};

const Home = () => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 900px)");

  const [isLoading, setIsLoading] = useState(true);
  const [feed, setFeed] = useState<Feed>({
    airingTodayAnime: [],
    onTheAirAnime: [],
    popularAnime: [],
    topRatedAnime: [],
  });

  useEffect(() => {
    const fetchFeed = async () => {
      setIsLoading(true);
      try {
        const response = await getFeedAnime();
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
            {feed.airingTodayAnime.length > 0 && (
              <Section text="Airing Today" content={feed.airingTodayAnime} />
            )}
            {feed.onTheAirAnime.length > 0 && (
              <Section text="On The Air" content={feed.onTheAirAnime} />
            )}
            {feed.popularAnime.length > 0 && (
              <Section text="Popular" content={feed.popularAnime} />
            )}
            {feed.topRatedAnime.length > 0 && (
              <Section text="Top Rated" content={feed.topRatedAnime} />
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default Home;
