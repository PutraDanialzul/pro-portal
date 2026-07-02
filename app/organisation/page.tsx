'use client';

import { SubmitEvent, useEffect, useState } from "react";
import "./style.css"
import { supabaseClient } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function OrganisationJoinPage(){

    const router = useRouter();

    const [error, setError] = useState(false);

    async function joinOrganisation(event:SubmitEvent<HTMLFormElement>){
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const joinKey = formData.get("key-input");
        const userData = await supabaseClient.auth.getUser();
        if(!userData.data.user){
            router.replace("/login");
            return;
        }
        const orgData = await supabaseClient.from("organisation").select("*").eq("join_key", joinKey).single();
        if(orgData.success){
            await supabaseClient.from("membership").upsert({user_id: userData.data.user.id, organisation_id: orgData.data.id});
            router.replace("/profile-settings");
        }
        else{
            setError(true);
        }
    }

    useEffect(()=>{

        async function checkMembership(){
            const userData = await supabaseClient.auth.getUser();
            if(userData.data.user){
                const membershipData = await supabaseClient.from("membership").select("*").eq("user_id", userData.data.user.id).single();
                if(membershipData.error){
                    setError(false);
                }
                else{
                    const organisationData = await supabaseClient.from("organisation").select("*").eq("id", membershipData.data.organisation_id).single();
                    if(organisationData.error){
                        await supabaseClient.from("membership").delete().eq("user_id", userData.data.user.id);
                        setError(false)
                    }
                    else router.replace("/dashboard");
                }
            }
            else router.replace("/login");
        }

        checkMembership();

    }, [ router ]);

    return (
        <div id="main-card">
            {error ? <div id="error-banner">
                Error: Organisation not Found!
            </div> : <div></div>}
            <h1>Join an Organisation</h1>
            <form onSubmit={joinOrganisation}>
                <input type="text" id="key-input" name="key-input" placeholder="Organisation Key" required></input>
                <input type="submit" id="join-button" value="Join Organisation"></input>
            </form>
            <p><a href="/organisation/create">Click here</a> to create an organisation instead. </p>
        </div>
    );
}