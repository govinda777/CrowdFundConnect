import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { shortenAddress } from "@/lib/utils";

interface BlockchainDemoProps {
  contractAddress?: string;
  networkName?: string;
  verified?: boolean;
}

export default function BlockchainDemo({ 
  contractAddress = "0x7Da37534E347561BEfC711F1a0dCFcb70735F268",
  networkName = "Ethereum (Sepolia Testnet)",
  verified = true
}: BlockchainDemoProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Card className="bg-white rounded-lg shadow-sm mb-6">
      <CardContent className="p-6">
        <h2 className="font-heading text-xl font-semibold mb-4">Informações do Contrato</h2>
        
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600">Contrato</span>
            <div className="flex items-center">
              <span className="font-mono text-sm truncate max-w-[200px]">{shortenAddress(contractAddress, 10)}</span>
              <button 
                className="ml-2 text-primary hover:text-primary/80" 
                aria-label="Copy address"
                onClick={() => copyToClipboard(contractAddress)}
              >
                <i className="fas fa-copy"></i>
              </button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600">Rede</span>
            <span className="font-medium">{networkName}</span>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600">Verificado</span>
            {verified ? (
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                <i className="fas fa-check-circle mr-1"></i> Verificado no Etherscan
              </Badge>
            ) : (
              <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                <i className="fas fa-exclamation-circle mr-1"></i> Não verificado
              </Badge>
            )}
          </div>
        </div>
        
        <div className="mt-4">
          <a 
            href={`https://sepolia.etherscan.io/address/${contractAddress}`} 
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 text-sm flex items-center"
          >
            <i className="fas fa-external-link-alt mr-1"></i> Ver no Etherscan
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
