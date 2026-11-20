"use client";

import { useMemo, useState } from "react";
import { Check, RotateCcw, X } from "lucide-react";
import type { Craft, Shop } from "@/lib/types";
import { haversine, isOpenNow } from "@/lib/geo";
import { useStore } from "@/lib/store";
import { FlipCard } from "../ui/FlipCard";
import { ChipButton } from "../ui/Chip";
import { Button } from "../ui/Button";
import { ShopCard } from "../Cards";
import { LocationButton } from "../LocationButton";

function Stamp({ ok }: { ok: boolean }) {
  return (
    <span
      className={`inline-flex h-8 w-8 shrink-0 -rotate-12 items-center justify-center rounded-full border-2 border-dotted ${ok ? "border-leaf bg-leaf/10 text-leaf" : "border-terracotta bg-terracotta/10 text-terracotta"}`}
      aria-label={ok ? "Real" : "Copy"}
      role="img"
    >
      {ok ? <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" /> : <X className="h-4 w-4" strokeWidth={3} aria-hidden="true" />}
    </span>
  );
}

/** Two-column checklist on desktop; swipeable flip cards on mobile. */
export function RealVsCopy({ craft }: { craft: Craft }) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-2xl border border-sand bg-white shadow-[var(--shadow-card)] md:block">
        <table className="w-full text-left">
          <caption className="sr-only">Real versus copy checks for {craft.name}</caption>
          <thead>
            <tr>
              <th scope="col" className="w-1/2 bg-leaf/10 px-5 py-3 font-display text-xl font-normal text-leaf-dark">✓ Real (handmade)</th>
              <th scope="col" className="w-1/2 bg-terracotta/10 px-5 py-3 font-display text-xl font-normal text-terracotta">✗ Copy</th>
            </tr>
          </thead>
          <tbody>
            {craft.checks.map((c, i) => (
              <tr key={i} className="border-t border-sand align-top">
                <td className="px-5 py-3">
                  <div className="flex gap-3">
                    <Stamp ok /> <span>{c.real}</span>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-3">
                    <Stamp ok={false} /> <span>{c.copy}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="scroll-x -mx-1 px-1 md:hidden" aria-label="Real versus copy: swipe and tap to flip">
        {craft.checks.map((c, i) => (
          <li key={i} className="w-[78%]">
            <FlipCard
              label={`Check ${i + 1} of ${craft.checks.length}`}
              className="h-52 w-full"
              front={
                <div className="flex h-full flex-col rounded-2xl border-2 border-leaf bg-white p-4 shadow-[var(--shadow-card)]">
                  <div className="flex items-center gap-2">
                    <Stamp ok />
                    <span className="font-display text-lg text-leaf-dark">Real · check {i + 1}</span>
                  </div>
                  <p className="mt-2 text-[15px] leading-snug">{c.real}</p>
                </div>
              }
              back={
                <div className="flex h-full flex-col rounded-2xl border-2 border-terracotta bg-[#FFF4EF] p-4 shadow-[var(--shadow-card)]">
                  <div className="flex items-center gap-2">
                    <Stamp ok={false} />
                    <span className="font-display text-lg text-terracotta">Copy · check {i + 1}</span>
                  </div>
                  <p className="mt-2 text-[15px] leading-snug">{c.copy}</p>
                </div>
              }
            />
          </li>
        ))}
      </ul>
    </>
  );
}

export function Quiz({ craft }: { craft: Craft }) {
  const [answers, setAnswers] = useState<(number | null)[]>(craft.quiz.map(() => null));
  const celebrate = useStore((s) => s.celebrate);
  const done = answers.every((a) => a !== null);
  const score = answers.filter((a, i) => a === craft.quiz[i].answer).length;
  const choose = (qi: number, oi: number) => {
    if (answers[qi] !== null) return;
    const next = answers.map((a, i) => (i === qi ? oi : a));
    setAnswers(next);
    if (next.every((a, i) => a === craft.quiz[i].answer)) celebrate();
  };
  return (
    <div className="card p-5">
      <ol className="space-y-6">
        {craft.quiz.map((q, qi) => {
          const a = answers[qi];
          return (
            <li key={qi}>
              <fieldset>
                <legend className="font-semibold text-indigo">
                  {qi + 1}. {q.q}
                </legend>
                <div className="mt-2 grid gap-2">
                  {q.options.map((o, oi) => {
                    const picked = a === oi;
                    const correct = oi === q.answer;
                    const show = a !== null;
                    return (
                      <button
                        key={oi}
                        type="button"
                        onClick={() => choose(qi, oi)}
                        disabled={show}
                        aria-pressed={picked}
                        className={`flex min-h-11 items-center gap-2 rounded-xl border-2 px-3 py-2 text-left transition-colors disabled:cursor-default ${
                          show && correct ? "border-leaf bg-leaf/10" : show && picked ? "border-terracotta bg-terracotta/10" : "border-sand bg-white hover:border-marigold"
                        }`}
                      >
                        {show && correct && <Check className="h-4 w-4 shrink-0 text-leaf" aria-label="Correct answer" />}
                        {show && picked && !correct && <X className="h-4 w-4 shrink-0 text-terracotta" aria-label="Your answer, incorrect" />}
                        {o}
                      </button>
                    );
                  })}
                </div>
                {a !== null && (
                  <p className="mt-2 text-sm text-ink/85" role="status">
                    <span className={`font-hand text-base ${a === q.answer ? "text-leaf-dark" : "text-terracotta"}`}>{a === q.answer ? "Sahi jawab! " : "Almost. "}</span>
                    {q.explain}
                  </p>
                )}
              </fieldset>
            </li>
          );
        })}
      </ol>
      {done && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-ivory p-4" role="status">
          <p>
            <span className="font-display text-3xl text-rani">
              {score}/{craft.quiz.length}
            </span>{" "}
            <span className="font-hand text-lg">{score === craft.quiz.length ? "Shabash! You'll spot the real thing." : "Read the checks once more, then try again."}</span>
          </p>
          <Button variant="ghost" onClick={() => setAnswers(craft.quiz.map(() => null))}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" /> Try again
          </Button>
        </div>
      )}
    </div>
  );
}

export function ShopList({ shops }: { shops: Shop[] }) {
  const coords = useStore((s) => s.coords);
  const [market, setMarket] = useState<string | null>(null);
  const [openOnly, setOpenOnly] = useState(false);
  const [lang, setLang] = useState<string | null>(null);
  const [sort, setSort] = useState<"recommended" | "nearest">("recommended");
  const markets = [...new Set(shops.map((s) => s.market))];
  const langs = [...new Set(shops.flatMap((s) => s.languages))].filter((l) => l !== "Hindi");
  const list = useMemo(() => {
    let l = shops.filter((s) => (!market || s.market === market) && (!openOnly || isOpenNow(s.hours)) && (!lang || s.languages.includes(lang)));
    if (sort === "nearest" && coords) l = [...l].sort((a, b) => haversine(coords.lat, coords.lng, a.lat, a.lng) - haversine(coords.lat, coords.lng, b.lat, b.lng));
    else l = [...l].sort((a, b) => a.recommendedRank - b.recommendedRank);
    return l;
  }, [shops, market, openOnly, lang, sort, coords]);
  return (
    <div>
      <div className="space-y-3" role="group" aria-label="Filter shops">
        <div className="flex flex-wrap gap-2">
          <ChipButton active={!market} onClick={() => setMarket(null)}>
            All markets
          </ChipButton>
          {markets.map((m) => (
            <ChipButton key={m} active={market === m} onClick={() => setMarket(market === m ? null : m)}>
              {m}
            </ChipButton>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ChipButton active={openOnly} onClick={() => setOpenOnly(!openOnly)} color="#2E7D5B">
            Open now
          </ChipButton>
          {langs.map((l) => (
            <ChipButton key={l} active={lang === l} onClick={() => setLang(lang === l ? null : l)} color="#1F2A5C">
              Speaks {l}
            </ChipButton>
          ))}
          <label className="ml-auto flex items-center gap-2 text-sm font-semibold">
            Sort
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as "recommended" | "nearest")}
              className="min-h-11 rounded-full border-2 border-sand bg-white px-3"
            >
              <option value="recommended">Recommended</option>
              <option value="nearest">Nearest</option>
            </select>
          </label>
        </div>
        {sort === "nearest" && !coords && (
          <div className="flex flex-wrap items-center gap-2 rounded-xl bg-haldi/25 p-3 text-sm">
            Turn on location to sort by distance. <LocationButton className="bg-white" />
          </div>
        )}
      </div>
      <ul className="mt-5 grid gap-4 lg:grid-cols-2" aria-live="polite">
        {list.map((s) => (
          <li key={s.slug}>
            <ShopCard shop={s} />
          </li>
        ))}
      </ul>
      {list.length === 0 && (
        <p className="mt-6 rounded-2xl border-2 border-dashed border-sand p-6 text-center text-muted">
          No shops match right now. Many old-city shops open late morning, so try clearing &quot;Open now&quot;.
        </p>
      )}
    </div>
  );
}
