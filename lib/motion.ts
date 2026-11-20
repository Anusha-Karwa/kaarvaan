"use client";

import { useReducedMotion } from "framer-motion";
import { useStore } from "./store";

/** True when animations are allowed (system setting and in-app override). */
export function useMotionOK(): boolean {
  const sys = useReducedMotion();
  const override = useStore((s) => s.reduceMotion);
  return !sys && !override;
}
