import "./Login2.css";
import { ReactComponent as Logo } from "../../icons/Logo.svg";
import loginImage from "./login4.png";
import swal from "sweetalert";
import React from "react";
import { buildUrl, buildHttpReq } from "../../common";
import { setAccessToken, setUser, setLoggedIn } from "../Protected";
import Loading from "../../components/Loading";
import OTPInput from "react-otp-input";


export function Login2() {
  const [otpSent, setOtpSent] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [email, setEmail] = React.useState<string>("");
  let [otp, setOtp] = React.useState<number>();

  return (
    <div className="login-container">
      {loading && <Loading />}
      <div className="left-container">
        <Logo />
        {!otpSent ? (
          <div className="login-box">
            <div className="login-box-header">
              <h1>Sign in</h1>
              <p>Sign in to Continue to your Account</p>
            </div>
            <form className="login-form" onSubmit={handleFormSubmit}>
              <label>Email</label>
              <input
                type="text"
                placeholder="user@example.com"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <button type="submit" value="Sign in">
                Sign in
              </button>
            </form>
            <div
              className="login-box-footer"
              onClick={() => {
                swal(
                  "",
                  "Please write to info@gna.energy to register for this platform.",
                  "warning"
                );
              }}
            >
              Don't Have an Account? <span>Register</span>
            </div>
          </div>
        ) : (
          // For Otp Verification
          <div className="login-box">
            <div className="login-box-header">
              <h1>OTP</h1>
              <p>{email}</p>
            </div>
            <form className="login-form">
              <label>Enter the OTP</label>
              <OTPInput
              inputType="number"
              
      value={otp?.toString()}
      onChange={(value) => {
        console.log(value);
        setOtp(parseInt(value));
        otp = parseInt(value);
        handleOtpSubmit();
      }
      }
      numInputs={5}
      renderSeparator={<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>}
      renderInput={(props) => <input {...props} />}
    />
              <button type="submit" value="Sign in">
                Sign in
              </button>
            </form>
            <div
              className="login-box-footer"
              onClick={() => {
                setOtpSent(false);
              }}
            >
              Go Back
            </div>
          </div>
        )}
        <div className="copyright">
          © 2024, GNA Energy Private Limited All Rights Reserved
        </div>
      </div>
      <div className="right-container">
        <div className="login-heading">
          <span>GNA ENERGY </span>
          <h2>DATA & ANALYTICS CAPABILITY CENTER (GDACC)</h2>
        </div>
        {/* <LoginIcons /> */}

        {/* <LoginIcons className="login-image" /> */}
        <img src={loginImage} alt="loginImage" className="login-image" />
      </div>
    </div>
  );

  async function handleFormSubmit(e: any) {
    try {
      e.preventDefault();
      // if (otp?.toString().length !== 5) {
      //   return;
      // }
      if(otpSent){
        handleOtpSubmit();
        return;
        
      }
      const url = buildUrl("/get_otp");
      setLoading(true);
      const response = await buildHttpReq({
        endpoint: "get_otp",
        method: "POST",
        body: {
          email: email,
        },
      });

      //  if(response.status === 200){
      //     console.log
      console.log(response);
      if (response.status === true) {
        setOtpSent(true);
      } else if (response.status === false) {
        swal("", response.message, "warning");
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      swal("Please Try Again", ".", "warning");
    }
    //  }
    // else{
    //     alert("Please Try Again, ");
    // }
  }

  async function handleOtpSubmit() {
    console.log("Form submitted");
    if (otp?.toString().length !== 5) {
      // alert("Please enter a valid otp");
      // swal("Invalid Otp", "Please enter a valid otp.", "warning");
      return;
    }
    setLoading(true);

    const response = await buildHttpReq({
      endpoint: "verify_otp",
      method: "POST",
      body: {
        email: email,
        otp: otp,
      },
    });
    //  if(response.status === 200){
    console.log(response);
    if (response.status === true) {
      setLoading(false);

      setAccessToken(response.token);
      setUser({
        email: email,
        accessToken: response.token,
      });
      setLoggedIn(true);
      window.location.href = "/dashboard";
    } else {
      setLoading(false);
      // alert("The otp you entered is incorrect. Please try again");
      swal(
        "Incorrect Otp",
        "The otp you entered is incorrect. Please try again.",
        "warning"
      );
    }
  }
}
// function OtpInput({
//   fieldNumber,
//   onChange,
//   onFilled,
// }: {
//   fieldNumber: number;
//   onChange: any;
//   onFilled?: any;
// }) {
//   let fieldNumberList: number[] = [];
//   for (let i = 0; i < fieldNumber; i++) {
//     fieldNumberList.push(i);
//   }
//   let inputList: any[] = [];
//   function handleOnChange(e: number, index: number) {
//     if (inputList[index] === null) {
//       onChange(inputList.join(""));
//       return;
//     }
//     inputList[index] = e;
//     onChange(parseInt(inputList.join("")));
//     if (inputList.join("").length === 5) {
//       onFilled(parseInt(inputList.join("")));
//     }
//   }

//   return (
//     <div className="otp-input">
//       {fieldNumberList.map((item, index) => {
//         return (
//           <input
//             className="otp-input-fields"
//             type="number"
//             id={`otpInput-${item.toString()}`}
//             key={`otpInput=${item.toString()}`}
//             maxLength={1}
//             onChange={(e) => {
//               if (e.target.value.length === 1) {
//                 if (item < fieldNumber - 1) {
//                   document
//                     .getElementById(`otpInput-${(item + 1).toString()}`)
//                     ?.focus();
//                 }
//               }
//               handleOnChange(parseInt(e.target.value), index);
//             }}
//           />
//         );
//       })}
//     </div>
//   );
// }
