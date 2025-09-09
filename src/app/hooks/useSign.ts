import { useState } from 'react';
import { useSignMessage } from 'wagmi';

export const useSign = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signMessageAsync, isPending: isLoading } = useSignMessage();

  const openModal = () => {
    setIsOpen(true);
    setError(null);
  };

  const closeModal = () => {
    setIsOpen(false);
    setError(null);
  };

  const handleSign = async (message: string) => {
    try {
      setError(null);
      const signature = await signMessageAsync({ message });
      console.log('Signed:', signature);
      setIsOpen(false);
      return signature;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign');
    }
  };

  return {
    isOpen,
    isLoading,
    error,
    openModal,
    closeModal,
    handleSign,
  };
};