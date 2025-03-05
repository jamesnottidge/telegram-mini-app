"use client";

import React, { useState, useEffect } from "react";

export default function RampPaymentInterface() {
  const [amount, setAmount] = useState("");
  const [network, setNetwork] = useState("TRC20");
  const [reference, setReference] = useState("");

  // Generate a random reference when the component mounts
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

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
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
      // public_key: "pub_wHtXwSiKAweN6eNYPDeseXHHNE45ucEw",
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
        console.log(walletDetails.amount);
        alert(walletDetails.walletAddress);
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="amount"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Amount (USDT)
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Enter amount"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="network"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Select Network
            </label>
            <select
              id="network"
              value={network}
              onChange={handleNetworkChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="TRC20">TRC20</option>
              <option value="ERC20">ERC20</option>
              <option value="BEP20">BEP20</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition duration-300"
          >
            Pay with Ramp
          </button>

          <div className="mt-4 text-center text-sm text-gray-500">
            Reference: {reference}
          </div>
        </form>
      </div>
    </div>
  );
}
