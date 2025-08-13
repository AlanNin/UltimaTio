"use client";
import { ReactNode, useEffect, useMemo } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useSelector } from "react-redux";
import { getQueryClient } from "~/hooks/get-query-client";

import { getHomeFeed } from "~/server/queries/tmdb.queries";
import { getFeedMovie } from "~/server/queries/movie/tmdb.queries";
import { getFeedTV } from "~/server/queries/tv/tmdb.queries";
import { getFeedAnime } from "~/server/queries/anime/tmdb.queries";
import { getProfileHistory } from "~/server/queries/contentProfile.queries";

export default function ReactQueryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const queryClient = useMemo(() => getQueryClient(), []);
  const currentProfileId = useSelector(
    (state: any) => state.profile?.currentProfile?.id
  );

  useEffect(() => {
    const feeds = [
      ["home-feed", getHomeFeed],
      ["movie-feed", getFeedMovie],
      ["tv-feed", getFeedTV],
      ["anime-feed", getFeedAnime],
    ] as const;

    Promise.all(
      feeds.map(([key, fn]) =>
        queryClient.prefetchQuery({
          queryKey: [key],
          queryFn: fn,
          staleTime: 1000 * 60 * 15,
        })
      )
    ).catch(() => {});
  }, [queryClient]);

  useEffect(() => {
    if (!currentProfileId) return;

    queryClient.prefetchQuery({
      queryKey: ["watch-history", currentProfileId],
      queryFn: () => getProfileHistory(),
    });
  }, [queryClient, currentProfileId]);

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      {children}
    </QueryClientProvider>
  );
}
