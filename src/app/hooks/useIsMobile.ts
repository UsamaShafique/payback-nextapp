"use client";
import { useEffect, useState } from "react";

export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const userAgent = navigator.userAgent || navigator.vendor || "";
    const isMobileDevice = /Mobi|Android|iPhone|iPad|iPod/i.test(userAgent);

    const checkMobile = () => {
      const isSmallScreen = window.innerWidth <= breakpoint;
      setIsMobile(isMobileDevice || isSmallScreen);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, [breakpoint]);

  return isMobile;
}
