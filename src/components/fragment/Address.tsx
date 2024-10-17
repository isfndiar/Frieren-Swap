"use client";
import useHydration from "@/hook/useHydration";
import React from "react";
import { useAccount } from "wagmi";
const Address: React.FC = () => {
  const { address, isConnected, isDisconnected } = useAccount();
  const { hydration } = useHydration();

  const renderAddress = () => {
    if (!hydration) return <div className="font-bold text-center">Loading</div>;
    if (isConnected)
      return <div className="font-bold text-center">{address}</div>;
    if (isDisconnected)
      return (
        <div className="text-red-500 font-bold text-2xl text-center mt-10">
          Disconnected
        </div>
      );
  };

  return <>{renderAddress()}</>;
};

export default Address;
