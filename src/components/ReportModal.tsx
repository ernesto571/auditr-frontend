import { formatDate, getScoreVerdict, getSeverityStyle, getVerdictStyle } from "../lib/utils";
import { handleExportCSV, handleExportPDF } from "../lib/export";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";


interface Report {
    id: number;
    domain: string;
    overall_score: number;
    verdict: string;
    summary: string;
    headline: string;
    ui_ux_notes: {
      spacing: string;
      readability: string;
      cta_visibility: string;
      responsiveness: string;
      visual_hierarchy: string;
    };
    conversion_notes: {
      cta_clarity: string;
      trust_signals: string;
      distractions: string;
      above_fold: string;
    };
    findings: {
      category: "ui_ux" | "performance" | "seo" | "accessibility" | "conversion";
      severity: "high" | "medium" | "low";
      title: string;
      description: string;
      recommendation: string;
    }[];
    key_insight: string;
    priority_order: string[];
    quick_wins: string[];
    scan_meta: {
      url: string;
      scan_time_seconds: number;
      scanned_at: string;
      total_findings: number;
      high: number;
      medium: number;
      passing: number;
    };
    scores: {
      ui_ux: number;
      performance: number;
      seo: number;
      accessibility: number;
      conversion: number;
    };
    screenshot_url: string;
    strengths: string[];
    saved: boolean;
    updated_at: Date;
}

interface props {
    onClose: () => void;
    report : Report
}


const scoreLabel = "gray-1 text-[0.7rem] inline-flex truncate"
const uiLabel = "gray-1 text-[0.7rem] inline-flex truncate w-[250px]"
const ui_notes = ["VISUALL HIERACHY", "READABILITY", "SPACING", "CTA VISIBILITY", "RESPONSIVENESS"]
const con_notes = ["CTA CLARITY", "TRUST SIGNALS", "DISTRACTIONS", "ABOVE FOLD"]


