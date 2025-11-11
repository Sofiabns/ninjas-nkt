import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/common/SearchInput";
import { useApp } from "@/contexts/AppContext";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function MeetingsList() {
  const { data, deleteMeeting } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = data.meetings.filter(
    (meeting) =>
      meeting.title.toLowerCase().includes(search.toLowerCase()) ||
      meeting.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja deletar esta reunião?")) {
      deleteMeeting(id);
      toast.success("Reunião deletada");
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold text-primary text-glow">REUNIÕES</h1>
          <p className="text-muted-foreground font-mono text-sm mt-1">
            {filtered.length} reunião(ões) registrada(s)
          </p>
        </div>
        <Button
          onClick={() => navigate("/meetings/new")}
          className="bg-primary text-primary-foreground hover:bg-primary/90 box-glow"
        >
          <Plus className="h-4 w-4 mr-2" />
          NOVA REUNIÃO
        </Button>
      </motion.div>

      <SearchInput value={search} onChange={setSearch} placeholder="Buscar por título ou ID..." />

      <div className="space-y-3">
        {filtered.map((meeting, index) => (
          <motion.div
            key={meeting.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="p-4 bg-card border-border hover:border-primary transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-accent font-mono text-sm">{meeting.id}</span>
                    <h3 className="text-lg font-bold text-foreground">{meeting.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{meeting.description}</p>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>Data: {new Date(meeting.meetingDate).toLocaleString()}</span>
                    <span>Pessoas: {meeting.personIds.length}</span>
                    <span>Anexos: {meeting.attachments.length}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/meetings/${meeting.id}`)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Ver
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/meetings/edit/${meeting.id}`)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(meeting.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <Card className="p-12 text-center bg-card border-border">
            <p className="text-muted-foreground">Nenhuma reunião encontrada</p>
          </Card>
        )}
      </div>
    </div>
  );
}
