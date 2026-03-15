"use client";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import useMediaQuery from "~/hooks/use-media-query";
import { Provider } from "../page";

type Props = {
  src: string;
  provider: Provider;
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
  provider,
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

  // Force autoplay by injecting the param into the src URL
  const autoplaySrc = (() => {
    try {
      const url = new URL(src);
      url.searchParams.set("autoplay", "1");
      url.searchParams.set("auto_play", "1");
      return url.toString();
    } catch {
      return src;
    }
  })();

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
      // ── VidEasy: sends MEDIA_DATA with a nested JSON string payload ─────
      if (provider === "VidEasy") {
        if (typeof event.data !== "string") return;

        let parsed: Record<string, any>;
        try {
          parsed = JSON.parse(event.data);
        } catch {
          return;
        }

        if (parsed.type !== "MEDIA_DATA") return;

        let mediaStore: Record<string, any>;
        try {
          mediaStore = JSON.parse(parsed.data);
        } catch {
          return;
        }

        // Match entry by tmdbId found in the src URL (e.g. "movie-1265609" or "tv-95479")
        const activeKey = Object.keys(mediaStore).find((key) => {
          const id = key.split("-")[1];
          return id !== undefined && src.includes(id);
        });
        if (!activeKey) return;
        const active = mediaStore[activeKey];

        const watched = Number(active?.progress?.watched) || 0;
        const duration =
          Number(active?.progress?.duration) || lastDurationRef.current;

        console.log(
          "[VidEasy] active:",
          active?.title,
          "| watched:",
          watched,
          "| duration:",
          duration,
        );

        push(watched, duration, true);
        return;
      }

      // ── All other providers (VidLink, etc.) ─────────────────────────────
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
  }, [
    src,
    provider,
    currentProfile,
    handleCurrentTimeUpdate,
    handleDurationUpdate,
  ]);

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
          src={autoplaySrc}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
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
