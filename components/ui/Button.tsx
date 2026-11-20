import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { Buti } from "../motifs/Buti";

type Variant = "primary" | "secondary" | "leaf" | "ghost" | "marigold" | "light";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative inline-flex select-none items-center justify-center gap-2 rounded-full font-semibold transition-[transform,background-color,box-shadow,color] duration-150 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-rani text-white shadow-[inset_0_-2px_0_#8E1043] hover:bg-[#ad1652]",
  leaf: "bg-leaf text-white shadow-[inset_0_-2px_0_#1F5A41] hover:bg-[#286e50]",
  marigold: "bg-marigold text-indigo-dark shadow-[inset_0_-2px_0_#b57a20] hover:bg-[#e09a2f]",
  secondary: "border-2 border-indigo bg-white/70 text-indigo hover:bg-indigo hover:text-ivory",
  light: "border-2 border-ivory/80 text-ivory hover:bg-ivory hover:text-indigo",
  ghost: "text-indigo hover:bg-sand/70",
};

const sizes: Record<Size, string> = {
  sm: "min-h-11 px-4 text-sm",
  md: "min-h-11 px-5 text-base",
  lg: "min-h-13 px-7 text-lg",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", extra = "") {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`;
}

function Bloom({ variant }: { variant: Variant }) {
  if (variant === "ghost" || variant === "secondary" || variant === "light") return null;
  return (
    <span className="pointer-events-none absolute -right-1 -top-1 scale-0 transition-transform duration-200 group-hover/btn:scale-100 group-active/btn:scale-100" aria-hidden="true">
      <Buti size={16} color="#F2C14E" center="#fff" />
    </span>
  );
}

type Common = { variant?: Variant; size?: Size; children: ReactNode; className?: string };

export function Button({ variant = "primary", size = "md", className = "", children, ...rest }: Common & ComponentProps<"button">) {
  return (
    <button className={buttonClass(variant, size, className)} {...rest}>
      {children}
      <Bloom variant={variant} />
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  children,
  href,
  external,
  ...rest
}: Common & { href: string; external?: boolean } & Omit<ComponentProps<"a">, "href">) {
  const cls = buttonClass(variant, size, className);
  if (external || /^(https?:|tel:|mailto:)/.test(href)) {
    return (
      <a href={href} className={cls} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" {...rest}>
        {children}
        <Bloom variant={variant} />
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {children}
      <Bloom variant={variant} />
    </Link>
  );
}
