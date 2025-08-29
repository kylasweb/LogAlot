
"use server";

import { z } from "zod";
import type { AnalysisReport, Agent, Workflow } from "@/lib/types";
import { summarizeErrorLogs, SummarizeErrorLogsOutput } from "@/ai/flows/summarize-error-logs";
import { enhanceTraceback, EnhanceTracebackOutput } from "@/ai/flows/enhance-traceback-analysis";
import { generateSolutionFromError, GenerateSolutionFromErrorOutput } from "@/ai/flows/generate-solution-from-error";


const analyzeLogsSchema = z.object({
  logs: z.string(),
  templatePrompt: z.string().optional(),
  workflow: z.custom<Workflow>()
});


// Maps agent IDs to their corresponding Genkit flow functions
const agentFunctionMap: Record<string, (input: any) => Promise<any>> = {
    'summarizer': summarizeErrorLogs,
    'traceback': enhanceTraceback,
    'solution': generateSolutionFromError,
    // Add other agents here as their flows are implemented
    // 'sre-ticketing': sreTicketingFlow, 
    // etc.
};


export async function analyzeLogsAction(
  values: z.infer<typeof analyzeLogsSchema>
): Promise<{ data: AnalysisReport | null; error: string | null }> {
  const validatedFields = analyzeLogsSchema.safeParse(values);

  if (!validatedFields.success) {
    return { data: null, error: "Invalid input." };
  }
  
  const { logs, templatePrompt, workflow } = validatedFields.data;

  try {
    const techStack = "Unknown";
    const environment = "production";

    // This object will accumulate the results from each agent in the workflow
    let analysisContext: Record<string, any> = {
        logs: templatePrompt ? `${templatePrompt}\n\nError Logs:\n${logs}` : logs,
        traceback: logs, // Pass raw logs for traceback
        techStack,
        environment,
    };
    
    let report: Partial<AnalysisReport> = {
        id: `analysis_${new Date().getTime()}`,
        timestamp: new Date().toISOString(),
        techStack: techStack,
        environment: environment,
        confidenceScore: 0
    };
    
    let totalConfidence = 0;
    let confidenceCount = 0;

    for (const agent of workflow.agents) {
        const agentFunction = agentFunctionMap[agent.id];
        if (!agentFunction) {
            console.warn(`No agent function found for agent ID: ${agent.id}. Skipping.`);
            continue;
        }

        // Prepare the input for the current agent based on its needs
        // and the data available in the context.
        const agentInput = {
            logs: analysisContext.logs,
            traceback: analysisContext.traceback,
            techStack: analysisContext.techStack,
            environment: analysisContext.environment,
            analysis: analysisContext.analysis, // For solution agent
        };
        
        const result = await agentFunction(agentInput);

        // Process and merge the results into the final report
        // and update the shared context for the next agent.
        switch(agent.id) {
            case 'summarizer':
                const summaryResult = result as SummarizeErrorLogsOutput;
                report = {
                    ...report,
                    summary: summaryResult.summary,
                    rootCause: summaryResult.rootCause,
                    impact: summaryResult.impact,
                    isIntermittent: summaryResult.isIntermittent,
                    needsFix: summaryResult.needsFix,
                };
                analysisContext.analysis = summaryResult.summary; // Make summary available for next agents
                if(summaryResult.confidenceScore) {
                  totalConfidence += summaryResult.confidenceScore;
                  confidenceCount++;
                }
                break;
            case 'traceback':
                const tracebackResult = result as EnhanceTracebackOutput;
                report = {
                    ...report,
                    traceback: {
                        exceptionType: tracebackResult.exceptionType,
                        relevantFrames: tracebackResult.relevantFrames,
                        analysis: tracebackResult.analysis,
                    }
                };
                 // Enhance the context for the solution agent
                analysisContext.analysis = `${analysisContext.analysis || ''}\n\nTraceback Analysis:\n${tracebackResult.analysis}`;
                if(tracebackResult.confidenceScore) {
                  totalConfidence += tracebackResult.confidenceScore;
                  confidenceCount++;
                }
                break;
            case 'solution':
                const solutionResult = result as GenerateSolutionFromErrorOutput;
                report = {
                    ...report,
                    proposedSolution: {
                        description: solutionResult.solutionDescription,
                        code: solutionResult.solutionCode
                    },
                    verification: solutionResult.verificationSteps,
                    prevention: solutionResult.prevention,
                };
                if(solutionResult.confidenceScore) {
                  totalConfidence += solutionResult.confidenceScore;
                  confidenceCount++;
                }
                break;
            // Add cases for other agents here
        }
    }
    
    if (confidenceCount > 0) {
        report.confidenceScore = totalConfidence / confidenceCount;
    }


    // Ensure all required fields are present before returning
    const finalReport: AnalysisReport = {
      summary: "No summary generated.",
      rootCause: "Not analyzed.",
      impact: "Not analyzed.",
      prevention: "Not analyzed.",
      proposedSolution: { description: "No solution generated.", code: "" },
      verification: "Not analyzed.",
      ...report,
      id: report.id!,
      timestamp: report.timestamp!,
      techStack: report.techStack!,
      environment: report.environment!,
      confidenceScore: report.confidenceScore || 0,
      isIntermittent: report.isIntermittent || false,
      needsFix: report.needsFix || false,
    };


    return { data: finalReport, error: null };
  } catch (e: any) {
    console.error(e);
    return { data: null, error: `An error occurred during analysis: ${e.message}` };
  }
}
