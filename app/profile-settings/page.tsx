'use client';

import "./profile-settings-style.css";
import "../globals.css";
import { SubmitEvent, useEffect, useState } from "react";
import { supabaseClient } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";

export default function ProfileSettingPage(){

    const router = useRouter();

    async function saveProfile(event:SubmitEvent<HTMLFormElement>){
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const displayName = formData.get("display-name");
        const user = await supabaseClient.auth.getUser();
        if(user.data.user){
            const upsert = await supabaseClient.from("membership").upsert({user_id: user.data.user.id, display_name: displayName});
            if(upsert.error){
                console.error("Error: "+upsert.error.message);
            }
            else
                router.push("/dashboard");
        }
    }

    useEffect(()=>{
        async function getUser(){
            const user = await supabaseClient.auth.getUser();
            if(!user.data.user){
                router.replace("/login");
            }
        }
        getUser();
    }, []);

    return (
        <div>
            <h1>Profile Settings</h1>
            <form onSubmit={saveProfile}>
                <label htmlFor="display-name">Display name: </label>
                <input type="text" name="display-name" id="display-name" required></input>
                <br></br>
                <br></br>
                <input type="submit" value="Save Profile"></input>
            </form>
        </div>
    );
}