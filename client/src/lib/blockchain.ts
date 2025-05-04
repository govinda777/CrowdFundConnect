import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

// Types for blockchain provider and hook returns
interface BlockchainContextType {
  connectWallet: () => Promise<void>;
  walletAddress: string;
  isWalletConnected: boolean;
  isDevelopment: boolean;
}

interface BlockchainProviderProps {
  children: ReactNode;
}

// Type definitions for blockchain functionality
export interface Campaign {
  id: number;
  title: string;
  description: string;
  fundingGoal: string;
  raisedAmount: string;
  deadline: string;
  creator: string;
  contributorsCount: number;
  isActive: boolean;
}

interface TourCrowdfundingContextType {
  getCampaign: (id: number) => Promise<Campaign | null>;
  getCampaignRewards: (id: number) => Promise<any[]>;
  pledge: (
    campaignId: number, 
    amount: string, 
    rewardId: number,
    name: string,
    email: string,
    note: string,
    isAnonymous: boolean
  ) => Promise<boolean>;
  isLoading: boolean;
  isProcessing: boolean;
}

// Create blockchain context
const BlockchainContext = createContext<BlockchainContextType>({
  connectWallet: async () => {},
  walletAddress: '',
  isWalletConnected: false,
  isDevelopment: true
});

// Create crowdfunding context
const TourCrowdfundingContext = createContext<TourCrowdfundingContextType>({
  getCampaign: async () => null,
  getCampaignRewards: async () => [],
  pledge: async () => false,
  isLoading: false,
  isProcessing: false
});

// Mock data for demonstration purposes
const mockCampaign: Campaign = {
  id: 1,
  title: "TourChain: Revolução nas Viagens Corporativas",
  description: "Ajude a construir o futuro das viagens corporativas com blockchain, bem-estar e sustentabilidade.",
  fundingGoal: "100000000000000000000000", // 100,000 in wei
  raisedAmount: "67500000000000000000000", // 67,500 in wei
  deadline: (Math.floor(Date.now() / 1000) + 18 * 24 * 60 * 60).toString(), // 18 days from now
  creator: "0x7Da37534E347561BEfC711F1a0dCFcb70735F268",
  contributorsCount: 285,
  isActive: true
};

// Implementation of blockchain provider
export function BlockchainProvider({ children }: BlockchainProviderProps) {
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const { toast } = useToast();
  const isDevelopment = true;  // Set to true for mock setup

  // Simulated wallet connection
  const connectWallet = async () => {
    // Simulate a brief loading time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate a random wallet address for simulation
    const mockAddress = '0x' + Array.from({length: 40}, () => 
      Math.floor(Math.random() * 16).toString(16)).join('');
    
    setWalletAddress(mockAddress);
    setIsWalletConnected(true);
    
    toast({
      title: "Carteira Conectada",
      description: "Conexão simulada estabelecida com sucesso.",
    });
  };

  // Implement tour crowdfunding functionality
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const getCampaign = async (id: number): Promise<Campaign | null> => {
    setIsLoading(true);
    try {
      // In production, this would make a call to the blockchain
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockCampaign);
          setIsLoading(false);
        }, 500);
      });
    } catch (error) {
      console.error("Error fetching campaign:", error);
      setIsLoading(false);
      return null;
    }
  };

  const getCampaignRewards = async (id: number): Promise<any[]> => {
    // This would fetch rewards from the blockchain contract
    return [];
  };

  const pledge = async (
    campaignId: number, 
    amount: string, 
    rewardId: number,
    name: string,
    email: string,
    note: string,
    isAnonymous: boolean
  ): Promise<boolean> => {
    setIsProcessing(true);
    try {
      // In production, this would make a transaction on the blockchain
      // For now, we'll just simulate a successful transaction
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('Pledge transaction:', {
            campaignId,
            amount,
            rewardId,
            name,
            email,
            note,
            isAnonymous
          });
          toast({
            title: "Transaction Successful",
            description: `You have contributed ${amount} to the campaign!`,
          });
          resolve(true);
          setIsProcessing(false);
        }, 1500);
      });
    } catch (error) {
      console.error("Error making pledge:", error);
      toast({
        title: "Transaction Failed",
        description: "There was an error processing your contribution.",
        variant: "destructive"
      });
      setIsProcessing(false);
      return false;
    }
  };

  // TourCrowdfunding context value
  const tourCrowdfundingValue = {
    getCampaign,
    getCampaignRewards,
    pledge,
    isLoading,
    isProcessing
  };

  const blockchainValue = { connectWallet, walletAddress, isWalletConnected, isDevelopment };
  
  return (
    React.createElement(BlockchainContext.Provider, { value: blockchainValue },
      React.createElement(TourCrowdfundingContext.Provider, { value: tourCrowdfundingValue },
        children
      )
    )
  );
}

// Hooks to use the contexts
export const useBlockchain = () => useContext(BlockchainContext);
export const useTourCrowdfunding = () => useContext(TourCrowdfundingContext);
