"use client";
import React, { useRef } from "react";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import { MediaPlayer, MediaProvider, type MediaPlayerInstance, Track } from "@vidstack/react";
import {
  DefaultAudioLayout,
  defaultLayoutIcons,
  DefaultVideoLayout,
} from '@vidstack/react/player/layouts/default';

type Props = {
  scrapData: any;
  title?: any;
  handleCurrentTimeUpdate: any;
  handleDurationUpdate: any;
  watchProgress: any;
};

const InternalPlayer: React.FC<Props> = ({ scrapData, title, handleCurrentTimeUpdate, handleDurationUpdate, watchProgress  }) => {

    // define player ref
    let playerRef = useRef<MediaPlayerInstance>(null);

    // define tracks
    const tracks = scrapData?.captions?.map((track: any) => ({
        ...track,
        src: track.file, // Renombrar 'file' a 'src'
        kind: track.kind === "captions" ? "subtitles" : track.kind, // Cambiar 'kind' si es 'captions'
        // Eliminamos la propiedad 'file'
        file: undefined
      }));

      // define url
    const url = scrapData?.decoded[0]?.file;

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
            title={title}
            src={url}
            autoPlay={true}
            onCanPlay={handlePlay}
            ref={playerRef}
            onTimeUpdate={() => handleCurrentTimeUpdate(playerRef.current?.currentTime)}
        >
            <MediaProvider>

            {tracks.map((track: any) => (
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
