import Link from "next/link";
import NoImage from "~/assets/icons/no-image.png";

type Props = {
  content: any;
};

const DefaultContentCard: React.FC<Props> = ({ content }) => {
  const id =
    content.category === "anime"
      ? content.anilistid
      : content.tmdbid
        ? content.tmdbid
        : content.id;

  const handleGetNavigateHref = () => {
    return `/${content.category}/${id}`;
  };

  const posterUrl =
    content.posterUrl ||
    (content.poster_path && !content.poster_path.includes("null")
      ? `https://media.themoviedb.org/t/p/w780${content.poster_path}`
      : null);

  return (
    <Link
      className="relative flex aspect-[2/3] w-full flex-col gap-y-2.5"
      href={handleGetNavigateHref()}
    >
      <img
        alt={`${content.title} Poster`}
        src={posterUrl || NoImage.src}
        className="h-full w-full rounded-md object-cover"
        style={{
          background:
            "linear-gradient(180deg, rgba(143,143,143,0.1), rgba(176,176,176,0.1))",
        }}
        loading="lazy"
        decoding="async"
        draggable={false}
      />
      <span className="line-clamp-1 w-full text-sm font-medium">
        {content?.title}
      </span>
    </Link>
  );
};

export default DefaultContentCard;
