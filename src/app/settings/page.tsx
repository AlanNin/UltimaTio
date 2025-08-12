"use client";

import useMediaQuery from "~/hooks/use-media-query";
import MobileSettings from "./_mobile";
import DesktopSettings from "./_desktop";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Settings = () => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 900px)");
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  }, []);

  return (
    <section id="home" className="w-full h-full min-h-screen overflow-y-auto">
      {isAboveMediumScreens ? <DesktopSettings /> : <MobileSettings />}
    </section>
  );
};

export default Settings;
