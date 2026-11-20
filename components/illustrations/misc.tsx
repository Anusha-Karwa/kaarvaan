import type { ReactNode } from "react";
import { BandhaniMarks, Buti, C, Chhatri, Dots, Limb, Rupee, Svg, type IllustrationProps } from "./primitives";

type Pt = readonly [number, number];
type Mood = "smile" | "grin" | "sad" | "talk" | "worried";

/* ------------------------------------------------------------------ */
/* Shared figure parts                                                 */
/* ------------------------------------------------------------------ */

/** Upper arm in a sleeve colour, forearm and hand in skin, from shoulder → elbow → hand. */
function Arm({ pts, sleeve, skin = C.marigold }: { pts: readonly [Pt, Pt, Pt]; sleeve: string; skin?: string }) {
  const [[sx, sy], [ex, ey], [hx, hy]] = pts;
  return (
    <g>
      <Limb d={`M${ex} ${ey} L${hx} ${hy}`} color={skin} w={5} />
      <Limb d={`M${sx} ${sy} L${ex} ${ey}`} color={sleeve} w={7} />
      <circle cx={hx} cy={hy} r={3.8} fill={skin} />
    </g>
  );
}

/** Eyes, brows and mouth for a face centred near (0, cy). */
function Face({ cy, mood }: { cy: number; mood: Mood }) {
  const e = cy;
  const happyEyes = mood === "grin";
  const worried = mood === "sad" || mood === "worried";
  return (
    <g strokeWidth={1.6}>
      {happyEyes ? (
        <path d={`M-7 ${e} q2 -3 4 0 M3 ${e} q2 -3 4 0`} />
      ) : (
        <g fill={C.indigoDark} stroke="none">
          <circle cx={-5} cy={e} r={1.8} />
          <circle cx={5} cy={e} r={1.8} />
        </g>
      )}
      {worried ? (
        <path d={`M-8.5 ${e - 4} L-3 ${e - 6.5} M3 ${e - 6.5} L8.5 ${e - 4}`} strokeWidth={1.4} />
      ) : (
        <path d={`M-8 ${e - 5} q2.5 -2 5 0 M3 ${e - 5} q2.5 -2 5 0`} strokeWidth={1.4} />
      )}
      <circle cx={-8} cy={e + 5} r={2.4} fill={C.rani} opacity={0.35} stroke="none" />
      <circle cx={8} cy={e + 5} r={2.4} fill={C.rani} opacity={0.35} stroke="none" />
      {mood === "smile" ? <path d={`M-4 ${e + 6} C-2 ${e + 9} 2 ${e + 9} 4 ${e + 6}`} /> : null}
      {mood === "grin" ? <path d={`M-5 ${e + 5.5} C-4 ${e + 11} 4 ${e + 11} 5 ${e + 5.5} Z`} fill={C.rani} strokeWidth={1.4} /> : null}
      {mood === "sad" ? <path d={`M-4 ${e + 9} C-2 ${e + 6} 2 ${e + 6} 4 ${e + 9}`} /> : null}
      {mood === "talk" ? <ellipse cx={0} cy={e + 7.5} rx={2.6} ry={2.2} fill={C.indigoDark} strokeWidth={1} /> : null}
      {mood === "worried" ? <path d={`M-4 ${e + 8} q2 -2 4 0 q2 2 4 0`} /> : null}
      {mood === "sad" ? <path d={`M8 ${e + 1} c2.4 3.4 2.4 6 0 6 c-2.4 0 -2.4 -2.6 0 -6 Z`} fill={C.ivory} strokeWidth={1.2} /> : null}
    </g>
  );
}

type AnanyaPose = "phone" | "down" | "wave" | "tag" | "reach";

const ANANYA_ARMS: Record<AnanyaPose, [readonly [Pt, Pt, Pt], readonly [Pt, Pt, Pt]]> = {
  phone: [
    [[-14, -95], [-21, -76], [-9, -84]],
    [[14, -95], [19, -75], [21, -58]],
  ],
  down: [
    [[-14, -95], [-19, -76], [-21, -58]],
    [[14, -95], [19, -75], [21, -58]],
  ],
  wave: [
    [[-14, -95], [-19, -76], [-21, -58]],
    [[14, -95], [26, -102], [28, -120]],
  ],
  tag: [
    [[-14, -95], [-26, -108], [-20, -130]],
    [[14, -95], [26, -108], [20, -130]],
  ],
  reach: [
    [[-14, -95], [-26, -90], [-36, -96]],
    [[14, -95], [26, -102], [28, -120]],
  ],
};

/** Ananya, the Kaarvaan traveller: rani kurta, jeans, braid, tote bag. Origin = between her feet. */
function Ananya({ x, y, s = 1, mood = "smile", pose = "phone" }: { x: number; y: number; s?: number; mood?: Mood; pose?: AnanyaPose }) {
  const [left, right] = ANANYA_ARMS[pose];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* hair behind */}
      <path d="M-15 -114 C-16 -128 -8 -133 0 -133 C9 -133 16 -127 15 -114 L14 -103 L-14 -103 Z" fill={C.indigoDark} />
      {/* legs + shoes */}
      <path d="M-11 -52 L-13 -6 L-3 -6 L-1 -38 L1 -38 L3 -6 L13 -6 L11 -52 Z" fill={C.indigo} />
      <path d="M-1 -38 V-20" stroke={C.indigoDark} strokeWidth={1.4} />
      <ellipse cx={-8} cy={-4} rx={7} ry={3.5} fill={C.terracotta} />
      <ellipse cx={8} cy={-4} rx={7} ry={3.5} fill={C.terracotta} />
      <rect x={-4} y={-108} width={8} height={10} fill={C.marigold} />
      {/* kurta */}
      <path d="M-15 -98 C-18 -80 -22 -60 -23 -46 L23 -46 C22 -60 18 -80 15 -98 C10 -101 6 -101 4 -100 L0 -92 L-4 -100 C-6 -101 -10 -101 -15 -98 Z" fill={C.rani} />
      <Dots x={-12} y={-88} cols={4} rows={5} dx={8} dy={7} r={1.1} fill={C.haldi} />
      <path d="M-22.5 -52 H22.5 L23 -46 H-23 Z" fill={C.haldi} strokeWidth={1.6} />
      <Dots x={-19} y={-49} cols={8} dx={5.5} r={0.9} fill={C.rani} stagger={false} />
      {/* braid over the shoulder */}
      {[-104, -98, -92, -86].map((by, i) => (
        <ellipse key={by} cx={12 + i * 0.8} cy={by} rx={3.4} ry={3.6} fill={C.indigoDark} strokeWidth={1.4} />
      ))}
      <circle cx={15} cy={-82} r={1.8} fill={C.haldi} strokeWidth={1} />
      {/* tote bag */}
      <path d="M10 -97 C18 -92 22 -82 22 -72" stroke={C.indigo} strokeWidth={5} />
      <path d="M10 -97 C18 -92 22 -82 22 -72" stroke={C.sand} strokeWidth={2.5} />
      {pose !== "tag" ? (
        <g>
          <path d="M17 -72 H37 L39 -45 H15 Z" fill={C.sand} />
          <Buti cx={27} cy={-58} r={6} petals={6} fill={C.rani} />
        </g>
      ) : null}
      <Arm pts={left} sleeve={C.rani} />
      <Arm pts={right} sleeve={C.rani} />
      {pose === "phone" ? (
        <g>
          <rect x={-13} y={-97} width={9} height={14} rx={2} fill={C.indigoDark} />
          <rect x={-11.5} y={-95} width={6} height={9} rx={1} fill={C.haldi} stroke="none" />
          <circle cx={-9} cy={-84} r={3.8} fill={C.marigold} />
        </g>
      ) : null}
      {/* head */}
      <circle cx={0} cy={-116} r={13} fill={C.marigold} />
      <path d="M-13 -116 C-12 -128 -2 -131 4 -130 C10 -129 14 -124 13 -114 C8 -120 2 -124 -4 -122 C-8 -121 -11 -119 -13 -116 Z" fill={C.indigoDark} />
      <circle cx={-13} cy={-110} r={2} fill={C.haldi} strokeWidth={1} />
      <circle cx={13} cy={-110} r={2} fill={C.haldi} strokeWidth={1} />
      <circle cx={0} cy={-121} r={1.2} fill={C.rani} stroke="none" />
      <Face cy={-114} mood={mood} />
    </g>
  );
}

