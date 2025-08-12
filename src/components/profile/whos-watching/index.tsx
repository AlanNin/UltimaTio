"use client";
import {
  selectFailure,
  selectStart,
  selectSuccess,
} from "~/providers/redux/profile-slice";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import useMediaQuery from "~/hooks/use-media-query";
import Cookies from "js-cookie";
import CardProfile from "../profile-card";
import CreateProfile from "../create-profile";
import { PencilSquareIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import ManageProfile from "../manage-profile";
import {
  getUserProfiles,
  createProfile,
  updateProfile,
  deleteProfile,
} from "~/server/queries/profile.queries";
import { Loading } from "~/utils/loading/loading";
import { cn } from "~/utils/cn";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllProfilePictures } from "~/utils/profile-pictures";

const WhoIsWatching = () => {
  type ProfilePictures = {
    MoviesProfileImages: string[];
    TVShowsProfileImages: string[];
    AnimeDonghuaProfileImages: string[];
    CartoonProfileImages: string[];
    KShowsProfileImages: string[];
    AllProfileImages: string[];
  };

  // REDUX
  const { currentUser } = useSelector((state: any) => state.user);
  const { currentProfile } = useSelector((state: any) => state.profile);
  const dispatch = useDispatch();

  // MEDIA QUERIES
  const isAboveMediumScreens = useMediaQuery("(min-width: 900px)");
  const isAboveSmallTablet = useMediaQuery("(min-width: 700px)");

  // CREATING
  const [isCreatingProfile, setIsCreatingProfile] = useState<boolean>(false);

  // MANAGE
  const [isManagingProfile, setIsManagingProfile] = useState<boolean>(false);
  const [enterManageProfile, setEnterManageProfile] = useState<boolean>(false);
  const [profileToManage, setProfileToManage] = useState<any>();

  // UPDATE
  const [update, setUpdate] = useState<boolean>(false);

  //STOP SCROLL
  useEffect(() => {
    if (currentUser && !currentProfile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [currentUser, currentProfile]);

  // FETCH PROFILES
  const {
    data: profilesData,
    isLoading: isProfilesLoading,
    refetch: refetchProfiles,
  } = useQuery({
    queryKey: ["user-profiles", currentUser?.id],
    queryFn: () => getUserProfiles(),
    enabled: !!currentUser,
  });

  const profilePictures: ProfilePictures = useMemo(() => {
    return getAllProfilePictures();
  }, []);

  // SELECT PROFILE
  const handleSelectProfile = (profile: any) => {
    try {
      Cookies.set("currentProfile", profile.id, { expires: 1 });
      dispatch(selectStart());

      dispatch(selectSuccess(profile));
    } catch (error) {
      dispatch(selectFailure());
    }
  };

  // CREATE
  const toggleCreatingProfile = () => {
    setIsManagingProfile(false);
    setIsCreatingProfile(!isCreatingProfile);
  };

  const {
    mutate: createProfileMutation,
    isPending: isCreatingProfileMutation,
  } = useMutation({
    mutationFn: ({
      name,
      selectedImage,
    }: {
      name: any;
      selectedImage: string;
    }) => createProfile(name, selectedImage),
    onMutate: () => {
      setIsCreatingProfile(false);
    },
    onSuccess: () => {
      refetchProfiles();
    },
  });

  // MANAGE (UPDATE, DELETE)
  const toggleManagingProfile = () => {
    setIsManagingProfile(!isManagingProfile);
  };

  // MANAGE --> UPDATE
  const {
    mutate: updateProfileMutation,
    isPending: isUpdatingProfileMutation,
  } = useMutation({
    mutationFn: ({
      profileId,
      name,
      selectedImage,
    }: {
      profileId: string;
      name: string;
      selectedImage: string;
    }) => updateProfile(profileId, name, selectedImage),
    onMutate: () => {
      setIsManagingProfile(false);
      setEnterManageProfile(false);
    },
    onSuccess: () => {
      refetchProfiles();
    },
  });

  // MANAGE --> DELETE
  const {
    mutate: deleteProfileMutation,
    isPending: isDeletingProfileMutation,
  } = useMutation({
    mutationFn: ({ profileId }: { profileId: string }) =>
      deleteProfile(profileId),
    onMutate: () => {
      setIsManagingProfile(false);
      setEnterManageProfile(false);
    },
    onSuccess: () => {
      refetchProfiles();
    },
  });

  const isLoading = [
    isProfilesLoading,
    isCreatingProfileMutation,
    isUpdatingProfileMutation,
    isDeletingProfileMutation,
  ].some(Boolean);

  return (
    <>
      {!currentUser || (currentUser && currentProfile) ? null : (
        <div className={`fixed inset-0 h-full w-full bg-[#0F0F0F] z-40`}>
          {isLoading && (
            <div className="fixed flex w-full h-screen items-center justify-center z-20 bg-[#0F0F0F]">
              <Loading type="spin" color="#ffffff" />
            </div>
          )}
          <>
            {isCreatingProfile && (
              <CreateProfile
                handleCreateProfile={(name, selectedImage) =>
                  createProfileMutation({ name, selectedImage })
                }
                setIsCreatingProfile={setIsCreatingProfile}
                profilePictures={profilePictures}
                setUpdate={setUpdate}
                update={update}
              />
            )}

            {enterManageProfile && (
              <ManageProfile
                handleUpdateProfile={(profileId, name, selectedImage) =>
                  updateProfileMutation({ profileId, name, selectedImage })
                }
                handleDeleteProfile={(profileId) =>
                  deleteProfileMutation({ profileId })
                }
                setEnterManageProfile={setEnterManageProfile}
                profileToManage={profileToManage}
                profilePictures={profilePictures}
                setUpdate={setUpdate}
                update={update}
                canDeleteProfiles={profilesData.length > 1}
              />
            )}

            <div
              className={`h-full w-full items-center justify-between flex flex-col overflow-y-auto py-10 ${
                isAboveMediumScreens ? "gap-16" : "gap-8"
              }`}
            >
              <h1
                className={`font-light text-3xl text-white mt-auto ${
                  !isAboveMediumScreens && "text-[24px]"
                }`}
              >
                Hello, who are you?
              </h1>

              <div className={`px-10 ${!isAboveSmallTablet && ""}`}>
                <div className="flex flex-wrap items-center justify-center gap-8 gap-x-10">
                  {Array.isArray(profilesData) &&
                    profilesData.map((profile: any) => (
                      <CardProfile
                        key={profile.id}
                        profile={profile}
                        handleSelectProfile={handleSelectProfile}
                        toggleCreatingProfile={toggleCreatingProfile}
                        isManagingProfile={isManagingProfile}
                        setEnterManageProfile={setEnterManageProfile}
                        setProfileToManage={setProfileToManage}
                      />
                    ))}
                  {Array.isArray(profilesData) && profilesData.length < 6 && (
                    <CardProfile
                      toggleCreatingProfile={toggleCreatingProfile}
                      isCreating={true}
                    />
                  )}
                </div>
              </div>

              <div
                className={cn(
                  "flex mb-auto justify-center items-center text-white gap-2 px-4 py-2 rounded-lg cursor-pointer bg-[rgba(117,117,117,0.1)] hover:bg-[rgba(117,117,117,0.3)] transition-colors duration-300",
                  isAboveMediumScreens && "-mt-8"
                )}
                onClick={toggleManagingProfile}
              >
                {isManagingProfile ? (
                  <>
                    <CheckCircleIcon className="h-4 text-[#d1d1d1]" />
                    <h1 className={`font-light text-sm text-[#d1d1d1]`}>
                      Done
                    </h1>
                  </>
                ) : (
                  <>
                    <PencilSquareIcon className="h-4 text-[#d1d1d1]" />
                    <h1 className={`font-light text-sm text-[#d1d1d1]`}>
                      Manage Profiles
                    </h1>
                  </>
                )}
              </div>
            </div>
          </>
        </div>
      )}
    </>
  );
};

export default WhoIsWatching;
