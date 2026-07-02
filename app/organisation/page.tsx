'use client';

import { SubmitEvent, useEffect, useState } from "react";
import styles from "./style.module.css"
import { supabaseClient } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function OrganisationJoinPage(){

    const router = useRouter();

    const [error, setError] = useState("");

    async function joinOrganisation(event:SubmitEvent<HTMLFormElement>){
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const joinKey = formData.get("key-input");
        const userData = await supabaseClient.auth.getUser();
        if(!userData.data.user){
            router.replace("/login");
            return;
        }
        const orgData = await supabaseClient.from("organisation").select("*").eq("join_key", joinKey).maybeSingle();
        if(orgData.data){
            await supabaseClient.from("membership").upsert({user_id: userData.data.user.id, organisation_id: orgData.data.id});
            router.replace("/profile-settings");
        }
        else{
            setError("Error: Failed to find the organisation. ");
        }
    }

    useEffect(()=>{

        async function checkMembership(){
            const userData = await supabaseClient.auth.getUser();
            if(userData.data.user){
                const membershipData = await supabaseClient.from("membership").select("*").eq("user_id", userData.data.user.id).maybeSingle();
                if(!membershipData.data){
                    setError("");
                }
                else{
                    const organisationData = await supabaseClient.from("organisation").select("*").eq("id", membershipData.data.organisation_id).maybeSingle();
                    if(!organisationData.data){
                        await supabaseClient.from("membership").delete().eq("user_id", userData.data.user.id);
                        setError("")
                    }
                    else router.replace("/dashboard");
                }
            }
            else router.replace("/login");
        }

        checkMembership();

    }, [ router ]);

    return (
        <div className={styles.mainCard}>
            {error.trim() ? <div className={styles.errorBanner}>
                {error}
            </div> : <div></div>}
            <h1>Join an Organisation</h1>
            <form onSubmit={joinOrganisation} autoComplete="off">
                <input type="password" className={styles.textInput} id="key-input" name="key-input" placeholder="Organisation Key" required></input>
                <input type="submit" className={styles.continueButton} value="Join Organisation"></input>
            </form>
            <p><a href="/organisation/create">Click here</a> to create an organisation instead. </p>
        </div>
    );
}