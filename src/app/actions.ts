
"use server";

import { z } from "zod";
import type { AnalysisReport } from "@/lib/types";
import { summarizeErrorLogs } from "@/ai/flows/summarize-error-logs";
import { enhanceTraceback } from "@/ai/flows/enhance-traceback-analysis";
import { generateSolutionFromError } from "@/ai/flows/generate-solution-from-error";

const analyzeLogsSchema = z.object({
  logs: z.string(),
  includeTraceback: z.boolean(),
  templatePrompt: z.string().optional(),
});

export async function analyzeLogsAction(
  values: z.infer<typeof analyzeLogsSchema>
): Promise<{ data: AnalysisReport | null; error: string | null }> {
  const validatedFields = analyzeLogsSchema.safeParse(values);

  if (!validatedFields.success) {
    return { data: null, error: "Invalid input." };
  }
  
  const { logs, includeTraceback, templatePrompt } = validatedFields.data;

  try {
    const techStack = "Unknown";
    const environment = "production";

    // Prepend the template prompt to the logs for summarization if it exists
    const logsForSummary = templatePrompt ? `${templatePrompt}\n\nError Logs:\n${logs}` : logs;

    const summaryResult = await summarizeErrorLogs({
      logs: logsForSummary,
      techStack,
      environment,
    });

    let tracebackResult;
    if (includeTraceback) {
      tracebackResult = await enhanceTraceback({
        traceback: logs,
        techStack,
        environment,
      });
    }
    
    // The analysis from the summary now incorporates the template
    const analysis = summaryResult.summary;

    const solutionResult = await generateSolutionFromError({
      analysis: analysis,
      techStack,
      environment,
      traceback: includeTraceback ? logs : undefined,
    });
    
    const verification = "To verify the fix, apply the suggested code changes and run the relevant unit tests. If the issue is intermittent, monitor the logs for recurrence after deployment.";

    const analysisReport: AnalysisReport = {
      id: `analysis_${new Date().getTime()}`,
      timestamp: new Date().toISOString(),
      techStack: techStack,
      environment: environment,
      analysis: analysis,
      proposedSolution: {
        description: solutionResult.solution,
        code: solutionResult.solution.substring(solutionResult.solution.indexOf('```'), solutionResult.solution.lastIndexOf('```') + 3) || ""
      },
      verification: verification,
      confidenceScore: (summaryResult.confidenceScore + (tracebackResult?.confidenceScore || 0) + solutionResult.confidenceScore) / (includeTraceback ? 3 : 2),
      isIntermittent: summaryResult.isIntermittent || (tracebackResult?.isIntermittent || false),
      needsFix: summaryResult.needsFix || (tracebackResult?.needsFix || false),
      traceback: includeTraceback && tracebackResult ? {
        exceptionType: tracebackResult.exceptionType,
        relevantFrames: tracebackResult.relevantFrames,
      } : undefined,
    };

    return { data: analysisReport, error: null };
  } catch (e: any) {
    console.error(e);
    return { data: null, error: `An error occurred during analysis: ${e.message}` };
  }
}
