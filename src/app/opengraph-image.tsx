import { ImageResponse } from "next/og";

export const alt = "A Detail — Mobile Car Detailing in Costa Mesa & Orange County";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#4dd9d9",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            borderRadius: 16,
            padding: "20px 40px",
            fontSize: 84,
            fontWeight: 900,
            letterSpacing: -2,
            color: "#000000",
          }}
        >
          <span style={{ transform: "skewX(-12deg)", display: "block" }}>A</span>
          <span>DETAIL</span>
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 36,
            fontWeight: 600,
            color: "#000000",
          }}
        >
          Mobile Detailing in Costa Mesa &amp; Orange County
        </div>
      </div>
    ),
    { ...size }
  );
}
