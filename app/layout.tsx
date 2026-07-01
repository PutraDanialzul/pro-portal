import "./globals.css"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pro-Portal",
  description: "A centralized company management platform",
  authors: [ { name: "Syntax Terror" } ]
};


export default function Layout({children, }: {children: React.ReactNode}){
    return (
    <html lang="en">
        <body>
            <header id="main-header">
                Pro-Portal
                <nav id="nav-bar">
                    <a href=""></a>
                </nav>
            </header>
            {children}
            <footer id="footer">@Syntax Terror</footer>
        </body>
    </html>
    );
}