import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import { MainLayout } from "@/components/layout/MainLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ActiveCases from "./pages/Cases/ActiveCases";
import ArchivedCases from "./pages/Cases/ArchivedCases";
import CaseForm from "./pages/Cases/CaseForm";
import CaseDetails from "./pages/Cases/CaseDetails";
import InvestigationsList from "./pages/Investigations/InvestigationsList";
import InvestigationForm from "./pages/Investigations/InvestigationForm";
import InvestigationDetails from "./pages/Investigations/InvestigationDetails";
import PeopleList from "./pages/People/PeopleList";
import PersonForm from "./pages/People/PersonForm";
import PersonDetails from "./pages/People/PersonDetails";
import VehiclesList from "@/pages/Vehicles/VehiclesList";
import VehicleForm from "@/pages/Vehicles/VehicleForm";
import BasesList from "./pages/Bases/BasesList";
import BaseForm from "./pages/Bases/BaseForm";
import BaseDetails from "./pages/Bases/BaseDetails";
import ChargesList from "./pages/Charges/ChargesList";
import ChargeForm from "./pages/Charges/ChargeForm";
import GangsList from "./pages/Gangs/GangsList";
import GangForm from "./pages/Gangs/GangForm";
import GangDetails from "./pages/Gangs/GangDetails";
import MeetingsList from "./pages/Meetings/MeetingsList";
import MeetingForm from "./pages/Meetings/MeetingForm";
import MeetingDetails from "./pages/Meetings/MeetingDetails";
import DeepsList from "./pages/Deeps/DeepsList";
import DeepForm from "./pages/Deeps/DeepForm";
import DeepDetails from "./pages/Deeps/DeepDetails";
import AuctionsList from "./pages/Auctions/AuctionsList";
import AuctionForm from "./pages/Auctions/AuctionForm";
import AuctionDetails from "./pages/Auctions/AuctionDetails";
import GlobalSearch from "./pages/GlobalSearch";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

import PasswordScreen from "./pages/PasswordScreen";

function App() {
  const [accessGranted, setAccessGranted] = useState(sessionStorage.getItem("accessGranted") === "true");

  useEffect(() => {
    const handleStorageChange = () => {
      setAccessGranted(sessionStorage.getItem("accessGranted") === "true");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {!accessGranted ? (
                <Route path="*" element={<PasswordScreen />} />
              ) : (
                <>
                  <Route path="/" element={<Login />} />
                  <Route element={<MainLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/search" element={<GlobalSearch />} />
                    <Route path="/cases/active" element={<ActiveCases />} />
                    <Route path="/cases/archived" element={<ArchivedCases />} />
                    <Route path="/cases/new" element={<CaseForm />} />
                    <Route path="/cases/edit/:id" element={<CaseForm />} />
                    <Route path="/cases/:id" element={<CaseDetails />} />
                    <Route path="/investigations" element={<InvestigationsList />} />
                    <Route path="/investigations/new" element={<InvestigationForm />} />
                    <Route path="/investigations/edit/:id" element={<InvestigationForm />} />
                    <Route path="/investigations/:id" element={<InvestigationDetails />} />
                    <Route path="/people" element={<PeopleList />} />
                    <Route path="/people/new" element={<PersonForm />} />
                    <Route path="/people/edit/:id" element={<PersonForm />} />
                    <Route path="/people/:id" element={<PersonDetails />} />
                    <Route path="/vehicles" element={<VehiclesList />} />
                    <Route path="/vehicles/new" element={<VehicleForm />} />
                    <Route path="/vehicles/edit/:id" element={<VehicleForm />} />
                    <Route path="/bases" element={<BasesList />} />
                    <Route path="/bases/new" element={<BaseForm />} />
                    <Route path="/bases/edit/:id" element={<BaseForm />} />
                    <Route path="/bases/:id" element={<BaseDetails />} />
                    <Route path="/charges" element={<ChargesList />} />
                    <Route path="/charges/new" element={<ChargeForm />} />
                    <Route path="/charges/edit/:id" element={<ChargeForm />} />
                    <Route path="/gangs" element={<GangsList />} />
                    <Route path="/gangs/new" element={<GangForm />} />
                    <Route path="/gangs/edit/:id" element={<GangForm />} />
                    <Route path="/gangs/:id" element={<GangDetails />} />
                    <Route path="/meetings" element={<MeetingsList />} />
                    <Route path="/meetings/new" element={<MeetingForm />} />
                    <Route path="/meetings/edit/:id" element={<MeetingForm />} />
                    <Route path="/meetings/:id" element={<MeetingDetails />} />
                    <Route path="/deeps" element={<DeepsList />} />
                    <Route path="/deeps/new" element={<DeepForm />} />
                    <Route path="/deeps/edit/:id" element={<DeepForm />} />
                    <Route path="/deeps/:id" element={<DeepDetails />} />
                    <Route path="/auctions" element={<AuctionsList />} />
                    <Route path="/auctions/new" element={<AuctionForm />} />
                    <Route path="/auctions/edit/:id" element={<AuctionForm />} />
                    <Route path="/auctions/:id" element={<AuctionDetails />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </>
              )}
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
