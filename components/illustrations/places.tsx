import { Buti, BandhaniMarks, C, Chhatri, Dots, Limb, Svg, type IllustrationProps } from "./primitives";

const arch = (cx: number, y: number, w: number, h: number) =>
  `M${cx - w / 2} ${y + h} V${y + w / 2} C${cx - w / 2} ${y} ${cx + w / 2} ${y} ${cx + w / 2} ${y + w / 2} V${y + h} Z`;

const ogee = (cx: number, top: number, bottom: number, w: number) => {
  const l = cx - w / 2;
  const r = cx + w / 2;
  const sh = top + w * 0.9;
  return `M${l} ${bottom} V${sh} C${l} ${sh - w * 0.4} ${cx - w * 0.15} ${top + w * 0.3} ${cx} ${top} C${cx + w * 0.15} ${top + w * 0.3} ${r} ${sh - w * 0.4} ${r} ${sh} V${bottom} Z`;
};

const ring = (cx: number, cy: number, r: number, n: number) =>
  Array.from({ length: n }, (_, i) => {
    const a = (Math.PI * 2 * i) / n;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as const;
  });

/** Amber-style hill fort: palace blocks and chhatris on a hill, a wall snaking over the ridge, a lake below. */
export function Fort(props: IllustrationProps) {
  const ridge = "M0 94 C20 82 34 72 50 74 C66 76 74 64 90 60 C110 56 124 68 140 64 C160 60 178 52 200 58";
  return (
    <Svg {...props}>
      <circle cx={168} cy={26} r={12} fill={C.haldi} />
      {ring(168, 26, 18, 14).map(([x, y]) => (
        <circle key={`${x}`} cx={x} cy={y} r={1.2} fill={C.marigold} stroke="none" />
      ))}
      <path d={`${ridge} V160 H0 Z`} fill={C.leaf} />
      <Dots x={8} y={100} cols={24} rows={3} dx={8} dy={7} r={1} fill={C.haldi} opacity={0.5} />
      <Limb d={ridge} color={C.haldi} w={4} />
      {[
        [50, 74],
        [90, 60],
        [140, 64],
        [186, 55],
      ].map(([x, y]) => (
        <g key={x}>
          <rect x={x - 4} y={y - 12} width={8} height={12} fill={C.marigold} />
          <path d={`M${x - 5} ${y - 12} C${x - 5} ${y - 19} ${x + 5} ${y - 19} ${x + 5} ${y - 12} Z`} fill={C.haldi} />
        </g>
      ))}
      {/* front hill */}
      <path d="M0 142 C20 128 40 112 58 106 C78 100 128 98 150 108 C170 118 186 130 200 136 V160 H0 Z" fill={C.sand} />
      <path d="M100 112 L78 124 L112 132 L70 142" stroke={C.marigold} strokeWidth={2.4} strokeDasharray="4 3" />
      {/* lower rampart with bastions */}
      <rect x={46} y={92} width={110} height={18} fill={C.marigold} />
      {Array.from({ length: 14 }, (_, i) => (
        <rect key={i} x={48 + i * 7.8} y={87} width={4} height={5} fill={C.marigold} />
      ))}
      <rect x={38} y={84} width={14} height={28} rx={3} fill={C.haldi} />
      <rect x={150} y={84} width={14} height={28} rx={3} fill={C.haldi} />
      <path d={ogee(100, 96, 110, 12)} fill={C.indigoDark} />
      {/* main palace */}
      <rect x={64} y={62} width={76} height={26} fill={C.haldi} />
      {[72, 84, 96, 108, 120, 132].map((cx) => (
        <path key={cx} d={arch(cx, 66, 6, 9)} fill={C.indigoDark} strokeWidth={1.4} />
      ))}
      <Dots x={68} y={81} cols={12} dx={6} r={1} fill={C.terracotta} stagger={false} />
      <rect x={80} y={46} width={44} height={16} fill={C.haldi} />
      {[88, 100, 112].map((cx) => (
        <path key={cx} d={arch(cx, 49, 6, 10)} fill={C.indigoDark} strokeWidth={1.4} />
      ))}
      <Chhatri x={70} y={62} s={0.55} dome={C.marigold} body={C.haldi} />
      <Chhatri x={134} y={62} s={0.55} dome={C.marigold} body={C.haldi} />
      <Chhatri x={102} y={46} s={0.75} dome={C.marigold} body={C.haldi} />
      {/* Maota lake */}
      <path d="M0 146 C50 140 150 140 200 146 V160 H0 Z" fill={C.indigo} />
      {[
        [20, 152, 18],
        [70, 150, 26],
        [130, 154, 20],
        [168, 150, 16],
      ].map(([x, y, w]) => (
        <path key={x} d={`M${x} ${y} h${w}`} stroke={C.ivory} strokeWidth={1.5} />
      ))}
    </Svg>
  );
}

