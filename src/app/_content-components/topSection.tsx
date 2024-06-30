"use client";
import useMediaQuery from "~/hooks/useMediaQuery";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  HandThumbUpIcon,
  HandThumbDownIcon,
} from "@heroicons/react/24/outline";
import {
  PlayIcon,
  SquaresPlusIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";

type Props = {
  content: any;
  isLoading: boolean;
};

const TopSection: React.FC<Props> = ({ content, isLoading }) => {
  const isAboveDesktopScreens = useMediaQuery("(min-width: 1100px)");
  const isAboveMobileScreens = useMediaQuery("(min-width: 770px)");
  const [showMore, setShowMore] = useState(false);
  const router = useRouter();

  const handleNavigateToWatch = () => {
    const isAMovie = content.category === "movie";

    if (isAMovie) {
      router.push("/watch/" + content.id);
    } else {
      router.push(
        "/watch/" +
          content.id +
          "/" +
          content.seasons[0].seasonNumber +
          "/" +
          content.seasons[0].episodes[0].episodeNumber
      );
    }
  };

  if (isLoading) {
    return;
  }

  return (
    <>
      <div
        className="flex w-full h-full items-center justify-center bg-cover relative"
        style={{
          backgroundImage: `url(${
            content!.landscapeUrl.includes("originalnull")
              ? content!.posterUrl
              : content!.landscapeUrl
          })`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0 bg-[rgba(0,0,0,0.75)] backdrop-blur-lg" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent via-5% to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F0F0F] via-transparent via-5% to-transparent pointer-events-none" />
        <div
          className={`flex w-max h-max z-10 ${
            isAboveMobileScreens ? "py-14" : "py-10"
          } px-6 gap-10 flex-wrap items-center justify-center`}
        >
          <div
            className={`flex justify-center flex-wrap ${
              !isAboveMobileScreens && "text-center"
            }`}
          >
            {/* POSTER */}
            <img
              src={content!.posterUrl}
              alt="Content Image"
              className="w-[158px] h-auto bg-cover drop-shadow-lg rounded-sm"
            />
            <div className="flex flex-col gap-1 h-full px-4">
              {isAboveMobileScreens && (
                <>
                  <div className="flex gap-2 mb-3">
                    <h1
                      className="text-sm font-light cursor-pointer text-white hover:text-[#b084db] transition-property:text duration-300"
                      onClick={() => router.push("/")}
                    >
                      Home
                    </h1>
                    <h1 className="text-sm font-light text-white">•</h1>
                    <h1
                      className="text-sm font-light capitalize cursor-pointer text-white hover:text-[#b084db] transition-property:text duration-500"
                      onClick={() => router.push("/" + content.category)}
                    >
                      {content.category === "tv" ? "TV" : content.category}
                    </h1>
                    <h1 className="text-sm font-light text-white">•</h1>
                    <h1 className="text-sm font-light text-[#acabab] capitalize">
                      {content!.title}
                    </h1>
                  </div>

                  {/* TITLE */}
                  <h1
                    className="text-4xl"
                    style={{
                      textShadow: "0px 10px 20px black",
                      wordWrap: "break-word",
                    }}
                  >
                    {content!.title}
                  </h1>
                </>
              )}

              {/* DESCRIPTION */}
              <p className="text-sm font-normal text-[#c2c2c2] max-w-[500px] mt-4">
                {isAboveMobileScreens || showMore ? (
                  <>
                    {content &&
                    content.description &&
                    content.description.length > 0 ? (
                      <>
                        {isAboveMobileScreens
                          ? content.description.slice(0, 520) + "..."
                          : content.description}
                        {!isAboveMobileScreens &&
                          content.description.length > 150 && (
                            <span
                              className="bg-[rgba(191,191,191,0.15)] rounded-xl py-0.5 px-2 font-light text-xs cursor-pointer ml-2 my-1"
                              style={{ whiteSpace: "nowrap" }}
                              onClick={() => setShowMore(!showMore)}
                            >
                              Show Less
                            </span>
                          )}
                      </>
                    ) : (
                      <span>No description found</span>
                    )}
                  </>
                ) : (
                  <>
                    {content?.description && content.description.length > 0 ? (
                      <>
                        {content.description.length > 150
                          ? content.description.slice(0, 150) + "..."
                          : content.description}
                        {content.description.length > 150 && (
                          <span
                            className="bg-[rgba(191,191,191,0.15)] rounded-xl py-0.5 px-2 font-light text-xs cursor-pointer ml-2 my-1"
                            style={{ whiteSpace: "nowrap" }}
                            onClick={() => setShowMore(!showMore)}
                          >
                            Show More
                          </span>
                        )}
                      </>
                    ) : (
                      <span>No description found</span>
                    )}
                  </>
                )}
              </p>
            </div>
          </div>
          {/* BUTTONS MOBILE*/}
          {!isAboveDesktopScreens && (
            <div className="flex basis-full flex-wrap gap-3 items-center justify-center">
              <div
                className="flex gap-2.5 items-center rounded-3xl cursor-pointer transition-colors duration-500 py-2 px-3.5 bg-[rgba(181,181,181,0.2)] hover:bg-[rgba(181,181,181,0.4)]"
                onClick={handleNavigateToWatch}
              >
                <PlayIcon
                  className="w-[20px] h-[20px] text-white fill-white"
                  strokeWidth={0.8}
                />
                <h1 className="text-sm text-[#ebebeb]"> Watch Now</h1>
              </div>
              <div className="flex gap-2.5 items-center rounded-3xl cursor-pointer transition-colors duration-500 py-2 px-3.5 bg-[rgba(181,181,181,0.2)] hover:bg-[rgba(181,181,181,0.4)]">
                <SquaresPlusIcon
                  className="w-[20px] h-[20px] text-white fill-white"
                  strokeWidth={0.8}
                />
                <h1 className="text-sm text-[#ebebeb]"> Add to Library </h1>
              </div>
              <div className="flex gap-2.5 items-center rounded-3xl cursor-pointer transition-colors duration-500 py-2 px-3.5 bg-[rgba(131,74,189,0.3)] hover:bg-[rgba(131,74,189,0.5)]">
                <UserGroupIcon
                  className="w-[20px] h-[20px] text-white fill-white"
                  strokeWidth={0.8}
                />
                <h1 className="text-sm text-[#ebebeb]"> Watch Party </h1>
              </div>
              <div className="flex bg-[rgba(181,181,181,0.2)] gap-2.5 items-center rounded-3xl py-2 px-3.5">
                <HandThumbUpIcon
                  className="w-[20px] h-[20px] text-white cursor-pointer"
                  strokeWidth={1.5}
                />
                <div className="w-px h-6 bg-[rgba(255,255,255,0.4)]"></div>
                {/* Línea vertical */}
                <HandThumbDownIcon
                  className="w-[20px] h-[20px] text-white cursor-pointer"
                  strokeWidth={1.5}
                />
              </div>
            </div>
          )}
          {/* DETAILS */}
          <div className="bg-[rgba(191,191,191,0.075)] rounded-md p-4 flex flex-col gap-4 w-auto">
            {content.duration && content.duration > 0 && (
              <h1 className="font-light text-xs flex">
                <p className="font-bold"> Duration: &nbsp;</p>
                {formatDuration(content.duration || content.episodeDuration)}
              </h1>
            )}
            <h1 className="font-light text-xs flex">
              <p className="font-bold"> Release Year: &nbsp;</p>
              {new Date(content.date).getFullYear()}
            </h1>
            <h1 className="font-light text-xs flex">
              <p className="font-bold"> TMDB Rating: &nbsp;</p>
              {content?.rating?.toFixed(1)}
            </h1>
            <div className="flex flex-wrap items-center max-w-[300px] gap-1">
              <h1 className="font-bold text-xs mr-1">Genres: </h1>
              {content?.ContentGenre?.map((genre: any, _index: number) => (
                <span
                  key={genre.id}
                  className="bg-[rgba(191,191,191,0.15)] rounded-xl py-1 px-2 font-light text-xs cursor-pointer"
                >
                  {genre &&
                    genre.genre.name.charAt(0).toUpperCase() +
                      genre.genre.name?.slice(1)}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap items-center max-w-[300px] gap-1">
              <h1 className="font-bold text-xs mr-1">Producers: </h1>
              {content?.ContentStudio?.map((studio: any, _index: number) => (
                <span
                  key={studio.id}
                  className="bg-[rgba(191,191,191,0.15)] rounded-xl py-1 px-2 font-light text-xs cursor-pointer"
                >
                  {studio &&
                    studio.studio.name.charAt(0).toUpperCase() +
                      studio.studio.name?.slice(1)}
                </span>
              ))}
            </div>
          </div>
          <div className="basis-full w-max items-center flex justify-center mt-2">
            {isAboveDesktopScreens && (
              <div className="flex flex-wrap gap-4 items-center">
                <div
                  className="flex gap-2.5 items-center rounded-3xl cursor-pointer transition-colors duration-500 py-2 px-3.5 bg-[rgba(181,181,181,0.2)] hover:bg-[rgba(181,181,181,0.4)]"
                  onClick={handleNavigateToWatch}
                >
                  <PlayIcon
                    className="w-[24px] h-[24px] text-white fill-white"
                    strokeWidth={0.8}
                  />
                  <h1 className="text-md text-[#ebebeb]"> Watch Now</h1>
                </div>
                <div className="flex gap-2.5 items-center rounded-3xl cursor-pointer transition-colors duration-500 py-2 px-3.5 bg-[rgba(181,181,181,0.2)] hover:bg-[rgba(181,181,181,0.4)]">
                  <SquaresPlusIcon
                    className="w-[24px] h-[24px] text-white fill-white"
                    strokeWidth={0.8}
                  />
                  <h1 className="text-md text-[#ebebeb]"> Add to Library </h1>
                </div>
                <div className="flex gap-2.5 items-center rounded-3xl cursor-pointer transition-colors duration-500 py-2 px-3.5 bg-[rgba(131,74,189,0.3)] hover:bg-[rgba(131,74,189,0.5)]">
                  <UserGroupIcon
                    className="w-[24px] h-[24px] text-white fill-white"
                    strokeWidth={0.8}
                  />
                  <h1 className="text-md text-[#ebebeb]"> Watch Party </h1>
                </div>
                <div className="flex bg-[rgba(181,181,181,0.2)] gap-2.5 items-center rounded-3xl py-2 px-3.5">
                  <HandThumbUpIcon
                    className="w-[24px] h-[24px] text-white cursor-pointer"
                    strokeWidth={1.5}
                  />
                  <div className="w-px h-6 bg-[rgba(255,255,255,0.4)]"></div>
                  {/* Línea vertical */}
                  <HandThumbDownIcon
                    className="w-[24px] h-[24px] text-white cursor-pointer"
                    strokeWidth={1.5}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

export default TopSection;
