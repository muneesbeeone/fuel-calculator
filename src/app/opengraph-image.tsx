import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function fuelcalculator() {
  const title = "India Fuel Cost Calculator";
  const subtitle = "City-wise petrol, diesel, CNG, E20 prices • Cost per km";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(135deg, #0a0a0a 0%, #111827 100%)",
          color: "#ecfdf5",
          padding: 64,
          fontFamily: "Inter, Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 12,
                background: "#16a34a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#071b0f",
                fontWeight: 800,
                fontSize: 36,
              }}
            >
              ⛽
            </div>
            <span style={{ opacity: 0.9 }}>Fuel Calculator India</span>
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: 72,
              lineHeight: 1.05,
              letterSpacing: -1.2,
              fontWeight: 800,
              color: "#ecfdf5",
            }}
          >
            {title}
          </h1>
          <p style={{ margin: 0, fontSize: 28, color: "#c6f6d5" }}>{subtitle}</p>

          <div style={{ display: "flex", gap: 16, marginTop: 8, color: "#d1fae5" }}>
            <span>Location-aware</span>
            <span>•</span>
            <span>Trip cost estimate</span>
            <span>•</span>
            <span>Nearby stations</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}


