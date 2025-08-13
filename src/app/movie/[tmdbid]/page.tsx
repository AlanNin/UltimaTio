"use client";
import useMediaQuery from "~/hooks/use-media-query";
import { useParams, useRouter } from "next/navigation";
import { getContentMovie } from "~/server/queries/movie/tmdb.queries";
import { Loading } from "~/utils/loading/loading";
import TopSection from "~/components/content/topSection";
import CastSection from "~/components/content/castSection";
import SimilarSection from "~/components/content/similarSection";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

const Content = () => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 900px)");
  const isAboveMobileScreens = useMediaQuery("(min-width: 770px)");
  const { tmdbid } = useParams();
  const router = useRouter();
  const { currentProfile } = useSelector((state: any) => state.profile);

  if (!tmdbid || isNaN(Number(tmdbid))) {
    router.replace("/movie");
    return;
  }

  const { data: contentData, isLoading: isContentLoading } = useQuery({
    queryKey: ["content", tmdbid, currentProfile?.id],
    queryFn: () => getContentMovie(parseInt(tmdbid as string, 10)),
    staleTime: 1000 * 60 * 15,
  });

  return (
    <section id="content">
      {isContentLoading ? (
        <div
          className={`flex w-full h-screen items-center justify-center ${
            isAboveMediumScreens ? "my-[-56px]" : "my-[-76px]"
          } `}
        >
          <Loading type="bars" />
        </div>
      ) : (
        <div
          className={`w-full h-full min-h-screen relative max-w-[1920px] m-auto overflow-x-clip ${
            isAboveMediumScreens ? "pt-[60px] pb-10" : "pt-[69px] pb-24"
          }`}
        >
          <TopSection content={contentData} isLoading={isContentLoading} />
          <div className={`${isAboveMobileScreens ? "px-8" : "px-4"}`}>
            <CastSection cast={contentData.ContentActor} />
            {contentData.similarContent &&
              contentData.similarContent.length > 0 && (
                <SimilarSection content={contentData.similarContent} />
              )}
          </div>
        </div>
      )}
    </section>
  );
};

export default Content;
