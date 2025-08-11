"use client";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { HomeIcon, TvIcon } from "@heroicons/react/24/outline";
import { FilmIcon, CurrencyYenIcon } from "@heroicons/react/24/solid";
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
      className="flex flex-col items-center content-center justify-center bg-red"
    >
      {name === "Home" && (
        <>
          <HomeIcon
            className={`${
              (location === "/" && name === "Home") ||
              location === `/${lowerCasePage}`
                ? "fill-white"
                : "fill-none"
            }
        text-white h-6 w-auto stroke-current`}
            strokeWidth={1}
          />
          <h1 className="text-[12px] whitespace-nowrap font-medium">
            {" "}
            {name}{" "}
          </h1>
        </>
      )}

      {name === "Movies" && (
        <>
          <FilmIcon
            className={`${
              location === `/${lowerCasePage}` ? "fill-white" : "fill-none"
            }
        text-white h-6 w-auto stroke-current`}
            strokeWidth={1}
          />
          <h1 className="text-[12px] whitespace-nowrap font-medium">
            {" "}
            {name}{" "}
          </h1>
        </>
      )}

      {name === "TV" && (
        <>
          <TvIcon
            className={`${
              location === `/${lowerCasePage}` ? "fill-white" : "fill-none"
            }
        text-white h-6 w-auto stroke-current`}
            strokeWidth={1}
          />
          <h1 className="text-[12px] whitespace-nowrap font-medium">
            {" "}
            {name}{" "}
          </h1>
        </>
      )}

      {name === "Anime" && (
        <>
          <CurrencyYenIcon
            className={`${
              location === `/${lowerCasePage}` ? "fill-white" : "fill-none"
            }
        text-white h-6 w-auto stroke-current`}
            strokeWidth={1}
          />
          <h1 className="text-[12px] whitespace-nowrap font-medium">
            {" "}
            {name}{" "}
          </h1>
        </>
      )}
    </p>
  );
}

export default Item;
