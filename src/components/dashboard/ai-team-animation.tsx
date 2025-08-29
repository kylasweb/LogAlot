
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
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
};


export function AiTeamAnimation() {
  const [currentLine, setCurrentLine] = useState(0);
  const [conversation, setConversation] = useState(shuffleArray([...all_conversations]));


  useEffect(() => {
    // Reset and reshuffle when the component is actively shown
    setConversation(shuffleArray([...all_conversations]));
    setCurrentLine(0);

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
