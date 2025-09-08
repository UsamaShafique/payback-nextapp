import { useAccount  } from "wagmi";
import { useState } from "react";
import { WalletModal } from "./WalletModal";

interface WalletButtonProps {
  className?: string; // allows custom styling
}

export const WalletButton: React.FC<WalletButtonProps> = ({ className }) => {
  const { isConnected } = useAccount();
  const [open, setOpen] = useState(false);

  return (
    <>
      {!isConnected && (
        <button
          className={className || "connectbtn"}
          onClick={() => setOpen(true)}
        >
          Connect Wallet
        </button>
      )}

      <WalletModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};
