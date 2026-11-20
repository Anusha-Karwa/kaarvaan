import { useId } from "react";
import { BandhaniMarks, Buti, C, Dots, Shadow, Svg, type IllustrationProps } from "./primitives";

/** A rani-pink bandhani dupatta draped over a wooden rod, with tie-dye rings, a marigold border and tassels. */
export function BandhaniDupatta(props: IllustrationProps) {
  const clip = `${useId()}-cloth`;
  const cloth =
    "M46 34 L154 34 C160 70 150 104 158 134 C146 132 132 140 116 136 C100 132 88 140 72 136 C60 133 50 135 42 132 C50 100 40 66 46 34 Z";
  return (
    <Svg {...props}>
      <Shadow cx={100} cy={150} rx={64} />
      {/* tassels (tops hidden behind the cloth) */}
      {[48, 60, 72, 86, 100, 114, 128, 142, 154].map((x, i) => (
        <g key={x}>
          <path d={`M${x} 128 V${143 + (i % 2) * 3}`} />
          <circle cx={x} cy={145 + (i % 2) * 3} r={2.4} fill={i % 2 ? C.haldi : C.leaf} />
        </g>
      ))}
      <clipPath id={clip}>
        <path d={cloth} />
      </clipPath>
      <g clipPath={`url(#${clip})`} stroke="none">
        <rect x={30} y={20} width={140} height={130} fill={C.marigold} />
        <path d={cloth} transform="translate(0 -11)" fill={C.rani} />
        <BandhaniMarks x={50} y={44} cols={14} rows={11} gap={8.4} />
        <Dots x={46} y={130} cols={20} dx={6} r={1.1} fill={C.rani} />
        {/* soft fold shading */}
        <path d="M84 34 C78 70 92 100 84 140 L98 140 C104 100 92 70 98 34 Z" fill={C.indigoDark} opacity={0.16} />
        <path d="M120 34 C126 70 116 100 126 140 L136 140 C130 100 138 70 132 34 Z" fill={C.indigoDark} opacity={0.12} />
      </g>
      <path d={cloth} />
      <path d="M86 38 C80 72 92 100 86 132" strokeWidth={1.5} />
      <path d="M122 38 C128 72 118 100 126 130" strokeWidth={1.5} />
      {/* wooden rod with turned knobs */}
      <path d="M26 32 H174" strokeWidth={9} />
      <path d="M26 32 H174" stroke={C.terracotta} strokeWidth={5} />
      <circle cx={22} cy={32} r={6.5} fill={C.marigold} />
      <circle cx={178} cy={32} r={6.5} fill={C.marigold} />
      <Dots x={40} y={32} cols={12} dx={11} r={0.9} fill={C.haldi} stagger={false} />
      {/* cloth wrapping over the rod */}
      <path d="M46 26 C70 22 130 22 154 26 L154 38 C130 34 70 34 46 38 Z" fill={C.rani} />
      <Dots x={54} y={31} cols={9} dx={11} r={1.2} fill={C.ivory} stagger={false} />
    </Svg>
  );
}

/** A carved wooden printing block (bagru/sanganeri) with its handle, beside a cloth with printed butis. */
export function PrintingBlock(props: IllustrationProps) {
  return (
    <Svg {...props}>
      <Shadow cx={100} cy={146} rx={86} />
      {/* printed cloth */}
      <path d="M92 90 L186 80 L190 138 L98 146 Z" fill={C.ivory} />
      <path d="M95 96 L186 86 M97 140 L189 132" stroke={C.marigold} strokeWidth={3} />
      <Buti cx={120} cy={110} r={11} fill={C.rani} />
      <Buti cx={160} cy={106} r={11} fill={C.indigo} center={C.marigold} />
      <Buti cx={141} cy={127} r={7} petals={6} fill={C.rani} />
      <Buti cx={176} cy={124} r={6} petals={6} fill={C.rani} />
      <Dots x={108} y={128} cols={2} dx={6} r={1.2} fill={C.indigo} />
      <Dots x={136} y={94} cols={3} dx={5} r={1.1} fill={C.indigo} />
      {/* a half-printed buti still wet */}
      <circle cx={104} cy={102} r={2} fill={C.rani} stroke="none" />
      {/* block: right side, front, top */}
      <path d="M94 96 L110 82 V110 L94 124 Z" fill={C.terracotta} />
      <path d="M94 96 L110 82 V110 L94 124 Z" fill={C.indigoDark} opacity={0.25} stroke="none" />
      <path d="M22 96 H94 V124 H22 Z" fill={C.terracotta} />
      {/* carved, dye-soaked printing face peeking at the bottom */}
      <path d="M22 116 H94 V124 H22 Z" fill={C.indigo} />
      <path d="M26 120 l3 -3 l3 3 l3 -3 l3 3 l3 -3 l3 3 l3 -3 l3 3 l3 -3 l3 3 l3 -3 l3 3 l3 -3 l3 3 l3 -3 l3 3 l3 -3 l3 3 l3 -3 l3 3 l3 -3 l3 3" stroke={C.rani} strokeWidth={1.5} />
      {/* wood grain */}
      <path d="M28 103 C40 100 52 106 64 102 S84 100 90 103" stroke={C.marigold} strokeWidth={1.4} />
      <path d="M28 110 C38 108 48 112 60 109 S80 108 90 111" stroke={C.marigold} strokeWidth={1.4} />
      <path d="M22 96 L38 82 H110 L94 96 Z" fill={C.marigold} />
      <Dots x={44} y={88} cols={8} dx={7} r={0.9} fill={C.terracotta} stagger={false} />
      {/* turned handle */}
      <ellipse cx={66} cy={89} rx={12} ry={4} fill={C.terracotta} />
      <path d="M60 89 V70 C56 66 56 62 60 58 H72 C76 62 76 66 72 70 V89 Z" fill={C.marigold} />
      <path d="M60 72 H72 M60 80 H72" strokeWidth={1.5} />
      <ellipse cx={66} cy={52} rx={12} ry={8} fill={C.terracotta} />
      <ellipse cx={63} cy={49} rx={4} ry={2} fill={C.marigold} stroke="none" />
    </Svg>
  );
}

