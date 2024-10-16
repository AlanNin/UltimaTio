"use client";

import useMediaQuery from "~/hooks/useMediaQuery";
import MobileSettings from "./_mobile";
import DesktopSettings from "./_desktop";

const Settings = () => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 900px)");

  return (
    <section id="home" className="w-full h-full min-h-screen overflow-y-auto">
      {isAboveMediumScreens ? <DesktopSettings /> : <MobileSettings />}
    </section>
  );
};

export default Settings;
