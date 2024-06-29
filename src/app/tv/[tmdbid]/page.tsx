"use client";
import useMediaQuery from "~/hooks/useMediaQuery";
import { useParams } from "next/navigation";
import { getContentTV } from "~/server/queries/tmdb.queries";
import TopSection from "../../_content-components/topSection";
import CastSection from "../../_content-components/castSection";
import SimilarSection from "../../_content-components/similarSection";
import SeasonAndEpisodeSection from "../../_content-components/season&EpisodeSection";
import { useEffect, useState } from "react";

const Content = () => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 900px)");
  const isAboveMobileScreens = useMediaQuery("(min-width: 770px)");
  const { tmdbid } = useParams();
  const [content, setContent] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!tmdbid) return;

    const fetchContent = async () => {
      setIsLoading(true);
      const id = parseInt(tmdbid as string, 10);
      if (!isNaN(id)) {
        const response = await getContentTV(id);
        setContent(response);
      }
      setIsLoading(false);
    };

    fetchContent();
  }, [tmdbid]);

  return (
    <>
      <section
        id="content"
        className={`w-full h-full min-h-screen relative max-w-[1920px] m-auto overflow-x-clip ${
          isAboveMediumScreens ? "pt-14 pb-10" : "pt-11 pb-16"
        }`}
      >
        {isLoading ? (
          <></>
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
