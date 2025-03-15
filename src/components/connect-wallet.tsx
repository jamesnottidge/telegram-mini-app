import React from "react";
import { QuidaxLogo } from "./quidax-logo";
import { Button } from "./ui/button";
import { TonConnectUI } from "@tonconnect/ui-react";
import {
  useTonConnectUI,
  useTonConnectModal,
  useTonWallet,
} from "@tonconnect/ui-react";
import { TonConnectButton } from "@tonconnect/ui-react";
import { useRouter } from "next/navigation";

export const ConnectWallet = () => {
  const wallet = useTonWallet();
  const { state, open, close } = useTonConnectModal();
  const router = useRouter();

  React.useEffect(() => {
    if (wallet) router.push("/make-payment");
  }, []);

  return (
    <div className="h-full flex flex-col justify-between">
      <div>
        <QuidaxLogo />

        <div className="mt-11 text-center">
          <p className="text-xl font-medium">Connect your Wallet</p>

          <p className="text-sm mt-7">
            Welcome to Ramp by Quidax. <br></br>
            To continue, connect your TON wallet in a few seconds.
          </p>
        </div>
      </div>
      <div className="flex  flex-col justify-center">
        <Button
          onClick={open}
          id="custom-ton-connect-button"
          text="Connect Ton Wallet"
        />
      
      </div>
    </div>
  );
};
