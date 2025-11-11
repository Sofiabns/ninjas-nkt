import React from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useApp } from "@/contexts/AppContext";
import { ArrowLeft, User, Car, Users2, Paperclip, Download } from "lucide-react";

export default function MeetingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, getPerson } = useApp();

  const meeting = data.meetings.find((m) => m.id === id);

  if (!meeting) {
    return (
      <div className="space-y-6">
        <Card className="p-12 text-center bg-card border-border">
          <p className="text-muted-foreground">Reunião não encontrada</p>
          <Button onClick={() => navigate("/meetings")} className="mt-4">
            Voltar
          </Button>
        </Card>
      </div>
    );
  }

  const handleDownload = (attachment: any) => {
    const link = document.createElement('a');
    link.href = attachment.url;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Button
          variant="ghost"
          onClick={() => navigate("/meetings")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-accent font-mono text-sm">{meeting.id}</span>
              <h1 className="text-4xl font-bold text-primary text-glow">
                {meeting.title}
              </h1>
            </div>
            <p className="text-muted-foreground font-mono text-sm">
              Data: {new Date(meeting.meetingDate).toLocaleString()}
            </p>
          </div>

          <Button
            onClick={() => navigate(`/meetings/edit/${meeting.id}`)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 box-glow"
          >
            Editar
          </Button>
        </div>
      </motion.div>

      <Card className="p-6 bg-card border-border">
        <h2 className="text-xl font-bold text-primary mb-4">DESCRIÇÃO</h2>
        <p className="text-foreground whitespace-pre-wrap">{meeting.description}</p>
      </Card>

      {meeting.personIds.length > 0 && (
        <Card className="p-6 bg-card border-border">
          <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
            <User className="h-5 w-5" />
            PESSOAS ENVOLVIDAS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {meeting.personIds.map((personId) => {
              const person = getPerson(personId);
              if (!person) return null;
              return (
                <div
                  key={personId}
                  className="flex items-center gap-3 p-3 bg-secondary rounded border border-border cursor-pointer hover:border-primary transition-colors"
                  onClick={() => navigate(`/people/${personId}`)}
                >
                  {person.attachments.length > 0 && (
                    <img
                      src={person.attachments[0].url}
                      alt={person.fullName}
                      className="w-12 h-12 rounded object-cover"
                    />
                  )}
                  <div>
                    <p className="font-mono text-foreground">{person.fullName}</p>
                    <p className="text-xs text-muted-foreground">{person.id}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {meeting.vehicleIds.length > 0 && (
        <Card className="p-6 bg-card border-border">
          <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
            <Car className="h-5 w-5" />
            VEÍCULOS ENVOLVIDOS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {meeting.vehicleIds.map((vehicleId) => {
              const vehicle = data.vehicles.find((v) => v.id === vehicleId);
              if (!vehicle) return null;
              return (
                <div
                  key={vehicleId}
                  className="flex items-center gap-3 p-3 bg-secondary rounded border border-border"
                >
                  <div>
                    <p className="font-mono text-foreground">{vehicle.plate}</p>
                    <p className="text-xs text-muted-foreground">{vehicle.model}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {meeting.gangIds.length > 0 && (
        <Card className="p-6 bg-card border-border">
          <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
            <Users2 className="h-5 w-5" />
            FACÇÕES ENVOLVIDAS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {meeting.gangIds.map((gangId) => {
              const gang = data.gangs.find((g) => g.id === gangId);
              if (!gang) return null;
              return (
                <div
                  key={gangId}
                  className="flex items-center gap-3 p-3 bg-secondary rounded border border-border"
                >
                  <div>
                    <p className="font-mono text-foreground">{gang.name}</p>
                    <p className="text-xs text-muted-foreground">{gang.id}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {meeting.attachments.length > 0 && (
        <Card className="p-6 bg-card border-border">
          <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
            <Paperclip className="h-5 w-5" />
            ANEXOS ({meeting.attachments.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {meeting.attachments.map((attachment, index) => (
              <div
                key={index}
                className="bg-secondary rounded border border-border overflow-hidden"
              >
                {attachment.type.startsWith("image/") ? (
                  <img
                    src={attachment.url}
                    alt={attachment.name}
                    className="w-full h-32 object-cover cursor-pointer"
                    onClick={() => window.open(attachment.url, '_blank')}
                  />
                ) : (
                  <div className="w-full h-32 flex items-center justify-center text-4xl text-muted-foreground">
                    📄
                  </div>
                )}
                <div className="p-2 flex items-center justify-between">
                  <p className="text-xs text-foreground truncate flex-1">{attachment.name}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDownload(attachment)}
                    className="h-6 w-6"
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
