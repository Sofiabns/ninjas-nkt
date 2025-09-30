import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Eye, Edit, Archive, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/common/SearchInput";
import { useApp } from "@/contexts/AppContext";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function ActiveCases() {
  const { data, closeCase, deleteCase } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [closingCase, setClosingCase] = useState<string | null>(null);
  const [closeReason, setCloseReason] = useState("");

  const activeCases = data.cases.filter((c) => c.status === "open");

  const filtered = activeCases.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleClose = () => {
    if (closingCase && closeReason.trim()) {
      closeCase(closingCase, closeReason);
      toast.success("Caso fechado com sucesso");
      setClosingCase(null);
      setCloseReason("");
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja deletar este caso?")) {
      deleteCase(id);
      toast.success("Caso deletado");
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold text-primary text-glow">CASOS ATIVOS</h1>
          <p className="text-muted-foreground font-mono text-sm mt-1">
            {filtered.length} caso(s) ativo(s)
          </p>
        </div>
        <Button
          onClick={() => navigate("/cases/new")}
          className="bg-primary text-primary-foreground hover:bg-primary/90 box-glow"
        >
          <Plus className="h-4 w-4 mr-2" />
          NOVO CASO
        </Button>
      </motion.div>

      <SearchInput value={search} onChange={setSearch} placeholder="Buscar por título ou ID..." />

      <div className="space-y-3">
        {filtered.map((caseItem, index) => (
          <motion.div
            key={caseItem.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="p-4 bg-card border-border hover:border-primary transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-accent font-mono text-sm">{caseItem.id}</span>
                    <h3 className="text-lg font-bold text-foreground">{caseItem.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {caseItem.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{caseItem.personIds.length} pessoa(s)</span>
                    <span>{caseItem.vehicleIds.length} veículo(s)</span>
                    <span>{new Date(caseItem.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/cases/${caseItem.id}`)}
                    title="Ver detalhes"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/cases/edit/${caseItem.id}`)}
                    title="Editar"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setClosingCase(caseItem.id)}
                    title="Fechar caso"
                  >
                    <Archive className="h-4 w-4 text-accent" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(caseItem.id)}
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
            <p className="text-muted-foreground">Nenhum caso ativo encontrado</p>
          </Card>
        )}
      </div>

      <Dialog open={!!closingCase} onOpenChange={() => setClosingCase(null)}>
        <DialogContent className="bg-popover border-border">
          <DialogHeader>
            <DialogTitle className="text-primary">FECHAR CASO</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-mono text-foreground mb-2 block">
                MOTIVO DO FECHAMENTO *
              </label>
              <Textarea
                value={closeReason}
                onChange={(e) => setCloseReason(e.target.value)}
                placeholder="Descreva o motivo do fechamento..."
                className="bg-input border-border min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setClosingCase(null)}>
              Cancelar
            </Button>
            <Button
              onClick={handleClose}
              disabled={!closeReason.trim()}
              className="bg-accent text-accent-foreground"
            >
              Confirmar Fechamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