/** The auto driver: khaki-sand shirt, checked gamchha, cap, magnificent moustache. */
function DriverFigure({ x, y, s = 1, mood = "grin" }: { x: number; y: number; s?: number; mood?: Mood }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-14 -56 L-16 -6 L-4 -6 L-1 -40 L1 -40 L4 -6 L16 -6 L14 -56 Z" fill={C.indigoDark} />
      <ellipse cx={-10} cy={-4} rx={8} ry={3.5} fill={C.terracotta} />
      <ellipse cx={10} cy={-4} rx={8} ry={3.5} fill={C.terracotta} />
      <rect x={-5} y={-110} width={10} height={12} fill={C.marigold} />
      {/* shirt */}
      <path d="M-18 -100 C-22 -84 -23 -66 -20 -52 L20 -52 C23 -66 22 -84 18 -100 C12 -103 6 -103 4 -102 L0 -94 L-4 -102 C-6 -103 -12 -103 -18 -100 Z" fill={C.sand} />
      <path d="M0 -94 V-52" strokeWidth={1.4} />
      <Dots x={2.5} y={-86} cols={1} rows={4} dy={9} r={1.2} fill={C.indigo} stagger={false} />
      <rect x={6} y={-88} width={9} height={9} fill={C.sand} strokeWidth={1.4} />
      <path d="M9 -91 V-84" stroke={C.rani} strokeWidth={1.8} />
      <path d="M-20 -56 H20" stroke={C.terracotta} strokeWidth={3} />
      {/* gamchha on shoulder */}
      <path d="M-18 -101 L-8 -103 L-10 -70 L-19 -72 Z" fill={C.rani} />
      <path d="M-15 -100 L-16 -72 M-11 -101 L-13 -71 M-18 -90 L-9 -91 M-18 -80 L-10 -81" stroke={C.ivory} strokeWidth={1} />
      <Arm pts={[[-17, -97], [-29, -80], [-19, -66]]} sleeve={C.sand} />
      <Arm pts={[[17, -97], [30, -84], [38, -98]]} sleeve={C.sand} />
      {/* head */}
      <circle cx={0} cy={-118} r={14} fill={C.marigold} />
      <circle cx={-14} cy={-116} r={3} fill={C.marigold} />
      <circle cx={14} cy={-116} r={3} fill={C.marigold} />
      <circle cx={0} cy={-118} r={14} fill="none" />
      <path d="M-15 -122 C-15 -136 15 -136 15 -122 Z" fill={C.indigo} />
      <path d="M-17 -122 H17 C17 -118 -17 -118 -17 -122 Z" fill={C.indigoDark} />
      <circle cx={0} cy={-134} r={2} fill={C.haldi} />
      <g transform="translate(0 -2)">
        <Face cy={-114} mood={mood} />
      </g>
      <path
        d="M0 -109 C-4 -112 -10 -112 -13 -108 C-15 -106 -16 -103 -19 -105 C-15 -100 -8 -103 0 -106 C8 -103 15 -100 19 -105 C16 -103 15 -106 13 -108 C10 -112 4 -112 0 -109 Z"
        fill={C.indigoDark}
        strokeWidth={1.4}
      />
    </g>
  );
}

