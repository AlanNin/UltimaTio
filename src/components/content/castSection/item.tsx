"use client";
import React from "react";
import AvatarNotFound from "~/assets/icons/no-avatar.jpg";

type Props = {
  cast: any;
};

const CastItem: React.FC<Props> = ({ cast }) => {
  const imageUrl =
    !cast.imgUrl ||
    cast.imgUrl.includes("questionmark") ||
    cast.imgUrl.includes("originalnull")
      ? AvatarNotFound
      : cast.imgUrl;

  return (
    <div className="relative cursor-pointer z-0 flex flex-col items-center text-center gap-1">
      <img
        src={imageUrl}
        alt="Profile Picture"
        width={92}
        height={92}
        className={`rounded-full min-w-[92px] min-h-[92px] w-[92px] h-[92px] object-cover hover:p-[3px] transition-all duration-200 `}
        style={{
          background:
            "linear-gradient(180deg, rgb(143, 143, 143, 0.1), rgb(176, 176, 176, 0.1))",
        }}
      />
      <h1 className="text-xs font-light text-[#dddddd]">{cast.name}</h1>
    </div>
  );
};

export default CastItem;
