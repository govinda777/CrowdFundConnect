import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BlockchainProvider } from "@/lib/blockchain";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import CrowdfundingPage from "@/pages/CrowdfundingPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/crowdfunding" component={CrowdfundingPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BlockchainProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </BlockchainProvider>
    </QueryClientProvider>
  );
}

export default App;
