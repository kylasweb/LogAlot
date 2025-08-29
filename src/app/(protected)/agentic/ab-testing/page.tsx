
"use client";

import { useState } from "react";
import { Plus, MoreHorizontal, FlaskConical, Scale, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import type { Agent } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface ABTestExperiment {
  id: string;
  name: string;
  agentName: string;
  status: 'draft' | 'running' | 'completed' | 'archived';
  variantA: { model: string; instructions: string };
  variantB: { model: string; instructions: string };
  createdAt: Date;
  winner?: 'A' | 'B' | 'Inconclusive';
}

const initialAgents: Agent[] = [
  { id: "summarizer", name: "Summarizer Agent", description: "", instructions: "You are an expert software engineer specializing in summarizing complex error logs...", model: "gemini-2.5-flash" },
  { id: "traceback", name: "Traceback Agent", description: "", instructions: "You are a debugging specialist. Analyze the provided stack traceback...", model: "gemini-2.5-flash" },
  { id: "solution", name: "Solution Agent", description: "", instructions: "You are a senior software architect. Based on the error summary and traceback analysis, propose a concrete solution...", model: "gemini-2.5-flash" },
];

const initialExperiments: ABTestExperiment[] = [
  { id: "exp_1", name: "Summarizer Model Test (Gemini vs Llama3)", agentName: "Summarizer Agent", status: "completed", variantA: { model: "gemini-2.5-flash", instructions: "Summarize the log." }, variantB: { model: "llama3-70b-8192", instructions: "Summarize the log." }, createdAt: new Date("2023-11-01T10:00:00Z"), winner: "B" },
  { id: "exp_2", name: "Solution Agent Prompt Refinement", agentName: "Solution Agent", status: "running", variantA: { model: "gemini-2.5-flash", instructions: "Propose a concrete solution..." }, variantB: { model: "gemini-2.5-flash", instructions: "As an elite developer, provide a robust and production-ready code fix..." }, createdAt: new Date("2023-11-05T14:30:00Z") },
  { id: "exp_3", name: "Traceback Prompt Draft", agentName: "Traceback Agent", status: "draft", variantA: { model: "gemini-2.5-flash", instructions: "You are a debugging specialist..." }, variantB: { model: "gemini-2.5-flash", instructions: "Analyze the traceback..." }, createdAt: new Date() },
];


function CreateExperimentForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [selectedAgentId, setSelectedAgentId] = useState<string>('');
  const [experimentName, setExperimentName] = useState<string>('');
  const [variantAInstructions, setVariantAInstructions] = useState<string>('');
  const [variantBInstructions, setVariantBInstructions] = useState<string>('');
  const { toast } = useToast();

  const handleAgentChange = (agentId: string) => {
      setSelectedAgentId(agentId);
      const agent = initialAgents.find(a => a.id === agentId);
      if (agent) {
          setVariantAInstructions(agent.instructions);
          setVariantBInstructions(agent.instructions);
      }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgentId || !experimentName) {
      toast({ variant: 'destructive', title: "Missing Fields", description: "Please select an agent and name your experiment." });
      return;
    }
    const agent = initialAgents.find(a => a.id === selectedAgentId)!;
    onSubmit({ 
        name: experimentName,
        agentName: agent.name,
        variantA: { model: agent.model, instructions: variantAInstructions },
        variantB: { model: agent.model, instructions: variantBInstructions },
    });
  };
  
  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
            <Label htmlFor="experiment-name">Experiment Name</Label>
            <Input id="experiment-name" value={experimentName} onChange={(e) => setExperimentName(e.target.value)} placeholder="e.g., Test new prompt for Summarizer" required className="neo-inset" />
        </div>
        <div className="space-y-2">
            <Label htmlFor="agent-select">Select Agent to Test</Label>
            <Select onValueChange={handleAgentChange} value={selectedAgentId}>
                <SelectTrigger id="agent-select" className="neo-button">
                    <SelectValue placeholder="Select an agent..." />
                </SelectTrigger>
                <SelectContent className="neo-outset">
                    {initialAgents.map(agent => (
                        <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
         <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="variant-a-instructions">Variant A Instructions</Label>
                <Textarea id="variant-a-instructions" value={variantAInstructions} onChange={(e) => setVariantAInstructions(e.target.value)} className="min-h-[150px] neo-inset" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="variant-b-instructions">Variant B Instructions</Label>
                <Textarea id="variant-b-instructions" value={variantBInstructions} onChange={(e) => setVariantBInstructions(e.target.value)} className="min-h-[150px] neo-inset" />
            </div>
        </div>

        <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" className="neo-button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="neo-button">Create Experiment</Button>
        </DialogFooter>
    </form>
  )
}


export default function ABTestingPage() {
    const [experiments, setExperiments] = useState(initialExperiments);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const { toast } = useToast();

    const handleCreateExperiment = (data: Omit<ABTestExperiment, 'id' | 'status' | 'createdAt'>) => {
        const newExperiment: ABTestExperiment = {
            id: `exp_${Date.now()}`,
            ...data,
            status: 'draft',
            createdAt: new Date(),
        };

        setExperiments(prev => [newExperiment, ...prev]);
        toast({ title: "Experiment Created", description: `"${data.name}" has been created as a draft.` });
        setIsFormOpen(false);
    };

    const handleDelete = (id: string) => {
      setExperiments(experiments.filter(e => e.id !== id));
      toast({ variant: 'destructive', title: "Experiment Deleted" });
    }

  return (
    <div className="flex flex-col h-full">
      <header className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 sticky top-0 z-10 bg-background border-b">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-xl font-headline font-semibold">
            A/B Testing
          </h1>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
                <Button className="neo-button">
                    <Plus className="mr-2" /> Create New Experiment
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] neo-outset">
                <DialogHeader>
                    <DialogTitle className="font-headline">New A/B Test Experiment</DialogTitle>
                    <DialogDescription>
                        Compare two versions of an agent's model or instructions to see which performs better.
                    </DialogDescription>
                </DialogHeader>
                <CreateExperimentForm onSubmit={handleCreateExperiment} />
            </DialogContent>
        </Dialog>
      </header>
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>A/B Test Experiments</CardTitle>
            <CardDescription>
              Manage and monitor your agent A/B tests.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Experiment Name</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Winner</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {experiments.map((exp) => (
                  <TableRow key={exp.id}>
                    <TableCell className="font-medium">{exp.name}</TableCell>
                    <TableCell>{exp.agentName}</TableCell>
                    <TableCell>
                      <Badge variant={
                          exp.status === "completed" ? "default" :
                          exp.status === "draft" ? "secondary" :
                          "secondary"
                        }>
                          {exp.status}
                        </Badge>
                    </TableCell>
                    <TableCell>
                        {exp.winner ? (
                            <Badge variant={exp.winner === "Inconclusive" ? "secondary" : "default"}>
                                {exp.winner === "Inconclusive" ? "Inconclusive" : `Variant ${exp.winner}`}
                            </Badge>
                        ) : 'N/A'}
                    </TableCell>
                    <TableCell>{exp.createdAt.toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem disabled={exp.status === 'running'}>Start</DropdownMenuItem>
                           <DropdownMenuItem disabled={exp.status !== 'running'}>Pause</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(exp.id)} className="text-destructive">
                             <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
