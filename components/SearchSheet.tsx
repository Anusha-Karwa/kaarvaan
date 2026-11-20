"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import { Clock, Search } from "lucide-react";
import { useStore } from "@/lib/store";
import { search, type SearchResult } from "@/lib/data";
import { useT } from "@/lib/i18n";
import { Sheet } from "./ui/Sheet";

const SUGGESTIONS = ["Bandhani", "dal baati", "stepwell", "blue pottery workshop", "kachori", "Amer"];
const ORDER: SearchResult["group"][] = ["Crafts", "Shops", "Workshops", "Places", "Food", "Phrases"];

export function SearchSheet() {
  const open = useStore((s) => s.searchOpen);
  const setOpen = useStore((s) => s.setSearchOpen);
  const recent = useStore((s) => s.recentSearches);
  const addRecent = useStore((s) => s.addRecentSearch);
  const t = useT();
  const [q, setQ] = useState("");
  const dq = useDeferredValue(q);
  const results = useMemo(() => search(dq), [dq]);
  const groups = ORDER.map((g) => ({ g, items: results.filter((r) => r.group === g) })).filter((x) => x.items.length);

  const close = () => {
    setOpen(false);
  };
  const pick = () => {
    if (q.trim().length > 1) addRecent(q.trim());
    setOpen(false);
    setQ("");
  };

  return (
    <Sheet open={open} onClose={close} title={t("nav.search")} full wide>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          if (q.trim().length > 1) addRecent(q.trim());
        }}
        className="sticky top-0 z-10 bg-ivory pb-3"
      >
        <label className="relative block">
          <span className="sr-only">{t("search.placeholder")}</span>
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            data-autofocus
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("search.placeholder")}
            className="min-h-13 w-full rounded-full border-2 border-sand bg-white pl-12 pr-4 text-base outline-none focus:border-marigold"
          />
        </label>
      </form>

      {q.trim().length < 2 ? (
        <div className="space-y-5 py-2">
          {recent.length > 0 && (
            <section>
              <h3 className="mb-2 font-sans text-sm font-bold uppercase tracking-wide text-muted">{t("search.recent")}</h3>
              <ul className="flex flex-wrap gap-2">
                {recent.map((r) => (
                  <li key={r}>
                    <button onClick={() => setQ(r)} className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-sand px-4 text-sm font-semibold">
                      <Clock className="h-4 w-4 text-muted" aria-hidden="true" /> {r}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <section>
            <h3 className="mb-2 font-sans text-sm font-bold uppercase tracking-wide text-muted">{t("search.try")}</h3>
            <ul className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <li key={s}>
                  <button onClick={() => setQ(s)} className="min-h-11 rounded-full bg-haldi/80 px-4 text-sm font-semibold text-ink hover:bg-haldi">
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </section>
          <p className="font-hand text-lg text-rani">Psst: search works offline too.</p>
        </div>
      ) : groups.length === 0 ? (
        <p className="py-8 text-center text-muted">{t("search.none")}</p>
      ) : (
        <div className="space-y-6 py-2" aria-live="polite">
          {groups.map(({ g, items }) => (
            <section key={g}>
              <h3 className="mb-2 flex items-center gap-2 font-sans text-sm font-bold uppercase tracking-wide" style={{ color: items[0].color }}>
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: items[0].color }} aria-hidden="true" />
                {g} <span className="font-normal text-muted">({items.length})</span>
              </h3>
              <ul className="divide-y divide-sand overflow-hidden rounded-2xl border border-sand bg-white">
                {items.slice(0, 8).map((r) => (
                  <li key={r.href}>
                    <Link href={r.href} onClick={pick} className="flex min-h-14 items-start gap-3 border-l-4 px-4 py-2.5 hover:bg-ivory" style={{ borderLeftColor: r.color }}>
                      <span className="min-w-0">
                        <span className="block font-semibold text-indigo">
                          {r.title}
                          {r.titleHi && (
                            <span lang="hi" className="deva ml-2 font-normal text-muted">
                              {r.titleHi}
                            </span>
                          )}
                        </span>
                        <span className="line-clamp-1 text-sm text-muted">{r.subtitle}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </Sheet>
  );
}
