import MainHeader from "../components/layout/main-header";
import Sidebar from "../components/layout/sidebar";
import "./globals.css"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pro-Portal",
  description: "A centralized company management platform",
  authors: [ { name: "Syntax Terror" } ]
};


export default function Layout({children}: {children: React.ReactNode}){

    return (
    <html lang="en">
        <body>
            <div id="in-body">
                <MainHeader></MainHeader>
                <div id="content">
                    <Sidebar></Sidebar>
                    <div id="main">{children}</div>
                </div>
                <footer id="footer">Syntax Terror @ 2026</footer>
            </div>
        </body>
    </html>
    );
}