'use client';

import { usePathname } from "next/navigation";
import styles from "./in-body.styles.module.css"
import { hidePath } from "../../lib/hide-list";
import MainHeader from "./main-header";
import MainFooter from "./main-footer";
import Sidebar from "./sidebar";
import { useEffect, useState } from "react";

export default function InBody({children}){
    const pathname = usePathname();
    const specialColoured = hidePath.includes(pathname);
    return <div key={pathname} className={styles.pageEnterAnimation + " " + (specialColoured ? styles.inBody + " " + styles.specialColoured : styles.inBody)}>
        <MainHeader></MainHeader>
            {
                specialColoured ? <div>{children}</div> : (
                    <div id="content">
                        <Sidebar></Sidebar>
                        <div id="main">{children}</div>
                    </div>
                )
            }
        <MainFooter></MainFooter>
    </div>
}