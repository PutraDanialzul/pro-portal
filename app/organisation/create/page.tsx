'use client';

import { SubmitEvent, useEffect, useState } from "react";
import styles from "../style.module.css";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabaseClient } from "../../../lib/supabase";

export default function NewOrganisationPage() {

    const router = useRouter();

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    async function signOut() {

        const { error } =
            await supabaseClient.auth.signOut();

        if (error) {
            setError(error.message);
            return;
        }

        router.replace("/login");
    }

    async function createOrganisation(
        event: SubmitEvent<HTMLFormElement>
    ) {

        event.preventDefault();

        setError("");

        const formData = new FormData(event.currentTarget);

        const key = String(formData.get("key"));
        const name = String(formData.get("name"));

        const {
            data: { user }
        } = await supabaseClient.auth.getUser();

        if (!user) {
            router.replace("/login");
            return;
        }

        const existingOrganisation =
            await supabaseClient
                .from("organisation")
                .select("id")
                .eq("join_key", key)
                .maybeSingle();

        if (existingOrganisation.data) {
            setError(
                "Error: The organisation key is already used."
            );
            return;
        }

        const organisationResult =
            await supabaseClient
                .from("organisation")
                .insert({
                    owner_id: user.id,
                    name: name,
                    join_key: key
                })
                .select()
                .single();

        if (organisationResult.error) {
            setError(
                organisationResult.error.message
            );
            return;
        }

        const membershipResult =
            await supabaseClient
                .from("membership")
                .upsert({
                    user_id: user.id,
                    organisation_id:
                        organisationResult.data.id
                });

        if (membershipResult.error) {
            setError(
                membershipResult.error.message
            );
            return;
        }

        router.replace("/profile-settings");
    }

    useEffect(() => {

        async function checkMembership() {

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

            if (!membership.data) {
                setLoading(false);
                return;
            }

            const organisation =
                await supabaseClient
                    .from("organisation")
                    .select("*")
                    .eq(
                        "id",
                        membership.data.organisation_id
                    )
                    .maybeSingle();

            if (!organisation.data) {

                await supabaseClient
                    .from("membership")
                    .delete()
                    .eq("user_id", user.id);

                setLoading(false);
                return;
            }

            router.replace("/dashboard");
        }

        checkMembership();

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

            <h1>Create a New Organisation</h1>

            <form
                onSubmit={createOrganisation}
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
                    type="text"
                    autoComplete="username"
                    style={{ display: "none" }}
                />

                <input
                    type="password"
                    autoComplete="current-password"
                    style={{ display: "none" }}
                />


                <input
                    type="text"
                    className={styles.textInput}
                    name="organisation-name"
                    placeholder="Organisation Name"
                    defaultValue={""}
                    autoComplete="organisation-name"
                    required
                />

                <input
                    type="password"
                    className={styles.textInput}
                    name="organisation-key"
                    placeholder="Organisation Secret Key"
                    defaultValue={""}
                    autoComplete="organisation-key"
                    required
                />

                <input
                    type="submit"
                    className={styles.continueButton}
                    value="Create Organisation"
                />

            </form>

            <p>
                <Link href="/organisation">Click here</Link> to join an organisation instead.
            </p>

        </div>
    );
}