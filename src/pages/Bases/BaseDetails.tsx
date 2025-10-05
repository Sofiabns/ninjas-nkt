import React from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/contexts/AppContext";
import { ArrowLeft, Download, FileText, ExternalLink } from "lucide-react";

export default function BaseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data } = useApp();

  const base = data.bases.find((b) => b.id === id);

  if (!base) {
    return (
      <div className="space-y-6">
        <Card className="p-12 text-center bg-card border-border">
          <p className="text-muted-foreground">Base não encontrada</p>
          <Button onClick={() => navigate("/bases")} className="mt-4">
            Voltar
          </Button>
        </Card>
      </div>
    );
  }

  const gang = base.gangId ? data.gangs.find((g) => g.id === base.gangId) : null;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Button
          variant="ghost"
          onClick={() => navigate("/bases")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-accent font-mono text-sm">{base.id}</span>
              <h1 className="text-4xl font-bold text-primary text-glow">
                {base.name}
              </h1>
            </div>
            <p className="text-muted-foreground font-mono text-sm">
              Criado em {new Date(base.createdAt).toLocaleString()}
            </p>

            {base.attachments && base.attachments.length > 0 && base.attachments[0].type.startsWith("image/") && (
              <div className="aspect-video bg-secondary rounded mt-4 overflow-hidden">
                <img
                  src={base.attachments[0].url}
                  alt={base.attachments[0].name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          <Button
            onClick={() => navigate(`/bases/edit/${base.id}`)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 box-glow"
          >
            Editar
          </Button>
        </div>
      </motion.div>

      <Card className="p-6 bg-card border-border">
        <h2 className="text-xl font-bold text-primary mb-4">DESCRIÇÃO</h2>
        <p className="text-foreground whitespace-pre-wrap">{base.description}</p>
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

      {base.attachments && base.attachments.length > 0 && (
        <Card className="p-6 bg-card border-border">
          <h2 className="text-xl font-bold text-primary mb-4">ANEXOS ({base.attachments.length})</h2>
          <div className="space-y-2">
            {base.attachments.map((attachment) => (
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

      {Object.keys(base.metadata).length > 0 && (
        <Card className="p-6 bg-card border-border">
          <h2 className="text-xl font-bold text-primary mb-4">METADATA</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(base.metadata).map(([key, value]) => (
              <div key={key} className="p-3 bg-secondary rounded border border-border">
                <p className="text-xs text-accent font-mono mb-1">{key}</p>
                <p className="text-sm text-foreground">{value}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
