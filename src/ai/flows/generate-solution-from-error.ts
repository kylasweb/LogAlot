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
  solution: z.string().describe('A potential solution to the error, including a code snippet if applicable.'),
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

  Based on the provided error analysis, tech stack, environment, and traceback (if available), you will generate a potential solution to the error. The solution should include a code snippet if applicable.

  Error Analysis: {{{analysis}}}
  Tech Stack: {{{techStack}}}
  Environment: {{{environment}}}
  Traceback: {{{traceback}}}

  Provide a confidence score (0-1) indicating the likelihood that the solution will resolve the issue.
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
