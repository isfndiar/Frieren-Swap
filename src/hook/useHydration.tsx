"use client";

import { useEffect, useState } from "react";

const useHydration = () => {
  const [hydration, setIsHydration] = useState<boolean>(false);

  useEffect(() => {
    setIsHydration(true);
  }, []);
  return {
    hydration,
  };
};

export default useHydration;
