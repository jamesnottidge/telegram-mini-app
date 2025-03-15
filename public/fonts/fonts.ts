import localFont from "next/font/local";

export const UncutSans = localFont({
  src: [
    {
      path: "./UncutSans-Variable.woff2",
      style: "normal",
    },
    {
      path: "./UncutSans-Variable.woff2",
      style: "italic",
    },
  ],
  variable: "--font-uncut-sans",
  display: "swap",
});

