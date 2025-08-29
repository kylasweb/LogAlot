
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
          The analysis is performed by a team of specialized AI agents. Each agent has a specific role:
        </p>
        <ul>
            <li><strong>Summarizer Agent:</strong> Reads the raw logs and creates a high-level summary.</li>
            <li><strong>Traceback Agent:</strong> If enabled, this agent specifically parses stack traces to identify the exception type and key frames.</li>
            <li><strong>Solution Agent:</strong> Takes the analysis from the other agents and proposes a solution, including code snippets.</li>
        </ul>

        <h3>Confidence Scoring</h3>
        <p>
          The confidence score is a weighted average of the confidence scores from each agent in the workflow. It represents the AI's confidence in the accuracy of its analysis.
        </p>
      </CardContent>
    </Card>
  );
}
