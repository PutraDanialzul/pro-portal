'use client';

import { usePathname, useRouter } from "next/navigation";

import styles from "./sidebar-style.module.css";

import { hidePath } from "../../lib/hide-list";

export default function Sidebar() {

    const pathname = usePathname();
    const router = useRouter();

    if (hidePath.includes(pathname)) {
        return null;
    }

    const pages = [
        {
            label: "DASHBOARD",
            path: "/dashboard"
        },
        {
            label: "TASK",
            path: "/task"
        },
        {
            label: "ANNOUNCEMENT",
            path: "/announcement"
        },
        {
            label: "ORGANISATION",
            path: "/organisation/settings"
        },
        {
            label: "SETTINGS",
            path: "/profile-settings"
        }
    ];

    return (
        <nav className={styles.sidebar}>
            {
                pages.map((page) => (
                    <button
                        key={page.path}
                        className={
                            `${styles.sidebarButton} ${
                                pathname === page.path
                                    ? styles.selected
                                    : ""
                            }`
                        }
                        onClick={() =>
                            router.push(page.path)
                        }
                    >
                        {page.label}
                    </button>
                ))
            }
        </nav>
    );
}