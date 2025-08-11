"use client";
import { HomeIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import Cookies from "js-cookie";
import { ArrowLeftCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useMediaQuery from "~/hooks/use-media-query";
import { quitProfile } from "~/providers/redux/profile-slice";

const TopNav: React.FC = () => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 869px)");
  const { currentProfile } = useSelector((state: any) => state.profile);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleChangeProfile = () => {
    dispatch(quitProfile());
    Cookies.remove("currentProfile");
  };

  return (
    <nav
      className={`w-full h-max flex items-center justify-center gap-5 px-6 ${
        isAboveMediumScreens ? "py-6" : "py-3"
      }`}
    >
      <ArrowLeftCircle
        width={36}
        height={36}
        strokeWidth={1}
        color="white"
        className="cursor-pointer p-1.5 hover:bg-[rgba(255,255,255,0.1)] rounded-full transition-colors duration-400"
        onClick={() => router.back()}
      />
      <Link href="/">
        <HomeIcon
          width={36}
          height={36}
          strokeWidth={1}
          color="white"
          className="cursor-pointer p-1.5 hover:bg-[rgba(255,255,255,0.1)] rounded-full transition-colors duration-400"
        />
      </Link>

      {currentProfile ? (
        <div className="p-1.5 flex items-center justify-center rounded-full hover:bg-[rgba(255,255,255,0.1)] cursor-pointer">
          <img
            src={currentProfile.imgUrl}
            className="rounded-full object-cover size-[26px]"
            onClick={handleChangeProfile}
          />
        </div>
      ) : (
        <Link href="/signin">
          <UserCircleIcon
            width={36}
            height={36}
            strokeWidth={1}
            color="white"
            className="cursor-pointer p-1.5 hover:bg-[rgba(255,255,255,0.1)] rounded-full transition-colors duration-400"
          />
        </Link>
      )}
    </nav>
  );
};

export default TopNav;
