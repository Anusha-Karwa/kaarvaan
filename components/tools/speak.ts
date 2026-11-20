"use client";

import { useSyncExternalStore } from "react";

/** True when the browser can speak (Web Speech API). */
export function speechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window && typeof window.SpeechSynthesisUtterance !== "undefined";
}

let cachedVoice: SpeechSynthesisVoice | null | undefined;

function pickHindiVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice) return cachedVoice;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null; // voices load async on some browsers; try again next time
  cachedVoice =
    voices.find((v) => v.lang.toLowerCase() === "hi-in") ??
    voices.find((v) => v.lang.toLowerCase().startsWith("hi")) ??
    null;
  return cachedVoice;
}

/**
 * Say a Hindi phrase aloud. Uses a Hindi voice when the device has one,
 * otherwise asks for lang "hi-IN" and lets the browser choose. Rate 0.85 so it's easy to repeat.
 * Returns false when speech isn't supported.
 */
export function speak(text: string, opts: { onEnd?: () => void } = {}): boolean {
  if (!speechSupported()) return false;
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text.replace(/…/g, " "));
  const voice = pickHindiVoice();
  if (voice) u.voice = voice;
  u.lang = voice?.lang ?? "hi-IN";
  u.rate = 0.85;
  u.onend = () => opts.onEnd?.();
  u.onerror = () => opts.onEnd?.();
  synth.speak(u);
  return true;
}

export function stopSpeaking() {
  if (speechSupported()) window.speechSynthesis.cancel();
}

const noopSubscribe = () => () => {};

/** Client-safe hook: true on the server (optimistic), real value after hydration. */
export function useSpeechSupported(): boolean {
  return useSyncExternalStore(noopSubscribe, speechSupported, () => true);
}
