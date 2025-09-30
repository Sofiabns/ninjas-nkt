import React from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useApp } from "@/contexts/AppContext";
import { ArrowLeft, Download } from "lucide-react";

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

  const handleDownloadImage = (url: string, index: number) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${deep.title}_${index + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

      {deep.images.length > 0 && (
        <Card className="p-6 bg-card border-border">
          <h2 className="text-xl font-bold text-primary mb-4">IMAGENS ({deep.images.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deep.images.map((img, index) => (
              <div key={index} className="relative group">
                <img
                  src={img}
                  alt={`${deep.title} ${index + 1}`}
                  className="w-full h-64 object-cover rounded border border-border cursor-pointer"
                  onClick={() => window.open(img, '_blank')}
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
    </div>
  );
}
