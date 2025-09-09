import { http, cookieStorage, createConfig, createStorage } from "wagmi";
import { sepolia } from "wagmi/chains";
import { metaMask, walletConnect } from "wagmi/connectors";

export function getConfig() {
  return createConfig({
    chains: [sepolia],
    connectors: [
      metaMask(),
      walletConnect({
        projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID!, // projectID Loaded directly from .env
      }),
    ],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [sepolia.id]: http(),
    },
  });
}

declare module "wagmi" {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}

export const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
});
