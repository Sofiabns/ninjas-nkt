import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/contexts/AppContext";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import { AuctionEntry, Attachment } from "@/types";
import { FileUpload } from "@/components/common/FileUpload";
import { uploadFile } from "@/integrations/supabase/uploadsService";
import { generateId } from "@/utils/idGenerator";

export default function AuctionForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, addAuction, updateAuction } = useApp();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [entries, setEntries] = useState<AuctionEntry[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const [currentGangId, setCurrentGangId] = useState("");
  const [currentItem, setCurrentItem] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [currentGears, setCurrentGears] = useState("");

  useEffect(() => {
    if (id) {
      const auction = data.auctions.find((a) => a.id === id);
      if (auction) {
        setTitle(auction.title);
        setDescription(auction.description || "");
        setEntries(auction.entries);
        setAttachments(auction.attachments || []);
      }
    }
  }, [id]);

  const handleAddEntry = () => {
    if (!currentGangId || !currentItem.trim() || !currentAmount) {
      toast.error("Preencha todos os campos da entrada");
      return;
    }

    const amount = parseFloat(currentAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Valor inválido");
      return;
    }

    const gears = currentGears ? parseFloat(currentGears) : undefined;
    if (currentGears && (isNaN(gears!) || gears! < 0)) {
      toast.error("Número de engrenagens inválido");
      return;
    }

    setEntries([...entries, { gangId: currentGangId, item: currentItem, amount, gears }]);
    setCurrentGangId("");
    setCurrentItem("");
    setCurrentAmount("");
    setCurrentGears("");
  };

  const handleRemoveEntry = (index: number) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || entries.length === 0) {
      toast.error("Preencha o título e adicione pelo menos uma entrada");
      return;
    }

    let uploadedAttachments: Attachment[] = [];

    // Upload each file before saving the auction
    for (const att of attachments) {
      if (att.file) {
        const url = await uploadFile(att.file, { auctionId: id });
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

    if (id) {
      await updateAuction(id, { title, description, entries, attachments: uploadedAttachments });
      toast.success("Leilão atualizado");
    } else {
      await addAuction({ title, description, entries, attachments: uploadedAttachments });
      toast.success("Leilão criado");
    }
    navigate("/auctions");
  };

  const totalByGang = entries.reduce((acc, entry) => {
    acc[entry.gangId] = (acc[entry.gangId] || 0) + entry.amount;
    return acc;
  }, {} as Record<string, number>);

  const totalGearsByGang = entries.reduce((acc, entry) => {
    if (entry.gears) {
      acc[entry.gangId] = (acc[entry.gangId] || 0) + entry.gears;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-primary text-glow">
          {id ? "EDITAR LEILÃO" : "NOVO LEILÃO"}
        </h1>
      </motion.div>

      <Card className="p-6 bg-card border-border">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-mono text-foreground mb-2 block">TÍTULO *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Leilão Mensal Janeiro"
              className="bg-input border-border"
              required
            />
          </div>

          <div>
            <label className="text-sm font-mono text-foreground mb-2 block">DESCRIÇÃO (opcional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição do leilão"
              className="w-full p-2 border border-border rounded bg-input text-foreground resize-none"
              rows={3}
            />
          </div>

          <div className="border border-border rounded p-4 bg-secondary/30">
            <label className="text-sm font-mono text-foreground mb-3 block">ADICIONAR ENTRADA</label>
            
            <div className="space-y-3">
              <Select value={currentGangId} onValueChange={setCurrentGangId}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="Selecione uma facção" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border z-50">
                  {data.gangs.map((gang) => (
                    <SelectItem key={gang.id} value={gang.id}>
                      {gang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                value={currentItem}
                onChange={(e) => setCurrentItem(e.target.value)}
                placeholder="O que foi comprado?"
                className="bg-input border-border"
              />

              <Input
                type="number"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                placeholder="Quanto gastou?"
                className="bg-input border-border"
                step="0.01"
                min="0"
              />

              <Input
                type="number"
                value={currentGears}
                onChange={(e) => setCurrentGears(e.target.value)}
                placeholder="Engrenagens (opcional)"
                className="bg-input border-border"
                step="1"
                min="0"
              />

              <Button
                type="button"
                variant="outline"
                onClick={handleAddEntry}
                className="w-full border-primary text-primary hover:bg-primary/10"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Entrada
              </Button>
            </div>
          </div>

          {entries.length > 0 && (
            <div>
              <label className="text-sm font-mono text-foreground mb-3 block">
                ENTRADAS ({entries.length})
              </label>
              <div className="space-y-2">
                {entries.map((entry, index) => {
                  const gang = data.gangs.find((g) => g.id === entry.gangId);
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-secondary rounded border border-border"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-mono text-foreground">
                          {gang?.name || entry.gangId}
                        </p>
                        <p className="text-xs text-muted-foreground">{entry.item}</p>
                        <div className="flex gap-2 items-center">
                          <p className="text-sm text-primary font-bold">
                            ${entry.amount.toLocaleString()}
                          </p>
                          {entry.gears && (
                            <p className="text-sm text-accent font-bold">
                              ⚙️ {entry.gears}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveEntry(index)}
                      >
                        <X className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {Object.keys(totalByGang).length > 0 && (
            <Card className="p-4 bg-primary/10 border-primary">
              <h3 className="text-sm font-mono text-primary mb-3">TOTAL POR FACÇÃO</h3>
              <div className="space-y-2">
                {Object.entries(totalByGang).map(([gangId, total]) => {
                  const gang = data.gangs.find((g) => g.id === gangId);
                  const gears = totalGearsByGang[gangId];
                  return (
                    <div key={gangId} className="flex justify-between items-center">
                      <span className="text-sm text-foreground font-mono">{gang?.name}</span>
                      <div className="flex gap-3 items-center">
                        <span className="text-lg font-bold text-primary">
                          ${total.toLocaleString()}
                        </span>
                        {gears && (
                          <span className="text-lg font-bold text-accent">
                            ⚙️ {gears}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          <div>
            <label className="text-sm font-mono text-foreground mb-2 block">ANEXOS</label>
            <FileUpload attachments={attachments} onChange={setAttachments} />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/auctions")}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-primary text-primary-foreground box-glow">
              {id ? "Atualizar" : "Criar"} Leilão
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
