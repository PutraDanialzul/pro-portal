'use client';

import { SubmitEvent, useEffect, useState } from "react";
import styles from "../style.module.css"
import { useRouter } from "next/navigation";
import { supabaseClient } from "../../../lib/supabase";

export default function NewOrganisationPage(){

    const router = useRouter();

    const [error, setError] = useState("");

    async function createOrganisation(event:SubmitEvent<HTMLFormElement>){
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const key = formData.get("key");
        const name = formData.get("name");
        const userData = await supabaseClient.auth.getUser();
        if(!userData.data.user){
            router.replace("/login");
            return;
        }
        const existingOrg = await supabaseClient.from("organisation").select("*").eq("join_key", key).maybeSingle();
        if(existingOrg.data){
            setError("Error: The secret key is not available. ");
            return;
        }
        const orgData = await supabaseClient.from("organisation").insert({owner_id: userData.data.user.id, name: name, join_key: key}).select().single();
        if(orgData.data){
            await supabaseClient.from("membership").upsert({user_id: userData.data.user.id, organisation_id: orgData.data.id});
            router.replace("/profile-settings");
        }
        else{
            setError("Error: Failed to create the organisation. ");
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
            <h1>Create a new Organisation</h1>
            <form onSubmit={createOrganisation}>
                <input type="text" className={styles.textInput} id="name-input" name="name" placeholder="Organisation Name" required></input>
                <input type="password" className={styles.textInput} id="key-input" name="key" placeholder="Organisation Secret Key" required></input>
                <input type="submit" className={styles.continueButton} value="Create Organisation"></input>
            </form>
            <p><a href="/organisation/create">Click here</a> to join an organisation instead. </p>
        </div>
    );
}