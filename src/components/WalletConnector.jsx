import { useAccount, useConnect, useDisconnect } from "wagmi";

export default function WalletConnector() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <button
        onClick={() => disconnect()}
        className="text-[14px] font-normal text-white/70 hover:text-white transition-colors"
      >
        {address.slice(0, 6)}...{address.slice(-4)}
      </button>
    );
  }

  return (
    <button
      onClick={() => connect()}
      className="text-[14px] font-normal text-white/70 hover:text-white transition-colors"
    >
      Connect Wallet
    </button>
  );
}
