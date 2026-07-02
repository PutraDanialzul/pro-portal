'use client';

import { useEffect, useState } from "react";
import { supabaseClient } from "../../lib/supabase";
import { usePathname, useRouter } from "next/navigation";

export default function NavigationBar(){

    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState(false);

    function signOut(){
        supabaseClient.auth.signOut();
        router.push("/login");
        setUser(false);
    }

    useEffect(()=>{
        async function getUser(){
            const user = await supabaseClient.auth.getUser();
            if(user.data.user)
                setUser(true);
            else
                setUser(false);
        }
        getUser();
    }, [router, pathname]);

    if(user) return (
        <nav id="nav-bar">
            <button id="sign-out-button" onClick={signOut}>Sign Out</button>
        </nav>
    );
    else return (
        <nav id="nav-bar">
            <a id="log-in-link" href="/login">Log In</a>
        </nav>
    );
}