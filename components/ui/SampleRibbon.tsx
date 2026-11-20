/** Corner ribbon for fictional demo listings. */
export function SampleRibbon({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-sm bg-haldi px-2 py-0.5 font-hand text-sm font-bold text-ink shadow-sm [clip-path:polygon(0_0,100%_0,94%_50%,100%_100%,0_100%)] pr-4 ${className}`}
      title="This is a fictional sample listing while we complete our Jaipur visits"
    >
      Sample listing
    </span>
  );
}
