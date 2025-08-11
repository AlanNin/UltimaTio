"use client";
import useMediaQuery from "~/hooks/useMediaQuery";
import { getHomeFeed } from "~/server/queries/tmdb.queries";
import { useEffect, useState } from "react";
import { Loading } from "~/utils/loading/loading";
import { getProfileHistory } from "~/server/queries/contentProfile.queries";
import { useSelector } from "react-redux";
import HomeCarousel from "~/components/carousel";
import Section from "~/components/section/section";

type Feed = {
  history?: any[];
  trending: any[];
  popular: any[];
  topRated: any[];
  upcoming: any[];
};

const Home = () => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 900px)");
  const { currentProfile } = useSelector((state: any) => state.profile);
  const [isLoading, setIsLoading] = useState(true);
  const [feed, setFeed] = useState<Feed>({
    history: [],
    trending: [],
    popular: [],
    topRated: [],
    upcoming: [],
  });

  useEffect(() => {
    const fetchFeed = async () => {
      setIsLoading(true);
      try {
        const [homeFeedResponse, profileHistoryResponse] = await Promise.all([
          getHomeFeed(),
          currentProfile ? getProfileHistory() : Promise.resolve(null),
        ]);

        setFeed({
          trending: homeFeedResponse.trending,
          popular: homeFeedResponse.popular,
          topRated: homeFeedResponse.topRated,
          upcoming: homeFeedResponse.upcoming,
          history: profileHistoryResponse || [],
        });
      } catch (error) {
        console.error("Error fetching home feed:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeed();
  }, [currentProfile]);

  return (
    <section
      id="home"
      className={`w-full h-full min-h-screen relative ${
        isAboveMediumScreens ? "pt-16 pb-10" : "pt-14 pb-16"
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
          <div
            className={`max-w-[1920px] m-auto ${
              isAboveMediumScreens ? "pt-10" : "pt-6"
            }`}
          >
            {feed.history && feed.history.length > 0 && (
              <Section
                text="Continue Watching"
                content={feed.history}
                history={true}
              />
            )}
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
