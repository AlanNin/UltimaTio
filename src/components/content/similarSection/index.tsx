import DefaultContentCard from "~/components/default-content-card";

type Props = {
  content: any;
};

const SimilarSection: React.FC<Props> = ({ content }) => {
  return (
    <>
      <div className="mt-6 flex h-max w-full flex-col gap-4">
        <h1 className="text-xl font-medium">More Like This</h1>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-4 md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
          {content.map((content: any, index: number) => (
            <DefaultContentCard key={index} content={content} />
          ))}
        </div>
      </div>
    </>
  );
};

export default SimilarSection;
