import React from "react";
import { Navigate, Route } from "react-router-dom";

export const Protected = (
   {children}: any,

) => {

    console.log("Protected");
    const loggedIn = JSON.parse(localStorage.getItem('loggedIn')!);
    //sleep for 2 seconds
    if (!loggedIn) {
        console.log("loggedIn", loggedIn);
        console.log("-------------------------");
        return children;
    } else {
        return <Navigate to="/login" />;
    }
}



export const isLoggedIn = () => {
    const loggedIn = localStorage.getItem('loggedIn')!;
    if (loggedIn==='true') {
        return true;
    } else {
        return false;           Navigate({
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
    return loggedIn==='true';
}

export const setAccessToken = (token: string) => {
    localStorage.setItem('token', token);
}

export const setLoggedIn = (loggedIn: boolean) => {
    localStorage.setItem('loggedIn', JSON.stringify(loggedIn));
}


export function ProtectedPage({children,pageId}: { children: any, pageId: string }) {
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
                loading ? <div>loading...</div> : access ? children : <Navigate to="/dashboard" />
            }
        </div>
    )

    async function CheckAccess(): Promise<boolean> {
        // sleep for 5 second
        await new Promise(resolve => setTimeout(resolve, 0));

        setLoading(false);
        if(access===true){
            return true;
        }
        else {

            // show popup
            alert("You currently don't have access to this page. Please send a mail to info@gna.energy ");
 
            return false;
        }
        return true;
        // const token = localStorage.getItem('token');
        // const response = await fetch('http://localhost:3000/api/isAccessable', {
        //     method: 'POST',
        //     credentials: 'include',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         authorization: token ? `Bearer ${token}` : "",
        //     },
        //     body: JSON.stringify({pageId})
        // });
        // const { access } = await response.json();
        // return access;
    }
}