/** The pushy commission-shop seller: safa turban, rani bandi, ivory kurta, pointing hand. */
function SellerFigure({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* turban tail behind */}
      <path d="M12 -124 C24 -118 26 -100 22 -88 L17 -90 C19 -102 17 -112 10 -118 Z" fill={C.marigold} />
      <path d="M-13 -36 L-15 -6 L-4 -6 L-1 -30 L1 -30 L4 -6 L15 -6 L13 -36 Z" fill={C.ivory} />
      <path d="M-18 -4 C-18 -8 -6 -8 -3 -4 Z M18 -4 C18 -8 6 -8 3 -4 Z" fill={C.rani} />
      <path d="M-18 -4 L-21 -7 M18 -4 L21 -7" />
      <rect x={-5} y={-110} width={10} height={12} fill={C.marigold} />
      {/* kurta with belly */}
      <path d="M-18 -100 C-26 -78 -29 -52 -24 -32 L24 -32 C29 -52 26 -78 18 -100 C10 -103 -10 -103 -18 -100 Z" fill={C.ivory} />
      <Dots x={-18} y={-38} cols={7} dx={6} r={1} fill={C.marigold} stagger={false} />
      {/* bandi (vest) */}
      <path d="M-18 -100 C-25 -80 -26 -64 -23 -52 L-4 -52 L-4 -97 Z" fill={C.rani} />
      <path d="M18 -100 C25 -80 26 -64 23 -52 L4 -52 L4 -97 Z" fill={C.rani} />
      <Dots x={-20} y={-88} cols={2} rows={5} dx={7} dy={7} r={1} fill={C.haldi} />
      <Dots x={9} y={-88} cols={2} rows={5} dx={7} dy={7} r={1} fill={C.haldi} />
      <Dots x={0} y={-90} cols={1} rows={4} dy={9} r={1.6} fill={C.haldi} stagger={false} />
      <Arm pts={[[17, -96], [30, -78], [20, -66]]} sleeve={C.ivory} />
      <Arm pts={[[-17, -96], [-34, -104], [-50, -118]]} sleeve={C.ivory} />
      <Limb d="M-51 -119 L-57 -124" color={C.marigold} w={2.6} />
      <circle cx={-50} cy={-118} r={4} fill={C.marigold} />
      {/* head */}
      <circle cx={-14} cy={-116} r={3} fill={C.marigold} />
      <circle cx={14} cy={-116} r={3} fill={C.marigold} />
      <circle cx={0} cy={-118} r={14} fill={C.marigold} />
      <circle cx={14} cy={-113} r={1.6} fill={C.haldi} strokeWidth={1} />
      {/* safa turban */}
      <path d="M-17 -118 C-22 -144 22 -144 17 -118 C8 -123 -8 -123 -17 -118 Z" fill={C.marigold} />
      <path d="M-16 -124 C-6 -128 8 -134 17 -127 M-13 -132 C-4 -135 6 -139 12 -137" stroke={C.rani} strokeWidth={3} />
      <Dots x={-10} y={-129} cols={4} dx={7} r={0.9} fill={C.ivory} />
      <path d="M-10 -103 C-8 -98 8 -98 10 -103 Z" fill={C.ivory} strokeWidth={1.4} />
      <g fill={C.indigoDark} stroke="none">
        <circle cx={-5} cy={-117} r={1.8} />
        <circle cx={5} cy={-117} r={1.8} />
      </g>
      <path d="M-9 -123 L-3 -121 M3 -121 L9 -123" strokeWidth={1.6} />
      <path
        d="M0 -108 C-4 -111 -10 -111 -13 -107 C-15 -105 -16 -102 -19 -104 C-15 -99 -8 -102 0 -105 C8 -102 15 -99 19 -104 C16 -102 15 -105 13 -107 C10 -111 4 -111 0 -108 Z"
        fill={C.indigoDark}
        strokeWidth={1.4}
      />
    </g>
  );
}

/** A Bagru/Sanganer maker: leaf-green odhni over her head, marigold ghaghra. */
function MakerFigure({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-17 -110 C-19 -134 19 -134 17 -110 L24 -90 L-24 -90 Z" fill={C.leaf} />
      <ellipse cx={-8} cy={-3} rx={6} ry={3} fill={C.terracotta} />
      <ellipse cx={8} cy={-3} rx={6} ry={3} fill={C.terracotta} />
      <path d="M-14 -64 L-28 -5 H28 L14 -64 Z" fill={C.marigold} />
      <Dots x={-12} y={-54} cols={5} rows={5} dx={6} dy={8} r={1.2} fill={C.rani} />
      <path d="M-26.6 -12 H26.6 L28 -5 H-28 Z" fill={C.rani} strokeWidth={1.6} />
      <Dots x={-23} y={-8.5} cols={9} dx={5.8} r={1} fill={C.haldi} stagger={false} />
      <rect x={-4} y={-108} width={8} height={10} fill={C.marigold} />
      <path d="M-15 -98 C-17 -86 -16 -72 -14 -62 H14 C16 -72 17 -86 15 -98 C10 -101 -10 -101 -15 -98 Z" fill={C.terracotta} />
      <path d="M12 -101 L19 -96 L-10 -62 L-17 -66 Z" fill={C.leaf} />
      <Dots x={-8} y={-70} cols={1} rows={1} r={1.3} fill={C.haldi} />
      <path d="M8 -94 L-12 -68" stroke={C.haldi} strokeWidth={1.4} strokeDasharray="1 4" />
      <Arm pts={[[-14, -95], [-20, -76], [-18, -60]]} sleeve={C.terracotta} />
      <Arm pts={[[14, -95], [26, -90], [36, -96]]} sleeve={C.terracotta} />
      <path d="M31 -94 L32 -89 M-20 -64 H-15" stroke={C.haldi} strokeWidth={2.4} />
      <circle cx={0} cy={-114} r={12.5} fill={C.marigold} />
      <path d="M-12 -112 C-12 -124 12 -124 12 -112 C8 -118 -8 -118 -12 -112 Z" fill={C.indigoDark} />
      <path d="M-15 -108 C-17 -134 17 -134 15 -108 L12 -108 C13 -126 -13 -126 -12 -108 Z" fill={C.leaf} />
      <Dots x={-9} y={-125} cols={4} dx={6} r={0.9} fill={C.haldi} stagger={false} />
      <circle cx={0} cy={-120} r={1.2} fill={C.rani} stroke="none" />
      <Face cy={-113} mood="grin" />
      <circle cx={4} cy={-108} r={1.8} fill="none" stroke={C.haldi} strokeWidth={1.2} />
    </g>
  );
}

/** Patterned round backdrop used behind single characters. */
function Medallion({ cx = 100, cy = 84, r = 62 }: { cx?: number; cy?: number; r?: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={C.sand} stroke="none" />
      {Array.from({ length: 36 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 36;
        return <circle key={i} cx={cx + Math.cos(a) * (r + 6)} cy={cy + Math.sin(a) * (r + 6)} r={1.4} fill={C.marigold} stroke="none" />;
      })}
    </g>
  );
}

/** Chat bubble with abstract text lines (no real words). */
function Bubble({ x, y, w, h, fill, tail = "bl", ink = C.ivory, children }: { x: number; y: number; w: number; h: number; fill: string; tail?: "bl" | "br"; ink?: string; children?: ReactNode }) {
  const tx = tail === "bl" ? x + 10 : x + w - 10;
  const dir = tail === "bl" ? -1 : 1;
  return (
    <g>
      <path d={`M${tx - 5} ${y + h - 1} L${tx + dir * 4} ${y + h + 8} L${tx + 5} ${y + h - 1} Z`} fill={fill} />
      <rect x={x} y={y} width={w} height={h} rx={7} fill={fill} />
      <path d={`M${tx - 4} ${y + h} H${tx + 4}`} stroke={fill} strokeWidth={3} />
      {children ?? (
        <path d={`M${x + 7} ${y + h / 2 - 3} H${x + w - 8} M${x + 7} ${y + h / 2 + 3} H${x + w * 0.6}`} stroke={ink} strokeWidth={2} />
      )}
    </g>
  );
}

