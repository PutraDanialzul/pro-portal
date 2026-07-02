'use client';

import styles from "./header-style.module.css"

import NavigationBar from "./navigation-bar";
import Logo from "../../logo.png";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { hidePath } from "../../lib/hide-list";

export default function MainHeader(){

    const pathname = usePathname();

    const hide = hidePath.includes(pathname);

    if(!hide) return (
        <header className={styles.mainHeader}>
            <Image loading="eager" src={Logo} className={styles.logo} alt="The logo of the site" width="100" height="100"></Image>
            <p className={styles.organisationName}>Organisation's name</p>
            <NavigationBar></NavigationBar>
        </header>
    )
    else return (<header className={styles.whiteHeader}></header>);
}