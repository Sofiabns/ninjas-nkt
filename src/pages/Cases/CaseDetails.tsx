import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Edit, Users, Car, Users2, Paperclip } from "lucide-react";
import { db } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "sonner";

export default function CaseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCase, getPerson, getVehicle, getGang } = useApp();

  const [caseData, setCaseData] = useState<any | null>(null);

  // 🔹 Busca no Firebase quando abre a tela
  useEffect(() => {
    const fetchCase = async () => {
      try {
        if (!id) return;
        const ref = doc(db, "cases", id);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setCaseData({ id: snap.id, ...snap.data() });
        } else {
          toast.error("Caso não encontrado no banco");
          navigate("/cases/active");
        }
      } catch (err) {
        console.error(err);
        toast.error("Erro ao carregar o caso");
      }
    };

    fetchCase();
  }, [id, navigate]);

  // 🔹 Fallback: caso não tenha carregado do Firebase, usa contexto
  const localCase = getCase(id!);

  const data = caseData || localCase;

  if (!data) {
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
            <h1 className="text-4xl font-bold text-primary text-glow">{data.title}</h1>
            <p className="text-muted-foreground font-mono text-sm">{data.id}</p>
          </div>
        </div>
        {data.status === "open" && (
          <Button
            onClick={() => navigate(`/cases/edit/${data.id}`)}
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
                data.status === "open"
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {data.status === "open" ? "ATIVO" : "FECHADO"}
            </span>
          </div>

          {data.closedReason && (
            <div>
              <h3 className="text-sm font-mono text-accent mb-2">MOTIVO DO FECHAMENTO</h3>
              <p className="text-foreground bg-secondary p-3 rounded border border-border">
                {data.closedReason}
              </p>
            </div>
          )}

          <div>
            <h3 className="text-sm font-mono text-accent mb-2">DESCRIÇÃO</h3>
            <p className="text-foreground whitespace-pre-wrap">{data.description}</p>
          </div>

          {/* Pessoas */}
          <div>
            <h3 className="text-sm font-mono text-accent mb-2 flex items-center gap-2">
              <Users className="h-4 w-4" />
              PESSOAS ENVOLVIDAS ({data.personIds.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.personIds.map((personId: string) => {
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
              {data.personIds.length === 0 && (
                <p className="text-sm text-muted-foreground col-span-2">Nenhuma pessoa envolvida</p>
              )}
            </div>
          </div>

          {/* Veículos */}
          <div>
            <h3 className="text-sm font-mono text-accent mb-2 flex items-center gap-2">
              <Car className="h-4 w-4" />
              VEÍCULOS ENVOLVIDOS ({data.vehicleIds.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.vehicleIds.map((vehicleId: string) => {
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
              {data.vehicleIds.length === 0 && (
                <p className="text-sm text-muted-foreground col-span-2">Nenhum veículo envolvido</p>
              )}
            </div>
          </div>

          {/* Facções */}
          <div>
            <h3 className="text-sm font-mono text-accent mb-2 flex items-center gap-2">
              <Users2 className="h-4 w-4" />
              FACÇÕES ENVOLVIDAS ({data.gangIds.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.gangIds.map((gangId: string) => {
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
              {data.gangIds.length === 0 && (
                <p className="text-sm text-muted-foreground">Nenhuma facção envolvida</p>
              )}
            </div>
          </div>

          {/* Anexos */}
          {data.attachments.length > 0 && (
            <div>
              <h3 className="text-sm font-mono text-accent mb-2 flex items-center gap-2">
                <Paperclip className="h-4 w-4" />
                ANEXOS ({data.attachments.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {data.attachments.map((attachment: any) => (
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
            <p>Criado em: {new Date(data.createdAt).toLocaleString()}</p>
            {data.closedAt && <p>Fechado em: {new Date(data.closedAt).toLocaleString()}</p>}
          </div>
        </div>
      </Card>
    </div>
  );
}