/** Rounded app-icon tile with a simple glyph. */
function AppIcon({ x, y, fill, glyph }: { x: number; y: number; fill: string; glyph: "pin" | "star" | "heart" | "plane" | "rupee" }) {
  const g: Record<typeof glyph, ReactNode> = {
    pin: <path d={`M${x + 10} ${y + 16} C${x + 4} ${y + 10} ${x + 5} ${y + 4} ${x + 10} ${y + 4} C${x + 15} ${y + 4} ${x + 16} ${y + 10} ${x + 10} ${y + 16} Z`} fill={C.ivory} strokeWidth={1.4} />,
    star: <path d={`M${x + 10} ${y + 3} L${x + 12} ${y + 8} L${x + 17} ${y + 8} L${x + 13} ${y + 11} L${x + 15} ${y + 16} L${x + 10} ${y + 13} L${x + 5} ${y + 16} L${x + 7} ${y + 11} L${x + 3} ${y + 8} L${x + 8} ${y + 8} Z`} fill={C.haldi} strokeWidth={1.2} />,
    heart: <path d={`M${x + 10} ${y + 16} C${x + 2} ${y + 10} ${x + 4} ${y + 3} ${x + 10} ${y + 7} C${x + 16} ${y + 3} ${x + 18} ${y + 10} ${x + 10} ${y + 16} Z`} fill={C.rani} strokeWidth={1.2} />,
    plane: <path d={`M${x + 3} ${y + 11} L${x + 17} ${y + 5} L${x + 12} ${y + 16} L${x + 10} ${y + 11} Z`} fill={C.ivory} strokeWidth={1.2} />,
    rupee: <Rupee x={x + 5} y={y + 3} s={1} color={C.ivory} w={2} />,
  };
  return (
    <g>
      <rect x={x} y={y} width={20} height={20} rx={5} fill={fill} />
      {g[glyph]}
      <circle cx={x + 19} cy={y + 1} r={3.4} fill={C.rani} strokeWidth={1.2} />
    </g>
  );
}

/** The auto-rickshaw drawing, in a 240×160 box. */
function AutoShape() {
  return (
    <g>
      <path d="M2 64 H16 M0 84 H12 M4 104 H18" />
      <path d="M24 146 H230" strokeDasharray="2 6" />
      <circle cx={36} cy={140} r={5} fill={C.sand} />
      <circle cx={26} cy={136} r={4} fill={C.sand} />
      <circle cx={18} cy={142} r={3} fill={C.sand} />
      {/* open interior */}
      <path d="M58 48 L190 48 L200 96 L58 96 Z" fill={C.indigoDark} />
      <rect x={68} y={64} width={46} height={28} rx={6} fill={C.terracotta} />
      <Dots x={75} y={71} cols={6} rows={3} dx={6.5} dy={6} r={1} fill={C.haldi} />
      <path d="M126 48 V94" stroke={C.sand} strokeWidth={3} />
      <path d="M168 80 L184 72" stroke={C.sand} strokeWidth={3} />
      {/* canopy */}
      <path d="M24 90 C18 58 26 30 64 28 H170 C184 28 192 36 194 50 H60 V96 Z" fill={C.haldi} />
      <path d="M146 50 H156 V96 H146 Z" fill={C.haldi} />
      <Dots x={46} y={37} cols={20} dx={7} r={1.1} fill={C.marigold} stagger={false} />
      {Array.from({ length: 16 }, (_, i) => (
        <path key={i} d={`M${62 + i * 8} 50 l4 5 l4 -5 Z`} fill={i % 2 ? C.rani : C.marigold} strokeWidth={1} />
      ))}
      <path d="M34 80 C32 66 36 58 46 58 H52 V80 Z" fill={C.indigoDark} strokeWidth={1.6} />
      {/* windscreen pillar */}
      <path d="M182 50 L194 50 L204 82 L192 82 Z" fill={C.ivory} />
      <path d="M187 55 L193 74" stroke={C.sand} strokeWidth={2} />
      <path d="M198 62 L214 54" />
      <ellipse cx={216} cy={53} rx={4} ry={3} fill={C.ivory} />
      {/* body */}
      <path d="M22 122 V98 C22 95 26 94 30 94 H184 L192 82 H206 C210 82 211 86 212 90 L218 118 C219 124 216 128 210 128 H30 C25 128 22 126 22 122 Z" fill={C.leaf} />
      <path d="M24 104 H216" stroke={C.haldi} strokeWidth={3} />
      <Dots x={60} y={112} cols={18} dx={7} r={1.2} fill={C.ivory} stagger={false} />
      <rect x={18} y={88} width={6} height={9} rx={1} fill={C.rani} />
      <rect x={30} y={109} width={22} height={9} rx={1} fill={C.ivory} strokeWidth={1.6} />
      <circle cx={211} cy={93} r={4.5} fill={C.haldi} />
      <circle cx={211} cy={93} r={1.8} fill={C.ivory} stroke="none" />
      {/* wheels */}
      {[
        [66, 132, 14],
        [198, 133, 13],
      ].map(([cx, cy, r]) => (
        <g key={cx}>
          <circle cx={cx} cy={cy} r={r} fill={C.indigoDark} />
          <circle cx={cx} cy={cy} r={r * 0.5} fill={C.sand} />
          <circle cx={cx} cy={cy} r={2.4} fill={C.indigo} stroke="none" />
        </g>
      ))}
      <Limb d="M182 126 C184 114 212 114 216 126" color={C.leaf} w={4} />
    </g>
  );
}

const CAMEL_SILHOUETTE =
  "M-24 -27 C-24 -30 -20 -32 -16 -32 C-13 -32 -12 -30 -12 -28 C-11 -24 -9 -20 -5 -19 C-2 -26 4 -31 9 -30 C13 -29 16 -24 18 -20 C22 -19 24 -15 22 -11 L21 0 H18.5 L18 -9 L15 -9 L14.5 0 H12 L11 -11 L-1 -11 L-2 0 H-4.5 L-5 -10 L-7 -10 L-7.5 0 H-10 L-10 -13 C-12 -16 -14 -22 -17 -24 L-20 -24 C-23 -24 -24 -25 -24 -27 Z";

/* ------------------------------------------------------------------ */
/* Exported illustrations                                              */
/* ------------------------------------------------------------------ */

