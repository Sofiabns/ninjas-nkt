import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/common/FileUpload";
import { useApp } from "@/contexts/AppContext";
import { Card } from "@/components/ui/card";
import { Attachment } from "@/types";
import { toast } from "sonner";
import { X } from "lucide-react";

export default function CaseForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, addCase, updateCase, getCase, getPerson, getVehicle } = useApp();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [personIds, setPersonIds] = useState<string[]>([]);
  const [vehicleIds, setVehicleIds] = useState<string[]>([]);
  const [gangIds, setGangIds] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  
  const [personSearch, setPersonSearch] = useState("");
  const [vehicleSearch, setVehicleSearch] = useState("");

  useEffect(() => {
    if (id) {
      const caseData = getCase(id);
      if (caseData) {
        setTitle(caseData.title);
        setDescription(caseData.description);
        setPersonIds(caseData.personIds);
        setVehicleIds(caseData.vehicleIds);
        setGangIds(caseData.gangIds);
        setAttachments(caseData.attachments);
      }
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    if (id) {
      updateCase(id, { title, description, personIds, vehicleIds, gangIds, attachments });
      toast.success("Caso atualizado");
    } else {
      addCase({ title, description, personIds, vehicleIds, gangIds, attachments });
      toast.success("Caso criado");
    }
    navigate("/cases/active");
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
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-primary text-glow">
          {id ? "EDITAR CASO" : "NOVO CASO"}
        </h1>
      </motion.div>

      <Card className="p-6 bg-card border-border">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-mono text-foreground mb-2 block">TÍTULO *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Operação Lótus"
              className="bg-input border-border"
              required
            />
          </div>

          <div>
            <label className="text-sm font-mono text-foreground mb-2 block">
              DESCRIÇÃO - O que aconteceu? *
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva os detalhes do caso..."
              className="bg-input border-border min-h-[120px]"
              required
            />
          </div>

          <div>
            <label className="text-sm font-mono text-foreground mb-2 block">
              PESSOAS ENVOLVIDAS
            </label>
            <Input
              value={personSearch}
              onChange={(e) => setPersonSearch(e.target.value)}
              placeholder="Buscar pessoa por nome ou ID..."
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
                    className="w-full p-2 hover:bg-secondary text-left flex items-center gap-2"
                  >
                    {person.photoUrl && (
                      <img
                        src={person.photoUrl}
                        alt={person.fullName}
                        className="w-8 h-8 rounded object-cover"
                      />
                    )}
                    <div>
                      <p className="text-sm font-mono text-foreground">{person.fullName}</p>
                      <p className="text-xs text-muted-foreground">{person.id}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {personIds.map((personId) => {
                const person = getPerson(personId);
                return person ? (
                  <div
                    key={personId}
                    className="flex items-center gap-2 px-3 py-1 bg-secondary border border-border rounded"
                  >
                    {person.photoUrl && (
                      <img
                        src={person.photoUrl}
                        alt={person.fullName}
                        className="w-6 h-6 rounded object-cover"
                      />
                    )}
                    <span className="text-sm">{person.fullName}</span>
                    <span className="text-xs text-muted-foreground">({personId})</span>
                    <button
                      type="button"
                      onClick={() => setPersonIds(personIds.filter((id) => id !== personId))}
                      className="ml-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : null;
              })}
            </div>
          </div>

          <div>
            <label className="text-sm font-mono text-foreground mb-2 block">
              VEÍCULOS ENVOLVIDOS
            </label>
            <Input
              value={vehicleSearch}
              onChange={(e) => setVehicleSearch(e.target.value)}
              placeholder="Buscar veículo por placa ou modelo..."
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
                const vehicle = getVehicle(vehicleId);
                return vehicle ? (
                  <div
                    key={vehicleId}
                    className="flex items-center gap-2 px-3 py-1 bg-secondary border border-border rounded"
                  >
                    <span className="text-sm">{vehicle.plate}</span>
                    <span className="text-xs text-muted-foreground">({vehicle.model})</span>
                    <button
                      type="button"
                      onClick={() => setVehicleIds(vehicleIds.filter((id) => id !== vehicleId))}
                      className="ml-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : null;
              })}
            </div>
          </div>

          <div>
            <label className="text-sm font-mono text-foreground mb-2 block">
              FACÇÕES ENVOLVIDAS
            </label>
            <div className="flex flex-wrap gap-2">
              {data.gangs.map((gang) => (
                <button
                  key={gang.id}
                  type="button"
                  onClick={() => {
                    if (gangIds.includes(gang.id)) {
                      setGangIds(gangIds.filter((id) => id !== gang.id));
                    } else {
                      setGangIds([...gangIds, gang.id]);
                    }
                  }}
                  className={`px-3 py-1 rounded border transition-all ${
                    gangIds.includes(gang.id)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-secondary border-border hover:border-primary"
                  }`}
                >
                  {gang.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-mono text-foreground mb-2 block">ANEXOS</label>
            <FileUpload attachments={attachments} onChange={setAttachments} />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/cases/active")}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-primary text-primary-foreground box-glow">
              {id ? "Atualizar" : "Criar"} Caso
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
