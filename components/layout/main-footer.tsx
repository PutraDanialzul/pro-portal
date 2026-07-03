'use client';

import { usePathname } from "next/navigation";

import styles from "./footer-style.module.css";

import { hidePath } from "../../lib/hide-list";

export default function MainFooter() {

    const pathname = usePathname();

    const specialPage =
        hidePath.includes(pathname);

    return (
        <footer
            className={
                specialPage
                    ? styles.whiteFooter
                    : styles.mainFooter
            }
        >
            Syntax Terror © 2026
        </footer>
    );
}