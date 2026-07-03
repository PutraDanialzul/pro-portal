'use client';

import { SubmitEvent, useEffect, useState } from "react";
import styles from "./style.module.css";
import { useRouter } from "next/navigation";
import { supabaseClient } from "../../lib/supabase";

export default function ProfileSettingsPage() {

    const router = useRouter();

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [department, setDepartment] = useState("");

    const [existingProfile, setExistingProfile] = useState(false);

    async function rejoinOrganisation() {

        const {
            data: { user }
        } = await supabaseClient.auth.getUser();

        if (!user) {
            router.replace("/login");
            return;
        }

        
        if (
            !confirm(
                "Are you sure you want to leave your current organisation?"
            )
        ) {
            return;
        }


        const { error } = await supabaseClient
            .from("membership")
            .delete()
            .eq("user_id", user.id);

        if (error) {
            setError(error.message);
            return;
        }

        router.replace("/organisation");
    }

    async function saveProfile(
        event: SubmitEvent<HTMLFormElement>
    ) {

        event.preventDefault();

        setError("");

        const {
            data: { user }
        } = await supabaseClient.auth.getUser();

        if (!user) {
            router.replace("/login");
            return;
        }

        const { error } = await supabaseClient
            .from("profile")
            .upsert({
                user_id: user.id,
                display_name: name,
                role: role,
                department: department
            });

        if (error) {
            setError(error.message);
            return;
        }

        router.replace("/dashboard");
    }

    useEffect(() => {

        async function loadPage() {

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
                router.replace("/organisation");
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

                router.replace("/organisation");
                return;
            }

            const profile =
                await supabaseClient
                    .from("profile")
                    .select("*")
                    .eq("user_id", user.id)
                    .maybeSingle();

            if (profile.data) {

                setExistingProfile(true);

                setName(
                    profile.data.display_name ?? ""
                );

                setRole(
                    profile.data.role ?? ""
                );

                setDepartment(
                    profile.data.department ?? ""
                );
            }

            setLoading(false);
        }

        loadPage();

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
                        className={styles.errorBanner}
                    >
                        {error}
                    </div>
                )
            }

            <h1>Set Up Your Profile</h1>
  
            {
                existingProfile && (
                    <button
                        type="button"
                        className={styles.continueButton}
                        onClick={() =>
                            router.replace("/dashboard")
                        }
                    >
                        Back to Dashboard
                    </button>
                )
            }

            <form
                onSubmit={saveProfile}
                autoComplete="off"
            >

                <input
                    type="text"
                    className={styles.textInput}
                    value={name}
                    onChange={(e) =>
                        setName(e.target.value)
                    }
                    placeholder="Display Name"
                    required
                />

                <input
                    type="text"
                    className={styles.textInput}
                    value={role}
                    onChange={(e) =>
                        setRole(e.target.value)
                    }
                    placeholder="Role"
                    required
                />

                <input
                    type="text"
                    className={styles.textInput}
                    value={department}
                    onChange={(e) =>
                        setDepartment(e.target.value)
                    }
                    placeholder="Department"
                    required
                />

                <input
                    type="submit"
                    className={styles.continueButton}
                    value="Save Profile"
                />
                
                {
                    existingProfile && (
                        <button
                            type="button"
                            className={styles.rejoinButton}
                            onClick={rejoinOrganisation}
                        >
                            Rejoin Organisation
                        </button>
                    )
                }


            </form>

        </div>
    );
}