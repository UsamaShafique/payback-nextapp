"use client";

import {
  useAccount,
  useConnect,
  useDisconnect,
  useSignMessage,
  useBalance,
} from "wagmi";

const ConnectWallet = () => {
  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { signMessage, data: signData, error: signError } = useSignMessage();
  const { data: balance } = useBalance({
    address: account?.address,
    chainId: account?.chain?.id,
  });
  const { disconnect } = useDisconnect();
  return (
    <>
      <div>
        <h2>Account</h2>
        <div>
          status: {account.status}
          <br />
          addresses: {JSON.stringify(account.addresses)}
          <br />
          balance: {balance && balance?.formatted}
          <br />
          chainId: {account.chainId}
        </div>

        {account.status === "connected" && (
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
        )}
      </div>

      <div>
        <h2>Connect</h2>
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            type="button"
          >
            {connector.name}
          </button>
        ))}
        <div>{status}</div>
        <div>{error?.message}</div>
      </div>
      <button onClick={() => signMessage({ message: "hello world" })}>
        Sign message
      </button>
      {signData && <div>{signData}</div>}
      {signError && <div>{"User rejected the transaction !!"}</div>}
    </>
  );
};

export default ConnectWallet;
