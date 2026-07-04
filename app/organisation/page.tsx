'use client';

import { SubmitEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import styles from "./style.module.css";

import { supabaseClient } from "../../lib/supabase";
import Link from "next/link";

export default function OrganisationJoinPage() {

    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function signOut() {

        const { error } =
            await supabaseClient.auth.signOut();

        if (error) {
            setError(error.message);
            return;
        }

        router.replace("/login");
    }

    async function joinOrganisation(
        event: SubmitEvent<HTMLFormElement>
    ) {
        setError("");

        event.preventDefault();

        const formData = new FormData(
            event.target
        );
        
        const joinKey = String(
            formData.get("key-input")
        );

        if(!joinKey.trim()){
            setError("Error: Organisation key cannot be blank")
            return;
        }

        const {
            data: { user }
        } = await supabaseClient.auth.getUser();

        if (!user) {
            router.replace("/login");
            return;
        }



        const organisation =
            await supabaseClient
                .from("organisation")
                .select("*")
                .eq("join_key", joinKey)
                .maybeSingle();

        if (!organisation.data) {
            setError(
                "Error: Organisation not found."
            );
            return;
        }

        const { error } =
            await supabaseClient
                .from("membership")
                .upsert({
                    user_id: user.id,
                    organisation_id:
                        organisation.data.id
                });

        if (error) {
            setError(error.message);
            return;
        }

        router.replace("/profile-settings");
    }

    useEffect(() => {

        async function initialise() {

            const {
                data: { user }
            } = await supabaseClient.auth.getUser();

            if (!user) {
                router.replace("/login");
                return;
            }

            const membership =
                await supabaseClient
                    .from("membership")
                    .select("*")
                    .eq("user_id", user.id)
                    .maybeSingle();

            if (membership.data) {

                const organisation =
                    await supabaseClient
                        .from("organisation")
                        .select("*")
                        .eq(
                            "id",
                            membership.data
                                .organisation_id
                        )
                        .maybeSingle();

                if (organisation.data) {
                    router.replace(
                        "/dashboard"
                    );
                    return;
                }

                await supabaseClient
                    .from("membership")
                    .delete()
                    .eq("user_id", user.id);
            }

            setLoading(false);
        }

        initialise();

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

            {
                error.trim() && (
                    <div
                        className={
                            styles.errorBanner
                        }
                    >
                        {error}
                    </div>
                )
            }

            <h1>
                Join an Organisation
            </h1>

            <form
                onSubmit={
                    joinOrganisation
                }
                autoComplete="off"
            >
                <button
                    type="button"
                    className={styles.signOutButton}
                    onClick={signOut}
                >
                    Sign Out
                </button>

                <input
                    type="password"
                    name="key-input"
                    className={
                        styles.textInput
                    }
                    defaultValue={""}
                    placeholder="Organisation Key"
                />

                <input
                    type="submit"
                    className={
                        styles.continueButton
                    }
                    value="Join Organisation"
                />

            </form>

            <p><Link href="/organisation/create">Click here</Link> if you want to create a new organisation instead.</p>

        </div>
    );
}