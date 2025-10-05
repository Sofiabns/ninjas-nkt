import React from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/contexts/AppContext";
import { ArrowLeft, Download, FileText, ExternalLink } from "lucide-react";

export default function DeepDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data } = useApp();

  const deep = data.deeps.find((d) => d.id === id);

  if (!deep) {
    return (
      <div className="space-y-6">
        <Card className="p-12 text-center bg-card border-border">
          <p className="text-muted-foreground">Deep não encontrado</p>
          <Button onClick={() => navigate("/deeps")} className="mt-4">
            Voltar
          </Button>
        </Card>
      </div>
    );
  }

  const gang = deep.gangId ? data.gangs.find((g) => g.id === deep.gangId) : null;
  const people = deep.personIds?.map(pid => data.people.find(p => p.id === pid)).filter(Boolean) || [];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Button
          variant="ghost"
          onClick={() => navigate("/deeps")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-accent font-mono text-sm">{deep.id}</span>
              <h1 className="text-4xl font-bold text-primary text-glow">
                {deep.title}
              </h1>
            </div>
            <p className="text-muted-foreground font-mono text-sm">
              Criado em {new Date(deep.createdAt).toLocaleString()}
            </p>
          </div>

          <Button
            onClick={() => navigate(`/deeps/edit/${deep.id}`)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 box-glow"
          >
            Editar
          </Button>
        </div>
      </motion.div>

      <Card className="p-6 bg-card border-border">
        <h2 className="text-xl font-bold text-primary mb-4">DESCRIÇÃO</h2>
        <p className="text-foreground whitespace-pre-wrap">{deep.description}</p>
      </Card>

      {gang && (
        <Card className="p-6 bg-card border-border">
          <h2 className="text-xl font-bold text-primary mb-4">FACÇÃO</h2>
          <Badge 
            style={{ backgroundColor: gang.color, color: '#fff' }}
            className="text-lg px-4 py-2"
          >
            {gang.name}
          </Badge>
        </Card>
      )}

      {people.length > 0 && (
        <Card className="p-6 bg-card border-border">
          <h2 className="text-xl font-bold text-primary mb-4">PESSOAS ENVOLVIDAS ({people.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {people.map((person) => person && (
              <div
                key={person.id}
                className="flex items-center gap-3 p-3 bg-secondary rounded border border-border cursor-pointer hover:border-primary transition-all"
                onClick={() => navigate(`/people/${person.id}`)}
              >
                {person.photoUrl && (
                  <img
                    src={person.photoUrl}
                    alt={person.fullName}
                    className="w-12 h-12 rounded object-cover"
                  />
                )}
                <div className="flex-1">
                  <p className="text-sm font-mono text-foreground">{person.fullName}</p>
                  <p className="text-xs text-muted-foreground">{person.id}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {deep.attachments && deep.attachments.length > 0 && (
        <Card className="p-6 bg-card border-border">
          <h2 className="text-xl font-bold text-primary mb-4">ANEXOS ({deep.attachments.length})</h2>
          <div className="space-y-2">
            {deep.attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center justify-between p-3 bg-secondary rounded border border-border"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-mono text-foreground">{attachment.name}</p>
                    <p className="text-xs text-muted-foreground">{attachment.type}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.open(attachment.url, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = attachment.url;
                      link.download = attachment.name;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    <Download className="h-4 w-4" />
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
