import React from "react";
import useMediaQuery from "@/hooks/useMediaQuery";

type Props = {
  image: string;
  selectedImage: string;
  handleSelectProfilePicture: (profile: any) => void;
};

const CardProfile: React.FC<Props> = ({
  image,
  selectedImage,
  handleSelectProfilePicture,
}) => {
  const isAboveSmallScreens = useMediaQuery("(min-width: 860px)");

  return (
    <div
      className="relative cursor-pointer z-0"
      onClick={() => handleSelectProfilePicture(image)}
    >
      <img
        src={image}
        alt="Profile Picture"
        className={`rounded-md min-w-[90px] min-h-[90px] ${
          isAboveSmallScreens ? "w-[160px] h-[160px]" : "w-[90px] h-[90px]"
        }
        object-cover hover:p-[3px] hover:bg-[rgba(255,255,255,0.6)] ${
          image === selectedImage && "p-[4px] bg-[rgba(255,255,255,0.6)]"
        }`}
      />
    </div>
  );
};

export default CardProfile;