/** A Jaipur blue pottery surahi: white body painted with cobalt flowers and swirling vines. */
export function BluePotteryVase(props: IllustrationProps) {
  const body =
    "M89 26 C91 40 93 50 90 60 C62 66 50 88 52 106 C54 128 70 140 86 143 L84 150 H116 L114 143 C130 140 146 128 148 106 C150 88 138 66 110 60 C107 50 109 40 111 26 Z";
  return (
    <Svg {...props}>
      <Shadow cx={100} cy={152} rx={40} ry={5} />
      <path d={body} fill={C.ivory} />
      {/* neck bands */}
      <path d="M91 36 H109 M91.5 46 H108.5" stroke={C.blue} strokeWidth={3} />
      <Dots x={94} y={41} cols={4} dx={4} r={1} fill={C.blue} stagger={false} />
      {/* shoulder scallops */}
      <path d="M66 72 q4 6 8 0 q4 6 8 0 q4 6 8 0 q4 6 8 0 q4 6 8 0 q4 6 8 0 q4 6 8 0 q4 6 8 0" stroke={C.blue} strokeWidth={2} />
      <path d="M62 78 C80 72 120 72 138 78" stroke={C.blueLight} strokeWidth={2} />
      {/* swirling vines */}
      <path d="M58 104 C60 90 72 88 76 96 C80 104 70 108 68 102" stroke={C.blue} strokeWidth={2.2} />
      <path d="M142 104 C140 90 128 88 124 96 C120 104 130 108 132 102" stroke={C.blue} strokeWidth={2.2} />
      <path d="M62 118 C70 130 80 134 88 132" stroke={C.blue} strokeWidth={2.2} />
      <path d="M138 118 C130 130 120 134 112 132" stroke={C.blue} strokeWidth={2.2} />
      {[
        [66, 124, 30],
        [78, 132, 70],
        [134, 124, -30],
        [122, 132, -70],
        [64, 92, -40],
        [136, 92, 40],
      ].map(([x, y, a]) => (
        <ellipse key={`${x}-${y}`} cx={x} cy={y} rx={2.6} ry={5} fill={C.blueLight} stroke={C.blue} strokeWidth={1.2} transform={`rotate(${a} ${x} ${y})`} />
      ))}
      {/* central flower */}
      <Buti cx={100} cy={106} r={20} petals={8} fill={C.blue} center={C.blueLight} />
      <Buti cx={100} cy={106} r={10} petals={8} fill={C.blueLight} center={C.blue} outline={false} />
      <circle cx={100} cy={106} r={2.4} fill={C.ivory} stroke="none" />
      {/* foot band */}
      <path d="M84 143 H116" stroke={C.blue} strokeWidth={3} />
      <path d={body} />
      {/* flared lip */}
      <path d="M84 22 C88 28 112 28 116 22 C112 18 88 18 84 22 Z" fill={C.blue} />
      <ellipse cx={100} cy={22} rx={11} ry={2.2} fill={C.indigoDark} stroke="none" />
      {/* glaze shine */}
      <path d="M68 92 C66 100 66 108 68 114" stroke={C.ivory} strokeWidth={3} opacity={0.9} />
    </Svg>
  );
}

