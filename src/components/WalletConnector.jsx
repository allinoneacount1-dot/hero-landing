import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

export default function WalletConnector() {
  const { publicKey, connected, disconnect } = useWallet();
  const { setVisible } = useWalletModal();

  if (connected && publicKey) {
    const addr = publicKey.toBase58();
    return (
      <button
        onClick={() => disconnect()}
        className="text-[14px] font-normal text-white/70 hover:text-white transition-colors"
      >
        {addr.slice(0, 4)}...{addr.slice(-4)}
      </button>
    );
  }

  return (
    <button
      onClick={() => setVisible(true)}
      className="text-[14px] font-normal text-white/70 hover:text-white transition-colors"
    >
      Connect Wallet
    </button>
  );
}
