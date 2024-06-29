import React from "react";
import useMediaQuery from "~/hooks/useMediaQuery";
import { Reveal } from "~/utils/framer-motion/reveal";
import TMDBIcon from "~/assets/TMDB.png";
import { PlayIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Props = {
  content: any;
  isCurrent: boolean;
};

const CarouselCard: React.FC<Props> = ({ content, isCurrent }) => {
  const isAboveSmallTablet = useMediaQuery("(min-width: 650px)");
  const isAboveMediumScreens = useMediaQuery("(min-width: 1180px)");
  const landscapeMobile = content.landscapeUrl.replace("original", "w780");
  const router = useRouter();

  const handleNavigate = () => {
    // HANDLE IF MOVIE OR TV (SERIES OR ANIME)
    router.push(`/movie/${content.tmdbid}`);
  };
  return (
    <div className="flex h-full w-full justify-center items-center overflow-hidden max-h-[675px]">
      <div className="relative w-full h-full">
        <img
          src={isAboveSmallTablet ? content?.landscapeUrl : landscapeMobile}
          alt="Content Image"
          loading="lazy"
          className={`object-cover w-full h-full`}
          style={{ backgroundPosition: "center" }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent via-50% to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F0F0F] via-transparent via-25% to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F0F0F] via-transparentvia-70% to-transparent pointer-events-none" />

        {isCurrent && (
          <>
            {isAboveMediumScreens ? (
              <>
                <div className="absolute bottom-[140px] left-[50px] flex flex-col p-10">
                  <Reveal delay={0.25}>
                    <>
                      <div>
                        <p className="text-md text-[#a7a7a7] font-medium">
                          {content?.ContentGenre.map(
                            (genre: any, index: number) => (
                              <span key={genre.id}>
                                {index > 0 &&
                                index < content.ContentGenre.length - 1
                                  ? ", "
                                  : ""}
                                {index === content.ContentGenre.length - 1 &&
                                index > 0
                                  ? " & "
                                  : ""}
                                {genre.genre.name.charAt(0).toUpperCase() +
                                  genre.genre.name.slice(1)}
                              </span>
                            )
                          )}
                        </p>
                        <div className="flex items-center gap-5">
                          <p className="text-6xl text-white">
                            {content?.title}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-7 items-center mt-1">
                        <p className="text-md text-[#c2c2c2] font-normal">
                          {content?.date &&
                            new Date(content.date).getFullYear()}
                        </p>

                        {content?.duration && (
                          <p className="text-base text-[#c2c2c2] font-normal">
                            {content?.duration &&
                              formatDuration(content.duration)}
                          </p>
                        )}

                        <div className="flex items-center justify-center gap-1.5">
                          <Image
                            alt="TMDB"
                            src={TMDBIcon}
                            className="w-6 h-6"
                          />
                          <p className="text-sm text-[#c2c2c2] font-medium">
                            {content?.rating.toFixed(1)}{" "}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 mb-10">
                        <p className="text-lg font-normal text-[#c2c2c2] max-w-[650px]">
                          {truncateText(content.description, 380)}
                        </p>
                      </div>

                      <div className="flex gap-6">
                        <div className="flex gap-3 items-center w-max rounded-2xl cursor-pointer transition-colors duration-500">
                          <PlayIcon
                            className="w-[40px] h-[40px] text-white fill-white bg-[#a35fe8] py-2.5 pl-2.5 pr-2 rounded-full"
                            strokeWidth={0.8}
                          />
                          <h1 className="text-2xl text-[#ebebeb]">
                            {" "}
                            Watch Now
                          </h1>
                        </div>
                        <div
                          className="flex gap-3 items-center justify-center w-max rounded-lg cursor-pointer transition-colors duration-500 bg-[rgba(131,74,189,0.4)] py-1 px-4"
                          onClick={handleNavigate}
                        >
                          <h1 className="text-lg text-[#ebebeb] font-medium">
                            More Info{" >"}
                          </h1>
                        </div>
                      </div>
                    </>
                  </Reveal>
                </div>
              </>
            ) : (
              <>
                {isAboveSmallTablet ? (
                  <div
                    className={`absolute bottom-[15px] left-[15px] flex flex-col p-10`}
                  >
                    <Reveal delay={0.25}>
                      <>
                        <div>
                          <p className="text-sm text-[#a7a7a7] font-medium">
                            {content?.ContentGenre.map(
                              (genre: any, index: number) => (
                                <span key={genre.id}>
                                  {index > 0 &&
                                  index < content.ContentGenre.length - 1
                                    ? ", "
                                    : ""}
                                  {index === content.ContentGenre.length - 1 &&
                                  index > 0
                                    ? " & "
                                    : ""}
                                  {genre.genre.name.charAt(0).toUpperCase() +
                                    genre.genre.name.slice(1)}
                                </span>
                              )
                            )}
                          </p>
                          <div className="flex items-center gap-5">
                            <p className="text-3xl text-white">
                              {content?.title}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-7 items-center mt-1">
                          <p className="text-sm text-[#c2c2c2] font-normal">
                            {content?.date &&
                              new Date(content.date).getFullYear()}
                          </p>

                          {content?.duration && (
                            <p className="text-sm text-[#c2c2c2] font-normal">
                              {content?.duration &&
                                formatDuration(content.duration)}
                            </p>
                          )}

                          <div className="flex items-center justify-center gap-1.5">
                            <Image
                              alt="TMDB"
                              src={TMDBIcon}
                              className="w-4 h-4"
                            />
                            <p className="text-sm text-[#c2c2c2] font-medium">
                              {content?.rating.toFixed(1)}{" "}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 mb-10">
                          <p className="text-md font-normal text-[#c2c2c2] max-w-[550px]">
                            {truncateText(content.description, 380)}
                          </p>
                        </div>

                        <div className="flex gap-6">
                          <div className="flex gap-3 items-center w-max rounded-2xl cursor-pointer transition-colors duration-500">
                            <PlayIcon
                              className="w-[35px] h-[35px] text-white fill-white bg-[#a35fe8] py-2 pl-2 pr-1.5 rounded-full"
                              strokeWidth={0.8}
                            />
                            <h1 className="text-lg text-[#ebebeb]">
                              {" "}
                              Watch Now
                            </h1>
                          </div>
                          <div
                            className="flex gap-3 items-center justify-center w-max rounded-lg cursor-pointer transition-colors duration-500 bg-[rgba(131,74,189,0.4)] py-0.5 px-3"
                            onClick={handleNavigate}
                          >
                            <h1 className="text-sm text-[#ebebeb] font-medium">
                              More Info{" >"}
                            </h1>
                          </div>
                        </div>
                      </>
                    </Reveal>
                  </div>
                ) : (
                  <>
                    <div className="absolute bottom-0 bg-black-100 flex flex-col p-5">
                      <Reveal delay={0.25}>
                        <>
                          <div>
                            <p className="text-xs text-[#bebebe] font-medium">
                              {content?.ContentGenre.map(
                                (genre: any, index: number) => (
                                  <span key={genre.id}>
                                    {index > 0 &&
                                    index < content.ContentGenre.length - 1
                                      ? ", "
                                      : ""}
                                    {index ===
                                      content.ContentGenre.length - 1 &&
                                    index > 0
                                      ? " & "
                                      : ""}
                                    {genre.genre.name.charAt(0).toUpperCase() +
                                      genre.genre.name.slice(1)}
                                  </span>
                                )
                              )}
                            </p>
                            <div className="flex items-center gap-3">
                              <p
                                className={`text-3xl text-white ${
                                  content?.title.length > 10 &&
                                  "text-xl max-w-[305px] truncate"
                                }`}
                              >
                                {content?.title}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-5">
                            <p className="text-xs text-[#c2c2c2] font-normal">
                              {content?.date &&
                                new Date(content.date).getFullYear()}
                            </p>

                            {content?.duration && (
                              <p className="text-xs text-[#c2c2c2] font-normal">
                                {content?.duration &&
                                  formatDuration(content.duration)}
                              </p>
                            )}

                            <div className="flex items-center justify-center gap-1.5">
                              <Image
                                alt="TMDB"
                                src={TMDBIcon}
                                className="w-4 h-4 object-cover"
                              />
                              <p className="text-xs text-[#d8d7d7] font-normal">
                                {content?.rating.toFixed(1)}{" "}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-4 items-center mt-4">
                            <div className="flex gap-2.5 items-center w-max h-max rounded-2xl cursor-pointer">
                              <PlayIcon
                                className="w-[24px] h-[24px] text-white fill-white bg-[#a35fe8] py-1.5 pl-1.5 pr-1 rounded-full"
                                strokeWidth={0.8}
                              />
                              <h1 className="text-sm text-[#ebebeb]">
                                Watch Now
                              </h1>
                            </div>
                            <div
                              className="flex gap-3 items-center justify-center h-max w-max rounded-lg cursor-pointer bg-[rgba(131,74,189,0.4)] py-1.5 px-2.5"
                              onClick={handleNavigate}
                            >
                              <h1 className="text-xs text-[#ebebeb] font-medium">
                                More Info{" >"}
                              </h1>
                            </div>
                          </div>
                        </>
                      </Reveal>
                    </div>
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + "...";
}

function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

export default CarouselCard;
