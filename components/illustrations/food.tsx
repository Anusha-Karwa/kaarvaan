import type { ReactNode } from "react";
import { Buti, C, Dots, Shadow, Svg, type IllustrationProps } from "./primitives";

const ringPts = (cx: number, cy: number, rx: number, ry: number, n: number) =>
  Array.from({ length: n }, (_, i) => {
    const a = (Math.PI * 2 * i) / n;
    return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry] as const;
  });

/** Steam curls rising from (x, y). */
function Steam({ xs, y, h = 26 }: { xs: number[]; y: number; h?: number }) {
  return (
    <g stroke={C.indigo} strokeWidth={2} opacity={0.75}>
      {xs.map((x, i) => (
        <path key={x} d={`M${x} ${y} c-6 -${h / 4} 6 -${h / 4} 0 -${h / 2} c-6 -${h / 4} 6 -${h / 4} 0 -${h / 2}`} transform={`translate(0 ${i % 2 ? 4 : 0})`} />
      ))}
    </g>
  );
}

/** Steel thali of dal baati churma: katoris of dal, gatte and kadhi, baatis with ghee, a heap of churma. */
export function Thali(props: IllustrationProps) {
  const katori = (cx: number, cy: number, fill: string, extra: ReactNode) => (
    <g>
      <circle cx={cx} cy={cy} r={17} fill={C.sand} />
      <circle cx={cx} cy={cy} r={12.5} fill={fill} strokeWidth={1.6} />
      {extra}
    </g>
  );
  return (
    <Svg {...props}>
      <circle cx={100} cy={80} r={70} fill={C.sand} />
      {ringPts(100, 80, 64, 64, 40).map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={1.2} fill={C.ivory} stroke="none" />
      ))}
      <circle cx={100} cy={80} r={58} fill={C.ivory} />
      {katori(70, 52, C.haldi, (
        <>
          <path d="M63 50 C66 45 74 46 76 52" stroke={C.marigold} strokeWidth={2} />
          <Dots x={64} y={56} cols={3} dx={5} r={1.2} fill={C.leaf} />
          <circle cx={72} cy={49} r={1.2} fill={C.indigo} stroke="none" />
        </>
      ))}
      {katori(100, 38, C.terracotta, (
        <>
          <ellipse cx={95} cy={36} rx={4} ry={2.6} fill={C.marigold} strokeWidth={1.2} />
          <ellipse cx={104} cy={41} rx={4} ry={2.6} fill={C.marigold} strokeWidth={1.2} />
          <Dots x={98} y={32} cols={2} dx={6} r={1} fill={C.haldi} />
        </>
      ))}
      {katori(130, 52, C.ivory, (
        <>
          <Dots x={124} y={48} cols={3} rows={2} dx={5} dy={5} r={1.2} fill={C.leaf} />
          <path d="M126 56 q4 -2 8 0" stroke={C.haldi} strokeWidth={1.4} />
        </>
      ))}
      {/* baatis */}
      {[
        [76, 92],
        [98, 100],
        [80, 116],
      ].map(([cx, cy]) => (
        <g key={cx + cy}>
          <circle cx={cx} cy={cy} r={12} fill={C.marigold} />
          <path d={`M${cx - 6} ${cy - 3} l4 3 l3 -4 l4 4 M${cx - 3} ${cy + 5} l3 -2 l4 2`} stroke={C.terracotta} strokeWidth={1.6} />
          <ellipse cx={cx - 4} cy={cy - 6} rx={4} ry={2.2} fill={C.haldi} stroke="none" />
        </g>
      ))}
      {/* churma heap */}
      <path d="M108 124 c-5 -5 -1 -12 4 -12 c-3 -8 4 -15 10 -12 c1 -9 13 -11 17 -4 c6 -3 13 3 10 10 c6 2 8 10 2 14 c2 6 -4 10 -10 8 c-6 4 -16 4 -22 2 c-6 2 -13 -2 -11 -6 Z" fill={C.haldi} />
      <Dots x={116} y={104} cols={4} rows={3} dx={7} dy={6} r={1.5} fill={C.marigold} />
      <Dots x={119} y={100} cols={3} rows={3} dx={7} dy={6} r={0.9} fill={C.ivory} />
      {[
        [104, 112],
        [152, 116],
        [146, 128],
        [112, 130],
      ].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r={1.6} fill={C.haldi} strokeWidth={1} />
      ))}
      <ellipse cx={128} cy={96} rx={4} ry={2.2} fill={C.ivory} strokeWidth={1.2} />
      {/* green chilli + onion */}
      <path d="M100 128 C106 136 120 138 128 134 C120 134 108 132 102 126 Z" fill={C.leaf} />
      <path d="M100 128 l-4 -3" stroke={C.leaf} strokeWidth={2.4} />
      <ellipse cx={62} cy={78} rx={6} ry={4} fill="none" stroke={C.rani} strokeWidth={2.4} />
      <ellipse cx={62} cy={78} rx={6} ry={4} />
      <ellipse cx={62} cy={78} rx={2.8} ry={1.6} stroke={C.rani} strokeWidth={1.4} />
    </Svg>
  );
}

