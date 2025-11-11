import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp } from "@/contexts/AppContext";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { FileUpload } from "@/components/common/FileUpload";
import { SearchInput } from "@/components/common/SearchInput";
import { Attachment } from "@/types";

export default function FacadeForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, addFacade, updateFacade, getFacade } = useApp();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [gangId, setGangId] = useState<string>("");
  const [personIds, setPersonIds] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [personSearch, setPersonSearch] = useState("");

  useEffect(() => {
    if (id) {
      const facade = getFacade(id);
      if (facade) {
        setName(facade.name);
        setDescription(facade.description || "");
        setGangId(facade.gangId || "");
        setPersonIds(facade.personIds);
        setAttachments(facade.attachments);
      }
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Preencha o nome da fachada");
      return;
    }

    if (id) {
      updateFacade(id, { name, description, gangId, personIds, attachments });
      toast.success("Fachada atualizada");
    } else {
      addFacade({ name, description, gangId, personIds, attachments });
      toast.success("Fachada criada");
    }
    navigate("/facades");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-primary text-glow">
          {id ? "EDITAR FACHADA" : "NOVA FACHADA"}
        </h1>
      </motion.div>

      <Card className="p-6 bg-card border-border">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-mono text-foreground mb-2 block">NOME *</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Bar da Esquina"
              className="bg-input border-border"
              required
            />
          </div>

          <div>
            <label className="text-sm font-mono text-foreground mb-2 block">DESCRIÇÃO</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva a fachada..."
              className="bg-input border-border min-h-[100px]"
            />
          </div>

          <div>
            <label className="text-sm font-mono text-foreground mb-2 block">FACÇÃO (OPCIONAL)</label>
            <Select value={gangId || undefined} onValueChange={(value) => setGangId(value)}>
              <SelectTrigger className="bg-input border-border">
                <SelectValue placeholder="Selecione a facção" />
              </SelectTrigger>
              <SelectContent>
                {data.gangs.map((gang) => (
                  <SelectItem key={gang.id} value={gang.id}>
                    {gang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {gangId && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setGangId("")}
                className="mt-2 text-xs"
              >
                Limpar seleção
              </Button>
            )}
          </div>

          <div>
            <label className="text-sm font-mono text-foreground mb-2 block">MEMBROS (OPCIONAL)</label>
            <p className="text-xs text-muted-foreground mb-2">Selecione pessoas associadas</p>
            <SearchInput
              value={personSearch}
              onChange={setPersonSearch}
              placeholder="Buscar pessoa..."
            />
            <div className="max-h-48 overflow-y-auto space-y-2 p-3 bg-input rounded border border-border mt-2">
              {data.people
                .filter((person) =>
                  person.fullName.toLowerCase().includes(personSearch.toLowerCase()) ||
                  person.gang.toLowerCase().includes(personSearch.toLowerCase())
                )
                .map((person) => (
                  <div key={person.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`person-${person.id}`}
                      checked={personIds.includes(person.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setPersonIds([...personIds, person.id]);
                        } else {
                          setPersonIds(personIds.filter((pid) => pid !== person.id));
                        }
                      }}
                      className="w-4 h-4"
                    />
                    <label
                      htmlFor={`person-${person.id}`}
                      className="text-sm text-foreground cursor-pointer flex-1"
                    >
                      {person.fullName} - {person.gang}
                    </label>
                  </div>
                ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-mono text-foreground mb-2 block">ANEXOS</label>
            <FileUpload attachments={attachments} onChange={setAttachments} />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => navigate("/facades")} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-primary text-primary-foreground box-glow">
              {id ? "Atualizar" : "Criar"} Fachada
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