const ReportModal = ({onClose, report} : props ) => {

    const [ label, className ] = getVerdictStyle(report?.verdict);

    const [uiStyle, uiVerdict, uiVerdictStyle]      = getScoreVerdict(report?.scores.ui_ux ?? 0);
    const [perfStyle, perfVerdict, perfVerdictStyle] = getScoreVerdict(report?.scores.performance ?? 0);
    const [seoStyle, seoVerdict, seoVerdictStyle]    = getScoreVerdict(report?.scores.seo ?? 0);
    const [a11yStyle, a11yVerdict, a11yVerdictStyle] = getScoreVerdict(report?.scores.accessibility ?? 0);
    const [convStyle, convVerdict, convVerdictStyle] = getScoreVerdict(report?.scores.conversion ?? 0);
 

    const actionBtn = [
        { id: "1", label: "EXPORT PDF", action: () => report && handleExportPDF(report), color: "gray-bord border gray-1 hover:bg-[#f2f0e8] hover:text-[#0a0a08]" },
        { id: "2", label: "EXPORT CSV", action: () => report && handleExportCSV(report), color: "gray-bord border gray-1 hover:bg-[#f2f0e8] hover:text-[#0a0a08]" }
    ]

  return (
    <section onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div onClick={(e) => e.stopPropagation()} className=" rounded-2xl font-inter bg-cream  w-[95%] md:w-[80%] lg:w-[60%] max-h-[80%] overflow-y-auto relative animate-modal">
            <section>
                {/* heading */}
                <div className="grid gap-2.5 md:flex items-center px-3 md:px-5 black-bg justify-between w-full max-h-[300px] py-3">
                    <span className="flex gap-3 items-center font-jet">
                        <p className="py-1 px-2 text-xs font-semibold bg-[#1e1e1b] border-gray-500 border white ">{ report?.scan_meta.url.replace(/^https?:\/\//, "").charAt(0).toUpperCase() }</p>
                        <div>
                            <h5 onClick={() => window.open(report?.scan_meta.url, "_blank")} className="text-[0.9rem] white hover:underline hover:cursor-pointer">{ report?.scan_meta.url.split("//")[1] }</h5>
                            { report?.scan_meta?.scanned_at && (<p className="gray-2 text-[0.7rem] mt-1">Scanned {formatDate(report?.scan_meta.scanned_at)} · {report?.scan_meta.scan_time_seconds}s</p>) }
                            
                        </div>
                    </span>
                    <span className="flex gap-2">
                        { actionBtn.map((b) => (
                            <button onClick={b.action} key={b.id} className={`${b.color} truncate  text-[0.7rem] font-jet py-1 px-3 tracking-wide`}>{b.label} </button>
                        )) }
                        
                    </span>
                </div>
                {/* summary */}
                <div className="px-3 md:px-5 py-3 border black-bord ">
                    <h5 className="text-[0.7rem] gray-1 font-jet tracking-wider">SUMMARY</h5>
                    <p className="font-dm  text-[0.8rem] lg:text-sm black-2 mt-1.5">{report?.summary} </p>
                </div>
                {/* page sc and info */}
                <span className="grid grid-cols-1 md:grid-cols-3 border-x black-bord">
                    <div className="px-4 py-3 bg-off md:border-r black-bord">
                        <h5 className="text-[0.7rem] gray-1 font-jet tracking-wider">PAGE SCREENSHOT</h5>
                        <img src={report?.screenshot_url} alt="screenshot" onClick={() => window.open(report?.screenshot_url, "_blank")} className="h-[200px] w-full mt-1.5 object-cover hover:cursor-pointer hover:opacity-90 " />
                    </div>
                    <div className=" pl-5 font-jet px-3 md:px-4 py-3">
                        <h5 className="text-[0.7rem] gray-1 font-jet tracking-wider mt-2">OVERALL SCORE</h5>
                        <span className="flex relative gap-1 ">
                            <h1 className="black text-[3rem] font-bold">{report?.overall_score }</h1>
                            <h5 className="absolute inset-0 left-[7.5rem] tracking-tighter top-[1.7rem] text-gray-500 text-[1.5rem]">/100</h5>
                        </span>
                        <span className={className}>{label}</span>
                        <div className="flex flex-col gap-1 gray-1 text-[0.7rem] mt-4 whitespace-nowrap w-full">
                            <p>// {report?.scan_meta.total_findings} total findings</p>
                            <p>// {report?.scan_meta.high} high · {report?.scan_meta.medium} medium · {report?.scan_meta.passing} passing</p>
                            <p>// Scan time: {report?.scan_meta.scan_time_seconds}s</p>
                            <p>// Scanned: {formatDate(report?.scan_meta.scanned_at )}</p>
                            

                        </div>
                    </div>
                </span>
                {/* scores */}
                <div className="grid grid-cols-2 md:grid-cols-5 font-jet border black-bord">
                    <div className="px-3 py-4 black-bord border-r">
                        <p className={`${scoreLabel}`}>UI / UX</p>
                        <h1 className={`${uiStyle} `}>{report?.scores.ui_ux} </h1>
                        <div className="py-[1px] black-bg"></div>
                        <p className={`${uiVerdictStyle} mt-3`}>{uiVerdict} </p>
                    </div>
                    <div className="px-3 py-4 black-bord border-r">
                        <p className={`${scoreLabel}`}>PERFORMANCE</p>
                        <h1 className={`${perfStyle}`}>{report?.scores.performance} </h1>
                        <div className="py-[1px] black-bg"></div>
                        <p className={`${perfVerdictStyle} mt-3`}>{perfVerdict} </p>
                    </div>
                    <div className="px-3 py-4 black-bord border-r">
                        <p className={`${scoreLabel}`}>SEO</p>
                        <h1 className={`${seoStyle}`}>{report?.scores.seo} </h1>
                        <div className="py-[1px] black-bg"></div>
                        <p className={`${seoVerdictStyle} mt-3`}>{seoVerdict} </p>
                    </div>
                    <div className="px-3 py-4 black-bord border-r">
                        <p className={`${scoreLabel}`}>ACCESSIBILITY</p>
                        <h1 className={`${a11yStyle}`}>{report?.scores.accessibility} </h1>
                        <div className="py-[1px] black-bg"></div>
                        <p className={`${a11yVerdictStyle} mt-3`}>{a11yVerdict} </p>
                    </div>
                    <div className="px-3 py-4">
                        <p className={`${scoreLabel}`}>CONVERSION</p>
                        <h1 className={`${convStyle}`}>{report?.scores.conversion} </h1>
                        <div className="py-[1px] black-bg"></div>
                        <p className={`${convVerdictStyle} mt-3`}>{convVerdict} </p>
                    </div>
                </div>
                {/* check and fault */}
                <div className="grid grid-cols-1 border-x black-bord font-jet">
                    {/* issues */}
                    <section className="py-3 px-3 ">
                        <span className="gray-1 text-[0.7rem] tracking-wider flex gap-2 items-center">
                            <p>ISSUES FOUND</p>
                            <div className="flex-grow border-t border-[#dfdcd3]"></div>
                        </span>
                        <div className="flex flex-col gap-3 mt-3" >
                            { report?.findings.map((f) => {
                                const style = getSeverityStyle(f.severity)
                                return (
                                    <span key={f.title} className="grid gap-2 border-[#dfdcd3] border-b py-2">
                                        <p className={`${style} w-fit`}>{f.severity.toUpperCase()} </p>
                                        <div className="flex flex-col gap-1">
                                            <h6 className="text-sm lg:text-[0.9rem] font-dm black font-semibold">{f.title} </h6>
                                            <p className="text-[0.8rem] font-dm gray-1 ">{f.description} </p>
                                            <span className="text-xs flex gap-2 text-gray-800 "><ArrowRight className="orange size-5" /> {f.recommendation} </span>
                                        </div>
                                    </span>
                                )
                            } ) }
                            
                        </div>
                        
                    </section>
                    {/* passing */}
                    <section className="py-3 px-3 md:px-4 ">
                        <span className="gray-1 text-[0.7rem] tracking-wider flex gap-2 items-center">
                            <p>PASSING CHECKS</p>
                            <div className="flex-grow border-t border-[#dfdcd3]"></div>
                        </span>
                        <div className="flex flex-col gap-3 mt-3" >
                            { report?.strengths.map((s) => (
                                <span key={s} className="flex text-[0.8rem] lg:text-[0.9rem] gap-4 border-[#dfdcd3] border-b font-dm black py-2">
                                    <Check className="size-4 text-[#1a5c35]"/>
                                    {s}
                                </span>
                            ) ) }
                            
                        </div>
                        
                    </section>
                </div>

                {/* quick */}
                <section className="py-3 px-4 border black-bord">
                    <span className="gray-1 text-[0.7rem] tracking-wider flex gap-2 items-center font-jet">
                        <p>QUICK WINS -- FIX THESE FIRST</p>
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-3 " >
                        { report?.quick_wins.map((q) => (
                            <span key={q} className="flex gap-2 black-bord border bg-off py-2 px-3 font-dm black text-[0.8rem] md:text-[0.83rem] ">
                                <ArrowUpRight className="size-4 orange"/>
                                {q}
                            </span>
                        ) ) }
                        
                    </div>
                    
                </section>

                {/* cui/ux */}
                <div className="grid grid-cols-1 border-x black-bord font-jet">
                    {/* ui */}
                    <section className="py-3 px-4">
                        <span className="gray-1 text-[0.7rem] tracking-wider flex gap-2 items-center mb-3">
                            <p>UI / UX NOTES</p>
                            <div className="flex-grow border-t border-[#dfdcd3]"></div>
                        </span>
                        <span className="grid lg:flex justify-beteen gap-2 lg:gap-6 border-[#dfdcd3] border-b py-2">
                            <p className={uiLabel}>{ui_notes[0]} </p>
                            <p className="black font-dm text-[0.8rem]">{report?.ui_ux_notes.visual_hierarchy}</p>
                        </span>
                        <span className="grid lg:flex justify-beteen gap-2 lg:gap-6 border-[#dfdcd3] border-b py-2">
                            <p className={uiLabel}>{ui_notes[1]} </p>
                            <p className="black font-dm text-[0.8rem]">{report?.ui_ux_notes.readability}</p>
                        </span>
                        <span className="grid lg:flex justify-beteen gap-2 lg:gap-6 border-[#dfdcd3] border-b py-2">
                            <p className={uiLabel}>{ui_notes[2]} </p>
                            <p className="black font-dm text-[0.8rem]">{report?.ui_ux_notes.spacing}</p>
                        </span>
                        <span className="grid lg:flex justify-beteen gap-2 lg:gap-6 border-[#dfdcd3] border-b py-2">
                            <p className={uiLabel}>{ui_notes[3]} </p>
                            <p className="black font-dm text-[0.8rem]">{report?.ui_ux_notes.cta_visibility}</p>
                        </span>
                        <span className="grid lg:flex justify-beteen gap-2 lg:gap-6 border-[#dfdcd3] border-b py-2">
                            <p className={uiLabel}>{ui_notes[4]} </p>
                            <p className="black font-dm text-[0.8rem]">{report?.ui_ux_notes.responsiveness}</p>
                        </span>
                    </section>
                    
                    {/* CONVERSION NOTES */}
                    <section className="py-3 px-4 ">
                        <span className="gray-1 text-[0.7rem] tracking-wider flex gap-2 items-center mb-3">
                            <p>CONVERSION NOTES</p>
                            <div className="flex-grow border-t border-[#dfdcd3]"></div>
                        </span>
                        <span className="grid lg:flex justify-beteen gap-2 lg:gap-6 border-[#dfdcd3] border-b py-2">
                            <p className={uiLabel}>{con_notes[0]} </p>
                            <p className="black font-dm text-[0.8rem]">{report?.conversion_notes.cta_clarity}</p>
                        </span>
                        <span className="grid lg:flex justify-beteen gap-2 lg:gap-6 border-[#dfdcd3] border-b py-2">
                            <p className={uiLabel}>{con_notes[1]} </p>
                            <p className="black font-dm text-[0.8rem]">{report?.conversion_notes.trust_signals}</p>
                        </span>
                        <span className="grid lg:flex justify-beteen gap-2 lg:gap-6 border-[#dfdcd3] border-b py-2">
                            <p className={uiLabel}>{con_notes[2]} </p>
                            <p className="black font-dm text-[0.8rem]">{report?.conversion_notes.distractions}</p>
                        </span>
                        <span className="grid lg:flex justify-beteen gap-2 lg:gap-6 border-[#dfdcd3] border-b py-2">
                            <p className={uiLabel}>{con_notes[3]} </p>
                            <p className="black font-dm text-[0.8rem]">{report?.conversion_notes.above_fold}</p>
                        </span>
                    </section>

                </div>

                {/* ai key insight */}
                <div className="border black-bord black-bg py-5 px-4">
                    <span className="font-jet flex gap-3 items-center">
                        <p className="bg-orange white p-1 text-[0.65rem]">AI</p>
                        <p className="gray-1 text-xs">KEY INSIGHT</p>
                    </span>
                    <p className="font-dm italic text-[0.8rem] lg:text-[0.9rem] mt-2 white">"{report?.key_insight}"</p>
                </div>
            </section>
        </div>
    </section>
  )
}

export default ReportModal