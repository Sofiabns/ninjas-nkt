import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/common/SearchInput";
import { useApp } from "@/contexts/AppContext";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function VehiclesList() {
  const { data, deleteVehicle, getPerson } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = data.vehicles.filter(
    (v) =>
      v.plate.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase()) ||
      v.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja deletar este veículo?")) {
      deleteVehicle(id);
      toast.success("Veículo deletado");
    }
  };

  if (!data?.vehicles) {
    return <div className="text-center py-10">Nenhum veículo encontrado.</div>;
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold text-primary text-glow">REGISTRO DE VEÍCULOS</h1>
          <p className="text-muted-foreground font-mono text-sm mt-1">
            {filtered.length} veículo(s) registrado(s)
          </p>
        </div>
        <Button
          onClick={() => navigate("/vehicles/new")}
          className="bg-primary text-primary-foreground hover:bg-primary/90 box-glow"
        >
          <Plus className="h-4 w-4 mr-2" />
          NOVO VEÍCULO
        </Button>
      </motion.div>

      <SearchInput value={search} onChange={setSearch} placeholder="Buscar por placa, modelo ou ID..." />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((vehicle, index) => {
          const owner = vehicle.ownerId ? getPerson(vehicle.ownerId) : null;

          return (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-4 bg-card border-border hover:border-primary transition-all">
                <div className="aspect-video bg-secondary rounded mb-3 overflow-hidden">
                  {vehicle.photoUrl ? (
                    <img
                      src={vehicle.photoUrl}
                      alt={vehicle.model}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-muted-foreground">
                      🚗
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div>
                    <p className="text-lg font-bold text-primary font-mono">{vehicle.plate}</p>
                    <p className="text-sm text-foreground">{vehicle.model}</p>
                    <p className="text-xs text-accent font-mono">{vehicle.id}</p>
                  </div>

                  {owner && (
                    <div className="text-xs text-muted-foreground">
                      Proprietário: {owner.fullName}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/vehicles/edit/${vehicle.id}`)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(vehicle.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-full">
            <Card className="p-12 text-center bg-card border-border">
              <p className="text-muted-foreground">Nenhum veículo encontrado</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
