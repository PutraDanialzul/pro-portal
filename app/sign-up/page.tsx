'use client';

import { SubmitEvent, useEffect, useState } from "react";
import styles from "./style.module.css";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabaseClient } from "../../lib/supabase";

export default function SignUpPage() {

    const router = useRouter();

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    async function createAccount(
        event: SubmitEvent<HTMLFormElement>
    ) {
        setError("");

        event.preventDefault();


        const formData = new FormData(
            event.currentTarget
        );

        const email = String(
            formData.get("email")
        );

        const password = String(
            formData.get("password")
        );

        const confirmPassword = String(
            formData.get("confirm-password")
        );

        if(!email.trim() || !password.trim() || !confirmPassword.trim()){
            setError("Error: All forms need to be completed.");
            return;
        }

        if (password !== confirmPassword) {

            setError(
                "Error: Passwords do not match."
            );

            return;
        }

        const { error } =
            await supabaseClient.auth.signUp({
                email,
                password
            });

        if (error) {

            setError(error.message);

            return;
        }

        router.replace("/login");
    }

    useEffect(() => {

        async function checkUser() {

            const {
                data: { user }
            } = await supabaseClient.auth.getUser();

            if (user) {
                router.replace("/dashboard");
                return;
            }

            setLoading(false);
        }

        checkUser();

    }, [router]);

    if (loading) {

        return (
            <div className={styles.mainCard}>
                <h1>Loading...</h1>
            </div>
        );
    }

    return (
        <div className={styles.mainCard}>

            {error.trim() && (
                <div className={styles.errorBanner}>
                    {error}
                </div>
            )}

            <h1>Create Account</h1>

            <form
                onSubmit={createAccount}
                autoComplete="off"
            >

                <input
                    type="email"
                    className={styles.textInput}
                    name="email"
                    placeholder="Email Address"
                />

                <input
                    type="password"
                    className={styles.textInput}
                    name="password"
                    placeholder="Password"
                />

                <input
                    type="password"
                    className={styles.textInput}
                    name="confirm-password"
                    placeholder="Confirm Password"
                />

                <input
                    type="submit"
                    className={styles.continueButton}
                    value="Create Account"
                />

            </form>

            <p>Already have an account? <Link href="/login">Click here</Link>.</p>

        </div>
    );
}