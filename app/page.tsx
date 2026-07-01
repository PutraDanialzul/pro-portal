'use client';

import { useEffect, useState } from "react";
import { supabaseClient } from "../lib/supabase"
import { useRouter } from "next/navigation";

export default function HomePage(){
    const router = useRouter();
    useEffect(()=>{
        async function checkUser(){
            const user = await supabaseClient.auth.getUser();
            if(user.data.user){
                router.replace("/dashboard");
            }
            else{
                router.replace("/login");
            }
        }
        checkUser();
    }, [router]);
    return (
        <h1>
            Loading...
        </h1>
    );
}