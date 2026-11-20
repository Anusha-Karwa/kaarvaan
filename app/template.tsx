/** Page transition: short fade with a 6px slide. Pure CSS so content paints before JS loads. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-page-in">{children}</div>;
}