/** A cute, slightly lost camel in festive saddle cloth, footprints looping behind it (404 page). */
export function Camel(props: IllustrationProps) {
  const leg = (x: number, fill: string) =>
    `M${x - 6} 118 L${x - 4} 148 C${x - 6} 154 ${x - 4} 158 ${x - 3} 162 L${x - 3} 176 L${x + 5} 176 L${x + 4} 160 C${x + 6} 154 ${x + 4} 148 ${x + 5} 118 Z|${fill}`;
  const legs = [leg(92, C.haldi), leg(154, C.haldi), leg(76, C.sand), leg(138, C.sand)];
  const prints: Pt[] = [
    [14, 194], [26, 188], [40, 192], [52, 186], [62, 190], [50, 196], [36, 198], [22, 196],
  ];
  return (
    <Svg {...props} viewBox="0 0 240 200">
      {/* question mark */}
      <path d="M204 22 C204 12 220 12 220 22 C220 29 212 29 212 36" stroke={C.indigo} strokeWidth={7} />
      <path d="M204 22 C204 12 220 12 220 22 C220 29 212 29 212 36" stroke={C.haldi} strokeWidth={3.5} />
      <circle cx={212} cy={45} r={3.6} fill={C.haldi} />
      <path d="M190 18 l-5 -4 M194 10 l-2 -5" stroke={C.marigold} strokeWidth={2} />
      {/* ground */}
      <ellipse cx={120} cy={180} rx={86} ry={8} fill={C.sand} stroke="none" />
      {prints.map(([px, py], i) => (
        <ellipse key={i} cx={px} cy={py} rx={3.6} ry={2.2} fill={C.marigold} stroke="none" opacity={0.7} />
      ))}
      {/* tail */}
      <path d="M62 104 C52 110 50 122 54 134" strokeWidth={2.4} />
      <path d="M54 132 C50 136 52 142 56 142 C60 140 58 134 54 132 Z" fill={C.indigoDark} />
      {legs.map((l) => {
        const [d, fill] = l.split("|");
        return <path key={d} d={d} fill={fill} />;
      })}
      {[92, 154, 76, 138].map((x) => (
        <ellipse key={x} cx={x + 1} cy={177} rx={8} ry={3.5} fill={C.sand} />
      ))}
      {/* anklets */}
      {[76, 138].map((x) => (
        <g key={x}>
          <path d={`M${x - 4} 164 H${x + 5}`} stroke={C.rani} strokeWidth={3} />
          <circle cx={x + 1} cy={168} r={1.8} fill={C.haldi} strokeWidth={1} />
        </g>
      ))}
      {/* neck */}
      <path d="M144 92 C156 86 166 76 172 62 L192 70 C186 90 178 108 164 122 C156 120 148 112 144 104 Z" fill={C.sand} />
      {/* body + hump */}
      <path d="M60 112 C54 96 64 84 80 82 C86 64 100 54 114 56 C128 58 136 70 140 84 C154 86 162 94 162 108 C162 122 150 128 136 128 L80 128 C68 128 62 122 60 112 Z" fill={C.sand} />
      <Dots x={68} y={118} cols={12} dx={7} r={1} fill={C.marigold} stagger={false} />
      {/* necklace with bells */}
      <path d="M158 96 C164 100 172 100 178 94" stroke={C.indigo} strokeWidth={6} />
      <path d="M158 96 C164 100 172 100 178 94" stroke={C.rani} strokeWidth={3} />
      {[160, 168, 176].map((bx, i) => (
        <g key={bx}>
          <path d={`M${bx} ${99 - i * 0.5} V${106 - i}`} strokeWidth={1.4} />
          <path d={`M${bx - 3} ${110 - i} C${bx - 3} ${104 - i} ${bx + 3} ${104 - i} ${bx + 3} ${110 - i} Z`} fill={C.haldi} strokeWidth={1.4} />
        </g>
      ))}
      {/* saddle cloth */}
      <path d="M82 84 C90 66 132 64 140 86 L146 118 C130 122 96 122 76 118 Z" fill={C.rani} />
      <BandhaniMarks x={90} y={84} cols={6} rows={3} gap={8} r={2.2} />
      <path d="M78 110 C96 114 130 114 145 110 L146 118 C130 122 96 122 76 118 Z" fill={C.marigold} strokeWidth={1.6} />
      {Array.from({ length: 9 }, (_, i) => {
        const tx = 80 + i * 8;
        return <path key={i} d={`M${tx - 3} 119.5 L${tx} 127 L${tx + 3} 119.5 Z`} fill={i % 2 ? C.leaf : C.indigo} strokeWidth={1} />;
      })}
      {[94, 112, 130].map((mx) => (
        <circle key={mx} cx={mx} cy={114} r={2.6} fill={C.ivory} strokeWidth={1.2} />
      ))}
      {/* saddle cushion on the hump */}
      <ellipse cx={112} cy={60} rx={16} ry={6} fill={C.indigo} />
      <Dots x={101} y={60} cols={5} dx={5.5} r={1.1} fill={C.haldi} stagger={false} />
      <path d="M100 56 C98 48 104 46 104 52" fill={C.marigold} />
      {/* head, tilted up towards the question mark */}
      <g transform="rotate(-8 192 58)">
        <ellipse cx={177} cy={44} rx={4} ry={7} fill={C.sand} transform="rotate(-40 177 44)" />
        <path d="M172 58 C170 44 182 36 194 38 C204 40 212 44 218 52 C224 58 223 66 218 69 C214 72 210 72 206 70 C200 72 192 72 186 70 C178 68 173 64 172 58 Z" fill={C.sand} />
        <path d="M206 70 C210 74 216 74 218 69" fill={C.sand} strokeWidth={1.6} />
        <path d="M212 56 l4 2" strokeWidth={2} />
        {/* forehead ornament + muzzle strap */}
        <path d="M178 62 C190 66 200 64 208 58" stroke={C.indigo} strokeWidth={5} />
        <path d="M178 62 C190 66 200 64 208 58" stroke={C.rani} strokeWidth={2.5} />
        <circle cx={196} cy={42} r={3.6} fill={C.haldi} strokeWidth={1.4} />
        <path d="M196 46 V52" stroke={C.rani} strokeWidth={2} />
        {/* big, sleepy, slightly lost eye */}
        <circle cx={187} cy={50} r={5.4} fill={C.ivory} />
        <circle cx={188} cy={49} r={2.8} fill={C.indigoDark} stroke="none" />
        <circle cx={189} cy={48} r={1} fill={C.ivory} stroke="none" />
        <path d="M181.6 49 C182 44 192 44 192.4 49" fill={C.sand} strokeWidth={1.6} />
        <path d="M182 49 l-3 2 M184 51.5 l-2 3 M187 52.5 l-1 3" strokeWidth={1.2} />
        <path d="M181 41 C184 39 189 39 192 41" strokeWidth={1.6} />
        <circle cx={198} cy={60} r={3} fill={C.rani} opacity={0.3} stroke="none" />
        {/* pompom tuft */}
        <circle cx={182} cy={37} r={4} fill={C.marigold} />
        <circle cx={188} cy={35} r={3.4} fill={C.rani} />
      </g>
    </Svg>
  );
}

