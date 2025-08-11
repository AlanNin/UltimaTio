"use client";
import useMediaQuery from "~/hooks/useMediaQuery";
import CastItem from "./item";

type Props = {
  cast: any;
};

const CastSection: React.FC<Props> = ({ cast }) => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 900px)");

  return (
    <>
      <div
        className={`flex flex-col w-full h-max ${
          isAboveMediumScreens && "mt-4"
        }`}
      >
        <div className="flex overflow-x-auto w-full gap-6 pb-4">
          {cast?.map((actor: any, index: number) => (
            <CastItem key={index} cast={actor} />
          ))}
        </div>
      </div>
    </>
  );
};

export default CastSection;