/** Hawa Mahal: the pink honeycomb façade, tier upon tier of little domed jharokha windows. */
export function HawaMahal(props: IllustrationProps) {
  const tiers = [
    { x: 18, y: 118, w: 164, h: 28 },
    { x: 24, y: 95, w: 152, h: 23 },
    { x: 32, y: 73, w: 136, h: 22 },
    { x: 50, y: 53, w: 100, h: 20 },
    { x: 70, y: 35, w: 60, h: 18 },
  ];
  return (
    <Svg {...props}>
      <path d="M4 147 H196" strokeWidth={2.4} />
      {tiers.map((t, k) => {
        const n = Math.floor(t.w / 14);
        const start = t.x + (t.w - n * 14) / 2 + 7;
        return (
          <g key={k}>
            <rect x={t.x} y={t.y} width={t.w} height={t.h} fill={C.terracotta} />
            <rect x={t.x} y={t.y} width={t.w} height={3.5} fill={C.ivory} strokeWidth={1.5} />
            {Array.from({ length: n }, (_, i) => {
              const cx = start + i * 14;
              if (k === 0 && Math.abs(cx - 100) < 14) return null;
              const top = t.y + 5;
              const bottom = t.y + t.h - 2;
              return (
                <g key={i} strokeWidth={1.3}>
                  <rect x={cx - 4.5} y={top + 5} width={9} height={bottom - top - 5} fill={C.ivory} />
                  <path d={`M${cx - 5.5} ${top + 5.5} C${cx - 5.5} ${top - 1} ${cx + 5.5} ${top - 1} ${cx + 5.5} ${top + 5.5} Z`} fill={C.rani} />
                  <circle cx={cx} cy={top - 0.5} r={1} fill={C.haldi} />
                  <circle cx={cx - 1.8} cy={top + 9} r={0.8} fill={C.indigo} stroke="none" />
                  <circle cx={cx + 1.8} cy={top + 9} r={0.8} fill={C.indigo} stroke="none" />
                  <circle cx={cx} cy={top + 12} r={0.8} fill={C.indigo} stroke="none" />
                </g>
              );
            })}
            {/* corner domes */}
            {[t.x, t.x + t.w].map((cx) => (
              <path key={cx} d={`M${cx - 4} ${t.y} C${cx - 4} ${t.y - 7} ${cx + 4} ${t.y - 7} ${cx + 4} ${t.y} Z`} fill={C.rani} strokeWidth={1.5} />
            ))}
          </g>
        );
      })}
      {/* entrance arch */}
      <path d={ogee(100, 124, 146, 16)} fill={C.indigoDark} />
      <path d={ogee(100, 124, 146, 16)} stroke={C.haldi} strokeWidth={1} transform="translate(100 135) scale(0.8) translate(-100 -135)" />
      {/* crown */}
      <path d="M78 35 L88 22 H112 L122 35 Z" fill={C.terracotta} />
      <Dots x={90} y={29} cols={4} dx={6.5} r={1.2} fill={C.ivory} stagger={false} />
      <path d="M93 22 C93 12 107 12 107 22 Z" fill={C.rani} />
      <path d="M100 13 V5" />
      <circle cx={100} cy={4} r={1.8} fill={C.haldi} />
    </Svg>
  );
}

