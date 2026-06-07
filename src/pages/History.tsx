import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useReportStore } from "../store/ReportStore";
import { ArrowRight, Star } from "lucide-react";
import { formatDate, getScoreStyle, getScoreVerdict } from "../lib/utils";
import { HistoryEmptyState } from "../components/EmptyStates";
import ReportModal from "../components/ReportModal";

const th = "px-4  py-2 font-[300]"
const td = "px-4 py-3"

const ITEMS_PER_PAGE = 8


export default function History () {
    const [selectedReport, setSelectedReport] = useState<any | null>(null);

    const { reports, saveReport, removeFromSavedReport, fetchAllReports } = useReportStore()
    const [currentPage, setCurrentPage] = useState(1)
    const totalPages = Math.ceil(reports?.length / ITEMS_PER_PAGE)
    const paginatedReports = reports?.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    ) 

    const handleSaveReport = async (r: any, e:any) => {
        e.stopPropagation();

        try {
            if ( r.saved ){
                await removeFromSavedReport(r.id)

                // Manually update HistoryStore
                useReportStore.setState((state) => ({
                    reports: state.reports?.map((report) => 
                        report.id === r.id ? {...report, saved:false} : report
                    ),
                }))
            } else {

                await saveReport(r.id);

                // Manually update HistoryStore
                useReportStore.setState((state) => ({
                    reports: state.reports?.map((report) => 
                        report.id === r.id ? {...report, saved:true} : report
                    ),
                }))

            }
        } catch (error) {
            console.error("Failed to toggle save status", error);
        }
    }

    useEffect (() => {
        if (!reports){
            fetchAllReports()
        }
    })

    return(
        <main className="main">
            <div className="sidebar" >
                <Sidebar />
            </div>

            <div className="lg:col-span-5 w-screen md:w-full" >
                <Topbar pageTitle="history" />
                <section className="content" >
                    {/* heading */}
                    <div className="font-jet">
                        <h2 className="font-dm black text-[1.5rem] font-bold mt-0.5">Audit History</h2>
                        <p className="gray-1 text-[0.7rem] mt-1">// all audits — saved and unsaved — logged automatically</p>
                    </div>

                    { reports.length === 0 && <HistoryEmptyState /> }

                    {/* table */}
                    { reports.length > 0 && (
                        <div className="mt-7  border black-bord overflow-auto ">
                            <table className="min-w-full overflow-auto table-fixed border-collapse">
                                <tr className="gray-1 text-left font-jet  text-[0.7rem] bg-off border-b black-bord " >
                                    <th className={`px-2 md:px-4  py-2 font-[300] w-[55%]`}>URL</th>
                                    <th className={`${th} hidden md:table-cell`}>DATE</th>
                                    <th className={`${th}`}>SCORE</th>
                                    <th className={`${th} hidden md:table-cell`}>VERDICT</th>
                                    <th className={`${th}`}></th>
                                </tr>

                                { paginatedReports?.slice(0,1).map((r:any) => {
                                    const scoreStyle = getScoreStyle(r.overall_score)
                                    const [_,verdict, verdictStyle] = getScoreVerdict(r.overall_score)
                                    return (
                                        <tr onClick={() => setSelectedReport(r)} key={r.id} className=" hover:cursor-pointer  border-t black-bord ease-in-out transform ">
                                            {/* url */}
                                            <td className={`px-2 md:px-4 py-3 flex items-center gap-3 truncate black text-[0.8rem] md:text-sm font-medium font-dm`}>
                                                <ArrowRight className="orange size-4" /> {r.domain}
                                            </td>
                                            {/* date */}
                                            <td className={`${td} hidden md:table-cell gray-1 text-[0.8rem] font-[300] font-jet truncate`}>
                                                { formatDate(r.scan_meta.scanned_at).split("at")[0] }
                                            </td>
                                            {/* score */}
                                            <td className={`${td} ${scoreStyle} font-jet `}>
                                                {r.overall_score}
                                            </td>
                                            {/* verdict */}
                                            <td className={`px-4 hidden md:inline-flex -mt-1  ${verdictStyle} font-jet `}>
                                                {verdict}
                                            </td>
                                            <td className={td}>
                                                <Star onClick={(e) => handleSaveReport(r,e)} className={`hover:cursor-pointer size-4 transition-colors ${r.saved ? "text-yellow-500 fill-yellow-500" : "black "}`}/>
                                            </td>
                                        </tr>
                                    )    
                                }) }

                                { paginatedReports?.slice(1).map((r:any) => {
                                    const scoreStyle = getScoreStyle(r.overall_score)
                                    const [_,verdict, verdictStyle] = getScoreVerdict(r.overall_score)
                                    return (
                                        <tr onClick={() => setSelectedReport(r)} key={r.id} className="group hover:cursor-pointer  border-t border-[#dedbd0] ease-in-out transform ">
                                            {/* url */}
                                            <td className={`px-2 md:px-4 py-3 flex items-center gap-3 truncate black text-[0.8rem] md:text-sm font-medium font-dm`}>
                                                <ArrowRight className="orange size-4" /> {r.domain}
                                            </td>
                                            {/* date */}
                                            <td className={`${td} hidden md:table-cell gray-1 text-[0.8rem] font-[300] font-jet truncate`}>
                                                { formatDate(r.scan_meta.scanned_at).split("at")[0] }
                                            </td>
                                            {/* score */}
                                            <td className={`${td} ${scoreStyle} font-jet `}>
                                                {r.overall_score}
                                            </td>
                                            {/* verdict */}
                                            <td className={`px-4 hidden md:inline-flex  ${verdictStyle} font-jet `}>
                                                {verdict}
                                            </td>
                                            <td className={td}>
                                                <Star onClick={(e) => handleSaveReport(r,e)} className={`hover:cursor-pointer size-4 transition-colors ${r.saved ? "text-yellow-500 fill-yellow-500" : "black "}`}/>
                                            </td>
                                        </tr>
                                    )    
                                }) }
                            </table>

                            {/* ✅ Pagination */}
                            {reports.length > ITEMS_PER_PAGE && (
                                <div className="flex items-center justify-between py-4 mt-2">
                                    <p className="text-xs text-gray-400">
                                    Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, reports.length)} of {reports.length} documents
                                    </p>
                                    <div className="flex items-center gap-1 font-semibold">
                                    {/* Prev */}
                                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                                        className="px-3 py-1.5 text-xs gray-900 gray disabled:opacity-40 transition-all">
                                        ‹
                                    </button>

                                    {/* Page numbers */}
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button key={i} onClick={() => setCurrentPage(i + 1)}
                                        className={`w-8 h-8 text-xs rounded-lg transition-all ${currentPage === i + 1 ? "bg-text text-primary ": "gray text-gray-900"}`}>
                                            {i + 1}
                                        </button>
                                    ))}

                                    {/* Next */}
                                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                                        className="px-3 py-1.5 text-xs  text-gray-900 gray disabled:opacity-40 transition-all">
                                        ›
                                    </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) }
                    
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