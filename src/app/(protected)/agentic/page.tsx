
"use client";

import { useState, useEffect } from "react";
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
  Network,
  GitBranch,
  Info
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
import type { Agent, WorkflowTemplate } from "@/lib/types";


const initialAgents: Agent[] = [
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
  {
    id: 'sre-ticketing',
    name: 'SRE Ticketing Agent',
    description: 'Formats analysis into a standardized SRE ticket.',
    instructions: 'You are an SRE specialist. Your task is to take an error analysis and format it into a structured ticket for an SRE team, including priority, suggested owner, and technical details.',
    model: 'gemini-2.5-flash',
  },
  {
    id: 'security-analyst',
    name: 'Security Analyst Agent',
    description: 'Analyzes logs for potential security vulnerabilities.',
    instructions: 'You are a security expert. Analyze the provided logs for any signs of security vulnerabilities like SQL injection, XSS, or unauthorized access. If a threat is found, provide a detailed vulnerability report.',
    model: 'gemini-2.5-flash',
  },
  {
    id: 'qa-engineer',
    name: 'QA Engineer Agent',
    description: 'Generates test cases based on the identified error.',
    instructions: 'You are a QA Engineer. Based on the error report, create a set of test cases to verify the fix and prevent regressions. Include positive, negative, and edge cases.',
    model: 'gemini-2.5-flash',
  },
  {
    id: 'customer-comms',
    name: 'Customer Comms Agent',
    description: 'Drafts a non-technical explanation for customer support.',
    instructions: 'You are a customer support manager. Draft an empathetic, non-technical explanation of the issue for a customer, focusing on reassurance and resolution status.',
    model: 'gemini-2.5-flash',
  },
  {
    id: 'postmortem-writer',
    name: 'Postmortem Writer Agent',
    description: 'Generates a formal postmortem document for incident review.',
    instructions: 'You are a technical writer specializing in incident postmortems. Structure the full analysis into a formal report with sections for Summary, Impact, Root Cause, Resolution, and Action Items.',
    model: 'gemini-2.5-flash',
  }
];

const workflowTemplates: WorkflowTemplate[] = [
    { id: 'custom', name: 'Custom Workflow', agents: [] },
    { id: 'default', name: 'Standard DevOps Analysis', agents: ['summarizer', 'traceback', 'solution'] },
    { id: 'security', name: 'Security-Focused Analysis', agents: ['summarizer', 'security-analyst', 'solution'] },
    { id: 'support', name: 'Customer Support Triage', agents: ['summarizer', 'customer-comms'] },
    { id: 'qa', name: 'QA & Test Generation', agents: ['summarizer', 'traceback', 'qa-engineer'] },
    { id: 'full-incident', name: 'Full Incident Response', agents: ['summarizer', 'traceback', 'solution', 'sre-ticketing', 'postmortem-writer'] },
    { id: 'quick-look', name: 'Quick Look Summary', agents: ['summarizer'] },
];



