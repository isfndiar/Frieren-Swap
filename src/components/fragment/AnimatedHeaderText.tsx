"use client";
import { useEffect, useRef } from "react";
import Typed from "typed.js";
const AnimatedHeaderText = () => {
  // Create reference to store the DOM element containing the animation
  const el = useRef(null);

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: [
        "Swap Your token",
        "Fast, Secure, Frieren :3",
        "Swap Your token",
      ],
      showCursor: false,
      typeSpeed: 50,
    });
    return () => {
      // Destroy Typed instance during cleanup to stop animation
      typed.destroy();
    };
  }, []);
  return (
    <span
      ref={el}
      className="font-mono text-white font-bold text-2xl absolute top-32"
    ></span>
  );
};

export default AnimatedHeaderText;
