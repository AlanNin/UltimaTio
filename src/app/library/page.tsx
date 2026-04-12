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
    WATCH_LISTS[0]!,
  );

  const { data: libraryData, isLoading: isLibraryLoading } = useQuery({
    queryKey: ["library"],
    queryFn: () => getLibrary(),
    staleTime: 1000 * 60 * 15,
  });

  const currentLib: LibraryList | undefined = useMemo(
    () =>
      (libraryData as LibraryList[] | undefined)?.find(
        (lib) => lib.name === currentWatchList,
      ),
    [libraryData, currentWatchList],
  );

  const currentContent: Content[] = useMemo(() => {
    const raw = currentLib?.content;
    if (!raw) return [];
    return Array.isArray(raw) ? raw : [raw];
  }, [currentLib]);

  return (
    <main className="flex h-full min-h-screen w-full pb-10 pt-[60px] md-screen:pb-16 md-screen:pt-[69px]">
      {isLibraryLoading ? (
        <div className="my-[-76px] flex h-screen w-full items-center justify-center md-screen:my-[-56px]">
          <Loading type="bars" />
        </div>
      ) : (
        <div className="mx-auto flex h-full w-full max-w-[1920px] flex-col gap-y-4 px-4 mb-screen:px-8">
          <section className="my-4 flex gap-x-6 overflow-x-auto max-sm:pb-2">
            {WATCH_LISTS.map((watchList) => {
              const isActive = currentWatchList === watchList;
              return (
                <button
                  key={watchList}
                  className={cn(
                    "flex items-center gap-x-2 rounded-md px-4 py-2 transition-colors duration-300",
                    isActive
                      ? "bg-[rgba(124,38,212,1)]"
                      : "hover:bg-[rgba(124,38,212,0.3)]",
                  )}
                  onClick={() => setCurrentWatchList(watchList)}
                >
                  <span className="whitespace-nowrap text-sm">{watchList}</span>
                </button>
              );
            })}
          </section>

          {currentContent.length === 0 ? (
            <div className="mt-32 flex flex-col items-center justify-center gap-y-6">
              <p className="font-normal italic tracking-wide">
                This watch list is empty. Try adding some content!
              </p>
              <Clapperboard className="size-8" strokeWidth={1} />
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-4 md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
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