/** A yellow-and-green Jaipur auto-rickshaw zipping along. */
export function AutoRickshaw(props: IllustrationProps) {
  return (
    <Svg {...props} viewBox="0 0 240 160">
      <AutoShape />
    </Svg>
  );
}

/** Wide dusk banner: indigo→rani→marigold sky, a hill fort, a camel caravan over dunes. */
export function DesertDusk(props: IllustrationProps) {
  const stars = Array.from({ length: 34 }, (_, i) => [(i * 137 + 23) % 800, ((i * 53) % 38) + 6, i % 3 === 0 ? 1.5 : 1] as const);
  return (
    <Svg {...props} viewBox="0 0 800 160" preserveAspectRatio="xMidYMid slice">
      <rect x={0} y={0} width={800} height={160} fill={C.indigo} stroke="none" />
      {stars.map(([x, y, r]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill={C.ivory} stroke="none" />
      ))}
      <path d="M700 20 C692 26 694 40 706 42 C698 36 698 26 704 20 Z" fill={C.ivory} stroke="none" />
      <path d="M0 52 C100 44 200 58 300 50 S500 44 600 52 S740 44 800 50 V160 H0 Z" fill={C.rani} stroke="none" />
      <Dots x={10} y={58} cols={66} dx={12} r={1} fill={C.marigold} opacity={0.6} />
      <path d="M0 86 C120 80 220 92 340 86 S560 78 660 86 S760 82 800 84 V160 H0 Z" fill={C.marigold} stroke="none" />
      <Dots x={16} y={92} cols={64} dx={12.4} r={1} fill={C.haldi} opacity={0.8} />
      <path d="M0 108 C160 104 300 112 440 106 S680 104 800 108 V160 H0 Z" fill={C.haldi} stroke="none" />
      <circle cx={210} cy={120} r={26} fill={C.ivory} opacity={0.9} />
      <circle cx={210} cy={120} r={20} fill={C.haldi} stroke="none" />
      <path d="M296 40 l6 4 l6 -4 M316 32 l5 3 l5 -3 M282 30 l4 3 l4 -3" stroke={C.indigoDark} strokeWidth={1.8} />
      {/* fort on its hill */}
      <g fill={C.indigoDark} stroke={C.indigoDark}>
        <path d="M510 126 C550 104 600 92 650 92 C700 92 735 104 780 126 Z" />
        <rect x={596} y={70} width={100} height={24} />
        {Array.from({ length: 12 }, (_, i) => (
          <rect key={i} x={598 + i * 8.3} y={65} width={4} height={6} />
        ))}
        <rect x={622} y={54} width={44} height={18} />
        <rect x={584} y={62} width={14} height={34} rx={3} />
        <rect x={694} y={62} width={14} height={34} rx={3} />
        <path d="M560 112 L584 92 M708 92 L740 112" strokeWidth={5} />
      </g>
      <Chhatri x={644} y={54} s={0.9} dome={C.indigoDark} body={C.indigoDark} />
      <Chhatri x={591} y={62} s={0.5} dome={C.indigoDark} body={C.indigoDark} />
      <Chhatri x={701} y={62} s={0.5} dome={C.indigoDark} body={C.indigoDark} />
      {[608, 620, 632, 656, 668, 680, 634, 646].map((wx, i) => (
        <rect key={i} x={wx} y={i < 6 ? 80 : 60} width={3} height={5} fill={C.haldi} stroke="none" />
      ))}
      {/* dunes */}
      <path d="M0 124 C80 112 150 114 230 122 C300 128 360 112 440 114 C520 116 560 124 640 120 C700 116 760 112 800 116 V160 H0 Z" fill={C.terracotta} />
      <path d="M96 118 V100 M96 104 C88 98 84 100 82 96 M96 100 C104 94 110 96 112 92" stroke={C.indigoDark} strokeWidth={3} />
      <ellipse cx={86} cy={96} rx={8} ry={4} fill={C.indigoDark} stroke="none" />
      <ellipse cx={108} cy={92} rx={9} ry={4} fill={C.indigoDark} stroke="none" />
      <path d="M0 140 C60 130 140 128 220 136 C280 142 320 124 380 124 C440 124 480 138 560 140 C640 142 720 128 800 132 V160 H0 Z" fill={C.marigold} />
      {/* caravan */}
      <path d="M318 105 L356 102 M376 101 L414 104" stroke={C.indigoDark} strokeWidth={1.2} />
      {[
        [342, 128],
        [382, 125],
        [424, 127],
      ].map(([cx, cy], i) => (
        <g key={cx} transform={`translate(${cx} ${cy}) scale(1.25)`} fill={C.indigoDark} stroke="none">
          <path d={CAMEL_SILHOUETTE} />
          {i === 0 ? (
            <>
              <circle cx={7} cy={-39} r={2.8} />
              <path d="M3 -30 L11 -30 L9 -36 L5 -36 Z" />
              <path d="M5 -41 C7 -44 10 -43 10 -40 Z" fill={C.rani} />
            </>
          ) : null}
        </g>
      ))}
      <path d="M0 152 C120 144 240 146 360 154 C480 160 600 146 800 150 V160 H0 Z" fill={C.sand} />
      <path d="M40 154 q20 -4 40 0 M520 152 q20 -4 40 0 M660 151 q20 -4 40 0" stroke={C.marigold} strokeWidth={1.6} />
    </Svg>
  );
}

/** Ananya, the Kaarvaan traveller, with her tote bag and phone. */
export function Traveller(props: IllustrationProps) {
  return (
    <Svg {...props}>
      <Medallion />
      <Ananya x={100} y={154} s={1.04} pose="phone" mood="smile" />
    </Svg>
  );
}

/** A friendly auto driver with a cap and a big moustache. */
export function Driver(props: IllustrationProps) {
  return (
    <Svg {...props}>
      <Medallion />
      <DriverFigure x={96} y={154} s={1} />
    </Svg>
  );
}

