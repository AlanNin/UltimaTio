"use client";
import {
  HomeIcon,
  QueueListIcon,
  BookmarkIcon,
  PaperAirplaneIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";
import useMediaQuery from "~/hooks/useMediaQuery";

type Props = {};

const TopNav: React.FC<Props> = ({}) => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 854px)");
  const { currentProfile } = useSelector((state: any) => state.profile);
  const router = useRouter();
  return (
    <nav
      className={`w-full h-max flex items-center justify-center gap-5 px-6 ${
        isAboveMediumScreens ? "py-6" : "py-3"
      }`}
    >
      <HomeIcon
        width={36}
        height={36}
        strokeWidth={1}
        color="white"
        className="cursor-pointer p-1.5 hover:bg-[rgba(255,255,255,0.1)] rounded-full transition-colors duration-400 hover:fill-[rgba(255,255,255,0.8)]"
        onClick={() => {
          router.push("/");
        }}
      />
      <QueueListIcon
        width={36}
        height={36}
        strokeWidth={1}
        color="white"
        className="cursor-pointer p-1.5 hover:bg-[rgba(255,255,255,0.1)] rounded-full transition-colors duration-400 hover:fill-[rgba(255,255,255,0.8)]"
      />
      <PaperAirplaneIcon
        width={36}
        height={36}
        strokeWidth={1}
        color="white"
        className="cursor-pointer p-1.5 hover:bg-[rgba(255,255,255,0.1)] rounded-full transition-colors duration-400 hover:fill-[rgba(255,255,255,0.8)]"
      />
      <MagnifyingGlassIcon
        width={36}
        height={36}
        strokeWidth={1}
        color="white"
        className="cursor-pointer p-1.5 hover:bg-[rgba(255,255,255,0.1)] rounded-full transition-colors duration-400 hover:fill-[rgba(255,255,255,0.8)]"
      />
      {currentProfile ? (
        <img
          src={currentProfile.imgUrl}
          className="rounded-full object-cover h-[26px] w-[26px] cursor-pointer ml-1.5"
        />
      ) : (
        <UserCircleIcon
          width={36}
          height={36}
          strokeWidth={1}
          color="white"
          className="cursor-pointer p-1.5 hover:bg-[rgba(255,255,255,0.1)] rounded-full transition-colors duration-400 hover:fill-[rgba(255,255,255,0.8)]"
        />
      )}
    </nav>
  );
};

export default TopNav;
