import useMediaQuery from "~/hooks/use-media-query";
import { PencilIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import PFPsModule from "../change-pfp/PFPsModule";
import { ArrowLeftCircleIcon, Trash2 } from "lucide-react";

type Profile = {
  id: string;
  imgUrl: string;
  name: string;
};

type Props = {
  handleUpdateProfile: (
    profileId: string,
    name: any,
    selectedImage: string
  ) => void;
  handleDeleteProfile: (profileId: string) => void;
  setEnterManageProfile: (boolean: any) => void;
  profileToManage: Profile;
  profilePictures: any;
  setUpdate: (boolean: boolean) => void;
  update: boolean;
  canDeleteProfiles: boolean;
};

const ManageProfile: React.FC<Props> = ({
  handleUpdateProfile,
  handleDeleteProfile,
  setEnterManageProfile,
  profileToManage,
  profilePictures,
  setUpdate,
  update,
  canDeleteProfiles,
}) => {
  // DEFINITOINS
  const isAboveMediumScreens = useMediaQuery("(min-width: 900px)");
  const [isChangingPFP, setIsChangingPFP] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string>(
    profileToManage.imgUrl
  );

  // INPUT
  interface Inputs {
    name?: string;
  }

  const [inputs, setInputs] = useState<Inputs>({ name: undefined });

  const handleChange = (e: any) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  // UPDATE
  const updateProfile = () => {
    if (
      (inputs.name !== undefined && inputs.name.length > 0) ||
      selectedImage !== profileToManage.imgUrl
    ) {
      handleUpdateProfile(profileToManage.id, inputs.name!, selectedImage);
      setUpdate(!update);
    } else {
      setEnterManageProfile(false);
    }
  };

  // DELETE
  const deleteProfile = () => {
    try {
      handleDeleteProfile(profileToManage.id);
      setUpdate(!update);
    } catch (error) {
      //
    }
  };

  return (
    <div className="fixed h-full w-full bg-[#0F0F0F] z-20">
      {isChangingPFP && (
        <PFPsModule
          setSelectedImage={setSelectedImage}
          setIsChangingPFP={setIsChangingPFP}
          selectedImage={selectedImage}
          images={profilePictures}
        />
      )}

      {isAboveMediumScreens ? (
        <div className="h-full w-full flex items-center justify-center relative">
          <div className="flex flex-col items-start">
            <h1 className="font-medium text-5xl text-white text-center mb-1">
              Updating Profile
            </h1>
            <h1 className="font-light text-lg text-[#d1d1d1] text-center mb-10">
              Update your existing profile for a personalized experience
            </h1>

            <div className="flex items-center w-full h-full gap-8">
              <div className="relative flex w-max h-max">
                <img
                  src={selectedImage}
                  alt="Profile Picture"
                  className={`rounded-md w-48 h-auto object-cover`}
                />
                <PencilIcon
                  className="absolute w-[24px] h-[24px] top-1.5 right-1.5 cursor-pointer text-white bg-[rgba(124,124,124,0.8)] p-1 rounded-md"
                  onClick={() => setIsChangingPFP(true)}
                />
              </div>

              <div className="flex flex-col gap-y-5 w-full">
                <div className="flex flex-col gap-y-2 w-full">
                  <label htmlFor="name" className="text-sm text-[#d1d1d1]">
                    Profile Name
                  </label>
                  <input
                    id="name"
                    onChange={handleChange}
                    value={
                      inputs.name === undefined
                        ? profileToManage.name
                        : inputs.name
                    }
                    name="name"
                    className="bg-[#292929] w-full px-4 p-2 rounded text-white text-sm placeholder:text-sm placeholder:text-[#8a8a8a]"
                    placeholder="Type here..."
                  />
                </div>
                <div className="flex w-full items-center justify-end gap-x-4">
                  {canDeleteProfiles && (
                    <Trash2
                      onClick={deleteProfile}
                      strokeWidth={1.5}
                      className="mr-auto text-white/50 hover:text-red-500 size-6 cursor-pointer transition-colors duration-300"
                    />
                  )}
                  <div
                    className="text-white flex cursor-pointer px-8 py-2 rounded-md bg-[rgba(124,124,124,0.15)] text-sm font-medium"
                    onClick={() =>
                      setEnterManageProfile && setEnterManageProfile(false)
                    }
                  >
                    Cancel
                  </div>
                  <div
                    className="text-white flex cursor-pointer px-8 py-2 rounded-md bg-[rgba(64,4,35,0.7)] text-sm font-medium"
                    onClick={updateProfile}
                  >
                    Save
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-full overflow-y-auto relative">
          <ArrowLeftCircleIcon
            onClick={() =>
              setEnterManageProfile && setEnterManageProfile(false)
            }
            strokeWidth={0.8}
            className="absolute text-white size-10 p-2 stroke-current cursor-pointer top-4 left-4"
          />

          {canDeleteProfiles && (
            <Trash2
              onClick={deleteProfile}
              strokeWidth={0.8}
              className="absolute text-red-500 size-10 p-2 stroke-current cursor-pointer top-4 right-4"
            />
          )}

          <div className="h-full w-full items-center justify-between flex flex-col gap-6 py-10">
            <h1 className="font-light text-2xl text-white mt-auto">
              Updating Profile
            </h1>

            <div className="relative w-max h-max">
              <img
                src={selectedImage}
                alt="Profile Picture"
                className={`rounded-md w-[140px] h-[140px] object-cover`}
              />
              <PencilIcon
                className="absolute w-[24px] h-[24px] top-1.5 right-1.5 cursor-pointer text-white bg-[rgba(124,124,124,0.5)] p-1 rounded-md"
                onClick={() => setIsChangingPFP(true)}
              />
            </div>

            <input
              onChange={handleChange}
              value={
                inputs.name === undefined ? profileToManage.name : inputs.name
              }
              className="bg-[#292929] px-4 p-2 rounded text-white text-sm placeholder:text-sm placeholder:text-[#8a8a8a]"
              placeholder="Profile Name"
            />

            <button
              className="text-white cursor-pointer px-8 py-2 rounded-md bg-[rgba(64,4,35,0.7)] text-sm font-medium mb-auto"
              onClick={updateProfile}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProfile;
