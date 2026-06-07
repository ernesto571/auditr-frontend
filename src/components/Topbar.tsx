import { ArrowRight, LogOut, Menu } from "lucide-react";
import { useState } from "react";
import AuthModal from "./AuthModal";
import { useAuthStore } from "../store/AuthStore";
import { NavLink } from "react-router-dom";
import MenuSidebar from "./MenuSidebar";

interface TopbarProps {
    pageTitle: string;
}

export default function Topbar ({pageTitle}: TopbarProps) {
    const [selectedAuthLabel, setSelectedAuthLabel] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, logout, isLoading} = useAuthStore()


    return (
        <div className="sticky z-50 py-2 px-2 md:px-6 border-b black-bord w-full bg-cream">
            <div className="flex items-center justify-between w-full">
                <span className="flex gap-1 items-center font-jet text-[0.8rem] gray-1">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden py-1 px-2 border black-bord">
                        <Menu className="size-3 black" />
                    </button>
                    <p>auditr</p>
                    <p>/</p>
                    <p className="black">{pageTitle} </p>
                </span>

                { !user ? (
                    <span className="flex gap-2 text-[0.8rem] font-jet items-center tracking-tight">
                        <button onClick={() => setSelectedAuthLabel("sign-in")} className="px-3 py-1.5 black-bord border hover:bg-[#0a0a08] hover:text-white transition-colors ease-in-out duration-75 whitespace-nowrap">Sign in</button>
                        <button onClick={() => setSelectedAuthLabel("sign-up")} className="hidden md:flex gap-2 bg-orange items-center px-3 py-1.5 text-white transition-all ease-in-out duration-75 whitespace-nowrap" >Get started <ArrowRight className="size-3" /> </button>
                    </span>    
                ) : (
                    <div className="flex gap-3 text-[0.8rem] font-jet items-center ">
                        <NavLink className="flex gap-2 bg-orange items-center px-3 py-1.5 text-white transition-all ease-in-out duration-75 whitespace-nowrap" to="/profile">Account</NavLink>
                        <button onClick={logout} disabled={isLoading} title="Sign Out" className="flex py-1.5 px-3 black-bg white disabled:cursor-not-allowed disabled:opacity-50"><LogOut size={15} /></button>
                    </div>
                ) }
                
            </div>
            <MenuSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            { selectedAuthLabel && (
                <AuthModal 
                    onClose={() => setSelectedAuthLabel("")}
                    label={selectedAuthLabel}
                />
            ) }
        </div>
    )
}