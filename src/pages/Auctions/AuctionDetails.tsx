import React from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useApp } from "@/contexts/AppContext";
import { ArrowLeft } from "lucide-react";

export default function AuctionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data } = useApp();

  const auction = data.auctions.find((a) => a.id === id);

  if (!auction) {
    return (
      <div className="space-y-6">
        <Card className="p-12 text-center bg-card border-border">
          <p className="text-muted-foreground">Leilão não encontrado</p>
          <Button onClick={() => navigate("/auctions")} className="mt-4">
            Voltar
          </Button>
        </Card>
      </div>
    );
  }

  const totalByGang = auction.entries.reduce((acc, entry) => {
    acc[entry.gangId] = (acc[entry.gangId] || 0) + entry.amount;
    return acc;
  }, {} as Record<string, number>);

  const totalGearsByGang = auction.entries.reduce((acc, entry) => {
    if (entry.gears) {
      acc[entry.gangId] = (acc[entry.gangId] || 0) + entry.gears;
    }
    return acc;
  }, {} as Record<string, number>);

  const grandTotal = auction.entries.reduce((sum, entry) => sum + entry.amount, 0);
  const grandTotalGears = auction.entries.reduce((sum, entry) => sum + (entry.gears || 0), 0);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Button
          variant="ghost"
          onClick={() => navigate("/auctions")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-accent font-mono text-sm">{auction.id}</span>
              <h1 className="text-4xl font-bold text-primary text-glow">
                {auction.title}
              </h1>
            </div>
            {auction.description && (
              <p className="text-muted-foreground mb-2 whitespace-pre-wrap">{auction.description}</p>
            )}
            <p className="text-muted-foreground font-mono text-sm">
              Criado em {new Date(auction.createdAt).toLocaleString()}
            </p>
          </div>

          <Button
            onClick={() => navigate(`/auctions/edit/${auction.id}`)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 box-glow"
          >
            Editar
          </Button>
        </div>
      </motion.div>

      <Card className="p-6 bg-card border-border">
        <h2 className="text-xl font-bold text-primary mb-4">ENTRADAS ({auction.entries.length})</h2>
        <div className="space-y-2">
          {auction.entries.map((entry, index) => {
            const gang = data.gangs.find((g) => g.id === entry.gangId);
            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-secondary rounded border border-border"
              >
                <div>
                  <p className="text-sm font-mono text-foreground">
                    {gang?.name || entry.gangId}
                  </p>
                  <p className="text-xs text-muted-foreground">{entry.item}</p>
                </div>
                <div className="flex gap-3 items-center">
                  <p className="text-lg font-bold text-primary">
                    ${entry.amount.toLocaleString()}
                  </p>
                  {entry.gears && (
                    <p className="text-lg font-bold text-accent">
                      ⚙️ {entry.gears}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="p-6 bg-primary/10 border-primary">
        <h2 className="text-xl font-bold text-primary mb-4">RESUMO FINANCEIRO</h2>
        <div className="space-y-3">
          {Object.entries(totalByGang).map(([gangId, total]) => {
            const gang = data.gangs.find((g) => g.id === gangId);
            const gears = totalGearsByGang[gangId];
            return (
              <div
                key={gangId}
                className="flex justify-between items-center p-3 bg-card rounded border border-border"
              >
                <span className="text-base font-mono text-foreground">{gang?.name}</span>
                <div className="flex gap-3 items-center">
                  <span className="text-xl font-bold text-primary">
                    ${total.toLocaleString()}
                  </span>
                  {gears && (
                    <span className="text-xl font-bold text-accent">
                      ⚙️ {gears}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
          <div className="pt-3 border-t border-border flex justify-between items-center">
            <span className="text-lg font-bold text-foreground">TOTAL GERAL</span>
            <div className="flex gap-3 items-center">
              <span className="text-2xl font-bold text-primary">
                ${grandTotal.toLocaleString()}
              </span>
              {grandTotalGears > 0 && (
                <span className="text-2xl font-bold text-accent">
                  ⚙️ {grandTotalGears}
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