function Jhumka({ x, tilt }: { x: number; tilt: number }) {
  const petals = Array.from({ length: 8 }, (_, i) => {
    const a = (Math.PI * 2 * i) / 8;
    return [Math.cos(a) * 11, 40 + Math.sin(a) * 11] as const;
  });
  const pearls = Array.from({ length: 9 }, (_, i) => -28 + i * 7);
  return (
    <g transform={`translate(${x} 0) rotate(${tilt} 0 26)`}>
      {/* ear hook */}
      <path d="M0 29 C0 18 10 14 13 20" strokeWidth={2.4} />
      {/* kundan flower stud */}
      {petals.map(([px, py], i) => (
        <circle key={i} cx={px} cy={py} r={5} fill={C.haldi} />
      ))}
      <circle cx={0} cy={40} r={8} fill={C.rani} />
      <circle cx={0} cy={40} r={3.6} fill={C.ivory} />
      {/* links */}
      <circle cx={0} cy={57} r={3} fill={C.marigold} />
      <path d="M0 52 V64" />
      {/* bell (jhumka) dome */}
      <path d="M-28 104 C-28 82 -14 66 0 66 C14 66 28 82 28 104 Z" fill={C.marigold} />
      {/* green enamel band */}
      <path d="M-26 92 C-14 88 14 88 26 92 L28 104 H-28 Z" fill={C.leaf} />
      <Dots x={-20} y={98} cols={6} dx={8} r={1.6} fill={C.haldi} stagger={false} />
      {/* red enamel drops */}
      {[-14, 0, 14].map((dx) => (
        <path key={dx} d={`M${dx} 72 C${dx + 5} 78 ${dx + 4} 84 ${dx} 85 C${dx - 4} 84 ${dx - 5} 78 ${dx} 72 Z`} fill={C.rani} transform={`rotate(${dx * 0.9} ${dx} 85)`} />
      ))}
      <circle cx={0} cy={67} r={2} fill={C.haldi} />
      {/* rim */}
      <rect x={-31} y={102} width={62} height={6} rx={3} fill={C.haldi} />
      {/* pearls */}
      {pearls.map((px, i) => (
        <g key={px}>
          {i % 2 === 0 ? <path d={`M${px} 108 V${117}`} strokeWidth={1.5} /> : null}
          <circle cx={px} cy={i % 2 === 0 ? 119 : 112} r={3.4} fill={C.ivory} />
        </g>
      ))}
      <circle cx={0} cy={126} r={3} fill={C.rani} />
    </g>
  );
}

/** A pair of Kundan-Meenakari jhumkas: gold domes, red and green enamel, kundan stones, pearl drops. */
export function KundanJhumka(props: IllustrationProps) {
  return (
    <Svg {...props}>
      <Shadow cx={100} cy={146} rx={74} ry={5} />
      <Jhumka x={58} tilt={-3} />
      <Jhumka x={142} tilt={4} />
      {/* sparkles */}
      {[
        [30, 30],
        [170, 40],
        [100, 18],
      ].map(([sx, sy]) => (
        <path key={sx} d={`M${sx} ${sy - 6} V${sy + 6} M${sx - 6} ${sy} H${sx + 6}`} stroke={C.marigold} strokeWidth={2} />
      ))}
    </Svg>
  );
}

function Jutti({ dx, dy, body }: { dx: number; dy: number; body: string }) {
  return (
    <g transform={`translate(${dx} ${dy})`}>
      {/* sole */}
      <path d="M30 116 C30 124 36 126 44 126 L136 126 C150 126 164 118 176 94 C172 106 160 116 140 120 L36 120 Z" fill={C.terracotta} />
      {/* upper */}
      <path
        d="M30 118 C26 104 30 94 38 92 C52 100 74 102 90 88 C110 82 136 92 156 98 C166 100 172 96 176 90 C178 100 170 114 152 120 C140 122 128 122 118 122 L36 122 C32 122 30 120 30 118 Z"
        fill={body}
      />
      {/* dark opening */}
      <path d="M38 92 C52 102 76 102 90 88 C72 94 54 96 38 92 Z" fill={C.indigoDark} />
      {/* embroidered vamp */}
      <path d="M90 88 C110 82 136 92 156 98 C150 108 132 114 108 114 C98 112 92 102 90 88 Z" fill={C.marigold} />
      <Buti cx={118} cy={102} r={7} petals={6} fill={C.rani} center={C.ivory} />
      <Dots x={98} y={96} cols={2} dx={6} r={1.2} fill={C.rani} />
      <Dots x={134} y={102} cols={3} dx={5} r={1.2} fill={C.rani} stagger={false} />
      <path d="M92 92 C100 108 120 114 150 104" stroke={C.haldi} strokeWidth={1.4} strokeDasharray="1 4" />
      {/* heel embroidery band */}
      <Dots x={38} y={110} cols={8} dx={6} r={1.3} fill={C.haldi} stagger={false} />
      <path d="M34 115 H88" stroke={C.haldi} strokeWidth={1.4} />
      {/* curled toe pom */}
      <circle cx={177} cy={88} r={3.6} fill={C.haldi} />
    </g>
  );
}

/** A pair of embroidered mojaris (juttis) with curled pointed toes. */
export function Mojari(props: IllustrationProps) {
  return (
    <Svg {...props}>
      <Shadow cx={104} cy={138} rx={82} ry={6} />
      <Jutti dx={-12} dy={-26} body={C.leaf} />
      <Jutti dx={2} dy={6} body={C.rani} />
    </Svg>
  );
}
