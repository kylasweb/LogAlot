
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
        <h3>The Log Analyzer</h3>
        <p>
          The main log analyzer interface is where you can paste or upload log files. The AI will then process the logs based on the selected template.
        </p>

        <h3>Analysis Report</h3>
        <p>
          The analysis report provides a comprehensive breakdown of the AI's findings, including a summary, root cause analysis, proposed solution, and more.
        </p>

        <h3>Connectors</h3>
        <p>
            Connectors allow you to integrate LogAlot with third-party services like Jira, Microsoft Teams, and GitHub to streamline your workflow.
        </p>
      </CardContent>
    </Card>
  );
}
