
"use client";

import { useState } from "react";
import { Plus, Upload, MoreHorizontal } from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import type { Agent, FineTuningJob } from "@/lib/types";

const initialJobs: FineTuningJob[] = [
  { id: "job_1", agentName: "Summarizer Agent", baseModel: "gemini-2.5-flash", dataset: "prod_logs_v1.jsonl", status: "completed", progress: 100, createdAt: new Date("2023-10-26T10:00:00Z"), fineTunedModelId: "ft:gemini-2.5-flash:my-org:summarizer:1" },
  { id: "job_2", agentName: "Solution Agent", baseModel: "gemini-2.5-flash", dataset: "bug_reports_v2.jsonl", status: "running", progress: 65, createdAt: new Date("2023-10-28T14:30:00Z") },
  { id: "job_3", agentName: "Traceback Agent", baseModel: "gemini-2.5-flash", dataset: "python_exceptions.jsonl", status: "failed", progress: 0, createdAt: new Date("2023-10-27T09:00:00Z"), error: "Invalid data format on line 134" },
  { id: "job_4", agentName: "Summarizer Agent", baseModel: "gemini-2.5-flash", dataset: "prod_logs_v2_sample.jsonl", status: "queued", progress: 0, createdAt: new Date() },
];

const availableAgents: Agent[] = [
    { id: "summarizer", name: "Summarizer Agent", description: "", instructions: "", model: "gemini-2.5-flash" },
    { id: "traceback", name: "Traceback Agent", description: "", instructions: "", model: "gemini-2.5-flash" },
    { id: "solution", name: "Solution Agent", description: "", instructions: "", model: "gemini-2.5-flash" },
];

function CreateFineTuningJobForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [agentId, setAgentId] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      if (selectedFile && (selectedFile.type === "application/json" || selectedFile.name.endsWith(".jsonl"))) {
        setFile(selectedFile);
      } else {
        toast({ variant: 'destructive', title: "Invalid File Type", description: "Please upload a .json or .jsonl file." });
        setFile(null);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentId || !file) {
      toast({ variant: 'destructive', title: "Missing Fields", description: "Please select an agent and a dataset file." });
      return;
    }
    onSubmit({ agentId, file });
  };
  
  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
            <Label htmlFor="agent-select">Select Agent to Fine-Tune</Label>
            <Select onValueChange={setAgentId} value={agentId}>
                <SelectTrigger id="agent-select" className="neo-button">
                    <SelectValue placeholder="Select an agent..." />
                </SelectTrigger>
                <SelectContent className="neo-outset">
                    {availableAgents.map(agent => (
                        <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
        <div className="space-y-2">
            <Label htmlFor="dataset-upload">Upload Dataset (.jsonl)</Label>
            <div className="flex items-center justify-center w-full">
                <label htmlFor="dataset-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80 neo-inset">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        {file ? (
                            <p className="font-semibold text-primary">{file.name}</p>
                        ) : (
                            <>
                                <p className="mb-1 text-sm text-muted-foreground">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-muted-foreground">JSONL format required</p>
                            </>
                        )}
                    </div>
                    <input id="dataset-upload" type="file" className="hidden" onChange={handleFileChange} accept=".json,.jsonl" />
                </label>
            </div>
        </div>
        <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" className="neo-button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="neo-button">Start Fine-Tuning</Button>
        </DialogFooter>
    </form>
  )
}

export default function FineTuningPage() {
    const [jobs, setJobs] = useState(initialJobs);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const { toast } = useToast();

    const handleCreateJob = (data: { agentId: string, file: File }) => {
        const agent = availableAgents.find(a => a.id === data.agentId);
        if (!agent) return;

        const newJob: FineTuningJob = {
            id: `job_${Date.now()}`,
            agentName: agent.name,
            baseModel: agent.model,
            dataset: data.file.name,
            status: "queued",
            progress: 0,
            createdAt: new Date(),
        };

        setJobs(prev => [newJob, ...prev]);
        toast({ title: "Job Created", description: `Fine-tuning for ${agent.name} has been queued.` });
        setIsFormOpen(false);

        // Simulate progress for new job
        setTimeout(() => {
          setJobs(prev => prev.map(j => j.id === newJob.id ? {...j, status: 'running'} : j));
          const interval = setInterval(() => {
            setJobs(prev => prev.map(j => {
              if (j.id === newJob.id && j.progress < 100) {
                const newProgress = j.progress + 10;
                if (newProgress >= 100) {
                  clearInterval(interval);
                  return {...j, progress: 100, status: 'completed', fineTunedModelId: `ft:gemini-2.5-flash:my-org:${agent.id}:${newJob.id}`}
                }
                return {...j, progress: newProgress};
              }
              return j;
            }))
          }, 2000);
        }, 3000);

    };

  return (
    <div className="flex flex-col h-full">
      <header className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 sticky top-0 z-10 bg-background border-b">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-xl font-headline font-semibold">
            Agent Fine-Tuning
          </h1>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
                <Button className="neo-button">
                    <Plus className="mr-2" /> Create New Job
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] neo-outset">
                <DialogHeader>
                    <DialogTitle className="font-headline">New Fine-Tuning Job</DialogTitle>
                    <DialogDescription>
                        Select an agent and provide a dataset to create a fine-tuned model.
                    </DialogDescription>
                </DialogHeader>
                <CreateFineTuningJobForm onSubmit={handleCreateJob} />
            </DialogContent>
        </Dialog>
      </header>
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        <Card className="neo-outset">
          <CardHeader>
            <CardTitle>Fine-Tuning Jobs</CardTitle>
            <CardDescription>
              Manage and monitor your agent fine-tuning jobs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent</TableHead>
                  <TableHead>Dataset</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      <div className="font-medium">{job.agentName}</div>
                      <div className="text-sm text-muted-foreground">{job.baseModel}</div>
                    </TableCell>
                    <TableCell>{job.dataset}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          job.status === "completed" ? "default" :
                          job.status === "failed" ? "destructive" :
                          "secondary"
                        }>
                          {job.status}
                        </Badge>
                        {(job.status === "running") && <Progress value={job.progress} className="w-24 h-2" />}
                      </div>
                       {job.status === 'failed' && <p className="text-xs text-destructive mt-1">{job.error}</p>}
                       {job.status === 'completed' && <p className="text-xs text-muted-foreground mt-1">{job.fineTunedModelId}</p>}
                    </TableCell>
                    <TableCell>{job.createdAt.toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem disabled={job.status !== 'completed'}>Apply Model</DropdownMenuItem>
                          <DropdownMenuItem disabled={job.status !== 'failed'}>Retry Job</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Cancel Job</DropdownMenuItem>
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
