"use client";
import useMediaQuery from "~/hooks/use-media-query";
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
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { cn } from "~/utils/cn";
import { useSelector } from "react-redux";

type Props = {
  content: any;
  isLoading: boolean;
};

const TopSection: React.FC<Props> = ({ content, isLoading }) => {
  const isAboveMobileScreens = useMediaQuery("(min-width: 900px)");
  const [showMore, setShowMore] = useState(false);
  const [likeStatus, setLikeStatus] = useState(content?.likeStatus || 0);
  const [openLibraryModal, setOpenLibraryModal] = useState(false);
  const { currentProfile } = useSelector((state: any) => state.profile);

  const watchPercentage =
    content?.profileContent?.[0]?.watchProgress &&
    content?.profileContent?.[0]?.duration
      ? Math.floor(
          (content.profileContent[0].watchProgress /
            content.profileContent[0].duration) *
            100
        )
      : 0;

  const handleGetWatchHref = (): string => {
    const { tmdbid, category, profileContent } = content ?? {};

    const params = new URLSearchParams({
      tmdbid: String(tmdbid ?? ""),
      category: String(category ?? ""),
    });

    if (category === "movie") {
      return `/watch?${params.toString()}`;
    }

    const first = Array.isArray(profileContent) ? profileContent[0] : undefined;
    const hasProgress = Number(first?.watchProgress ?? 0) > 0;

    const season = hasProgress ? Number(first?.season) || 1 : 1;
    const episode = hasProgress ? Number(first?.episode) || 1 : 1;

    params.set("season", String(season));
    params.set("episode", String(episode));

    return `/watch?${params.toString()}`;
  };

  const { mutate: likeOrDislikeMutation } = useMutation({
    mutationFn: ({
      tmdbid,
      category,
      status,
    }: {
      tmdbid: number;
      category: string;
      status: number;
    }) => handleLikeOrDislike(tmdbid, category, status),
    onSuccess: (data) => {
      if (data.success) {
        setLikeStatus(data.likeStatus);
      } else {
        setLikeStatus((prev: number) => !prev);
        throw data.message;
      }
    },
  });

  const handleLikeOrDislikeButton = async (status: number) => {
    try {
      setLikeStatus(status === likeStatus ? 0 : status);
      likeOrDislikeMutation({
        tmdbid: content.tmdbid,
        category: content.category,
        status: status,
      });
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
  const DEFAULT_LIBRARIES = [
    { name: "Following", added: false },
    { name: "Plan To Watch", added: false },
    { name: "On Hold", added: false },
    { name: "Completed", added: false },
  ];

  function mapToLibraries(
    resp: any[] | undefined
  ): { name: string; added: boolean }[] {
    if (!resp || resp.length === 0)
      return DEFAULT_LIBRARIES.map((l) => ({ ...l }));

    return DEFAULT_LIBRARIES.map((lib) => ({
      ...lib,
      added: resp.some((item: any) => item?.name === lib.name),
    }));
  }

  const {
    data: libraries = DEFAULT_LIBRARIES,
    isLoading: isLoadingLibraries,
    isRefetching: isRefetchingLibraries,
    refetch: refetchLibraries,
  } = useQuery({
    queryKey: ["libraries-for-content", content.category, content.tmdb_id],
    queryFn: async () => {
      const res = await getLibraryForContent(content.tmdb_id, content.category);
      return res as any[];
    },
    select: (resp) => mapToLibraries(resp),
    gcTime: 1000 * 60 * 30,
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
  });

  const handleAddToLibrary = async (library_name: string) => {
    try {
      await addOrRemoveContentFromLibrary(
        content.tmdb_id,
        content.category,
        library_name
      );

      refetchLibraries();
    } catch (error) {
      console.error("Error adding/removing content:", error);
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
            <div
              className={`flex flex-col gap-1 h-full px-4  ${
                isAboveMobileScreens && "min-w-80"
              }`}
            >
              {isAboveMobileScreens && (
                <>
                  <div className="flex gap-2 mb-3">
                    <Link
                      className="text-sm font-light cursor-pointer text-white hover:text-[#b084db] transition-property:text duration-300"
                      href="/"
                    >
                      Home
                    </Link>
                    <span className="text-sm font-light text-white">•</span>
                    <Link
                      className="text-sm font-light capitalize cursor-pointer text-white hover:text-[#b084db] transition-property:text duration-500"
                      href={`/${content.category}`}
                    >
                      {content.category === "tv" ? "TV" : content.category}
                    </Link>
                    <span className="text-sm font-light text-white">•</span>
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
              <Link
                href={handleGetWatchHref()}
                className="relative flex gap-2.5 items-center rounded-3xl cursor-pointer transition-colors duration-500 py-2 px-3.5 bg-[rgba(181,181,181,0.2)] hover:bg-[rgba(181,181,181,0.4)] overflow-hidden"
              >
                <PlayIcon
                  className="size-5 text-white fill-white z-10"
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
              </Link>
              <div
                className="flex gap-2.5 items-center rounded-3xl cursor-pointer transition-colors duration-500 py-2 px-3.5 bg-[rgba(181,181,181,0.2)] hover:bg-[rgba(181,181,181,0.4)]"
                onClick={() => setOpenLibraryModal(true)}
              >
                <SquaresPlusIcon
                  className="size-5 text-white fill-white"
                  strokeWidth={0.8}
                />
                <h1 className="text-sm text-[#ebebeb]"> Add to Library </h1>
              </div>
              <button
                className="flex gap-2.5 items-center rounded-3xl transition-colors duration-500 py-2 px-3.5 bg-[rgba(131,74,189,0.3)] opacity-50"
                disabled
              >
                <UserGroupIcon
                  className="size-5 text-white fill-white"
                  strokeWidth={0.8}
                />
                <h1 className="text-sm text-[#ebebeb]"> Watch Party </h1>
              </button>
              {currentProfile && (
                <div className="flex bg-[rgba(181,181,181,0.2)] gap-2.5 items-center rounded-3xl py-2 px-3.5">
                  <HandThumbUpIcon
                    className="size-5 text-white cursor-pointer"
                    strokeWidth={1.5}
                    fill={likeStatus === 1 ? "white" : "transparent"}
                    onClick={() => handleLikeOrDislikeButton(1)}
                  />
                  <div className="w-px h-6 bg-[rgba(255,255,255,0.4)]"></div>
                  <HandThumbDownIcon
                    className="size-5 text-white cursor-pointer"
                    strokeWidth={1.5}
                    fill={likeStatus === -1 ? "white" : "transparent"}
                    onClick={() => handleLikeOrDislikeButton(-1)}
                  />
                </div>
              )}
            </div>
          )}
          {/* DETAILS */}
          <div className="bg-[rgba(191,191,191,0.075)] rounded-md p-4 flex flex-col gap-4 w-auto">
            <h1 className="font-light text-xs flex">
              <p className="font-bold"> Duration: &nbsp;</p>
              {content.duration && content.duration > 0
                ? formatDuration(content.duration || content.episodeDuration)
                : "Not Available"}
            </h1>
            <h1 className="font-light text-xs flex">
              <p className="font-bold"> Release Year: &nbsp;</p>
              {content.date
                ? new Date(content.date).getFullYear()
                : "Not Available"}
            </h1>
            <h1 className="font-light text-xs flex">
              <p className="font-bold"> TMDB Rating: &nbsp;</p>
              {content?.rating ? content?.rating.toFixed(1) : "Not Available"}
            </h1>
            <div className="flex flex-wrap items-center max-w-[300px] gap-1">
              <h1 className="font-bold text-xs mr-1">Genres: </h1>
              {content?.ContentGenre && content?.ContentGenre.length > 0 ? (
                <>
                  {content?.ContentGenre?.map((genre: any, _index: number) => (
                    <span
                      key={genre.genre.id}
                      className="bg-[rgba(191,191,191,0.15)] rounded-xl py-1 px-2 font-light text-xs cursor-pointer"
                    >
                      {genre &&
                        genre.genre.name.charAt(0).toUpperCase() +
                          genre.genre.name?.slice(1)}
                    </span>
                  ))}
                </>
              ) : (
                <p className="text-xs font-light">Not Available</p>
              )}
            </div>
            <div className="flex flex-wrap items-center max-w-[300px] gap-1">
              <h1 className="font-bold text-xs mr-1">Producers: </h1>
              {content?.ContentStudio && content?.ContentStudio.length > 0 ? (
                <>
                  {content?.ContentStudio?.map(
                    (studio: any, _index: number) => (
                      <span
                        key={studio.studio.id}
                        className="bg-[rgba(191,191,191,0.15)] rounded-xl py-1 px-2 font-light text-xs cursor-pointer"
                      >
                        {studio &&
                          studio.studio.name.charAt(0).toUpperCase() +
                            studio.studio.name?.slice(1)}
                      </span>
                    )
                  )}
                </>
              ) : (
                <p className="text-xs font-light">Not Available</p>
              )}
            </div>
          </div>
          <div className="basis-full w-max items-center flex justify-center mt-2">
            {isAboveMobileScreens && (
              <div className="flex flex-wrap gap-4 items-center">
                <Link
                  href={handleGetWatchHref()}
                  className="relative flex gap-2.5 items-center rounded-3xl cursor-pointer transition-colors duration-500 py-2 px-3.5 bg-[rgba(181,181,181,0.2)] hover:bg-[rgba(181,181,181,0.4)] overflow-hidden"
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
                </Link>
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
                      isLoadingLibraries={
                        isLoadingLibraries || isRefetchingLibraries
                      }
                      libraries={libraries}
                      handleAddToLibrary={handleAddToLibrary}
                    />
                  )}
                </div>
                <button
                  className="flex gap-2.5 items-center rounded-3xl transition-colors duration-500 py-2 px-3.5 bg-[rgba(131,74,189,0.3)] opacity-50"
                  disabled
                >
                  <UserGroupIcon
                    className="w-[24px] h-[24px] text-white fill-white"
                    strokeWidth={0.8}
                  />
                  <h1 className="text-md text-[#ebebeb] select-none">
                    Watch Party
                  </h1>
                </button>
                {currentProfile && (
                  <div className="flex bg-[rgba(181,181,181,0.2)] gap-2.5 items-center rounded-3xl py-2 px-3.5">
                    <HandThumbUpIcon
                      className={cn(
                        "size-6 cursor-pointer transitions-colors duration-300",
                        likeStatus === 1
                          ? "text-white "
                          : "text-white/75 hover:text-white"
                      )}
                      strokeWidth={1.5}
                      fill={likeStatus === 1 ? "white" : "transparent"}
                      onClick={() => handleLikeOrDislikeButton(1)}
                    />
                    <div className="w-px h-6 bg-[rgba(255,255,255,0.4)]"></div>
                    <HandThumbDownIcon
                      className={cn(
                        "size-6 cursor-pointer transitions-colors duration-300",
                        likeStatus === -1
                          ? "text-white "
                          : "text-white/75 hover:text-white"
                      )}
                      strokeWidth={1.5}
                      fill={likeStatus === -1 ? "white" : "transparent"}
                      onClick={() => handleLikeOrDislikeButton(-1)}
                    />
                  </div>
                )}
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
