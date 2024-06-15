type Props = {
  Text: string;
  Icon: React.ElementType;
};
const MobileItem: React.FC<Props> = ({ Text, Icon }) => {
  return (
    <div
      className={`px-4 py-6 flex items-center gap-6 text-base font-light border-white`}
      style={{
        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
      }}
    >
      <Icon
        className="text-white h-[24px] w-auto stroke-current cursor-pointer"
        strokeWidth={1}
      />
      {Text}
    </div>
  );
};

export default MobileItem;
