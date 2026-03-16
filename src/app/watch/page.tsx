"use client";
import useMediaQuery from "~/hooks/use-media-query";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { Loading } from "~/utils/loading/loading";
import Player from "./player/player";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getContentMovie } from "~/server/queries/movie/tmdb.queries";
import { getContentTV } from "~/server/queries/tv/tmdb.queries";
import { getContentAnime } from "~/server/queries/anime/tmdb.queries";
import TopNav from "~/components/watch/top-nav";
import Episodes from "~/components/watch/episodes/episodes";
import Seasons from "~/components/watch/seasons/seasons";
import Info from "~/components/watch/info";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { saveProfileContentProgress } from "~/server/queries/contentProfile.queries";
import { getQueryClient } from "~/hooks/get-query-client";
import Providers from "~/components/watch/providers/providers";
import { useQueryState } from "nuqs";
import { env } from "~/env";

export type Provider = "VidEasy" | "VidLink" | "VidSrcPro";

export default function WatchScreen() {
  const isAboveMediumScreens = useMediaQuery("(min-width: 854px)");
  const router = useRouter();
  const providers = ["VidEasy", "VidLink", "VidSrcPro"] as Provider[];
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const category = searchParams.get("category");
  const tmdbidParam = searchParams.get("tmdbid");
  const seasonParam = searchParams.get("season");
  const episodeParam = searchParams.get("episode");
  const currentTimeRef = useRef<number | null>();
  const contentDurationRef = useRef<number | null>();
  const { currentProfile } = useSelector((state: any) => state.profile);
  const queryClient = getQueryClient();
  const showProviders =
    env.NEXT_PUBLIC_SHOW_PROVIDERS === "true" ? true : false;

  const [currentProvider, setCurrentProvider] = useQueryState("provider", {
    defaultValue: providers[0] as string,
  });

  const {
    data: contentData,
    isLoading: isContentLoading,
    isError,
    refetch: refetchContent,
  } = useQuery({
    queryKey: [
      "watch-content",
      Number(tmdbidParam),
      category,
      Number(seasonParam),
      Number(episodeParam),
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

  const startAt = useMemo(() => {
    if (!contentData?.profileContent) return 0;

    return computeStartAt(
      contentData,
      category,
      seasonParam,
      episodeParam,
      !!currentProfile,
    );
  }, [category, seasonParam, episodeParam, !!contentData?.profileContent]);

  // Beacon-safe save: used on beforeunload/pagehide so the browser
  // does not cancel the request mid-flight during a reload.
  const beaconProgress = useCallback(() => {
    if (!currentProfile) return;
    const t = Number(currentTimeRef.current) || 0;
    const d = Number(contentDurationRef.current) || 0;
    if (t <= 0) return;

    const payload = JSON.stringify({
      tmdbid: Number(tmdbidParam) || 0,
      category: String(category),
      watched: t,
      duration: d,
      season: Number(seasonParam) || 0,
      episode: Number(episodeParam) || 0,
    });

    // sendBeacon is guaranteed to complete even during page unload
    navigator.sendBeacon(
      "/api/save-progress",
      new Blob([payload], { type: "application/json" }),
    );
  }, [currentProfile, tmdbidParam, category, seasonParam, episodeParam]);

  const flushProgress = useCallback(() => {
    if (!currentProfile) return;
    const t = Number(currentTimeRef.current) || 0;
    const d = Number(contentDurationRef.current) || 0;
    if (t <= 0) return;

    saveProfileContentProgress(
      Number(tmdbidParam) || 0,
      String(category),
      t,
      d,
      Number(seasonParam) || 0,
      Number(episodeParam) || 0,
    );

    refetchContent();
    queryClient.invalidateQueries({
      queryKey: [
        "watch-history",
        currentProfile ? currentProfile.id : undefined,
      ],
    });
    queryClient.invalidateQueries({
      queryKey: ["content", tmdbidParam, currentProfile?.id],
    });
  }, [
    currentProfile,
    currentProvider,
    tmdbidParam,
    category,
    seasonParam,
    episodeParam,
    queryClient,
  ]);

  useEffect(() => {
    const onHide = () => beaconProgress();
    const onVisibility = () => {
      if (document.visibilityState === "hidden") beaconProgress();
    };

    window.addEventListener("beforeunload", onHide);
    window.addEventListener("pagehide", onHide);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("beforeunload", onHide);
      window.removeEventListener("pagehide", onHide);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [beaconProgress]);

  useEffect(() => {
    return () => {
      flushProgress();
    };
  }, [pathname, searchParams.toString(), flushProgress]);

  useEffect(() => {
    return () => {
      flushProgress();
    };
  }, [flushProgress]);

  if (!tmdbidParam) {
    router.replace("/");
    return;
  }

  if (isError) {
    router.replace("/");
    return;
  }

  return (
    <section id="home">
      {isContentLoading ? (
        <div className={`flex h-screen w-full items-center justify-center`}>
          <Loading type="bars" />
        </div>
      ) : (
        <div
          className={`relative m-auto flex h-full min-h-screen w-full max-w-[854px] flex-col ${
            isAboveMediumScreens ? "pb-10" : "pb-16"
          }`}
        >
          <TopNav />

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
            startAt={startAt}
          />

          {showProviders && (
            <Providers
              currentProvider={currentProvider}
              providers={providers}
              saveProfileProgress={flushProgress}
              setCurrentProvider={setCurrentProvider}
            />
          )}

          {(category === "tv" || category === "anime") && (
            <div className="mb-6 mt-2 flex w-full flex-col gap-4">
              <Episodes
                content={contentData}
                tmdbid={Number(tmdbidParam)!}
                category={category}
                currentSeason={Number(seasonParam)!}
                currentEpisode={Number(episodeParam)!}
                profileContent={contentData.profileContent}
              />
              <Seasons
                content={contentData}
                tmdbid={Number(tmdbidParam)!}
                category={category}
                currentSeason={Number(seasonParam)!}
              />
            </div>
          )}
          <Info
            content={contentData!}
            season={Number(seasonParam)}
            episode={Number(episodeParam)}
          />
        </div>
      )}
    </section>
  );
}

function computeStartAt(
  contentData: any,
  category: string | null,
  seasonParam: string | null,
  episodeParam: string | null,
  currentProfileExists: boolean,
) {
  const isTV = category === "tv" || category === "anime";
  const seasonNum = Number(seasonParam);
  const episodeNum = Number(episodeParam);

  let start = 0;
  let duration = 0;

  if (!currentProfileExists) {
    try {
      const raw = localStorage.getItem("vidLinkProgress");
      if (raw) {
        const progressData = JSON.parse(raw);
        const stored = progressData?.[contentData.id];
        if (stored) {
          if (isTV) {
            const key = `s${seasonNum}e${episodeNum}`;
            const epProgress = stored.show_progress?.[key]?.progress;
            if (epProgress) {
              start = Number(epProgress.watched) || 0;
              duration = Number(epProgress.duration) || 0;
            }
          } else {
            const movieProgress = stored.progress;
            if (movieProgress) {
              start = Number(movieProgress.watched) || 0;
              duration = Number(movieProgress.duration) || 0;
            }
          }
        }
      }
    } catch (err) {
      console.error("Error leyendo progreso de localStorage", err);
    }
  }

  if (!contentData?.profileContent) return start;

  if (isTV) {
    const pc = contentData.profileContent.find(
      (p: any) =>
        Number(p.season) === seasonNum && Number(p.episode) === episodeNum,
    );
    if (pc) {
      start = Number(pc.watchProgress) || 0;
      duration = duration || Number(pc.duration) || 0;
    }
  } else {
    const pc =
      contentData.profileContent.find(
        (p: any) => p.season == null && p.episode == null,
      ) || contentData.profileContent[0];
    if (pc) {
      start = Number(pc.watchProgress) || 0;
      duration = duration || Number(pc.duration) || 0;
    }
  }

  if (!Number.isFinite(start) || start < 0) start = 0;
  if (!Number.isFinite(duration) || duration < 0) duration = 0;
  if (duration > 0 && start >= duration) start = Math.max(0, duration - 2);
  return start;
}
