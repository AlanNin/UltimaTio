"use client";
import { handleSearch } from "~/server/queries/tmdb.queries";
import { useEffect, useState } from "react";
import { Loading } from "~/utils/loading/loading";
import { useRouter, useSearchParams } from "next/navigation";
import VidStackPlayer from "./_components/player";
import { getTextTracks } from "./_components/tracks";

const Watch = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState<any>();
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const tmdbid = searchParams.get("tmdbid");
  const category = searchParams.get("category");
  const season = searchParams.get("season");
  const episode = searchParams.get("episode");
  const router = useRouter();

  useEffect(() => {
    if (title && tmdbid && category) {
      const fetchContent = async () => {
        setIsLoading(true);
        try {
        } catch (error) {
          //
        } finally {
          setIsLoading(false);
        }
      };
      fetchContent();
    } else {
      router.push("/");
    }
  }, []);

  return (
    <div className=""></div>
    //   <VidStackPlayer
    //   url={url}
    //   videoPoster={videoPoster}
    //   title={title}
    //   tracks={tracks}
    // />
  );
};

export default Watch;
