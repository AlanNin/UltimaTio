"use client";
import React, { useRef } from "react";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import { MediaPlayer, MediaProvider, type MediaPlayerInstance, Track, isGoogleCastProvider, type MediaProviderAdapter, type MediaProviderSetupEvent, } from "@vidstack/react";
import {
  DefaultAudioLayout,
  defaultLayoutIcons,
  DefaultVideoLayout,
} from '@vidstack/react/player/layouts/default';

type Props = {
  scrapData: any;
  title?: any;
  category?: any;
  season?: any;
  episode?: any;
  handleCurrentTimeUpdate: any;
  handleDurationUpdate: any;
  watchProgress: any;
};

const InternalPlayer: React.FC<Props> = ({ scrapData, title, category, season, episode, handleCurrentTimeUpdate, handleDurationUpdate, watchProgress  }) => {

    // define player ref
    let playerRef = useRef<MediaPlayerInstance>(null);

    // define tracks
    const tracks = scrapData?.stream.captions?.length
    ? scrapData.stream.captions?.map((track: any) => ({
        ...track,
        src: track.url, // Renombrar 'file' a 'src'
        kind:"subtitles",
        label: track.language,
        file: undefined,
        default: track.language.toLowerCase().includes("english")
      }))
    : [];

    // define url
    const url = scrapData?.stream?.playlist;

    // define handlePlay
    const handlePlay = () => {
        const videoPlayer = playerRef.current;
        handleDurationUpdate(videoPlayer?.duration)

        if (watchProgress && watchProgress > 0) {
            videoPlayer!.currentTime = watchProgress;
        }
        videoPlayer?.play();
    };

    return (
        <div className="w-full h-full">

        <MediaPlayer
            title={category === "movie" ? title : `${title} - S${season}E${episode}`}
            src={url}
            autoPlay={true}
            onCanPlay={handlePlay}
            ref={playerRef}
            onTimeUpdate={() => handleCurrentTimeUpdate(playerRef.current?.currentTime)}
            crossOrigin="anonymous"
            googleCast={{
              autoJoinPolicy: "origin-scope" as any,
              language: 'en-US',
              receiverApplicationId: '...',
            }}
        >
            <MediaProvider>

            {tracks.length > 0 &&
            tracks.map((track: any) => (
              <Track {...track} key={track.src} />
            ))}
            </MediaProvider>

            <DefaultAudioLayout icons={defaultLayoutIcons} />
            <DefaultVideoLayout
            icons={defaultLayoutIcons}
            />
        </MediaPlayer>

        </div>
    );
};

export default InternalPlayer;