/** Pyaaz kachoris: round, flaky, golden, with a drizzle of green and imli chutney. */
export function Kachori(props: IllustrationProps) {
  const kachori = (cx: number, cy: number, w = 30, chutney = false) => (
    <g>
      <path d={`M${cx - w} ${cy} C${cx - w} ${cy - w * 0.8} ${cx + w} ${cy - w * 0.8} ${cx + w} ${cy} C${cx + w} ${cy + w * 0.3} ${cx - w} ${cy + w * 0.3} ${cx - w} ${cy} Z`} fill={C.marigold} />
      <path d={`M${cx - w * 0.7} ${cy - w * 0.25} C${cx - w * 0.4} ${cy - w * 0.62} ${cx + w * 0.4} ${cy - w * 0.62} ${cx + w * 0.7} ${cy - w * 0.25}`} stroke={C.haldi} strokeWidth={3} />
      <path d={`M${cx - 8} ${cy - w * 0.48} l5 4 l4 -5 l5 5 l4 -3`} stroke={C.terracotta} strokeWidth={1.8} />
      <Dots x={cx - w * 0.7} y={cy - 2} cols={8} rows={2} dx={(w * 1.4) / 8} dy={5} r={1.2} fill={C.terracotta} />
      {chutney ? (
        <>
          <path d={`M${cx - 20} ${cy - 14} c6 -4 10 4 16 0 s10 4 16 0 s8 4 10 0`} stroke={C.leaf} strokeWidth={3.5} />
          <path d={`M${cx - 16} ${cy - 7} c6 -4 10 4 16 0 s10 4 16 0`} stroke={C.terracotta} strokeWidth={3} />
        </>
      ) : null}
    </g>
  );
  return (
    <Svg {...props}>
      <ellipse cx={100} cy={124} rx={88} ry={24} fill={C.sand} />
      <ellipse cx={100} cy={120} rx={76} ry={17} fill={C.ivory} strokeWidth={1.6} />
      {ringPts(100, 124, 82, 21, 30).map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={1.1} fill={C.marigold} stroke="none" />
      ))}
      {kachori(64, 104, 36)}
      {kachori(136, 102, 36)}
      {kachori(100, 128, 40, true)}
      {/* chutney bowl */}
      <ellipse cx={168} cy={40} rx={20} ry={8} fill={C.ivory} />
      <path d="M148 40 C150 58 186 58 188 40" fill={C.terracotta} />
      <ellipse cx={168} cy={40} rx={16} ry={5.5} fill={C.leaf} strokeWidth={1.4} />
      <Dots x={160} y={51} cols={4} dx={5} r={1.1} fill={C.ivory} stagger={false} />
    </Svg>
  );
}

