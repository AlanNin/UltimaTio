"use client";
import { useQuery } from "@tanstack/react-query";
import { Clapperboard } from "lucide-react";
import { useMemo, useState } from "react";
import DefaultContentCard from "~/components/default-content-card";
import { getLibrary } from "~/server/queries/contentLibrary.queries";
import { cn } from "~/utils/cn";
import { Loading } from "~/utils/loading/loading";

const WATCH_LISTS = ["Following", "Plan To Watch", "On Hold", "Completed"];

type Content = any;

type LibraryList = {
  id: string;
  name: string;
  content?: Content | Content[] | null;
};

export default function LibraryScreen() {
  const [currentWatchList, setCurrentWatchList] = useState<string>(
    WATCH_LISTS[0]!
  );

  const { data: libraryData, isLoading: isLibraryLoading } = useQuery({
    queryKey: ["library"],
    queryFn: () => getLibrary(),
    staleTime: 1000 * 60 * 15,
  });

  const currentLib: LibraryList | undefined = useMemo(
    () =>
      (libraryData as LibraryList[] | undefined)?.find(
        (lib) => lib.name === currentWatchList
      ),
    [libraryData, currentWatchList]
  );

  // ✅ Normalize `content` to an array
  const currentContent: Content[] = useMemo(() => {
    const raw = currentLib?.content;
    if (!raw) return [];
    return Array.isArray(raw) ? raw : [raw];
  }, [currentLib]);

  return (
    <main className="w-full h-full min-h-screen pt-[60px] pb-10 md-screen:pt-[69px] md-screen:pb-16 flex">
      {isLibraryLoading ? (
        <div className="flex w-full h-screen items-center justify-center my-[-76px] md-screen:my-[-56px]">
          <Loading type="bars" />
        </div>
      ) : (
        <div className="max-w-[1920px] mx-auto w-full h-full px-4 mb-screen:px-8 flex flex-col gap-y-4">
          <section className="flex gap-x-6 my-4 overflow-x-auto max-sm:pb-2">
            {WATCH_LISTS.map((watchList) => {
              const isActive = currentWatchList === watchList;
              return (
                <button
                  key={watchList}
                  className={cn(
                    "flex gap-x-2 items-center py-2 px-4 rounded-md transition-colors duration-300",
                    isActive
                      ? "bg-[rgba(124,38,212,1)]"
                      : "hover:bg-[rgba(124,38,212,0.3)]"
                  )}
                  onClick={() => setCurrentWatchList(watchList)}
                >
                  <span className="text-sm whitespace-nowrap">{watchList}</span>
                </button>
              );
            })}
          </section>

          {currentContent.length === 0 ? (
            <div className="mt-32 flex flex-col gap-y-6 items-center justify-center">
              <p className="font-normal italic tracking-wide">
                This watch list is empty. Try adding some content!
              </p>
              <Clapperboard className="size-8" strokeWidth={1} />
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
              {currentContent.map((content, i) => (
                <DefaultContentCard
                  key={
                    content.id ??
                    content.tmdb_id ??
                    (content.title ? `${content.title}-${i}` : `content-${i}`)
                  }
                  content={content}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
