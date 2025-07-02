import React, { Suspense, useEffect } from "react";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import { FormProvider } from "./contexts/FormContext";
import { TooltipProvider } from "./components/ui/tooltip";
import { routes, createRouteElement } from "./constants/routes";
import socket from "./utils/socket";

const queryClient = new QueryClient();

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
  </div>
);

const App = () =>{ 
  useEffect(() => {
    socket.on('notification', (data) => {
      console.log("New notification received:", data);
      // You can handle the notification here, e.g., update state or show a toast
    });
    return () => {
      socket.off('notification');
    }
  }, []);
  return(
  
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <FormProvider>
        <Toaster />
        <BrowserRouter>
          <MainLayout>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {routes.map((route, index) => (
                  <Route
                    key={index}
                    path={route.path}
                    element={createRouteElement(route)}
                  />
                ))}
              </Routes>
            </Suspense>
          </MainLayout>
        </BrowserRouter>
      </FormProvider>
    </TooltipProvider>
  </QueryClientProvider>
)};

export default App;