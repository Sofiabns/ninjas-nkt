import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FolderOpen,
  Search,
  Users,
  Car,
  Building,
  Scale,
  Users2,
  Archive,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";

const menuItems = [
  { icon: LayoutDashboard, label: "DASHBOARD", path: "/dashboard" },
  { icon: FolderOpen, label: "CASOS ATIVOS", path: "/cases/active" },
  { icon: Search, label: "INVESTIGAÇÕES", path: "/investigations" },
  { icon: Users, label: "REGISTRO PESSOAS", path: "/people" },
  { icon: Car, label: "REGISTRO VEÍCULOS", path: "/vehicles" },
  { icon: Building, label: "BASES", path: "/bases" },
  { icon: Scale, label: "COBRANÇAS", path: "/charges" },
  { icon: Users2, label: "GERENCIAR FACÇÕES", path: "/gangs" },
  { icon: Archive, label: "CASOS ARQUIVADOS", path: "/cases/archived" },
];

export const Sidebar: React.FC = () => {
  const { logout, currentInvestigator } = useApp();

  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <h2 className="text-xl font-bold text-primary text-glow">NINJAS NKT</h2>
        {currentInvestigator && (
          <p className="text-xs text-muted-foreground mt-1">
            AGENT: {currentInvestigator.name}
          </p>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 overflow-y-auto">
        {menuItems.map((item, index) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded mb-1 transition-all ${
                isActive
                  ? "bg-sidebar-accent text-primary box-glow"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`
            }
          >
            <item.icon className="h-4 w-4" />
            <span className="text-sm font-mono">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          onClick={logout}
          variant="outline"
          className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
        >
          <LogOut className="h-4 w-4 mr-2" />
          LOGOUT
        </Button>
      </div>
    </motion.div>
  );
};