/** Mirchi vadas: fat green chillies in crisp golden besan batter on a leaf plate, one cut open. */
export function MirchiVada(props: IllustrationProps) {
  const vada = (x: number, y: number, a: number, cut = false) => (
    <g transform={`translate(${x} ${y}) rotate(${a})`}>
      <path d="M0 0 C-6 -3 -12 -10 -14 -16" stroke={C.indigo} strokeWidth={6} />
      <path d="M0 0 C-6 -3 -12 -10 -14 -16" stroke={C.leaf} strokeWidth={3} />
      <path
        d="M0 -2 C6 -14 30 -15 50 -13 C70 -12 92 -9 104 -4 C110 -2 112 2 106 5 C90 10 66 13 44 13 C22 13 4 10 0 -2 Z"
        fill={C.marigold}
      />
      <path d="M8 -6 C30 -12 70 -10 100 -3" stroke={C.haldi} strokeWidth={3} />
      <Dots x={10} y={2} cols={14} rows={2} dx={6.6} dy={5} r={1.3} fill={C.terracotta} />
      {cut ? (
        <g>
          <ellipse cx={104} cy={0} rx={6} ry={9} fill={C.marigold} />
          <ellipse cx={104} cy={0} rx={4} ry={6.5} fill={C.leaf} strokeWidth={1.4} />
          <ellipse cx={104} cy={0} rx={2.2} ry={4} fill={C.haldi} strokeWidth={1} />
        </g>
      ) : null}
    </g>
  );
  return (
    <Svg {...props}>
      {/* leaf plate (pattal) */}
      <ellipse cx={100} cy={118} rx={90} ry={30} fill={C.leaf} />
      <path d="M14 118 H186 M40 102 L64 118 L40 134 M80 92 L104 118 L80 144 M124 92 L146 118 L124 144" stroke={C.haldi} strokeWidth={1.4} opacity={0.8} />
      {vada(40, 96, -10)}
      {vada(48, 120, -4)}
      {vada(36, 142, -8, true)}
      {/* chutney */}
      <ellipse cx={170} cy={46} rx={18} ry={7} fill={C.ivory} />
      <path d="M152 46 C154 62 186 62 188 46" fill={C.ivory} />
      <ellipse cx={170} cy={46} rx={14} ry={4.5} fill={C.terracotta} strokeWidth={1.4} />
      <Dots x={162} y={45} cols={4} dx={5} r={1} fill={C.haldi} stagger={false} />
    </Svg>
  );
}

/** Ghewar: a round honeycomb disc soaked in syrup, topped with rabri, silver varq, saffron and pistachio. */
export function Ghewar(props: IllustrationProps) {
  const holes: Array<[number, number]> = [];
  for (let j = 0; j < 8; j++) {
    for (let i = 0; i < 18; i++) {
      const x = 34 + i * 8 + (j % 2 ? 4 : 0);
      const y = 64 + j * 5.5;
      const inside = ((x - 100) / 64) ** 2 + ((y - 84) / 22) ** 2 < 1;
      const underRabri = ((x - 100) / 46) ** 2 + ((y - 82) / 15) ** 2 < 1;
      if (inside && !underRabri) holes.push([x, y]);
    }
  }
  return (
    <Svg {...props}>
      <ellipse cx={100} cy={118} rx={90} ry={26} fill={C.sand} />
      {ringPts(100, 118, 82, 22, 32).map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={1.1} fill={C.marigold} stroke="none" />
      ))}
      {/* disc side */}
      <path d="M30 84 V100 C30 116 170 116 170 100 V84 Z" fill={C.marigold} />
      {Array.from({ length: 13 }, (_, i) => (
        <path key={i} d={`M${38 + i * 10} ${100 + Math.sin((i / 12) * Math.PI) * 10} v-8`} stroke={C.terracotta} strokeWidth={1.6} />
      ))}
      {/* honeycomb top */}
      <ellipse cx={100} cy={84} rx={70} ry={26} fill={C.haldi} />
      {holes.map(([x, y]) => (
        <ellipse key={`${x}-${y}`} cx={x} cy={y} rx={2.6} ry={1.7} fill={C.marigold} stroke={C.terracotta} strokeWidth={0.8} />
      ))}
      {/* rabri with wavy edge */}
      <path d="M56 82 C56 74 66 68 76 70 C82 64 94 66 100 66 C108 64 120 66 126 70 C136 68 146 74 144 82 C146 90 136 96 126 94 C118 98 106 98 100 97 C92 98 80 98 74 94 C64 96 54 90 56 82 Z" fill={C.ivory} />
      {/* silver varq */}
      <path d="M78 76 L92 73 L94 82 L80 84 Z" fill={C.sand} strokeWidth={1} />
      <path d="M104 80 L120 77 L122 86 L106 88 Z" fill={C.sand} strokeWidth={1} />
      <path d="M81 77 L90 75 M107 81 L117 79" stroke={C.ivory} strokeWidth={1.4} />
      {/* pistachio + almond + saffron */}
      {[
        [70, 88, 20],
        [98, 72, -30],
        [128, 84, 40],
        [112, 92, -10],
      ].map(([x, y, a]) => (
        <ellipse key={`${x}`} cx={x} cy={y} rx={4} ry={1.8} fill={C.leaf} strokeWidth={1} transform={`rotate(${a} ${x} ${y})`} />
      ))}
      {[
        [88, 90, 30],
        [134, 76, -20],
      ].map(([x, y, a]) => (
        <ellipse key={`${x}`} cx={x} cy={y} rx={4.5} ry={2.2} fill={C.sand} strokeWidth={1} transform={`rotate(${a} ${x} ${y})`} />
      ))}
      <path d="M96 86 l3 3 M118 72 l-2 4 M66 80 l3 -2 M138 88 l-3 -2 M84 70 l2 3" stroke={C.terracotta} strokeWidth={1.8} />
    </Svg>
  );
}

