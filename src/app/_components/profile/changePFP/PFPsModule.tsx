import useMediaQuery from "@/hooks/useMediaQuery";
import CardProfile from "./item";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

type Props = {
  setSelectedImage: (string: any) => void;
  setIsChangingPFP: (boolean: any) => void;
  selectedImage: string;
  images: {
    MoviesProfileImages: Array<string>;
    TVShowsProfileImages: Array<string>;
    AnimeProfileImages: Array<string>;
    CartoonProfileImages: Array<string>;
    KShowsProfileImages: Array<string>;
  };
};

const PFPsModule: React.FC<Props> = ({
  setSelectedImage,
  setIsChangingPFP,
  selectedImage,
  images,
}) => {
  const isAboveSmallScreens = useMediaQuery("(min-width: 860px)");
  const isAboveLargeScreens = useMediaQuery("(min-width: 1280px)");

  const handleSelectProfilePicture = (image: any) => {
    setSelectedImage(image);
    setIsChangingPFP(false);
  };

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 4,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1280 },
      items: 7,
    },
    tablet: {
      breakpoint: { max: 1280, min: 464 },
      items: 4,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <div className={`absolute z-30 inset-0 bg-[#0F0F0F] overflow-y-auto`}>
      {isAboveSmallScreens ? (
        <div className="flex flex-col w-full h-full items-center">
          <header
            className={`flex fixed h-max z-10 ${
              isAboveLargeScreens ? "w-[1340px]" : "w-[740px]"
            } justify-center p-10 gap-10 shadow-md border-b border-white border-opacity-5 bg-[rgba(15,15,15,0.9)]`}
          >
            <ArrowLeftCircleIcon
              onClick={() => setIsChangingPFP(false)}
              strokeWidth={1.5}
              className="text-white h-[48px] stroke-current cursor-pointer"
            />
            <h1 className="font-medium text-5xl">Select a profile picture</h1>
          </header>
          <div className="flex flex-col h-max py-8 pt-44 gap-16">
            <div className="flex flex-col gap-1.5">
              <h1 className="font-normal text-4xl font-robotocon">Movies</h1>
              <div
                className={`${
                  isAboveLargeScreens ? "w-[1280px]" : "w-[680px]"
                }`}
              >
                <Carousel
                  responsive={responsive}
                  autoPlay={false}
                  swipeable={false}
                  draggable={false}
                  partialVisible={false}
                  ssr={true}
                >
                  {images.MoviesProfileImages.map(
                    (image: any, index: number) => (
                      <CardProfile
                        key={index}
                        image={image}
                        selectedImage={selectedImage}
                        handleSelectProfilePicture={handleSelectProfilePicture}
                      />
                    )
                  )}
                </Carousel>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <h1 className="font-normal text-4xl font-robotocon">TV Shows</h1>
              <div
                className={`${
                  isAboveLargeScreens ? "w-[1280px]" : "w-[680px]"
                }`}
              >
                <Carousel
                  responsive={responsive}
                  autoPlay={false}
                  swipeable={false}
                  draggable={false}
                  partialVisible={false}
                  ssr={true}
                >
                  {images.TVShowsProfileImages.map(
                    (image: any, index: number) => (
                      <CardProfile
                        key={index}
                        image={image}
                        selectedImage={selectedImage}
                        handleSelectProfilePicture={handleSelectProfilePicture}
                      />
                    )
                  )}
                </Carousel>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <h1 className="font-normal text-4xl font-robotocon">Anime</h1>
              <div
                className={`${
                  isAboveLargeScreens ? "w-[1280px]" : "w-[680px]"
                }`}
              >
                <Carousel
                  responsive={responsive}
                  autoPlay={false}
                  swipeable={false}
                  draggable={false}
                  partialVisible={false}
                  ssr={true}
                >
                  {images.AnimeProfileImages.map(
                    (image: any, index: number) => (
                      <CardProfile
                        key={index}
                        image={image}
                        selectedImage={selectedImage}
                        handleSelectProfilePicture={handleSelectProfilePicture}
                      />
                    )
                  )}
                </Carousel>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <h1 className="font-normal text-4xl font-robotocon">Cartoon</h1>
              <div
                className={`${
                  isAboveLargeScreens ? "w-[1280px]" : "w-[680px]"
                }`}
              >
                <Carousel
                  responsive={responsive}
                  autoPlay={false}
                  swipeable={false}
                  draggable={false}
                  partialVisible={false}
                  ssr={true}
                >
                  {images.CartoonProfileImages.map(
                    (image: any, index: number) => (
                      <CardProfile
                        key={index}
                        image={image}
                        selectedImage={selectedImage}
                        handleSelectProfilePicture={handleSelectProfilePicture}
                      />
                    )
                  )}
                </Carousel>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <h1 className="font-normal text-4xl font-robotocon">KShows</h1>
              <div
                className={`${
                  isAboveLargeScreens ? "w-[1280px]" : "w-[680px]"
                }`}
              >
                <Carousel
                  responsive={responsive}
                  autoPlay={false}
                  swipeable={false}
                  draggable={false}
                  partialVisible={false}
                  ssr={true}
                >
                  {images.KShowsProfileImages.map(
                    (image: any, index: number) => (
                      <CardProfile
                        key={index}
                        image={image}
                        selectedImage={selectedImage}
                        handleSelectProfilePicture={handleSelectProfilePicture}
                      />
                    )
                  )}
                </Carousel>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <header className="flex h-max z-10 w-full p-5 fixed items-center gap-6 shadow-md border-b border-white border-opacity-5 bg-[rgba(15,15,15,0.9)]">
            <ArrowLeftCircleIcon
              onClick={() => setIsChangingPFP(false)}
              strokeWidth={0.8}
              className="text-white h-[28px] stroke-current cursor-pointer"
            />
            <h1 className="font-medium text-xl">Select a profile picture</h1>
          </header>
          <div className="flex flex-col w-full h-max py-8 pt-24 gap-10">
            <div className="flex flex-col gap-1.5">
              <h1 className="font-normal text-lg ml-4">Movies</h1>
              <div className="px-4 flex overflow-x-auto gap-4 no-scrollbar">
                {images.MoviesProfileImages.map((image: any, index: number) => (
                  <CardProfile
                    key={index}
                    image={image}
                    selectedImage={selectedImage}
                    handleSelectProfilePicture={handleSelectProfilePicture}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <h1 className="font-normal text-lg ml-4">TV Shows</h1>
              <div className="px-4 flex overflow-x-auto gap-4 no-scrollbar">
                {images.TVShowsProfileImages.map(
                  (image: any, index: number) => (
                    <CardProfile
                      key={index}
                      image={image}
                      selectedImage={selectedImage}
                      handleSelectProfilePicture={handleSelectProfilePicture}
                    />
                  )
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <h1 className="font-normal text-lg ml-4">Anime</h1>
              <div className="px-4 flex overflow-x-auto gap-4 no-scrollbar">
                {images.AnimeProfileImages.map((image: any, index: number) => (
                  <CardProfile
                    key={index}
                    image={image}
                    selectedImage={selectedImage}
                    handleSelectProfilePicture={handleSelectProfilePicture}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <h1 className="font-normal text-lg ml-4">Cartoon</h1>
              <div className="px-4 flex overflow-x-auto gap-4 no-scrollbar">
                {images.CartoonProfileImages.map(
                  (image: any, index: number) => (
                    <CardProfile
                      key={index}
                      image={image}
                      selectedImage={selectedImage}
                      handleSelectProfilePicture={handleSelectProfilePicture}
                    />
                  )
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <h1 className="font-normal text-lg ml-4">K-Shows</h1>
              <div className="px-4 flex overflow-x-auto gap-4 no-scrollbar">
                {images.KShowsProfileImages.map((image: any, index: number) => (
                  <CardProfile
                    key={index}
                    image={image}
                    selectedImage={selectedImage}
                    handleSelectProfilePicture={handleSelectProfilePicture}
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PFPsModule;
