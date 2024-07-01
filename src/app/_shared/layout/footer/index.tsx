"use client";

import Item from "./item";
import useMediaQuery from "~/hooks/useMediaQuery";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const Footer = () => {
  const flexBetween = "flex items-center justify-between";
  const isAboveMediumScreens = useMediaQuery("(min-width: 900px)");
  let location = usePathname();

  useEffect(() => {
    if (!location) {
      location = window.location.pathname;
    }
  }, []);

  if (
    location.toLowerCase() === "/settings" ||
    location.toLowerCase() === "/login" ||
    location.toLowerCase() === "/signup" ||
    location.toLowerCase() === "/watch"
  ) {
    return null;
  }

  return (
    <footer>
      {/* MOBILE MENU FOOTER MODAL */}
      {!isAboveMediumScreens && (
        <div
          className={`${flexBetween} fixed bottom-0 z-30 w-full bg-[#0F0F0F]`}
        >
          <div
            className={`${flexBetween} w-full gap-12 px-6 py-3 shadow-sm border-t border-white border-opacity-5`}
          >
            <Item name="Home" route="/" />
            <Item name="Movies" route="movie" />
            <Item name="TV" route="tv" />
            <Item name="Anime" route="anime" />
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