/** A clay handi of fiery red laal maas curry with coriander and steam. */
export function Curry(props: IllustrationProps) {
  return (
    <Svg {...props}>
      <Shadow cx={100} cy={148} rx={70} />
      <Steam xs={[76, 100, 124]} y={44} h={28} />
      {/* handles */}
      <path d="M36 82 C22 82 22 98 36 98" stroke={C.indigo} strokeWidth={7} />
      <path d="M36 82 C22 82 22 98 36 98" stroke={C.terracotta} strokeWidth={3.5} />
      <path d="M164 82 C178 82 178 98 164 98" stroke={C.indigo} strokeWidth={7} />
      <path d="M164 82 C178 82 178 98 164 98" stroke={C.terracotta} strokeWidth={3.5} />
      {/* pot */}
      <path d="M40 66 C28 92 34 132 70 146 H130 C166 132 172 92 160 66 Z" fill={C.terracotta} />
      <path d="M38 96 C70 104 130 104 162 96" stroke={C.haldi} strokeWidth={3} />
      <Dots x={46} y={106} cols={14} dx={8} r={1.4} fill={C.ivory} />
      <path d="M44 116 C76 124 124 124 156 116" stroke={C.haldi} strokeWidth={2} />
      {[60, 84, 116, 140].map((x) => (
        <Buti key={x} cx={x} cy={130 - Math.abs(x - 100) * 0.08} r={5} petals={6} fill={C.marigold} center={C.ivory} />
      ))}
      {/* rim + curry */}
      <ellipse cx={100} cy={66} rx={64} ry={14} fill={C.marigold} />
      <ellipse cx={100} cy={66} rx={56} ry={10} fill={C.rani} />
      <path d="M58 66 C70 58 130 58 142 66" stroke={C.terracotta} strokeWidth={4} opacity={0.8} />
      {[
        [80, 66],
        [102, 62],
        [122, 68],
      ].map(([x, y]) => (
        <ellipse key={x} cx={x} cy={y} rx={7} ry={4} fill={C.terracotta} strokeWidth={1.4} />
      ))}
      <Dots x={68} y={70} cols={6} dx={11} r={1.6} fill={C.haldi} />
      {[
        [90, 60, 20],
        [112, 72, -30],
        [132, 62, 10],
        [70, 62, -10],
      ].map(([x, y, a]) => (
        <path key={x} d={`M${x} ${y} c2 -4 6 -4 7 0 c-1 4 -5 4 -7 0 Z`} fill={C.leaf} strokeWidth={1} transform={`rotate(${a} ${x} ${y})`} />
      ))}
    </Svg>
  );
}

