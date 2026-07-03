'use client';

import { useEffect, useState } from "react";
import { supabaseClient } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import styles from "./style.module.css";

interface Announcement {
    id: string;
    text: string;
}

interface Task {
    id: string;
    title: string;
    status: string;
}

export default function DashboardPage() {

    const router = useRouter();

    const [loading, setLoading] = useState(true);

    const [displayName, setDisplayName] =
        useState("");

    const [organisationName, setOrganisationName] =
        useState("");

    const [announcementCount, setAnnouncementCount] =
        useState(0);

    const [taskCount, setTaskCount] =
        useState(0);

    const [announcements, setAnnouncements] =
        useState<Announcement[]>([]);
        
    const [recentTasks, setRecentTasks] = 
        useState<Task[]>([]);

    const [recentAnnouncements, setRecentAnnouncements] =
        useState<Announcement[]>([]);

    useEffect(() => {

        async function loadDashboard() {

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
                router.replace("/organisation");
                return;
            }

            const profile =
                await supabaseClient
                    .from("profile")
                    .select("*")
                    .eq("user_id", user.id)
                    .maybeSingle();

            if (!profile.data) {
                router.replace("/profile-settings");
                return;
            }

            setDisplayName(
                profile.data.display_name
            );

            setOrganisationName(
                organisation.data.name
            );

            const announcementData =
                await supabaseClient
                    .from("announcement")
                    .select("*")
                    .eq(
                        "organisation_id",
                        organisation.data.id
                    )
                    .order("created_at", {
                        ascending: false
                    });

            setAnnouncementCount(
                announcementData.data?.length ?? 0
            );

            setRecentAnnouncements(
                announcementData.data?.slice(0, 3) ??
                []
            );


            const taskData =
                await supabaseClient
                    .from("task")
                    .select("*")
                    .eq(
                        "assigned_user_id",
                        user.id
                    );

            setTaskCount(
                taskData.data?.length ?? 0
            );

            setRecentTasks(
                taskData.data?.slice(0, 3) ?? []
            );

            setLoading(false);
        }

        loadDashboard();

    }, [router]);

    if (loading) {
        return (
            <div className={styles.dashboardContainer}>
                <h1>Loading...</h1>
            </div>
        );
    }

    return (
        <div className={styles.dashboardContainer}>

            <div className={styles.welcomeCard}>
                <h1>
                    Good Morning, {displayName}!
                </h1>

                <p>
                    Welcome back to{" "}
                    {organisationName}
                </p>
            </div>

            <div className={styles.statsGrid}>

                <div className={styles.statCard}>
                    <h2>{taskCount}</h2>
                    <p>Pending Tasks</p>
                </div>

                <div className={styles.statCard}>
                    <h2>{announcementCount}</h2>
                    <p>Announcements</p>
                </div>

            </div>
            <div className={styles.activityGrid}>

                <div className={styles.sectionCard}>

                    <h2>Recent Tasks</h2>

                    {
                        recentTasks.length === 0 ? (
                            <p>No tasks assigned.</p>
                        ) : (
                            <ul className={styles.list}>
                                {
                                    recentTasks.map(task => (
                                        <li key={task.id}>
                                            <strong>
                                                {task.title}
                                            </strong>
                                            {" - "}
                                            {task.status}
                                        </li>
                                    ))
                                }
                            </ul>
                        )
                    }

                </div>
                
                <div className={styles.sectionCard}>
                
                    <h2>
                        Recent Announcements
                    </h2>
                
                    {
                        recentAnnouncements.length === 0 ? (
                            <p>No announcements.</p>
                        ) : (
                            <ul className={styles.list}>
                                {
                                    recentAnnouncements.map(
                                        announcement => (
                                            <li
                                                key={
                                                    announcement.id
                                                }
                                            >
                                                {
                                                    announcement.text
                                                }
                                            </li>
                                        )
                                    )
                                }
                            </ul>
                        )
                    }

                </div>
                
            </div>
                
            <div className={styles.organisationCard}>
                
                <h2>
                    Current Organisation
                </h2>
                
                <p>
                    {organisationName}
                </p>
                
            </div>

        </div>
    );
}