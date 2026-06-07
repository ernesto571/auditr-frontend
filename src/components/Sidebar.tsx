import { FileText, LayoutList, ListChevronsDownUp, User } from "lucide-react"
import { NavLink } from "react-router-dom"
import { useReportStore } from "../store/ReportStore"
import { useEffect } from "react"
import { useAuthStore } from "../store/AuthStore"

export default function Sidebar () {

    const { reports, savedReports, fetchAllReports, fetchSavedReports } = useReportStore()
    const { user } = useAuthStore()
    const first_name_ini = user?.name.split(" ")[0].slice(0,1)
    const last_name_ini = user?.name.split(" ")[1].slice(0,1)

    const reportLength = reports?.length ?? 0 ;
    const savedLength = savedReports?.length ?? 0;
    const sidebarLinks = [
        { id: "1", icon:LayoutList , label: "Dashboard", to:"/", end:true },
        { id: "2", icon: ListChevronsDownUp , label: "History", to:"/history", length:reportLength },
        { id: "3", icon: FileText , label: "Saved Reports", to:"/saved-reports", length: savedLength }
    ]

    
    useEffect(() => {
        if (user && !reports.length) fetchAllReports();
    }, [user]);
      
    useEffect(() => {
        if (user && !savedReports.length) fetchSavedReports();
    }, [user]);

    return (
        <aside className="black-bg h-screen py-4 w-full flex flex-col justify-between">
                <section className="flex flex-col">
                    {/* logo */}
                    <span className="flex gap-2 pl-3 border-b gray-bord pb-4 items-center">
                        <img src="https://res.cloudinary.com/dsljbxkfy/image/upload/v1778904040/Screenshot_2026-05-16_at_04-36-15_Auditr_umkkq7.png" alt="logo" />
                        <h4 className=" font-jet font-bold text-[#f2f0e8] text-[0.9rem]" >AUDITR</h4>
                    </span>

                    <div className="mt-8 px-3 flex flex-col">
                        <span className="font-jet flex gap-1 mb-2 gray-3 text-[0.7rem] font-semibold tracking-wider ml-2">// <p>WORKSPACE</p></span>
                        {sidebarLinks.slice(0,1).map( (s) => (
                            <NavLink to={s.to} end={s.end} key={s.id} className={({ isActive }: { isActive: boolean }) => `group flex py-2 px-2 mb-1 justify-between items-center  ${isActive ? "bg-cream black" : "gray-1 hover:border-[#2a2a27] hover:text-[#f2f0e8] hover:border-[0.5px] hover:bg-[#1d1d1a] ease-in-out transform"}`} >
                                {({ isActive }: { isActive: boolean }) => (
                                    <div className="gap-3 flex items-center">
                                        <s.icon size={15}  className={isActive ? "" : "gray-1 group-hover:text-[#f2f0e8]"}/>
                                        <h5 className="font-dm text-[0.9rem] truncate">{s.label}</h5> 
                                    </div>
                                )}
                            </NavLink>
                        ))}

                        {sidebarLinks.slice(1).map( (s) => (
                            <NavLink to={s.to} end={s.end} key={s.id} className={({ isActive }: { isActive: boolean }) => `group flex py-2 px-2 mb-1 justify-between items-center  ${isActive ? "bg-cream black" : "gray-1 hover:border-[#2a2a27] hover:text-[#f2f0e8] hover:border-[0.5px] hover:bg-[#1d1d1a] ease-in-out transform"}`} >
                                {({ isActive }: { isActive: boolean }) => (
                                    <>
                                        <div className="gap-3 flex items-center">
                                            <s.icon size={15}  className={isActive ? "" : "gray-1 group-hover:text-[#f2f0e8]"}/>
                                            <h5 className="font-dm text-[0.9rem] truncate">{s.label}</h5> 
                                        </div>
                                        <p className="text-[0.60rem] px-1.5 py-[1px] border gray-bord group-hover:border-[rgba(242,240,232,0.21)] " >{s.length} </p>
                                    </>
                                )}
                            </NavLink>
                        ))}

                        <span className="font-jet flex gap-1 mb-2 gray-3 text-[0.7rem] font-semibold tracking-wider ml-2 mt-4">// <p>ACCOUNT</p></span>
                        <NavLink to={"/profile"} className={({ isActive }: { isActive: boolean }) => `group flex py-2 pl-2 mb-1 gap-3 items-center  ${isActive ? "bg-cream black" : "gray-1 hover:border-[#2a2a27] hover:text-[#f2f0e8] hover:border-[0.5px] hover:bg-[#1d1d1a] ease-in-out transform"}`} >
                            {({ isActive }: { isActive: boolean }) => (
                                <>
                                    <User size={15}  className={isActive ? "" : "gray-1 group-hover:text-[#f2f0e8]"}/>
                                    <h5 className="font-dm text-[0.9rem] ">Profile</h5>
                                </>
                            )}
                        </NavLink>

                    </div>
                </section>
                
                { user && (
                    <section className=" border-t gray-bord pt-4 px-3" >
                        <div className="flex items-center gap-3 py-2 px-2 border gray-bord w-full" >
                            <p className="text-[0.7rem] white font-semibold font-dm py-1.5 px-2 bg-orange" >{first_name_ini}{last_name_ini}</p>
                            <div className="flex flex-col truncate gap-0.5">
                                <h4 className="text-xs white font-dm">{user.name.split(" ")[0]} {last_name_ini}. </h4>
                                <p className="text-[0.65rem] tracking-wide gray-1 ml-0">FREE PLAN</p>
                            </div>
                        </div>

                    </section>
                ) }
        </aside>
    )
}