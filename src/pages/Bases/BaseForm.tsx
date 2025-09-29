import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/contexts/AppContext";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { fileToDataUrl } from "@/utils/validation";
import { Upload, X } from "lucide-react";

export default function BaseForm() {
  const navigate = useNavigate();
  const { addBase } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const dataUrl = await fileToDataUrl(files[i]);
      newImages.push(dataUrl);
    }
    setImages([...images, ...newImages]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Preencha o nome da base");
      return;
    }

    addBase({ name, description, images, metadata: {} });
    toast.success("Base criada");
    navigate("/bases");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-primary text-glow">NOVA BASE</h1>
      </motion.div>

      <Card className="p-6 bg-card border-border">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-mono text-foreground mb-2 block">NOME *</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Base Central"
              className="bg-input border-border"
              required
            />
          </div>

          <div>
            <label className="text-sm font-mono text-foreground mb-2 block">DESCRIÇÃO</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva a base..."
              className="bg-input border-border min-h-[100px]"
            />
          </div>

          <div>
            <label className="text-sm font-mono text-foreground mb-2 block">IMAGENS</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Imagens
            </Button>

            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-3">
                {images.map((img, index) => (
                  <div key={index} className="relative">
                    <img src={img} alt="" className="w-full h-24 object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, i) => i !== index))}
                      className="absolute top-1 right-1 bg-destructive text-white rounded p-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => navigate("/bases")} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-primary text-primary-foreground box-glow">
              Criar Base
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
