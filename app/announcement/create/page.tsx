'use client';

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { supabaseClient } from "../../../lib/supabase";

import styles from "../announcement-style.module.css";

export default function NewAnnouncementPage() {

    const router = useRouter();

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function addAnnouncement(
        event: FormEvent<HTMLFormElement>
    ) {

        event.preventDefault();

        setError("");
        setLoading(true);

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

        const formData =
            new FormData(
                event.target as HTMLFormElement
            );

        const text =
            String(
                formData.get("announcement")
            ).trim();

        const { error } =
            await supabaseClient
                .from("announcement")
                .insert({
                    organisation_id:
                        membership.data
                            .organisation_id,

                    user_id: user.id,

                    text: text
                });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        router.replace("/announcement");
    }

    return (
        <div className={styles.announcementContainer}>

            <h1>Create Announcement</h1>

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

            <form
                onSubmit={addAnnouncement}
                className={
                    styles.createForm
                }
            >

                <textarea
                    name="announcement"
                    placeholder="Write your announcement..."
                    className={
                        styles.createTextarea
                    }
                    required
                />

                <div className={styles.buttonGroup}>

                    <button
                        type="button"
                        className={
                            styles.cancelButton
                        }
                        onClick={() =>
                            router.replace(
                                "/announcement"
                            )
                        }
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className={
                            styles.createBtn
                        }
                        disabled={loading}
                    >
                        {
                            loading
                                ? "Creating..."
                                : "Create"
                        }
                    </button>

                </div>

            </form>

        </div>
    );
}