import React from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/contexts/AppContext";
import { ArrowLeft, Download, FileText, ExternalLink, Paperclip } from "lucide-react";

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
          <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
            <Paperclip className="h-5 w-5" />
            ANEXOS ({base.attachments.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {base.attachments.map((attachment, index) => {
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
