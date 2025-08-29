'use server';
/**
 * @fileOverview AI agent to enhance traceback analysis by extracting key frames and exception types.
 *
 * - enhanceTraceback - Function to enhance traceback analysis.
 * - EnhanceTracebackInput - Input type for the enhanceTraceback function.
 * - EnhanceTracebackOutput - Return type for the enhanceTraceback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceTracebackInputSchema = z.object({
  traceback: z
    .string()
    .describe('The traceback text to analyze and enhance.'),
  techStack: z.string().describe('The tech stack associated with the traceback (e.g., Python, JS).'),
  environment: z.string().describe('The environment where the error occurred (e.g., production, staging).'),
});
export type EnhanceTracebackInput = z.infer<typeof EnhanceTracebackInputSchema>;

const EnhanceTracebackOutputSchema = z.object({
  analysis: z.string().describe('Enhanced analysis of the traceback, explaining the error flow.'),
  exceptionType: z.string().describe('The type of exception that occurred.'),
  relevantFrames: z.array(z.string()).describe('Key frames from the traceback that are most relevant to the error.'),
  confidenceScore: z.number().describe('A confidence score (0-1) representing the reliability of the analysis.'),
  isIntermittent: z.boolean().describe('Indicates if the issue is intermittent or consistent.'),
  needsFix: z.boolean().describe('Indicates whether the issue requires a fix.'),
});
export type EnhanceTracebackOutput = z.infer<typeof EnhanceTracebackOutputSchema>;

export async function enhanceTraceback(input: EnhanceTracebackInput): Promise<EnhanceTracebackOutput> {
  return enhanceTracebackFlow(input);
}

const enhanceTracebackPrompt = ai.definePrompt({
  name: 'enhanceTracebackPrompt',
  input: {schema: EnhanceTracebackInputSchema},
  output: {schema: EnhanceTracebackOutputSchema},
  prompt: `You are an expert software engineer specializing in debugging and analyzing traceback errors.

  Analyze the provided traceback to extract the key exception type, most relevant frames, and provide an enhanced analysis explaining the flow of the error through the code.
  Determine a confidence score for the analysis, indicate if the issue is intermittent, and determine if a fix is required.

  Traceback:
  {{{traceback}}}

  Tech Stack: {{techStack}}
  Environment: {{environment}}

  Provide your output in the specified JSON format.
  `,
});

const enhanceTracebackFlow = ai.defineFlow(
  {
    name: 'enhanceTracebackFlow',
    inputSchema: EnhanceTracebackInputSchema,
    outputSchema: EnhanceTracebackOutputSchema,
  },
  async input => {
    const {output} = await enhanceTracebackPrompt(input);
    return output!;
  }
);
