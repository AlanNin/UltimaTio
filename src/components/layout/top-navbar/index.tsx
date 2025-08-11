"use client";
import { useState, useEffect, useRef } from "react";
import {
  AdjustmentsHorizontalIcon,
  UserCircleIcon,
  MagnifyingGlassIcon,
  SquaresPlusIcon,
} from "@heroicons/react/24/outline";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Link from "next/link";
import Logo from "~/assets/icons/ultimatio-lighter.png";
import Item from "./item";
import Image from "next/image";
import useMediaQuery from "~/hooks/use-media-query";
import MobileMenu from "./menu/mobilemenu";
import DesktopMenu from "./menu/desktopmenu";
import { cn } from "~/utils/cn";

export default function TopNavbar() {
  const flexBetween = "flex items-center justify-between";
  const isAboveMediumScreens = useMediaQuery("(min-width: 900px)"); // HIDE NAVBAR
  const desktopMenuRef = useRef<HTMLDivElement>(null);
  const desktopMenuButtonRef = useRef<any>(null);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const { currentProfile } = useSelector((state: any) => state.profile);
  const location = usePathname();
  const [isTopOfPage, setIsTopOfPage] = useState<boolean>(true);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const mobielRef = useRef<any>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // INPUTS
  interface Inputs {
    search: string;
  }

  const [inputs, setInputs] = useState<Inputs>({
    search: "",
  });

  const handleChange = (e: any) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

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

  // HANDLE CLICK OUTSIDE
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      const isClickOnButton =
        desktopMenuButtonRef.current &&
        desktopMenuButtonRef.current.contains(event.target);
      if (
        desktopMenuRef.current &&
        !desktopMenuRef.current.contains(event.target) &&
        !isClickOnButton
      ) {
        setIsDesktopMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      const isClickOnSearch =
        searchRef.current && searchRef.current.contains(event.target);
      const isClickOnAnother =
        mobielRef.current && mobielRef.current.contains(event.target);

      if (searchRef.current && !isClickOnSearch && !isClickOnAnother) {
        setIsSearching(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // HANDLE SEARCH
  const handleSearch = () => {
    if (inputs.search.length > 0) {
      router.push(`/search?query=${inputs.search}`);
      setIsSearching(false);
    } else {
      setIsSearching(!isSearching);
    }
  };

  // TOGGLE SEARCH
  const toggleSearch = () => {
    if (isSearching) {
      handleSearch();
    } else {
      setIsSearching(!isSearching);
    }
  };

  const clearSearch = (type: string) => {
    setInputs({ ...inputs, search: "" });
    if (type === "desktop" && searchInputRef.current) {
      searchInputRef.current.focus();
    }

    if (type === "mobile" && mobileSearchInputRef.current) {
      mobileSearchInputRef.current.focus();
    }
  };

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
          <Image
            alt="logo"
            src={Logo}
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
                <div
                  className={`flex border-[2px] rounded transition-width duration-300 overflow-hidden gap-0 ${
                    isSearching
                      ? "w-[275px] border-[#757575] py-1"
                      : "w-7 border-transparent"
                  }`}
                  ref={searchRef}
                >
                  <MagnifyingGlassIcon
                    className={`text-white h-6 w-6 stroke-current cursor-pointer ${
                      isSearching && "mx-2"
                    }`}
                    strokeWidth={1.5}
                    onClick={toggleSearch}
                  />
                  {isSearching && (
                    <>
                      <input
                        className="text-white w-full whitespace-nowrap bg-transparent text-sm placeholder:text-[#858383] outline-none"
                        name="search"
                        value={inputs.search}
                        placeholder="Titles, actors or genres..."
                        autoFocus
                        autoComplete="off"
                        ref={searchInputRef}
                        onChange={(e) => {
                          handleChange(e);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && handleSearch) {
                            handleSearch();
                          }
                        }}
                      />
                      <button
                        className={`text-[#a3a3a3] focus:outline-none px-2 ${
                          inputs.search.length > 0 ? "opacity-100" : "opacity-0"
                        }`}
                        onClick={() => clearSearch("desktop")}
                      >
                        x
                      </button>
                    </>
                  )}
                </div>

                {!currentProfile && (
                  <AdjustmentsHorizontalIcon
                    className="h-7 w-7 stroke-current cursor-pointer rounded-2xl p-1 transition duration-150 text-white hover:bg-[rgba(255,255,255,0.1)]"
                    strokeWidth={1.5}
                    ref={desktopMenuButtonRef}
                    onClick={() => setIsDesktopMenuOpen(!isDesktopMenuOpen)}
                  />
                )}
                {currentProfile ? (
                  <>
                    <SquaresPlusIcon
                      className="w-[34px] h-[34px] text-white cursor-pointer ml-[-6.5px] rounded-2xl p-1.5 transition duration-300 hover:bg-[rgba(255,255,255,0.08)]"
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
            <MagnifyingGlassIcon
              className="h-5 w-auto stroke-current cursor-pointer"
              color={isSearching ? "#a35fe8" : "white"}
              strokeWidth={1}
              onClick={() => setIsSearching(!isSearching)}
              ref={mobielRef}
            />
            {currentProfile ? (
              <>
                <SquaresPlusIcon
                  className="w-5 h-5 text-white cursor-pointer ml-[-6px]"
                  strokeWidth={0.8}
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
        <div
          className={`fixed z-30 flex top-[40px] w-full bg-[#0F0F0F] duration-300 items-center justify-center overflow-hidden h-max p-4 px-6`}
          ref={searchRef}
        >
          <div className="relative flex w-full">
            <input
              className="text-white w-full whitespace-nowrap text-sm placeholder:text-[#858383] outline-none bg-[rgba(48,48,48,0.3)] rounded-md py-2 px-4 pr-8"
              name="search"
              value={inputs.search}
              placeholder="Titles, actors or genres..."
              autoFocus
              autoComplete="off"
              ref={mobileSearchInputRef}
              onChange={(e) => {
                handleChange(e);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && handleSearch) {
                  handleSearch();
                }
              }}
            />
            <button
              className={`text-[#858585] focus:outline-none absolute right-0 top-[50%] translate-y-[-50%] p-3 ${
                inputs.search.length > 0 ? "opacity-100" : "opacity-0"
              }`}
              onClick={() => clearSearch("mobile")}
            >
              x
            </button>
          </div>

          <MagnifyingGlassIcon
            className="h-6 w-auto stroke-current cursor-pointer ml-3"
            color={"white"}
            strokeWidth={1}
            onClick={handleSearch}
          />
        </div>
      )}
    </nav>
  );
}
