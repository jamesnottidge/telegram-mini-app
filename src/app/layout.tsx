import type { Metadata } from "next";
import localFont from "next/font/local";
import TonProvider from "@/components/TonProvider";
import Script from "next/script";
import "./globals.css";
import { UncutSans } from "../../public/fonts/fonts";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${UncutSans.className} antialiased`}>
        <Script
          src="https://d309lcjd52k0i0.cloudfront.net/ramp.js"
          strategy="beforeInteractive"
        />
        <TonProvider>
          <div className="flex justify-center items-center w-full h-[100vh] bg-red-50 py-2">
            <div className="h-full max-h-[812px]  max-w-[400px] w-full">
              {children}
            </div>
          </div>
        </TonProvider>
      </body>
    </html>
  );
}
