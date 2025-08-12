"use client";
import useMediaQuery from "~/hooks/use-media-query";
import CastItem from "./item";
import { useSmoothHorizontalWheelScroll } from "~/hooks/useSmoothHScroll";

type Props = {
  cast: any;
};

const CastSection: React.FC<Props> = ({ cast }) => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 900px)");
  const scrollRef = useSmoothHorizontalWheelScroll<HTMLDivElement>();

  return (
    <>
      <div
        className={`flex flex-col w-full h-max ${
          isAboveMediumScreens && "mt-4"
        }`}
      >
        <div
          ref={scrollRef}
          className="w-max max-w-full flex overflow-x-auto overscroll-x-contain gap-6 pb-4"
        >
          {cast?.map((actor: any, index: number) => (
            <CastItem key={index} cast={actor} />
          ))}
        </div>
      </div>
    </>
  );
};

export default CastSection;
