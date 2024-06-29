"use client";

import { useState, useEffect, useRef } from "react";
import {
  AdjustmentsHorizontalIcon,
  UserCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import Link from "next/link";
import Logo from "~/assets/UltimatioLogo_Lighter.png";
import Item from "./item";
import Image from "next/image";
import useMediaQuery from "~/hooks/useMediaQuery";
import MobileMenu from "./menu/mobilemenu";
import DesktopMenu from "./menu/desktopmenu";

const TopNavbar = () => {
  const flexBetween = "flex items-center justify-between";
  const isAboveMediumScreens = useMediaQuery("(min-width: 900px)"); // HIDE NAVBAR
  const desktopMenuRef = useRef<HTMLDivElement>(null);
  const desktopMenuButtonRef = useRef<any>(null);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const { currentProfile } = useSelector((state: any) => state.profile);
  const location = usePathname();
  const [isTopOfPage, setIsTopOfPage] = useState<boolean>(true);

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

  if (
    location.toLowerCase() === "/settings" ||
    location.toLowerCase() === "/login" ||
    location.toLowerCase() === "/signup" ||
    /^\/watch\/.*/.test(location.toLowerCase())
  ) {
    return null;
  }

  return (
    <nav>
      <div
        className={`${flexBetween} ${
          isAboveMediumScreens ? "px-12 " : "px-4"
        } fixed top-0 z-30 w-full gap-10 py-2.5 left-0 right-0 mx-auto bg-[#0F0F0F]
        ${!isTopOfPage && "shadow-md border-b border-white border-opacity-5"}`}
      >
        <>
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
              {/* RIGHT SIDE DESKTOP */}
              <div className={`${flexBetween} w-full items-center`}>
                {/* INNER LEFT SIDE */}
                <div className={`${flexBetween} gap-8 text-sm mt-1`}>
                  <Item name="Home" route="/" />
                  <Item name="Movies" route="movie" />
                  <Item name="TV Shows" route="tv" />
                  <Item name="Anime" route="anime" />
                  <Item name="K-Shows" route="kshow" />
                </div>
                {/* INNER RIGHT SIDE */}
                <div className={`${flexBetween} gap-8 relative`}>
                  {!currentProfile && (
                    <AdjustmentsHorizontalIcon
                      className="h-7 w-7 stroke-current cursor-pointer mr-[-7px] rounded-2xl p-1 transition duration-150 text-white hover:bg-[rgba(255,255,255,0.1)]"
                      strokeWidth={1}
                      ref={desktopMenuButtonRef}
                      onClick={() => setIsDesktopMenuOpen(!isDesktopMenuOpen)}
                    />
                  )}
                  {currentProfile ? (
                    <img
                      src={currentProfile.imgUrl}
                      className="h-9 w-9 rounded-full object-cover cursor-pointer"
                      ref={desktopMenuButtonRef}
                      onClick={() => setIsDesktopMenuOpen(!isDesktopMenuOpen)}
                    />
                  ) : (
                    <Link
                      href="/login"
                      className="text-white px-3.5 py-1.5 rounded w-max mx-auto transition duration-500 p-2 bg-[#6C0386] hover:bg-[#510266]"
                    >
                      <button>Sign in</button>
                    </Link>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex gap-6 items-center">
              {/* RIGHT SIDE MOBILE */}
              <MagnifyingGlassIcon
                className="text-white h-6 w-auto stroke-current cursor-pointer"
                strokeWidth={1}
              />
              {currentProfile ? (
                <img
                  src={currentProfile.imgUrl}
                  className="rounded-full object-cover 'h-[26px] w-[26px] cursor-pointer"
                  onClick={() => setIsMobileMenuOpen(true)}
                />
              ) : (
                <UserCircleIcon
                  className="text-white h-[26px] w-auto stroke-current cursor-pointer"
                  strokeWidth={0.8}
                  onClick={() => setIsMobileMenuOpen(true)}
                />
              )}
            </div>
          )}
        </>
      </div>
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
    </nav>
  );
};

export default TopNavbar;
