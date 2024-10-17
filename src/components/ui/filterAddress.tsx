import React from "react";

const FilterAddress = ({ address }: { address: `0x${string}` | undefined }) => {
  return <h1>{address?.slice(0, 4) + "..." + address?.slice(-4)} </h1>;
};

export default FilterAddress;
