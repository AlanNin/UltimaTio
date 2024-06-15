"use client";
import {
  ArrowLeftCircleIcon,
  WrenchScrewdriverIcon,
  PlayIcon,
  PhotoIcon,
  BellIcon,
  ShieldCheckIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import MobileItem from "./item";
import { useRouter } from "next/navigation";
import { useState } from "react";

const MobileSettings = () => {
  const router = useRouter();
  const [previousPath, setPreviousPath] = useState<string>("");

  const handleBack = () => {
    if (previousPath === `${window.location.origin}/`) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <section
      id="!m_accountMenu"
      className="absolute z-40 w-full h-full overflow-y-auto flex flex-col justify-between bg-[#0F0F0F]"
    >
      <div className="p-4 flex items-center gap-6 text-base font-medium shadow-md border-b border-white border-opacity-5 mb-3">
        <ArrowLeftCircleIcon
          className="text-white h-[28px] w-auto stroke-current cursor-pointer"
          strokeWidth={1}
          onClick={handleBack}
        />
        Settings
      </div>
      <MobileItem Text={"General"} Icon={WrenchScrewdriverIcon} />
      <MobileItem Text={"Player"} Icon={PlayIcon} />
      <MobileItem Text={"Layout"} Icon={PhotoIcon} />
      <MobileItem Text={"Notifications"} Icon={BellIcon} />
      <MobileItem Text={"Account"} Icon={ShieldCheckIcon} />
      <div className="mb-auto">
        <MobileItem Text={"Membership"} Icon={WalletIcon} />
      </div>
    </section>
  );
};

export default MobileSettings;