/** A clay kulhad of thick lassi crowned with malai, saffron and pistachio. */
export function Lassi(props: IllustrationProps) {
  return (
    <Svg {...props}>
      <Shadow cx={100} cy={148} rx={44} />
      <path d="M62 62 L138 62 L124 140 C122 148 78 148 76 140 Z" fill={C.terracotta} />
      <path d="M68 92 L132 92 M72 116 L128 116" stroke={C.marigold} strokeWidth={2.4} />
      <Dots x={74} y={104} cols={8} dx={7} r={1.4} fill={C.ivory} />
      <Dots x={80} y={128} cols={6} dx={7} r={1.2} fill={C.sand} />
      {/* malai crown + drips */}
      <path
        d="M58 62 C52 50 64 40 76 44 C80 30 102 26 110 38 C122 30 142 40 138 54 C146 58 144 66 136 66 L134 74 C132 80 128 80 127 74 L126 68 L98 68 L96 80 C95 86 90 86 90 80 L88 68 L72 68 L70 74 C69 78 65 78 64 74 L62 67 C56 67 54 64 58 62 Z"
        fill={C.ivory}
      />
      <path d="M72 52 C78 48 86 50 88 54 M104 44 C110 42 116 46 116 50" stroke={C.sand} strokeWidth={2} />
      <path d="M84 44 l2 4 M120 48 l-3 3 M96 52 l3 1 M70 58 l3 -2" stroke={C.terracotta} strokeWidth={1.8} />
      {[
        [92, 46, 30],
        [110, 56, -20],
        [126, 50, 50],
      ].map(([x, y, a]) => (
        <ellipse key={x} cx={x} cy={y} rx={3.5} ry={1.6} fill={C.leaf} strokeWidth={1} transform={`rotate(${a} ${x} ${y})`} />
      ))}
      {/* wooden spoon */}
      <path d="M128 40 L150 10" stroke={C.indigo} strokeWidth={6} />
      <path d="M128 40 L150 10" stroke={C.marigold} strokeWidth={3} />
    </Svg>
  );
}

/** A cutting-chai glass of masala chai with steam curls and a rusk on the side. */
export function Chai(props: IllustrationProps) {
  return (
    <Svg {...props}>
      <Shadow cx={104} cy={146} rx={60} />
      <Steam xs={[86, 100, 114]} y={40} h={30} />
      {/* glass */}
      <path d="M68 48 L132 48 L124 140 L76 140 Z" fill={C.ivory} />
      {/* tea */}
      <path d="M71 64 L129 64 L124 136 L76 136 Z" fill={C.marigold} stroke="none" />
      <path d="M71 64 L129 64 L124 136 L76 136 Z" fill={C.terracotta} opacity={0.45} stroke="none" />
      <ellipse cx={100} cy={64} rx={29} ry={4} fill={C.sand} strokeWidth={1.4} />
      <Dots x={82} y={64} cols={5} dx={8} r={1} fill={C.marigold} stagger={false} />
      {/* facets */}
      {[84, 100, 116].map((x) => (
        <path key={x} d={`M${x} 48 L${x + (x - 100) * -0.12} 140`} stroke={C.indigo} strokeWidth={1.2} opacity={0.6} />
      ))}
      <path d="M74 54 L72 70" stroke={C.ivory} strokeWidth={3} />
      <path d="M68 48 L132 48 L124 140 L76 140 Z" />
      <path d="M66 48 H134" strokeWidth={3} />
      {/* rusk */}
      <g transform="rotate(-18 160 126)">
        <rect x={142} y={116} width={40} height={16} rx={4} fill={C.haldi} />
        <path d="M144 120 H180" stroke={C.marigold} strokeWidth={3} />
        <Dots x={148} y={126} cols={5} dx={7} r={1.2} fill={C.terracotta} stagger={false} />
      </g>
      {/* elaichi + clove */}
      <ellipse cx={42} cy={134} rx={6} ry={3.4} fill={C.leaf} transform="rotate(-20 42 134)" />
      <path d="M44 133 L36 136" stroke={C.haldi} strokeWidth={1} />
      <path d="M52 142 l6 -2 M55 141 l0 -3" stroke={C.terracotta} strokeWidth={2} />
    </Svg>
  );
}

