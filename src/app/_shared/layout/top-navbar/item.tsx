import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {
  name: string;
  route: string;
};

function Item({ name, route }: Props) {
  let location = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!location) {
      location = window.location.pathname;
    }
  }, []);

  const lowerCasePage = route.toLowerCase().replace(/ /g, "");

  return (
    <p
      onClick={() => {
        if (location === `/${lowerCasePage}`) {
          return;
        }
        router.push(`/${lowerCasePage}`);
      }}
      className={`${
        (location === "/" && name === "Home") ||
        location === `/${lowerCasePage}`
          ? "text-[#a35fe8]"
          : "duration-300 hover:text-[#858383]"
      } text-base whitespace-nowrap cursor-pointer transition-property:text `}
    >
      {name}
    </p>
  );
}

export default Item;
