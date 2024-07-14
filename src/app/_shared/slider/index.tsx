import useMediaQuery from "~/hooks/useMediaQuery";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import SliderCard from "./item";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    partialVisibilityGutter: 10,
    items: 8,
    slidesToSlide: 8,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1280 },
    partialVisibilityGutter: 10,
    items: 8,
    slidesToSlide: 8,
  },
  tablet: {
    breakpoint: { max: 1280, min: 464 },
    partialVisibilityGutter: 10,
    items: 5,
    slidesToSlide: 5,
    swipeable: true,
    draggable: true,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    partialVisibilityGutter: 10,
    items: 3,
    slidesToSlide: 3,
    swipeable: true,
    draggable: true,
  },
};

type Props = {
  content: any;
  history?: boolean;
};

const Slider: React.FC<Props> = ({ content, history }) => {
  const isAboveTabletScreens = useMediaQuery("(min-width: 680px)");

  const filteredContent = content.filter(
    (item: any) => !item.posterUrl.includes("w780null")
  );

  return (
    <section id="carousel" className="w-full h-full flex flex-col z-0">
      <Carousel
        responsive={responsive}
        draggable={true}
        swipeable={true}
        minimumTouchDrag={10}
        arrows={true}
        partialVisbile
        ssr={true}
        customLeftArrow={
          <div
            className={`absolute cursor-pointer left-0 bottom-0 top-0 ${
              isAboveTabletScreens ? "p-2.5" : "p-0.5"
            } flex justify-center items-center bg-[rgba(219,219,219,0.08)] hover:bg-[rgba(65,64,64,0.35)] transition-colors duration-500`}
          >
            <ChevronLeftIcon
              className={`cursor-pointer text-white ${
                isAboveTabletScreens ? "h-6 w-6" : "h-5 w-5"
              }`}
              strokeWidth={2.5}
            />
          </div>
        }
        customRightArrow={
          <div
            className={`absolute cursor-pointer right-0 bottom-0 top-0 ${
              isAboveTabletScreens ? "p-2.5" : "p-0.5"
            }  flex justify-center items-center bg-[rgba(219,219,219,0.08)] hover:bg-[rgba(65,64,64,0.35)] transition-colors duration-500`}
          >
            <ChevronRightIcon
              className={`cursor-pointer text-white ${
                isAboveTabletScreens ? "h-6 w-6" : "h-5 w-5"
              }`}
              strokeWidth={2.5}
            />
          </div>
        }
      >
        {filteredContent.map((content: any, index: number) => (
          <SliderCard key={index} content={content} history={history} />
        ))}
      </Carousel>
    </section>
  );
};

export default Slider;
