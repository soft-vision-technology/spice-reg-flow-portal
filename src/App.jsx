
import { Toaster } from "sonner";
import { Toaster as Sonner } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FormProvider } from "./contexts/FormContext";
import MainLayout from "./components/layout/MainLayout";
import HomePage from "./pages/HomePage";
import SelectPage from "./pages/SelectPage";
import StartingBusinessPage from "./pages/StartingBusinessPage";
import ExistingBusinessPage from "./pages/ExistingBusinessPage";
import ExporterPage from "./pages/ExporterPage";
import IntermediaryPage from "./pages/IntermediaryPage";
import ReportsPage from "./pages/ReportsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <FormProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <MainLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/select" element={<SelectPage />} />
              <Route path="/like-to-start" element={<StartingBusinessPage />} />
              <Route path="/have-business" element={<ExistingBusinessPage />} />
              <Route path="/export-form" element={<ExporterPage />} />
              <Route path="/intermediary-form" element={<IntermediaryPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </FormProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
