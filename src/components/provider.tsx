"use client";
import { config } from "@/lib/configWagmi";
import { ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
type childrenProps = {
  children: ReactNode;
};
const queryClient = new QueryClient();
const Provider: React.FC<childrenProps> = ({ children }) => {
  return (
    <>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    </>
  );
};

export default Provider;
