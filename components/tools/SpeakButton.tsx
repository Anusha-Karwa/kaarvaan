"use client";

import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { speak, stopSpeaking, useSpeechSupported } from "./speak";

/** Round speaker button that reads a Hindi phrase aloud. */
export function SpeakButton({ text, label, className = "" }: { text: string; label: string; className?: string }) {
  const supported = useSpeechSupported();
  const [speaking, setSpeaking] = useState(false);
  useEffect(() => () => stopSpeaking(), []);
  return (
    <button
      type="button"
      onClick={() => {
        if (speaking) {
          stopSpeaking();
          setSpeaking(false);
          return;
        }
        if (speak(text, { onEnd: () => setSpeaking(false) })) setSpeaking(true);
      }}
      disabled={!supported}
      aria-label={supported ? `Say “${label}” aloud in Hindi` : "Speech isn't available on this device"}
      title={supported ? "Listen" : "Speech isn't available on this device"}
      className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        speaking ? "bg-marigold text-indigo-dark" : "bg-indigo text-ivory hover:bg-indigo-dark"
      } ${className}`}
    >
      <svg viewBox="0 0 48 48" className="pointer-events-none absolute inset-0" aria-hidden="true">
        <circle cx="24" cy="24" r="22.5" fill="none" stroke="#E8A33D" strokeWidth="1.6" strokeDasharray="0.5 3.4" strokeLinecap="round" />
      </svg>
      {supported ? (
        <Volume2 className={`h-5 w-5 ${speaking ? "animate-pulse" : ""}`} aria-hidden="true" />
      ) : (
        <VolumeX className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  );
}

/** Gentle note shown once on a page when the device can't speak. */
export function SpeechNote({ className = "" }: { className?: string }) {
  const supported = useSpeechSupported();
  if (supported) return null;
  return (
    <p className={`rounded-2xl bg-haldi/25 px-4 py-3 text-sm text-ink ring-1 ring-haldi ${className}`} role="note">
      Your browser can&apos;t read phrases aloud. No problem: show the Hindi on your screen to the shopkeeper. It works just as well.
    </p>
  );
}
