"use client";

import WebApp from "@twa-dev/sdk";
import { useEffect } from "react";
import { TonConnectButton } from "@tonconnect/ui-react";
import { ConnectWallet } from "@/components/connect-wallet";
import RampPaymentComponent from "@/components/PaymentComponent";

export default function App() {
  useEffect(() => {
    WebApp.ready();
  }, []);

  return (
    <div className="h-full px-6">
      {/* <div className="flex justify-end">
        <TonConnectButton />
      </div>
      <div>
        <RampPaymentInterface />
      </div> */}
      <RampPaymentComponent />
    </div>
  );
}
