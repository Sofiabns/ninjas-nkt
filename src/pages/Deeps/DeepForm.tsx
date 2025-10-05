import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUpload } from "@/components/common/FileUpload";
import { useApp } from "@/contexts/AppContext";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { uploadFile } from "@/integrations/supabase/uploadsService";
import { generateId } from "@/utils/idGenerator";
import { X } from "lucide-react";
import { Attachment } from "@/types";

export default function DeepForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, addDeep, updateDeep } = useApp();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [personIds, setPersonIds] = useState<string[]>([]);
  const [gangId, setGangId] = useState<string>("none");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [personSearch, setPersonSearch] = useState("");

  useEffect(() => {
    if (id) {
      const deep = data.deeps.find((d) => d.id === id);
      if (deep) {
        setTitle(deep.title);
        setDescription(deep.description);
        setPersonIds(deep.personIds || []);
        setGangId(deep.gangId || "none");
        setAttachments(deep.attachments || []);
      }
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    let uploadedAttachments: Attachment[] = [];

    // 🚀 Upload de arquivos para o Supabase
    for (const att of attachments) {
      if (att.file) {
        const url = await uploadFile(att.file, { deepId: id });
        uploadedAttachments.push({
          id: generateId("ATT", uploadedAttachments.map(a => a.id)),
          name: att.file.name,
          url,
          type: att.file.type
        });
      } else if (att.url) {
        uploadedAttachments.push(att);
      }
    }

    // images vazias porque agora usamos attachments
    const images: string[] = [];

    const finalGangId = gangId === "none" ? undefined : gangId;

    if (id) {
      await updateDeep(id, { title, description, personIds, gangId: finalGangId, images, attachments: uploadedAttachments });
      toast.success("Deep atualizado");
    } else {
      await addDeep({ title, description, personIds, gangId: finalGangId, images, attachments: uploadedAttachments });
      toast.success("Deep criado");
    }
    navigate("/deeps");
  };

  const filteredPeople = data.people.filter(
    (p) =>
      !personIds.includes(p.id) &&
      (p.fullName.toLowerCase().includes(personSearch.toLowerCase()) ||
        p.id.toLowerCase().includes(personSearch.toLowerCase()))
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-primary text-glow">
          {id ? "EDITAR DEEP" : "NOVO DEEP"}
        </h1>
      </motion.div>

      <Card className="p-6 bg-card border-border">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-mono text-foreground mb-2 block">TÍTULO *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Deep Operação Alpha"
              className="bg-input border-border"
              required
            />
          </div>

          <div>
            <label className="text-sm font-mono text-foreground mb-2 block">DESCRIÇÃO *</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o deep..."
              className="bg-input border-border min-h-[120px]"
              required
            />
          </div>

          <div>
            <label className="text-sm font-mono text-foreground mb-2 block">PESSOAS ENVOLVIDAS</label>
            <Input
              value={personSearch}
              onChange={(e) => setPersonSearch(e.target.value)}
              placeholder="Buscar pessoa..."
              className="bg-input border-border mb-2"
            />

            {personSearch && filteredPeople.length > 0 && (
              <div className="mb-3 max-h-40 overflow-y-auto border border-border rounded bg-popover">
                {filteredPeople.slice(0, 5).map((person) => (
                  <button
                    key={person.id}
                    type="button"
                    onClick={() => {
                      setPersonIds([...personIds, person.id]);
                      setPersonSearch("");
                    }}
                    className="w-full p-2 hover:bg-secondary text-left"
                  >
                    <p className="text-sm font-mono text-foreground">{person.fullName}</p>
                    <p className="text-xs text-muted-foreground">{person.id}</p>
                  </button>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {personIds.map((personId) => {
                const person = data.people.find((p) => p.id === personId);
                return person ? (
                  <div
                    key={personId}
                    className="flex items-center gap-2 px-3 py-1 bg-secondary border border-border rounded"
                  >
                    <span className="text-sm">{person.fullName}</span>
                    <button
                      type="button"
                      onClick={() => setPersonIds(personIds.filter((id) => id !== personId))}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : null;
              })}
            </div>
          </div>

          <div>
            <label className="text-sm font-mono text-foreground mb-2 block">FACÇÃO</label>
            <Select value={gangId} onValueChange={setGangId}>
              <SelectTrigger className="bg-input border-border">
                <SelectValue placeholder="Selecione uma facção (opcional)" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border z-50">
                <SelectItem value="none">Nenhuma</SelectItem>
                {data.gangs.map((gang) => (
                  <SelectItem key={gang.id} value={gang.id}>
                    {gang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-mono text-foreground mb-2 block">ANEXOS</label>
            <FileUpload attachments={attachments} onChange={setAttachments} />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/deeps")}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-primary text-primary-foreground box-glow">
              {id ? "Atualizar" : "Criar"} Deep
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
