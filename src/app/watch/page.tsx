"use client";
import useMediaQuery from "~/hooks/useMediaQuery";
import { useState, useRef, useEffect } from "react";
import { Loading } from "~/utils/loading/loading";
import Player from "./_components/player";
import TopNav from "./_components/top-nav";
import { useRouter, useSearchParams } from "next/navigation";
import { getContentMovie } from "~/server/queries/movie/tmdb.queries";
import { getContentTV } from "~/server/queries/tv/tmdb.queries";
import { getContentAnime } from "~/server/queries/anime/tmdb.queries";
import Providers from "./_components/providers/providers";
import Episodes from "./_components/episodes/episodes";
import Seasons from "./_components/seasons/seasons";
import Info from "./_components/info";

const Watch = () => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 854px)");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const providers = ["Smashy", "VidSrcPro"];
  // const providers = ["Smashy", "VidSrcPro", "2Embed", "VidSrc"];
  const [currentProvider, setCurrentProvider] = useState<string>(providers[0]!);
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const tmdbidParam = searchParams.get("tmdbid");
  const seasonParam = searchParams.get("season");
  const episodeParam = searchParams.get("episode");
  const tmdbid = tmdbidParam ? parseInt(tmdbidParam) : null;
  const currentSeason = seasonParam ? parseInt(seasonParam) : null;
  const currentEpisode = episodeParam ? parseInt(episodeParam) : null;
  const [content, setContent] = useState<any>({});

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
          response = await getContentMovie(tmdbid!);
        } else if (category === "tv") {
          response = await getContentTV(tmdbid!);
        } else if (category === "anime") {
          response = await getContentAnime(tmdbid!);
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
          <TopNav />
          <Player
            tmdbid={tmdbid}
            category={category}
            season={currentSeason}
            episode={currentEpisode}
            provider={currentProvider}
          />
          <Providers
            providers={providers}
            currentProvider={currentProvider}
            setCurrentProvider={setCurrentProvider}
          />
          {(category === "tv" || category === "anime") && (
            <div className="w-full flex flex-col gap-4">
              <Episodes
                content={content}
                tmdbid={tmdbid!}
                category={category}
                currentSeason={currentSeason!}
                currentEpisode={currentEpisode!}
              />
              <Seasons
                content={content}
                tmdbid={tmdbid!}
                category={category}
                currentSeason={currentSeason!}
              />
            </div>
          )}
          <Info
            content={content!}
            season={currentSeason}
            episode={currentEpisode}
          />
        </div>
      )}
    </section>
  );
};

export default Watch;
