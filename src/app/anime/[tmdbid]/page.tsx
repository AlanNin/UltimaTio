"use client";
import useMediaQuery from "~/hooks/useMediaQuery";
import { useParams } from "next/navigation";
import { getContentAnime } from "~/server/queries/anime/tmdb.queries";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loading } from "~/utils/loading/loading";
import TopSection from "~/components/content/topSection";
import CastSection from "~/components/content/castSection";
import SeasonAndEpisodeSection from "~/components/content/season&EpisodeSection";
import SimilarSection from "~/components/content/similarSection";

const Content = () => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 900px)");
  const isAboveMobileScreens = useMediaQuery("(min-width: 770px)");
  const { tmdbid } = useParams();
  const [content, setContent] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    if (!tmdbid || isNaN(Number(tmdbid))) {
      router.push("/anime");
      return;
    }
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        const response = await getContentAnime(parseInt(tmdbid as string, 10));
        setContent(response);
      } catch (error) {
        console.error("Error getting content -->:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [tmdbid]);

  return (
    <>
      <section
        id="content"
        className={`w-full h-full min-h-screen relative max-w-[1920px] m-auto overflow-x-clip ${
          isAboveMediumScreens ? "pt-16 pb-10" : "pt-11 pb-24"
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
            <TopSection content={content} isLoading={isLoading} />
            <div className={`${isAboveMobileScreens ? "px-8" : "px-4"}`}>
              <CastSection cast={content.ContentActor} />
              {content?.seasons && content?.seasons?.length > 0 && (
                <SeasonAndEpisodeSection
                  content={content}
                  isLoading={isLoading}
                />
              )}
              <SimilarSection content={content.similarContent} />
            </div>
          </>
        )}
      </section>
    </>
  );
};

export default Content;
