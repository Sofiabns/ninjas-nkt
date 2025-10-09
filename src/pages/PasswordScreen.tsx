import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CORRECT_PASSWORD = "senhasecretanaovazapfninjasmelhores"; // You can change this password

export default function PasswordScreen() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [typingText, setTypingText] = useState("");
  const fullText = "> Digite a senha de acesso";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      // Store access granted in session storage
      sessionStorage.setItem("accessGranted", "true");
      // Force page reload to update the app state
      window.location.href = "/";
    } else {
      alert("Senha incorreta. Tente novamente.");
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* System status top-left - static */}
      <div className="absolute top-4 left-4 text-primary text-sm font-mono">
        <span>ACCESS_CONTROL...</span>
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
            Security System
          </p>
        </div>

        {/* Typing effect text */}
        <div className="h-8">
          <p className="text-primary font-mono text-lg">
            {typingText}
            <span className="cursor-blink">_</span>
          </p>
        </div>

        {/* Password form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="max-w-md mx-auto mt-8 space-y-6"
        >
          <div>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-input border-border text-foreground text-center text-xl font-mono tracking-wider"
              autoFocus
            />
          </div>

          <Button
            type="submit"
            disabled={!password.trim()}
            className="w-full px-12 py-6 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 box-glow disabled:opacity-50"
          >
            [ ACESSAR SISTEMA ]
          </Button>
        </motion.form>
      </motion.div>

      {/* Footer status */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-primary text-xs font-mono space-x-4">
        <span>STATUS: SECURE</span>
        <span>|</span>
        <span>CLEARANCE: REQUIRED</span>
        <span>|</span>
        <span>ACCESS: DENIED</span>
      </div>
    </div>
  );
}
