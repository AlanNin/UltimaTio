import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {
  name: string;
  route: string;
};

function Item({ name, route }: Props) {
  const router = useRouter();
  const location = usePathname();

  useEffect(() => {
    if (!location) {
      //
    } else {
      console.log("location", location);
    }
  }, [location]);

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
