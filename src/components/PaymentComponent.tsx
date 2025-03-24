"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  SendTransactionRequest,
  useTonConnectUI,
  useTonWallet,
  useTonAddress,
} from "@tonconnect/ui-react";
import { OpenedContract, Cell } from "@ton/core";
import { useRouter } from "next/navigation";
import {
  Address,
  beginCell,
  Sender,
  SenderArguments,
  storeStateInit,
  toNano,
} from "@ton/core";
import { TonConnectUI } from "@tonconnect/ui-react";
import {
  AssetsSDK,
  createApi,
  PinataStorageParams,
} from "@ton-community/assets-sdk";
import { TonConnectButton } from "@tonconnect/ui-react";
import { TonClient } from "@ton/ton";
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { QuidaxLogo } from "./quidax-logo";
import Image from "next/image";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

const USDT_JETTON_MASTER = "0";
const NETWORK = "mainnet";

const generateTransaction = (amount: string, address: string) => {
  const amountInNanoTons = parseInt(amount) * 1_000_000_000;

  const transaction: SendTransactionRequest = {
    validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes
    messages: [
      {
        address: address, // message destination in user-friendly format
        amount: amount, // Toncoin in nanotons
      },
    ],
  };
  return transaction;
};

class TonConnectSender implements Sender {
  /**
   * The TonConnect UI instance.
   * @private
   */
  private readonly provider: TonConnectUI;

  /**
   * The address of the current account.
   */
  public get address(): Address | undefined {
    const address = this.provider.account?.address;
    return address ? Address.parse(address) : undefined;
  }

  /**
   * Creates a new TonConnectSender.
   * @param provider
   */
  public constructor(provider: TonConnectUI) {
    this.provider = provider;
  }

  /**
   * Sends a message using the TonConnect UI.
   * @param args
   */
  public async send(args: SenderArguments): Promise<void> {
    // The transaction is valid for 10 minutes.
    const validUntil = Math.floor(Date.now() / 1000) + 600;

    // The address of the recipient, should be in bounceable format for all smart contracts.
    const address = args.to.toString({ urlSafe: true, bounceable: true });

    // The address of the sender, if available.
    const from = this.address?.toRawString();

    // The amount to send in nano tokens.
    const amount = args.value.toString();

    // The state init cell for the contract.
    let stateInit: string | undefined;
    if (args.init) {
      // State init cell for the contract.
      const stateInitCell = beginCell()
        .store(storeStateInit(args.init))
        .endCell();
      // Convert the state init cell to boc base64.
      stateInit = stateInitCell.toBoc().toString("base64");
    }

    // The payload for the message.
    let payload: string | undefined;
    if (args.body) {
      // Convert the message body to boc base64.
      payload = args.body.toBoc().toString("base64");
    }

    // Send the message using the TonConnect UI and wait for the message to be sent.
    await this.provider.sendTransaction({
      validUntil: validUntil,
      from: from,
      messages: [
        {
          address: address,
          amount: amount,
          stateInit: stateInit,
          payload: payload,
        },
      ],
    });
  }
}

const JETTON_ADDRESS = "EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs";

