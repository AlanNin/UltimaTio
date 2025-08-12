"use client";
import { useState, useEffect, useRef } from "react";
import {
  AdjustmentsHorizontalIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import Link from "next/link";
import Logo from "~/assets/icons/ultimatio-lighter.png";
import Item from "./item";
import useMediaQuery from "~/hooks/use-media-query";
import MobileMenu from "./menu/mobilemenu";
import DesktopMenu from "./menu/desktopmenu";
import { cn } from "~/utils/cn";
import { ListVideoIcon } from "lucide-react";
import Search from "./search/search";
import useDebounce from "~/hooks/use-debounce";
import { handleSearch } from "~/server/queries/tmdb.queries";
import { useQuery } from "@tanstack/react-query";

export default function TopNavbar() {
  const flexBetween = "flex items-center justify-between";
  const isAboveMediumScreens = useMediaQuery("(min-width: 900px)");
  const desktopMenuRef = useRef<HTMLDivElement>(null);
  const desktopMenuButtonRef = useRef<any>(null);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const { currentProfile } = useSelector((state: any) => state.profile);
  const location = usePathname();
  const [isTopOfPage, setIsTopOfPage] = useState<boolean>(true);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearchResultsModalOpen, setIsSearchResultsModalOpen] = useState<
    boolean
  >(false);
  const searchContainerRef = useRef<HTMLInputElement>(null);
  const mobileSearchContainerRef = useRef<any>(null);
  const mobileSearchIconRef = useRef<any>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const {
    data: searchContentData,
    isLoading: isSearchContentLoading,
  } = useQuery({
    queryKey: ["search", debouncedSearchQuery],
    queryFn: () => handleSearch(debouncedSearchQuery),
    enabled: debouncedSearchQuery.length > 0,
  });

  // MANAGE SCROLLING
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setIsTopOfPage(true);
      }
      if (window.scrollY !== 0) setIsTopOfPage(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // HANDLE CLICK OUTSIDE SEARCH
  useEffect(() => {
    if (!isSearching) return;

    const handlePointerDown = (e: Event) => {
      const target = e.target as Node | null;
      if (!target) return;

      const clickedInsideDesktop = !!searchContainerRef.current?.contains(
        target
      );

      const clickedInsideMobileIcon = !!mobileSearchIconRef?.current?.contains(
        target
      );

      const clickedInsideMobileDropDown = !!mobileSearchContainerRef.current?.contains(
        target
      );

      if (
        !clickedInsideDesktop &&
        !clickedInsideMobileDropDown &&
        !clickedInsideMobileIcon
      ) {
        setIsSearching(false);
      }
    };

    const supportsPointer =
      typeof window !== "undefined" && "PointerEvent" in window;

    if (supportsPointer) {
      document.addEventListener("pointerdown", handlePointerDown, {
        passive: true,
      });
    } else {
      document.addEventListener("mousedown", handlePointerDown, {
        passive: true,
      } as AddEventListenerOptions);
      document.addEventListener("touchstart", handlePointerDown, {
        passive: true,
      } as AddEventListenerOptions);
    }

    return () => {
      if (supportsPointer) {
        document.removeEventListener("pointerdown", handlePointerDown);
      } else {
        document.removeEventListener("mousedown", handlePointerDown);
        document.removeEventListener("touchstart", handlePointerDown);
      }
    };
  }, [isSearching]);

  // MANAGE OPEN SEARCH RESULTS MODAL
  useEffect(() => {
    if (searchQuery.length === 0) {
      setIsSearchResultsModalOpen(false);
      return;
    }

    if (searchQuery.length > 0) {
      setIsSearchResultsModalOpen(true);
      return;
    }
  }, [searchQuery]);

  useEffect(() => {
    if (!isSearching) {
      setIsSearchResultsModalOpen(false);
    }
    if (isSearching && searchQuery.length > 0) {
      if (isAboveMediumScreens) {
        setTimeout(() => {
          setIsSearchResultsModalOpen(true);
        }, 225);
      } else {
        setIsSearchResultsModalOpen(true);
      }
    }
  }, [isSearching]);

  useEffect(() => {
    if (isSearching && !isAboveMediumScreens) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSearching]);

  // HIDE ON
  if (
    location.toLowerCase() === "/settings" ||
    location.toLowerCase() === "/signin" ||
    location.toLowerCase() === "/signup" ||
    location.toLowerCase() === "/watch"
  ) {
    return null;
  }

  return (
    <nav
      className={cn(
        "bg-[#0F0F0F] fixed top-0 z-30 w-full left-0 right-0 mx-auto transition-colors border-b duration-300 border-transparent",
        !isTopOfPage && "shadow-md border-white/5"
      )}
    >
      <div
        className={`max-w-[1920px] m-auto gap-10 py-4 relative ${flexBetween}
        ${isAboveMediumScreens ? "px-10" : "px-4"}`}
      >
        {/* LEFT SIDE */}
        <Link href="/">
          <img
            alt="logo"
            src={Logo.src}
            className="h-[25px] w-auto cursor-pointer"
          />
        </Link>
        {isAboveMediumScreens ? (
          <>
            {/* DESKTOP */}
            <div className={`${flexBetween} w-full items-center`}>
              {/* INNER LEFT SIDE */}
              <div className={`${flexBetween} gap-8 text-sm mt-1`}>
                <Item name="Home" route="/" />
                <Item name="Movies" route="movie" />
                <Item name="TV Shows" route="tv" />
                <Item name="Anime" route="anime" />
              </div>
              {/* INNER RIGHT SIDE */}
              <div className={`${flexBetween} gap-6 relative`}>
                <Search
                  mode="desktop"
                  isSearching={isSearching}
                  setIsSearching={setIsSearching}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  searchContainerRef={searchContainerRef}
                  mobileSearchIconRef={mobileSearchIconRef}
                  mobileSearchContainerRef={mobileSearchContainerRef}
                  searchInputRef={searchInputRef}
                  mobileSearchInputRef={mobileSearchInputRef}
                  isSearchResultsModalOpen={isSearchResultsModalOpen}
                  setIsSearchResultsModalOpen={setIsSearchResultsModalOpen}
                  searchContentData={searchContentData}
                  isSearchContentLoading={isSearchContentLoading}
                />

                {!currentProfile && (
                  <AdjustmentsHorizontalIcon
                    className="h-7 w-7 stroke-current cursor-pointer rounded-2xl p-1 transition duration-150 text-white hover:bg-[rgba(255,255,255,0.08)]"
                    strokeWidth={1.5}
                    ref={desktopMenuButtonRef}
                    onClick={() => setIsDesktopMenuOpen(!isDesktopMenuOpen)}
                  />
                )}
                {currentProfile ? (
                  <>
                    <ListVideoIcon
                      className="size-8 text-white cursor-pointer ml-[-6.5px] rounded-2xl p-1 transition duration-300 hover:bg-[rgba(255,255,255,0.08)]"
                      strokeWidth={1.5}
                    />
                    <img
                      src={currentProfile.imgUrl}
                      className="h-9 w-9 rounded-full object-cover cursor-pointer"
                      ref={desktopMenuButtonRef}
                      onClick={() => setIsDesktopMenuOpen(!isDesktopMenuOpen)}
                    />
                  </>
                ) : (
                  <Link
                    href="/signin"
                    className="text-white px-5 py-1.5 rounded-md w-max mx-auto transition duration-500 p-2 bg-[#6C0386] hover:bg-[#510266]"
                  >
                    Sign in
                  </Link>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex gap-6 items-center">
            {/* RIGHT SIDE MOBILE */}
            <Search
              mode="mobile"
              isSearching={isSearching}
              setIsSearching={setIsSearching}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchContainerRef={searchContainerRef}
              mobileSearchContainerRef={mobileSearchContainerRef}
              mobileSearchIconRef={mobileSearchIconRef}
              searchInputRef={searchInputRef}
              mobileSearchInputRef={mobileSearchInputRef}
              isSearchResultsModalOpen={isSearchResultsModalOpen}
              setIsSearchResultsModalOpen={setIsSearchResultsModalOpen}
              searchContentData={searchContentData}
              isSearchContentLoading={isSearchContentLoading}
            />
            {currentProfile ? (
              <>
                <ListVideoIcon
                  className="w-5 h-5 text-white cursor-pointer"
                  strokeWidth={1}
                />
                <img
                  src={currentProfile.imgUrl}
                  className="rounded-full object-cover h-[26px] w-[26px] cursor-pointer"
                  onClick={() => setIsMobileMenuOpen(true)}
                />
              </>
            ) : (
              <UserCircleIcon
                className="text-white h-[26px] w-auto stroke-current cursor-pointer"
                strokeWidth={0.8}
                onClick={() => setIsMobileMenuOpen(true)}
              />
            )}
          </div>
        )}
        {isMobileMenuOpen && (
          <MobileMenu
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            isMobileMenuOpen={isMobileMenuOpen}
          />
        )}

        {isDesktopMenuOpen && (
          <DesktopMenu
            setIsDesktopMenuOpen={setIsDesktopMenuOpen}
            desktopMenuRef={desktopMenuRef}
          />
        )}
      </div>

      {isSearching && !isAboveMediumScreens && (
        <Search
          mode="mobiledropwdown"
          isSearching={isSearching}
          setIsSearching={setIsSearching}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchContainerRef={searchContainerRef}
          mobileSearchContainerRef={mobileSearchContainerRef}
          mobileSearchIconRef={mobileSearchIconRef}
          searchInputRef={searchInputRef}
          mobileSearchInputRef={mobileSearchInputRef}
          isSearchResultsModalOpen={isSearchResultsModalOpen}
          setIsSearchResultsModalOpen={setIsSearchResultsModalOpen}
          searchContentData={searchContentData}
          isSearchContentLoading={isSearchContentLoading}
        />
      )}
    </nav>
  );
}
