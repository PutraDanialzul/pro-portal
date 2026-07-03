'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { supabaseClient } from "../../lib/supabase";

import styles from "./style.module.css";

interface Task {
    id: string;
    title: string;
    description: string;
    status: string;
    due_date: string;
    created_at: string;
}

export default function TaskPage() {

    const router = useRouter();

    const [loading, setLoading] = useState(true);

    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {

        async function loadTasks() {

            const {
                data: { user }
            } = await supabaseClient.auth.getUser();

            if (!user) {
                router.replace("/login");
                return;
            }

            const taskData =
                await supabaseClient
                    .from("task")
                    .select("*")
                    .eq(
                        "assigned_user_id",
                        user.id
                    )
                    .order(
                        "created_at",
                        { ascending: false }
                    );

            setTasks(taskData.data ?? []);
            setLoading(false);
        }

        loadTasks();

    }, [router]);

    async function deleteTask(
        taskId: string
    ) {

        const confirmed =
            confirm(
                "Are you sure you want to delete this task?"
            );

        if (!confirmed) {
            return;
        }

        const { error } =
            await supabaseClient
                .from("task")
                .delete()
                .eq("id", taskId);

        if (error) {
            alert(error.message);
            return;
        }

        setTasks(
            previous =>
                previous.filter(
                    task =>
                        task.id !== taskId
                )
        );
    }

    function getDaysLeft(
        dueDate: string
    ) {

        const today =
            new Date();

        const due =
            new Date(dueDate);

        const difference =
            due.getTime() -
            today.getTime();

        const days = Math.ceil(
            difference /
            (1000 * 60 * 60 * 24)
        );

        return days;
    }

    function getStatusClass(
        status: string
    ) {

        switch (
            status.toLowerCase()
        ) {

            case "completed":
                return styles.completed;

            case "in progress":
                return styles.inProgress;

            default:
                return styles.notStarted;
        }
    }



    async function updateStatus(
        taskId: string,
        status: string
    ) {

        await supabaseClient
            .from("task")
            .update({
                status
            })
            .eq("id", taskId);

        setTasks((previous) =>
            previous.map((task) =>
                task.id === taskId
                    ? {
                        ...task,
                        status
                    }
                    : task
            )
        );
    }

    if (loading) {

        return (
            <div
                className={
                    styles.taskContainer
                }
            >
                <h1>Loading...</h1>
            </div>
        );
    }

    return (

        <div
            className={
                styles.taskContainer
            }
        >

            <div
                className={
                    styles.header
                }
            >

                <h1>
                    My Tasks
                </h1>

                <button
                    className={
                        styles.createButton
                    }
                    onClick={() =>
                        router.push(
                            "/task/create"
                        )
                    }
                >
                    + New Task
                </button>

            </div>

            <div
                className={
                    styles.summaryCard
                }
            >
                Total Tasks:{" "}
                <strong>
                    {tasks.length}
                </strong>
            </div>

            <table
                className={
                    styles.taskTable
                }
            >

                <thead>

                    <tr>
                        <th>
                            Task
                        </th>

                        <th>
                            Status
                        </th>

                        <th>
                            Assigned
                        </th>

                        <th>
                            Due Date
                        </th>
                        <th>
                            Days Left
                        </th>
                                    
                        <th>
                            Actions
                        </th>
                    </tr>

                </thead>

                <tbody>

                    {
                        tasks.length ===
                        0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                >
                                    No tasks
                                    assigned.
                                </td>
                            </tr>
                        ) : (
                            tasks.map(
                                (
                                    task
                                ) => (

                                    <tr key={task.id}>
                                                                    
                                        <td>
                                            <strong>
                                                {task.title}
                                            </strong>

                                            {
                                                task.description && (
                                                    <p
                                                        className={
                                                            styles.description
                                                        }
                                                    >
                                                        {task.description}
                                                    </p>
                                                )
                                            }
                                        </td>
                                        
                                        <td>
                                        
                                            <select
                                                value={task.status}
                                                className={
                                                    styles.statusSelect
                                                }
                                                onChange={(e) =>
                                                    updateStatus(
                                                        task.id,
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option>
                                                    Not Started
                                                </option>
                                            
                                                <option>
                                                    In Progress
                                                </option>
                                            
                                                <option>
                                                    Completed
                                                </option>
                                            
                                            </select>
                                            
                                        </td>
                                            
                                        <td>
                                            {new Date(
                                                task.created_at
                                            ).toLocaleDateString()}
                                        </td>
                                        
                                        <td>
                                            {new Date(
                                                task.due_date
                                            ).toLocaleDateString()}
                                        </td>
                                        
                                        <td>
                                        
                                            {
                                                getDaysLeft(
                                                    task.due_date
                                                ) < 0
                                                    ? (
                                                        <span
                                                            className={
                                                                styles.overdue
                                                            }
                                                        >
                                                            Overdue
                                                        </span>
                                                    )
                                                    : (
                                                        getDaysLeft(
                                                            task.due_date
                                                        )
                                                    )
                                            }

                                        </td>
                                        <td>

                                            <button
                                                className={
                                                    styles.deleteButton
                                                }
                                                onClick={() =>
                                                    deleteTask(
                                                        task.id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>
                                            
                                        </td>
                                    
                                    </tr>

                                )
                            )
                        )
                    }

                </tbody>

            </table>

        </div>

    );
}