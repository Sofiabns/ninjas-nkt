import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/contexts/AppContext";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { formatPhone, validatePhone } from "@/utils/validation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Loader2 } from "lucide-react";
import { uploadFile } from "@/integrations/supabase/uploadsService";
import { generateId } from "@/utils/idGenerator";
import { Attachment } from "@/types";

export default function PersonForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, addPerson, updatePerson, getPerson } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState("");
  const [gang, setGang] = useState("");
  const [hierarchy, setHierarchy] = useState<"Lider" | "Sub-Lider" | "Membro">("Membro");
  const [phone, setPhone] = useState("");
  const [deep, setDeep] = useState("");

  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [vehicleIds, setVehicleIds] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (id) {
      const person = getPerson(id);
      if (person) {
        setFullName(person.fullName);
        setGang(person.gang);
        setHierarchy(person.hierarchy);
        setPhone(person.phone);
        setDeep(person.deep || "");
        setAttachments(person.attachments);
        setVehicleIds(person.vehicleIds);
      }
    }
  }, [id]);

  const handlePhoneChange = (value: string) => {
    setPhone(formatPhone(value));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadFile(file, { personId: id || "new" });
      setAttachments([{ id: generateId('ATT', []), name: 'photo', url: url, type: 'image' }]);
      toast.success("Foto enviada com sucesso");
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      toast.error("Erro ao enviar foto");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !gang || !phone) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    if (!validatePhone(phone)) {
      toast.error("Telefone inválido. Use o formato NNN-NNN");
      return;
    }

    if (id) {
      updatePerson(id, { fullName, gang, hierarchy, phone, attachments, vehicleIds, deep: deep || undefined });
      toast.success("Pessoa atualizada");
    } else {
      addPerson({ fullName, gang, hierarchy, phone, attachments, vehicleIds, deep: deep || undefined });
      toast.success("Pessoa registrada");
    }
    navigate("/people");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-primary text-glow">
          {id ? "EDITAR PESSOA" : "NOVA PESSOA"}
        </h1>
      </motion.div>

      <Card className="p-6 bg-card border-border">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-mono text-foreground mb-2 block">FOTO</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 bg-secondary rounded border border-border overflow-hidden">
                {attachments.length > 0 ? (
                  <img src={attachments[0].url} alt="Foto" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-muted-foreground">
                    {fullName[0] || "?"}
                  </div>
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Foto
                  </>
                )}
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm font-mono text-foreground mb-2 block">NOME COMPLETO *</label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ex: Kenji Tanaka"
              className="bg-input border-border"
              required
            />
          </div>

          <div>
            <label className="text-sm font-mono text-foreground mb-2 block">FACÇÃO *</label>
            <Select value={gang} onValueChange={setGang} required>
              <SelectTrigger className="bg-input border-border">
                <SelectValue placeholder="Selecione uma facção" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border z-50">
                {data.gangs.map((g) => (
                  <SelectItem key={g.id} value={g.name}>
                    {g.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-mono text-foreground mb-2 block">DEEP</label>
            <Input
              value={deep}
              onChange={(e) => setDeep(e.target.value)}
              placeholder="Deep opcional"
              className="bg-input border-border"
            />
          </div>

          <div>
            <label className="text-sm font-mono text-foreground mb-2 block">HIERARQUIA *</label>
            <Select
              value={hierarchy}
              onValueChange={(val) => setHierarchy(val as "Lider" | "Sub-Lider" | "Membro")}
              required
            >
              <SelectTrigger className="bg-input border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border z-50">
                <SelectItem value="Lider">Lider</SelectItem>
                <SelectItem value="Sub-Lider">Sub-Lider</SelectItem>
                <SelectItem value="Membro">Membro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-mono text-foreground mb-2 block">
              TELEFONE (NNN-NNN) *
            </label>
            <Input
              value={phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="123-456"
              className="bg-input border-border font-mono"
              required
            />
          </div>



          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => navigate("/people")} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-primary text-primary-foreground box-glow">
              {id ? "Atualizar" : "Registrar"} Pessoa
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
