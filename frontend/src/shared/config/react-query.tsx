import { QueryClient, keepPreviousData } from "@tanstack/react-query";
import { MINUTE } from "../lib/utils/date/const";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      enabled: false,
      retryDelay: 500,
      staleTime: 0,
      gcTime: 15 * MINUTE,
      placeholderData: keepPreviousData,
    },
  },
});
