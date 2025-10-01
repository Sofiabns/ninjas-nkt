import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { formatPhone, validatePhone, fileToDataUrl } from "@/utils/validation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from "lucide-react";
import { getPerson, addOrUpdatePerson, uploadPersonPhoto, Person } from "../../services/PeopleService";

export default function PersonForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState("");
  const [gang, setGang] = useState("");
  const [hierarchy, setHierarchy] = useState<"Líder" | "Sub-Líder" | "Membro">("Membro");
  const [phone, setPhone] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [vehicleIds, setVehicleIds] = useState<string[]>([]);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  useEffect(() => {
    if (id) {
      getPerson(id).then((person) => {
        if (person) {
          setFullName(person.fullName);
          setGang(person.gang);
          setHierarchy(person.hierarchy);
          setPhone(person.phone);
          setPhotoUrl(person.photoUrl || "");
          setVehicleIds(person.vehicleIds || []);
        }
      });
    }
  }, [id]);

  const handlePhoneChange = (value: string) => {
    setPhone(formatPhone(value));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      fileToDataUrl(file).then(setPhotoUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !gang || !phone) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    if (!validatePhone(phone)) {
      toast.error("Telefone inválido. Use o formato NNN-NNN");
      return;
    }

    try {
      let finalPhotoUrl = photoUrl;
      const personId = id || crypto.randomUUID();

      if (photoFile) {
        finalPhotoUrl = await uploadPersonPhoto(photoFile, personId);
      }

      const person: Person = {
        id: personId,
        fullName,
        gang,
        hierarchy,
        phone,
        photoUrl: finalPhotoUrl,
        vehicleIds,
      };

      await addOrUpdatePerson(person);

      toast.success(id ? "Pessoa atualizada" : "Pessoa registrada");
      navigate("/people");
    } catch (error) {
      toast.error("Erro ao salvar pessoa");
      console.error(error);
    }
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
                {photoUrl ? (
                  <img src={photoUrl} alt="Foto" className="w-full h-full object-cover" />
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
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Foto
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
                {/* Ideal: carregar facções do Firestore */}
                <SelectItem value="Facção A">Facção A</SelectItem>
                <SelectItem value="Facção B">Facção B</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-mono text-foreground mb-2 block">HIERARQUIA *</label>
            <Select
              value={hierarchy}
              onValueChange={(val) => setHierarchy(val as "Líder" | "Sub-Líder" | "Membro")}
              required
            >
              <SelectTrigger className="bg-input border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border z-50">
                <SelectItem value="Líder">Líder</SelectItem>
                <SelectItem value="Sub-Líder">Sub-Líder</SelectItem>
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