function Shelf({ x, y, w, h, rows }: { x: number; y: number; w: number; h: number; rows: number }) {
  const colors = [C.rani, C.indigo, C.leaf, C.haldi, C.marigold, C.terracotta];
  const rowH = h / rows;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={C.terracotta} />
      <rect x={x + 4} y={y + 4} width={w - 8} height={h - 8} fill={C.indigoDark} opacity={0.85} />
      {Array.from({ length: rows }, (_, r) => {
        const base = y + (r + 1) * rowH;
        const stacks = Math.floor((w - 8) / 22);
        return (
          <g key={r}>
            {Array.from({ length: stacks }, (_, sI) =>
              Array.from({ length: 3 }, (_, k) => {
                const c = colors[(r * 2 + sI * 3 + k) % colors.length];
                return <rect key={`${sI}-${k}`} x={x + 7 + sI * 22} y={base - 4 - (k + 1) * 6} width={18} height={6} rx={1.5} fill={c} strokeWidth={1.4} />;
              }),
            )}
            <rect x={x} y={base - 4} width={w} height={4} fill={C.marigold} strokeWidth={1.6} />
          </g>
        );
      })}
    </g>
  );
}

/** The pushy seller in a commission shop, pointing at his "very special" shelf. */
export function ShopKeeper(props: IllustrationProps) {
  return (
    <Svg {...props}>
      <rect x={0} y={146} width={200} height={14} fill={C.sand} stroke="none" />
      <Shelf x={6} y={18} w={74} h={128} rows={4} />
      <Dots x={130} y={20} cols={8} rows={2} dx={8} dy={8} r={1.4} fill={C.marigold} />
      <SellerFigure x={132} y={154} s={1} />
    </Svg>
  );
}

/** Comic panel: Ananya drowning in apps, chats and a ticking clock while planning. */
export function ComicPlanning(props: IllustrationProps) {
  return (
    <Svg {...props}>
      <Bubble x={6} y={8} w={46} h={20} fill={C.indigo} tail="br" />
      <Bubble x={92} y={6} w={56} h={22} fill={C.rani} tail="bl" />
      <Bubble x={110} y={40} w={58} h={20} fill={C.leaf} tail="bl" />
      <Bubble x={140} y={70} w={50} h={18} fill={C.marigold} tail="bl" ink={C.indigo} />
      <Bubble x={112} y={104} w={52} h={20} fill={C.sand} tail="bl" ink={C.indigo}>
        <Dots x={126} y={114} cols={3} dx={8} r={2} fill={C.indigo} stagger={false} />
      </Bubble>
      <Bubble x={4} y={96} w={34} h={18} fill={C.haldi} tail="br" ink={C.indigo} />
      <AppIcon x={8} y={50} fill={C.leaf} glyph="pin" />
      <AppIcon x={112} y={72} fill={C.indigo} glyph="star" />
      <AppIcon x={172} y={98} fill={C.blue} glyph="plane" />
      <AppIcon x={14} y={128} fill={C.terracotta} glyph="rupee" />
      <AppIcon x={170} y={130} fill={C.ivory} glyph="heart" />
      {/* clock */}
      <circle cx={178} cy={24} r={16} fill={C.ivory} />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 12;
        return <circle key={i} cx={178 + Math.cos(a) * 12} cy={24 + Math.sin(a) * 12} r={1} fill={C.indigo} stroke="none" />;
      })}
      <path d="M178 24 V15 M178 24 L185 28" strokeWidth={2.2} />
      <path d="M164 10 l-4 -4 M192 10 l4 -4" strokeWidth={2.4} />
      {/* stress marks */}
      <path d="M44 34 l-6 -3 M48 26 l-4 -5 M90 30 l5 -4" stroke={C.rani} strokeWidth={2} />
      <Ananya x={68} y={156} s={0.92} pose="phone" mood="worried" />
      <path d="M84 33 c2 3 2 5 0 5 c-2 0 -2 -2 0 -5 Z" fill={C.ivory} strokeWidth={1.2} />
    </Svg>
  );
}

/** Comic panel: Ananya asks an auto driver about the fare, he answers with rupees. */
export function ComicDriver(props: IllustrationProps) {
  return (
    <Svg {...props}>
      <g transform="translate(-6 76) scale(0.55)">
        <AutoShape />
      </g>
      <Bubble x={62} y={6} w={62} h={28} fill={C.haldi} tail="br" ink={C.indigo}>
        {[72, 92, 112].map((rx) => (
          <Rupee key={rx} x={rx - 4} y={13} color={C.indigo} w={2.2} />
        ))}
      </Bubble>
      <Bubble x={140} y={8} w={50} h={28} fill={C.rani} tail="bl">
        <path d="M154 30 C148 24 149 15 154 15 C159 15 160 24 154 30 Z" fill={C.ivory} strokeWidth={1.4} />
        <circle cx={154} cy={20} r={1.8} fill={C.rani} stroke="none" />
        <path d="M168 17 C168 12 178 12 178 18 C178 22 173 22 173 26 M173 31 v0.1" stroke={C.ivory} strokeWidth={2.4} />
      </Bubble>
      <DriverFigure x={112} y={156} s={0.74} mood="grin" />
      <Ananya x={164} y={156} s={0.78} pose="phone" mood="talk" />
    </Svg>
  );
}

/** Comic panel: a commission shop crammed with stacks, a giant discount tag and a seller pointing. */
export function ComicCommissionShop(props: IllustrationProps) {
  const burst = Array.from({ length: 24 }, (_, i) => {
    const a = (Math.PI * 2 * i) / 24;
    const r = i % 2 ? 26 : 36;
    return `${150 + Math.cos(a) * r},${38 + Math.sin(a) * r}`;
  }).join(" ");
  return (
    <Svg {...props}>
      <rect x={0} y={0} width={200} height={128} fill={C.sand} stroke="none" />
      <rect x={0} y={128} width={200} height={32} fill={C.ivory} stroke="none" />
      <path d="M0 128 H200" />
      <Dots x={6} y={138} cols={16} rows={3} dx={12.5} dy={8} r={1.2} fill={C.marigold} />
      <Shelf x={6} y={14} w={74} h={114} rows={4} />
      {/* garland over shelf */}
      {Array.from({ length: 8 }, (_, i) => (
        <circle key={i} cx={10 + i * 9.5} cy={12 + Math.sin((i / 7) * Math.PI) * 6} r={3.4} fill={i % 2 ? C.rani : C.marigold} strokeWidth={1.2} />
      ))}
      {/* hanging bulb */}
      <path d="M104 0 V14" />
      <circle cx={104} cy={19} r={5} fill={C.haldi} />
      <path d="M96 30 l-3 3 M112 30 l3 3 M104 30 v4" stroke={C.marigold} strokeWidth={1.6} />
      {/* big discount tag */}
      <polygon points={burst} fill={C.haldi} />
      <g transform="translate(152 38) rotate(-10)">
        <path d="M-32 -18 H30 V18 H-32 L-44 0 Z" fill={C.rani} />
        <path d="M-28 -14 H26 V14 H-28 L-38 0 Z" stroke={C.marigold} strokeWidth={1.4} strokeDasharray="2 3" />
        <circle cx={-33} cy={0} r={3} fill={C.ivory} />
        <circle cx={-10} cy={-6} r={5} stroke={C.ivory} strokeWidth={3} />
        <circle cx={10} cy={7} r={5} stroke={C.ivory} strokeWidth={3} />
        <path d="M12 -11 L-12 12" stroke={C.ivory} strokeWidth={3.5} />
      </g>
      <path d="M118 44 C110 54 104 50 104 34" strokeWidth={1.4} />
      {/* counter */}
      <rect x={150} y={106} width={50} height={50} fill={C.terracotta} />
      <rect x={146} y={100} width={56} height={8} fill={C.marigold} />
      <Dots x={156} y={118} cols={5} rows={4} dx={8} dy={9} r={1.3} fill={C.ivory} />
      <rect x={156} y={88} width={30} height={6} rx={1.5} fill={C.leaf} strokeWidth={1.4} />
      <rect x={154} y={94} width={34} height={6} rx={1.5} fill={C.rani} strokeWidth={1.4} />
      <SellerFigure x={112} y={156} s={0.82} />
    </Svg>
  );
}

