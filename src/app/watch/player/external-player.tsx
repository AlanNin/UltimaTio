"use client";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import useMediaQuery from "~/hooks/use-media-query";

type Props = {
  src: string;
  handleCurrentTimeUpdate: (time: number) => void;
  handleDurationUpdate: (duration: number) => void;
};

type PlayerEvent = "play" | "pause" | "seeked" | "ended" | "timeupdate";

type PlayerEventData = {
  event: PlayerEvent;
  currentTime: number;
  duration: number;
  mtmdbId: number;
  mediaType: "movie" | "tv";
  season?: number;
  episode?: number;
};

type PlayerPayload = { type: "PLAYER_EVENT"; data: PlayerEventData };

const ExternalPlayer: React.FC<Props> = ({
  src,
  handleCurrentTimeUpdate,
  handleDurationUpdate,
}) => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 869px)");
  const { currentProfile } = useSelector((state: any) => state.profile);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const lastWatchedRef = useRef(0);
  const lastDurationRef = useRef(0);
  const lastSentAtRef = useRef(0);
  const MIN_INTERVAL_MS = 500;

  useEffect(() => {
    if (!currentProfile) return;

    let srcOrigin: string | null = null;
    try {
      srcOrigin = new URL(src).origin;
    } catch {
      srcOrigin = null;
    }

    const push = (watched: number, duration: number, force = false) => {
      const t = Number.isFinite(watched) ? watched : 0;
      const d = Number.isFinite(duration) ? duration : lastDurationRef.current;

      lastWatchedRef.current = t;
      lastDurationRef.current = d;

      const now = Date.now();
      if (force || now - lastSentAtRef.current >= MIN_INTERVAL_MS) {
        handleCurrentTimeUpdate(t);
        handleDurationUpdate(d);
        lastSentAtRef.current = now;
      }
    };

    const onMessage = (event: MessageEvent) => {
      const allowed =
        event.origin === "https://vidlink.pro" ||
        (srcOrigin && event.origin === srcOrigin);
      if (!allowed) return;

      const payload = event.data as PlayerPayload;
      if (!payload || payload.type !== "PLAYER_EVENT") return;

      const { event: ev, currentTime, duration } = payload.data;

      const force = ev !== "timeupdate";
      const time = ev === "ended" ? duration : currentTime;

      push(
        Number(time) || 0,
        Number(duration) || lastDurationRef.current,
        force,
      );
    };

    const flush = () => {
      handleCurrentTimeUpdate(lastWatchedRef.current);
      handleDurationUpdate(lastDurationRef.current);
    };

    window.addEventListener("message", onMessage);
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", flush);
    window.addEventListener("beforeunload", flush);

    return () => {
      flush();
      window.removeEventListener("message", onMessage);
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", flush);
      window.removeEventListener("beforeunload", flush);
    };
  }, [src, currentProfile, handleCurrentTimeUpdate, handleDurationUpdate]);

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
          ref={iframeRef}
          src={src}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className={isAboveMediumScreens ? "rounded-md" : undefined}
          onLoad={() => {
            try {
              iframeRef.current?.contentWindow?.postMessage(
                { type: "PLAYER_COMMAND", command: "play" },
                "*",
              );
            } catch {}
          }}
        />
      </div>
    </div>
  );
};

export default ExternalPlayer;
