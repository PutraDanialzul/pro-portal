'use client';

import "./header-style.css"

import NavigationBar from "./navigation-bar";
import Logo from "../../logo.png";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { hidePath } from "../../lib/hide-list";

export default function MainHeader(){

    const pathname = usePathname();

    const hide = hidePath.includes(pathname);

    if(!hide) return (
        <header id="main-header">
            <Image loading="eager" src={Logo} alt="The logo of the site" width="100" height="100"></Image>
            <p id="org-name">Organisation's name</p>
            <NavigationBar></NavigationBar>
        </header>
    )
    else return (<header id="main-header"></header>);
}