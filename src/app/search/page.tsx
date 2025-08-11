"use client";
import useMediaQuery from "~/hooks/use-media-query";
import { handleSearch } from "~/server/queries/tmdb.queries";
import { Loading } from "~/utils/loading/loading";
import { useRouter, useSearchParams } from "next/navigation";
import { FaceFrownIcon } from "@heroicons/react/24/outline";
import SearchCard from "~/components/search/card";
import { useQuery } from "@tanstack/react-query";

const Search = () => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 900px)");
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const router = useRouter();

  if (!query) {
    router.replace("/");
    return;
  }

  const { data: contentData, isLoading: isContentLoading } = useQuery({
    queryKey: ["search", query],
    queryFn: () => handleSearch(query!),
  });

  return (
    <section id="home">
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
          className={`w-full h-full min-h-screen relative max-w-[1920px] m-auto flex flex-col ${
            isAboveMediumScreens ? "p-10 pt-16" : "px-4 pt-14 pb-24"
          }`}
        >
          {contentData.length > 0 ? (
            <div className="pt-6 flex flex-col gap-y-6">
              <section className="flex flex-col">
                <h1
                  className={`font-medium ${
                    isAboveMediumScreens ? "text-2xl" : "text-lg"
                  }`}
                >
                  Search: <span className="text-[#a35fe8]">{query}</span>
                </h1>
                <span className="font-light text-sm text-[#c2c0c0]">
                  Found {contentData.length} results
                </span>
              </section>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
                {contentData.map((content: any) => (
                  <SearchCard key={content.id} content={content} />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col self-center m-auto items-center justify-center px-12 gap-4">
              <h1
                className={`font-medium text-center ${
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
