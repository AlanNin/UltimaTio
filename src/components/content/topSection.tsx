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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

  const watchPercentage =
    content?.profileContent?.[0]?.watchProgress &&
    content?.profileContent?.[0]?.duration
      ? Math.floor(
          (content.profileContent[0].watchProgress /
            content.profileContent[0].duration) *
            100,
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
    resp: any[] | undefined,
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
    queryKey: ["libraries-for-content", content.category, content.tmdbid],
    queryFn: async () => {
      const res = await getLibraryForContent(content.tmdbid, content.category);
      return res as any[];
    },
    select: (resp) => mapToLibraries(resp),
    gcTime: 1000 * 60 * 30,
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
  });

  const { mutate: addOrRemoveFromLibraryMutation } = useMutation({
    mutationFn: ({
      tmdbId,
      category,
      libraryName,
    }: {
      tmdbId: number;
      category: string;
      libraryName: string;
    }) => addOrRemoveContentFromLibrary(tmdbId, category, libraryName),

    onSuccess: () => {
      refetchLibraries();
      queryClient.invalidateQueries({
        queryKey: ["library"],
      });
    },
  });

  const handleAddToLibrary = async (library_name: string) => {
    try {
      addOrRemoveFromLibraryMutation({
        tmdbId: content.tmdbid,
        category: content.category,
        libraryName: library_name,
      });
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
        className="relative flex h-full w-full items-center justify-center bg-cover"
        style={{
          backgroundImage: `url(${
            content?.landscapeUrl &&
            content.landscapeUrl.includes("originalnull")
              ? content.posterUrl
              : content?.landscapeUrl || content?.posterUrl || ""
          })`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-[rgba(0,0,0,0.75)] backdrop-blur-lg" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent via-5% to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0F0F0F] via-transparent via-5% to-transparent" />
        <div
          className={`z-10  flex h-max w-max ${
            isAboveMobileScreens ? "flex-wrap py-14" : "flex-col py-10"
          } items-center justify-center gap-10 px-6`}
        >
          <div
            className={`flex flex-wrap justify-center ${
              !isAboveMobileScreens && "text-center"
            }`}
          >
            {/* POSTER */}
            <div
              className={`${
                !isAboveMobileScreens &&
                "relative flex basis-full items-center justify-center"
              }`}
            >
              <img
                src={content!.posterUrl}
                className={`h-[240px] w-[158px] rounded-sm bg-cover drop-shadow-lg`}
                style={{
                  background:
                    "linear-gradient(180deg, rgb(143, 143, 143, 0.1), rgb(176, 176, 176, 0.1))",
                }}
              />
            </div>
            <div
              className={`flex h-full flex-col gap-1 px-4  ${
                isAboveMobileScreens && "min-w-80"
              }`}
            >
              {isAboveMobileScreens && (
                <>
                  <div className="mb-3 flex gap-2">
                    <Link
                      className="transition-property:text cursor-pointer text-sm font-light text-white duration-300 hover:text-[#b084db]"
                      href="/"
                    >
                      Home
                    </Link>
                    <span className="text-sm font-light text-white">•</span>
                    <Link
                      className="transition-property:text cursor-pointer text-sm font-light capitalize text-white duration-500 hover:text-[#b084db]"
                      href={`/${content.category}`}
                    >
                      {content.category === "tv" ? "TV" : content.category}
                    </Link>
                    <span className="text-sm font-light text-white">•</span>
                    <h1 className="text-sm font-light capitalize text-[#acabab]">
                      {content!.title}
                    </h1>
                  </div>

                  {/* TITLE */}
                  <h1
                    className="max-w-[550px] text-4xl"
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
              <p className="mt-4 max-w-[550px] text-sm font-normal text-[#c2c2c2]">
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
                            className="my-1 ml-2 cursor-pointer rounded-xl bg-[rgba(191,191,191,0.15)] px-2 py-0.5 text-xs font-light"
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
                              isAboveMobileScreens ? 520 : 150,
                            ) + "..."
                          : content.description}
                        {content.description.length >
                          (isAboveMobileScreens ? 520 : 150) && (
                          <span
                            className="my-1 ml-2 cursor-pointer rounded-xl bg-[rgba(191,191,191,0.15)] px-2 py-0.5 text-xs font-light"
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
            <div className="flex basis-full flex-wrap items-center justify-center gap-3">
              <Link
                href={handleGetWatchHref()}
                className="relative flex cursor-pointer items-center gap-2.5 overflow-hidden rounded-3xl bg-[rgba(181,181,181,0.2)] px-3.5 py-2 transition-colors duration-500 hover:bg-[rgba(181,181,181,0.4)]"
              >
                <PlayIcon
                  className="z-10 size-5 fill-white text-white"
                  strokeWidth={0.8}
                />
                <h1 className="z-10 text-sm text-[#ebebeb]">
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
                  className="absolute inset-0 z-0 h-full w-full bg-gradient-to-r from-[rgba(135,15,73,0.4)] to-[rgba(124,38,212,0.4)]"
                  style={{ width: watchPercentage + "%" }}
                />
              </Link>
              <div
                className="flex cursor-pointer items-center gap-2.5 rounded-3xl bg-[rgba(181,181,181,0.2)] px-3.5 py-2 transition-colors duration-500 hover:bg-[rgba(181,181,181,0.4)]"
                onClick={() => setOpenLibraryModal(true)}
              >
                <SquaresPlusIcon
                  className="size-5 fill-white text-white"
                  strokeWidth={0.8}
                />
                <h1 className="text-sm text-[#ebebeb]"> Add to Library </h1>
              </div>
              <button
                className="flex items-center gap-2.5 rounded-3xl bg-[rgba(131,74,189,0.3)] px-3.5 py-2 opacity-50 transition-colors duration-500"
                disabled
              >
                <UserGroupIcon
                  className="size-5 fill-white text-white"
                  strokeWidth={0.8}
                />
                <h1 className="text-sm text-[#ebebeb]"> Watch Party </h1>
              </button>
              {currentProfile && (
                <div className="flex items-center gap-2.5 rounded-3xl bg-[rgba(181,181,181,0.2)] px-3.5 py-2">
                  <HandThumbUpIcon
                    className="size-5 cursor-pointer text-white"
                    strokeWidth={1.5}
                    fill={likeStatus === 1 ? "white" : "transparent"}
                    onClick={() => handleLikeOrDislikeButton(1)}
                  />
                  <div className="h-6 w-px bg-[rgba(255,255,255,0.4)]"></div>
                  <HandThumbDownIcon
                    className="size-5 cursor-pointer text-white"
                    strokeWidth={1.5}
                    fill={likeStatus === -1 ? "white" : "transparent"}
                    onClick={() => handleLikeOrDislikeButton(-1)}
                  />
                </div>
              )}
            </div>
          )}
          {/* DETAILS */}
          <div className="flex w-auto flex-col gap-4 rounded-md bg-[rgba(191,191,191,0.075)] p-4">
            <h1 className="flex text-xs font-light">
              <p className="font-bold"> Duration: &nbsp;</p>
              {content.duration && content.duration > 0
                ? formatDuration(content.duration || content.episodeDuration)
                : "Not Available"}
            </h1>
            <h1 className="flex text-xs font-light">
              <p className="font-bold"> Release Year: &nbsp;</p>
              {content.date
                ? new Date(content.date).getFullYear()
                : "Not Available"}
            </h1>
            <h1 className="flex text-xs font-light">
              <p className="font-bold"> TMDB Rating: &nbsp;</p>
              {content?.rating ? content?.rating.toFixed(1) : "Not Available"}
            </h1>
            <div className="flex max-w-[300px] flex-wrap items-center gap-1">
              <h1 className="mr-1 text-xs font-bold">Genres: </h1>
              {content?.ContentGenre && content?.ContentGenre.length > 0 ? (
                <>
                  {content?.ContentGenre?.map((genre: any, _index: number) => (
                    <span
                      key={genre.genre.id}
                      className="cursor-pointer rounded-xl bg-[rgba(191,191,191,0.15)] px-2 py-1 text-xs font-light"
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
            <div className="flex max-w-[300px] flex-wrap items-center gap-1">
              <h1 className="mr-1 text-xs font-bold">Producers: </h1>
              {content?.ContentStudio && content?.ContentStudio.length > 0 ? (
                <>
                  {content?.ContentStudio?.map(
                    (studio: any, _index: number) => (
                      <span
                        key={studio.studio.id}
                        className="cursor-pointer rounded-xl bg-[rgba(191,191,191,0.15)] px-2 py-1 text-xs font-light"
                      >
                        {studio &&
                          studio.studio.name.charAt(0).toUpperCase() +
                            studio.studio.name?.slice(1)}
                      </span>
                    ),
                  )}
                </>
              ) : (
                <p className="text-xs font-light">Not Available</p>
              )}
            </div>
          </div>
          <div className="mt-2 flex w-max basis-full items-center justify-center">
            {isAboveMobileScreens && (
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href={handleGetWatchHref()}
                  className="relative flex cursor-pointer items-center gap-2.5 overflow-hidden rounded-3xl bg-[rgba(181,181,181,0.2)] px-3.5 py-2 transition-colors duration-500 hover:bg-[rgba(181,181,181,0.4)]"
                >
                  <PlayIcon
                    className="z-10 h-[24px] w-[24px] fill-white text-white"
                    strokeWidth={0.8}
                  />
                  <h1 className="text-md z-10 select-none text-[#ebebeb]">
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
                    className="absolute inset-0 z-0 h-full w-full bg-gradient-to-r from-[rgba(135,15,73,0.4)] to-[rgba(124,38,212,0.4)]"
                    style={{ width: watchPercentage + "%" }}
                  />
                </Link>
                <div className="relative">
                  <div
                    className={` flex cursor-pointer items-center gap-2.5 rounded-3xl bg-[rgba(181,181,181,0.2)] px-3.5 py-2 transition-colors duration-500 hover:bg-[rgba(181,181,181,0.4)] ${
                      openLibraryModal && "bg-[rgba(181,181,181,0.4)]"
                    }`}
                    onClick={() => setOpenLibraryModal(!openLibraryModal)}
                    ref={libraryButtonRef}
                  >
                    <SquaresPlusIcon
                      className="h-[24px] w-[24px] fill-white text-white"
                      strokeWidth={0.8}
                    />
                    <h1 className="text-md select-none text-[#ebebeb]">
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
                  className="flex items-center gap-2.5 rounded-3xl bg-[rgba(131,74,189,0.3)] px-3.5 py-2 opacity-50 transition-colors duration-500"
                  disabled
                >
                  <UserGroupIcon
                    className="h-[24px] w-[24px] fill-white text-white"
                    strokeWidth={0.8}
                  />
                  <h1 className="text-md select-none text-[#ebebeb]">
                    Watch Party
                  </h1>
                </button>
                {currentProfile && (
                  <div className="flex items-center gap-2.5 rounded-3xl bg-[rgba(181,181,181,0.2)] px-3.5 py-2">
                    <HandThumbUpIcon
                      className={cn(
                        "transitions-colors size-6 cursor-pointer duration-300",
                        likeStatus === 1
                          ? "text-white "
                          : "text-white/75 hover:text-white",
                      )}
                      strokeWidth={1.5}
                      fill={likeStatus === 1 ? "white" : "transparent"}
                      onClick={() => handleLikeOrDislikeButton(1)}
                    />
                    <div className="h-6 w-px bg-[rgba(255,255,255,0.4)]"></div>
                    <HandThumbDownIcon
                      className={cn(
                        "transitions-colors size-6 cursor-pointer duration-300",
                        likeStatus === -1
                          ? "text-white "
                          : "text-white/75 hover:text-white",
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
