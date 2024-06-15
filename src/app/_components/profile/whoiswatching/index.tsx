import {
  selectFailure,
  selectStart,
  selectSuccess,
} from "~/redux/profileSlice";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import useMediaQuery from "~/hooks/useMediaQuery";
import Cookies from "js-cookie";
import CardProfile from "../profilecard";
import CreateProfile from "../createprofile";
import { PencilSquareIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import ManageProfile from "../manageprofile";
import {
  getUserProfiles,
  getProfile,
  getAllProfilePictures,
} from "~/server/queries/profile.queries";

const WhoIsWatching = () => {
  // REDUX
  const { currentUser } = useSelector((state: any) => state.user);
  const { currentProfile } = useSelector((state: any) => state.profile);
  const dispatch = useDispatch();

  if (!currentUser) {
    return null;
  }

  // MEDIA QUERIES
  const isAboveMediumScreens = useMediaQuery("(min-width: 900px)");
  const isAboveSmallTablet = useMediaQuery("(min-width: 700px)");

  // PROFILES VAR
  const [profileId, setProfileId] = useState<string>();

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

  // FETCH PROFILES
  let profilePictures;
  let profiles;
  useEffect(() => {
    try {
      const handleFetchProfiles = async () => {
        profilePictures = await getAllProfilePictures();
        profiles = await getUserProfiles();
      };
      handleFetchProfiles();
    } catch (error) {
      //
    }
  }, [profileId]);

  // SELECT PROFILE
  useEffect(() => {
    try {
      const handleCheckProfile = async () => {
        dispatch(selectStart());
        if (profileId !== undefined) {
          const response = await getProfile(profileId);
          dispatch(selectSuccess(response));
        } else {
          dispatch(selectFailure());
        }
      };
      handleCheckProfile();
    } catch (error) {
      //
    }
  }, [profileId]);

  const handleSelectProfile = (profile: any) => {
    Cookies.set("currentProfile", profile.id);
    setProfileId(profile.id);
  };

  const toggleCreatingProfile = () => {
    setIsManagingProfile(false);
    setIsCreatingProfile(!isCreatingProfile);
  };

  const toggleManagingProfile = () => {
    setIsManagingProfile(!isManagingProfile);
  };

  return (
    <div className={`fixed inset-0 h-full w-full bg-[#0F0F0F] z-40`}>
      {isCreatingProfile && (
        <CreateProfile
          setIsCreatingProfile={setIsCreatingProfile}
          profilePictures={profilePictures}
        />
      )}

      {enterManageProfile && (
        <ManageProfile
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
            {profiles!.map((profile: any) => (
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
            {profiles!.length < 6 && (
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
  );
};

export default WhoIsWatching;
