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
      console.log("location", location);
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
          ? "cursor-pointer text-[#a35fe8]"
          : "transition-property:text duration-500 cursor-pointer hover:text-[#858383]"
      } text-base`}
    >
      {name}
    </p>
  );
}

export default Item;
