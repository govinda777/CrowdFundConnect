import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BlockchainDemoProps {
  contractAddress: string;
  networkName: string;
  verified?: boolean;
}

export default function BlockchainDemo({ contractAddress, networkName, verified = false }: BlockchainDemoProps) {
  return (
    <Card className="mb-6">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <i className="fas fa-cube"></i>
          Demonstração da Integração Blockchain
        </h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Status da Integração</h3>
            <div className="flex gap-2 flex-wrap">
              <Badge className="bg-blue-100 text-blue-800">Status: Ativo</Badge>
              <Badge className="bg-green-100 text-green-800">Rede: {networkName}</Badge>
              <Badge className="bg-orange-100 text-orange-800">Bloco: #15238921</Badge>
              {verified && (
                <Badge className="bg-emerald-100 text-emerald-800">
                  <i className="fas fa-check-circle mr-1"></i> Verificado
                </Badge>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Modo de Desenvolvimento</h3>
            <p className="text-sm text-gray-600">
              Ambiente de simulação para testes de integração
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Notas & Referências</h3>
            <ul className="list-disc pl-4 text-sm text-gray-600 space-y-1">
              <li>Ambiente simulado configurado para teste</li>
              <li>Transações processadas em ambiente seguro</li>
              <li>Dados armazenados localmente para demonstração</li>
              <li>Use o modo de teste para simular sua carteira</li>
            </ul>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Contrato: {contractAddress}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}