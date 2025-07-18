import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import Subjects from "@/pages/subjects";
import Schedule from "@/pages/schedule";
import ProgressPage from "@/pages/progress";
import Profile from "@/pages/profile";
import HistoryCourse from "@/pages/history-course";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/subjects" component={Subjects} />
      <Route path="/schedule" component={Schedule} />
      <Route path="/progress" component={ProgressPage} />
      <Route path="/profile" component={Profile} />
      <Route path="/courses/:slug" component={HistoryCourse} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
