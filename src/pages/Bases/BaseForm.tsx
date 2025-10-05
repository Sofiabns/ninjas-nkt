import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
import { Attachment } from "@/types";

export default function BaseForm() {
  const navigate = useNavigate();
  const { data, addBase } = useApp();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [gangId, setGangId] = useState<string>("none");
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Preencha o nome da base");
      return;
    }

    let uploadedAttachments: Attachment[] = [];

    // 🚀 Upload de arquivos para o Supabase
    for (const att of attachments) {
      if (att.file) {
        const url = await uploadFile(att.file, { baseId: undefined });
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

    await addBase({ name, description, gangId, attachments: uploadedAttachments, metadata: {} });
    toast.success("Base criada");
    navigate("/bases");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-primary text-glow">NOVA BASE</h1>
      </motion.div>

      <Card className="p-6 bg-card border-border">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-mono text-foreground mb-2 block">NOME *</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Base Central"
              className="bg-input border-border"
              required
            />
          </div>

          <div>
            <label className="text-sm font-mono text-foreground mb-2 block">DESCRIÇÃO</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva a base..."
              className="bg-input border-border min-h-[100px]"
            />
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
            <Button type="button" variant="outline" onClick={() => navigate("/bases")} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-primary text-primary-foreground box-glow">
              Criar Base
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
