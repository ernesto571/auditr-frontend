export const formatDate = (date: string | Date ): string => {
    const d = new Date(date);
    const datePart = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const timePart = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
    return `${datePart} at ${timePart}`;
};
  
  // Lagos user → "Nov 14, 2025 • 10:41"
  // London user → "Nov 14, 2025 • 09:41"

export const getVerdictStyle = (verdict: string | undefined ) => {
    let label;
    let className;
    if ( verdict === "good" ){
        label = "GOOD"
        className = "font-jet text-xs font-semibold px-3 py-1 tracking-widest bg-[rgba(26,92,53,0.08)] border border-[#1a5c35] text-[#1a5c35]"
    } else if ( verdict === "needs_attention" ){
        label = "NEEDS ATTENTION";
        className = "font-jet text-xs font-semibold px-3 py-1 tracking-widest bg-[rgba(138,96,0,0.08)] border border-[#8a6000] text-[#8a6000]"
    } else {
        label = "CRITICAL"
        className= "font-jet text-xs font-semibold px-3 py-1 tracking-widest bg-[rgba(192,57,43,0.1)] border border-[#c0392b] text-[#c0392b]"
    }

    return [label, className];
};

export const getScoreVerdict = ( score: number ) => {
    let scoreStyle;
    let verdict;
    let verdictStyle;

    if (score < 70) {
        scoreStyle = "orange font-bold text-[2rem]"
        verdict = "CRITICAL"
        verdictStyle = "bg-[#f2e1d4] border border-[#f4b49a] orange py-0.5 px-3 text-[0.7rem] tracking-tight inline-flex"
    } else if ( score > 69 && score <85) {
        scoreStyle = "text-[#8a6000] font-bold text-[2rem]"
        verdict = "REVIEW"
        verdictStyle = "bg-[rgba(138,96,0,0.08)] border border-[#8a6000] text-[#8a6000] py-0.5 px-3 text-[0.7rem] tracking-tight inline-flex"
    } else {
        scoreStyle = "text-[#1a5c35] font-bold text-[2rem]"
        verdict = "PASS"
        verdictStyle = "bg-[rgba(26,92,53,0.08)] border border-[#1a5c35] text-[#1a5c35] py-0.5 px-3 text-[0.7rem] tracking-tight inline-flex"
    }

    return [scoreStyle, verdict, verdictStyle]
}

export const getSeverityStyle = ( severity: string ) => {
    let severityStyle;

    if (severity == "high") {
        severityStyle = "bg-[#f2e1d4] border border-[#f4b49a] orange py-0.5 px-3 text-[0.7rem] tracking-tight mt-3 inline-flex h-fit"

    } else {
        severityStyle = "bg-[rgba(138,96,0,0.08)] border border-[#8a6000] text-[#8a6000] py-0.5 px-3 text-[0.7rem] tracking-tight mt-3 inline-flex h-fit"
    }

    return severityStyle
}
 
export const getScoreStyle = ( score: number ) => {
    let scoreStyle;

    if (score < 70) {
        scoreStyle = "orange font-extrabold "
    } else if ( score > 69 && score <85) {
        scoreStyle = "text-[#8a6000] font-extrabold "
    } else {
        scoreStyle = "text-[#1a5c35] font-extrabold "
    }

    return scoreStyle
}

export const timeAgo = (date: Date): string => {
  const now = Date.now();
  const diff = now - new Date(date).getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(diff / 1000 / 60);
  const hours   = Math.floor(diff / 1000 / 60 / 60);
  const days    = Math.floor(diff / 1000 / 60 / 60 / 24);
  const weeks   = Math.floor(days / 7);
  const months  = Math.floor(days / 30);

  if (seconds < 60)  return "just now";
  if (minutes < 60)  return `${minutes}m ago`;
  if (hours < 24)    return `${hours}h ago`;
  if (days < 7)      return `${days}d ago`;
  if (weeks < 4)     return `${weeks}w ago`;
  if (months < 12)   return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
};

// timeAgo("2026-05-26T10:00:00Z") → "2d ago"
// timeAgo("2026-05-29T10:30:00Z") → "3h ago"
// timeAgo("2026-05-29T10:58:00Z") → "just now"