/** Comic panel: Ananya holds up a huge price tag, sad, as rupee notes fly away. */
export function ComicOverpay(props: IllustrationProps) {
  const notes: Array<[number, number, number]> = [
    [22, 62, -20],
    [170, 66, 25],
    [30, 112, 15],
    [176, 116, -15],
    [178, 20, 30],
    [16, 22, -30],
  ];
  return (
    <Svg {...props}>
      <Medallion cx={100} cy={96} r={52} />
      {notes.map(([nx, ny, a], i) => (
        <g key={i} transform={`rotate(${a} ${nx} ${ny})`}>
          <rect x={nx - 13} y={ny - 7} width={26} height={14} rx={2} fill={i % 2 ? C.leaf : C.blueLight} />
          <rect x={nx - 10} y={ny - 4} width={20} height={8} rx={1} stroke={C.ivory} strokeWidth={1} />
          <circle cx={nx} cy={ny} r={3} fill={C.ivory} strokeWidth={1.2} />
          <path d={`M${nx + (nx < 100 ? 16 : -16)} ${ny - 4} h${nx < 100 ? 6 : -6} M${nx + (nx < 100 ? 16 : -16)} ${ny + 2} h${nx < 100 ? 9 : -9}`} strokeWidth={1.4} />
        </g>
      ))}
      <circle cx={46} cy={142} r={4} fill={C.haldi} />
      <circle cx={156} cy={146} r={4} fill={C.haldi} />
      {/* the price tag */}
      <path d="M54 4 H140 L154 20 L140 36 H54 Z" fill={C.haldi} />
      <circle cx={142} cy={20} r={3} fill={C.ivory} />
      <Rupee x={62} y={11} s={1.2} color={C.indigo} w={2.6} />
      {[88, 102, 116, 130].map((zx) => (
        <ellipse key={zx} cx={zx} cy={20} rx={4.5} ry={8} stroke={C.rani} strokeWidth={2.8} />
      ))}
      <Ananya x={100} y={156} s={0.9} pose="tag" mood="sad" />
    </Svg>
  );
}

/** Comic panel: Ananya and a block-print maker hold up a fresh bandhani together, under marigold garlands. */
export function ComicHappy(props: IllustrationProps) {
  const garland = Array.from({ length: 17 }, (_, i) => {
    const t = i / 16;
    return [4 + t * 192, 6 + Math.sin(t * Math.PI) * 14] as const;
  });
  const petals: Array<[number, number, number, string]> = [
    [20, 40, 20, C.marigold],
    [178, 48, -30, C.rani],
    [100, 40, 60, C.marigold],
    [30, 90, -10, C.rani],
    [172, 92, 40, C.marigold],
    [88, 30, -50, C.rani],
    [118, 28, 30, C.marigold],
  ];
  return (
    <Svg {...props}>
      <path d={`M${garland.map(([x, y]) => `${x} ${y}`).join(" L")}`} strokeWidth={1.4} />
      {garland.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y + 3} r={i % 2 ? 3.4 : 5} fill={i % 2 ? C.rani : C.marigold} strokeWidth={1.4} />
          {i % 2 ? null : <Dots x={x - 2} y={y + 3} cols={2} dx={4} r={0.8} fill={C.haldi} stagger={false} />}
        </g>
      ))}
      {petals.map(([x, y, a, c]) => (
        <ellipse key={`${x}-${y}`} cx={x} cy={y} rx={2.4} ry={4.4} fill={c} strokeWidth={1} transform={`rotate(${a} ${x} ${y})`} />
      ))}
      {/* the bandhani being shown off */}
      <path d="M79 74 L121 74 L123 116 C112 120 90 120 77 116 Z" fill={C.rani} />
      <BandhaniMarks x={85} y={82} cols={5} rows={4} gap={7.5} r={2} />
      <path d="M77.6 108 C90 112 112 112 122.6 108 L123 116 C112 120 90 120 77 116 Z" fill={C.marigold} strokeWidth={1.4} />
      <MakerFigure x={50} y={156} s={0.85} />
      <Ananya x={150} y={156} s={0.85} pose="reach" mood="grin" />
      {/* printing table */}
      <rect x={22} y={124} width={156} height={8} fill={C.marigold} />
      <rect x={26} y={132} width={148} height={10} fill={C.terracotta} />
      <Dots x={32} y={137} cols={20} dx={7.2} r={1.1} fill={C.ivory} stagger={false} />
      <path d="M30 142 V156 M170 142 V156" strokeWidth={4} />
      <rect x={30} y={118} width={30} height={6} fill={C.indigo} />
      <rect x={136} y={114} width={20} height={10} fill={C.terracotta} />
      <path d="M142 114 V108 H150 V114" fill={C.marigold} />
      <Buti cx={100} cy={128} r={4} petals={6} fill={C.rani} />
      <Buti cx={80} cy={128} r={4} petals={6} fill={C.indigo} />
      <Buti cx={120} cy={128} r={4} petals={6} fill={C.indigo} />
      <path d="M92 52 C88 46 94 42 96 47 C98 42 104 46 100 52 L96 56 Z" fill={C.rani} strokeWidth={1.2} />
    </Svg>
  );
}

