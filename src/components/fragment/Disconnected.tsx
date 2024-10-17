"use client";

import useHydration from "@/hook/useHydration";
import { useAccount } from "wagmi";
import { Button } from "../ui/button";

const Disconnected = () => {
  const { hydration } = useHydration();
  const { address } = useAccount();
  return (
    <>
      {!address && hydration ? (
        <Button className="border border-blue-500 bg-white text-black hover:text-white hover:bg-blue-700 rounded-xl transition-all">
          Connect Your Wallet
        </Button>
      ) : null}
    </>
  );
};

export default Disconnected;
