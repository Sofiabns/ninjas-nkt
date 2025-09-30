import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/common/SearchInput";
import { useApp } from "@/contexts/AppContext";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function DeepsList() {
  const { data, deleteDeep } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = data.deeps.filter(
    (deep) =>
      deep.title.toLowerCase().includes(search.toLowerCase()) ||
      deep.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja deletar este deep?")) {
      deleteDeep(id);
      toast.success("Deep deletado");
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
          <h1 className="text-4xl font-bold text-primary text-glow">DEEPS</h1>
          <p className="text-muted-foreground font-mono text-sm mt-1">
            {filtered.length} deep(s) registrado(s)
          </p>
        </div>
        <Button
          onClick={() => navigate("/deeps/new")}
          className="bg-primary text-primary-foreground hover:bg-primary/90 box-glow"
        >
          <Plus className="h-4 w-4 mr-2" />
          NOVO DEEP
        </Button>
      </motion.div>

      <SearchInput value={search} onChange={setSearch} placeholder="Buscar por título ou ID..." />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((deep, index) => (
          <motion.div
            key={deep.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="p-4 bg-card border-border hover:border-primary transition-all">
              <div className="aspect-video bg-secondary rounded mb-3 overflow-hidden">
                {deep.images.length > 0 ? (
                  <img
                    src={deep.images[0]}
                    alt={deep.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-muted-foreground">
                    📷
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div>
                  <h3 className="text-lg font-bold text-foreground">{deep.title}</h3>
                  <p className="text-xs text-accent font-mono">{deep.id}</p>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{deep.description}</p>
                <p className="text-xs text-muted-foreground">{deep.images.length} imagem(ns)</p>
              </div>

              <div className="flex gap-2 mt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/deeps/${deep.id}`)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Ver
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/deeps/edit/${deep.id}`)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(deep.id)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full">
            <Card className="p-12 text-center bg-card border-border">
              <p className="text-muted-foreground">Nenhum deep encontrado</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
