import Link from "next/link";
import {
  ChartBar,
  Download,
  ExternalLink,
  LocateFixed,
  MessageCircle,
  RefreshCw,
  Scale,
  Smartphone,
  UserX,
  type LucideIcon,
} from "lucide-react";
import { PageHero } from "@/components/tools/PageHero";
import { StampIcon } from "@/components/motifs/StampIcon";
import { RangoliDivider } from "@/components/motifs/RangoliDivider";
import { BlockPrintPattern } from "@/components/motifs/BlockPrintPattern";
import { Jharokha } from "@/components/motifs/Jharokha";
import { Handnote } from "@/components/ui/Handnote";
import { ButtonLink } from "@/components/ui/Button";
import { KAARVAAN_WHATSAPP, waLink } from "@/lib/whatsapp";

export const metadata = { title: "Privacy" };

const UPDATED = "19 Nov 2026";

const SECTIONS: { id: string; icon: LucideIcon; color: string; title: string; body: React.ReactNode }[] = [
  {
    id: "no-account",
    icon: UserX,
    color: "#1F2A5C",
    title: "No account, no sign-up",
    body: (
      <p>
        You never give us your name, email or phone number to use Kaarvaan. There are no logins. If you type a name for the home-page
        greeting, it stays on your phone with the rest of your settings.
      </p>
    ),
  },
  {
    id: "location",
    icon: LocateFixed,
    color: "#C2185B",
    title: "Location: only when you tap",
    body: (
      <>
        <p>
          We only ask for your location when you tap <strong>&ldquo;Use my location&rdquo;</strong>. We use it for two things: to work
          out which state you&apos;re in, and to sort nearby shops, places and food by distance.
        </p>
        <p className="mt-2">
          Your coordinates are kept in memory for that visit only. They are <strong>never stored</strong>, and never sent to us. The one
          exception: to find your state, the app makes a single reverse-geocode request to{" "}
          <a href="https://www.bigdatacloud.com/privacy" className="link-wavy" target="_blank" rel="noopener noreferrer">
            BigDataCloud
          </a>
          , which receives the coordinates and sends back a place name. You can always pick your area by hand instead.
        </p>
      </>
    ),
  },
  {
    id: "device",
    icon: Smartphone,
    color: "#2E7D5B",
    title: "Your trip stays on your phone",
    body: (
      <>
        <p>
          Saved items, trips and day plans, journal notes, check-ins, your passport stamps, photos and preferences are stored{" "}
          <strong>only in this browser on this device</strong>, using localStorage and IndexedDB. Photos are shrunk on your phone and
          never uploaded. We cannot see any of it.
        </p>
        <p className="mt-2">
          For offline use, the app also keeps a copy of its own pages and pictures in the browser&apos;s cache. That holds Kaarvaan&apos;s
          content, not yours.
        </p>
      </>
    ),
  },
  {
    id: "analytics",
    icon: ChartBar,
    color: "#B5462F",
    title: "Anonymous page counts only",
    body: (
      <p>
        We use Vercel Analytics to count page views, so we know which guides are useful. It records things like the page visited, the
        referring site, the country and the type of device, without cookies and without identifying you. We don&apos;t use advertising
        trackers, and we don&apos;t sell or share data with anyone.
      </p>
    ),
  },
  {
    id: "third-party",
    icon: ExternalLink,
    color: "#1F2A5C",
    title: "WhatsApp, Maps and calls",
    body: (
      <p>
        The WhatsApp, Directions and Call buttons open other apps (WhatsApp, your maps app, your phone dialer). Once there, you&apos;re
        under their privacy policies, and anything you send is between you and the person you&apos;re talking to. We only pre-fill a
        message; we don&apos;t see what you send.
      </p>
    ),
  },
  {
    id: "control",
    icon: Download,
    color: "#2E7D5B",
    title: "Export or delete, any time",
    body: (
      <p>
        In{" "}
        <Link href="/settings" className="link-wavy">
          Settings
        </Link>
        , <strong>Export my trip</strong> downloads everything Kaarvaan has stored on your device as a file, and{" "}
        <strong>Delete everything</strong> wipes it, photos included. Clearing your browser&apos;s site data does the same.
      </p>
    ),
  },
  {
    id: "rights",
    icon: Scale,
    color: "#C2185B",
    title: "Your rights under the DPDP Act",
    body: (
      <>
        <p>
          India&apos;s Digital Personal Data Protection Act, 2023 gives you the right to know what personal data is processed about you,
          to have it corrected or erased, to withdraw consent, to nominate someone to act for you, and to have your complaints heard.
        </p>
        <p className="mt-2">
          Because your trip data lives on your own device, you&apos;re already in control: view it with Export, erase it with Delete.
          Location is used only with your tap, which you can stop at any time from your browser&apos;s site settings. For anything else,
          or a complaint, write to us on WhatsApp and a person will get back to you. If you&apos;re not satisfied, you can approach the
          Data Protection Board of India.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    icon: RefreshCw,
    color: "#1F2A5C",
    title: "If this changes",
    body: (
      <p>
        If we ever add something like accounts or bookings, we&apos;ll explain it here in plain words first, ask before collecting
        anything new, and change the date at the top of this page.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  const desk = waLink(KAARVAAN_WHATSAPP, "Namaste Kaarvaan! I have a privacy question: ");
  return (
    <>
      <PageHero title="Privacy" hi="गोपनीयता" kicker="Seedhi baat" art={<StampIcon icon={Smartphone} color="#2E7D5B" size={110} />}>
        <p>Plain English, following India&apos;s Digital Personal Data Protection Act, 2023. Last updated {UPDATED}.</p>
      </PageHero>

      <div className="container-k pt-8">
        <div className="mx-auto max-w-3xl">
          <section aria-labelledby="short" className="relative overflow-hidden rounded-3xl bg-indigo p-6 text-ivory">
            <BlockPrintPattern color="#E8A33D" opacity={0.08} />
            <div className="relative">
              <h2 id="short" className="text-2xl text-ivory">
                The short version
              </h2>
              <ul className="mt-3 space-y-2">
                {[
                  "No account. We don't know who you are.",
                  "Location only when you tap, never stored.",
                  "Photos, trips and saved items stay on your device.",
                  "Anonymous page counts only. No cookies, no ads.",
                ].map((x) => (
                  <li key={x} className="flex gap-2">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-haldi" aria-hidden="true" />
                    {x}
                  </li>
                ))}
              </ul>
              <Handnote className="mt-4 -rotate-1" color="text-haldi">
                Your trip stays on your phone.
              </Handnote>
            </div>
          </section>

          <nav aria-label="On this page" className="mt-6">
            <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="inline-flex min-h-11 items-center text-indigo underline decoration-sand underline-offset-4 hover:decoration-marigold">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-4 space-y-8">
            {SECTIONS.map((s) => (
              <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="grid scroll-mt-4 gap-3 sm:grid-cols-[56px_1fr]">
                <StampIcon icon={s.icon} color={s.color} size={52} />
                <div>
                  <h2 id={`${s.id}-h`} className="text-2xl">
                    {s.title}
                  </h2>
                  <div className="mt-1 space-y-2 text-[17px]">{s.body}</div>
                </div>
              </section>
            ))}
          </div>

          <RangoliDivider />

          <section aria-labelledby="contact" className="relative overflow-hidden rounded-3xl p-6 text-center">
            <Jharokha fill="#fff" rise={0.18} aspect={0.6} />
            <div className="relative px-2 pb-2 pt-10">
              <h2 id="contact" className="text-2xl">
                Questions? Talk to a person.
              </h2>
              <p className="mx-auto mt-1 max-w-md">The Kaarvaan desk answers privacy questions and requests on WhatsApp.</p>
              <ButtonLink href={desk} variant="leaf" className="mt-4">
                <MessageCircle className="h-5 w-5" aria-hidden="true" /> WhatsApp the desk
              </ButtonLink>
              <p className="mt-4 text-sm text-muted">Last updated {UPDATED}</p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
