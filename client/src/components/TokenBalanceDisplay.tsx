import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useBlockchain } from "@/lib/blockchain";

interface TokenBalanceDisplayProps {
  tokenSymbol?: string;
  lastContribution?: string;
}

export default function TokenBalanceDisplay({ 
  tokenSymbol = "CFC", 
  lastContribution = "" 
}: TokenBalanceDisplayProps) {
  const [userTokens, setUserTokens] = useState(0);
  const { isWalletConnected } = useBlockchain();
  
  // Update token balance when wallet connects or contribution changes
  useEffect(() => {
    if (isWalletConnected) {
      // In production, this would fetch the token balance from a contract
      // For demo, we'll just show a random balance plus any contribution
      const baseTokens = 50;
      const contributionTokens = lastContribution ? parseInt(lastContribution) : 0;
      setUserTokens(baseTokens + contributionTokens);
    }
  }, [isWalletConnected, lastContribution]);

  return (
    <Card className="bg-white rounded-lg shadow-sm mb-6">
      <CardContent className="p-6">
        <h2 className="font-heading text-xl font-semibold mb-4">
          <i className="fas fa-coins text-primary mr-2"></i> 
          Seu Saldo de Tokens
        </h2>
        
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
          <div>
            <span className="block text-sm text-gray-600">Saldo Atual</span>
            <span className="text-2xl font-semibold">{userTokens} {tokenSymbol}</span>
          </div>
          
          {lastContribution && (
            <div>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                <i className="fas fa-arrow-up mr-1"></i> +{lastContribution} recentes
              </Badge>
            </div>
          )}
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          <p>Os tokens {tokenSymbol} podem ser utilizados na plataforma para acessar descontos exclusivos, serviços premium e governança do projeto.</p>
        </div>
      </CardContent>
    </Card>
  );
}
