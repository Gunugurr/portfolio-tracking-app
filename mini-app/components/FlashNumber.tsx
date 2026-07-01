"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  value: number;
  children: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function FlashNumber({ value, children, className, style }: Props) {
  const prevRef = useRef<number | null>(null);
  const [dir, setDir]   = useState<"up" | "down" | null>(null);
  const timerRef        = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // ilk mount'ta animasyon yok
    if (prevRef.current !== null && prevRef.current !== value && value !== 0) {
      const direction = value > prevRef.current ? "up" : "down";
      if (timerRef.current) clearTimeout(timerRef.current);
      setDir(direction);
      timerRef.current = setTimeout(() => setDir(null), 750);
    }
    prevRef.current = value;
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value]);

  const flashColor =
    dir === "up"   ? "var(--color-green)" :
    dir === "down" ? "var(--color-red)"   : style?.color;

  return (
    <span
      className={`${className ?? ""} ${dir ? "price-flash" : ""}`.trim()}
      style={{ ...style, color: flashColor }}
    >
      {children}
    </span>
  );
}
