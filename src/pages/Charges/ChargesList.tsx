import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/common/SearchInput";
import { useApp } from "@/contexts/AppContext";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ChargesList() {
  const { data, deleteCharge, updateCharge, getPerson } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  let filtered = data.charges.filter((charge) =>
    charge.reason.toLowerCase().includes(search.toLowerCase())
  );

  if (statusFilter !== "all") {
    filtered = filtered.filter((c) => c.status === statusFilter);
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja deletar esta cobrança?")) {
      deleteCharge(id);
      toast.success("Cobrança deletada");
    }
  };

  const toggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "pendente" ? "resolvido" : "pendente";
    updateCharge(id, { status: newStatus as "pendente" | "resolvido" });
    toast.success(`Status alterado para ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold text-primary text-glow">COBRANÇAS</h1>
          <p className="text-muted-foreground font-mono text-sm mt-1">
            {filtered.length} cobrança(s) registrada(s)
          </p>
        </div>
        <Button
          onClick={() => navigate("/charges/new")}
          className="bg-primary text-primary-foreground hover:bg-primary/90 box-glow"
        >
          <Plus className="h-4 w-4 mr-2" />
          NOVA COBRANÇA
        </Button>
      </motion.div>

      <div className="flex gap-4">
        <div className="flex-1">
          <SearchInput value={search} onChange={setSearch} placeholder="Buscar por motivo..." />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px] bg-input border-border">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border z-50">
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="resolvido">Resolvido</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filtered.map((charge, index) => (
          <motion.div
            key={charge.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="p-4 bg-card border-border hover:border-primary transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-accent font-mono text-sm">{charge.id}</span>
                    <h3 className="text-lg font-bold text-foreground">{charge.reason}</h3>
                    <button
                      onClick={() => toggleStatus(charge.id, charge.status)}
                      className={`text-xs px-3 py-1 rounded transition-all ${
                        charge.status === "pendente"
                          ? "bg-destructive/20 text-destructive hover:bg-destructive/30"
                          : "bg-primary/20 text-primary hover:bg-primary/30"
                      }`}
                    >
                      {charge.status === "pendente" ? "PENDENTE" : "RESOLVIDO"}
                    </button>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{charge.personIds.length} pessoa(s)</span>
                    <span>{charge.vehicleIds.length} veículo(s)</span>
                    <span>{new Date(charge.createdAt).toLocaleDateString()}</span>
                  </div>

                  {charge.personIds.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {charge.personIds.map((personId) => {
                        const person = getPerson(personId);
                        return person ? (
                          <span
                            key={personId}
                            className="text-xs px-2 py-1 bg-secondary rounded border border-border"
                          >
                            {person.fullName}
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/charges/edit/${charge.id}`)}
                    title="Editar"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(charge.id)}
                    title="Deletar"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <Card className="p-12 text-center bg-card border-border">
            <p className="text-muted-foreground">Nenhuma cobrança encontrada</p>
          </Card>
        )}
      </div>
    </div>
  );
}
