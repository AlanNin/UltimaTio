"use client";
import useMediaQuery from "~/hooks/useMediaQuery";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  HandThumbUpIcon,
  HandThumbDownIcon,
} from "@heroicons/react/24/outline";
import {
  PlayIcon,
  SquaresPlusIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import { handleLikeOrDislike } from "~/server/queries/contentProfile.queries";
import AddLibraryModule from "./addLibraryModule";
import {
  addOrRemoveContentFromLibrary,
  getLibraryForContent,
} from "~/server/queries/contentLibrary.queries";

type Props = {
  content: any;
  isLoading: boolean;
};

const TopSection: React.FC<Props> = ({ content, isLoading }) => {
  const isAboveMobileScreens = useMediaQuery("(min-width: 900px)");
  const [showMore, setShowMore] = useState(false);
  const [likeStatus, setLikeStatus] = useState(content?.likeStatus || 0);
  const [openLibraryModal, setOpenLibraryModal] = useState(false);
  const router = useRouter();

  const watchPercentage =
    content?.profileContent?.[0]?.watchProgress &&
    content?.profileContent?.[0]?.duration
      ? Math.floor(
          (content.profileContent[0].watchProgress /
            content.profileContent[0].duration) *
            100
        )
      : 0;

  const handleNavigateToWatch = () => {
    const isAMovie = content.category === "movie";

    if (isAMovie) {
      router.push(
        `/watch?tmdbid=${content.tmdbid}&category=${content.category}`
      );
    } else {
      router.push(
        `/watch?tmdbid=${content.tmdbid}&category=${content.category}&season=1&episode=1`
      );
    }
  };

  const handleResumeWatching = () => {
    const isAMovie = content.category === "movie";

    if (isAMovie) {
      router.push(
        `/watch?tmdbid=${content.tmdbid}&category=${content.category}`
      );
    } else {
      router.push(
        `/watch?tmdbid=${content.tmdbid}&category=${content.category}&season=${
          content?.profileContent && content?.profileContent[0]?.season
        }&episode=${
          content?.profileContent && content?.profileContent[0]?.episode
        }`
      );
    }
  };

  const handleLikeOrDislikeButton = async (status: number) => {
    try {
      setLikeStatus(status === likeStatus ? 0 : status);
      const response = await handleLikeOrDislike(
        content.tmdbid,
        content.category,
        status
      );
      if (response.success) {
        setLikeStatus(response.likeStatus);
      } else {
        throw response.message;
      }
    } catch (error) {
      throw error;
    }
  };

  // HANDLE CLICK OUTSIDE
  const libraryModalRef = useRef<HTMLDivElement>(null);
  const libraryButtonRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      const isClickOnButton =
        libraryButtonRef.current &&
        libraryButtonRef.current.contains(event.target);
      if (
        libraryModalRef.current &&
        !libraryModalRef.current.contains(event.target) &&
        !isClickOnButton
      ) {
        setOpenLibraryModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  // LIBRARIES
  const [isLoadingLibraries, setIsLoadingLibraries] = useState(true);

  const [libraries, setLibraries] = useState([
    { name: "Following", added: false },
    { name: "Plan To Watch", added: false },
    { name: "On Hold", added: false },
    { name: "Completed", added: false },
  ]);

  useEffect(() => {
    const handleGetLibraryForContent = async () => {
      try {
        setIsLoadingLibraries(true);
        const response = await getLibraryForContent(
          content.tmdb_id,
          content.category
        );
        if (response && response.length > 0) {
          const updatedLibraries = libraries.map((library) => ({
            ...library,
            added: response.some((item: any) => item.name === library.name),
          }));
          setLibraries(updatedLibraries);
        } else {
          const updatedLibraries = libraries.map((library) => ({
            ...library,
            added: false,
          }));
          setLibraries(updatedLibraries);
        }
      } catch (error) {
        console.error("Error fetching library content:", error);
      } finally {
        setIsLoadingLibraries(false);
      }
    };

    handleGetLibraryForContent();
  }, [content.tmdb_id, content.category]);

  const handleAddToLibrary = async (library_name: string) => {
    try {
      setIsLoadingLibraries(true);
      await addOrRemoveContentFromLibrary(
        content.tmdb_id,
        content.category,
        library_name
      );

      const updatedLibraries = libraries.map((library) =>
        library.name === library_name
          ? { ...library, added: !library.added }
          : library
      );
      setLibraries(updatedLibraries);
    } catch (error) {
      console.error("Error adding/removing content:", error);
    } finally {
      setIsLoadingLibraries(false);
    }
  };

  // STOP MOBILE SCROLLING
  useEffect(() => {
    if (openLibraryModal && !isAboveMobileScreens) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openLibraryModal, isAboveMobileScreens]);

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
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-[rgba(0,0,0,0.75)] backdrop-blur-lg" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent via-5% to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F0F0F] via-transparent via-5% to-transparent pointer-events-none" />
        <div
          className={`flex  w-max h-max z-10 ${
            isAboveMobileScreens ? "py-14 flex-wrap" : "py-10 flex-col"
          } px-6 gap-10 items-center justify-center`}
        >
          <div
            className={`flex justify-center flex-wrap ${
              !isAboveMobileScreens && "text-center"
            }`}
          >
            {/* POSTER */}
            <div
              className={`${
                !isAboveMobileScreens &&
                "relative basis-full flex items-center justify-center"
              }`}
            >
              <img
                src={content!.posterUrl}
                className={`w-[158px] h-[240px] bg-cover drop-shadow-lg rounded-sm`}
                style={{
                  background:
                    "linear-gradient(180deg, rgb(143, 143, 143, 0.1), rgb(176, 176, 176, 0.1))",
                }}
              />
            </div>
            <div className="flex flex-col gap-1 h-full px-4 ">
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
                    className="text-4xl max-w-[550px]"
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
              <p className="text-sm font-normal text-[#c2c2c2] max-w-[550px] mt-4">
                {showMore ? (
                  <>
                    {content &&
                    content.description &&
                    content.description.length > 0 ? (
                      <>
                        {content.description}
                        {content.description.length >
                          (isAboveMobileScreens ? 520 : 150) && (
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
                        {content.description.length >
                        (isAboveMobileScreens ? 520 : 150)
                          ? content.description.slice(
                              0,
                              isAboveMobileScreens ? 520 : 150
                            ) + "..."
                          : content.description}
                        {content.description.length >
                          (isAboveMobileScreens ? 520 : 150) && (
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
          {!isAboveMobileScreens && (
            <div className="flex basis-full flex-wrap gap-3 items-center justify-center">
              <div
                className="relative flex gap-2.5 items-center rounded-3xl cursor-pointer transition-colors duration-500 py-2 px-3.5 bg-[rgba(181,181,181,0.2)] hover:bg-[rgba(181,181,181,0.4)] overflow-hidden"
                onClick={
                  content?.profileContent &&
                  content?.profileContent[0]?.watchProgress
                    ? handleResumeWatching
                    : handleNavigateToWatch
                }
              >
                <PlayIcon
                  className="w-[20px] h-[20px] text-white fill-white z-10"
                  strokeWidth={0.8}
                />
                <h1 className="text-sm text-[#ebebeb] z-10">
                  {content?.profileContent &&
                  content?.profileContent[0]?.watchProgress
                    ? `${
                        content.category === "movie"
                          ? "Continue Watching"
                          : `Continue Watching S${content?.profileContent[0]?.season}:E${content?.profileContent[0]?.episode}`
                      } `
                    : "Watch Now"}
                </h1>
                <div
                  className="absolute inset-0 w-full h-full bg-gradient-to-r from-[rgba(135,15,73,0.4)] to-[rgba(124,38,212,0.4)] z-0"
                  style={{ width: watchPercentage + "%" }}
                />
              </div>
              <div
                className="flex gap-2.5 items-center rounded-3xl cursor-pointer transition-colors duration-500 py-2 px-3.5 bg-[rgba(181,181,181,0.2)] hover:bg-[rgba(181,181,181,0.4)]"
                onClick={() => setOpenLibraryModal(true)}
              >
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
                  fill={likeStatus === 1 ? "white" : "transparent"}
                  onClick={() => handleLikeOrDislikeButton(1)}
                />
                <div className="w-px h-6 bg-[rgba(255,255,255,0.4)]"></div>
                <HandThumbDownIcon
                  className="w-[20px] h-[20px] text-white cursor-pointer"
                  strokeWidth={1.5}
                  fill={likeStatus === -1 ? "white" : "transparent"}
                  onClick={() => handleLikeOrDislikeButton(-1)}
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
            {isAboveMobileScreens && (
              <div className="flex flex-wrap gap-4 items-center">
                <div
                  className="relative flex gap-2.5 items-center rounded-3xl cursor-pointer transition-colors duration-500 py-2 px-3.5 bg-[rgba(181,181,181,0.2)] hover:bg-[rgba(181,181,181,0.4)] overflow-hidden"
                  onClick={
                    content?.profileContent &&
                    content?.profileContent[0]?.watchProgress
                      ? handleResumeWatching
                      : handleNavigateToWatch
                  }
                >
                  <PlayIcon
                    className="w-[24px] h-[24px] text-white fill-white z-10"
                    strokeWidth={0.8}
                  />
                  <h1 className="text-md text-[#ebebeb] z-10 select-none">
                    {content?.profileContent &&
                    content?.profileContent[0]?.watchProgress
                      ? `${
                          content.category === "movie"
                            ? "Continue Watching"
                            : `Continue Watching S${content?.profileContent[0]?.season}:E${content?.profileContent[0]?.episode}`
                        } `
                      : "Watch Now"}
                  </h1>
                  <div
                    className="absolute inset-0 w-full h-full bg-gradient-to-r from-[rgba(135,15,73,0.4)] to-[rgba(124,38,212,0.4)] z-0"
                    style={{ width: watchPercentage + "%" }}
                  />
                </div>
                <div className="relative">
                  <div
                    className={` flex gap-2.5 items-center rounded-3xl cursor-pointer transition-colors duration-500 py-2 px-3.5 bg-[rgba(181,181,181,0.2)] hover:bg-[rgba(181,181,181,0.4)] ${
                      openLibraryModal && "bg-[rgba(181,181,181,0.4)]"
                    }`}
                    onClick={() => setOpenLibraryModal(!openLibraryModal)}
                    ref={libraryButtonRef}
                  >
                    <SquaresPlusIcon
                      className="w-[24px] h-[24px] text-white fill-white"
                      strokeWidth={0.8}
                    />
                    <h1 className="text-md text-[#ebebeb] select-none">
                      Add to Library
                    </h1>
                  </div>
                  {openLibraryModal && (
                    <AddLibraryModule
                      ref={libraryModalRef}
                      isLoadingLibraries={isLoadingLibraries}
                      libraries={libraries}
                      handleAddToLibrary={handleAddToLibrary}
                    />
                  )}
                </div>
                <div className="flex gap-2.5 items-center rounded-3xl cursor-pointer transition-colors duration-500 py-2 px-3.5 bg-[rgba(131,74,189,0.3)] hover:bg-[rgba(131,74,189,0.5)]">
                  <UserGroupIcon
                    className="w-[24px] h-[24px] text-white fill-white"
                    strokeWidth={0.8}
                  />
                  <h1 className="text-md text-[#ebebeb] select-none">
                    {" "}
                    Watch Party{" "}
                  </h1>
                </div>
                <div className="flex bg-[rgba(181,181,181,0.2)] gap-2.5 items-center rounded-3xl py-2 px-3.5">
                  <HandThumbUpIcon
                    className="w-[24px] h-[24px] text-white cursor-pointer"
                    strokeWidth={1.5}
                    fill={likeStatus === 1 ? "white" : "transparent"}
                    onClick={() => handleLikeOrDislikeButton(1)}
                  />
                  <div className="w-px h-6 bg-[rgba(255,255,255,0.4)]"></div>
                  {/* Línea vertical */}
                  <HandThumbDownIcon
                    className="w-[24px] h-[24px] text-white cursor-pointer"
                    strokeWidth={1.5}
                    fill={likeStatus === -1 ? "white" : "transparent"}
                    onClick={() => handleLikeOrDislikeButton(-1)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        {openLibraryModal && !isAboveMobileScreens && (
          <AddLibraryModule
            ref={libraryModalRef}
            isLoadingLibraries={isLoadingLibraries}
            libraries={libraries}
            handleAddToLibrary={handleAddToLibrary}
          />
        )}
      </div>
    </>
  );
};

function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return hours > 0
    ? minutes > 0
      ? `${hours}h ${minutes}m`
      : `${hours}h`
    : `${minutes}m`;
}

export default TopSection;
