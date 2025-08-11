"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useMediaQuery from "~/hooks/use-media-query";

type Props = {
  src: any;
  provider: any;
  handleCurrentTimeUpdate: any;
  handleDurationUpdate: any;
};

const ExternalPlayer: React.FC<Props> = ({
  src,
  provider,
  handleCurrentTimeUpdate,
  handleDurationUpdate,
}) => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 869px)");
  const { currentProfile } = useSelector((state: any) => state.profile);
  const [, updateCurrentTime] = useState({});
  const [, updateCurrentDuration] = useState({});

  // UPDATE PROFILE CONTENT PROGRESS
  useEffect(() => {
    if (currentProfile === null) {
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.origin === new URL(src).origin && provider === "RabbitStream") {
        const data = JSON.parse(event.data);
        if (data.event === "time") {
          handleCurrentTimeUpdate(data.time);
          updateCurrentTime({});
          handleDurationUpdate(data.duration);
          updateCurrentDuration({});
        }
      } else if (
        event.origin === new URL(src).origin &&
        provider !== "RabbitStream"
      ) {
        const data = event.data;
        if (data.event === "time") {
          handleCurrentTimeUpdate(data.time);
          updateCurrentTime({});
        }
        if (data.event === "duration") {
          handleDurationUpdate(data.duration);
          updateCurrentDuration({});
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [src]);

  return (
    <div
      style={{
        position: "relative",
        paddingBottom: "56.25%",
        height: 0,
        background:
          "linear-gradient(180deg, rgb(143, 143, 143, 0.1), rgb(176, 176, 176, 0.1))",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <iframe
          src={src}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className={`${isAboveMediumScreens && "rounded-md"}`}
        />
      </div>
    </div>
  );
};

export default ExternalPlayer;
