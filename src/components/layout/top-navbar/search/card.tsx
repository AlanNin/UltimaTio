import Link from "next/link";
import NotFound from "~/assets/icons/no-image.png";
import { cn } from "~/utils/cn";
import TMDBIcon from "~/assets/icons/tmdb.png";

export default function SearchCard({
  content,
  onClick,
  isMobile,
}: {
  content: any;
  onClick: () => void;
  isMobile?: boolean;
}) {
  const imageUrl =
    !content.posterUrl ||
    content.posterUrl.includes("questionmark") ||
    content.posterUrl.includes("bestv2null")
      ? NotFound
      : content.posterUrl;

  const toImgSrc = (val: string | { src: string }) =>
    typeof val === "string" ? val : val?.src ?? "";

  const handleGetNavigateHref = () => {
    return `/${content.category}/${content.tmdbid}`;
  };

  return (
    <Link
      className={cn(
        "flex gap-4 items-center rounded-md p-2 hover:bg-[rgba(255,255,255,0.08)] cursor-pointer",
        isMobile && "p-0"
      )}
      href={handleGetNavigateHref()}
      onClick={onClick}
    >
      <img
        src={toImgSrc(imageUrl)}
        alt="Poster"
        className={cn(
          "w-16 h-auto object-cover rounded-sm aspect-[2/3]",
          isMobile && "w-20"
        )}
      />
      <div className="flex flex-col gap-1">
        <h1 className="text-sm font-normal text-white">{content.title}</h1>
        <span className="text-xs font-light text-white/75 capitalize">
          {content.category === "tv" ? "TV" : content.category}
        </span>
        <div className="flex gap-x-2 items-center">
          <img
            alt="TMDB"
            src={TMDBIcon.src}
            className="w-7 h-auto object-contain"
          />
          <span className="text-xs font-light text-white/75 capitalize">
            {content.rating ? content.rating.toFixed(1) : "Not Available"}
          </span>
        </div>
      </div>
    </Link>
  );
}
