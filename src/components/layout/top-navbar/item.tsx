"use client";
import { usePathname, useRouter } from "next/navigation";

type Props = { name: string; route: string };

function Item({ name, route }: Props) {
  const pathname = (usePathname() ?? "").toLowerCase();
  const router = useRouter();

  const href = route.startsWith("/")
    ? route.toLowerCase()
    : `/${route.toLowerCase()}`;
  const isActive = (pathname === "/" && href === "/") || pathname === href;

  const handleClick = () => {
    if (!isActive) router.push(href);
  };

  return (
    <p
      onClick={handleClick}
      className={`${
        isActive ? "text-[#a35fe8]" : "duration-300 hover:text-[#858383]"
      } text-base whitespace-nowrap cursor-pointer transition-property:text`}
    >
      {name}
    </p>
  );
}

export default Item;
