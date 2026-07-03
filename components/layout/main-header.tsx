'use client';

import styles from "./header-style.module.css";

import NavigationBar from "./navigation-bar";
import Logo from "../../logo.png";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { hidePath } from "../../lib/hide-list";
import { supabaseClient } from "../../lib/supabase";

export default function MainHeader() {

    const pathname = usePathname();

    const [organisationName, setOrganisationName] =
        useState("Loading...");

    const hidden = hidePath.includes(pathname);

    useEffect(() => {

        async function loadOrganisation() {

            const {
                data: { user }
            } = await supabaseClient.auth.getUser();

            if (!user) {
                setOrganisationName("Pro Portal");
                return;
            }

            const membership =
                await supabaseClient
                    .from("membership")
                    .select("organisation_id")
                    .eq("user_id", user.id)
                    .maybeSingle();

            if (!membership.data) {
                setOrganisationName("No Organisation");
                return;
            }

            const organisation =
                await supabaseClient
                    .from("organisation")
                    .select("name")
                    .eq(
                        "id",
                        membership.data.organisation_id
                    )
                    .maybeSingle();

            if (!organisation.data) {
                setOrganisationName("No Organisation");
                return;
            }

            setOrganisationName(
                organisation.data.name
            );
        }

        if (!hidden) {
            loadOrganisation();
        }

    }, [pathname, hidden]);

    if (hidden) {
        return (
            <header
                className={styles.whiteHeader}
            ></header>
        );
    }

    return (
        <header className={styles.mainHeader}>

            <Image width={100} height={100} alt="The logo of the portal" src={Logo}></Image>

            <p className={styles.organisationName}>
                {organisationName}
            </p>

            <NavigationBar />

        </header>
    );
}