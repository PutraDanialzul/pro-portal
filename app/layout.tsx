import InBody from "../components/layout/in-body";
import MainFooter from "../components/layout/main-footer";
import MainHeader from "../components/layout/main-header";
import Sidebar from "../components/layout/sidebar";
import styles from "./globals.module.css"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pro-Portal",
  description: "A centralized company management platform",
  authors: [ { name: "Syntax Terror" } ]
};


export default function Layout({children}: {children: React.ReactNode}){

    return (
    <html lang="en">
        <body className={styles.pageEnterAnimation}>
            <InBody>
                {children}
            </InBody>
        </body>
    </html>
    );
}