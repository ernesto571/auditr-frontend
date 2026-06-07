import { useEffect } from "react"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import { useProfileStore } from "../store/ProfileStore"
import { useReportStore } from "../store/ReportStore"
import { formatDate } from "../lib/utils"
import toast from "react-hot-toast"
import { ChevronRight, Loader } from "lucide-react"
import { useAuthStore } from "../store/AuthStore"

const inputClass =  `w-full border bg-off mt-1 black-bord py-2  text-[0.8rem] pl-3 focus:border-[#ff3e00] focus:outline-none focus:bg-[#f2f0e8] black  `;

const ProfilePage = () => {

    const { profile, formData, setFormData, error, profileLoading, profileUpdating, profileDeleting, fetchProfile, updateProfile, deleteAccount } = useProfileStore()
    const { logout } = useAuthStore()
    const { reports, savedReports, fetchAllReports,fetchSavedReports} = useReportStore()
    const ini = `${profile?.first_name?.slice(0,1)}${profile?.last_name?.slice(0,1)}`

    const totalScore = reports?.reduce((acc, r) => acc + Number(r.overall_score), 0) ?? 0;
    const avgScore   = reports.length > 0 ? +(totalScore / reports.length).toFixed(1) : 0;

    const profInfo = [
        { title:"TOTAL AUDITS", value: reports?.length ?? 0 },
        { title:"SAVED REPORTS", value: savedReports?.length ?? 0  },
        { title:"AVG SCORE", value: avgScore },
        { title:"MEMBER SINCE", value: formatDate(profile?.created_at ?? "").split("at")[0] },
        { title:"LAST ACTIVE", value: formatDate(profile?.last_login ?? "").split("at")[0] }
    ]

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ [e.target.name]: e.target.value });
    };

    const handleProfUpdate = async () => {
        if (!formData.first_name?.trim()) return toast.error("First name is required.");
        if (!formData.last_name?.trim()) return toast.error("Last name is required.");
        try {
            
            await updateProfile(formData);
            if (error) {
                toast.error(error)
            }
        } catch (err) {
            console.error("Error in handleProfUpdate", err);
        }
    }

    const handleAccDelete = async () => {
        try {
          await deleteAccount();
          await logout();
          window.location.href = "/";
        } catch (err) {
          console.error("Error in handleAccDelete", err);
        }
    };

    useEffect(() => {
        fetchProfile()
    }, [])

    useEffect(() => {
        if (!reports){
            fetchAllReports()
        }
    }, [])

    useEffect(() => {
        if (!savedReports){
            fetchSavedReports()
        }
    }, [])
  return (
    <main className="main">
        <div className="sidebar">
            <Sidebar />
        </div>

        <div className="lg:col-span-5 w-screen md:w-full">
            <Topbar pageTitle="profile"/>
            <section className="content">
                {/* heading */}
                <div className="font-jet">
                    <h2 className="font-dm black text-[1.5rem] font-bold mt-0.5">Profile</h2>
                    <p className="gray-1 text-[0.7rem] mt-1">// account settings and billing</p>
                </div>

                { profileLoading && (
                    <div className="flex justify-center mt-20">
                        <Loader className="black animate-spin"/>
                    </div>
                ) }
                {/* content */}
                {profile && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 border black-bord mt-6" >
                        <section className="col-span-1 border-b lg:border-b-0 lg:border-r black-bord px-6 py-6" >
                            <div className="inline-flex border black-bord bg-orange py-4 px-5 font-dm white text-[1.3rem] font-semibold"> {ini} </div>
                            <h3 className="black font-dm font-semibold mt-3 text-[1.1rem]">{profile?.first_name} {profile?.last_name}</h3>
                            <p className="gray-1 text-xs mt-1 font-jet">{profile?.email}</p>
                            <p className="bg-off inline-flex text-[0.7rem] font-jet font-medium border black-bord px-3 py-1 mt-4">FREE PLAN</p>

                            {/* table */}
                            <div className="border black-bord mt-6 font-jet">
                                { profInfo.slice(0,1).map((p) => (
                                    <span key={p.title} className="flex justify-between gap-3 py-3 px-3">
                                        <p className="text-[0.7rem] tracking-wide font-medium gray-1 ">{p.title} </p>
                                        <p className="text-xs font-semibold black truncate">{p.value} </p>

                                    </span>
                                )) }
                                { profInfo.slice(1).map((p) => (
                                    <span key={p.title} className="flex justify-between gap-3 py-3 px-3 border-t border-[#dedbd0] ">
                                        <p className="text-[0.7rem] tracking-wide font-medium gray-1 ">{p.title} </p>
                                        <p className="text-xs black font-semibold truncate">{p.value} </p>

                                    </span>
                                )) }
                            </div>
                        </section>

                        <section className="col-span-2 px-6 py-6">
                            <span className="flex items-center gap-2 text-[0.7rem] gray-2 tracking-wider font-jet">
                                <p>ACCOUNT INFORMATION </p>
                                <div className="flex-grow border-t border-[#dfdcd3]"></div>
                            </span>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2 font-jet">
                                <span>
                                    <label className="text-[0.7rem] gray-1 font-medium tracking-wider " >FISRT NAME</label>
                                    <input onChange={handleChange} name="first_name" value={formData.first_name} type="text" placeholder={formData.first_name}  className={inputClass}/>
                                </span>

                                <span>
                                    <label className="text-[0.7rem] gray-1 font-medium tracking-wider" >LAST NAME</label>
                                    <input onChange={handleChange} name="last_name" value={formData.last_name} type="text" placeholder={formData.last_name} className={inputClass}/>
                                </span>

                            </div>

                            <button disabled={profileUpdating} onClick={handleProfUpdate} className="inline-flex items-center mt-1 gap-2 white bg-orange text-[0.7rem] font-jet py-2 px-4 disabled:cursor-not-allowed disabled:opacity-50">SAVE CHANGES <ChevronRight className="size-3" /></button>

                            <span className="mt-4 flex flex-col font-jet">
                                <label className="text-[0.7rem] gray-1 font-medium tracking-wider " >EMAIL ADDRESS</label>
                                <div className="w-full border bg-off mt-2 black-bord py-2  text-[0.8rem] pl-3  black  "> {profile?.email} </div> 
                            </span>

                            {/* danger */}
                            <span className="flex items-center gap-2 text-[0.7rem] gray-2 tracking-wider font-jet mt-7">
                                <p>DANGET ZONE </p>
                                <div className="flex-grow border-t border-[#dfdcd3]"></div>
                            </span>

                            {/* delete box */}
                            <div className="border border-[#b03221] py-4 px-3 lg:px-5 mt-4">
                                <p className="font-jet text-xs text-[#b03020]">// IRREVERSIBLE ACTION</p>
                                <span className="grid md:flex justify-between gap-3 items-center mt-2">
                                    <p className="gray-1 text-[0.8rem] font-dm">Permanently delete your account and all audit data. This cannot be undone</p>
                                    <button disabled={profileDeleting} onClick={handleAccDelete} className="truncate py-2 px-4 text-[0.7rem] font-jet white bg-[#8a2015] border border-[#8a2015] disabled:cursor-not-allowed disabled:opacity-50">DELETE ACCOUNT</button>
                                </span>
                            </div>

                        </section>

                    </div>
                )}
                
            </section>
        </div>
    </main>
  )
}

export default ProfilePage