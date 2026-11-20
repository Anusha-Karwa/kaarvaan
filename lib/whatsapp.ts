export const KAARVAAN_WHATSAPP = (process.env.NEXT_PUBLIC_KAARVAAN_WHATSAPP || "91XXXXXXXXXX").replace(/[^0-9X]/g, "");

/** wa.me deep link with a pre-filled message. */
export function waLink(number: string, text: string): string {
  const digits = number.replace(/[^0-9]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export function telLink(phone: string): string {
  return `tel:${phone.replace(/[^0-9+]/g, "")}`;
}

export const isPlaceholderNumber = (n: string) => /X/i.test(n) || n.replace(/\D/g, "").length < 10;
