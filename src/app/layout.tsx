import "./styles/globals.scss";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { type ReactNode } from "react";
import { cookieToInitialState } from "wagmi";
import { getConfig } from "../wagmi";
import { Providers } from "./providers";
import Script from "next/script";
import { Toaster } from "react-hot-toast"; // <--- import

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mint DAPP",
  description: "From Mint DAPP",
};

export default function RootLayout(props: { children: ReactNode }) {
  const initialState = cookieToInitialState(
    getConfig(),
    headers().get("cookie")
  );

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers initialState={initialState}>
          {props.children}
          <Toaster position="top-right" /> {/* <-- add this here */}
        </Providers>
      </body>
      <Script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
        crossOrigin="anonymous"
      ></Script>
    </html>
  );
}