/** City Palace-style gateway: a big ogee arch in rani and marigold, flanking wings and chhatris, flag flying. */
export function Palace(props: IllustrationProps) {
  const wing = (x: number) => (
    <g>
      <rect x={x} y={70} width={54} height={76} fill={C.sand} />
      <rect x={x} y={70} width={54} height={6} fill={C.rani} />
      <Dots x={x + 4} y={73} cols={9} dx={6} r={1} fill={C.ivory} stagger={false} />
      {[x + 11, x + 27, x + 43].map((cx) => (
        <g key={cx}>
          <path d={ogee(cx, 84, 100, 9)} fill={C.indigoDark} strokeWidth={1.6} />
          <rect x={cx - 7} y={100} width={14} height={3} fill={C.haldi} strokeWidth={1.4} />
          <path d={arch(cx, 114, 9, 16)} fill={C.indigoDark} strokeWidth={1.6} />
        </g>
      ))}
      <Dots x={x + 5} y={138} cols={8} dx={6.5} r={1.1} fill={C.marigold} stagger={false} />
    </g>
  );
  return (
    <Svg {...props}>
      <path d="M6 146 H194" strokeWidth={2.4} />
      {wing(20)}
      {wing(126)}
      <Chhatri x={28} y={70} s={0.6} dome={C.rani} />
      <Chhatri x={172} y={70} s={0.6} dome={C.rani} />
      <Chhatri x={60} y={70} s={0.45} dome={C.marigold} />
      <Chhatri x={140} y={70} s={0.45} dome={C.marigold} />
      {/* central gate block */}
      <rect x={72} y={46} width={56} height={100} fill={C.ivory} />
      <rect x={72} y={46} width={56} height={6} fill={C.rani} />
      <Dots x={76} y={49} cols={9} dx={6} r={1} fill={C.ivory} stagger={false} />
      <Buti cx={100} cy={64} r={8} fill={C.leaf} center={C.haldi} />
      <path d={ogee(100, 74, 146, 40)} fill={C.rani} />
      <path d={ogee(100, 84, 146, 28)} fill={C.marigold} />
      <path d="M100 98 V146" />
      <Dots x={90} y={108} cols={2} rows={5} dx={6} dy={7} r={1.2} fill={C.indigo} stagger={false} />
      <Dots x={104} y={108} cols={2} rows={5} dx={6} dy={7} r={1.2} fill={C.indigo} stagger={false} />
      {[78, 122].map((cx) => (
        <path key={cx} d={arch(cx, 58, 6, 12)} fill={C.indigoDark} strokeWidth={1.4} />
      ))}
      <Chhatri x={100} y={46} s={0.9} dome={C.marigold} />
      {/* flag */}
      <path d="M100 17 V3" />
      <path d="M100 4 L120 8 L100 13 Z" fill={C.rani} />
      <path d="M100 8.5 L117 8.5" stroke={C.haldi} strokeWidth={1.5} />
    </Svg>
  );
}

