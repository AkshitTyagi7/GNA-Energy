import React from "react";
import { Navigate, Route } from "react-router-dom";
import { buildHttpReq } from "../common";
import Loading from "../components/Loading";
import swal from "sweetalert";
interface User {
    email: string,
    accessToken: string
}
export const Protected = (
    { children }: any,

) => {

    console.log("Protected");
    const loggedIn = JSON.parse(localStorage.getItem('loggedIn')!);
    //sleep for 2 seconds
    if (loggedIn) {
        console.log("loggedIn", loggedIn);
        console.log("-------------------------");
        return children;
    } else {
        return <Navigate to="/login" />;
    }
}



export const isLoggedIn = () => {
    const loggedIn = localStorage.getItem('loggedIn')!;
    if (loggedIn === 'true') {
        return true;
    } else {
        return false; Navigate({
            to: '/dashboard',
        });
    }
}

export const getAccessToken = () => {
    const token = localStorage.getItem('token');
    return token;
}

export const getLoggedIn = (): boolean => {
    const loggedIn = localStorage.getItem('loggedIn');
    return loggedIn === 'true';
}

export const setAccessToken = (token: string) => {
    localStorage.setItem('token', token);
}

export const setLoggedIn = (loggedIn: boolean) => {
    localStorage.setItem('loggedIn', JSON.stringify(loggedIn));
}

export const setUser = ({
    email,
    accessToken
}: { email: string, accessToken: string }) => {
    localStorage.setItem('email', email);
    localStorage.setItem('accessToken', accessToken);
    return {
        email: email,
        accessToken: accessToken
    }
}

export const getUser = (): User => {
    const email = localStorage.getItem('email')!;
    const accessToken = localStorage.getItem('accessToken')!;
    return {
        email: email,
        accessToken: accessToken
    }
}


export function ProtectedPage({ children, pageId }: { children: any, pageId: string }) {
    const [loggedIn, setLoggedIn] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [access, setAccess] = React.useState(true);
    React.useEffect(() => {
        CheckAccess()

    }, []);
    return (
        <div style={{
            width: '100%',
            height: '100%',
        }}>
            {
                loading ? <Loading />: access ? children : <Navigate to="/dashboard" />
            }
        </div>
    )

    async function CheckAccess(): Promise<boolean> {
        // sleep for 5 second

        try{
        const res =await buildHttpReq({
            endpoint: '/verify_access',
            method: 'POST',
            body:{
                page: pageId.replace("/",""),
                email: getUser().email,
                token: getUser().accessToken
            }

        })

        setLoading(false);
        if (res.status === true) {

            setAccess(true);
            return true;
        }
        else {

            // show popup
            setAccess(false);
            swal("Access Denied","You currently don't have access to this page. Please send a mail to info@gna.energy to request the access.","error" );
            return false;
        }

    }     catch(err){
        swal("Oops !","Something went wrong. If the issue presist please send a mail to info@gna.energy","error" )


        return false;
    }}

}

