"use client";
import useMediaQuery from "~/hooks/use-media-query";

import { Loading } from "~/utils/loading/loading";
import { useRouter, useSearchParams } from "next/navigation";
import { FaceFrownIcon } from "@heroicons/react/24/outline";

import { useQuery } from "@tanstack/react-query";
import DefaultContentCard from "~/components/default-content-card";
import { search } from "~/server/queries/search.queries";

const Search = () => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 900px)");
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const router = useRouter();

  if (!query) {
    router.replace("/");
    return;
  }

  const { data: contentData = [], isLoading: isContentLoading } = useQuery({
    queryKey: ["search", query],
    queryFn: () => search(query!),
  });

  return (
    <section id="home">
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
          className={`relative m-auto flex h-full min-h-screen w-full max-w-[1920px] flex-col ${
            isAboveMediumScreens ? "p-10 pt-[60px]" : "px-4 pb-24 pt-[69px]"
          }`}
        >
          {contentData.length > 0 ? (
            <div className="flex flex-col gap-y-6 pt-6">
              <section className="flex flex-col">
                <h1
                  className={`font-medium ${
                    isAboveMediumScreens ? "text-2xl" : "text-lg"
                  }`}
                >
                  Search: <span className="text-[#a35fe8]">{query}</span>
                </h1>
                <span className="text-sm font-light text-[#c2c0c0]">
                  Found {contentData.length} results
                </span>
              </section>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-4 md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
                {contentData.map((content: any) => (
                  <DefaultContentCard key={content.id} content={content} />
                ))}
              </div>
            </div>
          ) : (
            <div className="m-auto flex flex-col items-center justify-center gap-4 self-center px-12">
              <h1
                className={`text-center font-medium ${
                  isAboveMediumScreens ? "text-2xl" : "text-md"
                }`}
              >
                No results found for{" "}
                <span className="text-[#a35fe8] ">{query}</span>
              </h1>

              <FaceFrownIcon
                className={`w-auto stroke-current text-[#a35fe8]/75 ${
                  isAboveMediumScreens ? "h-28" : "h-16"
                }`}
              />
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default Search;
