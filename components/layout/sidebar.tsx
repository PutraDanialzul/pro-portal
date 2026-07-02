'use client';

import { usePathname, useRouter } from "next/navigation";
import "./sidebar-style.css"
import { hidePath } from "../../lib/hide-list";

export default function Sidebar(){

    const pathname = usePathname();

    if(hidePath.includes(pathname)) return (<div hidden></div>);
    else return (
        <nav id="sidebar">
            <a href="/dashboard" className={pathname == "/dashboard" ? "selected" : ""}>DASHBOARD</a>
            <a href="/task" className={pathname == "/task" ? "selected" : ""}>TASK</a>
            <a href="/announcement" className={pathname == "/announcement" ? "selected" : ""}>ANNOUNCEMENT</a>
            <a href="/profile-settings" className={pathname == "/profile-settings" ? "selected" : ""}>SETTINGS</a>
        </nav>
    );
}