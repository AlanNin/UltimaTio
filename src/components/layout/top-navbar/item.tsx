"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = { name: string; route: string };

function Item({ name, route }: Props) {
  const pathname = (usePathname() ?? "").toLowerCase();

  const href = route.startsWith("/")
    ? route.toLowerCase()
    : `/${route.toLowerCase()}`;
  const isActive = (pathname === "/" && href === "/") || pathname === href;

  return (
    <Link
      href={href}
      className={`${
        isActive ? "text-[#a35fe8]" : "duration-300 hover:text-[#858383]"
      } text-base whitespace-nowrap cursor-pointer transition-property:text`}
    >
      {name}
    </Link>
  );
}

export default Item;
