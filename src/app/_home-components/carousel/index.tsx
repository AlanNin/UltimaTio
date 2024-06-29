import useMediaQuery from "~/hooks/UseMediaQuery";
import { useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import CarouselCard from "./item";
import { MinusIcon } from "@heroicons/react/24/outline";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    partialVisibilityGutter: 100,
    items: 1,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1280 },
    partialVisibilityGutter: 100,
    items: 1,
  },
  tablet: {
    breakpoint: { max: 1280, min: 464 },
    partialVisibilityGutter: 10,
    items: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

type Props = {
  content: any;
};

const HomeCarousel: React.FC<Props> = ({ content }) => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 1280px)");
  const [slideIndex, setSlideIndex] = useState<number>(1);

  interface CustomDotProps {
    onClick: () => void;
    active: boolean;
  }

  const CustomDot: React.FC<CustomDotProps> = ({ onClick, active }) => {
    return (
      <li onClick={onClick} className={`flex items-center cursor-pointer mb-3`}>
        <MinusIcon
          className={`${
            active ? "h-10 w-10 text-[#a35fe8]" : "h-7 w-7 text-white"
          }`}
        />
      </li>
    );
  };

  return (
    <section id="carousel" className="w-full h-full flex flex-col z-0">
      <Carousel
        responsive={responsive}
        draggable={false}
        autoPlay
        autoPlaySpeed={8000}
        arrows={false}
        infinite
        ssr={true}
        showDots={isAboveMediumScreens}
        customDot={<CustomDot onClick={() => {}} active={true} />}
        beforeChange={(nextSlide) => {
          if (nextSlide > content.length + 1) {
            setSlideIndex(1);
          } else if (nextSlide === 1) {
            setSlideIndex(content.length);
          } else if (nextSlide === 0) {
            setSlideIndex(content.length - 1);
          } else {
            setSlideIndex(nextSlide - 1);
          }
        }}
      >
        {content.map((content: any, index: number) => (
          <CarouselCard
            key={index}
            content={content}
            isCurrent={index === slideIndex - 1}
          />
        ))}
      </Carousel>
    </section>
  );
};

export default HomeCarousel;
