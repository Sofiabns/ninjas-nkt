import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp } from "@/contexts/AppContext";

export default function Login() {
  const navigate = useNavigate();
  const { data, setCurrentInvestigator } = useApp();
  const [selectedId, setSelectedId] = useState<string>("");
  const [typingText, setTypingText] = useState("");
  const fullText = "> Selecione um investigador para iniciar";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setTypingText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = () => {
    const investigator = data.investigators.find((inv) => inv.id === selectedId);
    if (investigator) {
      setCurrentInvestigator(investigator);
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* System status top-left - static */}
      <div className="absolute top-4 left-4 text-primary text-sm font-mono">
        <span>SYSTEM_ONLINE...</span>
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full space-y-8 text-center"
      >
        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-6xl md:text-7xl font-bold text-primary text-glow tracking-wider">
            NINJAS NKT
          </h1>
          <p className="text-xl md:text-2xl text-accent text-glow-cyan">
            Investigation System v1.0
          </p>
        </div>

        {/* Typing effect text */}
        <div className="h-8">
          <p className="text-primary font-mono text-lg">
            {typingText}
            <span className="cursor-blink">_</span>
          </p>
        </div>

        {/* Dropdown selector */}
        <div className="max-w-md mx-auto mt-8">
          <Select value={selectedId} onValueChange={setSelectedId}>
            <SelectTrigger className="w-full bg-input border-border text-foreground">
              <SelectValue placeholder="Selecione um investigador" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border z-50 max-h-[300px]">
              {data.investigators.map((inv) => (
                <SelectItem key={inv.id} value={inv.id} className="hover:bg-secondary">
                  {inv.name} ({inv.id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Enter button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Button
            onClick={handleLogin}
            disabled={!selectedId}
            className="px-12 py-6 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 box-glow disabled:opacity-50"
          >
            [ ENTRAR ]
          </Button>
        </motion.div>
      </motion.div>

      {/* Footer status */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-primary text-xs font-mono space-x-4">
        <span>STATUS: OPERATIONAL</span>
        <span>|</span>
        <span>CLEARANCE: LEVEL_5</span>
        <span>|</span>
        <span>ACCESS: AUTHORIZED</span>
      </div>
    </div>
  );
}
