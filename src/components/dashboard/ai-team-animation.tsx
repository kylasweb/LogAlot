
"use client";

import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Briefcase, Code, TestTube } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const agents = [
  {
    name: "DevOps Manager",
    icon: <Briefcase className="w-6 h-6" />,
    style: "bg-blue-200 text-blue-800",
  },
  {
    name: "Senior Developer",
    icon: <Code className="w-6 h-6" />,
    style: "bg-green-200 text-green-800",
  },
  {
    name: "QA Engineer",
    icon: <TestTube className="w-6 h-6" />,
    style: "bg-yellow-200 text-yellow-800",
  },
];

const conversation = [
  { agent: 0, text: "Alright team, we've got a new log entry. Looks like a 500 error in production." },
  { agent: 1, text: "I'm on it. Checking the traceback... Hmm, looks like a NullPointerException." },
  { agent: 2, text: "Is this related to the new deployment? I'll check if our test cases cover this scenario." },
  { agent: 0, text: "Good. Let's get a root cause and a solution proposal, stat." },
  { agent: 1, text: "Found the culprit. It's a missing check in the user service. Preparing a fix." },
];

export function AiTeamAnimation() {
  const [currentLine, setCurrentLine] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLine((prev) => (prev + 1) % conversation.length);
    }, 2500); // Change message every 2.5 seconds

    return () => clearInterval(interval);
  }, []);

  const activeAgentIndex = conversation[currentLine].agent;

  return (
    <div className="w-full max-w-lg p-4 space-y-8">
      <div className="flex justify-around">
        {agents.map((agent, index) => (
          <div key={agent.name} className="flex flex-col items-center gap-2">
            <Avatar
              className={`transition-all duration-300 ${
                activeAgentIndex === index
                  ? "ring-4 ring-primary scale-110"
                  : "opacity-60"
              }`}
            >
              <AvatarFallback className={agent.style}>
                {agent.icon}
              </AvatarFallback>
            </Avatar>
            <span
              className={`text-xs font-medium transition-all duration-300 ${
                activeAgentIndex === index
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {agent.name}
            </span>
          </div>
        ))}
      </div>
      <div className="relative h-20">
        <AnimatePresence>
          <motion.div
            key={currentLine}
            className="absolute w-full"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-secondary p-4 rounded-lg text-center relative neo-inset">
              <p className="text-sm text-foreground">
                "{conversation[currentLine].text}"
              </p>
              <div 
                className={`absolute -top-2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-secondary transition-all duration-300 ${
                  activeAgentIndex === 0 ? 'left-1/4 -translate-x-1/2' :
                  activeAgentIndex === 1 ? 'left-1/2 -translate-x-1/2' :
                  'left-3/4 -translate-x-1/2'
                }`}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
