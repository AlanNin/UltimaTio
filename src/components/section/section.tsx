import useMediaQuery from "~/hooks/useMediaQuery";
import Slider from "../slider";

type Props = {
  text: string;
  content: any;
  history?: boolean;
};

const Section: React.FC<Props> = ({ text, content, history }) => {
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
        <Slider content={content} history={history} />
      </div>
    </div>
  );
};

export default Section;
