
"use server";

import { z } from "zod";
import type { AnalysisReport } from "@/lib/types";
import { summarizeErrorLogs } from "@/ai/flows/summarize-error-logs";
import { enhanceTraceback } from "@/ai/flows/enhance-traceback-analysis";
import { generateSolutionFromError } from "@/ai/flows/generate-solution-from-error";

const analyzeLogsSchema = z.object({
  logs: z.string(),
  includeTraceback: z.boolean(),
});

export async function analyzeLogsAction(
  values: z.infer<typeof analyzeLogsSchema>
): Promise<{ data: AnalysisReport | null; error: string | null }> {
  const validatedFields = analyzeLogsSchema.safeParse(values);

  if (!validatedFields.success) {
    return { data: null, error: "Invalid input." };
  }
  
  const { logs, includeTraceback } = validatedFields.data;

  try {
    const techStack = "Unknown";
    const environment = "production";

    const summaryResult = await summarizeErrorLogs({
      logs,
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

    const solutionResult = await generateSolutionFromError({
      analysis: tracebackResult?.analysis || summaryResult.summary,
      techStack,
      environment,
      traceback: includeTraceback ? logs : undefined,
    });
    
    // The verification step can be an LLM call as well, but for now we'll use a static placeholder
    const verification = "To verify the fix, apply the suggested code changes and run the relevant unit tests. If the issue is intermittent, monitor the logs for recurrence after deployment.";


    const analysisReport: AnalysisReport = {
      id: `analysis_${new Date().getTime()}`,
      timestamp: new Date().toISOString(),
      techStack: techStack,
      environment: environment,
      analysis: tracebackResult?.analysis || summaryResult.summary,
      proposedSolution: {
        description: solutionResult.solution,
        // For now, we are assuming the solution contains a code block.
        // A more robust solution would be to have the LLM separate description and code.
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
