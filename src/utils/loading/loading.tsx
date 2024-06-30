import ReactLoading, { LoadingType } from "react-loading";

type LoadingProps = {
  type: LoadingType;
  color?: string;
  height?: number;
  width?: number;
};

export const Loading: React.FC<LoadingProps> = ({
  type,
  color,
  height,
  width,
}) => {
  return (
    <div className="flex w-full h-full items-center justify-center">
      <ReactLoading
        type={type}
        color={color || "#a35fe8"}
        height={height || 70}
        width={width || 70}
      />
    </div>
  );
};
