
"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { WandSparkles, Loader2, Upload, GitBranch, FileText } from "lucide-react";
import { analyzeLogsAction } from "@/app/actions";
import { AnalysisDisplay } from "./analysis-display";
import type { AnalysisReport, Agent, Workflow, WorkflowTemplate } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { templates } from "@/lib/templates";
import { AiTeamAnimation } from "./ai-team-animation";
import { Switch } from "@/components/ui/switch";
import { exampleLogs } from "@/lib/example-logs";


const formSchema = z.object({
  logs: z.string().min(50, "Please provide at least 50 characters of log data."),
  template: z.string().default(templates[0].id),
});


const initialAgents: Agent[] = [
  {
    id: "summarizer",
    name: "Summarizer Agent",
    description: "Reads raw logs and creates a high-level summary of the issue.",
    instructions: "...",
    model: "gemini-2.5-flash",
  },
  {
    id: "traceback",
    name: "Traceback Agent",
    description: "Parses stack traces to identify the exception type and key frames.",
    instructions: "...",
    model: "gemini-2.5-flash",
  },
  {
    id: "solution",
    name: "Solution Agent",
    description: "Generates a potential fix, including code snippets and verification steps.",
    instructions: "...",
    model: "gemini-2.5-flash",
  },
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

export function LogAnalyzer() {
  const [analysis, setAnalysis] = useState<AnalysisReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [workflow, setWorkflow] = useState<Workflow>({ agents: [] });


  useEffect(() => {
    // Load the active workflow from localStorage
    const syncEnabled = localStorage.getItem('agentic_syncEnabled') === 'true';
    if (syncEnabled) {
        const templateId = localStorage.getItem('agentic_selectedTemplateId');
        if (templateId === 'custom') {
            const customAgentIds: string[] = JSON.parse(localStorage.getItem('agentic_customWorkflow') || '[]');
            setWorkflow({ agents: customAgentIds.map(id => initialAgents.find(a => a.id === id)).filter(Boolean) as Agent[] });
        } else {
            const template = workflowTemplates.find(t => t.id === templateId) || workflowTemplates.find(t => t.id === 'default')!;
            setWorkflow({ agents: template.agents.map(id => initialAgents.find(a => a.id === id)).filter(Boolean) as Agent[] });
        }
    } else {
        // Fallback to a default workflow if sync is disabled
        const defaultTemplate = workflowTemplates.find(t => t.id === 'default')!;
        setWorkflow({ agents: defaultTemplate.agents.map(id => initialAgents.find(a => a.id === id)).filter(Boolean) as Agent[] });
    }
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      logs: "",
      template: templates[0].id,
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        form.setValue("logs", text);
      };
      reader.readAsText(file);
    }
  };

  const loadExample = (logType: keyof typeof exampleLogs) => {
    form.setValue("logs", exampleLogs[logType]);
    toast({
        title: "Example Loaded",
        description: `The ${logType.charAt(0).toUpperCase() + logType.slice(1)} log example has been loaded into the text area.`,
    })
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAnalysis(null);
    try {
      if (workflow.agents.length === 0) {
        toast({
          variant: "destructive",
          title: "Empty Workflow",
          description: "Your active workflow has no agents. Go to the Agentic page to build one.",
        });
        setIsLoading(false);
        return;
      }
      
      const selectedTemplate = templates.find(t => t.id === values.template);
      const result = await analyzeLogsAction({
        logs: values.logs,
        templatePrompt: selectedTemplate?.prompt || "",
        workflow: workflow,
      });

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Analysis Failed",
          description: result.error,
        });
      } else {
        setAnalysis(result.data);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "An unexpected error occurred",
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card className="neo-outset">
        <CardHeader>
          <CardTitle className="font-headline">Analyze Error Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="logs"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>Paste Logs or Upload File</FormLabel>
                      <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button type="button" variant="outline" size="sm" className="neo-button">
                                <FileText className="mr-2 h-4 w-4" /> Load Example
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="neo-outset">
                                <DropdownMenuItem onClick={() => loadExample('simple')}>Simple Log</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => loadExample('complex')}>Complex Log</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => loadExample('confusing')}>Confusing Log</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm" 
                            className="neo-button"
                            onClick={() => fileInputRef.current?.click()}>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload File
                          </Button>
                          <Input 
                            type="file" 
                            ref={fileInputRef}
                            className="hidden" 
                            onChange={handleFileChange}
                            accept=".log,.txt,text/plain"
                          />
                      </div>
                    </div>
                    <FormControl>
                      <Textarea
                        placeholder="Paste your error logs, including stack traces, or upload a file."
                        className="min-h-[300px] font-code text-xs neo-inset"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide the raw log data from your application. For best results, include the full error message and any surrounding log entries that provide context. This information is sent to a secure AI model for analysis.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="template"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Formatting Template</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="neo-button">
                          <SelectValue placeholder="Select a DevOps template" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="neo-outset">
                        {templates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The AI workflow will run first, and then the results will be formatted using this template. This helps structure the final output for a specific task.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full !mt-10 neo-button" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <WandSparkles className="mr-2" />
                )}
                Analyze Logs
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {isLoading && (
          <Card className="neo-outset">
            <CardHeader>
              <CardTitle className="font-headline">
                Analysis in Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
              <AiTeamAnimation />
            </CardContent>
          </Card>
        )}
        {analysis && <AnalysisDisplay report={analysis} />}
        {!isLoading && !analysis && (
          <Card className="neo-outset">
            <CardHeader>
              <CardTitle className="font-headline">Awaiting Analysis</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center min-h-[400px] text-center text-muted-foreground space-y-4">
              <WandSparkles className="w-12 h-12" />
              <p>Your AI-powered error analysis will appear here.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
