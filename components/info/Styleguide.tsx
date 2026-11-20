"use client";

import { useState, type ReactNode } from "react";
import { Camera, Compass, Hammer, Heart, MapPinned, ShoppingBag, Sparkles, UtensilsCrossed } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatINR } from "@/lib/price";
import {
  ArchTop,
  BandhaniDots,
  BlockPrintPattern,
  Buti,
  Jharokha,
  Mandala,
  RangoliDivider,
  RouteLine,
  StampIcon,
  ToranBorder,
  VerifiedSeal,
} from "@/components/motifs";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ArchCard, Card } from "@/components/ui/Card";
import { Chillies, Chip, ChipButton, OpenChip, VegMark } from "@/components/ui/Chip";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Tabs } from "@/components/ui/Tabs";
import { Sheet } from "@/components/ui/Sheet";
import { EmptyState } from "@/components/ui/EmptyState";
import { SampleRibbon } from "@/components/ui/SampleRibbon";
import { Handnote } from "@/components/ui/Handnote";
import { PriceGauge } from "@/components/ui/PriceGauge";
import { FlipCard } from "@/components/ui/FlipCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { Illustration } from "@/components/illustrations";

const PALETTE = [
  { name: "indigo", hex: "#1F2A5C", use: "Primary, headers, nav", dark: true },
  { name: "indigo-dark", hex: "#141B3D", use: "Deep backgrounds, footer", dark: true },
  { name: "rani", hex: "#C2185B", use: "Primary buttons, Shopping", dark: true },
  { name: "rani-dark", hex: "#8E1043", use: "Pressed edge, small rani text", dark: true },
  { name: "marigold", hex: "#E8A33D", use: "Accents, focus rings, Memories" },
  { name: "marigold-ink", hex: "#8A5A12", use: "AA-safe marigold for small text", dark: true },
  { name: "leaf", hex: "#2E7D5B", use: "Experiences, success, Verified", dark: true },
  { name: "leaf-dark", hex: "#1F5A41", use: "Small leaf text", dark: true },
  { name: "haldi", hex: "#F2C14E", use: "Chips, badges, highlights" },
  { name: "terracotta", hex: "#B5462F", use: "Pottery, warnings", dark: true },
  { name: "ivory", hex: "#FBF6EC", use: "Page background" },
  { name: "sand", hex: "#EFE3CF", use: "Borders, dividers" },
  { name: "ink", hex: "#2B2233", use: "Body text", dark: true },
  { name: "muted", hex: "#6E626A", use: "Secondary text (AA-tuned)", dark: true },
];

const ILLUSTRATIONS = [
  "bandhani",
  "block-print",
  "blue-pottery",
  "kundan-meenakari",
  "mojari",
  "fort",
  "hawa-mahal",
  "palace",
  "observatory",
  "stepwell",
  "museum",
  "village",
  "thali",
  "kachori",
  "mirchi-vada",
  "ghewar",
  "curry",
  "lassi",
  "chai",
  "camel",
  "auto-rickshaw",
  "desert-dusk",
  "comic-planning",
  "comic-driver",
  "comic-shop",
  "comic-overpay",
  "comic-happy",
] as const;

const NAV = ["Palette", "Type", "Motifs", "Buttons", "Chips", "Cards", "Overlays", "Feedback", "Illustrations"];

function Block({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-4 pt-10">
      <SectionHeader as="h2" id={`${id}-h`} title={title} />
      {children}
    </section>
  );
}

function Spec({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <figure className={`card flex flex-col p-4 ${className}`}>
      <div className="flex flex-1 flex-wrap items-center justify-center gap-3">{children}</div>
      <figcaption className="mt-3 border-t border-dashed border-sand pt-2 text-center font-mono text-xs text-muted">{label}</figcaption>
    </figure>
  );
}

