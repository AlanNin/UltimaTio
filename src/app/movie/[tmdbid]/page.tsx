"use client";
import useMediaQuery from "~/hooks/useMediaQuery";
import { useParams, useRouter } from "next/navigation";
import { getContentMovie } from "~/server/queries/movie/tmdb.queries";
import TopSection from "../../_content-components/topSection";
import CastSection from "../../_content-components/castSection";
import SimilarSection from "../../_content-components/similarSection";
import { useEffect, useState } from "react";
import { Loading } from "~/utils/loading/loading";

const Content = () => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 900px)");
  const isAboveMobileScreens = useMediaQuery("(min-width: 770px)");
  const { tmdbid } = useParams();
  const [content, setContent] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    if (!tmdbid || isNaN(Number(tmdbid))) {
      router.push("/movie");
      return;
    }
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        const response = await getContentMovie(parseInt(tmdbid as string, 10));
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
          isAboveMediumScreens ? "pt-14 pb-10" : "pt-11 pb-24"
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
              <SimilarSection content={content.similarContent} />
            </div>
          </>
        )}
      </section>
    </>
  );
};

export default Content;
