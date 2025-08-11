"use client";
import useMediaQuery from "~/hooks/useMediaQuery";
import { useState, useRef, useEffect } from "react";
import { Loading } from "~/utils/loading/loading";
import Player from "./player/player";
import { useRouter, useSearchParams } from "next/navigation";
import { getContentMovie } from "~/server/queries/movie/tmdb.queries";
import { getContentTV } from "~/server/queries/tv/tmdb.queries";
import { getContentAnime } from "~/server/queries/anime/tmdb.queries";
import { useSelector } from "react-redux";
import { saveProfileContentProgress } from "~/server/queries/contentProfile.queries";
import TopNav from "~/components/watch/top-nav";
import Providers from "~/components/watch/providers/providers";
import Episodes from "~/components/watch/episodes/episodes";
import Seasons from "~/components/watch/seasons/seasons";
import Info from "~/components/watch/info";

const Watch = () => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 854px)");
  const router = useRouter();
  const { currentProfile } = useSelector((state: any) => state.profile);
  const [isLoading, setIsLoading] = useState(true);
  const providers = ["VidSrcPro", "Smashy"];
  const [currentProvider, setCurrentProvider] = useState<string>(providers[0]!);
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const tmdbidParam = searchParams.get("tmdbid");
  const seasonParam = searchParams.get("season");
  const episodeParam = searchParams.get("episode");
  const [content, setContent] = useState<any>({});
  const currentTimeRef = useRef<any>();
  const contentDurationRef = useRef<any>();

  useEffect(() => {
    if (!tmdbidParam) {
      router.push("/");
      return;
    }

    const fetchContent = async () => {
      setIsLoading(true);
      try {
        let response;
        if (category === "movie") {
          response = await getContentMovie(Number(tmdbidParam)!);
        } else if (category === "tv") {
          response = await getContentTV(Number(tmdbidParam)!);
        } else if (category === "anime") {
          response = await getContentAnime(Number(tmdbidParam)!);
        }
        setContent(response);
      } catch (error) {
        console.error("Error getting content -->:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [tmdbidParam]);

  const reFetchContent = async () => {
    try {
      let response;
      if (category === "movie") {
        response = await getContentMovie(Number(tmdbidParam)!);
      } else if (category === "tv") {
        response = await getContentTV(Number(tmdbidParam)!);
      } else if (category === "anime") {
        response = await getContentAnime(Number(tmdbidParam)!);
      }
      setContent(response);
    } catch (error) {
      console.error("Error getting content -->:", error);
    }
  };

  const saveProfileProgress = (callback: () => void) => {
    try {
      if (currentProfile && currentTimeRef.current > 0) {
        saveProfileContentProgress(
          Number(tmdbidParam)!,
          String(category)!,
          Number(currentTimeRef.current),
          Number(contentDurationRef.current),
          Number(seasonParam)!,
          Number(episodeParam)!
        );
      }
    } catch (error) {
      console.error("Error saving profile content progress:", error);
    } finally {
      callback();
      reFetchContent();
    }
  };

  return (
    <section
      id="home"
      className={`w-full h-full min-h-screen relative max-w-[854px] m-auto ${
        isAboveMediumScreens ? "pb-10" : "pb-16"
      }`}
    >
      {isLoading ? (
        <div className={`flex w-full h-screen items-center justify-center`}>
          <Loading type="bars" />
        </div>
      ) : (
        <div className="h-full w-full flex flex-col items-center">
          <TopNav saveProfileProgress={saveProfileProgress} />
          <Player
            title={content.title}
            tmdbid={Number(tmdbidParam)}
            category={category}
            season={Number(seasonParam)}
            episode={Number(episodeParam)}
            year={String(new Date(content.date).getFullYear())}
            currentProvider={currentProvider}
            currentTimeRef={currentTimeRef}
            contentDurationRef={contentDurationRef}
          />
          <Providers
            providers={providers}
            currentProvider={currentProvider}
            setCurrentProvider={setCurrentProvider}
            saveProfileProgress={saveProfileProgress}
          />
          {(category === "tv" || category === "anime") && (
            <div className="w-full flex flex-col gap-4">
              <Episodes
                content={content}
                tmdbid={Number(tmdbidParam)!}
                category={category}
                currentSeason={Number(seasonParam)!}
                currentEpisode={Number(episodeParam)!}
                saveProfileProgress={saveProfileProgress}
                profileContent={content.profileContent}
              />
              <Seasons
                content={content}
                tmdbid={Number(tmdbidParam)!}
                category={category}
                currentSeason={Number(seasonParam)!}
                saveProfileProgress={saveProfileProgress}
              />
            </div>
          )}
          <Info
            content={content!}
            season={Number(seasonParam)}
            episode={Number(episodeParam)}
            saveProfileProgress={saveProfileProgress}
          />
        </div>
      )}
    </section>
  );
};

export default Watch;
