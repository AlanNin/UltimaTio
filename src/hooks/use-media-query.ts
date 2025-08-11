import { useState, useEffect } from "react";

const useMediaQuery = (query: string) => {
  const storedMatches = localStorage.getItem("mediaMatches");
  const initialMatches =
    storedMatches !== null ? JSON.parse(storedMatches) : false;

  const [matches, setMatches] = useState(initialMatches);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = () => {
      setMatches(media.matches);
    };

    window.addEventListener("resize", listener);

    return () => window.removeEventListener("resize", listener);
  }, [query]);

  // Update local storage when matches change
  useEffect(() => {
    localStorage.setItem("mediaMatches", JSON.stringify(matches));
  }, [matches]);

  return matches;
};

export default useMediaQuery;
