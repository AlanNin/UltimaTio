"use client";
import useMediaQuery from "~/hooks/use-media-query";
import { useParams } from "next/navigation";
import { getContentAnime } from "~/server/queries/anime/tmdb.queries";
import { useRouter } from "next/navigation";
import { Loading } from "~/utils/loading/loading";
import TopSection from "~/components/content/topSection";
import CastSection from "~/components/content/castSection";
import SimilarSection from "~/components/content/similarSection";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import EpisodeCard from "~/components/content/season&EpisodeSection/episodeCard";

const Content = () => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 900px)");
  const isAboveMobileScreens = useMediaQuery("(min-width: 770px)");
  const { anilistid } = useParams();
  const router = useRouter();
  const { currentProfile } = useSelector((state: any) => state.profile);

  if (!anilistid || isNaN(Number(anilistid))) {
    router.replace("/anime");
    return;
  }

  const { data: contentData, isLoading: isContentLoading } = useQuery({
    queryKey: ["content", anilistid, currentProfile?.id],
    queryFn: () => getContentAnime(parseInt(anilistid as string, 10)),
    staleTime: 1000 * 60 * 15,
  });

  return (
    <section id="content">
      {isContentLoading ? (
        <div
          className={`flex h-screen w-full items-center justify-center ${
            isAboveMediumScreens ? "my-[-56px]" : "my-[-76px]"
          } `}
        >
          <Loading type="bars" />
        </div>
      ) : (
        <div
          className={`relative m-auto h-full min-h-screen w-full max-w-[1920px] overflow-x-clip ${
            isAboveMediumScreens ? "pb-10 pt-[60px]" : "pb-24 pt-[58px]"
          }`}
        >
          <TopSection content={contentData} isLoading={isContentLoading} />
          <div className={`${isAboveMobileScreens ? "px-8" : "px-4"}`}>
            <CastSection cast={contentData.ContentActor} />
            <div className="mt-2 grid items-stretch gap-4 pb-4 [grid-template-columns:repeat(auto-fill,minmax(320px,1fr))]">
              {contentData.episodes?.map((episode: any, index: number) => (
                <EpisodeCard
                  key={episode?.id ?? episode?.episodeNumber ?? index}
                  episode={episode}
                  content={contentData}
                />
              ))}
            </div>
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
