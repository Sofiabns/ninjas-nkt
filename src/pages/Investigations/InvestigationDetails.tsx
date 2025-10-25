import React from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useApp } from "@/contexts/AppContext";
import { ArrowLeft, User, FileText, Paperclip, Users } from "lucide-react";

export default function InvestigationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getInvestigation, getPerson, getGang } = useApp();

  const investigation = id ? getInvestigation(id) : null;

  if (!investigation) {
    return (
      <div className="space-y-6">
        <Card className="p-12 text-center bg-card border-border">
          <p className="text-muted-foreground">Investigação não encontrada</p>
          <Button onClick={() => navigate("/investigations")} className="mt-4">
            Voltar
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Button
          variant="ghost"
          onClick={() => navigate("/investigations")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-accent font-mono text-sm">{investigation.id}</span>
              <h1 className="text-4xl font-bold text-primary text-glow">
                {investigation.title}
              </h1>
            </div>
            <p className="text-muted-foreground font-mono text-sm">
              Criado em {new Date(investigation.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => navigate(`/investigations/edit/${investigation.id}`)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 box-glow"
            >
              Editar
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Pessoas Envolvidas */}
      {investigation.personIds.length > 0 && (
        <Card className="p-6 bg-card border-border">
          <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
            <User className="h-5 w-5" />
            PESSOAS ENVOLVIDAS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {investigation.personIds.map((personId) => {
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

      {/* Facções Envolvidas */}
      {investigation.factionIds && investigation.factionIds.length > 0 && (
        <Card className="p-6 bg-card border-border">
          <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
            <Users className="h-5 w-5" />
            FACÇÕES ENVOLVIDAS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {investigation.factionIds.map((factionId) => {
              const faction = getGang(factionId);
              if (!faction) return null;
              return (
                <div
                  key={factionId}
                  className="flex items-center gap-3 p-3 bg-secondary rounded border border-border cursor-pointer hover:border-primary transition-colors"
                  onClick={() => navigate(`/gangs/${factionId}`)}
                >
                  <div>
                    <p className="font-mono text-foreground">{faction.name}</p>
                    <p className="text-xs text-muted-foreground">{faction.id}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Seções */}
      <Card className="p-6 bg-card border-border">
        <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5" />
          RELATÓRIO
        </h2>
        <div className="space-y-6">
          {investigation.sections.map((section, index) => (
            <div key={index} className="border-l-2 border-primary pl-4">
              <h3 className="text-lg font-bold text-accent mb-2">{section.label}</h3>
              <p className="text-foreground whitespace-pre-wrap">{section.content}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Anexos */}
      {investigation.attachments.length > 0 && (
        <Card className="p-6 bg-card border-border">
          <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
            <Paperclip className="h-5 w-5" />
            ANEXOS ({investigation.attachments.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {investigation.attachments.map((attachment, index) => {
              const isImage = attachment.type.startsWith("image/");
              return (
                <div
                  key={index}
                  className="bg-secondary rounded border border-border overflow-hidden group"
                >
                  <div className="relative">
                    {isImage ? (
                      <img
                        src={attachment.url}
                        alt={attachment.name}
                        className="w-full h-48 object-cover cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => window.open(attachment.url, '_blank')}
                      />
                    ) : (
                      <div className="w-full h-48 flex items-center justify-center text-6xl text-muted-foreground bg-card">
                        📄
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a
                        href={attachment.url}
                        download={attachment.name}
                        className="p-2 bg-black/60 rounded hover:bg-black/80"
                        title="Baixar"
                      >
                        <Paperclip className="h-4 w-4 text-white" />
                      </a>
                      <a
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-black/60 rounded hover:bg-black/80"
                        title="Abrir"
                      >
                        <span className="text-white text-xs">Abrir</span>
                      </a>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-foreground truncate font-mono">{attachment.name}</p>
                    {isImage && (
                      <button
                        onClick={() => window.open(attachment.url, '_blank')}
                        className="text-xs text-accent hover:text-primary mt-1"
                      >
                        Ver imagem completa
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
