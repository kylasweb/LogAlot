
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HowToUsePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">How to Use</CardTitle>
        <CardDescription>
          Detailed explanations of core platform features.
        </CardDescription>
      </CardHeader>
      <CardContent className="prose prose-stone dark:prose-invert max-w-none">
        <h3>The Log Analyzer Dashboard</h3>
        <p>
          The main dashboard is where you paste or upload log files. The AI will then process the logs based on the active workflow selected in the Agentic Workflow Manager. You can also apply a formatting template to the final report.
        </p>
        
        <h3>Agentic Workflow Manager</h3>
        <p>
          This is the central hub for controlling your AI analysis pipelines. You can create and edit individual agents, defining their models and system instructions. The Workflow Builder allows you to chain these agents together in any order to form a custom analysis process.
        </p>

        <h3>Fine-Tuning, A/B Testing, and Hyper-parameters</h3>
        <p>
          Under the "Agentic" menu, you'll find advanced options. <strong>Fine-Tuning</strong> lets you train agents on your data. <strong>A/B Testing</strong> allows you to compare two versions of an agent's prompt or model. <strong>Hyper-parameters</strong> gives you granular control over the AI's creativity and response generation.
        </p>

        <h3>Connectors</h3>
        <p>
            Connectors allow you to integrate LogAlot with third-party services like Jira, Microsoft Teams, and GitHub to streamline your workflow after an analysis is complete.
        </p>
      </CardContent>
    </Card>
  );
}
