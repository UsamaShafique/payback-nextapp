import React, { useEffect, useCallback, useState } from "react";
import { useConnect } from "wagmi";
import "@/style/walletModal.scss"; 
interface WalletModalProps {
  open: boolean;
  onClose: () => void;
}

const WALLET_LOGOS: Record<string, string> = {
  MetaMask: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/metamask-icon.png",
  WalletConnect: "https://images.seeklogo.com/logo-png/43/1/walletconnect-logo-png_seeklogo-430923.png",
  
};

export const WalletModal: React.FC<WalletModalProps> = ({ open, onClose }) => {
  const { connectors, connect, error } = useConnect();
  const [loadingConnector, setLoadingConnector] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  useEffect(() => {
    if (open) {
      setConnectionError(null);
    }
  }, [open]);

  const handleConnect = async (connector: any) => {
    if (loadingConnector) return;

    setLoadingConnector(connector.id);
    setConnectionError(null);

    try {
      await connect({ connector });
      onClose();
    } catch (err) {
      console.error("Wallet connection failed:", err);
      setConnectionError(
        err instanceof Error
          ? err.message
          : "Failed to connect wallet. Please try again."
      );
    } finally {
      setLoadingConnector(null);
    }
  };

  if (!open) return null;

  return (
    <div
      className="wallet-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="wallet-modal-title"
    >
      <div
        className="wallet-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="wallet-modal-title" className="wallet-modal-title">
          Connect Wallet
        </h2>

        {(connectionError || error) && (
          <div className="wallet-error" role="alert">
            {connectionError || error?.message || "Connection failed"}
          </div>
        )}

        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {connectors.map((connector) => {
            const isLoading = loadingConnector === connector.id;
            const logo = WALLET_LOGOS[connector.name];

            return (
              <button
                key={connector.id}
                onClick={() => handleConnect(connector)}
                disabled={!!loadingConnector}
                className="wallet-option"
                aria-label={`Connect ${connector.name} wallet`}
              >
                {logo ? (
                  <img
                    src={logo}
                    alt={`${connector.name} logo`}
                    className="wallet-logo"
                  />
                ) : (
                  <div className="wallet-icon-placeholder">
                    {connector.name.charAt(0)}
                  </div>
                )}

                <span style={{ flex: 1 }}>
                  {isLoading ? "Connecting..." : connector.name}
                </span>

                {isLoading && <div className="wallet-loading-spinner" />}
              </button>
            );
          })}
        </div>

        <button onClick={onClose} className="wallet-cancel" aria-label="Cancel and close modal">
          Cancel
        </button>
      </div>
    </div>
  );
};
