import { ImageResponse } from "next/og";

export const alt = "Rahul B — Data Analytics Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          color: "#f4f4f5",
          background:
            "radial-gradient(circle at 85% 20%, #5a171d, transparent 40%), #0a0a0b",
          border: "2px solid #d4a22f",
        }}
      >
        <div
          style={{
            color: "#d4a22f",
            fontSize: 24,
            letterSpacing: 8,
            marginBottom: 28,
          }}
        >
          DATA ANALYTICS PORTFOLIO
        </div>
        <div style={{ fontSize: 76, fontWeight: 700 }}>Rahul B</div>
        <div style={{ color: "#d4a22f", fontSize: 34, marginTop: 16 }}>
          Turning data into direction.
        </div>
      </div>
    ),
    size,
  );
}
