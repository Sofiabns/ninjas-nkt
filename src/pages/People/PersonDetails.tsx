import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Edit, FolderOpen } from "lucide-react";

import { db } from "../../services/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  onSnapshot,
  DocumentData,
} from "firebase/firestore";

interface Person {
  id: string;
  fullName: string;
  gang: string;
  hierarchy: string;
  phone: string;
  photoUrl?: string;
  vehicleIds: string[];
}

interface Case {
  id: string;
  title: string;
  status: "open" | "closed";
  personIds: string[];
}

interface Vehicle {
  id: string;
  plate: string;
  model: string;
}

export default function PersonDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [person, setPerson] = useState<Person | null>(null);
  const [personCases, setPersonCases] = useState<Case[]>([]);
  const [personVehicles, setPersonVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    // Buscar pessoa
    const personRef = doc(db, "people", id);
    getDoc(personRef).then((docSnap) => {
      if (docSnap.exists()) {
        setPerson({ id: docSnap.id, ...(docSnap.data() as Person) });
      } else {
        setPerson(null);
      }
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    if (!person) return;

    // Escutar casos que envolvem essa pessoa
    const casesRef = collection(db, "cases");
    const q = query(casesRef, where("personIds", "array-contains", person.id));
    const unsubscribeCases = onSnapshot(q, (snapshot) => {
      const casesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Case),
      }));
      setPersonCases(casesData);
    });

    // Escutar veículos associados
    if (person.vehicleIds && person.vehicleIds.length > 0) {
      const vehiclesRef = collection(db, "vehicles");
      // Para buscar múltiplos veículos por id, pode-se usar múltiplos getDoc ou um query com where in (máximo 10 ids)
      // Aqui vamos buscar individualmente para simplicidade
      Promise.all(
        person.vehicleIds.map(async (vid) => {
          const vDoc = await getDoc(doc(vehiclesRef, vid));
          return vDoc.exists() ? ({ id: vDoc.id, ...(vDoc.data() as Vehicle) }) : null;
        })
      ).then((vehicles) => {
        setPersonVehicles(vehicles.filter(Boolean) as Vehicle[]);
      });
    } else {
      setPersonVehicles([]);
    }

    return () => {
      unsubscribeCases();
    };
  }, [person]);

  if (loading) {
    return <p className="text-center py-12">Carregando...</p>;
  }

  if (!person) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Pessoa não encontrada</p>
        <Button onClick={() => navigate("/people")} className="mt-4">
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-primary text-glow">{person.fullName}</h1>
            <p className="text-muted-foreground font-mono text-sm">{person.id}</p>
          </div>
        </div>
        <Button
          onClick={() => navigate(`/people/edit/${person.id}`)}
          className="bg-accent text-accent-foreground"
        >
          <Edit className="h-4 w-4 mr-2" />
          Editar
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-card border-border">
          <div className="w-full aspect-square bg-secondary rounded overflow-hidden mb-4">
            {person.photoUrl ? (
              <img src={person.photoUrl} alt={person.fullName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl text-muted-foreground">
                {person.fullName[0]}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs font-mono text-accent mb-1">FACÇÃO</p>
              <p className="text-foreground">{person.gang}</p>
            </div>
            <div>
              <p className="text-xs font-mono text-accent mb-1">HIERARQUIA</p>
              <p className="text-foreground">{person.hierarchy}</p>
            </div>
            <div>
              <p className="text-xs font-mono text-accent mb-1">TELEFONE</p>
              <p className="text-foreground font-mono">{person.phone}</p>
            </div>
          </div>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <Card className="p-6 bg-card border-border">
            <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              HISTÓRICO DE CASOS ({personCases.length})
            </h2>

            <div className="space-y-3">
              {personCases.length > 0 ? (
                personCases.map((caseItem) => (
                  <div
                    key={caseItem.id}
                    className="p-3 bg-secondary rounded border border-border cursor-pointer hover:border-primary transition-colors"
                    onClick={() => navigate(`/cases/${caseItem.id}`)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-mono text-sm text-accent">{caseItem.id}</p>
                        <p className="font-bold text-foreground">{caseItem.title}</p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          caseItem.status === "open"
                            ? "bg-primary/20 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {caseItem.status === "open" ? "ATIVO" : "FECHADO"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Envolvido: {person.fullName} ({person.id})
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">Nenhum caso registrado</p>
              )}
            </div>
          </Card>

          {personVehicles.length > 0 && (
            <Card className="p-6 bg-card border-border">
              <h2 className="text-xl font-bold text-primary mb-4">VEÍCULOS ASSOCIADOS</h2>
              <div className="space-y-2">
                {personVehicles.map((vehicle) => (
                  <div key={vehicle.id} className="p-3 bg-secondary rounded border border-border">
                    <p className="font-mono text-foreground">{vehicle.plate}</p>
                    <p className="text-sm text-muted-foreground">{vehicle.model}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