/** Jantar Mantar's Samrat Yantra: the giant stepped sundial gnomon, a kiosk on top, and a marked quadrant. */
export function Observatory(props: IllustrationProps) {
  const steps = `M18 140${" v-9 h9".repeat(12)} H140 V140 Z`;
  const ticks = Array.from({ length: 11 }, (_, i) => {
    const a = (Math.PI / 2) * (i / 10);
    const ca = Math.cos(a);
    const sa = Math.sin(a);
    return `M${140 + sa * 50} ${140 - ca * 50} L${140 + sa * (i % 5 === 0 ? 58 : 55)} ${140 - ca * (i % 5 === 0 ? 58 : 55)}`;
  }).join(" ");
  const sh = (Math.PI / 2) * 0.42;
  return (
    <Svg {...props}>
      {/* sun */}
      <circle cx={34} cy={30} r={11} fill={C.haldi} />
      {ring(34, 30, 17, 8).map(([x, y], i) => {
        const [x2, y2] = ring(34, 30, 22, 8)[i];
        return <path key={i} d={`M${x} ${y} L${x2} ${y2}`} stroke={C.marigold} strokeWidth={2.4} />;
      })}
      <path d="M150 30 l5 4 l5 -4 M166 44 l4 3 l4 -3" strokeWidth={1.6} />
      {/* ground */}
      <rect x={0} y={140} width={200} height={20} fill={C.sand} stroke="none" />
      <path d="M0 140 H200" />
      <Dots x={6} y={148} cols={32} rows={2} dx={6.3} dy={6} r={1} fill={C.marigold} />
      {/* gnomon */}
      <path d={steps} fill={C.haldi} />
      <path d={`M18 140${" v-9 h9".repeat(12)}`} stroke={C.terracotta} strokeWidth={1.4} transform="translate(2 4)" />
      <path d="M20 128 L124 24" stroke={C.terracotta} strokeWidth={1.2} strokeDasharray="1 5" />
      {[94, 118].map((cx) => (
        <path key={cx} d={ogee(cx, 108, 140, 16)} fill={C.indigoDark} />
      ))}
      <rect x={126} y={30} width={14} height={110} fill={C.marigold} opacity={0.55} stroke="none" />
      <path d="M126 32 V140" strokeWidth={1.5} />
      <Chhatri x={133} y={32} s={0.55} dome={C.rani} />
      {/* quadrant */}
      <path d="M140 80 A60 60 0 0 1 200 140 L190 140 A50 50 0 0 0 140 90 Z" fill={C.ivory} />
      <path d={ticks} strokeWidth={1.4} />
      <path d={`M${140 + Math.sin(sh) * 50} ${140 - Math.cos(sh) * 50} L${140 + Math.sin(sh) * 60} ${140 - Math.cos(sh) * 60}`} stroke={C.indigoDark} strokeWidth={4} />
    </Svg>
  );
}

/** A stepwell (Chand Baori / Panna Meena ka Kund): criss-cross flights of steps diving down to the water. */
export function Stepwell(props: IllustrationProps) {
  const levels = Array.from({ length: 6 }, (_, k) => ({ y: 24 + k * 15, xl: 12 + k * 11, xr: 188 - k * 11 }));
  return (
    <Svg {...props}>
      <rect x={6} y={24} width={188} height={124} fill={C.sand} />
      <Dots x={12} y={130} cols={8} rows={3} dx={6} dy={6} r={1} fill={C.marigold} />
      <Dots x={146} y={130} cols={8} rows={3} dx={6} dy={6} r={1} fill={C.marigold} />
      {/* colonnade at the top */}
      <rect x={6} y={8} width={188} height={16} fill={C.haldi} />
      {Array.from({ length: 15 }, (_, i) => (
        <path key={i} d={arch(16 + i * 12.1, 12, 6, 10)} fill={C.indigoDark} strokeWidth={1.4} />
      ))}
      {levels.map(({ y, xl, xr }, k) => {
        const n = Math.floor((xr - xl) / 14);
        const off = xl + (xr - xl - n * 14) / 2 + 7;
        return (
          <g key={k}>
            <rect x={xl} y={y} width={xr - xl} height={15} fill={k % 2 ? C.haldi : C.marigold} />
            {Array.from({ length: n }, (_, i) => {
              const cx = off + i * 14;
              return (
                <g key={i}>
                  <path d={`M${cx - 7} ${y + 15} L${cx} ${y + 2} L${cx + 7} ${y + 15} Z`} fill={C.terracotta} strokeWidth={1.4} />
                  {[6, 9, 12].map((t) => {
                    const hw = (7 * (t - 2)) / 13;
                    return <path key={t} d={`M${cx - hw + 0.8} ${y + t} H${cx + hw - 0.8}`} stroke={C.ivory} strokeWidth={1} />;
                  })}
                </g>
              );
            })}
          </g>
        );
      })}
      {/* water */}
      <rect x={70} y={114} width={60} height={30} fill={C.indigo} />
      <path d="M76 122 q4 -3 8 0 q4 3 8 0 M100 130 q4 -3 8 0 q4 3 8 0 M80 138 q4 -3 8 0" stroke={C.ivory} strokeWidth={1.4} />
      <path d="M6 148 H194" strokeWidth={2.4} />
    </Svg>
  );
}

