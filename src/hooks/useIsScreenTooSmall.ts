import { useEffect, useState } from "react";

function testIsLessThan700() {
  if (typeof window === "undefined") {
    return true;
  }
  return window.innerWidth <= 700;
}

export default function useIsScreenTooSmall() {
  // Initialize the desktop size to an accurate value on initial state set
  const [isWidthLessThan700, setIsWidthLessThan700] = useState(testIsLessThan700);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    function autoResize() {
      setIsWidthLessThan700(testIsLessThan700());
    }

    window.addEventListener("resize", autoResize);

    autoResize();

    // Return a function to disconnect the event listener
    return () => window.removeEventListener("resize", autoResize);
  }, []);

  return isWidthLessThan700;
}
