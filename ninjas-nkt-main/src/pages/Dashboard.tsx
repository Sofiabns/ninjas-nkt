import React from "react";
import { motion } from "framer-motion";
import { FolderOpen, Users, Car, Search, Building } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { Card } from "@/components/ui/card";

export default function Dashboard() {
  const { data } = useApp();

  const stats = [
    {
      label: "CASOS ATIVOS",
      value: data.cases.filter((c) => c.status === "open").length,
      icon: FolderOpen,
      color: "text-primary",
    },
    {
      label: "INVESTIGAÇÕES",
      value: data.investigations.length,
      icon: Search,
      color: "text-accent",
    },
    {
      label: "PESSOAS REGISTRADAS",
      value: data.people.length,
      icon: Users,
      color: "text-terminal-greenSoft",
    },
    {
      label: "VEÍCULOS",
      value: data.vehicles.length,
      icon: Car,
      color: "text-accent",
    },
    {
      label: "BASES",
      value: data.bases.length,
      icon: Building,
      color: "text-primary",
    },
    {
      label: "FACÇÕES",
      value: data.gangs.length,
      icon: Users,
      color: "text-accent",
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-primary text-glow mb-2">DASHBOARD</h1>
        <p className="text-muted-foreground font-mono text-sm">SYSTEM OVERVIEW</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 bg-card border-border hover:border-primary transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-mono mb-1">{stat.label}</p>
                  <p className={`text-4xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8"
      >
        <Card className="p-6 bg-card border-border">
          <h2 className="text-xl font-bold text-primary mb-4">LOG DE ATIVIDADES</h2>
          
          <div className="space-y-2">
            {data.activityLogs.slice(0, 10).map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3 bg-secondary rounded border border-border"
              >
                <div className="flex-1">
                  <p className="font-mono text-sm text-foreground">
                    <span className="text-accent">{log.investigatorName}</span> {log.action}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {log.entityType} {log.entityId} • {new Date(log.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
            
            {data.activityLogs.length === 0 && (
              <p className="text-center text-muted-foreground text-sm py-4">
                Nenhuma atividade registrada ainda
              </p>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
