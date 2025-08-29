'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating a potential solution (including code snippet) based on the error analysis.
 *
 * - generateSolutionFromError - A function that generates a potential solution based on the error analysis.
 * - GenerateSolutionFromErrorInput - The input type for the generateSolutionFromError function.
 * - GenerateSolutionFromErrorOutput - The return type for the generateSolutionFromError function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSolutionFromErrorInputSchema = z.object({
  analysis: z.string().describe('The error analysis generated from the logs.'),
  techStack: z.string().describe('The tech stack used in the application.'),
  environment: z.string().describe('The environment where the error occurred.'),
  traceback: z.string().optional().describe('The traceback of the error, if available.'),
});
export type GenerateSolutionFromErrorInput = z.infer<typeof GenerateSolutionFromErrorInputSchema>;

const GenerateSolutionFromErrorOutputSchema = z.object({
  solutionDescription: z.string().describe('A detailed explanation of the proposed solution.'),
  solutionCode: z.string().describe('A code snippet demonstrating the fix. Use markdown for the code block.'),
  verificationSteps: z.string().describe('Steps to verify that the fix has resolved the issue.'),
  prevention: z.string().describe('Recommendations for preventing similar issues in the future.'),
  confidenceScore: z.number().describe('A confidence score (0-1) indicating the likelihood that the solution will resolve the issue.'),
});
export type GenerateSolutionFromErrorOutput = z.infer<typeof GenerateSolutionFromErrorOutputSchema>;

export async function generateSolutionFromError(input: GenerateSolutionFromErrorInput): Promise<GenerateSolutionFromErrorOutput> {
  return generateSolutionFromErrorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSolutionFromErrorPrompt',
  input: {schema: GenerateSolutionFromErrorInputSchema},
  output: {schema: GenerateSolutionFromErrorOutputSchema},
  prompt: `You are an expert software engineer specializing in debugging and resolving errors.

  Based on the provided error analysis, tech stack, environment, and traceback (if available), you will generate a potential solution to the error.

  Your response must include:
  1.  A detailed explanation of the proposed fix.
  2.  A code snippet (in a markdown block) demonstrating the fix.
  3.  A set of steps to verify that the fix works as expected.
  4.  Recommendations for long-term prevention of this class of errors.
  5.  A confidence score (0-1) indicating the likelihood that your proposed solution will resolve the issue.

  Error Analysis: {{{analysis}}}
  Tech Stack: {{{techStack}}}
  Environment: {{{environment}}}
  Traceback: {{{traceback}}}
  `,
});

const generateSolutionFromErrorFlow = ai.defineFlow(
  {
    name: 'generateSolutionFromErrorFlow',
    inputSchema: GenerateSolutionFromErrorInputSchema,
    outputSchema: GenerateSolutionFromErrorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
