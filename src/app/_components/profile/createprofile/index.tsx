import useMediaQuery from "@/hooks/useMediaQuery";
import { useTranslation } from "react-i18next";
import { ArrowLeftCircleIcon, PencilIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { createProfile } from "@/api/profile";
import PFPsModule from "../changePFP/PFPsModule";

type Props = {
  setIsCreatingProfile: (boolean: boolean) => void;
  profilePictures: any;
};

const CreateProfile: React.FC<Props> = ({
  setIsCreatingProfile,
  profilePictures,
}) => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 900px)");
  const { t } = useTranslation();

  // CONST
  const [isChangingPFP, setIsChangingPFP] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string>(
    profilePictures.AllProfileImages[
      Math.floor(Math.random() * profilePictures.AllProfileImages.length)
    ]
  );

  // INPUT
  interface Inputs {
    name?: string;
  }

  const [inputs, setInputs] = useState<Inputs>({ name: undefined });
  const [emptyInput, setEmptyInput] = useState(false);

  const handleChange = (e: any) => {
    setEmptyInput(false);
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleCreateProfile = async () => {
    if (inputs.name !== undefined && inputs.name.length > 0) {
      try {
        await createProfile(inputs.name, selectedImage);
        setIsCreatingProfile(false);
      } catch (error) {
        //
      }
    } else {
      setEmptyInput(true);
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
            <h1 className="font-medium text-6xl text-white text-center mb-1">
              Create New Profile
            </h1>
            <h1 className="font-light text-xl text-[#d1d1d1] text-center mb-10">
              Add a new profile to your account for a personalized experience
            </h1>

            <div className="flex items-center w-full gap-8">
              <div className="relative flex w-max h-max">
                <img
                  src={selectedImage}
                  alt="Profile Picture"
                  className={`rounded-md w-[190px] h-[130px] object-cover`}
                />
                <PencilIcon
                  className="absolute w-[24px] h-[24px] top-1.5 right-1.5 cursor-pointer text-white bg-[rgba(124,124,124,0.8)] p-1 rounded-md"
                  onClick={() => setIsChangingPFP(true)}
                />
              </div>

              <input
                onChange={handleChange}
                name="name"
                onFocus={() => setEmptyInput(false)}
                className={`bg-[#292929] w-full
                px-4 p-2 rounded text-white text-sm placeholder:text-sm placeholder:text-[#8a8a8a]
                ${
                  emptyInput &&
                  "border-2 border-red-600 placeholder:text-red-600"
                }`}
                placeholder="Profile Name"
              />
            </div>

            <div className="flex w-full items-center gap-4 mt-10">
              <div
                className="text-white flex cursor-pointer px-8 py-2.5 rounded-md bg-[rgba(64,4,35,0.7)] text-md font-medium"
                onClick={handleCreateProfile}
              >
                Create
              </div>

              <div
                className="text-white flex cursor-pointer px-8 py-2.5 rounded-md bg-[rgba(124,124,124,0.15)] text-md font-medium"
                onClick={() => setIsCreatingProfile(false)}
              >
                Cancel
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-full overflow-y-auto">
          <ArrowLeftCircleIcon
            onClick={() => setIsCreatingProfile(false)}
            strokeWidth={0.8}
            className="absolute text-white h-[60px] p-2 stroke-current cursor-pointer ml-4 mt-4"
          />

          <div className="h-full w-full items-center justify-between flex flex-col gap-8 py-10">
            <h1 className="font-light text-2xl text-white mt-auto">
              Create New Profile
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
              onFocus={() => setEmptyInput(false)}
              name="name"
              className={`bg-[#292929]
            px-4 p-2 rounded text-white text-sm placeholder:text-sm placeholder:text-[#8a8a8a]
            ${
              emptyInput && "border-2 border-red-600 placeholder:text-red-600"
            }`}
              placeholder="Profile Name"
            />

            <div
              className="text-white cursor-pointer px-6 py-2.5 rounded-md bg-[rgba(64,4,35,0.7)] text-md font-medium mb-auto"
              onClick={handleCreateProfile}
            >
              Create
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateProfile;
