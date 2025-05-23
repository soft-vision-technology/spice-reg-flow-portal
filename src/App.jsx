import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import ExistingBusinessPage from "./pages/ExistingBusinessPage";
import ExporterPage from "./pages/ExporterPage";
import IntermediaryPage from "./pages/IntermediaryPage";
import ReportsPage from "./pages/ReportsPage";
import NotFound from "./pages/NotFound";
import { FormProvider } from "./contexts/FormContext";
import HomePage from "./pages/HomePage";
import SelectPage from "./pages/SelectPage";
import StartingBusinessPage from "./pages/StartingBusinessPage";
import { TooltipProvider } from "./components/ui/tooltip";
import ProductPage from "./pages/ProductPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <FormProvider>
        <Toaster />
        <BrowserRouter>
          <MainLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/select" element={<SelectPage />} />
              <Route path="/like-to-start" element={<ExporterPage />} />
              <Route path="/have-business" element={<ExistingBusinessPage />} />
              <Route path="/export-form" element={<ExporterPage />} />
              <Route path="/intermediary-form" element={<IntermediaryPage />} />
              <Route path="/products" element={<ProductPage />} />
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