export default function RampPaymentComponent() {
  const [amount, setAmount] = useState("");
  const [network, setNetwork] = useState("TRC20");
  const [reference, setReference] = useState("");
  const [tonConnectUI, setOptions] = useTonConnectUI();
  const [sender, setSender] = useState<Sender | undefined>();
  const [userWalletBalance, setUserWalletBalance] = useState<number | null>(
    null
  );
  const wallet = useTonWallet();
  const address = useTonAddress();
  const router = useRouter();

  useEffect(() => {
    if (address.length === 0) {
        router.push("/");
    }
  }, [address]);

  const storage: PinataStorageParams = {
    pinataApiKey: process.env.PINATA_API_KEY!,
    pinataSecretKey: process.env.PINATA_SECRET!,
  };

  // Generate a random reference when the component mounts
  function setUserWalletBalanceHelperFunction(balance: bigint) {
    const divisor = BigInt(1000000);
    const wholePart = balance / divisor;
    const remainder = balance % divisor;

    const wholePartFloat = Number(wholePart);
    const remainderFloat = Number(remainder) / Number(divisor);

    const result = wholePartFloat + remainderFloat;

    setUserWalletBalance(result);
  }
  useEffect(() => {
    const generateReference = () => {
      const prefix = "REF_";
      const randomPart =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
      setReference(`${prefix}${randomPart}`);
    };
    generateReference();
  }, []);

  useEffect(() => {
    if (wallet) {
      const newSender = new TonConnectSender(tonConnectUI);
      setSender(newSender);
      console.log(
        "Connected wallet address:",
        wallet.account?.address.toString()
      );
      console.log("Connected wallet address:", wallet.account?.publicKey);
      console.log("Connected wallet address:", wallet.account?.address);
      console.log(
        "Connected wallet address:",
        wallet.account?.address?.toString()
      );
      console.log("Sender address:", newSender.address?.toString());

      const getUSDTBalance = async () => {
        const api = await createApi(NETWORK);
        const sdk = AssetsSDK.create({
          api: api,
          storage: storage,
          sender: newSender,
        });

        console.log("Using wallet", sdk.sender?.address?.toString());
        console.log("Using wallet", sdk.sender?.address?.toRawString());

        const jetton = sdk.openJetton(Address.parse(JETTON_ADDRESS));
        const myJettonWallet = await jetton.getWallet(sdk.sender!.address!);
        const balance = (await myJettonWallet.getData()).balance;
        setUserWalletBalanceHelperFunction(balance);
        console.log(balance);
        return balance;
      };
      getUSDTBalance();
    }
  }, [wallet, tonConnectUI]);

  const sendUSDTTransaction = async ({
    receiverWalletAddress,
    amount,
    comment,
  }: {
    receiverWalletAddress: string;
    amount: string;
    comment: string;
  }) => {
    if (!sender) {
      console.error("Sender not initialized");
      return;
    }
    const api = await createApi(NETWORK);
    const sdk = AssetsSDK.create({
      api: api,
      storage: storage,
      sender: sender,
    });

    console.log("Using wallet", sdk.sender?.address?.toString());
    console.log("Using wallet", sdk.sender?.address?.toRawString());

    const jetton = sdk.openJetton(Address.parse(JETTON_ADDRESS));
    const receiverAddress = Address.parse(receiverWalletAddress);
    const amountInMicroUSDT = BigInt(parseFloat(amount) * 1_000_000); // For USDT (6 decimals)

    // If comment is provided, create a payload cell with the comment
    let forwardPayload: Cell | undefined;
    if (comment) {
      forwardPayload = beginCell()
        .storeUint(0, 32) // operation code 0 for comment
        .storeStringTail(comment) // store the comment
        .endCell();
    }

    const myJettonWallet = await jetton.getWallet(sdk.sender!.address!);

    myJettonWallet.send(sender, receiverAddress, amountInMicroUSDT, {
      notify: { payload: forwardPayload },
    });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value.toString());
  };

  const handleNetworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNetwork(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your payment submission logic here
    console.log("Payment Details:", { amount, network, reference });
    // @ts-expect-error to test run
    window.ramp.initialize({
      // production
      public_key: "pub_15Nh56MseWStT9jKskRZCPYhKFripr41",
      //   staging
      //   public_key: "pub_f1JEanki4Ci8bkCJ8825kYHPFhg9LZSD",
      reference: reference,
      from_currency: "usdt",
      to_currency: "ngn",
      from_amount: amount,
      mode: "sell",
      network: network,
      // @ts-expect-error to test run
      onClose: function (ref) {
        // Handle when the modal is closed
        console.log("onClose", ref);
      },

      // @ts-expect-error to test run
      onSuccess: function (transaction) {
        // Handle when the transaction is successful
        console.log("onSuccess", transaction);
      },

      // @ts-expect-error to test run
      onReceiveWalletDetails: function (walletDetails) {
        console.log("onReceiveWalletDetails", walletDetails);
        sendUSDTTransaction({
          //comment: walletDetails.tag,
          // receiverWalletAddress:  walletDetails.walletAddress,
          receiverWalletAddress:
            "UQCzTH14er4qh4gDlAsgg0NBve7hMpg2fDXR2H52skAKptPY",
          amount: walletDetails.amount,
          comment: "99BCA95095767D281374",
        });
      },
    });
  };

  return (
    <div className="h-full flex flex-col justify-between">
      <div>
        <div>
          <div className="flex justify-end mb-10">
            <TonConnectButton />
          </div>
          <QuidaxLogo />
        </div>

        <div className="mt-11">
          <div className="">
            <h2 className="text-xl font-medium">Make Payment</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="amount"
                  className="block text-xs font-medium  mb-2 mt-4 text-[#201749]"
                >
                  Enter amount
                </label>
                <div className="flex gap-2">
                  <div className="flex justify-center align-center px-4 rounded-lg bg-gray-50 ">
                    <Image
                      src={"/svgs/tether.svg"}
                      width={24}
                      height={24}
                      alt="Tether Logo"
                    />
                  </div>
                  <input
                    disabled={userWalletBalance ? false : true}
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="0.00"
                    className={cn(
                      `w-full px-3 py-2.5 rounded-lg border  bg-gray-50 text-sm h-[48px]
                   focus:outline-none 
                  focus:ring-0 text-[#4C4A45] text-right
                  placeholder-neutral-400 transition-colors duration-200`,
                      Number(amount) > (userWalletBalance ?? 0)
                        ? "border-red-500 focus:border-brand-500"
                        : "border-[#EFEFEF] focus:border-brand-700"
                    )}
                    required
                  />
                </div>
              </div>
              <div className="font-normal text-xs text-[#4C4A55]flex justify-start">
                <span>
                  Available Balance -
                  {userWalletBalance ? (
                    `USDT ${userWalletBalance.toString()} `
                  ) : (
                    <Loader2 className="animate-spin inline ml-1" size={12} />
                  )}
                </span>
              </div>
              <div>
                <label
                  htmlFor="network"
                  className="block text-sm font-medium text-[#201749] mb-2"
                >
                  Network
                </label>
                <p
                  id="network"
                  className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 
                           focus:border-neutral-400 focus:outline-none bg-gray-50
                           focus:ring-0 text-[#4C4A45]
                           appearance-none"
                >
                  TON
                </p>
              </div>
              {/* <button
                type="submit"
                className="w-full py-3 bg-neutral-800 text-white rounded-lg 
                         hover:bg-neutral-700 focus:outline-none 
                         focus:ring-2 focus:ring-neutral-500 
                         transition-colors duration-300"
              >
                Continue to Payment
              </button>
              <button
                className="w-full py-3 bg-neutral-800 text-white rounded-lg 
                         hover:bg-neutral-700 focus:outline-none 
                         focus:ring-2 focus:ring-neutral-500 
                         transition-colors duration-300"
                onClick={() =>
                  sendUSDTTransaction(
                    "UQCzTH14er4qh4gDlAsgg0NBve7hMpg2fDXR2H52skAKptPY",
                    "0.5",
                    "99BCA95095767D281374"
                  )
                }
              >
                Send USDT
              </button> */}
            </form>
          </div>
        </div>
      </div>
      <div>
        <Button
          onClick={handleSubmit}
          text="Continue"
          disabled={
            address.length === 0 ||
            !userWalletBalance ||
            amount === "" ||
            Number(amount) > (userWalletBalance ?? 0)
          }
        />
      </div>
    </div>
  );
}
