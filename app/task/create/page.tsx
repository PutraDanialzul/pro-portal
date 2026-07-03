'use client';

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { supabaseClient } from "../../../lib/supabase";

import styles from "../style.module.css";

interface Member {
    user_id: string;
    display_name: string;
}

export default function CreateTaskPage() {

    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [members, setMembers] =
        useState<Member[]>([]);

    async function createTask(
        event: FormEvent<HTMLFormElement>
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

        const title =
            formData.get("title");

        const description =
            formData.get("description");

        const assignedUserId =
            formData.get("assigned-user-id");

        const dueDate =
            formData.get("due-date");

        const { error } =
            await supabaseClient
                .from("task")
                .insert({
                    organisation_id:
                        membership.data
                            .organisation_id,

                    assigned_user_id:
                        assignedUserId,

                    title,

                    description,

                    status:
                        "Not Started",

                    due_date:
                        dueDate
                });

        if (error) {
            setError(error.message);
            return;
        }

        router.replace("/task");
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

            const memberData =
                await supabaseClient
                    .from("membership")
                    .select("user_id")
                    .eq(
                        "organisation_id",
                        membership.data
                            .organisation_id
                    );

            if (!memberData.data) {
                setLoading(false);
                return;
            }

            const profiles =
                await supabaseClient
                    .from("profile")
                    .select(
                        "user_id, display_name"
                    );

            const merged =
                memberData.data
                    .map((member) => {

                        const profile =
                            profiles.data?.find(
                                (p) =>
                                    p.user_id ===
                                    member.user_id
                            );

                        return {
                            user_id:
                                member.user_id,

                            display_name:
                                profile?.display_name ??
                                "Unknown User"
                        };
                    });

            setMembers(merged);

            setLoading(false);
        }

        loadPage();

    }, [router]);

    if (loading) {
        return (
            <div className={styles.taskContainer}>
                <h1>Loading...</h1>
            </div>
        );
    }

    return (
        <div className={styles.taskContainer}>

            <h1 className={styles.pageTitle}>
                Create Task
            </h1>

            {
                error.trim() && (
                    <div
                        style={{
                            background: "#C61116",
                            color: "white",
                            padding: "12px",
                            borderRadius: "10px",
                            marginBottom: "20px"
                        }}
                    >
                        {error}
                    </div>
                )
            }

                <form
                    onSubmit={createTask}
                    className={styles.createForm}
                >
                    <div className={styles.formSection}>

                        <label className={styles.formLabel}>
                            Task Title
                        </label>

                        <input
                            className={styles.createInput}
                            name="title"
                            placeholder="Enter task title"
                            required
                        />

                    </div>

                    <div className={styles.formSection}>

                        <label className={styles.formLabel}>
                            Description
                        </label>

                        <textarea
                            className={styles.createTextarea}
                            name="description"
                            placeholder="Enter task description"
                        />

                    </div>

                    <div className={styles.formSection}>

                        <label className={styles.formLabel}>
                            Assign To
                        </label>

                        <select
                            className={styles.createInput}
                            name="assigned-user-id"
                            required
                        >
                            <option value="">
                                Select employee
                            </option>

                            {
                                members.map((member) => (
                                    <option
                                        key={member.user_id}
                                        value={member.user_id}
                                    >
                                        {member.display_name}
                                    </option>
                                ))
                            }
                        </select>
                        
                    </div>
                        
                    <div className={styles.formSection}>
                        
                        <label className={styles.formLabel}>
                            Due Date
                        </label>
                        
                        <input
                            type="date"
                            className={styles.createInput}
                            name="due-date"
                            required
                        />

                    </div>
                    <div className={styles.buttonGroup}>

                        <button
                            type="button"
                            className={styles.backButton}
                            onClick={() =>
                                router.replace("/task")
                            }
                        >
                            Cancel
                        </button>
                        
                        <button
                            type="submit"
                            className={styles.createButton}
                        >
                            Create Task
                        </button>
                        
                    </div>

            </form>

        </div>
    );
}