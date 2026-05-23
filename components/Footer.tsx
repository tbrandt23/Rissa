import { footerCopy } from "@/content/copy";

export default function Footer() {
  return (
    <footer className="px-6 md:px-12 lg:px-20 pb-10 pt-12 text-[10px] uppercase tracking-[0.25em] text-muted">
      <span>{footerCopy}</span>
    </footer>
  );
}
