"use client";

import { useStore } from "./store";
import type { Lang } from "./types";

/**
 * UI strings. Content (shop descriptions, history, etc.) stays English;
 * Hindi names are shown alongside content names.
 */
const dict = {
  "nav.home": { en: "Home", hi: "होम" },
  "nav.shopping": { en: "Shopping", hi: "ख़रीदारी" },
  "nav.experiences": { en: "Experiences", hi: "अनुभव" },
  "nav.plan": { en: "Plan", hi: "योजना" },
  "nav.memories": { en: "Memories", hi: "यादें" },
  "nav.saved": { en: "Mera thela", hi: "मेरा थैला" },
  "nav.search": { en: "Search", hi: "खोजें" },
  "nav.settings": { en: "Settings", hi: "सेटिंग्स" },
  "nav.about": { en: "About", hi: "हमारे बारे में" },
  "nav.how": { en: "How we choose places", hi: "हम जगहें कैसे चुनते हैं" },
  "nav.privacy": { en: "Privacy", hi: "गोपनीयता" },
  "nav.phrases": { en: "Phrasebook", hi: "वाक्य-पुस्तिका" },
  "nav.priceCheck": { en: "Price check", hi: "दाम जाँचें" },
  "nav.gettingAround": { en: "Getting around", hi: "आना-जाना" },

  "mode.planning": { en: "Planning", hi: "योजना" },
  "mode.here": { en: "In Jaipur", hi: "जयपुर में" },
  "mode.label": { en: "Trip mode", hi: "यात्रा मोड" },
  "mode.planningLong": { en: "Planning my trip", hi: "यात्रा की योजना" },
  "mode.hereLong": { en: "I'm in Jaipur now", hi: "मैं अभी जयपुर में हूँ" },

  "greet.morning": { en: "Suprabhat", hi: "सुप्रभात" },
  "greet.afternoon": { en: "Namaste", hi: "नमस्ते" },
  "greet.evening": { en: "Shubh sandhya", hi: "शुभ संध्या" },
  "greet.morningEn": { en: "good morning", hi: "शुभ प्रभात" },
  "greet.afternoonEn": { en: "hello", hi: "नमस्कार" },
  "greet.eveningEn": { en: "good evening", hi: "शुभ संध्या" },
  "greet.traveller": { en: "traveller", hi: "यात्री" },

  "home.tagline": { en: "Find the real city: its crafts, its food, its people.", hi: "असली शहर खोजिए: उसकी कला, उसका खाना, उसके लोग।" },
  "home.cta": { en: "Chalo, explore Jaipur", hi: "चलो, जयपुर घूमें" },
  "home.exploring": { en: "You're exploring", hi: "आप घूम रहे हैं" },
  "home.change": { en: "Change", hi: "बदलें" },
  "home.useLocation": { en: "Use my location", hi: "मेरी लोकेशन लें" },
  "home.nearYou": { en: "Near you right now", hi: "अभी आपके पास" },
  "home.priceCheck": { en: "Price check", hi: "दाम जाँचें" },
  "home.yourTrip": { en: "Your trip", hi: "आपकी यात्रा" },
  "home.planDays": { en: "Plan my days", hi: "मेरे दिन प्लान करें" },
  "home.beforeGo": { en: "Before you go", hi: "जाने से पहले" },
  "home.dontFooled": { en: "Don't get fooled", hi: "धोखा न खाएँ" },
  "home.story": { en: "Ananya's story", hi: "अनन्या की कहानी" },
  "home.featured": { en: "Featured experiences", hi: "ख़ास अनुभव" },
  "home.oneLine": { en: "Jaipur in one line", hi: "एक पंक्ति में जयपुर" },

  "opt.shopping": { en: "Shopping", hi: "ख़रीदारी" },
  "opt.shoppingDesc": { en: "Real crafts, fair prices, the makers behind them.", hi: "असली कला, सही दाम, और उनके कारीगर।" },
  "opt.experiences": { en: "Experiences", hi: "अनुभव" },
  "opt.experiencesDesc": { en: "Workshops, places and food worth the trip.", hi: "वर्कशॉप, जगहें और खाना।" },
  "opt.memories": { en: "Memories", hi: "यादें" },
  "opt.memoriesDesc": { en: "Your trip album, journal and passport.", hi: "आपका एल्बम, डायरी और पासपोर्ट।" },

  "act.save": { en: "Save", hi: "सेव करें" },
  "act.saved": { en: "Saved", hi: "सेव हो गया" },
  "act.directions": { en: "Directions", hi: "रास्ता" },
  "act.whatsapp": { en: "WhatsApp", hi: "व्हाट्सऐप" },
  "act.call": { en: "Call", hi: "कॉल करें" },
  "act.addPlan": { en: "Add to plan", hi: "प्लान में जोड़ें" },
  "act.visited": { en: "I visited", hi: "मैं गया/गई" },
  "act.share": { en: "Share", hi: "शेयर करें" },
  "act.copyLink": { en: "Copy link", hi: "लिंक कॉपी करें" },
  "act.undo": { en: "Undo", hi: "वापस लें" },
  "act.delete": { en: "Delete", hi: "हटाएँ" },
  "act.remove": { en: "Remove", hi: "हटाएँ" },
  "act.back": { en: "Back", hi: "वापस" },
  "act.next": { en: "Next", hi: "आगे" },
  "act.skip": { en: "Skip", hi: "छोड़ें" },
  "act.done": { en: "Done", hi: "हो गया" },
  "act.close": { en: "Close", hi: "बंद करें" },
  "act.seeAll": { en: "See all", hi: "सब देखें" },
  "act.backHome": { en: "Back to home", hi: "होम पर वापस" },

  "common.openNow": { en: "Open now", hi: "अभी खुला" },
  "common.closed": { en: "Closed now", hi: "अभी बंद" },
  "common.indicative": { en: "Indicative range", hi: "अनुमानित दाम" },
  "common.sample": { en: "Sample listing", hi: "नमूना सूची" },
  "common.comingSoon": { en: "Aa rahe hain! (Coming soon)", hi: "आ रहे हैं! (जल्द आ रहा है)" },
  "common.offline": { en: "Offline: showing saved info", hi: "ऑफ़लाइन: सेव की गई जानकारी" },
  "common.thankYou": { en: "Dhanyavaad", hi: "धन्यवाद" },
  "common.privateTrip": { en: "Your trip stays on your phone", hi: "आपकी यात्रा आपके फ़ोन पर ही रहती है" },
  "common.live": { en: "Live", hi: "चालू" },

  "saved.title": { en: "Mera thela", hi: "मेरा थैला" },
  "saved.subtitle": { en: "Saved for your trip", hi: "आपकी यात्रा के लिए सेव" },
  "saved.empty": { en: "Nothing in your thela yet. Tap ♡ on anything you like.", hi: "थैला अभी खाली है। जो पसंद आए उस पर ♡ दबाएँ।" },

  "mem.empty": { en: "Your yaadein go here. Add the first photo from your trip.", hi: "आपकी यादें यहाँ आएँगी। यात्रा की पहली फ़ोटो जोड़ें।" },
  "mem.shabash": { en: "Shabash! Added to your trip story.", hi: "शाबाश! आपकी यात्रा की कहानी में जुड़ गया।" },

  "search.placeholder": { en: "Search crafts, shops, places, food…", hi: "कला, दुकानें, जगहें, खाना खोजें…" },
  "search.recent": { en: "Recent searches", hi: "हाल की खोजें" },
  "search.try": { en: "Try", hi: "ये आज़माएँ" },
  "search.none": { en: "Nothing found. Try another word, like “kachori” or “fort”.", hi: "कुछ नहीं मिला। कोई और शब्द आज़माएँ।" },

  "footer.love": { en: "Banaya pyaar se, Jaipur ke kaarigaron ke liye", hi: "बनाया प्यार से, जयपुर के कारीगरों के लिए" },
  "footer.loveEn": { en: "Made with love, for Jaipur's makers", hi: "जयपुर के कारीगरों के लिए, प्यार से बनाया" },

  "banner.preview": { en: "Preview: shop and host listings are samples while we complete our Jaipur visits.", hi: "प्रीव्यू: दुकानें और होस्ट अभी नमूना सूची हैं, जब तक हम जयपुर के दौरे पूरे करते हैं।" },

  "lost.title": { en: "Raasta bhatak gaye?", hi: "रास्ता भटक गए?" },
  "lost.sub": { en: "(Lost the way?)", hi: "(रास्ता खो गया?)" },
} satisfies Record<string, Record<Lang, string>>;

export type TKey = keyof typeof dict;

export function translate(key: TKey, lang: Lang): string {
  return dict[key]?.[lang] ?? dict[key]?.en ?? key;
}

export function useT() {
  const lang = useStore((s) => (s.hydrated ? s.lang : "en"));
  return (key: TKey) => translate(key, lang);
}

export function useLang(): Lang {
  return useStore((s) => (s.hydrated ? s.lang : "en"));
}
