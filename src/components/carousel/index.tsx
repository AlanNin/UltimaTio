import useMediaQuery from "~/hooks/use-media-query";
import { useState } from "react";
import Carousel, { DotProps } from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import CarouselCard from "./item";
import { cn } from "~/utils/cn";

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

const CustomDot: React.FC<DotProps> = ({ onClick, active }) => {
  return (
    <li className="mx-[5px] mb-5">
      <button
        type="button"
        aria-label={active ? "Slide actual" : "Ir a este slide"}
        onClick={onClick}
        className={cn("group focus:outline-none", active && "cursor-default")}
      >
        <div
          className={cn(
            "h-1.5 rounded-full transition-all",
            active
              ? "w-10 bg-[#a35fe8]"
              : "w-4 bg-white/55 hover:w-6 hover:bg-white",
          )}
        />
      </button>
    </li>
  );
};

const HomeCarousel: React.FC<Props> = ({ content }) => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 1200px)");
  const [slideIndex, setSlideIndex] = useState<number>(1);

  return (
    <section id="carousel" className="z-0 flex h-full w-full flex-col">
      <Carousel
        responsive={responsive}
        draggable={true}
        swipeable={true}
        autoPlay={true}
        shouldResetAutoplay={true}
        autoPlaySpeed={4500}
        customLeftArrow={null}
        customRightArrow={null}
        arrows={false}
        infinite
        showDots={isAboveMediumScreens}
        customDot={<CustomDot />}
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
            key={`${content.tmdbid}-${index}`}
            content={content}
            isCurrent={index === slideIndex - 1}
          />
        ))}
      </Carousel>
    </section>
  );
};

export default HomeCarousel;
