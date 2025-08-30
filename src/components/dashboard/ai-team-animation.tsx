
"use client";

import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Briefcase, Code, TestTube } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const defaultAgents = [
  {
    role: "lead",
    name: "Anu",
    title: "Project Lead",
    icon: <Briefcase className="w-6 h-6" />,
    style: "bg-blue-200 text-blue-800",
  },
  {
    role: "dev",
    name: "Akhil",
    title: "Senior Developer",
    icon: <Code className="w-6 h-6" />,
    style: "bg-green-200 text-green-800",
  },
  {
    role: "qa",
    name: "Shincy",
    title: "QA Engineer",
    icon: <TestTube className="w-6 h-6" />,
    style: "bg-yellow-200 text-yellow-800",
  },
];

const all_conversations = [
  { agent: 0, text: "Alright team, we've got a new log entry. Looks like a 500 error in production." },
  { agent: 1, text: "I'm on it. Checking the traceback... Hmm, looks like a NullPointerException." },
  { agent: 2, text: "Is this related to the new deployment? I'll check if our test cases cover this scenario." },
  { agent: 0, text: "Good. Let's get a root cause and a solution proposal, stat." },
  { agent: 1, text: "Found the culprit. It's a missing check in the user service. Preparing a fix." },
  { agent: 2, text: "Okay, I'll prepare a regression test for that specific case once the fix is ready."},
  { agent: 0, text: "Another alert just came in. Seems like high latency on the checkout service."},
  { agent: 1, text: "Correlating with recent commits. I see a new database query was added. Could be unoptimized."},
  { agent: 2, text: "Running performance tests on the staging environment against that endpoint. I'll report back with metrics."},
  { agent: 0, text: "Let's prioritize. What's the customer impact?"},
  { agent: 1, text: "The query is complex. It could be timing out for users with large carts. I'll work on an optimized version."},
  { agent: 2, text: "Confirmed. P99 latency is through the roof. This is critical."},
  { agent: 0, text: "New ticket: a JavaScript error on the front-end. `TypeError: Cannot read properties of undefined`."},
  { agent: 1, text: "That's a classic. An API is probably returning an unexpected null. Checking the contract..."},
  { agent: 2, text: "I can try to reproduce this by manipulating API responses in the browser. Starting now."},
  { agent: 0, text: "This seems intermittent. Are we seeing a pattern?"},
  { agent: 1, text: "It seems to happen when a user's profile is incomplete. The backend should handle that gracefully."},
  { agent: 2, text: "Reproduced it. If the user's address is null, the component fails. I'll add this to our test suite."},
];

// Fisher-Yates shuffle algorithm
const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};


export function AiTeamAnimation() {
  const [currentLine, setCurrentLine] = useState(0);
  const [conversation, setConversation] = useState(all_conversations);
  const [agents, setAgents] = useState(defaultAgents);

  useEffect(() => {
    const leadName = localStorage.getItem('team_name_lead') || 'Anu';
    const devName = localStorage.getItem('team_name_dev') || 'Akhil';
    const qaName = localStorage.getItem('team_name_qa') || 'Shincy';
    
    setAgents(prev => prev.map(agent => {
        if (agent.role === 'lead') return {...agent, name: leadName};
        if (agent.role === 'dev') return {...agent, name: devName};
        if (agent.role === 'qa') return {...agent, name: qaName};
        return agent;
    }));

    const shuffledConversation = shuffleArray([...all_conversations]);
    setConversation(shuffledConversation);
    setCurrentLine(0);

    const interval = setInterval(() => {
      setCurrentLine((prev) => (prev + 1) % shuffledConversation.length);
    }, 2500);

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
            <div className="text-center">
               <p
                className={`text-sm font-medium transition-all duration-300 ${
                  activeAgentIndex === index
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {agent.name}
              </p>
               <p className="text-xs text-muted-foreground">{agent.title}</p>
            </div>
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
