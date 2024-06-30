import useMediaQuery from "~/hooks/useMediaQuery";
import { PencilIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import PFPsModule from "../change-pfp/PFPsModule";

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
};

const ManageProfile: React.FC<Props> = ({
  handleUpdateProfile,
  handleDeleteProfile,
  setEnterManageProfile,
  profileToManage,
  profilePictures,
  setUpdate,
  update,
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
    <div className={`fixed h-full w-full bg-[#0F0F0F] z-40`}>
      {isChangingPFP && (
        <PFPsModule
          setSelectedImage={setSelectedImage}
          setIsChangingPFP={setIsChangingPFP}
          selectedImage={selectedImage}
          images={profilePictures}
        />
      )}

      <div
        className={`h-full w-full items-center justify-between flex flex-col overflow-y-auto py-10 ${
          isAboveMediumScreens ? "gap-16" : "gap-8"
        }`}
      >
        <div className="flex flex-col my-auto mx-auto gap-8">
          <h1
            className={`font-light text-3xl text-white text-center ${
              !isAboveMediumScreens && "text-[24px]"
            }`}
          >
            Manage Profile
          </h1>

          <div className="relative w-max h-max self-center">
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
            name="name"
            className={`bg-[#292929] w-[60%] self-center
            px-4 p-2 rounded text-white text-sm placeholder:text-sm placeholder:text-[#8a8a8a]`}
            placeholder="Profile Name"
          />

          <div className="flex flex-wrap w-full items-center gap-4 justify-center">
            <div
              onClick={updateProfile}
              className="text-white flex cursor-pointer px-8 py-2.5 rounded-md bg-[rgba(64,4,35,0.7)] text-md font-medium"
            >
              Save
            </div>

            <div
              className="text-white flex cursor-pointer px-6 py-2.5 rounded-md bg-[rgba(124,124,124,0.15)] text-md font-medium"
              onClick={() =>
                setEnterManageProfile && setEnterManageProfile(false)
              }
            >
              Cancel
            </div>

            <div
              onClick={deleteProfile}
              className="text-white flex cursor-pointer px-6 py-2.5 rounded-md bg-[rgba(124,124,124,0.15)] text-md font-medium"
            >
              Delete Profile
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageProfile;
