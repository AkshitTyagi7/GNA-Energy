import React from "react";
import DataAnalyticsImage from './Login.png'
import { ReactComponent as Logo } from '../../logo.svg';
import { ReactComponent as User } from './UserIcon.svg';
import { buildHttpReq, buildUrl } from "../../common";
import { getLoggedIn, getUser, isLoggedIn, setAccessToken, setLoggedIn, setUser } from "../Protected";
import Loading from "../../components/Loading";
import swal from "sweetalert";


export function LoginPage() {
    const [otpSent, setOtpSent] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [email, setEmail] = React.useState<string>("");
    let [otp, setOtp] = React.useState<number>();




    return (

        <html>
            {
                loading &&
                <Loading />
            }

            {<div className="lg:flex">
                <div className="lg:w-1/3 xl:max-w-screen-sm">
                    <div className="py-12 bg-indigo-100 lg:bg-white flex justify-center lg:justify-start lg:px-12">
                        <div className="cursor-pointer flex items-center">
                            <div>
                                <Logo />
                            </div>
                        </div>
                    </div>
                    <div className="mt-10 px-12 sm:px-14 md:px-14 lg:px-12 2xl:mt-20 xl:px-15 xl:max-w-2xl">
                        <h2 className="text-center text-4xl text-slate-800 font-display font-semibold lg:text-left 2xl:text-5xl
                            xl:text-bold">Sign in</h2>
                        <div className="mt-8 2xl:mt:12">
                       { !isLoggedIn() ? <div>   <form onSubmit={
                                handleFormSubmit
                            }>
                                <div>
                                    <div className="text-sm font-bold text-gray-700 tracking-wide">Email Address</div>
                                    <input

                                        className="w-full bg-transparent text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-orange-500" required={true} type="email" placeholder="" onChange={
                                            (e) => {
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
                                Don't have an account ? <a className="cursor-pointer text-orange-500 hover:text-orange-600"
                                onClick={()=>{
                                    swal("","Please write to info@gna.energy to register for this platform.","warning")
                                }}
                                >Sign up</a>
                            </div> </div>
                            :
                           
                       
                                <><div className="w-full flex mt-6 bg-gray-300 h-24 rounded-lg flex p-1 pt-3 space-x-0">
                                    <div className="text-xl font-bold text-gray-700 tracking-wide text-start h-full align-center flex">
                                        <User  />
                                    </div>
                                    <div className="userDetail pt-1">
                                        <div className="text-lg font-bold text-gray-700 tracking-wide text-center">
                                            You are already logged in as
                                        </div>
                                        <div className="text-slate-500 mt-1 mb-1">
                                            {getUser().email ?? "User"}

                                        </div>

                                    </div>


                                </div>
                                <div className="flex space-x-8">
                                    <button className="bg-gray-300 text-slate-600 p-4 w-full rounded-full tracking-wide
                                        font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-slate-300
                                        shadow-lg mt-6 2xl:mt-10"
                                        onClick={
                                            () => {
                                                setLoggedIn(false);
                                                window.location.href = "/dashboard";
                                            }
                                        }
                                    >
                                        Sign out
                                    </button>
                                    <button className="bg-primary text-gray-100 p-4 w-full rounded-full tracking-wide
                                        font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-orange-600
                                        shadow-lg mt-6 2xl:mt-10"
                                        onClick={
                                            async() => {
                                                setLoading(true);
                                              const res = await  buildHttpReq({
                                                    endpoint: "verify_token",
                                                    method: "POST",
                                                    body: {
                                                        token: getUser().accessToken
                                                    }
                                                
                                                })
                                                if(res.status === true){
                                                    setLoading(false);
                                                    window.location.href = "/dashboard";
                                                }
                                                else{
                                                    setLoggedIn(false);
                                                    setLoading(false);
                                                    swal("Session Expired", "Please sign in again.", "warning");
                                                }
                                            
                                            }
                                        }
                                    >Sign in</button>


                                    </div>
                                    </>
                            }
                            {otpSent &&
                                <div className="mt-12">
                                    <div className="text-xl font-bold text-gray-700 tracking-wide text-center">
                                        Enter OTP
                                    </div>
                                    <div className="text-slate-400 text-center mt-2 mb-1">
                                        A 5 digit OTP has been sent to your email address
                                    </div>
                                    <OtpInput fieldNumber={5}
                                    
                                    onFilled={(e: number) => {
                                        console.log("OTP Filled");
                                        console.log(e);
                                        handleOtpSubmit();
                                    }}
                                    onChange={(e: number) => {

                                        otp = e

                                        console.log(otp);
                                        console.log(e);
                                    }} />
                                    <button className="bg-primary text-gray-100 p-4 w-full rounded-full tracking-wide
                                        font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-orange-600
                                        shadow-lg mt-6 2xl:mt-10"
                                        onClick={
                                            () => handleOtpSubmit()
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
                        <h1 className="mb-10 primary text-4xl text-slate-600 font-display font-semibold">GNA ENERGY <br></br><div className="mb-10 primary text-3xl text-slate-600 font-display font-semibold"> DATA &  ANALYTICS CAPABILITY CENTER (GDACC)</div> </h1>
                        <div className="transform duration-200 hover:scale-110 cursor-pointer flex justify-center px-20">
                            <img src={DataAnalyticsImage} height={"200px"} />
                        </div>
                    </div>

                </div>
            </div>}

        </html>


    )

    async function handleFormSubmit(e: any) {
try{
        e.preventDefault();
        const url = buildUrl("/get_otp");
        setLoading(true);
        const response = await buildHttpReq({
            endpoint: "get_otp",
            method: "POST",
            body: {
                email: email
            }
        });

        //  if(response.status === 200){
        //     console.log
        console.log(response);
        if (response.status === true) {
            setOtpSent(true);
        }
        else if (response.status === false) {
            swal("", response.message, "warning");
        }
        setLoading(false);}
        catch(e){
            setLoading(false);
           swal("Something went wrong", "Please try again later.", "warning");
        }
        //  }
        // else{
        //     alert("Something went wrong, Please try again later");
        // }
    }

    async function handleOtpSubmit() {
        console.log("Form submitted");
        if (otp?.toString().length !== 5) {
            // alert("Please enter a valid otp");
            swal("Invalid Otp", "Please enter a valid otp.", "warning");
            return;
        }
        setLoading(true);

        const response = await buildHttpReq({
            endpoint: "verify_otp",
            method: "POST",
            body: {
                email: email,
                otp: otp
            }
        });
        //  if(response.status === 200){
        console.log(response);
        if (response.status === true) {
            setLoading(false);
           
            setAccessToken(response.token);
            setUser({
                email: email,
                accessToken: response.token
            
            })
            setLoggedIn(true);
            window.location.href = "/dashboard";

        }
        else {
            setLoading(false);
            // alert("The otp you entered is incorrect. Please try again");
            swal("Incorrect Otp", "The otp you entered is incorrect. Please try again.", "warning");

        }

    }



    function OtpInput({ fieldNumber, onChange, onFilled }: { fieldNumber: number, onChange: any, onFilled?: any }) {
        let fieldNumberList: number[] = [];
        for (let i = 0; i < fieldNumber; i++) {
            fieldNumberList.push(i);
        }
        let inputList: any[] = [];
        function handleOnChange(e: number, index: number) {
            if (inputList[index] === null) {
                onChange(inputList.join(""));
                return;
            }
            inputList[index] = e;
            onChange(
                parseInt(inputList.join("")));
            if(inputList.join("").length===5){
                onFilled(
                    parseInt(inputList.join(""))
                );
            }
        }

        return (
            <div className="flex flex-row justify-center text-center px-2 mt-2">
                {
                    fieldNumberList.map((item, index) => {
                        return (
                            <input className="m-2 lg:h-10 lg:w-10 xl:h-12 xl:w-12 text-center text-lg py-2 border focus:outline-none focus:border-orange-500 rounded " type="number" id={`otpInput-${item.toString()}`} key={`otpInput=${item.toString()}`} maxLength={1} onChange={
                                (e) => {
                                    if (e.target.value.length === 1) {
                                        if (item < fieldNumber - 1) {
                                            document.getElementById(`otpInput-${(item + 1).toString()}`)?.focus();
                                        }
                                    }
                                    handleOnChange(parseInt(e.target.value), index);

                                }
                            } />
                        )
                    })

                }


            </div>
        )

    }


}