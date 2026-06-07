import { useEffect, useState } from "react"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import { useReportStore } from "../store/ReportStore"
import { formatDate, getScoreStyle } from "../lib/utils"
import { ChevronRight, Star } from "lucide-react"
import { SavedReportsEmptyState } from "../components/EmptyStates"
import ReportModal from "../components/ReportModal"


const SavedReport = () => {
    const [selectedReport, setSelectedReport] = useState<any | null>(null);

    const { savedReports, isSaving, removeFromSavedReport, fetchSavedReports } = useReportStore()

    const unSaveReport = async (r: any, e:any) => {
        e.stopPropagation();

        try {
            await removeFromSavedReport(r.id)

            // Manually update HistoryStore
            useReportStore.setState((state) => ({
                savedReports: state.savedReports?.map((report) => 
                    report.id === r.id ? {...report, saved:false} : report
                ),
            }))
        } catch (error) {
            console.error("Failed to toggle save status", error);
        }
    }

    useEffect(() => {
        fetchSavedReports()
    }, [])

  return (
    <main className="main" >
        <div className="sidebar">
            <Sidebar />
        </div>

        <div className="lg:col-span-5 w-screen md:w-full">
            <Topbar pageTitle="reports" />
            <section className="content" >
                {/* heading */}
                <div className="font-jet">
                    <h2 className="font-dm black text-[1.5rem] font-bold mt-0.5">Saved Reports</h2>
                    <p className="gray-1 text-[0.7rem] mt-1">// starred and explicitly saved audits only</p>
                </div>

                { savedReports.length === 0 && <SavedReportsEmptyState /> }
                {/* saved reports */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-7">
                    {savedReports.map((s)=> {
                        const scoreStyle = getScoreStyle(s.overall_score)
                        const scores = [
                            { label:"UX", score:s.scores.ui_ux },
                            { label:"PERF", score:s.scores.performance },
                            { label:"SEO", score:s.scores.seo },
                            { label:"ALLY", score:s.scores.accessibility },
                            { label:"CONV", score:s.scores.conversion },
                        ]
                        return (
                            <div onClick={() => setSelectedReport(s)} key={s.id} className="py-3 px-3 md:px-5 border black-bord hover:cursor-pointer hover:bg-[#eae8e0]">
                                {/* heading */}
                                <span className="flex justify-between items-center font-jet">
                                    <div className="flex flex-col gap-1">
                                        <h4 className="font-dm font-bold black text-[0.9rem]">{s.domain} </h4>
                                        <p className="text-[0.7rem] gray-1">{formatDate(s.scan_meta.scanned_at).split("at")[0]} · {s.scan_meta.scan_time_seconds}s </p>
                                    </div>
                                    <h2 className={`${scoreStyle} text-[1.8rem] `} >{s.overall_score} </h2>
                                </span>
                                {/* scores */}
                                <div className="inline-flex flex-wrap gap-3 mt-3" >
                                    { scores.map((score) => (
                                        <span key={score.label} className="gray-1 text-[0.7rem] border border-[#c7c6bd] px-2 font-jet inline-flex gap-2" >
                                            <p>{score.label} </p>
                                            <p>{score.score} </p>
                                        </span>
                                    )) }
                                </div>
                                {/* headline */}
                                <p className="font-dm text-[#6b6960] text-[0.8rem] mt-3">{s.headline} </p>
                                {/* button */}
                                <span className="flex justify-between items-center">
                                    <button  onClick={() => setSelectedReport(s)} className="inline-flex items-center gap-1 mt-3 gray-1 text-[0.72rem] font-jet py-1 px-3 border black-bord group hover:bg-[#0a0a08] hover:text-[#f2f0e8] ">OPEN REPORT <ChevronRight className="size-3  group-hover:bg-[#0a0a08] group-hover:text-[#f2f0e8]" /></button>
                                    <button disabled={isSaving} onClick={(e) => unSaveReport(s,e)}  className="disabled:cursor-not-allowed disabled:opacity-50" >
                                      <Star className={`hover:cursor-pointer size-5 transition-colors ${s.saved ? "text-yellow-500 fill-yellow-500" : "black "}`} />
                                    </button>
                                    
                                </span>
                            </div>
                        )
                    })}

                </div>
            </section>
        </div>
        {selectedReport && (
            <ReportModal 
                onClose={() => setSelectedReport(null)} 
                report={selectedReport} 
            />
        )}
    </main>
  )
}

export default SavedReport