import Link from "next/link";

type Props = {
  content: any;
};

const DefaultContentCard: React.FC<Props> = ({ content }) => {
  const handleGetNavigateHref = () => {
    return `/${content.category}/${content.tmdbid}`;
  };

  const posterUrl =
    !content.posterUrl ||
    content.posterUrl.includes("2Fw780null") ||
    content.posterUrl.includes("bestv2null")
      ? "null"
      : "https://media.themoviedb.org/t/p/w780" + content.posterUrl;

  if (posterUrl === "null") {
    return null;
  }

  return (
    <Link
      className="relative w-full aspect-[2/3]"
      href={handleGetNavigateHref()}
    >
      <img
        alt={`${content.title} Poster`}
        src={posterUrl}
        className="absolute inset-0 w-full h-full object-cover rounded-md"
        style={{
          background:
            "linear-gradient(180deg, rgba(143,143,143,0.1), rgba(176,176,176,0.1))",
        }}
        loading="lazy"
        decoding="async"
        draggable={false}
      />
    </Link>
  );
};

export default DefaultContentCard;
