"use client";
import { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getHomeFeed } from "~/server/queries/tmdb.queries";
import { getFeedMovie } from "~/server/queries/movie/tmdb.queries";
import { getFeedTV } from "~/server/queries/tv/tmdb.queries";
import { getFeedAnime } from "~/server/queries/anime/tmdb.queries";
import { useSelector } from "react-redux";
import { getQueryClient } from "~/hooks/get-query-client";

export default function ReactQueryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const queryClient = getQueryClient();
  const { currentProfile } = useSelector((state: any) => state.profile);

  queryClient.prefetchQuery({
    queryKey: ["home-feed", currentProfile.id ?? undefined],
    queryFn: () => getHomeFeed(),
  }),
    queryClient.prefetchQuery({
      queryKey: ["movie-feed"],
      queryFn: () => getFeedMovie(),
    }),
    queryClient.prefetchQuery({
      queryKey: ["tv-feed"],
      queryFn: () => getFeedTV(),
    }),
    queryClient.prefetchQuery({
      queryKey: ["anime-feed"],
      queryFn: () => getFeedAnime(),
    });

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      {children}
    </QueryClientProvider>
  );
}
