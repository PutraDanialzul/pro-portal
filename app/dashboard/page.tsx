'use client';

import { useEffect, useState } from "react";
import { supabaseClient } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import styles from "./style.module.css"

export default function DashboardPage(){
    
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState<String>("");



    useEffect(()=>{
        async function checkUser(){
            const user = await supabaseClient.auth.getUser();
            if(!user.data.user){
                router.replace("/login");
                return null;
                
            }
        
            const membership = await supabaseClient.from("membership").select("*").eq("user_id", user.data.user.id).maybeSingle();
            if(!membership.data){
                await supabaseClient.from("profile").delete().eq("user_id", user.data.user.id);
                router.replace("/organisation");
                return null;
            }
        
            const orgId = membership.data.organisation_id;
            const orgData = await supabaseClient.from("organisation").select("*").eq("id", orgId).maybeSingle();
            if(!orgData.data){
                await supabaseClient.from("membership").delete().eq("user_id", user.data.user.id);
                await supabaseClient.from("profile").delete().eq("user_id", user.data.user.id);
                router.replace("/organisation");
                return null;
            }
            const profileData = await supabaseClient.from("profile").select("*").eq("user_id", user.data.user.id).maybeSingle();
            if(!profileData.data){
                router.replace("/profile-settings")
                return null;
            }
            setLoading(false);
            setName(profileData.data.display_name);
        }
        checkUser();
    }, [router]);  

    if(loading){
        return (
            <div>
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