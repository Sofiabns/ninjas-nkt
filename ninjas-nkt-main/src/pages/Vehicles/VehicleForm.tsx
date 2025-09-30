import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/contexts/AppContext";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { formatPlate, validatePlate, fileToDataUrl } from "@/utils/validation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from "lucide-react";

export default function VehicleForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, addVehicle, updateVehicle, getVehicle } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [plate, setPlate] = useState("");
  const [model, setModel] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [ownerId, setOwnerId] = useState<string>("");

  useEffect(() => {
    if (id) {
      const vehicle = getVehicle(id);
      if (vehicle) {
        setPlate(vehicle.plate);
        setModel(vehicle.model);
        setPhotoUrl(vehicle.photoUrl || "");
        setOwnerId(vehicle.ownerId || "");
      }
    }
  }, [id]);

  const handlePlateChange = (value: string) => {
    setPlate(formatPlate(value));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const dataUrl = await fileToDataUrl(file);
      setPhotoUrl(dataUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plate.trim() || !model.trim()) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    if (!validatePlate(plate)) {
      toast.error("Placa inválida. Use o formato NNLLLNNN (ex: 12ABC345)");
      return;
    }

    if (id) {
      updateVehicle(id, { plate, model, photoUrl, ownerId: ownerId || undefined });
      toast.success("Veículo atualizado");
    } else {
      addVehicle({ plate, model, photoUrl, ownerId: ownerId || undefined });
      toast.success("Veículo registrado");
    }
    navigate("/vehicles");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-primary text-glow">
          {id ? "EDITAR VEÍCULO" : "NOVO VEÍCULO"}
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
              <div className="w-32 h-24 bg-secondary rounded border border-border overflow-hidden">
                {photoUrl ? (
                  <img src={photoUrl} alt="Foto" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-muted-foreground">
                    🚗
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
            <label className="text-sm font-mono text-foreground mb-2 block">
              PLACA (NNLLLNNN) *
            </label>
            <Input
              value={plate}
              onChange={(e) => handlePlateChange(e.target.value)}
              placeholder="12ABC345"
              className="bg-input border-border font-mono uppercase"
              maxLength={8}
              required
            />
          </div>

          <div>
            <label className="text-sm font-mono text-foreground mb-2 block">MODELO *</label>
            <Input
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="Ex: Honda Civic 2020"
              className="bg-input border-border"
              required
            />
          </div>

          <div>
            <label className="text-sm font-mono text-foreground mb-2 block">
              PROPRIETÁRIO (OPCIONAL)
            </label>
            <Select value={ownerId} onValueChange={setOwnerId}>
              <SelectTrigger className="bg-input border-border">
                <SelectValue placeholder="Selecione o proprietário" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border z-50">
                <SelectItem value="">Nenhum</SelectItem>
                {data.people.map((person) => (
                  <SelectItem key={person.id} value={person.id}>
                    {person.fullName} ({person.id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/vehicles")}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-primary text-primary-foreground box-glow">
              {id ? "Atualizar" : "Registrar"} Veículo
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
