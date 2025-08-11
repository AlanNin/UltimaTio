"use client";
import useMediaQuery from "~/hooks/use-media-query";
import { useParams, useRouter } from "next/navigation";
import { getContentMovie } from "~/server/queries/movie/tmdb.queries";
import { Loading } from "~/utils/loading/loading";
import TopSection from "~/components/content/topSection";
import CastSection from "~/components/content/castSection";
import SimilarSection from "~/components/content/similarSection";
import { useQuery } from "@tanstack/react-query";

const Content = () => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 900px)");
  const isAboveMobileScreens = useMediaQuery("(min-width: 770px)");
  const { tmdbid } = useParams();
  const router = useRouter();

  if (!tmdbid || isNaN(Number(tmdbid))) {
    router.push("/movie");
    return;
  }

  const { data: contentData, isLoading: isContentLoading } = useQuery({
    queryKey: ["content-movie", tmdbid],
    queryFn: () => getContentMovie(parseInt(tmdbid as string, 10)),
    staleTime: 1000 * 60 * 15,
  });

  return (
    <>
      <section
        id="content"
        className={`w-full h-full min-h-screen relative max-w-[1920px] m-auto overflow-x-clip ${
          isAboveMediumScreens ? "pt-16 pb-10" : "pt-11 pb-24"
        }`}
      >
        {isContentLoading ? (
          <div
            className={`flex w-full h-screen items-center justify-center ${
              isAboveMediumScreens ? "my-[-56px]" : "my-[-76px]"
            } `}
          >
            <Loading type="bars" />
          </div>
        ) : (
          <>
            <TopSection content={contentData} isLoading={isContentLoading} />
            <div className={`${isAboveMobileScreens ? "px-8" : "px-4"}`}>
              <CastSection cast={contentData.ContentActor} />
              <SimilarSection content={contentData.similarContent} />
            </div>
          </>
        )}
      </section>
    </>
  );
};

export default Content;
