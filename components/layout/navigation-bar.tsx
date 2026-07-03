'use client';

import styles from "./header-style.module.css"

import { supabaseClient } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function NavigationBar(){

    const router = useRouter();

    async function signOut(){
        await supabaseClient.auth.signOut();
        router.replace("/login");
    }
    return (
        <nav className={styles.navigationBar}>
            <button className={styles.signOutButton} onClick={signOut}>SIGN OUT</button>
        </nav>
    );
}