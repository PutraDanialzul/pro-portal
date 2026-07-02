'use client';

import styles from "./footer-style.module.css"

import { usePathname } from "next/navigation";
import { hidePath } from "../../lib/hide-list";

export default function MainFooter(){

    const pathname = usePathname();

    const hide = hidePath.includes(pathname);

    return (
        <footer className={hide ? styles.whiteFooter : styles.mainFooter}>Syntax Terror @ 2026</footer>
    );
}