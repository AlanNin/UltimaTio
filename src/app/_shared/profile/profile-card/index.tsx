import React from "react";
import useMediaQuery from "~/hooks/useMediaQuery";
import { PlusIcon, PencilIcon } from "@heroicons/react/24/outline";

type Profile = {
  id: string;
  imgUrl: string;
  name: string;
};

type Props = {
  profile?: Profile;
  handleSelectProfile?: (profile: any) => void;
  toggleCreatingProfile?: () => void;
  isCreating?: boolean;
  isManagingProfile?: boolean;
  setEnterManageProfile?: (boolean: any) => void;
  setProfileToManage?: (string: any) => void;
};

const CardProfile: React.FC<Props> = ({
  profile,
  handleSelectProfile,
  toggleCreatingProfile,
  isCreating,
  isManagingProfile,
  setEnterManageProfile,
  setProfileToManage,
}) => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 900px)");

  const handleOnClick = () => {
    if (!isManagingProfile) {
      handleSelectProfile && handleSelectProfile(profile);
    } else {
      setProfileToManage && setProfileToManage(profile);
      setEnterManageProfile && setEnterManageProfile(true);
    }
  };

  return (
    <div>
      {isCreating ? (
        <div
          className="flex flex-col items-center gap-2 cursor-pointer"
          onClick={toggleCreatingProfile}
        >
          <PlusIcon
            className={`rounded-md w-[120px] h-[120px] bg-[rgba(148,148,148,0.15)] p-5 text-[rgba(255,255,255,0.65)] ${
              !isAboveMediumScreens && "w-[90px] h-[90px]"
            }`}
          />
          <h1 className="font-medium text-sm text-[#c9c9c9]">New Profile</h1>
        </div>
      ) : (
        <div
          className="relative flex flex-col items-center gap-2 cursor-pointer"
          onClick={handleOnClick}
        >
          {isManagingProfile && (
            <div
              className={`absolute ${
                isAboveMediumScreens
                  ? "w-[120px] h-[120px]"
                  : "w-[90px] h-[90px]"
              } flex items-center justify-center cursor-pointer bg-[rgba(124,124,124,0.5)] rounded-md`}
            >
              <PencilIcon className="w-[34px] h-[34px] text-white p-1 rounded-md" />
            </div>
          )}
          <img
            src={profile?.imgUrl}
            className={`rounded-md w-[120px] h-[120px] object-cover ${
              !isAboveMediumScreens && "w-[90px] h-[90px]"
            }`}
            style={{
              background:
                "linear-gradient(180deg, rgb(143, 143, 143, 0.1), rgb(176, 176, 176, 0.1))",
            }}
          />
          <h1 className="font-medium text-sm text-[#c9c9c9] max-w-28 overflow-hidden whitespace-nowrap overflow-ellipsis">
            {profile?.name}
          </h1>
        </div>
      )}
    </div>
  );
};

export default CardProfile;