/** Albert Hall-style Indo-Saracenic museum: arcades, jharokhas, a central dome and chhatri towers. */
export function Museum(props: IllustrationProps) {
  return (
    <Svg {...props}>
      <path d="M36 30 l5 4 l5 -4 M50 22 l4 3 l4 -3 M156 26 l5 4 l5 -4" strokeWidth={1.6} />
      {/* towers */}
      {[14, 164].map((x) => (
        <g key={x}>
          <rect x={x} y={76} width={22} height={60} fill={C.ivory} />
          <path d={arch(x + 11, 86, 8, 14)} fill={C.indigoDark} strokeWidth={1.5} />
          <path d={arch(x + 11, 110, 8, 14)} fill={C.indigoDark} strokeWidth={1.5} />
          <Chhatri x={x + 11} y={76} s={0.7} dome={C.haldi} />
        </g>
      ))}
      {/* upper storey + drum + dome */}
      <rect x={60} y={62} width={80} height={30} fill={C.ivory} />
      {[72, 88, 112, 128].map((cx) => (
        <g key={cx}>
          <path d={ogee(cx, 68, 84, 8)} fill={C.indigoDark} strokeWidth={1.5} />
          <rect x={cx - 6} y={84} width={12} height={3} fill={C.haldi} strokeWidth={1.3} />
        </g>
      ))}
      <rect x={82} y={50} width={36} height={12} fill={C.sand} />
      <Dots x={86} y={56} cols={6} dx={5.5} r={1.2} fill={C.rani} stagger={false} />
      <path d="M80 50 C76 36 90 28 100 16 C110 28 124 36 120 50 Z" fill={C.haldi} />
      <path d="M90 50 C88 38 94 30 100 20 M110 50 C112 38 106 30 100 20" strokeWidth={1.4} />
      <path d="M100 16 V6" />
      <circle cx={100} cy={5} r={2} fill={C.marigold} />
      <Chhatri x={50} y={92} s={0.5} dome={C.marigold} />
      <Chhatri x={150} y={92} s={0.5} dome={C.marigold} />
      {/* main arcade */}
      <rect x={36} y={92} width={128} height={44} fill={C.ivory} />
      <rect x={20} y={92} width={160} height={6} fill={C.rani} />
      <Dots x={24} y={95} cols={26} dx={6.1} r={1} fill={C.ivory} stagger={false} />
      {Array.from({ length: 8 }, (_, i) => 44 + i * 16)
        .filter((cx) => Math.abs(cx - 100) > 12)
        .map((cx) => (
          <path key={cx} d={ogee(cx, 104, 130, 10)} fill={C.indigoDark} strokeWidth={1.6} />
        ))}
      <path d={ogee(100, 100, 136, 22)} fill={C.rani} />
      <path d={ogee(100, 106, 136, 14)} fill={C.indigoDark} />
      <rect x={20} y={130} width={160} height={6} fill={C.marigold} />
      {/* steps */}
      <rect x={50} y={136} width={100} height={4} fill={C.sand} strokeWidth={1.6} />
      <rect x={40} y={140} width={120} height={4} fill={C.sand} strokeWidth={1.6} />
      <rect x={30} y={144} width={140} height={4} fill={C.sand} strokeWidth={1.6} />
      {/* trees */}
      <circle cx={8} cy={130} r={11} fill={C.leaf} />
      <circle cx={192} cy={130} r={11} fill={C.leaf} />
      <Dots x={3} y={127} cols={2} rows={2} dx={6} dy={5} r={1} fill={C.haldi} />
      <Dots x={187} y={127} cols={2} rows={2} dx={6} dy={5} r={1} fill={C.haldi} />
    </Svg>
  );
}

