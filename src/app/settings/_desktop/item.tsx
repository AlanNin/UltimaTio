type Props = {
  Text: string;
  Icon: React.ElementType;
};
const DesktopItem: React.FC<Props> = ({ Text, Icon }) => {
  return (
    <div className="flex px-4 py-2.5 rounded-md items-center hover:bg-[rgba(255,255,255,0.1)] gap-3 text-base font-light cursor-pointer">
      <Icon
        className="text-white h-[24px] w-auto stroke-current cursor-pointer"
        strokeWidth={1}
      />
      {Text}
    </div>
  );
};

export default DesktopItem;
