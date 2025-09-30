import { http, cookieStorage, createConfig, createStorage } from "wagmi";
import { sepolia, mainnet } from "wagmi/chains";
import { metaMask, walletConnect } from "wagmi/connectors";

const isDev = process.env.NEXT_PUBLIC_ENV === "development";
export const activeChain: any = isDev ? sepolia : mainnet;

export const config = createConfig({
  chains: [activeChain],
  connectors: [
    metaMask(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID!,
    }),
  ],
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  transports: {
    [activeChain.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
