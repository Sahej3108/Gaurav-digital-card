import { useMemo, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { toPng } from "html-to-image";
import { BRAND, CONTACT } from "../data";
import { Logo, gMarkDataUrl } from "./Logo";
import { CheckIcon, CopyIcon, DownloadIcon, PrinterIcon, QrIcon } from "./Icons";

export function QRStudio() {
  const defaultLink =
    (import.meta.env.VITE_CARD_URL as string | undefined) ||
    (typeof window !== "undefined" ? window.location.href.split("#")[0] + "#card" : "");
  const [link, setLink] = useState(defaultLink);
  const [copied, setCopied] = useState(false);
  const svgWrap = useRef<HTMLDivElement>(null);

  const value = link || defaultLink;
  const logoSrc = useMemo(() => gMarkDataUrl(), []);

  const fileBase = `glacious-fresh-${CONTACT.firstName.toLowerCase()}-digital-card-qr`;

  const cardRef = useRef<HTMLDivElement>(null);
  const downloadCard = async () => {
    if (!cardRef.current) return;
    const url = await toPng(cardRef.current, { pixelRatio: 3, cacheBust: true });
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileBase.replace("-qr", "")}.png`;
    a.click();
  };

  const downloadSvg = () => {
    const svg = svgWrap.current?.querySelector("svg");
    if (!svg) return;
    const clone = svg.cloneNode(true) as SVGSVGElement;
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clone.setAttribute("width", "1024");
    clone.setAttribute("height", "1024");
    const blob = new Blob([clone.outerHTML], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileBase}.svg`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  const imageSettings = { src: logoSrc, height: 0, width: 0, excavate: true };

  return (
    <div className="w-full">
      {/* Printable QR card */}
      <div id="print-area" className="mx-auto w-full max-w-[360px]">
        <div ref={cardRef} className="rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/30 bg-white">
          <div className="relative px-8 pt-8 pb-10" style={{ background: BRAND.blue }}>
            <div
              className="absolute inset-0 opacity-25"
              style={{
                background:
                  "radial-gradient(circle at 100% 0%, rgba(255,255,255,.45), transparent 50%)",
              }}
            />
            <Logo variant="dark" className="relative w-52 mx-auto" />
          </div>
          <div
            className="h-6 flex items-center justify-end pr-4"
            style={{
              background: `linear-gradient(90deg, ${BRAND.blue} 0%, ${BRAND.green} 40%, ${BRAND.green} 100%)`,
            }}
          >
            <span className="text-[9.5px] font-bold uppercase tracking-wide" style={{ color: BRAND.blue }}>
              Delivering Freshness. <em>Driving Trust.</em>
            </span>
          </div>

          <div className="px-8 pt-7 pb-8 text-center">
            <div ref={svgWrap} className="mx-auto w-[220px] h-[220px] p-3 rounded-2xl bg-white ring-1 ring-slate-200 shadow-inner">
              <QRCodeSVG
                value={value}
                size={196}
                level="H"
                marginSize={0}
                fgColor={BRAND.blueDark}
                bgColor="#ffffff"
                imageSettings={{ ...imageSettings, height: 44, width: 44 }}
                className="w-full h-full"
              />
            </div>
            <h2 className="mt-6 text-xl font-extrabold uppercase tracking-tight text-slate-900">
              {CONTACT.fullName}
            </h2>
            <p className="mt-1 text-[12px] font-semibold uppercase text-slate-500 leading-snug">
              {CONTACT.title}
            </p>
            <div className="mt-4 mx-auto h-[3px] w-16 rounded-full" style={{ background: BRAND.green }} />
            <p className="mt-4 text-sm font-semibold flex items-center justify-center gap-2" style={{ color: BRAND.blue }}>
              <QrIcon className="w-4 h-4" /> Scan to view my digital card
            </p>
          </div>
          <div
            className="py-3 text-center text-[12px] font-extrabold uppercase tracking-[.18em]"
            style={{ background: BRAND.green, color: BRAND.blueDark }}
          >
            🌱 Save paper, be digital
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="no-print mx-auto max-w-[360px] mt-8 space-y-4">
        <p className="text-xs text-white/70 leading-relaxed">
          Scanning opens the interactive digital card (call, WhatsApp, email, directions, save contact). Paste your hosted website URL below, ending in #card, before downloading or printing.
        </p>
        <div className="flex gap-2">
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="flex-1 min-w-0 rounded-lg bg-white/95 px-3 py-2.5 text-sm text-slate-800 outline-none focus:ring-2"
            placeholder="https://your-domain.com/#card"
          />
          <button
            onClick={copyLink}
            className="px-3 rounded-lg bg-white/15 text-white hover:bg-white/25 transition"
            aria-label="Copy link"
          >
            {copied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={downloadCard}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl py-3 text-sm font-semibold text-slate-900 transition hover:brightness-105"
            style={{ background: BRAND.green }}
          >
            <DownloadIcon className="w-4 h-4" /> Card PNG
          </button>
          <button
            onClick={downloadSvg}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl py-3 text-sm font-semibold bg-white text-slate-900 transition hover:bg-slate-100"
          >
            <DownloadIcon className="w-4 h-4" /> QR SVG
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl py-3 text-sm font-semibold bg-white/15 text-white ring-1 ring-white/25 transition hover:bg-white/25"
          >
            <PrinterIcon className="w-4 h-4" /> Print
          </button>
        </div>
      </div>
    </div>
  );
}
