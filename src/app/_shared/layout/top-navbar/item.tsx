import { usePathname } from "next/navigation";
import Link from "next/link";

type Props = {
  name: string;
  route: string;
};

function Item({ name, route }: Props) {
  let location = usePathname();

  if (!location) {
    location = typeof window !== "undefined" ? window.location.pathname : "/";
  }

  const lowerCasePage = route.toLowerCase().replace(/ /g, "");

  return (
    <Link
      href={lowerCasePage}
      className={`${
        (location === "/" && name === "Home") ||
        location === `/${lowerCasePage}`
          ? "cursor-pointer text-[#a35fe8]"
          : "transition-property:text duration-500 cursor-pointer hover:text-[#858383]"
      } text-base`}
    >
      {name}
    </Link>
  );
}

export default Item;
