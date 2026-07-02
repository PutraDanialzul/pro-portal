'use client';

import { useEffect, useState } from "react";
import { supabaseClient } from "../../lib/supabase";
import { usePathname, useRouter } from "next/navigation";

export default function NavigationBar(){

    const router = useRouter();

    function signOut(){
        supabaseClient.auth.signOut();
        router.push("/login");
    }
    return (
        <nav id="nav-bar">
            <button id="sign-out-button" onClick={signOut}>SIGN OUT</button>
        </nav>
    );
}