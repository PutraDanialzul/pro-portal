'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { supabaseClient } from "../../../lib/supabase";

import styles from "./style.module.css";

interface Organisation {
    id: number;
    created_at: string;
    name: string;
    join_key: string;
    owner_id: string;
}

interface Profile {
    user_id: string;
    display_name: string;
    role: string;
    department: string;
}

export default function OrganisationPage() {

    const router = useRouter();

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [organisation, setOrganisation] =
        useState<Organisation | null>(null);

    const [members, setMembers] =
        useState<Profile[]>([]);

    const [announcementCount, setAnnouncementCount] =
        useState(0);

    const [taskCount, setTaskCount] =
        useState(0);

    const [currentUserId, setCurrentUserId] =
        useState("");

    useEffect(() => {

        async function loadData() {

            const {
                data: { user }
            } = await supabaseClient
                .auth
                .getUser();

            if (!user) {

                router.replace("/login");

                return;
            }

            setCurrentUserId(
                user.id
            );

            const membership =
                await supabaseClient
                    .from("membership")
                    .select("*")
                    .eq(
                        "user_id",
                        user.id
                    )
                    .maybeSingle();

            if (!membership.data) {

                router.replace(
                    "/organisation"
                );

                return;
            }

            const organisationResult =
                await supabaseClient
                    .from("organisation")
                    .select("*")
                    .eq(
                        "id",
                        membership.data
                            .organisation_id
                    )
                    .maybeSingle();

                    
                    if (
                        !organisationResult.data
                    ) {
                        
                        setError(
                            "Organisation not found."
                        );
                        
                        setLoading(false);
                        
                        return;
                    }
                    
                    setOrganisation(
                        organisationResult.data
                    );
                    
                    const organisationId =
                    organisationResult
                    .data
                    .id;
                    
            const membershipRows =
                await supabaseClient
                    .from("membership")
                    .select("*")
                    .eq(
                        "organisation_id",
                        organisationId
                    );

            const userIds =
                membershipRows.data?.map(
                    member =>
                        member.user_id
                ) ?? [];

            if (
                userIds.length > 0
            ) {

                const profileRows =
                    await supabaseClient
                        .from("profile")
                        .select("*")
                        .in(
                            "user_id",
                            userIds
                        );

                setMembers(
                    profileRows.data ??
                    []
                );
            }

            const announcements =
                await supabaseClient
                    .from(
                        "announcement"
                    )
                    .select(
                        "*",
                        {
                            count:
                                "exact",
                            head: true
                        }
                    )
                    .eq(
                        "organisation_id",
                        organisationId
                    );

            setAnnouncementCount(
                announcements.count ??
                0
            );

            const tasks =
                await supabaseClient
                    .from("task")
                    .select(
                        "*",
                        {
                            count:
                                "exact",
                            head: true
                        }
                    )
                    .eq(
                        "organisation_id",
                        organisationId
                    );

            setTaskCount(
                tasks.count ?? 0
            );

            setLoading(false);

        }

        loadData();

    }, [router]);

    async function removeMember(
        userId: string
    ) {

        if (
            !organisation
        ) {
            return;
        }

        const confirmed =
            confirm(
                "Remove this member?"
            );

        if (!confirmed) {
            return;
        }

        const result =
            await supabaseClient
                .from("membership")
                .delete()
                .eq(
                    "user_id",
                    userId
                )
                .eq(
                    "organisation_id",
                    organisation.id
                );

        if (result.error) {

            setError(
                result.error.message
            );

            return;
        }

        setMembers(
            previous =>
                previous.filter(
                    member =>
                        member.user_id !==
                        userId
                )
        );

    }

    async function copyJoinKey() {

        if (
            !organisation
        ) {
            return;
        }

        await navigator.clipboard.writeText(
            organisation.join_key
        );

        alert(
            "Join key copied."
        );

    }

    async function leaveOrganisation() {

        if (
            !organisation
        ) {
            return;
        }

        const confirmed =
            confirm(
                "Leave organisation?"
            );

        if (!confirmed) {
            return;
        }

        const result =
            await supabaseClient
                .from("membership")
                .delete()
                .eq(
                    "user_id",
                    currentUserId
                )
                .eq(
                    "organisation_id",
                    organisation.id
                );

        if (result.error) {

            setError(
                result.error.message
            );

            return;
        }

        router.replace(
            "/organisation"
        );

    }

    async function deleteOrganisation() {

        if (
            !organisation
        ) {
            return;
        }

        const confirmed =
            confirm(
                "This will permanently delete the organisation. Continue?"
            );

        if (!confirmed) {
            return;
        }

        await supabaseClient
            .from("membership")
            .delete()
            .eq(
                "organisation_id",
                organisation.id
            );

        await supabaseClient
            .from("announcement")
            .delete()
            .eq(
                "organisation_id",
                organisation.id
            );

        await supabaseClient
            .from("task")
            .delete()
            .eq(
                "organisation_id",
                organisation.id
            );

        const result =
            await supabaseClient
                .from("organisation")
                .delete()
                .eq(
                    "id",
                    organisation.id
                );

        if (result.error) {

            setError(
                result.error.message
            );

            return;
        }

        router.replace(
            "/"
        );

    }

    if (loading) {

        return (

            <div
                className={
                    styles.organisationContainer
                }
            >
                <h1>
                    Loading...
                </h1>
            </div>

        );

    }

    return (

        <div
            className={
                styles.organisationContainer
            }
        >

            {
                error && (

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
                Organisation Management
            </h1>

            <div
                className={
                    styles.card
                }
            >

                <h2>
                    Organisation Information
                </h2>

                <div
                    className={
                        styles.infoGrid
                    }
                >

                    <div>
                        <strong>
                            Name
                        </strong>

                        <p>
                            {
                                organisation?.name
                            }
                        </p>
                    </div>

                    <div>
                        <strong>
                            Join Key
                        </strong>

                        <p>
                            {
                                organisation?.join_key
                            }
                        </p>
                    </div>

                    <div>
                        <strong>
                            Created
                        </strong>

                        <p>
                            {
                                organisation &&
                                new Date(
                                    organisation.created_at
                                )
                                .toLocaleDateString()
                            }
                        </p>
                    </div>

                    <div>
                        <strong>
                            Members
                        </strong>

                        <p>
                            {
                                members.length
                            }
                        </p>
                    </div>

                </div>

            </div>

            <div
                className={
                    styles.card
                }
            >

                <h2>
                    Statistics
                </h2>

                <div
                    className={
                        styles.statsContainer
                    }
                >

                    <div
                        className={
                            styles.statCard
                        }
                    >

                        <h3>
                            {
                                members.length
                            }
                        </h3>

                        <p>
                            Members
                        </p>

                    </div>

                    <div
                        className={
                            styles.statCard
                        }
                    >

                        <h3>
                            {
                                announcementCount
                            }
                        </h3>

                        <p>
                            Announcements
                        </p>

                    </div>

                    <div
                        className={
                            styles.statCard
                        }
                    >

                        <h3>
                            {
                                taskCount
                            }
                        </h3>

                        <p>
                            Tasks
                        </p>

                    </div>

                </div>

            </div>

            <div
                className={
                    styles.card
                }
            >

                <div
                    className={
                        styles.sectionHeader
                    }
                >

                    <h2>
                        Members
                    </h2>

                </div>

                <table
                    className={
                        styles.memberTable
                    }
                >

                    <thead>

                        <tr>

                            <th>
                                Display Name
                            </th>

                            <th>
                                Role
                            </th>

                            <th>
                                Department
                            </th>

                            <th>
                                Actions
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            members.map(
                                member => (

                                    <tr
                                        key={
                                            member.user_id
                                        }
                                    >

                                        <td>
                                            {
                                                member.display_name
                                            }
                                        </td>

                                        <td>
                                            {
                                                member.role
                                            }
                                        </td>

                                        <td>
                                            {
                                                member.department
                                            }
                                        </td>

                                        <td>

                                            {
                                                organisation?.owner_id !==
                                                member.user_id && (

                                                    <button
                                                        className={
                                                            styles.removeButton
                                                        }
                                                        onClick={() =>
                                                            removeMember(
                                                                member.user_id
                                                            )
                                                        }
                                                    >
                                                        Remove
                                                    </button>

                                                )
                                            }

                                        </td>

                                    </tr>

                                )
                            )
                        }

                    </tbody>

                </table>

            </div>

            <div
                className={
                    styles.card
                }
            >

                <h2>
                    Invite Members
                </h2>

                <p>
                    Share this join
                    key with users.
                </p>

                <div
                    className={
                        styles.joinKeyCard
                    }
                >
                    {
                        organisation?.join_key
                    }
                </div>

                <button
                    className={
                        styles.primaryButton
                    }
                    onClick={
                        copyJoinKey
                    }
                >
                    Copy Join Key
                </button>

            </div>

            <div
                className={`${styles.card} ${styles.dangerZone}`}
            >

                <h2>
                    Danger Zone
                </h2>

                {
                    organisation?.owner_id ===
                    currentUserId ? (

                        <button
                            className={
                                styles.dangerButton
                            }
                            onClick={
                                deleteOrganisation
                            }
                        >
                            Delete Organisation
                        </button>

                    ) : (

                        <button
                            className={
                                styles.dangerButton
                            }
                            onClick={
                                leaveOrganisation
                            }
                        >
                            Leave Organisation
                        </button>

                    )
                }

            </div>

        </div>

    );

}