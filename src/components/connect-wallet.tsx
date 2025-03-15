import React from "react";
import { QuidaxLogo } from "./quidax-logo";
import { Button } from "./ui/button";
import { TonConnectUI, useTonAddress } from "@tonconnect/ui-react";
import {
  useTonConnectUI,
  useTonConnectModal,
  useTonWallet,
} from "@tonconnect/ui-react";
import { TonConnectButton } from "@tonconnect/ui-react";
import { useRouter } from "next/navigation";

export const ConnectWallet = () => {
  const wallet = useTonWallet();
  const address = useTonAddress();
  const { state, open, close } = useTonConnectModal();
  const [tonConnectUI, setOptions] = useTonConnectUI();
  const router = useRouter();

  const handleClick = async () => {
    await tonConnectUI.disconnect();
    open();
  };
  React.useEffect(() => {
    // if (address.length > 0) {
    //   router.push("/make-payment");
    // }
  }, [tonConnectUI]);

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
          onClick={handleClick}
          id="custom-ton-connect-button"
          text="Connect Ton Wallet"
        />
      </div>
    </div>
  );
};
