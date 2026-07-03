'use client';

import { SubmitEvent, useEffect, useState } from "react";
import styles from "./style.module.css"
import { useRouter } from "next/navigation";
import { supabaseClient } from "../../lib/supabase";

export default function ProfileSettingsPage(){

    const router = useRouter();

    const [error, setError] = useState("");

    const [defName, setDefName] = useState("");
    const [defRole, setDefRole] = useState("");
    const [defDepartment, setDefDepartment] = useState("");

    async function setProfile(event:SubmitEvent<HTMLFormElement>){
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const userData = await supabaseClient.auth.getUser();
        if(!userData.data.user){
            router.replace("/login");
            return;
        }
        const name = formData.get("name");
        const role = formData.get("role");
        const department = formData.get("department");

        const profileData = await supabaseClient.from("profile").upsert({
            user_id: userData.data.user.id, 
            display_name: name,
            role: role,
            department: department
        }).single();

        router.replace("/dashboard");
    }

    useEffect(()=>{

        async function checkMembership(){
            const user = await supabaseClient.auth.getUser();
            if(!user.data.user){
                router.replace("/login");
                return null;
                
            }
        
            const membership = await supabaseClient.from("membership").select("*").eq("user_id", user.data.user.id).maybeSingle();
            if(!membership.data){
                router.replace("/organisation");
                return null;
            }
        
            const orgId = membership.data.organisation_id;
            const orgData = await supabaseClient.from("organisation").select("*").eq("id", orgId).maybeSingle();
            if(!orgData.data){
                await supabaseClient.from("membership").delete().eq("user_id", user.data.user.id);
                router.replace("/organisation");
                return null;
            }

            const profileData = await supabaseClient.from("profile").select("*").eq("user_id", user.data.user.id).maybeSingle();
            if(profileData.data){
                setDefName(profileData.data.display_name);
                setDefRole(profileData.data.role);
                setDefDepartment(profileData.data.department);
            }
            else{
                setDefName("");
                setDefRole("");
                setDefDepartment("");
            }
        }

        checkMembership();

    }, [ router ]);

    return (
        <div className={styles.mainCard}>
            {error.trim() ? <div className={styles.errorBanner}>
                {error}
            </div> : <div></div>}
            <h1>Set Up You Profile</h1>
            <form method="POST" onSubmit={setProfile} autoComplete="off">
                <input type="text" className={styles.textInput} defaultValue={defName} name="name" placeholder="Display Name" required></input>
                <input type="text" className={styles.textInput} defaultValue={defRole} name="role" placeholder="Role" required></input>
                <input type="text" className={styles.textInput} defaultValue={defDepartment} name="department" placeholder="Department" required></input>
                <input type="submit" className={styles.continueButton} value="Save Profile"></input>
            </form>
            <p><a href="/organisation">Click here</a> to reset your organisation instead. </p>
        </div>
    );
}