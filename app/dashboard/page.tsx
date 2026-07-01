'use client';

import { useEffect, useState } from "react";
import { supabaseClient } from "../../lib/supabase";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export default function DashboardPage(){
    
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState<String>("");

    useEffect(()=>{
        async function getUser(){
            const user = await supabaseClient.auth.getUser();
            if(user.data.user){
                const profileData = await supabaseClient.from("user_profiles").select("*").eq("user_id", user.data.user.id).maybeSingle();
                if(!profileData.data){
                    router.replace("/profile-settings")
                }
                else{
                    setName(profileData.data.display_name)
                    setLoading(false);
                }
            }
            else{
                router.replace("/login");
            }
        }
        getUser();
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
            <p>Welcome {name} to the dashboard!</p>
            <p>Latest announcement: QWERTY</p>
        </div>
    );
}