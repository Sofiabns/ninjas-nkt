import React from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useApp } from "@/contexts/AppContext";
import { Edit, Users, Link as LinkIcon } from "lucide-react";

export default function GangDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getGang, data } = useApp();

  const gang = id ? getGang(id) : undefined;

  if (!gang) {
    return (
      <div className="space-y-6">
        <Card className="p-12 text-center bg-card border-border">
          <p className="text-muted-foreground">Facção não encontrada</p>
          <Button onClick={() => navigate("/gangs")} className="mt-4">
            Voltar
          </Button>
        </Card>
      </div>
    );
  }

  const members = data.people
    .filter((p) => p.gang === gang.name && (p.hierarchy === "Lider" || p.hierarchy === "Sub-Lider" || p.hierarchy === "Membro"))
    .sort((a, b) => {
      const hierarchyOrder: Record<string, number> = { "Lider": 1, "Sub-Lider": 2, "Membro": 3 };
      return (hierarchyOrder[a.hierarchy] || 99) - (hierarchyOrder[b.hierarchy] || 99);
    });

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {gang.color && (
              <div
                className="w-8 h-8 rounded border-2 border-border"
                style={{ backgroundColor: gang.color }}
                title={`Cor: ${gang.color}`}
              />
            )}
            <div>
              <span className="text-accent font-mono text-sm">{gang.id}</span>
              <h1 className="text-4xl font-bold text-primary text-glow">{gang.name}</h1>
            </div>
          </div>

          <Button
            onClick={() => navigate(`/gangs/edit/${gang.id}`)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 box-glow"
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </div>
      </motion.div>

      {gang.description && (
        <Card className="p-6 bg-card border-border">
          <p className="text-foreground">{gang.description}</p>
        </Card>
      )}

      {gang.alliedGangIds && gang.alliedGangIds.length > 0 && (
        <Card className="p-6 bg-card border-border">
          <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
            <LinkIcon className="h-5 w-5" /> ALIANÇAS ({gang.alliedGangIds.length})
          </h2>
          <div className="flex flex-wrap gap-2">
            {gang.alliedGangIds.map((allyId) => {
              const ally = data.gangs.find((g) => g.id === allyId);
              if (!ally) return null;
              return (
                <button
                  key={allyId}
                  onClick={() => navigate(`/gangs/${allyId}`)}
                  className="flex items-center gap-2 px-3 py-1 bg-secondary rounded border border-border hover:border-primary transition-colors"
                  title={ally.name}
                >
                  {ally.color && (
                    <span
                      className="w-3 h-3 rounded-full border border-border"
                      style={{ backgroundColor: ally.color }}
                    />
                  )}
                  <span className="text-sm text-foreground font-mono">{ally.name}</span>
                </button>
              );
            })}
          </div>
        </Card>
      )}

      <Card className="p-6 bg-card border-border">
        <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
          <Users className="h-5 w-5" /> MEMBROS ({members.length})
        </h2>
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
              <div>
                <p className="text-sm font-mono text-foreground">{member.fullName}</p>
                <p className="text-xs text-muted-foreground">{member.hierarchy}</p>
              </div>
            </div>
          ))}
        </div>
        {members.length === 0 && (
          <p className="text-muted-foreground">Nenhum membro registrado</p>
        )}
      </Card>
    </div>
  );
}
