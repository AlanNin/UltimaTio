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
  url: any;
  videoPoster?: any;
  title?: any;
  tracks?: any;
};

const VidStackPlayer: React.FC<Props> = ({ url, videoPoster, title, tracks }) => {
  let player = useRef<MediaPlayerInstance>(null);

  const handlePlay = () => {
    player.current?.play();
  };

  return (
    <div className="w-screen h-screen">

      <MediaPlayer
        title={title}
        src={url}
        poster={videoPoster}
        autoPlay={true}
        onCanPlay={handlePlay}
        ref={player}
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

export default VidStackPlayer;
