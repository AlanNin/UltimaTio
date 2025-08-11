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
    router.push("/");
    return;
  }

  const { data: contentData, isLoading: isContentLoading } = useQuery({
    queryKey: ["search", query],
    queryFn: () => handleSearch(query!),
  });

  return (
    <section
      id="home"
      className={`w-full h-full min-h-screen relative max-w-[1920px] m-auto ${
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
          {contentData.length > 0 ? (
            <div className={`${isAboveMediumScreens ? "pt-10" : "pt-6"}`}>
              <h1
                className={`font-medium text-center ${
                  isAboveMediumScreens ? "text-xl mb-8" : "text-md mb-6  "
                }`}
              >
                Search results for{" "}
                <span className="text-[#a35fe8]">{query}</span>
              </h1>
              <div className="w-full h-full px-4 flex flex-wrap gap-4 justify-center items-center">
                {contentData.map((content: any) => (
                  <SearchCard key={content.id} content={content} />
                ))}
              </div>
            </div>
          ) : (
            <div
              className={`flex flex-col w-full h-screen items-center justify-center px-12 gap-4 ${
                isAboveMediumScreens ? "my-[-56px]" : "my-[-76px]"
              } `}
            >
              <h1
                className={`font-medium text-center ${
                  isAboveMediumScreens ? "text-2xl" : "text-md"
                }`}
              >
                No results found for{" "}
                <span className="text-[#a35fe8] ">{query}</span>
              </h1>

              <FaceFrownIcon
                className={`w-auto stroke-current text-[#a35fe8] ${
                  isAboveMediumScreens ? "h-28" : "h-16"
                }`}
              />
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default Search;
