"use client";

import WebApp from "@twa-dev/sdk";
import { useEffect } from "react";
import { TonConnectButton } from "@tonconnect/ui-react";
import RampPaymentInterface from "@/components/PaymentComponent";

export default function App() {
  useEffect(() => {
    WebApp.ready();
  }, []);

  return (
    <div>
      <div className="flex justify-end">
        <TonConnectButton />
      </div>
      <h1>My App</h1>
      <div>
        <RampPaymentInterface />
      </div>
    </div>
  );
}
