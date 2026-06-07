import { ArrowRight, Eye, EyeOff, X } from "lucide-react";
import { useState } from "react"
import { useAuthStore } from "../store/AuthStore";
import toast from "react-hot-toast";

interface modalProps {
    label: string
    onClose: () => void;
}
export default function AuthModal ( {label, onClose} : modalProps ) {
    const [showPassword, setShowPassword] = useState(false);
    const { loginWithGoogle, isGoogleLoading, isLoading, formData, setFormData, login, signup, error } = useAuthStore()
    const [ activeTab, setActiveTab ] = useState(label)
    const tabs = [
        { id:"sign-in", label:"SIGN IN" },
        { id:"sign-up", label:"SIGN UP" }
    ]

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ [e.target.name]: e.target.value });
    };

    const handleSignup = async () => {
        if (!formData.first_name?.trim()) return toast.error("First name is required.");
        if (!formData.last_name?.trim()) return toast.error("Last name is required.");
        if (!formData.email?.trim()) return toast.error("Email is required.");
        if (!formData.password) return toast.error("Password is required.");
        if (formData.password.length < 8) return toast.error("Password must be at least 8 characters.");
        try {
            
            await signup(formData);
            if (error) {
                toast.error(error)
            } else {
                onClose()
            }
        } catch (err) {
            console.error("Error in handleSignup", err);
        }

    };

    const handleLogin = async () => {
        if (!formData.email?.trim()) return toast.error("Email is required.");
        if (!formData.password) return toast.error("Password is required.");
        try {
            
            await login(formData);
            if (error) {
                toast.error(error)
            } else {
                onClose()
            }
        } catch (err) {
            console.error("Error in handlegn", err);
        }

    };

    const inputClass =  `w-full border bg-off mt-1 black-bord py-2.5  text-[0.8rem] pl-3 focus:border-[#ff3e00] focus:outline-none focus:bg-[#f2f0e8] gray-1 focus:text-[#0a0a08]`;

    return(
        <main className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 ">
            <div className="shadow-2xl w-[95%] md:w-[60%] lg:w-[32%] mx-auto">
                {/* heading */}
                <div className="flex items-center justify-between p-4 font-jet black-bg tracking-wide font-semibold">
                    <span className="flex gap-1 white text-[0.9rem]">
                        <p>AUDITR</p>
                        <p>//</p>
                        <p>ACCESS</p>
                    </span>
                    <button onClick={onClose}
                    className="hover:bg-[#1d1d1a] p-1.5 border gray-bord hover:border-[#2a2a27] gray-2 transition">
                        <X size={13} />
                    </button>
                </div>

                {/* body */}
                <div className="border-x-[3px] border-b-[3px] black-bord bg-cream">
                    <section className="py-4 px-4 w-full">
                        <span className="grid grid-cols-2">
                            { tabs.map((t) => (
                                <button key={t.id} onClick={() => {setActiveTab(t.id)}} className={`py-1.5 text-[0.8rem] font-jet font-semibold ${activeTab === t.id ? "black-bg white" : "bg-cream border black-bord black"}`} >{t.label} </button>
                            )) }
                        </span>

                        <button  onClick={loginWithGoogle} disabled={isGoogleLoading} type="button" className="flex gap-3 justify-center items-center mt-4 font-bold w-full hover:bg-gray-200 text-[0.7rem] tracking-wide font-jet border black-bord bg-off py-2.5 disabled:cursor-not-allowed disabled:opacity-50 transition ease-in-out transform">
                            <img src="https://res.cloudinary.com/dsljbxkfy/image/upload/v1775685859/google-color-svgrepo-com_howgro.svg" alt="Google logo" className="w-[15px]" />
                            {isGoogleLoading ? "REDIRECTING..." : "CONTINUE WITH GOOGLE"}
                        </button>

                        <span className="flex items-center mt-4 text-[0.65rem] gray-2 tracking-wider font-semibold font-jet">
                            <div className="flex-grow border-t border-[#dfdcd3]"></div>
                            <p className="px-3">OR </p>
                            <div className="flex-grow border-t border-[#dfdcd3]"></div>
                        </span>

                        {activeTab === "sign-in" && (  
                            <div className="font-jet my-2">
                                <span>
                                    <label className="text-[0.7rem] gray-1 font-medium tracking-wider" >EMAIL</label>
                                    <input name="email" onChange={handleChange} value={formData.email} type="email" placeholder="you@domain.com" className={inputClass}/>
                                </span>

                                <span className="flex flex-col mt-4">
                                    <label className="text-[0.7rem] gray-1 font-medium tracking-wider" >PASSWORD</label>
                                    <div className=" relative">
                                        <input name="password" onChange={handleChange} value={formData.password} type={showPassword ? "text" : "password"} placeholder="*********" className={inputClass}/>
                                        <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-3 top-[55%] -translate-y-1/2 text-gray-400 hover:text-gray-700">
                                            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                        </button>
                                    </div>
                                </span>

                                <button onClick={handleLogin} disabled={isLoading} className="flex gap-3 items-center justify-center mt-4 tracking-wider whitespace-nowrap w-full py-2.5 bg-orange white text-[0.8rem] font-semibold disabled:cursor-not-allowed disabled:opacity-50">SIGN IN <ArrowRight className="size-3" /></button>
                                
                            </div>
                        )}

                        {activeTab === "sign-up" && (  
                            <div className="flex flex-col gap-2 my-2">
                                <span>
                                    <label className="text-[0.7rem] gray-1 font-medium tracking-wider" >FISRT NAME</label>
                                    <input onChange={handleChange} name="first_name" value={formData.first_name} type="text" placeholder="Emmanuel" className={inputClass}/>
                                </span>

                                <span>
                                    <label className="text-[0.7rem] gray-1 font-medium tracking-wider" >LAST NAME</label>
                                    <input onChange={handleChange} name="last_name" value={formData.last_name} type="text" placeholder="Adesemoye" className={inputClass}/>
                                </span>

                                <span>
                                    <label className="text-[0.7rem] gray-1 font-medium tracking-wider" >EMAIL</label>
                                    <input name="email" onChange={handleChange} value={formData.email} type="email" placeholder="you@domain.com" className={inputClass}/>
                                </span>

                                <span>
                                    <label className="text-[0.7rem] gray-1 font-medium tracking-wider" >PASSWORD</label>
                                    <div className=" relative">
                                        <input name="password" onChange={handleChange} value={formData.password} type={showPassword ? "text" : "password"} placeholder="*********" className={inputClass}/>
                                        <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-3 top-[55%] -translate-y-1/2 text-gray-400 hover:text-gray-700">
                                            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                        </button>
                                    </div>
                                </span>

                                <button onClick={handleSignup} disabled={isLoading} className="flex items-center justify-center mt-2 tracking-wider whitespace-nowrap w-full py-2.5 bg-orange white text-[0.8rem] font-semibold  disabled:cursor-not-allowed disabled:opacity-50"> { !isLoading ? (
                                    <span className="flex gap-3 items-center">
                                        <p>CREATE ACCOUNT</p>
                                        <ArrowRight className="size-3" />
                                    </span>
                                ) :"CREATING ACCOUNT"} </button>
                                
                            </div>
                        )}

                    </section>

                    <p className="py-2.5 px-2 lg:px-0 font-semibold font-jet flex w-full justify-center border-t black-bord text-[0.7rem] gray-1 bg-off">By continuing you agree to Auditr's Terms and Privacy Policy</p>

                </div>
            </div>
        </main>
    )
}