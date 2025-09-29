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
import PeopleList from "./pages/People/PeopleList";
import PersonForm from "./pages/People/PersonForm";
import PersonDetails from "./pages/People/PersonDetails";
import VehiclesList from "./pages/Vehicles/VehiclesList";
import VehicleForm from "./pages/Vehicles/VehicleForm";
import BasesList from "./pages/Bases/BasesList";
import BaseForm from "./pages/Bases/BaseForm";
import ChargesList from "./pages/Charges/ChargesList";
import ChargeForm from "./pages/Charges/ChargeForm";
import GangsList from "./pages/Gangs/GangsList";
import GangForm from "./pages/Gangs/GangForm";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/cases/active" element={<ActiveCases />} />
              <Route path="/cases/archived" element={<ArchivedCases />} />
              <Route path="/cases/new" element={<CaseForm />} />
              <Route path="/cases/edit/:id" element={<CaseForm />} />
              <Route path="/cases/:id" element={<CaseDetails />} />
              <Route path="/investigations" element={<InvestigationsList />} />
              <Route path="/investigations/new" element={<InvestigationForm />} />
              <Route path="/investigations/edit/:id" element={<InvestigationForm />} />
              <Route path="/people" element={<PeopleList />} />
              <Route path="/people/new" element={<PersonForm />} />
              <Route path="/people/edit/:id" element={<PersonForm />} />
              <Route path="/people/:id" element={<PersonDetails />} />
              <Route path="/vehicles" element={<VehiclesList />} />
              <Route path="/vehicles/new" element={<VehicleForm />} />
              <Route path="/vehicles/edit/:id" element={<VehicleForm />} />
              <Route path="/bases" element={<BasesList />} />
              <Route path="/bases/new" element={<BaseForm />} />
              <Route path="/charges" element={<ChargesList />} />
              <Route path="/charges/new" element={<ChargeForm />} />
              <Route path="/charges/edit/:id" element={<ChargeForm />} />
              <Route path="/gangs" element={<GangsList />} />
              <Route path="/gangs/new" element={<GangForm />} />
              <Route path="/gangs/edit/:id" element={<GangForm />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
