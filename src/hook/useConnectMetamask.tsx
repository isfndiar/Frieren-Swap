"use client";
import { useConnect } from "wagmi";
import useHydration from "./useHydration";

const useConnectMetamask = () => {
  const { connect, connectors } = useConnect();
  const connector = connectors[0];
  const { hydration } = useHydration();
  return { connect, connector, hydration };
};

export default useConnectMetamask;
