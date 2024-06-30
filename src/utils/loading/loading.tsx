import ReactLoading from "react-loading";

type LoadingProps = {
  type: any;
};

export const Loading: React.FC<LoadingProps> = ({ type }) => {
  return (
    <div className="flex w-full h-full items-center justify-center ">
      <ReactLoading type="bars" color="#a35fe8" height={70} width={70} />
    </div>
  );
};
