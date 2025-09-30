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

export default function MeetingForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, addMeeting, updateMeeting } = useApp();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [personIds, setPersonIds] = useState<string[]>([]);
  const [vehicleIds, setVehicleIds] = useState<string[]>([]);
  const [gangIds, setGangIds] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const [personSearch, setPersonSearch] = useState("");
  const [vehicleSearch, setVehicleSearch] = useState("");
  const [gangSearch, setGangSearch] = useState("");

  useEffect(() => {
    if (id) {
      const meeting = data.meetings.find((m) => m.id === id);
      if (meeting) {
        setTitle(meeting.title);
        setDescription(meeting.description);
        setMeetingDate(meeting.meetingDate);
        setPersonIds(meeting.personIds);
        setVehicleIds(meeting.vehicleIds);
        setGangIds(meeting.gangIds);
        setAttachments(meeting.attachments);
      }
    } else {
      setMeetingDate(new Date().toISOString().slice(0, 16));
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    if (id) {
      updateMeeting(id, { title, description, meetingDate, personIds, vehicleIds, gangIds, attachments });
      toast.success("Reunião atualizada");
    } else {
      addMeeting({ title, description, meetingDate, personIds, vehicleIds, gangIds, attachments });
      toast.success("Reunião criada");
    }
    navigate("/meetings");
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

  const filteredGangs = data.gangs.filter(
    (g) =>
      !gangIds.includes(g.id) &&
      g.name.toLowerCase().includes(gangSearch.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-primary text-glow">
          {id ? "EDITAR REUNIÃO" : "NOVA REUNIÃO"}
        </h1>
      </motion.div>

      <Card className="p-6 bg-card border-border">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-mono text-foreground mb-2 block">TÍTULO *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Reunião Operação Alpha"
              className="bg-input border-border"
              required
            />
          </div>

          <div>
            <label className="text-sm font-mono text-foreground mb-2 block">DATA/HORA *</label>
            <Input
              type="datetime-local"
              value={meetingDate}
              onChange={(e) => setMeetingDate(e.target.value)}
              className="bg-input border-border"
              required
            />
          </div>

          <div>
            <label className="text-sm font-mono text-foreground mb-2 block">DESCRIÇÃO *</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="O que foi discutido na reunião..."
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

          <div>
            <label className="text-sm font-mono text-foreground mb-2 block">FACÇÕES ENVOLVIDAS</label>
            <Input
              value={gangSearch}
              onChange={(e) => setGangSearch(e.target.value)}
              placeholder="Buscar facção..."
              className="bg-input border-border mb-2"
            />

            {gangSearch && filteredGangs.length > 0 && (
              <div className="mb-3 max-h-40 overflow-y-auto border border-border rounded bg-popover">
                {filteredGangs.map((gang) => (
                  <button
                    key={gang.id}
                    type="button"
                    onClick={() => {
                      setGangIds([...gangIds, gang.id]);
                      setGangSearch("");
                    }}
                    className="w-full p-2 hover:bg-secondary text-left"
                  >
                    <p className="text-sm font-mono text-foreground">{gang.name}</p>
                    <p className="text-xs text-muted-foreground">{gang.id}</p>
                  </button>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {gangIds.map((gangId) => {
                const gang = data.gangs.find((g) => g.id === gangId);
                return gang ? (
                  <div
                    key={gangId}
                    className="flex items-center gap-2 px-3 py-1 bg-secondary border border-border rounded"
                  >
                    <span className="text-sm">{gang.name}</span>
                    <button
                      type="button"
                      onClick={() => setGangIds(gangIds.filter((id) => id !== gangId))}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : null;
              })}
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
              onClick={() => navigate("/meetings")}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-primary text-primary-foreground box-glow">
              {id ? "Atualizar" : "Criar"} Reunião
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
