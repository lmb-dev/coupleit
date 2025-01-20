import { Cormorant_Garamond, Open_Sans } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";


const cormorantGaramond = Open_Sans({subsets: ["latin"]});

export const metadata: Metadata = {
  title: "Couple It!",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
        <body className={cormorantGaramond.className}>
          {children}
        </body>
    </html>
  );
}
