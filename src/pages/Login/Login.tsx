import React from "react";
import DataAnalyticsImage from './Login.png'
import {ReactComponent as Logo} from '../../logo.svg';


export function LoginPage() {
    const [otpSent, setOtpSent] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [email, setEmail] = React.useState<string>("");
    const [otp, setOtp] = React.useState<string>("");
    
    return (
        <html>
            {
                loading &&
                <div className="w-full h-full bg-primary-100 fixed top-0 right-0 h-screen w-screen z-50 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-5 border-white"></div>
                </div>
            }

            <div className="lg:flex">
                <div className="lg:w-1/3 xl:max-w-screen-sm">
                    <div className="py-12 bg-indigo-100 lg:bg-white flex justify-center lg:justify-start lg:px-12">
                        <div className="cursor-pointer flex items-center">
                            <div>
<Logo />
                            </div>
                            <div className="text-2xl text-black-800 tracking-wide ml-3 font-semibold">GNA Energy</div>
                        </div>
                    </div>
                    <div className="mt-10 px-12 sm:px-14 md:px-14 lg:px-12 2xl:mt-20 xl:px-15 xl:max-w-2xl">
                        <h2 className="text-center text-4xl text-slate-800 font-display font-semibold lg:text-left xl:text-5xl
                            xl:text-bold">Log in</h2>
                        <div className="mt-8 2xl:mt:12">
                            <form onSubmit={
                                handleFormSubmit
                            }>
                                <div>
                                    <div className="text-sm font-bold text-gray-700 tracking-wide">Email Address</div>
                                    <input 
                                    
                                    className="w-full bg-transparent text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-orange-500" required={true} type="email" placeholder="mike@gmail.com" onChange={
                                        (e)=>{
                                            setEmail(e.target.value);
                                        }
                                    
                                    } />
                                </div>
                                {/* <div className="mt-8">
                                    <div className="flex justify-between items-center">
                                        <div className="text-sm font-bold text-gray-700 tracking-wide">
                                            Password
                                        </div>
                                        <div>
                                            <a className="text-xs font-display font-semibold text-indigo-600 hover:text-indigo-800
                                                cursor-pointer">
                                                Forgot Password?
                                            </a>
                                        </div>
                                    </div>
                                    <input className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500" type="" placeholder="Enter your password" />
                                </div> */}
                                <div className="mt-6 2xl:mt-10">
                                    <button className="bg-primary text-gray-100 p-4 w-full rounded-full tracking-wide
                                        font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-orange-600
                                        shadow-lg"
                                 
                                        >
                                        Get OTP
                                    </button>
                                </div>
                            </form>
                            <div className="mt-6 2xl:mt-10 text-sm font-display font-semibold text-gray-700 text-center">
                                Don't have an account ? <a className="cursor-pointer text-orange-500 hover:text-orange-600">Sign up</a>
                            </div>{otpSent &&
                            <div className="mt-12">
                                        <div className="text-xl font-bold text-gray-700 tracking-wide text-center">
                                            Enter OTP
                                        </div>
                                        <div className="text-slate-400 text-center mt-2 mb-1">
                                           A 6 digit OTP has been sent to your email address
                                        </div>
                            <OtpInput fieldNumber={6} onChange={(e: any) => {console.log(e.target.value)}} />
                            <button className="bg-primary text-gray-100 p-4 w-full rounded-full tracking-wide
                                        font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-orange-600
                                        shadow-lg mt-6 2xl:mt-10"
                                        onClick={
                                            ()=>{
                                                window.location.href="/dashboard";
                                            }
                                        }
                                        >
                                       Login
                                    </button>
                               
                            </div>}
                        </div>
                    </div>
                </div>
                <div className="hidden lg:flex items-center justify-center bg-primary-100 flex-1 h-screen">
                    <div className=" text-center">
                        <h1 className="mb-10 primary text-4xl text-slate-600 font-display font-semibold">GNA ENERGY DATA & <br></br> ANALYTICS CAPABILITY CENTRE (GDACC) </h1>
                        <div className="transform duration-200 hover:scale-110 cursor-pointer flex justify-center px-20">
                            <img src={DataAnalyticsImage} height={"200px"} />
                        </div>
                    </div>

                </div>
            </div>

        </html>


    )

    function handleFormSubmit(e: any) {
        e.preventDefault();
        console.log("Form submitted");
        setLoading(true);
        setTimeout(()=>{
            setOtpSent(true);
            setLoading(false);
        }, 2000);
    }

    function OtpInput({fieldNumber, onChange}:{fieldNumber: number, onChange: any}){
        let fieldNumberList: number[] = [];
        for(let i=0;i<fieldNumber;i++){
            fieldNumberList.push(i);
        }
        return(
            <div className="flex flex-row justify-center text-center px-2 mt-2">
                {
                    fieldNumberList.map((item)=>{
                        return(
                            <input className="m-2 lg:h-10 lg:w-10 xl:h-12 xl:w-12 text-center text-lg py-2 border focus:outline-none focus:border-orange-500 rounded " type="text" id={`otpInput-${item.toString()}`} maxLength={1} onChange={
                                (e)=>{
                                    if(e.target.value.length===1){
                                        if(item<fieldNumber-1){
                                            document.getElementById(`otpInput-${(item+1).toString()}`)?.focus();
                                        }
                                    }
                                    onChange(e);
                                }
                            } />
                        )
                    })
                    
                }

            </div>
        )
        
    }

    
}