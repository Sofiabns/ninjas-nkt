import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/common/SearchInput";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getCases, deleteCase } from "@/services/casesService";

export default function ArchivedCases() {
  const [cases, setCases] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const allCases = await getCases();
      setCases(allCases);
    })();
  }, []);

  const archivedCases = cases.filter((c) => c.status === "closed");

  const filtered = archivedCases.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja deletar este caso arquivado?")) {
      await deleteCase(id);
      setCases((prev) => prev.filter((c) => c.id !== id));
      toast.success("Caso deletado");
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-primary text-glow">CASOS ARQUIVADOS</h1>
        <p className="text-muted-foreground font-mono text-sm mt-1">
          {filtered.length} caso(s) arquivado(s)
        </p>
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
            <Card className="p-4 bg-card border-border">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-accent font-mono text-sm">{caseItem.id}</span>
                    <h3 className="text-lg font-bold text-muted-foreground">{caseItem.title}</h3>
                    <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                      FECHADO
                    </span>
                  </div>

                  {caseItem.closedReason && (
                    <div className="mb-2 p-2 bg-secondary rounded border border-border">
                      <p className="text-xs font-mono text-accent mb-1">MOTIVO DO FECHAMENTO:</p>
                      <p className="text-sm text-foreground">{caseItem.closedReason}</p>
                    </div>
                  )}

                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {caseItem.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>
                      Fechado em:{" "}
                      {new Date(caseItem.closedAt || caseItem.createdAt).toLocaleDateString()}
                    </span>
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
            <p className="text-muted-foreground">Nenhum caso arquivado encontrado</p>
          </Card>
        )}
      </div>
    </div>
  );
}
