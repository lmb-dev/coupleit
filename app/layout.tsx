import { Lora, Merienda } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google'
import type { Metadata } from "next";
import "./globals.css";

const lora = Lora({ subsets: ["latin"] });
const merienda = Merienda({ subsets: ["latin"], variable: "--merienda" });

export async function generateMetadata(): Promise<Metadata> {  
  return {
    title: "Couple It!",
    description: "Guess the rhyming word in today's poem!"
  };
};


export default function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>        
        <GoogleAnalytics gaId="G-WHM01C4GG3" />
      </head>

      <body className={`${lora.className} ${merienda.variable}`}>
        {children}
      </body>
    </html>
  );
}
