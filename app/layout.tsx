import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pro-Portal",
  description: "A centralized company management platform",
  authors: [ { name: "Syntax Terror" } ]
};


export default function Layout({children, }: {children: React.ReactNode}){
    return (
    <html>
        <body>{children}</body>
    </html>
    );
}