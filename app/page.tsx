'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "../lib/supabase";

export default function HomePage() {

    const router = useRouter();

    useEffect(() => {

        async function redirectUser() {

            const {
                data: { user }
            } = await supabaseClient.auth.getUser();

            if (user) {
                router.replace("/dashboard");
            }
            else {
                router.replace("/login");
            }
        }

        redirectUser();

    }, [router]);

    return (
        <div
            style={{
                textAlign: "center",
                padding: "100px"
            }}
        >
            <h1>Loading...</h1>
            <p>Please wait a few seconds.</p>
        </div>
    );
}