/** A block-printing village (Bagru / Sanganer): fresh prints drying on a line, more laid out in the field, a hut. */
export function Village(props: IllustrationProps) {
  const sag = (x: number) => 40 + 10 * (1 - ((x - 71) / 57) ** 2);
  const cloths = [
    { a: 20, b: 42, len: 42, fill: C.rani },
    { a: 46, b: 68, len: 50, fill: C.indigo },
    { a: 74, b: 96, len: 40, fill: C.haldi },
    { a: 100, b: 120, len: 46, fill: C.leaf },
  ];
  return (
    <Svg {...props}>
      <circle cx={172} cy={28} r={12} fill={C.haldi} />
      {ring(172, 28, 18, 14).map(([x, y]) => (
        <circle key={`${x}`} cx={x} cy={y} r={1.2} fill={C.marigold} stroke="none" />
      ))}
      <path d="M140 46 l4 3 l4 -3 M152 54 l3 2 l3 -2" strokeWidth={1.5} />
      {/* field */}
      <path d="M0 120 C40 114 90 118 130 114 C160 112 180 116 200 114 V160 H0 Z" fill={C.leaf} />
      {Array.from({ length: 14 }, (_, i) => (
        <path key={i} d={`M${8 + i * 14} ${128 + (i % 3) * 8} l2 -5 l2 5`} stroke={C.haldi} strokeWidth={1.4} />
      ))}
      {/* hut */}
      <rect x={140} y={92} width={46} height={36} fill={C.terracotta} />
      <Dots x={144} y={98} cols={7} dx={6} r={1.2} fill={C.ivory} stagger={false} />
      <path d={arch(163, 106, 12, 22)} fill={C.indigoDark} />
      <path d="M134 95 L163 64 L192 95 Z" fill={C.marigold} />
      <path d="M146 82 L180 82 M140 89 L186 89 M156 72 L170 72" stroke={C.terracotta} strokeWidth={1.4} />
      <path d="M128 128 C126 120 136 118 136 126 Z" fill={C.terracotta} />
      {/* poles + line */}
      <path d="M14 34 V130 M128 34 V130" stroke={C.indigo} strokeWidth={5} />
      <path d="M14 34 V130 M128 34 V130" stroke={C.terracotta} strokeWidth={2.5} />
      <path d="M14 40 Q71 60 128 40" strokeWidth={1.6} />
      {cloths.map(({ a, b, len, fill }, k) => {
        const ya = sag(a);
        const yb = sag(b);
        return (
          <g key={a}>
            <path d={`M${a} ${ya} L${b} ${yb} L${b} ${yb + len} q-5 3 -11 0 t-11 0 Z`} fill={fill} />
            {k === 0 ? <BandhaniMarks x={a + 6} y={ya + 9} cols={2} rows={4} gap={8} r={2} /> : null}
            {k === 1 ? (
              <>
                <Buti cx={(a + b) / 2} cy={ya + 16} r={6} petals={6} fill={C.marigold} center={C.ivory} />
                <Buti cx={(a + b) / 2} cy={ya + 36} r={6} petals={6} fill={C.marigold} center={C.ivory} />
              </>
            ) : null}
            {k === 2 ? (
              <>
                <path d={`M${a + 6} ${ya + 6} V${ya + len - 4} M${a + 16} ${yb + 6} V${yb + len - 4}`} stroke={C.rani} strokeWidth={2.5} />
                <Dots x={a + 11} y={ya + 10} cols={1} rows={5} dy={6} r={1.3} fill={C.rani} stagger={false} />
              </>
            ) : null}
            {k === 3 ? <Dots x={a + 4} y={ya + 8} cols={3} rows={6} dx={5.5} dy={6} r={1.2} fill={C.ivory} /> : null}
            <rect x={a + 1} y={ya - 3} width={3} height={6} fill={C.marigold} strokeWidth={1.2} />
            <rect x={b - 4} y={yb - 3} width={3} height={6} fill={C.marigold} strokeWidth={1.2} />
          </g>
        );
      })}
      {/* cloth laid out in the field */}
      <path d="M10 140 L120 132 L126 146 L16 154 Z" fill={C.ivory} />
      {[28, 48, 68, 88, 108].map((x, i) => (
        <Buti key={x} cx={x} cy={144 - i * 1.5} r={4.5} petals={6} fill={i % 2 ? C.indigo : C.rani} />
      ))}
    </Svg>
  );
}