const AgentCard = ({ agent, onEdit, onDelete, onClone }: { agent: Agent, onEdit: (agent: Agent) => void, onDelete: (id: string) => void, onClone: (agent: Agent) => void }) => (
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


const AgentForm = ({ agent, onSave }: { agent?: Agent, onSave: (agent: Agent) => void }) => {
  const [name, setName] = useState(agent?.name || "");
  const [description, setDescription] = useState(agent?.description || "");
  const [instructions, setInstructions] = useState(agent?.instructions || "");
  const [model, setModel] = useState(agent?.model || "gemini-2.5-flash");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...agent, id: agent?.id || `agent_${Date.now()}`, name, description, instructions, model });
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
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [editingAgent, setEditingAgent] = useState<Agent | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();
  
  const [activeWorkflow, setActiveWorkflow] = useState<Agent[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('default');
  const [isSyncEnabled, setIsSyncEnabled] = useState<boolean>(true);


  useEffect(() => {
    // Load state from localStorage on mount
    const savedSync = localStorage.getItem('agentic_syncEnabled');
    setIsSyncEnabled(savedSync ? JSON.parse(savedSync) : true);

    const savedTemplateId = localStorage.getItem('agentic_selectedTemplateId');
    const template = workflowTemplates.find(t => t.id === savedTemplateId) || workflowTemplates.find(t => t.id === 'default')!;
    setSelectedTemplateId(template.id);
    
    if (template.id === 'custom') {
        const savedCustomWorkflow = localStorage.getItem('agentic_customWorkflow');
        if (savedCustomWorkflow) {
            const customAgentIds: string[] = JSON.parse(savedCustomWorkflow);
            const workflowAgents = customAgentIds.map(id => agents.find(a => a.id === id)).filter(Boolean) as Agent[];
            setActiveWorkflow(workflowAgents);
        }
    } else {
        const workflowAgents = template.agents.map(id => agents.find(a => a.id === id)).filter(Boolean) as Agent[];
        setActiveWorkflow(workflowAgents);
    }
  }, [agents]);

  useEffect(() => {
    // Save state to localStorage whenever it changes
    localStorage.setItem('agentic_syncEnabled', JSON.stringify(isSyncEnabled));
    if (isSyncEnabled) {
        localStorage.setItem('agentic_selectedTemplateId', selectedTemplateId);
        if (selectedTemplateId === 'custom') {
            localStorage.setItem('agentic_customWorkflow', JSON.stringify(activeWorkflow.map(a => a.id)));
        } else {
            // Remove custom workflow when a template is active
            localStorage.removeItem('agentic_customWorkflow');
        }
    }
  }, [isSyncEnabled, selectedTemplateId, activeWorkflow]);


  const handleSaveAgent = (agentData: Agent) => {
    if (agents.find(a => a.id === agentData.id)) {
      setAgents(agents.map(a => a.id === agentData.id ? agentData : a));
      toast({ title: "Agent Updated", description: `${agentData.name} has been saved.` });
    } else {
      const newAgent = { ...agentData, id: agentData.id || `agent_${Date.now()}` };
      setAgents([...agents, newAgent]);
      toast({ title: "Agent Created", description: `${newAgent.name} has been added to your team.` });
    }
    setIsFormOpen(false);
    setEditingAgent(undefined);
  };
  
  const handleEdit = (agent: Agent) => {
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


  const handleClone = (agent: Agent) => {
    const clonedAgent = { ...agent, name: `${agent.name} (Clone)`, id: `agent_${Date.now()}` };
    setAgents([...agents, clonedAgent]);
    toast({ title: "Agent Cloned", description: `${clonedAgent.name} has been created.` });
  }

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);
    if (templateId === 'custom') {
        // If switching to custom, start with an empty workflow or a saved one
        const savedCustomWorkflow = localStorage.getItem('agentic_customWorkflow');
        if (savedCustomWorkflow) {
             const customAgentIds: string[] = JSON.parse(savedCustomWorkflow);
             const workflowAgents = customAgentIds.map(id => agents.find(a => a.id === id)).filter(Boolean) as Agent[];
             setActiveWorkflow(workflowAgents);
        } else {
            setActiveWorkflow([]);
        }
    } else {
        const template = workflowTemplates.find(t => t.id === templateId)!;
        const workflowAgents = template.agents.map(id => agents.find(a => a.id === id)).filter(Boolean) as Agent[];
        setActiveWorkflow(workflowAgents);
    }
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
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="font-headline flex items-center gap-2"><Network /> Agent Workflow Builder</CardTitle>
                        <CardDescription>Visually construct and reorder your analysis pipeline. Active changes are saved automatically.</CardDescription>
                    </div>
                     <div className="flex items-center gap-4">
                        <div className="flex items-center space-x-2">
                            <Switch id="sync-dashboard" checked={isSyncEnabled} onCheckedChange={setIsSyncEnabled} />
                            <Label htmlFor="sync-dashboard" className="flex items-center gap-1">Sync with Dashboard <Info className="w-3 h-3 text-muted-foreground" title="When enabled, the workflow here will be used for log analysis."/></Label>
                        </div>
                        <Select value={selectedTemplateId} onValueChange={handleTemplateChange}>
                            <SelectTrigger className="w-[280px] neo-button">
                                <SelectValue placeholder="Select a workflow template" />
                            </SelectTrigger>
                            <SelectContent className="neo-outset">
                                {workflowTemplates.map((template) => (
                                <SelectItem key={template.id} value={template.id}>
                                    {template.name}
                                </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
              <WorkflowBuilder 
                allAgents={agents} 
                activeWorkflow={activeWorkflow}
                setActiveWorkflow={setActiveWorkflow}
                isCustomMode={selectedTemplateId === 'custom'}
              />
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
                        <CardTitle className="font-headline flex items-center gap-2"><GitBranch /> A/B Testing</CardTitle>
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
