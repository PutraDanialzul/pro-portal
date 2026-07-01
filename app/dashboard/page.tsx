'use client';

import { useEffect, useState } from "react";
import { supabaseClient } from "../../lib/supabase";

export default function DashboardPage(){
    
    const [loading, setLoading] = useState(true);

    function signOut(){
        supabaseClient.auth.signOut();
        window.location.assign("login");
    }

    useEffect(()=>{
        async function getUser(){
            const user = await supabaseClient.auth.getUser();
            if(user.error){
                window.location.assign("login");
            }
            else{
                setLoading(false);
                alert("Welcome "+user.data.user.email+"!");
            }
        }
        getUser()
    }, []);  

    if(loading){
        return (
            <div>
                <h1>Loading...</h1>
            </div>
        );
    }

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome to the dashboard!</p>
            <p>Latest announcement: QWERTY</p>
            <button id="sign-out-button" type="button" onClick={signOut}>Sign Out</button>
        </div>
    );
}