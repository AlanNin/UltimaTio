import useMediaQuery from "~/hooks/use-media-query";
import Slider from "../slider";

type Props = {
  text: string;
  content: any;
  watchHistory?: boolean;
};

const Section: React.FC<Props> = ({ text, content, watchHistory }) => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 900px)");

  return (
    <div
      className={`flex flex-col gap-3 ${
        isAboveMediumScreens ? "px-10 pb-14" : "px-4 pb-8"
      }`}
    >
      <h1
        className={`${
          isAboveMediumScreens ? "text-2xl" : "text-lg"
        } font-medium`}
      >
        {text}
      </h1>
      <div className="w-full">
        <Slider content={content} watchHistory={watchHistory} />
      </div>
    </div>
  );
};

export default Section;
