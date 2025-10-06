import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/common/SearchInput";
import { useApp } from "@/contexts/AppContext";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PeopleList() {
  const { data, deletePerson } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [gangFilter, setGangFilter] = useState<string>("all");

  let filtered = data.people.filter(
    (p) =>
      p.fullName.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search)
  );

  if (gangFilter !== "all") {
    filtered = filtered.filter((p) => p.gang === gangFilter);
  }

  filtered = filtered.sort((a, b) => {
    const aNum = parseInt(a.id.split('-')[1]);
    const bNum = parseInt(b.id.split('-')[1]);
    return aNum - bNum;
  });

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja deletar esta pessoa?")) {
      deletePerson(id);
      toast.success("Pessoa deletada");
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
          <h1 className="text-4xl font-bold text-primary text-glow">REGISTRO DE PESSOAS</h1>
          <p className="text-muted-foreground font-mono text-sm mt-1">
            {filtered.length} pessoa(s) registrada(s)
          </p>
        </div>
        <Button
          onClick={() => navigate("/people/new")}
          className="bg-primary text-primary-foreground hover:bg-primary/90 box-glow"
        >
          <Plus className="h-4 w-4 mr-2" />
          NOVA PESSOA
        </Button>
      </motion.div>

      <div className="flex gap-4">
        <div className="flex-1">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Buscar por nome, ID ou telefone..."
          />
        </div>
        <Select value={gangFilter} onValueChange={setGangFilter}>
          <SelectTrigger className="w-[200px] bg-input border-border">
            <SelectValue placeholder="Filtrar por facção" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border z-50">
            <SelectItem value="all">Todas as facções</SelectItem>
            {data.gangs.map((gang) => (
              <SelectItem key={gang.id} value={gang.name}>
                {gang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((person, index) => (
          <motion.div
            key={person.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="p-4 bg-card border-border hover:border-primary transition-all">
              <div className="flex items-start gap-3">
                <div className="w-16 h-16 bg-secondary rounded flex-shrink-0 overflow-hidden">
                  {person.attachments.length > 0 ? (
                    <img
                      src={person.attachments[0].url}
                      alt={person.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl text-muted-foreground">
                      {person.fullName[0]}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground truncate">{person.fullName}</h3>
                  <p className="text-xs text-accent font-mono">{person.id}</p>
                  <p className="text-xs text-muted-foreground mt-1">{person.gang}</p>
                  <p className="text-xs text-muted-foreground">{person.hierarchy}</p>
                  <p className="text-xs text-muted-foreground font-mono mt-1">{person.phone}</p>
                </div>
              </div>

              <div className="flex gap-2 mt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/people/${person.id}`)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Ver
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/people/edit/${person.id}`)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(person.id)}
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
              <p className="text-muted-foreground">Nenhuma pessoa encontrada</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
