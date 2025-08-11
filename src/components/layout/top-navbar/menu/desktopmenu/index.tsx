import { useState } from "react";
import {
  Cog6ToothIcon,
  LanguageIcon,
  QuestionMarkCircleIcon,
  EnvelopeIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ArrowRightStartOnRectangleIcon,
  UsersIcon,
  GlobeAmericasIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "~/providers/redux/user-slice";
import { quitProfile } from "~/providers/redux/profile-slice";
import Cookies from "js-cookie";

type Props = {
  setIsDesktopMenuOpen: (boolean: boolean) => void;
  desktopMenuRef: React.RefObject<any>;
};

const DesktopMenu: React.FC<Props> = ({
  setIsDesktopMenuOpen,
  desktopMenuRef,
}) => {
  const { currentProfile } = useSelector((state: any) => state.profile);
  const dispatch = useDispatch();

  const handleLogout = () => {
    setIsDesktopMenuOpen(false);
    dispatch(logout());
    Cookies.remove("access_token");
    dispatch(quitProfile());
    Cookies.remove("currentProfile");
  };

  const handleChangeProfile = () => {
    setIsDesktopMenuOpen(false);
    dispatch(quitProfile());
    Cookies.remove("currentProfile");
  };

  return (
    <div
      ref={desktopMenuRef}
      className={`absolute flex flex-col gap-1 py-2.5 z-30 min-w-52  ${
        currentProfile ? "right-[40px] top-16" : "right-[145px] top-14"
      } rounded-lg shadow-[0_5px_60px_-12px_rgba(0,0,0,0.3)] bg-[#1c1c1c] text-white`}
    >
      <div className="flex flex-col pb-1">
        {currentProfile && (
          <>
            <div
              className="relative flex items-center gap-4 text-base cursor-pointer font-normal px-5 py-2.5 rounded-sm hover:bg-[rgba(255,255,255,0.1)]"
              onClick={handleLogout}
            >
              <ArrowRightStartOnRectangleIcon className="text-white h-[19px] w-auto stroke-current" />
              Logout
            </div>
            <div
              className="relative flex items-center gap-4 text-base cursor-pointer font-normal px-5 py-2.5 rounded-sm hover:bg-[rgba(255,255,255,0.1)]"
              onClick={handleChangeProfile}
            >
              <UsersIcon className="text-white h-[19px] w-auto stroke-current" />
              Change Profile
            </div>
          </>
        )}
        <Link href="/settings" onClick={() => setIsDesktopMenuOpen(false)}>
          <div className="relative flex items-center gap-4 text-base cursor-pointer font-normal px-5 py-2.5 rounded-sm hover:bg-[rgba(255,255,255,0.1)]">
            <Cog6ToothIcon className="text-white h-[19px] w-auto stroke-current" />
            Settings
          </div>
        </Link>
      </div>
      <div className="flex flex-col border-t border-white border-opacity-5 pt-2">
        <Link href="/help" onClick={() => setIsDesktopMenuOpen(false)}>
          <div className="relative flex items-center gap-4 text-base cursor-pointer font-normal px-5 py-2.5 rounded-sm hover:bg-[rgba(255,255,255,0.1)]">
            <QuestionMarkCircleIcon className="text-white h-[19px] w-auto stroke-current" />
            Help
          </div>
        </Link>
        <Link href="/feedback" onClick={() => setIsDesktopMenuOpen(false)}>
          <div className="relative flex items-center gap-4 text-base cursor-pointer font-normal px-5 py-2.5 rounded-sm hover:bg-[rgba(255,255,255,0.1)]">
            <EnvelopeIcon className="text-white h-[19px] w-auto stroke-current" />
            Feedback
          </div>
        </Link>
      </div>
    </div>
  );
};

export default DesktopMenu;
