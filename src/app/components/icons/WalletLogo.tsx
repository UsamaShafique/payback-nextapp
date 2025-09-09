import React from "react";

interface WalletLogoProps {
  name: string;
}

const WALLET_LOGOS: Record<string, string> = {
  MetaMask:
    "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/metamask-icon.png",
  WalletConnect:
    "https://images.seeklogo.com/logo-png/43/1/walletconnect-logo-png_seeklogo-430923.png",
};

export const WalletLogo: React.FC<WalletLogoProps> = ({ name }) => {
  const logo = WALLET_LOGOS[name];

  return logo ? (
    <img src={logo} alt={`${name} logo`} className="wallet-logo" />
  ) : (
    <div className="wallet-icon-placeholder">{name.charAt(0)}</div>
  );
};
