import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useBlockchain, useTourCrowdfunding } from "@/lib/blockchain";
import {
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TokenBalanceDisplay from "@/components/TokenBalanceDisplay";
import BlockchainDemo from "@/components/BlockchainDemo";
import { formatCurrency } from "@/lib/utils";

export default function CrowdfundingPage() {
  const { toast } = useToast();
  const [pledgeAmount, setPledgeAmount] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isWalletConnecting, setIsWalletConnecting] = useState(false);
  const [paymentTab, setPaymentTab] = useState<"crypto" | "traditional">("crypto");
  const [isPledgeSubmitting, setIsPledgeSubmitting] = useState(false);
  const [tokenPrice, setTokenPrice] = useState(1); // Initial price of $1
  const [tokensPurchased, setTokensPurchased] = useState<Array<{wallet: string, tokens: number, price: number}>>([]);
  const [lastContribution, setLastContribution] = useState<string>("");
  
  // Define interface for reward types
  interface RewardTier {
    id: string;
    title: string;
    amount: number;
    tokenAmount: number;
    description: string;
    claimed: number;
    limit: number;
    contractId: string;
    isDynamic?: boolean;
  }

  // Get blockchain context
  const { connectWallet, walletAddress: blockchainWalletAddress, isWalletConnected, isDevelopment } = useBlockchain();
  
  // Get email from sessionStorage if available
  useEffect(() => {
    const storedEmail = sessionStorage.getItem('userEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);
  
  // Use crowdfunding hook
  const { getCampaign, getCampaignRewards, pledge, isLoading: isLoadingCampaign, isProcessing } = useTourCrowdfunding();
  
  // State to store campaign data
  const [campaign, setCampaign] = useState({
    title: "TourChain: Revolução nas Viagens Corporativas",
    description: "Ajude a construir o futuro das viagens corporativas com blockchain, bem-estar e sustentabilidade.",
    goal: 100000,
    raised: 67500,
    backers: 285,
    daysLeft: 18,
    tokenSymbol: "TOUR",
    contractAddress: "0x7Da37534E347561BEfC711F1a0dCFcb70735F268",
    networkName: "Ethereum (Sepolia Testnet)",
    featuredImage: "bg-gradient-to-r from-primary to-secondary"
  });
  
  // Load campaign data on component init
  useEffect(() => {
    async function loadCampaignData() {
      try {
        // Fixed campaign ID for demonstration
        const campaignId = 1;
        
        // Get campaign data from contract
        const campaignData = await getCampaign(campaignId);
        
        // Update state if data is available
        if (campaignData) {
          // Calculate days left
          const now = Math.floor(Date.now() / 1000);
          const deadline = Number(campaignData.deadline);
          const daysLeft = Math.max(0, Math.floor((deadline - now) / (24 * 60 * 60)));
          
          setCampaign({
            ...campaign,
            title: campaignData.title,
            description: campaignData.description,
            goal: Number(campaignData.fundingGoal) / 10**18,
            raised: Number(campaignData.raisedAmount) / 10**18,
            backers: campaignData.contributorsCount,
            daysLeft,
            contractAddress: campaignData.creator
          });
        }
      } catch (error) {
        console.error("Error loading campaign data:", error);
        toast({
          title: "Error loading data",
          description: "Could not get the latest campaign information.",
          variant: "destructive"
        });
      }
    }
    
    // Load data only if not in development mode
    if (!isDevelopment) {
      loadCampaignData();
    }
  }, []);

  // Dynamic reward (1 dollar for 100 tokens, increasing 1 dollar with each sale)
  const dynamicReward: RewardTier = {
    id: "dynamic-tokens",
    title: "Tokens Dinâmicos",
    amount: tokenPrice,
    tokenAmount: 100,
    description: "Compre 100 tokens por um preço que aumenta US$ 1 a cada compra. Quanto mais cedo você comprar, mais econômico será!",
    claimed: tokensPurchased.length,
    limit: 1000,
    contractId: "0xDYN",
    isDynamic: true
  };
  
  const rewardTiers: RewardTier[] = [
    dynamicReward,
    {
      id: "early-access",
      title: "Acesso Antecipado",
      amount: 250,
      tokenAmount: 500,
      description: "Seja um dos primeiros a utilizar a plataforma TourChain com acesso prioritário e suporte VIP por 3 meses.",
      claimed: 87,
      limit: 150,
      contractId: "0x001"
    },
    {
      id: "corporate-package",
      title: "Pacote Corporativo",
      amount: 1000,
      tokenAmount: 2000,
      description: "Licença para até 10 usuários por 6 meses, incluindo acesso a todas as funcionalidades de otimização de custos com IA.",
      claimed: 42,
      limit: 100,
      contractId: "0x002"
    },
    {
      id: "strategic-partner",
      title: "Parceiro Estratégico",
      amount: 5000,
      tokenAmount: 10000,
      description: "Torne-se um parceiro estratégico com acesso ilimitado por 1 ano e participe das reuniões de desenvolvimento de produto.",
      claimed: 12,
      limit: 25,
      contractId: "0x003"
    }
  ];

  const handlePledge = (amount: string, rewardId: string | null = null) => {
    setPledgeAmount(amount);
    setSelectedReward(rewardId);
    setIsDialogOpen(true);
  };

  // Method to connect wallet
  const handleConnectWallet = async () => {
    setIsWalletConnecting(true);
    
    try {
      await connectWallet();
      
      toast({
        title: "Wallet Connected",
        description: `Successfully connected to your Web3 wallet`,
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Error",
        description: "Could not connect to your wallet. Make sure you have MetaMask installed.",
        variant: "destructive"
      });
    } finally {
      setIsWalletConnecting(false);
    }
  };
  
  // Update local state when wallet address changes in provider
  useEffect(() => {
    if (blockchainWalletAddress) {
      setWalletAddress(blockchainWalletAddress);
    }
  }, [blockchainWalletAddress]);

  // Function to process pledge/contribution
  const handleCompletePledge = async () => {
    // Basic validation
    if (paymentTab === "traditional" && (!name || !email)) {
      toast({
        title: "Incomplete Data",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    if (paymentTab === "crypto" && !walletAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to continue.",
        variant: "destructive"
      });
      return;
    }
    
    setIsPledgeSubmitting(true);
    
    try {
      // Check if it's a dynamic token package purchase
      const isDynamicTokenPurchase = selectedReward === "dynamic-tokens";
      
      if (paymentTab === "crypto") {
        // Use crowdfunding hook to interact with contract
        // Campaign number is fixed for demonstration (1)
        const campaignId = 1;
        const rewardId = isDynamicTokenPurchase ? 1 : Number(selectedReward?.replace(/[^\d]/g, '') || 1);
        
        // Call the pledge function from the hook, which handles smart contract interaction
        const success = await pledge(
          campaignId,
          pledgeAmount,
          rewardId,
          name || "Anonymous",
          email || "",
          "Via TourChain Web App",
          name ? false : true // Is anonymous if no name
        );
        
        if (success) {
          // If it's a dynamic token purchase, update price and record purchase
          if (isDynamicTokenPurchase) {
            setTokensPurchased(prev => [...prev, {
              wallet: walletAddress,
              tokens: 100,
              price: tokenPrice
            }]);
            setTokenPrice(prev => prev + 1); // Increase price by 1 dollar
            setLastContribution("100");
          } else {
            // Set last contribution to display in TokenBalanceDisplay
            setLastContribution(pledgeAmount);
          }
          
          // Close dialog after successful transaction
          setIsDialogOpen(false);
        }
      } else {
        // For traditional payment, keep same implementation with API
        const response = await fetch("/api/pledge", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            amount: Number(pledgeAmount),
            rewardId: selectedReward,
            isAnonymous: false
          }),
          credentials: "include",
        });
        
        if (!response.ok) {
          throw new Error("Failed to process payment");
        }
        
        // Store user email for future use
        if (email) {
          sessionStorage.setItem('userEmail', email);
        }
        
        // If it's a dynamic token purchase, update price and record purchase
        if (isDynamicTokenPurchase) {
          setTokensPurchased(prev => [...prev, {
            wallet: name || email, // Use name or email as identifier
            tokens: 100,
            price: tokenPrice
          }]);
          setTokenPrice(prev => prev + 1); // Increase price by 1 dollar
          setLastContribution("100");
          
          toast({
            title: "Token Purchase Confirmed!",
            description: `You acquired 100 ${campaign.tokenSymbol} tokens for $${tokenPrice}! The next price will be $${tokenPrice + 1}.`,
          });
        } else {
          // Set last contribution to display in TokenBalanceDisplay
          setLastContribution(pledgeAmount);
          
          toast({
            title: "Support registered successfully!",
            description: `Thank you for your support of R$ ${pledgeAmount}. You will receive more information by email.`,
          });
        }
        
        // Close dialog after successful transaction
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error("Error processing pledge:", error);
      toast({
        title: "Payment Processing Error",
        description: "An error occurred while processing your pledge. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsPledgeSubmitting(false);
    }
  };

  const percentComplete = (campaign.raised / campaign.goal) * 100;
  
  return (
    <>
      <Navbar />
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Campaign Details Column */}
            <div className="lg:col-span-2">
              {/* Campaign Header */}
              <div className={`${campaign.featuredImage} h-64 rounded-lg mb-6 flex items-end p-6`}>
                <div className="text-white">
                  <h1 className="font-heading text-3xl font-bold">{campaign.title}</h1>
                  <p className="mt-2">{campaign.description}</p>
                </div>
              </div>

              {/* Campaign Statistics */}
              <Card className="mb-6">
                <div className="p-6">
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700 font-medium">{formatCurrency(campaign.raised)} arrecadados</span>
                      <span className="text-gray-700 font-medium">Meta: {formatCurrency(campaign.goal)}</span>
                    </div>
                    <Progress value={percentComplete} className="h-4" />
                    <div className="flex justify-between mt-2 text-sm text-gray-600">
                      <span>{percentComplete.toFixed(1)}% completo</span>
                      <span>{campaign.daysLeft} dias restantes</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <span className="block text-2xl font-semibold text-gray-900">{campaign.backers}</span>
                      <span className="text-gray-600">Apoiadores</span>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <span className="block text-2xl font-semibold text-gray-900">{campaign.tokenSymbol}</span>
                      <span className="text-gray-600">Token</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Campaign Description */}
              <Card className="mb-6">
                <div className="p-6">
                  <h2 className="font-heading text-xl font-semibold mb-4">Sobre o Projeto</h2>
                  <p className="text-gray-700 mb-4">
                    O TourChain está revolucionando o mercado de viagens corporativas ao integrar tecnologia blockchain, 
                    foco em bem-estar e práticas sustentáveis. Nossa plataforma permite que empresas gerenciem viagens 
                    corporativas de forma transparente, eficiente e com redução de custos significativa.
                  </p>
                  <p className="text-gray-700 mb-4">
                    Ao utilizar smart contracts, garantimos que todas as transações sejam seguras e transparentes, 
                    eliminando intermediários e reduzindo custos. Nossos tokens TOUR não apenas facilitam pagamentos, 
                    mas também incentivam escolhas sustentáveis e promovem o bem-estar dos viajantes.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-lg mb-2">Tecnologia Blockchain</h3>
                      <p className="text-gray-600">Smart contracts garantem transações seguras e transparentes, eliminando intermediários.</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-lg mb-2">Sustentabilidade</h3>
                      <p className="text-gray-600">Incentivos para escolhas eco-conscientes e compensação de carbono integrada.</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-lg mb-2">Bem-estar</h3>
                      <p className="text-gray-600">Foco na experiência do viajante com recomendações personalizadas e suporte contínuo.</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-lg mb-2">Economia</h3>
                      <p className="text-gray-600">Reduza custos operacionais em até 30% com nossa tecnologia baseada em blockchain.</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Blockchain Demo */}
              <BlockchainDemo 
                contractAddress={campaign.contractAddress}
                networkName={campaign.networkName}
                verified={true}
              />

              {/* Token Balance */}
              <TokenBalanceDisplay 
                tokenSymbol={campaign.tokenSymbol}
                lastContribution={lastContribution}
              />

              {/* Dynamic Tokens */}
              <DynamicTokens
                tokenSymbol={campaign.tokenSymbol}
                currentPrice={tokenPrice}
                onPurchase={() => handlePledge(tokenPrice.toString(), "dynamic-tokens")}
                purchaseHistory={tokensPurchased}
              />

              {/* About Project */}
              <Card className="mb-6">
                <div className="p-6">
                  <h2 className="font-heading text-xl font-semibold mb-4">Sobre o Projeto</h2>
                  <p className="text-gray-700 mb-4">
                    TourChain é uma plataforma <strong>100% web3</strong> que revoluciona as viagens corporativas com tecnologia blockchain, algoritmos de bem-estar e contratos inteligentes para garantir sustentabilidade.
                  </p>
                  <p className="text-gray-700 mb-4">
                    Desenvolvemos uma solução descentralizada baseada em ESG (Environmental Virtual Machine) que elimina intermediários, tornando as transações mais transparentes e eficientes. Com nosso protocolo exclusivo e tecnologia ERC-4337 para facilitar a integração de usuários web2 com web3, estamos criando capacidades excepcionais comerciais para qualquer player do mercado de viagens.
                  </p>
                  
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <i className="fas fa-database text-blue-500 mt-1"></i>
                      <div>
                        <h3 className="font-medium text-blue-900">Tecnologia Oracle</h3>
                        <p className="text-sm text-blue-800">
                          Utilizamos oracle para criar dados off-chain como uma maneira de tratar seus erros tecnologia blockchain, garantindo segurança e confiabilidade nos registros.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Rewards Column */}
            <div className="mt-10 lg:mt-0">
              <div className="sticky top-6">
                <Card className="mb-6">
                  <div className="p-6">
                    <h2 className="font-heading text-xl font-semibold mb-4">Apoie Este Projeto</h2>
                    
                    {/* Pledge Input Box */}
                    <div className="mb-6">
                      <Label htmlFor="custom-pledge" className="block text-sm font-medium text-gray-700 mb-1">
                        Contribuição Personalizada
                      </Label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                          $
                        </span>
                        <Input 
                          type="number" 
                          id="custom-pledge" 
                          value={pledgeAmount}
                          onChange={(e) => setPledgeAmount(e.target.value)}
                          placeholder="100"
                          className="rounded-none rounded-r-md"
                        />
                      </div>
                      <Button 
                        className="w-full mt-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                        onClick={() => handlePledge(pledgeAmount)}
                      >
                        Contribuir
                      </Button>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4">
                      <h3 className="font-medium text-gray-900 mb-3">Recompensas Disponíveis</h3>
                    </div>
                  </div>
                </Card>
                
                {/* Reward Tiers */}
                {rewardTiers.map((reward) => (
                  <Card 
                    key={reward.id}
                    className="mb-4 border-2 border-transparent hover:border-primary/20 transition-all cursor-pointer"
                    onClick={() => handlePledge(reward.amount.toString(), reward.id)}
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-lg">{reward.title}</h3>
                        <Badge className="bg-blue-100 text-blue-800">
                          ${reward.amount}{reward.isDynamic ? ' / ' + reward.tokenAmount + ' ' + campaign.tokenSymbol : ''}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 text-sm mt-2 mb-3">
                        {reward.description}
                      </p>
                      
                      <div className="mt-2 text-sm text-gray-500 flex justify-between">
                        <span>Restantes: {reward.limit - reward.claimed}/{reward.limit}</span>
                        <span>{reward.claimed} reivindicados</span>
                      </div>
                      
                      <Button 
                        variant="outline"
                        className="w-full mt-3 text-primary bg-primary/10 hover:bg-primary/20 border-transparent"
                        onClick={() => handlePledge(reward.amount.toString(), reward.id)}
                      >
                        Selecionar Recompensa
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Pledge Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Complete seu apoio</DialogTitle>
            <DialogDescription>
              Finalize sua contribuição para o projeto {campaign.title}
            </DialogDescription>
          </DialogHeader>
          
          {/* Pledge Summary */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Valor</span>
              <span className="font-medium">${pledgeAmount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Recompensa</span>
              <span className="font-medium">
                {selectedReward ? 
                  rewardTiers.find(r => r.id === selectedReward)?.title || "Contribuição personalizada" 
                  : "Contribuição personalizada"}
              </span>
            </div>
          </div>
          
          {/* Tabs */}
          <Tabs defaultValue="crypto" onValueChange={(v) => setPaymentTab(v as "crypto" | "traditional")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="crypto">Crypto</TabsTrigger>
              <TabsTrigger value="traditional">Pagamento Tradicional</TabsTrigger>
            </TabsList>
            
            {/* Crypto Tab Content */}
            <TabsContent value="crypto">
              <div className="mb-4">
                <div className="rounded-md bg-blue-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <i className="fas fa-info-circle text-blue-400"></i>
                    </div>
                    <div className="ml-3 flex-1 md:flex md:justify-between">
                      <p className="text-sm text-blue-700">
                        Conecte sua carteira para continuar com o pagamento em criptomoeda.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center mb-4">
                {!isWalletConnected ? (
                  <Button 
                    className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                    onClick={handleConnectWallet}
                    disabled={isWalletConnecting}
                  >
                    {isWalletConnecting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Conectando...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-wallet mr-2"></i> Conectar Carteira
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="text-center">
                    <Badge className="mb-2 bg-green-100 text-green-800">
                      <i className="fas fa-check-circle mr-2"></i> Carteira conectada
                    </Badge>
                    <p className="text-sm text-gray-600">{walletAddress}</p>
                  </div>
                )}
              </div>
              
              <div className="mb-4 text-sm text-gray-500">
                <p>Após conectar sua carteira, você poderá confirmar a transação e apoiar este projeto.</p>
              </div>
            </TabsContent>
            
            {/* Traditional Payment Tab Content */}
            <TabsContent value="traditional">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input 
                    id="name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome completo" 
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com" 
                  />
                </div>
                <div className="rounded-md bg-blue-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <i className="fas fa-info-circle text-blue-400"></i>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm text-blue-700">
                        Você receberá instruções de pagamento por email após confirmar sua contribuição.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button 
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              onClick={handleCompletePledge}
              disabled={isPledgeSubmitting}
            >
              {isPledgeSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                "Confirmar Contribuição"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Footer />
    </>
  );
}
