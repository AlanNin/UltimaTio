"use client";
import { ReactNode, useEffect } from "react";
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
  const queryClient = getQueryClient();
  const currentProfileId = useSelector(
    (state: any) => state.profile?.currentProfile?.id
  );

  useEffect(() => {
    const tasks: Promise<unknown>[] = [
      queryClient.prefetchQuery({
        queryKey: ["home-feed"],
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
      }),
    ];

    if (currentProfileId) {
      tasks.push(
        queryClient.prefetchQuery({
          queryKey: ["watch-history", currentProfileId],
          queryFn: () => getProfileHistory(),
        })
      );
    }

    // Fire-and-forget; don’t block render
    Promise.all(tasks).catch(() => {});
  }, [queryClient, currentProfileId]);

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      {children}
    </QueryClientProvider>
  );
}
