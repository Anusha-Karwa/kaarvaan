import { ImageResponse } from "next/og";

export const alt = "Kaarvaan: find the real city, its crafts, its food, its people.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const petals = Array.from({ length: 8 }, (_, i) => i * 45);

export default async function Image() {
  const dots = Array.from({ length: 60 }, (_, i) => i);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#1F2A5C", position: "relative", fontFamily: "serif" }}>
        {/* dotted block-print field */}
        <div style={{ position: "absolute", inset: 0, display: "flex", flexWrap: "wrap", opacity: 0.12 }}>
          {dots.map((i) => (
            <div key={i} style={{ width: 100, height: 105, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 14, height: 14, borderRadius: 7, background: i % 2 ? "#E8A33D" : "#C2185B" }} />
            </div>
          ))}
        </div>
        {/* toran band */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 28, background: "#141B3D", display: "flex", justifyContent: "space-around", alignItems: "center" }}>
          {dots.slice(0, 30).map((i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: 5, background: i % 2 ? "#E8A33D" : "#C2185B" }} />
          ))}
        </div>
        {/* Jharokha arch */}
        <svg width="460" height="560" viewBox="0 0 230 280" style={{ position: "absolute", left: 90, top: 60 }}>
          <path d="M5,280 L5,95 C5,60 95,62 115,5 C135,62 225,60 225,95 L225,280 Z" fill="#FBF6EC" stroke="#E8A33D" strokeWidth="5" />
          <path d="M17,280 L17,100 C17,72 98,72 115,22 C132,72 213,72 213,100 L213,280" fill="none" stroke="#C2185B" strokeWidth="3" strokeDasharray="2 8" strokeLinecap="round" />
          <g transform="translate(115 170)">
            {petals.map((r) => (
              <ellipse key={r} cx="0" cy="-34" rx="13" ry="26" fill="#E8A33D" transform={`rotate(${r})`} />
            ))}
            <circle r="16" fill="#C2185B" />
            <circle r="6" fill="#FBF6EC" />
          </g>
        </svg>
        <div style={{ position: "absolute", left: 620, top: 150, right: 60, display: "flex", flexDirection: "column", color: "#FBF6EC" }}>
          <div style={{ fontSize: 30, color: "#F2C14E", letterSpacing: 4 }}>THE CARAVAN</div>
          <div style={{ fontSize: 120, lineHeight: 1, marginTop: 10 }}>Kaarvaan</div>
          <div style={{ fontSize: 40, lineHeight: 1.25, marginTop: 30 }}>Find the real city: its crafts, its food, its people.</div>
          <div style={{ fontSize: 28, marginTop: 30, color: "#F2C14E" }}>Starting with Jaipur</div>
        </div>
      </div>
    ),
    size,
  );
}
