import { Loader2, SearchIcon, SearchXIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { RefObject } from "react";
import SearchCard from "./card";
import { cn } from "~/utils/cn";

export default function Search({
  mode,
  isSearching,
  setIsSearching,
  searchQuery,
  setSearchQuery,
  searchContainerRef,
  mobileSearchContainerRef,
  mobileSearchIconRef,
  searchInputRef,
  mobileSearchInputRef,
  isSearchResultsModalOpen,
  setIsSearchResultsModalOpen,
  searchContentData,
  isSearchContentLoading,
}: {
  mode: "desktop" | "mobile" | "mobiledropwdown";
  isSearching: boolean;
  setIsSearching: (value: boolean) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  searchContainerRef: RefObject<HTMLDivElement>;
  mobileSearchContainerRef: RefObject<HTMLDivElement>;
  mobileSearchIconRef: RefObject<SVGSVGElement>;
  searchInputRef: RefObject<HTMLInputElement>;
  mobileSearchInputRef: RefObject<HTMLInputElement>;
  isSearchResultsModalOpen: boolean;
  setIsSearchResultsModalOpen: (value: boolean) => void;
  searchContentData: any[];
  isSearchContentLoading: boolean;
}) {
  const router = useRouter();
  const location = usePathname();

  const handleGoToSearch = () => {
    if (searchQuery.length > 0) {
      router.push(`/search?query=${searchQuery}`);
      setIsSearching(false);
    } else {
      setIsSearching(!isSearching);
    }
  };

  const toggleSearch = () => {
    if (isSearching) {
      handleGoToSearch();
    } else {
      setIsSearching(!isSearching);
    }
  };

  const clearSearch = (type: string) => {
    setSearchQuery("");
    setIsSearchResultsModalOpen(false);
    if (type === "desktop" && searchInputRef.current) {
      searchInputRef.current.focus();
    }

    if (type === "mobile" && mobileSearchInputRef.current) {
      mobileSearchInputRef.current.focus();
    }
  };

  function renderSearchDesktop() {
    return (
      <div className="relative" ref={searchContainerRef}>
        <div
          className={`flex border-2 items-center justify-center transition-all duration-300 overflow-hidden gap-0 select-none ${
            isSearching
              ? "w-[275px] border-[#757575]/75 py-1 rounded"
              : "w-9 h-9 border-transparent"
          }`}
        >
          <div
            className={cn(
              "rounded-full cursor-pointer transition-all duration-300",
              !isSearching && "p-1.5 hover:bg-[rgba(255,255,255,0.08)]"
            )}
            onClick={toggleSearch}
          >
            <SearchIcon
              className={`size-5 stroke-current ${
                isSearching && "mx-2 size-4"
              }`}
              color={
                location.toLocaleLowerCase().includes("/search")
                  ? "#a35fe8"
                  : "white"
              }
              strokeWidth={1.5}
            />
          </div>

          {isSearching && (
            <>
              <input
                className="text-white w-full whitespace-nowrap bg-transparent text-sm placeholder:text-[#858383] outline-none"
                name="search"
                value={searchQuery}
                placeholder="Type here..."
                autoFocus
                autoComplete="off"
                ref={searchInputRef}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && handleGoToSearch) {
                    handleGoToSearch();
                  }
                }}
              />
              <button
                className={`text-[#a3a3a3] focus:outline-none px-2 ${
                  searchQuery.length > 0 ? "opacity-100" : "opacity-0"
                }`}
                onClick={() => clearSearch("desktop")}
              >
                x
              </button>
            </>
          )}
        </div>
        {isSearchResultsModalOpen && (
          <div className="absolute top-10 min-w-[275px] max-h-80 overflow-y-auto bg-[#0F0F0F] rounded-b-md w-full p-2">
            {isSearchContentLoading ? (
              <div className="w-full h-12 flex justify-center items-center">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            ) : Array.isArray(searchContentData) &&
              searchContentData.length > 0 ? (
              <>
                {searchContentData.map((content: any) => (
                  <SearchCard
                    key={content.id}
                    content={content}
                    onClick={() => setIsSearching(false)}
                  />
                ))}
              </>
            ) : (
              <div className="w-full h-12 flex justify-center items-center">
                <p className="text-sm text-white/75 text-center font-normal tracking-wide">
                  No results found
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  function renderSearchMobile() {
    const Icon = isSearching ? SearchXIcon : SearchIcon;

    return (
      <Icon
        className="h-4 w-auto stroke-current cursor-pointer select-none"
        color={
          isSearching || location.toLocaleLowerCase().includes("/search")
            ? "#a35fe8"
            : "white"
        }
        strokeWidth={1}
        onClick={() => setIsSearching(!isSearching)}
        ref={mobileSearchIconRef}
      />
    );
  }

  function renderSearchMobileDropDown() {
    return (
      <div
        className={`fixed z-40 flex flex-col top-12 w-full bg-[#0F0F0F] duration-300 overflow-hidden h-max`}
        ref={mobileSearchContainerRef}
      >
        <div className="w-full flex gap-x-4 items-center justify-center px-4 py-4">
          <div className="relative flex w-full">
            <input
              className="text-white w-full whitespace-nowrap text-sm placeholder:text-[#858383] outline-none bg-[rgba(48,48,48,0.3)] rounded-md py-2 px-4 pr-8"
              name="search"
              value={searchQuery}
              placeholder="Type here..."
              autoFocus
              autoComplete="off"
              ref={mobileSearchInputRef}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && handleGoToSearch) {
                  handleGoToSearch();
                }
              }}
            />
            <button
              className={`text-[#a3a3a3] focus:outline-none absolute right-0 top-[50%] translate-y-[-50%] p-3 ${
                searchQuery.length > 0 ? "opacity-100" : "opacity-0"
              }`}
              onClick={() => clearSearch("mobile")}
            >
              x
            </button>
          </div>

          <SearchIcon
            className="size-5 w-auto stroke-current cursor-pointer"
            color={
              location.toLocaleLowerCase().includes("/search")
                ? "#a35fe8"
                : "white"
            }
            strokeWidth={1}
            onClick={handleGoToSearch}
          />
        </div>
        {isSearchResultsModalOpen && (
          <div className="rounded w-full overflow-y-auto overscroll-contain px-4 pb-4 h-[calc(100dvh-116px)]">
            {isSearchContentLoading ? (
              <div className="w-full h-40 flex justify-center items-center">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : Array.isArray(searchContentData) &&
              searchContentData.length > 0 ? (
              <div className="flex flex-col gap-y-4 ">
                {searchContentData.map((content: any) => (
                  <SearchCard
                    key={content.id}
                    content={content}
                    isMobile={true}
                    onClick={() => setIsSearching(false)}
                  />
                ))}
              </div>
            ) : (
              <div className="w-full h-40 flex justify-center items-center">
                <p className="text-sm text-white/75 text-center font-normal tracking-wide">
                  No results found
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      {mode === "desktop" && renderSearchDesktop()}
      {mode === "mobile" && renderSearchMobile()}
      {mode === "mobiledropwdown" && renderSearchMobileDropDown()}
    </>
  );
}
