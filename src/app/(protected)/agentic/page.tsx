
"use client";

import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Bot,
  Plus,
  MoreVertical,
  BrainCircuit,
  Settings,
  Trash2,
  Copy,
  FlaskConical,
  WandSparkles,
  Save,
  Network
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { WorkflowBuilder } from "@/components/agentic/workflow-builder";


const initialAgents = [
  {
    id: "summarizer",
    name: "Summarizer Agent",
    description: "Reads raw logs and creates a high-level summary of the issue.",
    instructions: "You are an expert software engineer specializing in summarizing complex error logs. Your task is to provide a concise, easy-to-understand summary of the provided log data. Focus on the core error and its immediate context.",
    model: "gemini-2.5-flash",
  },
  {
    id: "traceback",
    name: "Traceback Agent",
    description: "Parses stack traces to identify the exception type and key frames.",
    instructions: "You are a debugging specialist. Analyze the provided stack traceback. Identify the primary exception type, the most relevant frames in the call stack, and explain the flow of execution that led to the error. Be precise and technical.",
    model: "gemini-2.5-flash",
  },
  {
    id: "solution",
    name: "Solution Agent",
    description: "Generates a potential fix, including code snippets and verification steps.",
    instructions: "You are a senior software architect. Based on the error summary and traceback analysis, propose a concrete solution. Your solution must include a code snippet demonstrating the fix, a clear explanation of the change, and steps to verify the solution is effective.",
    model: "gemini-2.5-flash",
  },
];


const AgentCard = ({ agent, onEdit, onDelete, onClone }: { agent: any, onEdit: (agent: any) => void, onDelete: (id: string) => void, onClone: (agent: any) => void }) => (
  <Card className="neo-outset flex flex-col">
    <CardHeader>
      <div className="flex justify-between items-start">
        <div>
          <CardTitle className="font-headline flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            {agent.name}
          </CardTitle>
          <CardDescription>{agent.description}</CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="neo-outset">
            <DropdownMenuItem onClick={() => onEdit(agent)}>
              <Settings className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onClone(agent)}>
              <Copy className="mr-2 h-4 w-4" />
              Clone
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={() => onDelete(agent.id)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </CardHeader>
    <CardContent className="flex-grow">
      <p className="text-xs text-muted-foreground italic line-clamp-3">
        {agent.instructions}
      </p>
    </CardContent>
    <CardFooter>
      <Badge variant="secondary">{agent.model}</Badge>
    </CardFooter>
  </Card>
);


const AgentForm = ({ agent, onSave }: { agent?: any, onSave: (agent: any) => void }) => {
  const [name, setName] = useState(agent?.name || "");
  const [description, setDescription] = useState(agent?.description || "");
  const [instructions, setInstructions] = useState(agent?.instructions || "");
  const [model, setModel] = useState(agent?.model || "gemini-2.5-flash");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...agent, name, description, instructions, model });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="name">Agent Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Log Summarizer" required className="neo-inset"/>
      </div>
      <div className="space-y-1">
        <Label htmlFor="description">Description</Label>
        <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A brief summary of the agent's role" className="neo-inset"/>
      </div>
      <div className="space-y-1">
        <Label htmlFor="instructions">System Instructions (Prompt)</Label>
        <Textarea id="instructions" value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="You are an expert AI..." className="min-h-[150px] neo-inset" required/>
      </div>
       <div className="space-y-1">
        <Label htmlFor="model">AI Model</Label>
        <Input id="model" value={model} onChange={(e) => setModel(e.target.value)} placeholder="e.g., gemini-2.5-flash" required className="neo-inset" />
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" className="neo-button">
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" className="neo-button"><Save className="mr-2"/> Save Agent</Button>
      </DialogFooter>
    </form>
  );
}

export default function AgenticPage() {
  const [agents, setAgents] = useState(initialAgents);
  const [editingAgent, setEditingAgent] = useState<any | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  const handleSaveAgent = (agentData: any) => {
    if (agentData.id) {
      setAgents(agents.map(a => a.id === agentData.id ? agentData : a));
      toast({ title: "Agent Updated", description: `${agentData.name} has been saved.` });
    } else {
      const newAgent = { ...agentData, id: `agent_${Date.now()}` };
      setAgents([...agents, newAgent]);
      toast({ title: "Agent Created", description: `${newAgent.name} has been added to your team.` });
    }
    setIsFormOpen(false);
    setEditingAgent(undefined);
  };
  
  const handleEdit = (agent: any) => {
    setEditingAgent(agent);
    setIsFormOpen(true);
  }

  const handleCreate = () => {
    setEditingAgent(undefined);
    setIsFormOpen(true);
  }

  const handleDelete = (id: string) => {
    setAgents(agents.filter(a => a.id !== id));
    toast({ variant: "destructive", title: "Agent Deleted", description: "The agent has been removed." });
  }


  const handleClone = (agent: any) => {
    const clonedAgent = { ...agent, name: `${agent.name} (Clone)`, id: `agent_${Date.now()}` };
    setAgents([...agents, clonedAgent]);
    toast({ title: "Agent Cloned", description: `${clonedAgent.name} has been created.` });
  }


  return (
    <div className="flex flex-col h-full">
      <header className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 sticky top-0 z-10 bg-background border-b">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-xl font-headline font-semibold">
            Agentic Workflow Manager
          </h1>
        </div>
        <Button onClick={handleCreate} className="neo-button">
          <Plus className="mr-2" /> Create New Agent
        </Button>
      </header>
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent className="sm:max-w-[600px] neo-outset">
              <DialogHeader>
                <DialogTitle className="font-headline text-2xl">{editingAgent ? "Edit Agent" : "Create New Agent"}</DialogTitle>
                <DialogDescription>
                  Configure the agent's name, instructions, and underlying AI model.
                </DialogDescription>
              </DialogHeader>
              <AgentForm agent={editingAgent} onSave={handleSaveAgent} />
            </DialogContent>
        </Dialog>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><Network /> Agent Workflow Builder</CardTitle>
                <CardDescription>Visually construct and reorder your analysis pipeline by dragging and dropping agents.</CardDescription>
            </CardHeader>
            <CardContent>
              <WorkflowBuilder agents={agents} />
            </CardContent>
        </Card>


        <div className="space-y-4">
            <h2 className="text-2xl font-headline font-semibold">AI Agent Roster</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agents.map((agent) => (
                    <AgentCard key={agent.id} agent={agent} onEdit={handleEdit} onDelete={handleDelete} onClone={handleClone} />
                ))}
            </div>
        </div>

        <Separator />

        <div className="space-y-4">
            <h2 className="text-2xl font-headline font-semibold">Advanced Operations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2"><BrainCircuit /> Fine-Tuning</CardTitle>
                        <CardDescription>Train agents on your specific data for improved accuracy.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" className="w-full neo-button" disabled>
                            Launch Fine-Tuning Job
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2"><FlaskConical /> A/B Testing</CardTitle>
                        <CardDescription>Test different models or prompts against each other.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" className="w-full neo-button" disabled>
                            Create New Experiment
                        </Button>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2"><WandSparkles /> Hyper-Parameters</CardTitle>
                        <CardDescription>Adjust advanced settings like temperature and top-k.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" className="w-full neo-button" disabled>
                            Configure Parameters
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
      </main>
    </div>
  );
}

    