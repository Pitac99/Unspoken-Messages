import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";

// Import all pages
import IntroPage from "@/pages/intro";
import OnboardingPage from "@/pages/onboarding";
import PinSetupPage from "@/pages/pin-setup";
import PinAuthPage from "@/pages/pin-auth";
import HomePage from "@/pages/home";
import ContactSelectionPage from "@/pages/contact-selection";
import ChatPage from "@/pages/chat";
import SettingsPage from "@/pages/settings";
import TermsPage from "@/pages/terms";
import NotFound from "@/pages/not-found";

// Import storage and auth
import { storage } from "./lib/storage";
import { auth } from "./lib/auth";

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={IntroPage} />
      <Route path="/onboarding" component={OnboardingPage} />
      <Route path="/pin-setup" component={PinSetupPage} />
      <Route path="/pin-auth" component={PinAuthPage} />
      <Route path="/home" component={HomePage} />
      <Route path="/contact-selection" component={ContactSelectionPage} />
      <Route path="/chat/:contactId" component={ChatPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route path="/terms" component={TermsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppInitializer() {
  useEffect(() => {
    // Initialize app data if it doesn't exist
    const appData = storage.getAppData();
    if (!appData) {
      storage.initializeAppData();
    }

    // Check authentication status and redirect accordingly
    const currentPath = window.location.pathname;
    
    // If we're on the root path, determine where to redirect
    if (currentPath === "/") {
      if (appData?.settings.onboardingCompleted) {
        if (auth.isAuthenticated()) {
          window.location.href = "/home";
        } else {
          window.location.href = "/pin-auth";
        }
      }
      // If onboarding not completed, stay on intro page
    }
  }, []);

  return <AppRouter />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="max-w-sm mx-auto bg-[#1E1E1E] min-h-screen relative overflow-hidden">
          <AppInitializer />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
