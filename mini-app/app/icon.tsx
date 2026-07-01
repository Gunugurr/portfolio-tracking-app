import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        background: "#070F1C",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "flex-end",
        padding: "5px 4px",
        gap: "3px",
        borderRadius: "6px",
      }}
    >
      <div style={{ background: "#F97316", opacity: 0.5,  flex: 1, borderRadius: "2px", height: "38%" }} />
      <div style={{ background: "#F97316", opacity: 0.78, flex: 1, borderRadius: "2px", height: "62%" }} />
      <div style={{ background: "#F97316",                flex: 1, borderRadius: "2px", height: "90%" }} />
    </div>,
    { ...size }
  );
}
