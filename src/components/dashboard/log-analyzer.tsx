
"use client";

import { useState, useRef } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { WandSparkles, Loader2, Upload } from "lucide-react";
import { analyzeLogsAction } from "@/app/actions";
import { AnalysisDisplay } from "./analysis-display";
import type { AnalysisReport } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { templates } from "@/lib/templates";
import { AiTeamAnimation } from "./ai-team-animation";

const formSchema = z.object({
  logs: z.string().min(50, "Please provide at least 50 characters of log data."),
  includeTraceback: z.boolean().default(true),
  template: z.string().default(templates[0].id),
});

export function LogAnalyzer() {
  const [analysis, setAnalysis] = useState<AnalysisReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      logs: "",
      includeTraceback: true,
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAnalysis(null);
    try {
      // Find the full template content to pass to the action
      const selectedTemplate = templates.find(t => t.id === values.template);
      const result = await analyzeLogsAction({
        logs: values.logs,
        includeTraceback: values.includeTraceback,
        // Pass the prompt content to the backend
        templatePrompt: selectedTemplate?.prompt || "",
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
                    <FormLabel>Analysis Template</FormLabel>
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
                      Choose a template to guide the AI in generating a response tailored to a specific DevOps task. This helps structure the output for creating a postmortem report, a developer bug ticket, or other common actions.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="includeTraceback"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 neo-outset">
                    <div className="space-y-1.5">
                      <FormLabel>Integrate Traceback Analysis</FormLabel>
                      <FormDescription>
                        Enable this to have the AI specifically parse stack traces from the logs. This provides a more detailed breakdown of the error's origin and relevant code frames, leading to a more precise analysis.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
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
