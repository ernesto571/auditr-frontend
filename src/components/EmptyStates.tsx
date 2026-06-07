import { useNavigate } from "react-router-dom";
import { Clock, Bookmark } from "lucide-react";

export const HistoryEmptyState = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 mt-16 border border-[#0a0a08]">
      <div className="border border-[#0a0a08] p-4 mb-6 bg-[#eae8e0]">
        <Clock size={28} strokeWidth={1.5} className="text-[#0a0a08]" />
      </div>
      <p className="font-jet text-[10px] tracking-[0.15em] text-[#9b9890] uppercase mb-2">
        // NO AUDITS YET
      </p>
      <h3 className="font-sans text-[1.15rem] font-semibold text-[#0a0a08] mb-2 text-center">
        Your audit history is empty.
      </h3>
      <p className="font-sans text-[0.85rem] text-[#6b6960] text-center max-w-[340px] mb-8 leading-relaxed">
        Every audit you run is automatically saved here — whether or not you star it. Run your first audit to get started.
      </p>
      <button
        onClick={() => navigate("/")}
        className="bg-[#ff3e00] text-[#f2f0e8] font-jet text-[0.78rem] tracking-widest uppercase px-5 py-2 hover:bg-[#0a0a08] transition-colors duration-150"
      >
        → RUN AUDIT
      </button>
    </div>
  );
};

export const SavedReportsEmptyState = () => {
  const navigate = useNavigate();
  return (
    <div className=" mt-8 flex flex-col items-center justify-center py-14 px-6 border border-[#0a0a08]">
      <div className="border border-[#0a0a08] p-4 mb-6 bg-[#eae8e0]">
        <Bookmark size={28} strokeWidth={1.5} className="text-[#0a0a08]" />
      </div>
      <p className="font-jet text-[10px] tracking-[0.15em] text-[#9b9890] uppercase mb-2">
        // NO SAVED REPORTS
      </p>
      <h3 className="font-sans text-[1.15rem] font-semibold text-[#0a0a08] mb-2 text-center">
        Nothing saved yet.
      </h3>
      <p className="font-sans text-[0.85rem] text-[#6b6960] text-center max-w-[340px] mb-8 leading-relaxed">
        Star any audit from your history or dashboard to pin it here for quick reference.
      </p>
      <button
        onClick={() => navigate("/history")}
        className="border border-[#0a0a08] text-[#0a0a08] font-jet text-[0.78rem] tracking-widest uppercase px-5 py-2 hover:bg-[#0a0a08] hover:text-[#f2f0e8] transition-colors duration-150"
      >
        → VIEW HISTORY
      </button>
    </div>
  );
};