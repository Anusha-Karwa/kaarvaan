"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { CircleCheck, Share, SquarePlus } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type Platform = "standalone" | "ios" | "other";

function getPlatform(): Platform {
  const standalone =
    window.matchMedia?.("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
  if (standalone) return "standalone";
  const ua = navigator.userAgent;
  const ios = /iPad|iPhone|iPod/.test(ua) || (ua.includes("Macintosh") && navigator.maxTouchPoints > 1);
  return ios ? "ios" : "other";
}

const noop = () => () => {};

/** "Install Kaarvaan": native prompt where supported, Add to Home Screen hint on iOS. */
export function InstallHint() {
  const platform = useSyncExternalStore(noop, getPlatform, () => "other" as Platform);
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed || platform === "standalone") {
    return (
      <p className="flex items-center gap-2 font-semibold text-leaf-dark">
        <CircleCheck className="h-5 w-5" aria-hidden="true" /> Installed. Kaarvaan opens from your home screen, like any app.
      </p>
    );
  }

  return (
    <div>
      <p className="text-[15px]">Put Kaarvaan on your home screen. It opens full-screen and works without signal once saved for offline.</p>
      {deferred ? (
        <Button
          variant="marigold"
          className="mt-3"
          onClick={async () => {
            await deferred.prompt();
            const choice = await deferred.userChoice.catch(() => null);
            if (choice?.outcome === "accepted") setInstalled(true);
            setDeferred(null);
          }}
        >
          <SquarePlus className="h-5 w-5" aria-hidden="true" /> Install Kaarvaan
        </Button>
      ) : platform === "ios" ? (
        <p className="mt-3 flex flex-wrap items-center gap-1.5 rounded-xl bg-sand/60 px-3 py-2">
          In Safari, tap <Share className="inline h-4 w-4 text-indigo" aria-label="Share" /> <strong>Share</strong> → <strong>Add to Home Screen</strong>.
        </p>
      ) : (
        <p className="mt-3 rounded-xl bg-sand/60 px-3 py-2">
          Open your browser menu (⋮) and choose <strong>Install app</strong> or <strong>Add to Home screen</strong>.
        </p>
      )}
    </div>
  );
}
