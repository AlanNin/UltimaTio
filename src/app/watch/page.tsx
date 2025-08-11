"use client";
import useMediaQuery from "~/hooks/use-media-query";
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
import { useQuery } from "@tanstack/react-query";
import { getQueryClient } from "~/hooks/get-query-client";

const Watch = () => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 854px)");
  const router = useRouter();
  const { currentProfile } = useSelector((state: any) => state.profile);
  const providers = ["VidSrcPro", "Smashy"];
  const [currentProvider, setCurrentProvider] = useState<string>(providers[0]!);
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const tmdbidParam = searchParams.get("tmdbid");
  const seasonParam = searchParams.get("season");
  const episodeParam = searchParams.get("episode");
  const currentTimeRef = useRef<any>();
  const contentDurationRef = useRef<any>();
  const queryClient = getQueryClient();

  if (!tmdbidParam) {
    router.push("/");
    return;
  }

  const { data: contentData, isLoading: isContentLoading } = useQuery({
    queryKey: [
      "watch-content",
      tmdbidParam,
      category,
      seasonParam,
      episodeParam,
    ],
    queryFn: () => {
      if (category === "movie") {
        return getContentMovie(Number(tmdbidParam)!);
      } else if (category === "tv") {
        return getContentTV(Number(tmdbidParam)!);
      } else if (category === "anime") {
        return getContentAnime(Number(tmdbidParam)!);
      }
      return null;
    },
  });

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

        queryClient.invalidateQueries({
          queryKey: [
            "watch-history",
            currentProfile ? currentProfile.id : undefined,
          ],
        });
      }
    } catch (error) {
      console.error("Error saving profile content progress:", error);
    } finally {
      callback();
    }
  };

  return (
    <section
      id="home"
      className={`w-full h-full min-h-screen relative max-w-[854px] m-auto ${
        isAboveMediumScreens ? "pb-10" : "pb-16"
      }`}
    >
      {isContentLoading ? (
        <div className={`flex w-full h-screen items-center justify-center`}>
          <Loading type="bars" />
        </div>
      ) : (
        <div className="h-full w-full flex flex-col items-center">
          <TopNav saveProfileProgress={saveProfileProgress} />
          <Player
            title={contentData.title}
            tmdbid={Number(tmdbidParam)}
            category={category}
            season={Number(seasonParam)}
            episode={Number(episodeParam)}
            year={String(new Date(contentData.date).getFullYear())}
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
                content={contentData}
                tmdbid={Number(tmdbidParam)!}
                category={category}
                currentSeason={Number(seasonParam)!}
                currentEpisode={Number(episodeParam)!}
                saveProfileProgress={saveProfileProgress}
                profileContent={contentData.profileContent}
              />
              <Seasons
                content={contentData}
                tmdbid={Number(tmdbidParam)!}
                category={category}
                currentSeason={Number(seasonParam)!}
                saveProfileProgress={saveProfileProgress}
              />
            </div>
          )}
          <Info
            content={contentData!}
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
