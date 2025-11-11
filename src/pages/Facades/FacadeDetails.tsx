import React from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useApp } from "@/contexts/AppContext";
import { Edit, Users, Building2, Image as ImageIcon, ArrowLeft, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function FacadeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getFacade, data, deleteFacade } = useApp();

  const facade = id ? getFacade(id) : undefined;

  if (!facade) {
    return (
      <div className="space-y-6">
        <Card className="p-12 text-center bg-card border-border">
          <p className="text-muted-foreground">Fachada não encontrada</p>
          <Button onClick={() => navigate("/facades")} className="mt-4">
            Voltar
          </Button>
        </Card>
      </div>
    );
  }

  const gang = facade.gangId ? data.gangs.find(g => g.id === facade.gangId) : null;
  const members = facade.personIds
    .map(pid => data.people.find(p => p.id === pid))
    .filter(Boolean);

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteFacade(id);
      toast.success("Fachada deletada com sucesso");
      navigate("/facades");
    } catch (error) {
      toast.error("Erro ao deletar fachada");
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/facades")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <span className="text-accent font-mono text-sm">{facade.id}</span>
              <h1 className="text-4xl font-bold text-primary text-glow">{facade.name}</h1>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => navigate(`/facades/edit/${facade.id}`)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 box-glow"
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Deletar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Deletar Fachada</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja deletar a fachada "{facade.name}"? Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Deletar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </motion.div>

      {facade.description && (
        <Card className="p-6 bg-card border-border">
          <p className="text-foreground">{facade.description}</p>
        </Card>
      )}

      {gang && (
        <Card className="p-6 bg-card border-border">
          <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5" /> FACÇÃO
          </h2>
          <button
            onClick={() => navigate(`/gangs/${gang.id}`)}
            className="flex items-center gap-2 px-3 py-2 bg-secondary rounded border border-border hover:border-primary transition-colors"
          >
            {gang.color && (
              <span
                className="w-4 h-4 rounded-full border border-border"
                style={{ backgroundColor: gang.color }}
              />
            )}
            <span className="text-sm text-foreground font-mono">{gang.name}</span>
          </button>
        </Card>
      )}

      {members.length > 0 && (
        <Card className="p-6 bg-card border-border">
          <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
            <Users className="h-5 w-5" /> MEMBROS ({members.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-2 p-2 bg-secondary rounded border border-border cursor-pointer hover:border-primary transition-colors"
                onClick={() => navigate(`/people/${member.id}`)}
              >
                {member.attachments.length > 0 && (
                  <img
                    src={member.attachments[0].url}
                    alt={member.fullName}
                    className="w-10 h-10 rounded object-cover"
                  />
                )}
                <div>
                  <p className="text-sm font-mono text-foreground">{member.fullName}</p>
                  <p className="text-xs text-muted-foreground">{member.hierarchy}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {facade.attachments.length > 0 && (
        <Card className="p-6 bg-card border-border">
          <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
            <ImageIcon className="h-5 w-5" /> ANEXOS ({facade.attachments.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {facade.attachments.map((att) => (
              <div key={att.id} className="relative group">
                {att.type.startsWith("image/") ? (
                  <img
                    src={att.url}
                    alt={att.name}
                    className="w-full h-32 object-cover rounded border border-border group-hover:border-primary transition-colors cursor-pointer"
                    onClick={() => window.open(att.url, '_blank')}
                  />
                ) : (
                  <div className="w-full h-32 flex items-center justify-center bg-secondary rounded border border-border group-hover:border-primary transition-colors">
                    <span className="text-xs text-muted-foreground truncate px-2">{att.name}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
