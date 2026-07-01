'use client';

import { useEffect, useState } from "react";
import { supabaseClient } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function DashboardPage(){
    
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    function signOut(){
        supabaseClient.auth.signOut();
        router.push("/login");
    }

    useEffect(()=>{
        async function getUser(){
            const user = await supabaseClient.auth.getUser();
            if(!user.data.user){
                router.replace("/login");
            }
            else{
                setLoading(false);
            }
        }
        getUser()
    }, [router]);  

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
            <button id="sign-out-button" type="button" onClick={signOut}>Sign Out</button>
        </div>
    );
}