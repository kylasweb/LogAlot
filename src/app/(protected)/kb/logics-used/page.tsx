
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LogicsUsedPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Logics Used</CardTitle>
        <CardDescription>
          A look under the hood at the AI models and logic powering the analysis.
        </CardDescription>
      </CardHeader>
      <CardContent className="prose prose-stone dark:prose-invert max-w-none">
        <h3>AI Agentic Workflow</h3>
        <p>
          The analysis is performed by a team of specialized AI agents working in a sequence that you define. The <strong>Agentic Workflow Builder</strong> allows you to construct this sequence by dragging and dropping available agents. Each agent has a specific role, defined by its system instructions.
        </p>
        <p>
          The output of one agent is passed as context to the next, allowing for a cumulative and comprehensive analysis. For example:
        </p>
        <ul>
            <li><strong>Summarizer Agent:</strong> Reads the raw logs and creates a high-level summary. This summary is then passed on.</li>
            <li><strong>Traceback Agent:</strong> This agent receives the original log and the summary, then specifically parses stack traces to identify the exception type and key frames.</li>
            <li><strong>Solution Agent:</strong> It takes the summary and traceback analysis from the previous agents to propose a solution, including code snippets.</li>
        </ul>
        <p>You can create your own agents and workflows to match any process you need.</p>

        <h3>Confidence Scoring</h3>
        <p>
          The final confidence score in the report is a weighted average of the confidence scores returned by each individual agent in the active workflow. It represents the AI's overall confidence in the accuracy of its multi-step analysis.
        </p>
      </CardContent>
    </Card>
  );
}
