import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/contexts/AppContext";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

export default function ChargeForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, addCharge, updateCharge } = useApp();

  const [reason, setReason] = useState("");
  const [personIds, setPersonIds] = useState<string[]>([]);
  const [vehicleIds, setVehicleIds] = useState<string[]>([]);
  const [gangId, setGangId] = useState<string>("");
  const [status, setStatus] = useState<"pendente" | "resolvido">("pendente");

  const [personSearch, setPersonSearch] = useState("");
  const [vehicleSearch, setVehicleSearch] = useState("");

  useEffect(() => {
    if (id) {
      const charge = data.charges.find((c) => c.id === id);
      if (charge) {
        setReason(charge.reason);
        setPersonIds(charge.personIds);
        setVehicleIds(charge.vehicleIds);
        setGangId(charge.gangId || "");
        setStatus(charge.status);
      }
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error("Preencha o motivo da cobrança");
      return;
    }

    if (id) {
      updateCharge(id, { reason, personIds, vehicleIds, gangId: gangId || undefined, status });
      toast.success("Cobrança atualizada");
    } else {
      addCharge({ reason, personIds, vehicleIds, gangId: gangId || undefined, status });
      toast.success("Cobrança criada");
    }
    navigate("/charges");
  };

  const filteredPeople = data.people.filter(
    (p) =>
      !personIds.includes(p.id) &&
      (p.fullName.toLowerCase().includes(personSearch.toLowerCase()) ||
        p.id.toLowerCase().includes(personSearch.toLowerCase()))
  );

  const filteredVehicles = data.vehicles.filter(
    (v) =>
      !vehicleIds.includes(v.id) &&
      (v.plate.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
        v.model.toLowerCase().includes(vehicleSearch.toLowerCase()))
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-primary text-glow">
          {id ? "EDITAR COBRANÇA" : "NOVA COBRANÇA"}
        </h1>
      </motion.div>

      <Card className="p-6 bg-card border-border">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-mono text-foreground mb-2 block">MOTIVO *</label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Descreva o motivo da cobrança..."
              className="bg-input border-border min-h-[100px]"
              required
            />
          </div>

          <div>
            <label className="text-sm font-mono text-foreground mb-2 block">STATUS</label>
            <Select value={status} onValueChange={(val) => setStatus(val as "pendente" | "resolvido")}>
              <SelectTrigger className="bg-input border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border z-50">
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="resolvido">Resolvido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-mono text-foreground mb-2 block">FACÇÃO</label>
            <Select value={gangId} onValueChange={setGangId}>
              <SelectTrigger className="bg-input border-border">
                <SelectValue placeholder="Selecione uma facção (opcional)" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border z-50">
                <SelectItem value="">Nenhuma</SelectItem>
                {data.gangs.map((gang) => (
                  <SelectItem key={gang.id} value={gang.id}>
                    {gang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <label className="text-sm font-mono text-foreground mb-2 block">VEÍCULOS ENVOLVIDOS</label>
            <Input
              value={vehicleSearch}
              onChange={(e) => setVehicleSearch(e.target.value)}
              placeholder="Buscar veículo..."
              className="bg-input border-border mb-2"
            />

            {vehicleSearch && filteredVehicles.length > 0 && (
              <div className="mb-3 max-h-40 overflow-y-auto border border-border rounded bg-popover">
                {filteredVehicles.slice(0, 5).map((vehicle) => (
                  <button
                    key={vehicle.id}
                    type="button"
                    onClick={() => {
                      setVehicleIds([...vehicleIds, vehicle.id]);
                      setVehicleSearch("");
                    }}
                    className="w-full p-2 hover:bg-secondary text-left"
                  >
                    <p className="text-sm font-mono text-foreground">{vehicle.plate}</p>
                    <p className="text-xs text-muted-foreground">{vehicle.model}</p>
                  </button>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {vehicleIds.map((vehicleId) => {
                const vehicle = data.vehicles.find((v) => v.id === vehicleId);
                return vehicle ? (
                  <div
                    key={vehicleId}
                    className="flex items-center gap-2 px-3 py-1 bg-secondary border border-border rounded"
                  >
                    <span className="text-sm">{vehicle.plate}</span>
                    <button
                      type="button"
                      onClick={() => setVehicleIds(vehicleIds.filter((id) => id !== vehicleId))}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : null;
              })}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/charges")}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-primary text-primary-foreground box-glow">
              {id ? "Atualizar" : "Criar"} Cobrança
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
