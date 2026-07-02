'use client';

import { usePathname, useRouter } from "next/navigation";
import styles from "./sidebar-style.module.css"
import { hidePath } from "../../lib/hide-list";

export default function Sidebar(){

    const pathname = usePathname();
    const router = useRouter();

    if(hidePath.includes(pathname)) return (<div hidden></div>);
    else return (
        <nav className={styles.sidebar}>
            <button className={(pathname == "/dashboard" ? styles.selected : null) + " " + styles.sidebarButton} onClick={() => router.push("/dashboard")}>DASHBOARD</button>
            <button className={(pathname == "/task" ? styles.selected : null) + " " + styles.sidebarButton} onClick={() => router.push("/task")}>TASK</button>
            <button className={(pathname == "/announcement" ? styles.selected : null) + " " + styles.sidebarButton} onClick={() => router.push("/announcement")}>ANNOUNCEMENT</button>
            <button className={(pathname == "/profile-settings" ? styles.selected : null) + " " + styles.sidebarButton} onClick={() => router.push("/profile-settings")}>SETTINGS</button>
        </nav>
    );
}