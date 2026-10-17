import { useEffect, useState } from "react";
import { BRAND } from "./data";
import { ProfileCard } from "./components/ProfileCard";
import { QRStudio } from "./components/QRStudio";
import { Logo } from "./components/Logo";

function useHash() {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const on = () => setHash(window.location.hash);
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return hash;
}

export default function App() {
  const hash = useHash();

  // Customer view — what opens after scanning the Link QR
  if (hash === "#card" || import.meta.env.VITE_MODE === "card") {
    return (
      <div className="min-h-screen bg-slate-100 sm:py-10 flex justify-center">
        <div className="w-full sm:max-w-md sm:rounded-3xl sm:shadow-2xl overflow-hidden min-h-screen sm:min-h-0">
          <ProfileCard />
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen text-white"
      style={{
        background: `radial-gradient(1200px 600px at 10% -10%, rgba(139,199,89,.28), transparent 60%), radial-gradient(900px 500px at 110% 110%, rgba(255,255,255,.12), transparent 60%), linear-gradient(160deg, ${BRAND.blue}, ${BRAND.blueDark})`,
      }}
    >
      <header className="no-print max-w-6xl mx-auto px-6 pt-8 flex items-center justify-between gap-4">
        <Logo variant="dark" className="w-36" />
        <a
          href="#card"
          className="text-sm font-semibold rounded-full px-4 py-2 bg-white/10 ring-1 ring-white/20 hover:bg-white/20 transition"
        >
          Open digital card →
        </a>
      </header>

      <section className="no-print max-w-6xl mx-auto px-6 pt-10 text-center">
        <span
          className="inline-block text-[11px] font-bold uppercase tracking-[.2em] px-3 py-1 rounded-full"
          style={{ background: "rgba(139,199,89,.2)", color: BRAND.green }}
        >
          Digital Visiting Card
        </span>
        <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight">
          Scan. Save. <span style={{ color: BRAND.green }}>Connect.</span>
        </h1>
        <p className="mt-3 text-white/75 max-w-xl mx-auto">
          Scan the QR code with your phone camera to open my digital card.
        </p>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-12 flex justify-center">
        <div>
          <QRStudio />
        </div>

      </main>

      <footer className="no-print text-center text-xs text-white/50 pb-8">
        Glacious Fresh · Faridabad, Haryana, India
      </footer>
    </div>
  );
}
