'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import styles from "./announcement-style.module.css";

import { supabaseClient } from "../../lib/supabase";

interface Announcement {
    id: string;
    text: string;
    created_at: string;
}

export default function AnnouncementPage() {

    const router = useRouter();

    const [loading, setLoading] =
        useState(true);

    const [announcements, setAnnouncements] =
        useState<Announcement[]>([]);

    useEffect(() => {

        async function loadAnnouncements() {

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

            const announcementData =
                await supabaseClient
                    .from("announcement")
                    .select("*")
                    .eq(
                        "organisation_id",
                        membership.data.organisation_id
                    )
                    .order(
                        "created_at",
                        {
                            ascending: false
                        }
                    );

            setAnnouncements(
                announcementData.data ?? []
            );

            setLoading(false);
        }

        loadAnnouncements();

    }, [router]);

    async function deleteAnnouncement(
        announcementId: string
    ) {

        const confirmed = confirm(
            "Delete this announcement?"
        );

        if (!confirmed) {
            return;
        }

        const { error } =
            await supabaseClient
                .from("announcement")
                .delete()
                .eq("id", announcementId);

        if (error) {
            alert(error.message);
            return;
        }

        setAnnouncements(
            announcements.filter(
                announcement =>
                    announcement.id !==
                    announcementId
            )
        );
    }

    if (loading) {

        return (
            <div
                className={
                    styles.announcementContainer
                }
            >
                <h1>Loading...</h1>
            </div>
        );
    }

    return (

        <div
            className={
                styles.announcementContainer
            }
        >

            <div className={styles.header}>

                <h1>
                    Announcements
                </h1>

                <Link href="/announcement/create">
                    + Create
                </Link>

            </div>

            <div
                className={
                    styles.summaryCard
                }
            >
                Total Announcements:{" "}
                <strong>
                    {announcements.length}
                </strong>
            </div>

            {
                announcements.length === 0 ? (

                    <div
                        className={
                            styles.emptyCard
                        }
                    >
                        No announcements yet.
                    </div>

                ) : (

                    announcements.map(
                        (
                            announcement
                        ) => (

                            <div
                                key={
                                    announcement.id
                                }
                                className={
                                    styles.announcementCard
                                }
                            >

                                <p>
                                    {
                                        announcement.text
                                    }
                                </p>

                                <div
                                    className={
                                        styles.footer
                                    }
                                >

                                    <small>
                                        {new Date(
                                            announcement.created_at
                                        ).toLocaleDateString()}
                                    </small>

                                    <button
                                        className={
                                            styles.deleteButton
                                        }
                                        onClick={() =>
                                            deleteAnnouncement(
                                                announcement.id
                                            )
                                        }
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        )
                    )

                )
            }

        </div>

    );
}