import { useEffect } from "react";
import { GOLD, BG } from "../constants";

export default function Toast({ msg, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div style={{
      position: "fixed",
      bottom: 32,
      left: "50%",
      transform: "translateX(-50%)",
      background: GOLD,
      color: BG,
      padding: "12px 28px",
      borderRadius: 99,
      fontSize: 14,
      fontWeight: 700,
      zIndex: 999,
      whiteSpace: "nowrap",
      boxShadow: `0 8px 32px rgba(212,160,23,0.4)`,
      animation: "slideUp .3s ease",
    }}>
      {msg}
    </div>
  );
}