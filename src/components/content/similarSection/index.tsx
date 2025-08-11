import SimilarCard from "./card";

type Props = {
  content: any;
};

const SimilarSection: React.FC<Props> = ({ content }) => {
  return (
    <>
      <div className="flex flex-col w-full h-max mt-6 gap-4">
        <h1 className="text-xl font-bold">More Like This</h1>
        <div className="flex flex-wrap gap-5 justify-center">
          {content.map((content: any, index: number) => (
            <SimilarCard key={index} similarContent={content} />
          ))}
        </div>
      </div>
    </>
  );
};

export default SimilarSection;
