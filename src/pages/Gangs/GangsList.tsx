import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/common/SearchInput";
import { useApp } from "@/contexts/AppContext";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function GangsList() {
  const { data, deleteGang } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = data.gangs.filter(
    (gang) =>
      gang.name.toLowerCase().includes(search.toLowerCase()) ||
      gang.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja deletar esta facção?")) {
      deleteGang(id);
      toast.success("Facção deletada");
    }
  };

  const getGangMembers = (gangName: string) => {
    const members = data.people.filter((p) => p.gang === gangName);
    const leaders = members.filter((m) => m.hierarchy === "Líder");
    const subLeaders = members.filter((m) => m.hierarchy === "Sub-Líder");
    const regularMembers = members.filter((m) => m.hierarchy === "Membro");
    return [...leaders, ...subLeaders, ...regularMembers];
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold text-primary text-glow">GERENCIAR FACÇÕES</h1>
          <p className="text-muted-foreground font-mono text-sm mt-1">
            {filtered.length} facção(ões) registrada(s)
          </p>
        </div>
        <Button
          onClick={() => navigate("/gangs/new")}
          className="bg-primary text-primary-foreground hover:bg-primary/90 box-glow"
        >
          <Plus className="h-4 w-4 mr-2" />
          NOVA FACÇÃO
        </Button>
      </motion.div>

      <SearchInput value={search} onChange={setSearch} placeholder="Buscar por nome ou ID..." />

      <div className="space-y-4">
        {filtered.map((gang, index) => {
          const members = getGangMembers(gang.name);

          return (
            <motion.div
              key={gang.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-6 bg-card border-border hover:border-primary transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-accent font-mono text-sm">{gang.id}</span>
                      <h3 className="text-2xl font-bold text-foreground">{gang.name}</h3>
                    </div>
                    <p className="text-muted-foreground">{gang.description}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/gangs/edit/${gang.id}`)}
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(gang.id)}
                      title="Deletar"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <h4 className="text-sm font-mono text-accent mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    MEMBROS ({members.length})
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center gap-2 p-2 bg-secondary rounded border border-border cursor-pointer hover:border-primary transition-colors"
                        onClick={() => navigate(`/people/${member.id}`)}
                      >
                        {member.photoUrl && (
                          <img
                            src={member.photoUrl}
                            alt={member.fullName}
                            className="w-10 h-10 rounded object-cover"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-mono text-foreground truncate">
                            {member.fullName}
                          </p>
                          <p className="text-xs text-muted-foreground">{member.hierarchy}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {members.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">Nenhum membro registrado</p>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}

        {filtered.length === 0 && (
          <Card className="p-12 text-center bg-card border-border">
            <p className="text-muted-foreground">Nenhuma facção encontrada</p>
          </Card>
        )}
      </div>
    </div>
  );
}
