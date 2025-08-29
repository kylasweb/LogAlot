'use server';

/**
 * @fileOverview Summarizes error logs using AI to quickly understand the root cause of issues.
 *
 * - summarizeErrorLogs - A function that handles the error log summarization process.
 * - SummarizeErrorLogsInput - The input type for the summarizeErrorLogs function.
 * - SummarizeErrorLogsOutput - The return type for the summarizeErrorLogs function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeErrorLogsInputSchema = z.object({
  logs: z
    .string()
    .describe('The error logs to summarize.'),
  techStack: z
    .string()
    .optional()
    .describe('The tech stack that produced the logs.'),
  environment: z
    .string()
    .optional()
    .describe('The environment the logs were produced in.'),
});
export type SummarizeErrorLogsInput = z.infer<typeof SummarizeErrorLogsInputSchema>;

const SummarizeErrorLogsOutputSchema = z.object({
  summary: z.string().describe('A summary of the error logs.'),
  rootCause: z.string().describe('A detailed analysis of the likely root cause.'),
  impact: z.string().describe('An assessment of the potential impact of the error.'),
  confidenceScore: z.number().describe('A confidence score (0-1) for the summary.'),
  isIntermittent: z.boolean().describe('Whether the issue is intermittent or not.'),
  needsFix: z.boolean().describe('Whether the issue needs to be fixed or not.'),
});
export type SummarizeErrorLogsOutput = z.infer<typeof SummarizeErrorLogsOutputSchema>;

export async function summarizeErrorLogs(input: SummarizeErrorLogsInput): Promise<SummarizeErrorLogsOutput> {
  return summarizeErrorLogsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeErrorLogsPrompt',
  input: {schema: SummarizeErrorLogsInputSchema},
  output: {schema: SummarizeErrorLogsOutputSchema},
  prompt: `You are an expert software engineer specializing in debugging and root cause analysis.

You will analyze the provided error logs, tech stack, and environment information to provide a concise summary of the issue.

Based on your analysis, you will also determine:
- A detailed analysis of the likely **root cause**.
- An assessment of the potential **impact** of the error.
- A confidence score (0-1) for the accuracy of your summary.
- Whether the issue appears intermittent.
- Whether a fix is required.

Error Logs:
{{{logs}}}

Tech Stack: {{techStack}}
Environment: {{environment}}
`,
});

const summarizeErrorLogsFlow = ai.defineFlow(
  {
    name: 'summarizeErrorLogsFlow',
    inputSchema: SummarizeErrorLogsInputSchema,
    outputSchema: SummarizeErrorLogsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