export function Styleguide() {
  const celebrate = useStore((s) => s.celebrate);
  const showToast = useStore((s) => s.showToast);
  const [tab, setTab] = useState("shops");
  const [sheet, setSheet] = useState(false);
  const [chip, setChip] = useState(true);
  const [price, setPrice] = useState(1200);

  const stops = [
    { label: "Hawa Mahal", sub: "9 am", icon: MapPinned },
    { label: "Kachori", sub: "10:30", icon: UtensilsCrossed, color: "#B5462F" },
    { label: "Block print", sub: "Noon", icon: Hammer, color: "#C2185B" },
    { label: "Photo walk", sub: "5 pm", icon: Camera, color: "#2E7D5B" },
  ];

  return (
    <div className="container-k pt-6">
      <nav aria-label="Styleguide sections" className="scroll-x !gap-2">
        {NAV.map((n) => (
          <a
            key={n}
            href={`#sg-${n.toLowerCase()}`}
            className="inline-flex min-h-11 items-center rounded-full border-2 border-sand bg-white px-4 text-sm font-semibold hover:border-marigold"
          >
            {n}
          </a>
        ))}
      </nav>

      <Block id="sg-palette" title="Palette">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {PALETTE.map((c) => (
            <li key={c.name} className="card overflow-hidden">
              <div className="flex h-20 items-end p-2" style={{ background: c.hex }}>
                <span className={`font-display text-2xl ${c.dark ? "text-white" : "text-ink"}`}>Aa</span>
              </div>
              <div className="p-2">
                <p className="text-sm font-semibold">{c.name}</p>
                <p className="font-mono text-xs uppercase text-muted">{c.hex}</p>
                <p className="text-xs leading-snug text-muted">{c.use}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-muted">Shopping = rani · Experiences = leaf · Memories = marigold. Marigold text on ivory is for large display only.</p>
      </Block>

      <Block id="sg-type" title="Typography">
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="space-y-3 p-5">
            <p className="font-mono text-xs text-muted">Rozha One · display</p>
            <p className="font-display text-[42px] leading-none text-indigo">H1 · Find the real Jaipur</p>
            <p className="font-display text-[30px] leading-tight text-indigo">H2 · Real crafts, fair prices</p>
            <p className="font-display text-2xl text-indigo">H3 · Bandhani from Bapu Bazaar</p>
            <p className="font-display text-5xl text-rani">₹1,250</p>
          </Card>
          <Card className="space-y-3 p-5">
            <p className="font-mono text-xs text-muted">Mukta · body 16 / small 14 · line-height 1.6</p>
            <p>Body 16px. Short sentences. Practical tips over adjectives, like a friend who knows the lanes.</p>
            <p className="text-sm text-muted">Small 14px. Indicative range, from our market visits.</p>
            <p>
              <span className="font-normal">400</span> · <span className="font-medium">500</span> · <span className="font-semibold">600</span> ·{" "}
              <span className="font-bold">700</span>
            </p>
            <p className="font-mono text-xs text-muted">Tiro Devanagari Hindi</p>
            <p lang="hi" className="deva text-3xl text-indigo">
              नमस्ते, जयपुर! कारवाँ
            </p>
            <p className="font-mono text-xs text-muted">Kalam · margin notes, sparingly</p>
            <p className="font-hand text-2xl text-rani">pakka genuine · Chalo!</p>
          </Card>
        </div>
      </Block>

      <Block id="sg-motifs" title="Motifs">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Spec label="<Buti size petals color center />">
            <Buti size={24} />
            <Buti size={36} color="#C2185B" center="#F2C14E" />
            <Buti size={48} petals={6} color="#2E7D5B" />
            <Buti size={56} petals={12} color="#1F2A5C" center="#E8A33D" />
            <Buti size={40} rotate={22.5} color="#B5462F" center="#1F2A5C" />
          </Spec>
          <Spec label="<BlockPrintPattern /> on ivory · 5%">
            <div className="relative h-28 w-full overflow-hidden rounded-xl bg-ivory ring-1 ring-sand">
              <BlockPrintPattern opacity={0.05} />
            </div>
          </Spec>
          <Spec label="<BlockPrintPattern color=marigold opacity=.07 /> on indigo">
            <div className="relative h-28 w-full overflow-hidden rounded-xl bg-indigo">
              <BlockPrintPattern color="#E8A33D" opacity={0.07} />
            </div>
          </Spec>
          <Spec label="<ToranBorder /> · flip · animate" className="sm:col-span-2 lg:col-span-3">
            <div className="w-full space-y-3">
              <ToranBorder />
              <ToranBorder flip band="#141B3D" />
              <ToranBorder animate band="#C2185B" />
            </div>
          </Spec>
          <Spec label="<Jharokha /> · <ArchTop />">
            <div className="relative h-40 w-28">
              <Jharokha fill="#fff" />
            </div>
            <div className="w-32 text-sand">
              <ArchTop height={40} />
            </div>
          </Spec>
          <Spec label="<Mandala /> · 60s turn">
            <Mandala size={140} />
          </Spec>
          <Spec label="<BandhaniDots />">
            <div className="relative h-28 w-full overflow-hidden rounded-xl bg-rani">
              <BandhaniDots color="#F2C14E" opacity={0.8} />
            </div>
          </Spec>
          <Spec label="<RangoliDivider />">
            <RangoliDivider />
          </Spec>
          <Spec label="<StampIcon />">
            <StampIcon icon={ShoppingBag} color="#C2185B" />
            <StampIcon icon={Compass} color="#2E7D5B" size={52} />
            <StampIcon icon={Heart} color="#E8A33D" iconColor="#141B3D" size={60} />
            <StampIcon icon={Sparkles} size={36} />
          </Spec>
          <Spec label="<VerifiedSeal /> · <PetalConfetti /> via celebrate()">
            <VerifiedSeal date="Nov 2026" size={96} />
            <Button variant="marigold" onClick={celebrate}>
              <Sparkles className="h-5 w-5" aria-hidden="true" /> Shabash!
            </Button>
          </Spec>
          <Spec label='<RouteLine orientation="horizontal" />' className="sm:col-span-2">
            <RouteLine stops={stops} ariaLabel="Sample day, horizontal" className="w-full" />
          </Spec>
          <Spec label='<RouteLine orientation="vertical" active={1} />'>
            <RouteLine stops={stops} orientation="vertical" active={1} ariaLabel="Sample day, vertical" />
          </Spec>
        </div>
        <p className="mt-3 text-sm text-muted">PaperGrain is the fixed 3% noise over this whole page.</p>
      </Block>

      <Block id="sg-buttons" title="Buttons">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="leaf">Leaf</Button>
            <Button variant="marigold">Marigold</Button>
            <Button variant="ghost">Ghost</Button>
            <Button disabled>Disabled</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-indigo p-4">
            <Button variant="light">Light (on indigo)</Button>
            <Button variant="marigold">Marigold</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Chalo, explore Jaipur</Button>
            <ButtonLink href="/" variant="secondary">
              ButtonLink
            </ButtonLink>
            <a href="#sg-buttons" className="link-wavy">
              link-wavy text link
            </a>
          </div>
        </div>
      </Block>

      <Block id="sg-chips" title="Chips and marks">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(["haldi", "sand", "leaf", "rani", "indigo", "marigold", "terracotta", "muted"] as const).map((t) => (
              <Chip key={t} tone={t}>
                {t}
              </Chip>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ChipButton active={chip} onClick={() => setChip((c) => !c)}>
              ChipButton {chip ? "on" : "off"}
            </ChipButton>
            <ChipButton active={!chip} color="#2E7D5B" onClick={() => setChip((c) => !c)}>
              Leaf chip
            </ChipButton>
            <OpenChip open />
            <OpenChip open={false} />
            <VegMark veg />
            <VegMark veg={false} />
            <Chillies level={1} />
            <Chillies level={2} />
            <Chillies level={3} />
            <SampleRibbon />
          </div>
        </div>
      </Block>

      <Block id="sg-cards" title="Cards and headers">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="p-5">
            <SectionHeader title="SectionHeader" hi="शीर्षक" sub="Buti + dotted wave underline" as="h3" />
            <p>A plain Card: white, sand border, 16px radius, soft indigo shadow.</p>
          </Card>
          <ArchCard href="#sg-cards" tint="#FBE3EC" ariaLabel="Sample arch card">
            <div className="flex h-28 items-center justify-center">
              <Illustration name="bandhani" className="h-24 w-auto" />
            </div>
            <div className="p-4">
              <h3 className="text-xl">ArchCard</h3>
              <p className="text-sm text-muted">Lifts 4px, arch turns marigold, buti rotates.</p>
            </div>
          </ArchCard>
          <div className="space-y-3">
            <Handnote>Handnote: pakka genuine!</Handnote>
            <Handnote color="text-leaf-dark" className="-rotate-2">
              Go early, beat the buses.
            </Handnote>
            <div className="card space-y-2 p-4" aria-label="Skeleton example">
              <Skeleton className="h-24" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </div>
        <div className="mt-6">
          <Tabs
            label="Sample tabs"
            value={tab}
            onChange={setTab}
            tabs={[
              { id: "shops", label: "Shops", hi: "दुकानें" },
              { id: "workshops", label: "Workshops" },
              { id: "food", label: "Food", hi: "खाना" },
            ]}
          />
          <div id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`} className="card mt-3 p-4">
            Tabs panel: <strong>{tab}</strong>. Use the arrow keys to move between tabs.
          </div>
        </div>
      </Block>

      <Block id="sg-overlays" title="Sheets and toasts">
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => setSheet(true)}>
            Open a Sheet
          </Button>
          <Button variant="secondary" onClick={() => showToast({ message: "Saved to Mera thela" })}>
            Show a toast
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              showToast({ message: "Removed from your plan", actionLabel: "Undo", onAction: () => showToast({ message: "Back in your plan" }) })
            }
          >
            Toast with Undo
          </Button>
        </div>
        <Sheet open={sheet} onClose={() => setSheet(false)} title="A bottom sheet">
          <p>Bottom sheet on mobile, centred dialog on desktop, with a petal-shaped grab handle. Escape closes it.</p>
          <Button className="mt-4" onClick={() => setSheet(false)}>
            Theek hai
          </Button>
        </Sheet>
      </Block>

      <Block id="sg-feedback" title="Gauge, flip card, empty state">
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="p-5">
            <PriceGauge quoted={price} min={600} max={1500} />
            <label htmlFor="sg-price" className="mt-3 block text-sm font-semibold">
              Quoted {formatINR(price)} (range ₹600–₹1,500)
            </label>
            <input
              id="sg-price"
              type="range"
              min={0}
              max={3500}
              step={50}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="mt-1 h-11 w-full accent-rani"
            />
          </Card>
          <FlipCard
            label="Sample real versus copy card"
            className="min-h-64"
            front={
              <div className="flex h-full flex-col items-center justify-center rounded-2xl bg-leaf/10 p-5 text-center ring-1 ring-leaf/30">
                <p className="font-hand text-xl text-leaf-dark">Real</p>
                <p>Tiny raised bumps where each dot was tied by hand.</p>
              </div>
            }
            back={
              <div className="flex h-full flex-col items-center justify-center rounded-2xl bg-terracotta/10 p-5 text-center ring-1 ring-terracotta/30">
                <p className="font-hand text-xl text-terracotta">Copy</p>
                <p>Flat, printed dots with a perfect repeat.</p>
              </div>
            }
          />
          <EmptyState title="Your thela is empty" action={<Button size="sm">Find something</Button>}>
            Tap ♡ on anything you like.
          </EmptyState>
        </div>
      </Block>

      <Block id="sg-illustrations" title="Illustrations">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {ILLUSTRATIONS.map((n) => (
            <li key={n} className="card flex flex-col items-center p-3">
              <div className="flex h-32 w-full items-center justify-center">
                <Illustration name={n} className="h-28 w-auto max-w-full" />
              </div>
              <p className="mt-2 font-mono text-xs text-muted">{n}</p>
            </li>
          ))}
        </ul>
      </Block>
    </div>
  );
}
