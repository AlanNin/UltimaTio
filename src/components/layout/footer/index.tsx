"use client";
import Item from "./item";
import useMediaQuery from "~/hooks/use-media-query";
import { usePathname } from "next/navigation";

export default function Footer() {
  const flexBetween = "flex items-center justify-between";
  const isAboveMediumScreens = useMediaQuery("(min-width: 900px)");
  const pathname = usePathname() ?? "";

  const hidden =
    isAboveMediumScreens ||
    ["/settings", "/signin", "/signup"].includes(pathname.toLowerCase()) ||
    pathname.toLowerCase().startsWith("/watch");

  if (hidden) return null;

  return (
    <footer>
      <div className={`${flexBetween} fixed bottom-0 z-20 w-full bg-[#0F0F0F]`}>
        <div
          className={`${flexBetween} w-full gap-12 px-6 py-3 shadow-sm border-t border-white border-opacity-5`}
        >
          <Item name="Home" route="/" />
          <Item name="Movies" route="/movie" />
          <Item name="TV" route="/tv" />
          <Item name="Anime" route="/anime" />
        </div>
      </div>
    </footer>
  );
}
