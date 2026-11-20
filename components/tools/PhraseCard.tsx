"use client";

import { Heart } from "lucide-react";
import type { Phrase } from "@/lib/types";
import { useStore } from "@/lib/store";
import { SpeakButton } from "./SpeakButton";

/** One phrase: Devanagari, transliteration, English, speak button and optional ♡ favourite. */
export function PhraseCard({
  phrase,
  favToggle = true,
  anchor = false,
  className = "",
}: {
  phrase: Phrase;
  favToggle?: boolean;
  anchor?: boolean;
  className?: string;
}) {
  const hydrated = useStore((s) => s.hydrated);
  const fav = useStore((s) => s.hydrated && s.favPhrases.includes(phrase.id));
  const toggleFav = useStore((s) => s.toggleFavPhrase);
  return (
    <article
      id={anchor ? phrase.id : undefined}
      className={`card relative flex scroll-mt-16 items-start gap-3 p-4 target:ring-2 target:ring-marigold ${className}`}
    >
      <div className="min-w-0 flex-1">
        <p lang="hi" className="deva text-[22px] leading-snug text-indigo">
          {phrase.hi}
        </p>
        <p className="mt-0.5 font-semibold text-rani-dark">{phrase.translit}</p>
        <p className="text-muted">{phrase.en}</p>
      </div>
      <div className="flex shrink-0 flex-col items-center gap-1">
        <SpeakButton text={phrase.hi} label={phrase.translit} />
        {favToggle && (
          <button
            type="button"
            onClick={() => toggleFav(phrase.id)}
            disabled={!hydrated}
            aria-pressed={fav}
            aria-label={fav ? `Remove “${phrase.en}” from favourites` : `Add “${phrase.en}” to favourites (shows on Price check)`}
            className="flex h-11 w-11 items-center justify-center rounded-full text-rani transition-colors hover:bg-rani/10"
          >
            <Heart className="h-5 w-5" fill={fav ? "currentColor" : "none"} aria-hidden="true" />
          </button>
        )}
      </div>
    </article>
  );
}
