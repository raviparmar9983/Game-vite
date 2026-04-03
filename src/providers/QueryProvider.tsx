import { QueryClient, QueryClientProvider, type QueryClientConfig } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";

const defaultQueryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
};

type Props = {
  children: ReactNode;
  config?: QueryClientConfig;
};

export const QueryProvider = ({ children, config }: Props) => {
  const [queryClient] = useState(() => new QueryClient(config ?? defaultQueryClientConfig));

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};