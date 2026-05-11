"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/Button";
import { PaywallModal } from "./PaywallModal";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatOracle() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Bienvenid@ al Oráculo Cósmico. Soy Mystika, guardiana de los secretos de las estrellas. ¿Qué consulta trae tu alma hoy? ✨" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);
    setStreamingText("");

    const apiMessages = [
      ...messages.filter((m, i) => i > 0), // Skip initial greeting
      { role: "user", content: userMessage },
    ];

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, sessionId }),
      });

      if (res.status === 402) {
        setShowPaywall(true);
        setMessages((prev) => prev.slice(0, -1));
        setLoading(false);
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      if (!reader) { setLoading(false); return; }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value);
        const lines = text.split("\n").filter((l) => l.startsWith("data: "));
        for (const line of lines) {
          const data = JSON.parse(line.replace("data: ", ""));
          if (data.text) {
            fullText += data.text;
            setStreamingText(fullText);
          }
          if (data.sessionId) setSessionId(data.sessionId);
          if (data.done) {
            setMessages((prev) => [...prev, { role: "assistant", content: fullText }]);
            setStreamingText("");
          }
        }
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Las estrellas están en silencio momentáneamente. Inténtalo de nuevo." }]);
    }
    setLoading(false);
  }

  return (
    <>
      <div className="flex flex-col h-[600px] bg-parchment-100 border border-parchment-400 rounded-sm overflow-hidden">
        {/* Header */}
        <div className="border-b border-parchment-400 px-6 py-4 bg-parchment-200 flex items-center gap-3">
          <motion.div
            className="text-2xl"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            ◈
          </motion.div>
          <div>
            <h3 className="font-cinzel text-sm text-terracota-500 tracking-widest">MYSTIKA</h3>
            <p className="text-xs font-garamond text-tinta-100">Oráculo del Cosmos · 3 consultas gratuitas</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-full bg-terracota-400/20 border border-terracota-400/40 flex items-center justify-center text-sm mr-2 flex-shrink-0 mt-1">
                  ✦
                </div>
              )}
              <div
                className={`max-w-[75%] px-4 py-3 rounded-sm text-sm font-garamond leading-relaxed ${
                  msg.role === "user"
                    ? "bg-terracota-500 text-parchment-100"
                    : "bg-parchment-200 text-tinta-300 border border-parchment-400"
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}

          {/* Streaming response */}
          {streamingText && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="w-7 h-7 rounded-full bg-terracota-400/20 border border-terracota-400/40 flex items-center justify-center text-sm mr-2 flex-shrink-0 mt-1">
                ✦
              </div>
              <div className="max-w-[75%] px-4 py-3 rounded-sm text-sm font-garamond leading-relaxed bg-parchment-200 text-tinta-300 border border-parchment-400">
                {streamingText}
                <span className="inline-block w-1 h-4 bg-terracota-400 ml-0.5 animate-pulse align-text-bottom" />
              </div>
            </motion.div>
          )}

          {loading && !streamingText && (
            <div className="flex justify-start">
              <div className="bg-parchment-200 border border-parchment-400 px-5 py-3 rounded-sm">
                <div className="flex gap-1.5">
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 bg-terracota-400 rounded-full"
                      animate={{ y: [-3, 3, -3] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-parchment-400 p-4 flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Consulta al oráculo..."
            className="flex-1 bg-transparent border border-parchment-400 rounded-sm px-4 py-2 text-sm font-garamond text-tinta-300 placeholder:text-tinta-100 focus:outline-none focus:border-terracota-400"
            disabled={loading}
          />
          <Button onClick={sendMessage} loading={loading} size="sm" disabled={!input.trim()}>
            Consultar
          </Button>
        </div>
      </div>

      {showPaywall && (
        <PaywallModal productType="sesion_oraculo" onClose={() => setShowPaywall(false)} />
      )}
    </>
  );
}
