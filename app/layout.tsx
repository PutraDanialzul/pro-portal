import NavigationBar from "../components/layout/navigation-bar";
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
            <header id="main-header">
                <p id="main-logo">Pro-Portal</p>
                <p id="org-name">Organisation's name</p>
                <NavigationBar></NavigationBar>
            </header>
            <div id="content">
                <Sidebar></Sidebar>
                <div id="main">{children}</div>
            </div>
            <footer id="footer">Syntax Terror@2026</footer>
        </body>
    </html>
    );
}