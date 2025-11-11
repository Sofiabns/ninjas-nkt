import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { useApp } from "@/contexts/AppContext";

export const MainLayout: React.FC = () => {
  const { currentInvestigator } = useApp();

  if (!currentInvestigator) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};
