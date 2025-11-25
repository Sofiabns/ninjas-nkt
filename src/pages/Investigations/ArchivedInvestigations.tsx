import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, Trash2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/common/SearchInput";
import { useApp } from "@/contexts/AppContext";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function ArchivedInvestigations() {
  const { data, deleteInvestigation, updateInvestigation } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const archivedInvestigations = data.investigations.filter((inv) => inv.status === "archived");

  const filtered = archivedInvestigations.filter(
    (inv) =>
      inv.title.toLowerCase().includes(search.toLowerCase()) ||
      inv.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja deletar esta investigação arquivada?")) {
      deleteInvestigation(id);
      toast.success("Investigação deletada");
    }
  };

  const handleReactivate = (id: string) => {
    const investigation = data.investigations.find((inv) => inv.id === id);
    if (investigation) {
      updateInvestigation(id, {
        ...investigation,
        status: "active",
        closedReason: undefined,
        closedAt: undefined,
      });
      toast.success("Investigação reativada");
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-primary text-glow">INVESTIGAÇÕES ARQUIVADAS</h1>
        <p className="text-muted-foreground font-mono text-sm mt-1">
          {filtered.length} investigação(ões) arquivada(s)
        </p>
      </motion.div>

      <SearchInput value={search} onChange={setSearch} placeholder="Buscar por título ou ID..." />

      <div className="space-y-3">
        {filtered.map((investigation, index) => (
          <motion.div
            key={investigation.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="p-4 bg-card border-border">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-accent font-mono text-sm">{investigation.id}</span>
                    <h3 className="text-lg font-bold text-muted-foreground">{investigation.title}</h3>
                    <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                      ARQUIVADA
                    </span>
                  </div>
                  
                  {investigation.closedReason && (
                    <div className="mb-2 p-2 bg-secondary rounded border border-border">
                      <p className="text-xs font-mono text-accent mb-1">MOTIVO DO ARQUIVAMENTO:</p>
                      <p className="text-sm text-foreground">{investigation.closedReason}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{investigation.sections.length} seção(ões)</span>
                    <span>{investigation.personIds.length} pessoa(s)</span>
                    <span>{investigation.attachments.length} anexo(s)</span>
                    <span>Arquivada em: {new Date(investigation.closedAt || investigation.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/investigations/${investigation.id}`)}
                    title="Ver detalhes"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleReactivate(investigation.id)}
                    title="Reativar"
                  >
                    <RotateCcw className="h-4 w-4 text-primary" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(investigation.id)}
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
            <p className="text-muted-foreground">Nenhuma investigação arquivada encontrada</p>
          </Card>
        )}
      </div>
    </div>
  );
}
