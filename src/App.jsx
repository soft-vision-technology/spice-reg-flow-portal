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
import { TooltipProvider } from "./components/ui/tooltip";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import UserManagement from "./pages/UserManagement";
import EditPage from "./pages/EditPage";
import Mainpage from "./pages/Mainpage";
import NotificationsPage from "./pages/NotificationsPage";
import RegisterUser from "./AdminPages/RegisterUser";
import ImportDataPage from "./pages/ImportDataPage";

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
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <Mainpage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/select"
                element={
                  <ProtectedRoute>
                    <SelectPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/like-to-start"
                element={
                  <ProtectedRoute>
                    <ExporterPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/have-business"
                element={
                  <ProtectedRoute>
                    <ExistingBusinessPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/export-form"
                element={
                  <ProtectedRoute>
                    <ExporterPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/intermediary-form"
                element={
                  <ProtectedRoute>
                    <IntermediaryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                    <ReportsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/members"
                element={
                  <ProtectedRoute>
                    <UserManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user-management-edit"
                element={
                  <ProtectedRoute>
                    <EditPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <NotificationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create"
                element={
                  <ProtectedRoute>
                    <RegisterUser />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/import-data"
                element={
                  <ProtectedRoute>
                    <ImportDataPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </FormProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
