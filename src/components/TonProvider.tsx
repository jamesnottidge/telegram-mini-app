"use client";
import { TonConnectUIProvider } from "@tonconnect/ui-react";



export default function TonProvider({ children }: {
    children: React.ReactNode;
}) {
    return (
        <TonConnectUIProvider
        manifestUrl="https://telegram-mini-app-one-theta.vercel.app/manifest.json"
        >
            {children}
        </TonConnectUIProvider>
    );
}