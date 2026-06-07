import { useEffect, useRef, useState } from "react";

const STEPS = [
  { pct: 12,  label: "VISITING PAGE..." },
  { pct: 26,  label: "CAPTURING SCREENSHOT..." },
  { pct: 42,  label: "EXTRACTING DOM..." },
  { pct: 58,  label: "FETCHING PAGESPEED DATA..." },
  { pct: 74,  label: "RUNNING AI ANALYSIS..." },
  { pct: 90,  label: "GENERATING REPORT..." },
  { pct: 100, label: "COMPLETE ✓" },
];

const ESTIMATED_MS = 45000;

interface AuditLoaderProps {
  isRunning: boolean;
  domain: string;
}

export const AuditLoader = ({ isRunning, domain }: AuditLoaderProps) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress]   = useState(0);
  const [label, setLabel]         = useState(STEPS[0].label);
  const [elapsed, setElapsed]     = useState(0);
  const timerRef                  = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepRef                   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startRef                  = useRef<number>(0);

  useEffect(() => {
    if (!isRunning) return;
    startRef.current = Date.now();
    setElapsed(0);
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning) {
      setStepIndex(0);
      setProgress(0);
      setLabel(STEPS[0].label);
      return;
    }

    let idx = 0;
    const advance = () => {
      if (idx >= STEPS.length) return;
      const step = STEPS[idx];
      setProgress(step.pct);
      setLabel(step.label);
      setStepIndex(idx);
      idx++;
      if (idx < STEPS.length) {
        const delay = idx <= 2 ? ESTIMATED_MS * 0.4 : idx <= 4 ? ESTIMATED_MS * 0.5 : ESTIMATED_MS * 0.6;
        stepRef.current = setTimeout(advance, delay);
      }
    };

    advance();
    return () => { if (stepRef.current) clearTimeout(stepRef.current); };
  }, [isRunning]);

  if (!isRunning) return null;

  const displayUrl = domain.replace(/^https?:\/\/(www\.)?/, "");

  return (
    <div className="border border-t-0 border-[#0a0a08]">

      {/* Header bar */}
      <div className="flex items-center justify-between px-3 py-[6px] bg-[#0a0a08]">
        <div className="flex items-center gap-2 min-w-0">
          <span className="relative flex-shrink-0 flex items-center justify-center w-[8px] h-[8px]">
            <span className="absolute inline-flex w-full h-full bg-[#ff3e00] opacity-60 animate-ping" />
            <span className="relative inline-flex w-[5px] h-[5px] bg-[#ff3e00]" />
          </span>
          <span className="font-jet text-[9px] tracking-[0.1em] text-[rgba(242,240,232,0.42)] uppercase flex-shrink-0">
            SCANNING
          </span>
          <span className="font-jet text-[9px] text-[rgba(242,240,232,0.28)] truncate">
            {displayUrl}
          </span>
        </div>
        <span className="font-jet text-[9px] text-[rgba(242,240,232,0.28)] flex-shrink-0 ml-3">
          {elapsed}s
        </span>
      </div>

      {/* Progress bar row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-[11px] px-4 py-3 bg-[#eae8e0]">
        <span className="font-jet text-[10px] text-[#6b6960] sm:w-[220px] sm:whitespace-nowrap">
          {label}
        </span>
        <div className="flex items-center gap-3 flex-1">
          <div className="flex-1 h-[3px] bg-[#e0ddd4] border border-[#0a0a08] overflow-hidden">
            <div
              className="h-full bg-[#ff3e00] transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="font-jet text-[11px] font-bold text-[#ff3e00] min-w-[34px] text-right flex-shrink-0">
            {progress}%
          </span>
        </div>
      </div>

      {/* Step indicators — 3-col grid on mobile, single row on md+ */}
      <div className="grid grid-cols-3 md:flex border-t border-[#0a0a08] bg-[#f2f0e8]">
        {STEPS.slice(0, -1).map((step, i) => (
          <div
            key={i}
            className={`py-[6px] px-[8px] border-r border-b md:border-b-0 border-[#0a0a08] md:flex-1 transition-all duration-300
              ${i === 2 || i === 5 ? "border-r-0 md:border-r border-[#0a0a08]" : ""}
              ${i < stepIndex ? "bg-[rgba(255,62,0,0.06)]" : i === stepIndex ? "bg-[rgba(255,62,0,0.12)]" : ""}
            `}
          >
            <div className={`font-jet text-[8px] tracking-[0.08em] uppercase truncate transition-colors duration-300
              ${i < stepIndex ? "text-[#ff3e00] opacity-50" : i === stepIndex ? "text-[#ff3e00]" : "text-[#9b9890]"}
            `}>
              {i < stepIndex ? "✓ " : i === stepIndex ? "→ " : ""}
              {step.label.replace("...", "")}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};