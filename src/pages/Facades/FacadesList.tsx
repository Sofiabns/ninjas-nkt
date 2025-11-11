import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useApp } from "@/contexts/AppContext";
import { Plus, Building2, Users, Eye } from "lucide-react";
import { SearchInput } from "@/components/common/SearchInput";

export default function FacadesList() {
  const navigate = useNavigate();
  const { data } = useApp();
  const [search, setSearch] = useState("");

  const filteredFacades = data.facades.filter((facade) => {
    const searchLower = search.toLowerCase();
    const gangName = facade.gangId ? data.gangs.find(g => g.id === facade.gangId)?.name : "";
    const memberNames = facade.personIds
      .map(pid => data.people.find(p => p.id === pid)?.fullName)
      .filter(Boolean)
      .join(" ");
    
    return (
      facade.name.toLowerCase().includes(searchLower) ||
      (facade.description?.toLowerCase().includes(searchLower)) ||
      (gangName?.toLowerCase().includes(searchLower)) ||
      memberNames.toLowerCase().includes(searchLower) ||
      facade.id.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-primary text-glow">FACHADAS</h1>
          <Button
            onClick={() => navigate("/facades/new")}
            className="bg-primary text-primary-foreground hover:bg-primary/90 box-glow"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Fachada
          </Button>
        </div>
      </motion.div>

      <SearchInput value={search} onChange={setSearch} placeholder="Buscar por nome, facção, membros..." />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFacades.map((facade) => {
          const gang = facade.gangId ? data.gangs.find(g => g.id === facade.gangId) : null;
          const members = facade.personIds
            .map(pid => data.people.find(p => p.id === pid))
            .filter(Boolean);

          return (
            <Card
              key={facade.id}
              className="p-4 bg-card border-border hover:border-primary transition-all cursor-pointer group"
              onClick={() => navigate(`/facades/${facade.id}`)}
            >
              {facade.attachments.length > 0 && (
                <div className="mb-3 relative overflow-hidden rounded border border-border">
                  <img
                    src={facade.attachments[0].url}
                    alt={facade.name}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-primary group-hover:text-glow">
                      {facade.name}
                    </h3>
                    <p className="text-xs text-accent font-mono">{facade.id}</p>
                  </div>
                  <Eye className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {facade.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {facade.description}
                  </p>
                )}

                {gang && (
                  <div className="flex items-center gap-2 pt-2 border-t border-border">
                    <Building2 className="h-4 w-4 text-primary" />
                    <div className="flex items-center gap-2">
                      {gang.color && (
                        <span
                          className="w-3 h-3 rounded-full border border-border"
                          style={{ backgroundColor: gang.color }}
                        />
                      )}
                      <span className="text-sm font-mono text-foreground">{gang.name}</span>
                    </div>
                  </div>
                )}

                {members.length > 0 && (
                  <div className="flex items-center gap-2 pt-2 border-t border-border">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">
                      {members.length} {members.length === 1 ? "membro" : "membros"}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {filteredFacades.length === 0 && (
        <Card className="p-12 text-center bg-card border-border">
          <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            {search ? "Nenhuma fachada encontrada" : "Nenhuma fachada registrada"}
          </p>
        </Card>
      )}
    </div>
  );
}
