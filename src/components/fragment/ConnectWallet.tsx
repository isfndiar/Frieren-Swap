"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import FilterAddress from "../ui/filterAddress";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const ConnectWallet = () => {
  const { connect, connectors } = useConnect();
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const [isHydrate, setIsHydrate] = useState<boolean>();
  const connector = connectors[0];
  useEffect(() => {
    setIsHydrate(true);
  }, []);

  return (
    <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
      {isConnected && isHydrate ? (
        <>
          {isConnected && isHydrate ? (
            <HoverCard>
              <HoverCardTrigger>
                <Button className="block rounded-full bg-transparent border border-transparent hover:border-green-tea hover:bg-transparent">
                  <FilterAddress address={address} />
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="bg-input-dark border-none shadow-xl -translate-x-10">
                <Button
                  onClick={() => disconnect()}
                  className="bg-red-600 w-full hover:bg-red-800 transition-all"
                >
                  Log out
                </Button>
              </HoverCardContent>
            </HoverCard>
          ) : null}
        </>
      ) : (
        <Button
          className="block rounded-full bg-transparent border border-transparent hover:border-green-tea hover:bg-transparent  "
          onClick={() => connect({ connector })}
        >
          Connect Wallet
        </Button>
      )}
    </div>
  );
};

export default ConnectWallet;
