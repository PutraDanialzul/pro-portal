'use client';

import { usePathname } from "next/navigation";

import styles from "./in-body.styles.module.css";

import { hidePath } from "../../lib/hide-list";

import MainHeader from "./main-header";
import MainFooter from "./main-footer";
import Sidebar from "./sidebar";

export default function InBody({
    children
}: {
    children: React.ReactNode;
}) {

    const pathname = usePathname();

    const specialPage =
        hidePath.includes(pathname);

    return (
        <div
            key={pathname}
            className={`
                ${styles.inBody}
                ${styles.pageEnterAnimation}
                ${
                    specialPage
                        ? styles.specialColoured
                        : ""
                }
            `}
        >

            <MainHeader />

            {
                specialPage ? (
                    <div>
                        {children}
                    </div>
                ) : (
                    <div className={styles.middle}>

                        <Sidebar />

                        <main id="main" className={styles.mainContent}>
                            {children}
                        </main>

                    </div>
                )
            }

            <MainFooter />

        </div>
    );
}