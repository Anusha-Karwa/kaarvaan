import type { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  color?: string; // fill of the stamp
  size?: number; // outer size in px
  className?: string;
  iconColor?: string;
  ring?: string;
}

/** A lucide icon inside a filled circle with an outer dotted marigold ring, like a wooden printing-block stamp. */
export function StampIcon({ icon: Icon, color = "#1F2A5C", size = 44, className = "", iconColor = "#FBF6EC", ring = "#E8A33D" }: Props) {
  return (
    <span className={`relative inline-flex shrink-0 items-center justify-center ${className}`} style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 44 44" className="absolute inset-0 h-full w-full" focusable="false">
        <circle cx="22" cy="22" r="20.5" fill="none" stroke={ring} strokeWidth="1.6" strokeDasharray="0.5 3.2" strokeLinecap="round" />
        <circle cx="22" cy="22" r="17" fill={color} />
        <circle cx="22" cy="22" r="15" fill="none" stroke={iconColor} strokeOpacity="0.25" strokeWidth="0.8" />
      </svg>
      <Icon className="relative" style={{ width: size * 0.42, height: size * 0.42, color: iconColor }} strokeWidth={2.2} />
    </span>
  );
}
