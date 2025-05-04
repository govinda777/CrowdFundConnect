import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useBlockchain } from "@/lib/blockchain";
import { shortenAddress } from "@/lib/utils";

export default function Navbar() {
  const { connectWallet, walletAddress, isWalletConnected } = useBlockchain();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/">
              <div className="flex-shrink-0 flex items-center cursor-pointer">
                <div className="h-8 w-8 bg-gradient-to-r from-primary to-secondary rounded-md"></div>
                <span className="ml-2 text-xl font-heading font-semibold">TourChain</span>
              </div>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/">
                <a className="border-primary text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Home
                </a>
              </Link>
              <Link href="/crowdfunding">
                <a className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Explore
                </a>
              </Link>
              <a href="#about" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                About
              </a>
            </div>
          </div>
          <div className="flex items-center">
            <Button 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              onClick={connectWallet}
            >
              <i className="fas fa-wallet mr-2"></i> 
              {isWalletConnected ? shortenAddress(walletAddress) : "Connect Wallet"}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
