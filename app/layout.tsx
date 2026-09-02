import type { ReactNode } from "react";
import "./globals.css";
export const metadata={title:"Falcon Bench Club",description:"Private training, competition, and custom workout headquarters."};
export default function RootLayout({children}:{children:ReactNode}){return <html lang="en"><body>{children}</body></html>;}
