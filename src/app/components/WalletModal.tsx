"use client";
import React, { useState } from "react";
import { useConnect} from "wagmi";
import { getConnections, switchChain } from "@wagmi/core";
import { activeChain, config } from "@/wagmi";
import { WalletLogo } from "./icons/WalletLogo";
import "../styles/walletModal.scss";
import { Modal } from "react-bootstrap";
import { useIsMobile } from "../hooks/useIsMobile";
interface WalletModalProps {
  open: boolean;
  onClose: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({ open, onClose }) => {
  const { connectors, connectAsync, error } = useConnect();

  const [loadingConnector, setLoadingConnector] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const handleConnect = async (connector: (typeof connectors)[number]) => {
    if (loadingConnector) return;

    setLoadingConnector(connector.id);
    setConnectionError(null);

    try {
      await connectAsync({ connector });
      const connections = getConnections(config);

      if (
        connections[0]?.connector &&
        connections[0]?.chainId !== activeChain.id
      ) {
        await switchChain(config, {
          connector: connections[0].connector,
          chainId: activeChain.id,
        });
      }

      onClose();
    } catch (err) {
      setConnectionError(
        err instanceof Error ? err.message : "Connection or signing failed"
      );
    } finally {
      setLoadingConnector(null);
    }
  };
  const isMobile = useIsMobile();

  if (!open) return null;

  return (
    <Modal show={open} onHide={onClose} centered className="wallet-modal">
      <Modal.Body>
        <h2 id="wallet-modal-title" className="wallet-modal-title">
          Connect Wallet
        </h2>

        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          {connectors
            ?.filter(
              (connector) =>
                !(
                  isMobile &&
                  (connector.id === "io.metamask" ||
                    connector.name === "MetaMask")
                )
            )
            ?.map((connector) => {
              const isLoading = loadingConnector === connector.id;

              return (
                <button
                  key={connector.id}
                  onClick={() => handleConnect(connector)}
                  disabled={!!loadingConnector}
                  className="wallet-option"
                  aria-label={`Connect ${connector.name} wallet`}
                >
                  <WalletLogo name={connector.name} />

                  <span style={{ flex: 1 }}>
                    {isLoading ? "Connecting..." : connector.name}
                  </span>

                  {isLoading && <div className="wallet-loading-spinner" />}
                </button>
              );
            })}
        </div>

        {(connectionError || error) && (
          <div className="wallet-error" role="alert">
            {connectionError || error?.message || "Connection failed"}
          </div>
        )}

        <button
          onClick={onClose}
          className="wallet-cancel"
          aria-label="Cancel and close modal"
        >
          Cancel
        </button>
      </Modal.Body>
    </Modal>
  );
};
