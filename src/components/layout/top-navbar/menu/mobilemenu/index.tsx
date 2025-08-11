import { useEffect, useState, useRef } from "react";
import useMediaQuery from "~/hooks/use-media-query";
import {
  XMarkIcon,
  UserIcon,
  Cog6ToothIcon,
  LanguageIcon,
  QuestionMarkCircleIcon,
  EnvelopeIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  CheckIcon,
  ArrowRightStartOnRectangleIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "~/providers/redux/user-slice";
import { quitProfile } from "~/providers/redux/profile-slice";
import Cookies from "js-cookie";

type Props = {
  setIsMobileMenuOpen: (boolean: false) => void;
  isMobileMenuOpen: boolean;
};

const MobileMenu: React.FC<Props> = ({
  setIsMobileMenuOpen,
  isMobileMenuOpen,
}) => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 900px)");
  const [isChangeLanguageOpen, setIsChangeLanguageOpen] = useState<boolean>(
    false
  );
  const changelanguageRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useSelector((state: any) => state.user);
  const { currentProfile } = useSelector((state: any) => state.profile);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        changelanguageRef.current &&
        !changelanguageRef.current.contains(event.target)
      ) {
        setIsChangeLanguageOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    setIsMobileMenuOpen(false);
    dispatch(logout());
    Cookies.remove("access_token");
    dispatch(quitProfile());
    Cookies.remove("currentProfile");
  };

  const handleChangeProfile = () => {
    setIsMobileMenuOpen(false);
    dispatch(quitProfile());
    Cookies.remove("currentProfile");
  };

  if (isAboveMediumScreens) {
    return null;
  }

  return (
    <section
      id="!m_accountMenu"
      className="fixed inset-0 w-full h-full overflow-y-auto flex flex-col justify-between bg-[#0F0F0F]"
    >
      <div className="p-4 flex items-center gap-6 text-base font-medium shadow-md border-b border-white border-opacity-5">
        <XMarkIcon
          className="text-white h-[28px] w-auto stroke-current cursor-pointer"
          strokeWidth={1}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        Account Menu
      </div>

      {currentUser && currentProfile ? (
        <div
          className={`px-4 py-6 flex flex-col gap-8 text-base font-light border-white`}
          style={{
            borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
          }}
        >
          <div
            className="flex items-center gap-6 text-base font-light cursor-pointer"
            onClick={handleLogout}
          >
            <ArrowRightStartOnRectangleIcon
              className="text-white h-[24px] w-auto stroke-current cursor-pointer"
              strokeWidth={1}
            />
            Logout
          </div>

          <div
            className="flex items-center gap-6 text-base font-light cursor-pointer"
            onClick={handleChangeProfile}
          >
            <UsersIcon
              className="text-white h-[24px] w-auto stroke-current cursor-pointer"
              strokeWidth={1}
            />
            Change Profile
          </div>
        </div>
      ) : (
        <Link href="/signin" onClick={() => setIsMobileMenuOpen(false)}>
          <div
            className={`px-4 py-6 flex items-center gap-6 text-base font-light border-white`}
            style={{
              borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
            }}
          >
            <UserIcon
              className="text-white h-[24px] w-auto stroke-current cursor-pointer"
              strokeWidth={1}
            />
            Sign In
          </div>
        </Link>
      )}

      <Link href="/settings">
        <div
          className={`px-4 py-6 flex items-center gap-6 text-base font-light border-white`}
          style={{
            borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
          }}
        >
          <Cog6ToothIcon
            className="text-white h-[24px] w-auto stroke-current cursor-pointer"
            strokeWidth={1}
          />
          Settings
        </div>
      </Link>

      <div
        className={`px-4 py-6 flex flex-col gap-8 text-base font-light border-white`}
        style={{
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        <Link href="/help">
          <div className="flex items-center gap-6 text-base font-light">
            <QuestionMarkCircleIcon
              className="text-white h-[24px] w-auto stroke-current cursor-pointer"
              strokeWidth={1}
            />
            Help
          </div>
        </Link>

        <Link href="/feedback">
          <div className="flex items-center gap-6 text-base font-light">
            <EnvelopeIcon
              className="text-white h-[24px] w-auto stroke-current cursor-pointer"
              strokeWidth={1}
            />
            Feedback
          </div>
        </Link>
      </div>

      <div className="flex items-center bottom-0 w-full justify-center gap-4 mt-auto mb-2">
        <h1 className="text-[12px] font-light">Privacy Policy</h1>
        <h1 className="text-[12px] font-light">·</h1>
        <h1 className="text-[12px] font-light">Terms and Conditions</h1>
      </div>

      {isChangeLanguageOpen && (
        <div className="absolute flex bg-[rgba(0,0,0,0.8)] w-full h-full inset-0 items-end justify-center">
          <div
            ref={changelanguageRef}
            className="flex flex-col py-5 pb-8 px-5 w-full rounded-xl gap-6 bg-[rgba(18,18,18)]"
          >
            <h1 className="font-base text-xl">Select App Language</h1>

            <div className="flex flex-col gap-6 mt-1">
              <div
                className={`flex gap-6 text-base font-light items-center cursor-pointer`}
                onClick={() => {}}
              >
                {/* {i18n.language === "en" && (
                  <CheckIcon className="text-white h-[19px] w-auto stroke-current mt-[-1px]" />
                )} */}
                English
              </div>

              <div
                className={`flex gap-6 text-base font-light items-center cursor-pointer`}
                onClick={() => {}}
              >
                {/* {i18n.language === "es" && (
                  <CheckIcon className="text-white h-[19px] w-auto stroke-current mt-[-1px]" />
                )} */}
                Spanish
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default MobileMenu;
