"use client";
import DesktopItem from "./item";
import {
  WrenchScrewdriverIcon,
  PlayIcon,
  PhotoIcon,
  BellIcon,
  ShieldCheckIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
import Logo from "~/assets/icons/ultimatio-logo.png";
import Link from "next/link";

const DesktopSettings = () => {
  return (
    <section
      id="home"
      className="w-full h-full overflow-y-auto max-w-[1120px] mx-auto"
    >
      {/* NAVBAR */}
      <div
        className={`flex flex-col w-full items-center py-10 gap-12 shadow-md border-b border-white border-opacity-5`}
      >
        <Link href="/">
          <img
            alt="logo"
            src={Logo.src}
            className="w-[52px] h-auto cursor-pointer"
          />
        </Link>
        <div className="flex justify-between w-full px-14">
          <DesktopItem Text={"General"} Icon={WrenchScrewdriverIcon} />
          <DesktopItem Text={"Player"} Icon={PlayIcon} />
          <DesktopItem Text={"Layout"} Icon={PhotoIcon} />
          <DesktopItem Text={"Notifications"} Icon={BellIcon} />
          <DesktopItem Text={"Account"} Icon={ShieldCheckIcon} />
          <DesktopItem Text={"Membership"} Icon={WalletIcon} />
        </div>
      </div>
    </section>
  );
};

export default DesktopSettings;
