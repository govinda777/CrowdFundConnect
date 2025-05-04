
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DynamicTokensProps {
  tokenSymbol: string;
  currentPrice: number;
  onPurchase: () => void;
  purchaseHistory: Array<{ wallet: string; tokens: number; price: number }>;
}

export default function DynamicTokens({ 
  tokenSymbol, 
  currentPrice, 
  onPurchase,
  purchaseHistory 
}: DynamicTokensProps) {
  return (
    <Card className="mb-6 bg-emerald-50/50">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <i className="fas fa-coins"></i>
              100 {tokenSymbol} Tokens
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Preço inicial de $1, aumentando $1 a cada compra. Compre agora antes que fique mais caro!
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-semibold text-emerald-600">${currentPrice}</div>
            <div className="text-sm text-gray-500">Próximo: ${currentPrice + 1}</div>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">Histórico de Compras</h3>
          <div className="h-32 overflow-y-auto bg-white rounded-lg border border-gray-100">
            {purchaseHistory.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                <i className="fas fa-history mr-2"></i>
                Seja o primeiro a comprar!
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {purchaseHistory.map((purchase, index) => (
                  <div key={index} className="p-2 text-sm hover:bg-gray-50">
                    <div className="flex justify-between">
                      <span className="text-gray-600 truncate" style={{ maxWidth: "180px" }}>
                        {purchase.wallet}
                      </span>
                      <span className="text-emerald-600 font-medium">
                        ${purchase.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <Button 
          className="w-full bg-emerald-600 hover:bg-emerald-700"
          onClick={onPurchase}
        >
          <i className="fas fa-shopping-cart mr-2"></i>
          Comprar 100 tokens por ${currentPrice}
        </Button>
      </div>
    </Card>
  );
}
