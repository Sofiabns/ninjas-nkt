import React from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Edit, Users, Car, Users2, Paperclip } from "lucide-react";

export default function CaseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCase, getPerson, getVehicle, getGang } = useApp();

  const caseData = getCase(id!);

  if (!caseData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Caso não encontrado</p>
        <Button onClick={() => navigate("/cases/active")} className="mt-4">
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-primary text-glow">{caseData.title}</h1>
            <p className="text-muted-foreground font-mono text-sm">{caseData.id}</p>
          </div>
        </div>
        {caseData.status === "open" && (
          <Button
            onClick={() => navigate(`/cases/edit/${caseData.id}`)}
            className="bg-accent text-accent-foreground"
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        )}
      </motion.div>

      <Card className="p-6 bg-card border-border">
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-mono text-accent mb-2">STATUS</h3>
            <span
              className={`inline-block px-3 py-1 rounded ${
                caseData.status === "open"
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {caseData.status === "open" ? "ATIVO" : "FECHADO"}
            </span>
          </div>

          {caseData.closedReason && (
            <div>
              <h3 className="text-sm font-mono text-accent mb-2">MOTIVO DO FECHAMENTO</h3>
              <p className="text-foreground bg-secondary p-3 rounded border border-border">
                {caseData.closedReason}
              </p>
            </div>
          )}

          <div>
            <h3 className="text-sm font-mono text-accent mb-2">DESCRIÇÃO</h3>
            <p className="text-foreground whitespace-pre-wrap">{caseData.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-mono text-accent mb-2 flex items-center gap-2">
              <Users className="h-4 w-4" />
              PESSOAS ENVOLVIDAS ({caseData.personIds.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {caseData.personIds.map((personId) => {
                const person = getPerson(personId);
                return person ? (
                  <div
                    key={personId}
                    className="flex items-center gap-3 p-3 bg-secondary rounded border border-border cursor-pointer hover:border-primary transition-colors"
                    onClick={() => navigate(`/people/${personId}`)}
                  >
                    {person.photoUrl && (
                      <img
                        src={person.photoUrl}
                        alt={person.fullName}
                        className="w-12 h-12 rounded object-cover"
                      />
                    )}
                    <div>
                      <p className="font-mono text-sm text-foreground">{person.fullName}</p>
                      <p className="text-xs text-muted-foreground">{personId}</p>
                    </div>
                  </div>
                ) : (
                  <div key={personId} className="p-3 bg-secondary rounded border border-border">
                    <p className="text-sm text-muted-foreground">ID: {personId} (não encontrado)</p>
                  </div>
                );
              })}
              {caseData.personIds.length === 0 && (
                <p className="text-sm text-muted-foreground col-span-2">Nenhuma pessoa envolvida</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-mono text-accent mb-2 flex items-center gap-2">
              <Car className="h-4 w-4" />
              VEÍCULOS ENVOLVIDOS ({caseData.vehicleIds.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {caseData.vehicleIds.map((vehicleId) => {
                const vehicle = getVehicle(vehicleId);
                return vehicle ? (
                  <div
                    key={vehicleId}
                    className="flex items-center gap-3 p-3 bg-secondary rounded border border-border"
                  >
                    <div>
                      <p className="font-mono text-sm text-foreground">{vehicle.plate}</p>
                      <p className="text-xs text-muted-foreground">{vehicle.model}</p>
                    </div>
                  </div>
                ) : null;
              })}
              {caseData.vehicleIds.length === 0 && (
                <p className="text-sm text-muted-foreground col-span-2">Nenhum veículo envolvido</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-mono text-accent mb-2 flex items-center gap-2">
              <Users2 className="h-4 w-4" />
              FACÇÕES ENVOLVIDAS ({caseData.gangIds.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {caseData.gangIds.map((gangId) => {
                const gang = getGang(gangId);
                return gang ? (
                  <span
                    key={gangId}
                    className="px-3 py-1 bg-secondary rounded border border-border text-sm"
                  >
                    {gang.name}
                  </span>
                ) : null;
              })}
              {caseData.gangIds.length === 0 && (
                <p className="text-sm text-muted-foreground">Nenhuma facção envolvida</p>
              )}
            </div>
          </div>

          {caseData.attachments.length > 0 && (
            <div>
              <h3 className="text-sm font-mono text-accent mb-2 flex items-center gap-2">
                <Paperclip className="h-4 w-4" />
                ANEXOS ({caseData.attachments.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {caseData.attachments.map((attachment) => (
                  <a
                    key={attachment.id}
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    {attachment.type.startsWith("image/") ? (
                      <img
                        src={attachment.url}
                        alt={attachment.name}
                        className="w-full h-32 object-cover rounded border border-border hover:border-primary transition-colors"
                      />
                    ) : (
                      <div className="w-full h-32 bg-secondary rounded border border-border hover:border-primary transition-colors flex flex-col items-center justify-center p-2">
                        <p className="text-xs font-mono text-center break-all">
                          {attachment.name}
                        </p>
                      </div>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-border text-xs text-muted-foreground">
            <p>Criado em: {new Date(caseData.createdAt).toLocaleString()}</p>
            {caseData.closedAt && (
              <p>Fechado em: {new Date(caseData.closedAt).toLocaleString()}</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
