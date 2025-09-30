import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/common/SearchInput";
import { useApp } from "@/contexts/AppContext";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function AuctionsList() {
  const { data, deleteAuction } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = data.auctions.filter(
    (auction) =>
      auction.title.toLowerCase().includes(search.toLowerCase()) ||
      auction.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja deletar este leilão?")) {
      deleteAuction(id);
      toast.success("Leilão deletado");
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
          <h1 className="text-4xl font-bold text-primary text-glow">LEILÕES</h1>
          <p className="text-muted-foreground font-mono text-sm mt-1">
            {filtered.length} leilão(ões) registrado(s)
          </p>
        </div>
        <Button
          onClick={() => navigate("/auctions/new")}
          className="bg-primary text-primary-foreground hover:bg-primary/90 box-glow"
        >
          <Plus className="h-4 w-4 mr-2" />
          NOVO LEILÃO
        </Button>
      </motion.div>

      <SearchInput value={search} onChange={setSearch} placeholder="Buscar por título ou ID..." />

      <div className="space-y-3">
        {filtered.map((auction, index) => {
          const totalByGang = auction.entries.reduce((acc, entry) => {
            acc[entry.gangId] = (acc[entry.gangId] || 0) + entry.amount;
            return acc;
          }, {} as Record<string, number>);

          return (
            <motion.div
              key={auction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-4 bg-card border-border hover:border-primary transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-accent font-mono text-sm">{auction.id}</span>
                      <h3 className="text-lg font-bold text-foreground">{auction.title}</h3>
                    </div>
                    <div className="flex gap-4 text-xs text-muted-foreground mb-2">
                      <span>Entradas: {auction.entries.length}</span>
                      <span>Criado: {new Date(auction.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(totalByGang).map(([gangId, total]) => {
                        const gang = data.gangs.find((g) => g.id === gangId);
                        return gang ? (
                          <div key={gangId} className="text-xs bg-secondary px-2 py-1 rounded">
                            <span className="text-foreground font-mono">{gang.name}:</span>{" "}
                            <span className="text-primary font-bold">${total.toLocaleString()}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/auctions/${auction.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/auctions/edit/${auction.id}`)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(auction.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}

        {filtered.length === 0 && (
          <Card className="p-12 text-center bg-card border-border">
            <p className="text-muted-foreground">Nenhum leilão encontrado</p>
          </Card>
        )}
      </div>
    </div>
  );
}
