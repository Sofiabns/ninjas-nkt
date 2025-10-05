import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Users, Car, Building, FolderOpen, Scale, Users2 } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export default function GlobalSearch() {
  const { data } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const searchTerm = search.toLowerCase().trim();

  // Search people
  const foundPeople = searchTerm
    ? data.people.filter(
        (p) =>
          p.fullName.toLowerCase().includes(searchTerm) ||
          p.phone.includes(searchTerm) ||
          p.id.toLowerCase().includes(searchTerm) ||
          p.gang.toLowerCase().includes(searchTerm)
      )
    : [];

  // Search vehicles
  const foundVehicles = searchTerm
    ? data.vehicles.filter(
        (v) => {
          const owner = data.people.find((p) => p.id === v.ownerId);
          return (
            v.plate.toLowerCase().includes(searchTerm) ||
            v.model.toLowerCase().includes(searchTerm) ||
            v.id.toLowerCase().includes(searchTerm) ||
            (owner && owner.fullName.toLowerCase().includes(searchTerm))
          );
        }
      )
    : [];

  // Search gangs
  const foundGangs = searchTerm
    ? data.gangs.filter(
        (g) =>
          g.name.toLowerCase().includes(searchTerm) ||
          g.description.toLowerCase().includes(searchTerm) ||
          g.id.toLowerCase().includes(searchTerm)
      )
    : [];

  // Search cases
  const foundCases = searchTerm
    ? data.cases.filter(
        (c) =>
          c.title.toLowerCase().includes(searchTerm) ||
          c.description.toLowerCase().includes(searchTerm) ||
          c.id.toLowerCase().includes(searchTerm)
      )
    : [];

  // Search investigations
  const foundInvestigations = searchTerm
    ? data.investigations.filter(
        (i) =>
          i.title.toLowerCase().includes(searchTerm) ||
          i.id.toLowerCase().includes(searchTerm) ||
          i.sections.some((s) => s.content.toLowerCase().includes(searchTerm))
      )
    : [];

  // Search charges
  const foundCharges = searchTerm
    ? data.charges.filter(
        (c) =>
          c.reason.toLowerCase().includes(searchTerm) ||
          c.id.toLowerCase().includes(searchTerm)
      )
    : [];

  // Search bases
  const foundBases = searchTerm
    ? data.bases.filter(
        (b) => {
          const gang = b.gangId ? data.gangs.find((g) => g.id === b.gangId) : null;
          return (
            b.name.toLowerCase().includes(searchTerm) ||
            b.description.toLowerCase().includes(searchTerm) ||
            b.id.toLowerCase().includes(searchTerm) ||
            (gang && gang.name.toLowerCase().includes(searchTerm))
          );
        }
      )
    : [];

  // Search meetings
  const foundMeetings = searchTerm
    ? data.meetings.filter(
        (m) =>
          m.title.toLowerCase().includes(searchTerm) ||
          m.description.toLowerCase().includes(searchTerm) ||
          m.id.toLowerCase().includes(searchTerm)
      )
    : [];

  // Search deeps
  const foundDeeps = searchTerm
    ? data.deeps.filter(
        (d) => {
          const gang = d.gangId ? data.gangs.find((g) => g.id === d.gangId) : null;
          const people = d.personIds?.map(pid => data.people.find(p => p.id === pid)).filter(Boolean) || [];
          return (
            d.title.toLowerCase().includes(searchTerm) ||
            d.description.toLowerCase().includes(searchTerm) ||
            d.id.toLowerCase().includes(searchTerm) ||
            (gang && gang.name.toLowerCase().includes(searchTerm)) ||
            people.some(p => p?.fullName.toLowerCase().includes(searchTerm))
          );
        }
      )
    : [];

  // Search auctions
  const foundAuctions = searchTerm
    ? data.auctions.filter(
        (a) =>
          a.title.toLowerCase().includes(searchTerm) ||
          a.id.toLowerCase().includes(searchTerm) ||
          a.entries.some((e) => e.item.toLowerCase().includes(searchTerm))
      )
    : [];

  const totalResults =
    foundPeople.length +
    foundVehicles.length +
    foundGangs.length +
    foundCases.length +
    foundInvestigations.length +
    foundCharges.length +
    foundBases.length +
    foundMeetings.length +
    foundDeeps.length +
    foundAuctions.length;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-primary text-glow mb-2">PESQUISA GLOBAL</h1>
        <p className="text-muted-foreground font-mono text-sm">
          Busque em todas as entidades do sistema
        </p>
      </motion.div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Digite nome, ID, placa, telefone, etc..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-12 text-lg"
        />
      </div>

      {searchTerm && (
        <p className="text-sm text-muted-foreground">
          {totalResults} resultado(s) encontrado(s)
        </p>
      )}

      {/* People Results */}
      {foundPeople.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <Users className="h-5 w-5" />
            PESSOAS ({foundPeople.length})
          </h2>
          {foundPeople.map((person) => {
            const gang = data.gangs.find((g) => g.name === person.gang);
            const vehicles = data.vehicles.filter((v) => person.vehicleIds.includes(v.id));
            
            return (
              <motion.div
                key={person.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card
                  className="p-4 bg-card border-border hover:border-primary transition-all cursor-pointer"
                  onClick={() => navigate(`/people/${person.id}`)}
                >
                  <div className="flex items-start gap-4">
                    {person.attachments.length > 0 && (
                      <img
                        src={person.attachments[0].url}
                        alt={person.fullName}
                        className="w-16 h-16 rounded object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-accent font-mono text-sm">{person.id}</span>
                        <h3 className="text-lg font-bold text-foreground">{person.fullName}</h3>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm">
                          <span className="text-muted-foreground">Facção:</span>{" "}
                          <span style={{ color: gang?.color || "inherit" }}>{person.gang}</span>
                        </p>
                        <p className="text-sm">
                          <span className="text-muted-foreground">Telefone:</span> {person.phone}
                        </p>
                        <p className="text-sm">
                          <span className="text-muted-foreground">Hierarquia:</span> {person.hierarchy}
                        </p>
                        {vehicles.length > 0 && (
                          <div className="flex items-center gap-2 flex-wrap mt-2">
                            <span className="text-xs text-muted-foreground">Veículos:</span>
                            {vehicles.map((v) => (
                              <Badge key={v.id} variant="outline" className="text-xs">
                                {v.plate} - {v.model}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Vehicles Results */}
      {foundVehicles.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <Car className="h-5 w-5" />
            VEÍCULOS ({foundVehicles.length})
          </h2>
          {foundVehicles.map((vehicle) => {
            const owner = data.people.find((p) => p.id === vehicle.ownerId);
            
            return (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="p-4 bg-card border-border hover:border-primary transition-all">
                  <div className="flex items-start gap-4">
                    {vehicle.attachments.length > 0 && (
                      <img
                        src={vehicle.attachments[0].url}
                        alt={vehicle.model}
                        className="w-16 h-16 rounded object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-accent font-mono text-sm">{vehicle.id}</span>
                        <h3 className="text-lg font-bold text-foreground">{vehicle.plate}</h3>
                      </div>
                      <p className="text-sm">
                        <span className="text-muted-foreground">Modelo:</span> {vehicle.model}
                      </p>
                      {owner && (
                        <p className="text-sm">
                          <span className="text-muted-foreground">Proprietário:</span>{" "}
                          <span
                            className="text-accent cursor-pointer hover:underline"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/people/${owner.id}`);
                            }}
                          >
                            {owner.fullName}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Gangs Results */}
      {foundGangs.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <Users2 className="h-5 w-5" />
            FACÇÕES ({foundGangs.length})
          </h2>
          {foundGangs.map((gang) => {
            const members = data.people.filter((p) => p.gang === gang.name);
            
            return (
              <motion.div
                key={gang.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card
                  className="p-4 bg-card border-border hover:border-primary transition-all cursor-pointer"
                  onClick={() => navigate(`/gangs/${gang.id}`)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-accent font-mono text-sm">{gang.id}</span>
                    <h3 className="text-lg font-bold" style={{ color: gang.color || "inherit" }}>
                      {gang.name}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{gang.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {members.length} membro(s)
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Cases Results */}
      {foundCases.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            CASOS ({foundCases.length})
          </h2>
          {foundCases.map((caseItem) => (
            <motion.div
              key={caseItem.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card
                className="p-4 bg-card border-border hover:border-primary transition-all cursor-pointer"
                onClick={() => navigate(`/cases/${caseItem.id}`)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-accent font-mono text-sm">{caseItem.id}</span>
                  <h3 className="text-lg font-bold text-foreground">{caseItem.title}</h3>
                  <Badge variant={caseItem.status === "open" ? "default" : "secondary"}>
                    {caseItem.status === "open" ? "ABERTO" : "FECHADO"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{caseItem.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Investigations Results */}
      {foundInvestigations.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <Search className="h-5 w-5" />
            INVESTIGAÇÕES ({foundInvestigations.length})
          </h2>
          {foundInvestigations.map((investigation) => (
            <motion.div
              key={investigation.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card
                className="p-4 bg-card border-border hover:border-primary transition-all cursor-pointer"
                onClick={() => navigate(`/investigations/${investigation.id}`)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-accent font-mono text-sm">{investigation.id}</span>
                  <h3 className="text-lg font-bold text-foreground">{investigation.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  {investigation.sections.length} seção(ões)
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Charges Results */}
      {foundCharges.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <Scale className="h-5 w-5" />
            COBRANÇAS ({foundCharges.length})
          </h2>
          {foundCharges.map((charge) => (
            <motion.div
              key={charge.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="p-4 bg-card border-border hover:border-primary transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-accent font-mono text-sm">{charge.id}</span>
                  <h3 className="text-lg font-bold text-foreground">{charge.reason}</h3>
                  <Badge variant={charge.status === "pendente" ? "destructive" : "default"}>
                    {charge.status.toUpperCase()}
                  </Badge>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Bases Results */}
      {foundBases.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <Building className="h-5 w-5" />
            BASES ({foundBases.length})
          </h2>
          {foundBases.map((base) => {
            const gang = base.gangId ? data.gangs.find((g) => g.id === base.gangId) : null;
            
            return (
              <motion.div
                key={base.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card
                  className="p-4 bg-card border-border hover:border-primary transition-all cursor-pointer"
                  onClick={() => navigate(`/bases/${base.id}`)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-accent font-mono text-sm">{base.id}</span>
                    <h3 className="text-lg font-bold text-foreground">{base.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{base.description}</p>
                  {gang && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Facção: <span style={{ color: gang.color || "inherit" }}>{gang.name}</span>
                    </p>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Meetings Results */}
      {foundMeetings.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <Users className="h-5 w-5" />
            REUNIÕES ({foundMeetings.length})
          </h2>
          {foundMeetings.map((meeting) => (
            <motion.div
              key={meeting.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card
                className="p-4 bg-card border-border hover:border-primary transition-all cursor-pointer"
                onClick={() => navigate(`/meetings/${meeting.id}`)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-accent font-mono text-sm">{meeting.id}</span>
                  <h3 className="text-lg font-bold text-foreground">{meeting.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{meeting.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Deeps Results */}
      {foundDeeps.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <Building className="h-5 w-5" />
            DEEPS ({foundDeeps.length})
          </h2>
          {foundDeeps.map((deep) => {
            const gang = deep.gangId ? data.gangs.find((g) => g.id === deep.gangId) : null;
            const people = deep.personIds?.map(pid => data.people.find(p => p.id === pid)).filter(Boolean) || [];
            
            return (
              <motion.div
                key={deep.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card
                  className="p-4 bg-card border-border hover:border-primary transition-all cursor-pointer"
                  onClick={() => navigate(`/deeps/${deep.id}`)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-accent font-mono text-sm">{deep.id}</span>
                    <h3 className="text-lg font-bold text-foreground">{deep.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{deep.description}</p>
                  {gang && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Facção: <span style={{ color: gang.color || "inherit" }}>{gang.name}</span>
                    </p>
                  )}
                  {people.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap mt-2">
                      <span className="text-xs text-muted-foreground">Pessoas:</span>
                      {people.map((p) => p && (
                        <Badge key={p.id} variant="outline" className="text-xs">
                          {p.fullName}
                        </Badge>
                      ))}
                    </div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Auctions Results */}
      {foundAuctions.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <Scale className="h-5 w-5" />
            LEILÕES ({foundAuctions.length})
          </h2>
          {foundAuctions.map((auction) => (
            <motion.div
              key={auction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card
                className="p-4 bg-card border-border hover:border-primary transition-all cursor-pointer"
                onClick={() => navigate(`/auctions/${auction.id}`)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-accent font-mono text-sm">{auction.id}</span>
                  <h3 className="text-lg font-bold text-foreground">{auction.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  {auction.entries.length} entrada(s)
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {searchTerm && totalResults === 0 && (
        <Card className="p-12 text-center bg-card border-border">
          <p className="text-muted-foreground">Nenhum resultado encontrado</p>
        </Card>
      )}

      {!searchTerm && (
        <Card className="p-12 text-center bg-card border-border">
          <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            Digite algo na barra de pesquisa para começar
          </p>
        </Card>
      )}
    </div>
  );
}
