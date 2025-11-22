import { useEffect, useState } from "react";

export function useShutdownOverlay(options?: { sessionKey?: string; holdMs?: number; fadeMs?: number }) {
  const sessionKey = options?.sessionKey || "shutdown";
  const holdMs = options?.holdMs ?? 1100;
  const fadeMs = options?.fadeMs ?? 220;

  const [shutdownActive, setShutdownActive] = useState(false);
  const [overlayOpacity, setOverlayOpacity] = useState(1);

  // For GLBBackground: check sessionStorage on mount
  useEffect(() => {
    try {
      const v = sessionStorage.getItem(sessionKey);
      if (v) setShutdownActive(true);
    } catch {}
    // eslint-disable-next-line
  }, []);

  // For fade-out effect and clearing sessionStorage
  useEffect(() => {
    if (!shutdownActive) return;
    const t1 = setTimeout(() => setOverlayOpacity(0), holdMs);
    const t2 = setTimeout(() => {
      setShutdownActive(false);
      setOverlayOpacity(1);
      try {
        sessionStorage.removeItem(sessionKey);
      } catch {}
    }, holdMs + fadeMs + 30);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [shutdownActive, holdMs, fadeMs, sessionKey]);

  // For ScreenContents: call this to trigger overlay and set sessionStorage
  const triggerShutdown = () => {
    setShutdownActive(true);
    try {
      sessionStorage.setItem(sessionKey, "1");
    } catch {}
  };

  return [shutdownActive, overlayOpacity, triggerShutdown] as const;
}
