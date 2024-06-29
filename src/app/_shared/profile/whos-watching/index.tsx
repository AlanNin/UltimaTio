"use client";
import {
  selectFailure,
  selectStart,
  selectSuccess,
} from "~/utils/redux/profile-slice";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import useMediaQuery from "~/hooks/UseMediaQuery";
import Cookies from "js-cookie";
import CardProfile from "../profile-card";
import CreateProfile from "../create-profile";
import { PencilSquareIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import ManageProfile from "../manage-profile";
import {
  getUserProfiles,
  getAllProfilePictures,
  createProfile,
  updateProfile,
  deleteProfile,
} from "~/server/queries/profile.queries";

const WhoIsWatching = () => {
  type ProfilePictures = {
    MoviesProfileImages: string[];
    TVShowsProfileImages: string[];
    AnimeProfileImages: string[];
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

  // DEFINE PROFILE
  const [profiles, setProfiles] = useState<any[]>([]);
  const [profilePictures, setProfilePictures] = useState<ProfilePictures>({
    MoviesProfileImages: [],
    TVShowsProfileImages: [],
    AnimeProfileImages: [],
    CartoonProfileImages: [],
    KShowsProfileImages: [],
    AllProfileImages: [],
  });

  // FETCH PROFILES
  useEffect(() => {
    if (currentUser) {
      const fetchProfiles = async () => {
        try {
          const fetchedProfilePictures = await getAllProfilePictures();
          const fetchedProfiles = await getUserProfiles();
          setProfilePictures(fetchedProfilePictures);
          setProfiles(fetchedProfiles);
        } catch (error) {
          console.error("Error fetching profiles:", error);
        }
      };
      fetchProfiles();
    }
  }, [currentUser, isCreatingProfile, isManagingProfile]);

  // SELECT PROFILE
  const handleSelectProfile = (profile: any) => {
    try {
      Cookies.set("currentProfile", profile.id);
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

  const handleCreateProfile = async (name: any, selectedImage: string) => {
    try {
      await createProfile(name, selectedImage);
      setIsCreatingProfile(false);
    } catch (error) {
      //
    }
  };

  // MANAGE (UPDATE, DELETE)
  const toggleManagingProfile = () => {
    setIsManagingProfile(!isManagingProfile);
  };

  // MANAGE --> UPDATE
  const handleUpdateProfile = async (
    profileId: string,
    name: any,
    selectedImage: string
  ) => {
    try {
      await updateProfile(profileId, name, selectedImage);
      setEnterManageProfile(false);
    } catch (error) {
      //
    }
  };

  // MANAGE --> DELETE
  const handleDeleteProfile = async (profileId: string) => {
    try {
      await deleteProfile(profileId);
      setEnterManageProfile(false);
    } catch (error) {
      //
    }
  };

  return (
    <>
      {!currentUser || (currentUser && currentProfile) ? null : (
        <div className={`fixed inset-0 h-full w-full bg-[#0F0F0F] z-40`}>
          {isCreatingProfile && (
            <CreateProfile
              handleCreateProfile={handleCreateProfile}
              setIsCreatingProfile={setIsCreatingProfile}
              profilePictures={profilePictures}
            />
          )}

          {enterManageProfile && (
            <ManageProfile
              handleUpdateProfile={handleUpdateProfile}
              handleDeleteProfile={handleDeleteProfile}
              setEnterManageProfile={setEnterManageProfile}
              profileToManage={profileToManage}
              profilePictures={profilePictures}
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
                {Array.isArray(profiles) &&
                  profiles.map((profile: any) => (
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
                {Array.isArray(profiles) && profiles.length < 6 && (
                  <CardProfile
                    toggleCreatingProfile={toggleCreatingProfile}
                    isCreating={true}
                  />
                )}
              </div>
            </div>

            <div
              className="flex mb-auto justify-center items-center text-white gap-2 px-4 py-2 rounded-lg cursor-pointer bg-[rgba(117,117,117,0.1)] hover:bg-[rgba(117,117,117,0.3)] transition-colors duration-300"
              onClick={toggleManagingProfile}
            >
              {isManagingProfile ? (
                <>
                  <CheckCircleIcon className="h-4 text-[#d1d1d1]" />
                  <h1 className={`font-light text-sm text-[#d1d1d1]`}>Done</h1>
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
        </div>
      )}
    </>
  );
};

export default WhoIsWatching;
