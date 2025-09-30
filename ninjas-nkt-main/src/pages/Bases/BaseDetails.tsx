import React from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useApp } from "@/contexts/AppContext";
import { ArrowLeft, Download } from "lucide-react";

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

  const handleDownloadImage = (url: string, index: number) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${base.name}_${index + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

      {base.images.length > 0 && (
        <Card className="p-6 bg-card border-border">
          <h2 className="text-xl font-bold text-primary mb-4">IMAGENS ({base.images.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {base.images.map((img, index) => (
              <div key={index} className="relative group">
                <img
                  src={img}
                  alt={`${base.name} ${index + 1}`}
                  className="w-full h-64 object-cover rounded border border-border"
                />
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => handleDownloadImage(img, index)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Download className="h-4 w-4" />
                </Button>
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
