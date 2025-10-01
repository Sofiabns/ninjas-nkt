import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/contexts/AppContext";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export default function GangForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, addGang, updateGang, getGang } = useApp();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#00ff00");
  const [alliedGangIds, setAlliedGangIds] = useState<string[]>([]);

  useEffect(() => {
    if (id) {
      const gang = getGang(id);
      if (gang) {
        setName(gang.name);
        setDescription(gang.description);
        setColor(gang.color || "#00ff00");
        setAlliedGangIds(gang.alliedGangIds || []);
      }
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Preencha o nome da facção");
      return;
    }

    if (id) {
      updateGang(id, { name, description, color, alliedGangIds });
      toast.success("Facção atualizada");
    } else {
      addGang({ name, description, color, alliedGangIds });
      toast.success("Facção criada");
    }
    navigate("/gangs");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-primary text-glow">
          {id ? "EDITAR FACÇÃO" : "NOVA FACÇÃO"}
        </h1>
      </motion.div>

      <Card className="p-6 bg-card border-border">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-mono text-foreground mb-2 block">NOME *</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Yakuza"
              className="bg-input border-border"
              required
            />
          </div>

          <div>
            <label className="text-sm font-mono text-foreground mb-2 block">DESCRIÇÃO</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva a facção..."
              className="bg-input border-border min-h-[100px]"
            />
          </div>

          <div>
            <label className="text-sm font-mono text-foreground mb-2 block">COR (OPCIONAL)</label>
            <div className="flex gap-3 items-center">
              <Input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-20 h-10 cursor-pointer"
              />
              <Input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="bg-input border-border font-mono"
                placeholder="#00ff00"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-mono text-foreground mb-2 block">ALIANÇAS (OPCIONAL)</label>
            <p className="text-xs text-muted-foreground mb-2">Selecione facções aliadas</p>
            {data.gangs.filter(g => g.id !== id).map((gang) => (
              <div key={gang.id} className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  id={`ally-${gang.id}`}
                  checked={alliedGangIds.includes(gang.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setAlliedGangIds([...alliedGangIds, gang.id]);
                    } else {
                      setAlliedGangIds(alliedGangIds.filter(id => id !== gang.id));
                    }
                  }}
                  className="w-4 h-4"
                />
                <label htmlFor={`ally-${gang.id}`} className="text-sm text-foreground cursor-pointer">
                  {gang.name}
                </label>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => navigate("/gangs")} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-primary text-primary-foreground box-glow">
              {id ? "Atualizar" : "Criar"} Facção
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
