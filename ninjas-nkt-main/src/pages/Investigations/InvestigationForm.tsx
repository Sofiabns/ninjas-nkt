import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/common/FileUpload";
import { useApp } from "@/contexts/AppContext";
import { Card } from "@/components/ui/card";
import { Attachment } from "@/types";
import { toast } from "sonner";
import { X, Plus } from "lucide-react";

export default function InvestigationForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, addInvestigation, updateInvestigation, getInvestigation, getPerson } = useApp();

  const [title, setTitle] = useState("");
  const [sections, setSections] = useState<{ label: string; content: string }[]>([
    { label: "Resumo", content: "" },
  ]);
  const [personIds, setPersonIds] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [personSearch, setPersonSearch] = useState("");

  useEffect(() => {
    if (id) {
      const investigation = getInvestigation(id);
      if (investigation) {
        setTitle(investigation.title);
        setSections(investigation.sections);
        setPersonIds(investigation.personIds);
        setAttachments(investigation.attachments);
      }
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || sections.length === 0) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    if (id) {
      updateInvestigation(id, { title, sections, personIds, attachments });
      toast.success("Investigação atualizada");
    } else {
      addInvestigation({ title, sections, personIds, attachments });
      toast.success("Investigação criada");
    }
    navigate("/investigations");
  };

  const addSection = () => {
    setSections([...sections, { label: "", content: "" }]);
  };

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const updateSection = (index: number, field: "label" | "content", value: string) => {
    const updated = [...sections];
    updated[index][field] = value;
    setSections(updated);
  };

  const filteredPeople = data.people.filter(
    (p) =>
      !personIds.includes(p.id) &&
      (p.fullName.toLowerCase().includes(personSearch.toLowerCase()) ||
        p.id.toLowerCase().includes(personSearch.toLowerCase()))
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-primary text-glow">
          {id ? "EDITAR INVESTIGAÇÃO" : "NOVA INVESTIGAÇÃO"}
        </h1>
      </motion.div>

      <Card className="p-6 bg-card border-border">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-mono text-foreground mb-2 block">TÍTULO *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Investigação Operação Alpha"
              className="bg-input border-border"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-mono text-foreground">SEÇÕES DO RELATÓRIO *</label>
              <Button type="button" variant="outline" size="sm" onClick={addSection}>
                <Plus className="h-4 w-4 mr-1" />
                Adicionar Seção
              </Button>
            </div>

            <div className="space-y-4">
              {sections.map((section, index) => (
                <div key={index} className="p-4 bg-secondary rounded border border-border">
                  <div className="flex items-start gap-3 mb-3">
                    <Input
                      value={section.label}
                      onChange={(e) => updateSection(index, "label", e.target.value)}
                      placeholder="Nome da seção (ex: Análise de CCTV)"
                      className="bg-input border-border flex-1"
                    />
                    {sections.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSection(index)}
                      >
                        <X className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                  <Textarea
                    value={section.content}
                    onChange={(e) => updateSection(index, "content", e.target.value)}
                    placeholder="Conteúdo da seção..."
                    className="bg-input border-border min-h-[100px]"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-mono text-foreground mb-2 block">
              PESSOAS ENVOLVIDAS
            </label>
            <Input
              value={personSearch}
              onChange={(e) => setPersonSearch(e.target.value)}
              placeholder="Buscar pessoa por nome ou ID..."
              className="bg-input border-border mb-2"
            />

            {personSearch && filteredPeople.length > 0 && (
              <div className="mb-3 max-h-40 overflow-y-auto border border-border rounded bg-popover">
                {filteredPeople.slice(0, 5).map((person) => (
                  <button
                    key={person.id}
                    type="button"
                    onClick={() => {
                      setPersonIds([...personIds, person.id]);
                      setPersonSearch("");
                    }}
                    className="w-full p-2 hover:bg-secondary text-left flex items-center gap-2"
                  >
                    {person.photoUrl && (
                      <img
                        src={person.photoUrl}
                        alt={person.fullName}
                        className="w-8 h-8 rounded object-cover"
                      />
                    )}
                    <div>
                      <p className="text-sm font-mono text-foreground">{person.fullName}</p>
                      <p className="text-xs text-muted-foreground">{person.id}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {personIds.map((personId) => {
                const person = getPerson(personId);
                return person ? (
                  <div
                    key={personId}
                    className="flex items-center gap-2 px-3 py-1 bg-secondary border border-border rounded"
                  >
                    {person.photoUrl && (
                      <img
                        src={person.photoUrl}
                        alt={person.fullName}
                        className="w-6 h-6 rounded object-cover"
                      />
                    )}
                    <span className="text-sm">{person.fullName}</span>
                    <button
                      type="button"
                      onClick={() => setPersonIds(personIds.filter((id) => id !== personId))}
                      className="ml-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : null;
              })}
            </div>
          </div>

          <div>
            <label className="text-sm font-mono text-foreground mb-2 block">ANEXOS</label>
            <FileUpload attachments={attachments} onChange={setAttachments} />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/investigations")}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-primary text-primary-foreground box-glow">
              {id ? "Atualizar" : "Criar"} Investigação
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
