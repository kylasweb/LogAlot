
"use client";

import { useState } from "react";
import { Save, WandSparkles, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import type { Agent } from "@/lib/types";

interface AgentHyperparameters {
    agentId: string;
    temperature: number;
    topP: number;
    topK: number;
}

const initialAgents: Agent[] = [
  { id: "summarizer", name: "Summarizer Agent", description: "", instructions: "...", model: "gemini-2.5-flash" },
  { id: "traceback", name: "Traceback Agent", description: "", instructions: "...", model: "gemini-2.5-flash" },
  { id: "solution", name: "Solution Agent", description: "", instructions: "...", model: "gemini-2.5-flash" },
  { id: 'sre-ticketing', name: 'SRE Ticketing Agent', description: '', instructions: '', model: 'gemini-2.5-flash' },
  { id: 'security-analyst', name: 'Security Analyst Agent', description: '', instructions: '', model: 'gemini-2.5-flash' },
  { id: 'qa-engineer', name: 'QA Engineer Agent', description: '', instructions: '', model: 'gemini-2.5-flash' },
  { id: 'customer-comms', name: 'Customer Comms Agent', description: '', instructions: '', model: 'gemini-2.5-flash' },
  { id: 'postmortem-writer', name: 'Postmortem Writer Agent', description: '', instructions: '', model: 'gemini-2.5-flash' }
];

const initialParams: AgentHyperparameters[] = initialAgents.map(agent => ({
    agentId: agent.id,
    temperature: 0.5,
    topP: 0.9,
    topK: 40,
}));


export default function HyperParametersPage() {
    const [params, setParams] = useState(initialParams);
    const [selectedAgentId, setSelectedAgentId] = useState<string>(initialAgents[0].id);
    const { toast } = useToast();

    const selectedAgentParams = params.find(p => p.agentId === selectedAgentId)!;

    const handleParamChange = (paramName: keyof Omit<AgentHyperparameters, 'agentId'>, value: number) => {
        setParams(prevParams => prevParams.map(p => 
            p.agentId === selectedAgentId ? { ...p, [paramName]: value } : p
        ));
    };

    const handleSave = () => {
        // In a real app, you'd save this to a database or other persistent storage.
        console.log("Saving parameters:", params);
        toast({ title: "Parameters Saved", description: "Your hyper-parameter configurations have been updated." });
    };

  return (
    <div className="flex flex-col h-full">
      <header className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 sticky top-0 z-10 bg-background border-b">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-xl font-headline font-semibold">
            Hyper-parameter Tuning
          </h1>
        </div>
        <Button onClick={handleSave} className="neo-button">
          <Save className="mr-2" /> Save All Configurations
        </Button>
      </header>
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        <div className="mx-auto max-w-4xl">
            <Card>
            <CardHeader>
                <CardTitle className="font-headline">Configure Model Parameters</CardTitle>
                <CardDescription>
                Fine-tune the behavior of your AI agents by adjusting their core parameters. Changes here affect the creativity, randomness, and focus of the AI's responses.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="space-y-2">
                    <Label htmlFor="agent-select">Select Agent to Configure</Label>
                     <Select onValueChange={setSelectedAgentId} value={selectedAgentId}>
                        <SelectTrigger id="agent-select" className="neo-button">
                            <SelectValue placeholder="Select an agent..." />
                        </SelectTrigger>
                        <SelectContent className="neo-outset">
                            {initialAgents.map(agent => (
                                <SelectItem key={agent.id} value={agent.id}>
                                    <div className="flex items-center gap-2">
                                        <BrainCircuit className="w-4 h-4" />
                                        {agent.name}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-6 pt-4">
                    {/* Temperature */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <Label htmlFor="temperature" className="font-semibold">Temperature</Label>
                            <span className="text-sm font-mono neo-inset px-2 py-1 rounded-md bg-muted/50">{selectedAgentParams.temperature.toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-4">Controls randomness. Lower values (e.g., 0.2) make the output more deterministic and focused. Higher values (e.g., 0.9) make it more creative and diverse.</p>
                        <Slider
                            id="temperature"
                            min={0}
                            max={1}
                            step={0.01}
                            value={[selectedAgentParams.temperature]}
                            onValueChange={([val]) => handleParamChange('temperature', val)}
                        />
                    </div>

                    {/* Top-P */}
                     <div>
                        <div className="flex justify-between items-center mb-2">
                            <Label htmlFor="top-p" className="font-semibold">Top-P (Nucleus Sampling)</Label>
                            <span className="text-sm font-mono neo-inset px-2 py-1 rounded-md bg-muted/50">{selectedAgentParams.topP.toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-4">Controls diversity via nucleus sampling. It selects from the smallest set of tokens whose cumulative probability exceeds the value `p`. A value of 0.9 means the model considers tokens making up the top 90% probability mass.</p>
                        <Slider
                            id="top-p"
                            min={0}
                            max={1}
                            step={0.01}
                            value={[selectedAgentParams.topP]}
                            onValueChange={([val]) => handleParamChange('topP', val)}
                        />
                    </div>
                    
                    {/* Top-K */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <Label htmlFor="top-k" className="font-semibold">Top-K</Label>
                            <span className="text-sm font-mono neo-inset px-2 py-1 rounded-md bg-muted/50">{selectedAgentParams.topK}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-4">Controls diversity by limiting the sample pool to the K most likely next tokens. A higher K allows for more diverse outputs, while a lower K makes the model more conservative.</p>
                        <Slider
                            id="top-k"
                            min={1}
                            max={100}
                            step={1}
                            value={[selectedAgentParams.topK]}
                            onValueChange={([val]) => handleParamChange('topK', val)}
                        />
                    </div>
                </div>

            </CardContent>
            <CardFooter>
                <p className="text-xs text-muted-foreground italic">
                    Note: These settings are highly experimental. Adjust with care, as they can significantly alter agent performance and reliability. Saved configurations apply to all future analyses using these agents.
                </p>
            </CardFooter>
            </Card>
        </div>
      </main>
    </div>
  );
}
