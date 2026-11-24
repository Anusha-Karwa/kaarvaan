"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { states } from "@/lib/content/states";
import { LocationButton } from "./LocationButton";
import { BandhaniDots } from "./motifs/BandhaniDots";

export function StatePicker() {
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return states
      .filter((x) => !s || x.name.toLowerCase().includes(s) || x.nameHi.includes(q.trim()))
      .sort((a, b) => Number(b.live) - Number(a.live) || a.name.localeCompare(b.name));
  }, [q]);
  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search states and union territories</span>
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search a state, e.g. Kerala"
            className="min-h-12 w-full rounded-full border-2 border-sand bg-white pl-12 pr-4 outline-none focus:border-marigold"
          />
        </label>
        <LocationButton className="self-start bg-white" />
      </div>
      <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {list.map((s) =>
          s.live ? (
            <li key={s.slug} className="col-span-2 sm:col-span-3 lg:col-span-4">
              <Link
                href={`/shop/${s.slug}`}
                className="group relative flex items-center gap-4 overflow-hidden rounded-3xl bg-rani p-5 text-white shadow-[var(--shadow-lift)] transition-transform hover:-translate-y-1"
              >
                <BandhaniDots color="#F2C14E" opacity={0.3} />
                <span className="relative flex-1">
                  <span className="block font-display text-4xl text-white">{s.name}</span>
                  <span lang="hi" className="deva block text-xl text-haldi">
                    {s.nameHi}
                  </span>
                  <span className="mt-1 block text-white/90">Jaipur is live: 5 crafts, 15 makers&apos; shops, workshops and food.</span>
                </span>
                <span className="relative flex h-20 w-20 shrink-0 -rotate-12 flex-col items-center justify-center rounded-full border-4 border-dotted border-haldi bg-marigold text-indigo-dark">
                  <span className="font-display text-xl leading-none">Live</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider">Chalo!</span>
                </span>
              </Link>
            </li>
          ) : (
            <li key={s.slug}>
              <Link
                href={`/shop/${s.slug}`}
                className="flex h-full min-h-20 flex-col justify-center rounded-2xl border border-dashed border-[#d9cbb3] bg-white/50 px-3 py-2 text-ink/65 hover:border-marigold"
              >
                <span className="font-semibold leading-tight">{s.name}</span>
                <span lang="hi" className="deva text-sm">
                  {s.nameHi}
                </span>
                <span className="text-xs font-semibold text-muted">Aa rahe hain{s.type === "ut" ? " · UT" : ""}</span>
              </Link>
            </li>
          ),
        )}
      </ul>
      {list.length === 0 && <p className="mt-6 text-center text-muted">No state by that name. Try another spelling?</p>}
    </div>
  );
}
