
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TemplateExplanationsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Formatting Templates</CardTitle>
        <CardDescription>
          A breakdown of how formatting templates structure the final report.
        </CardDescription>
      </CardHeader>
      <CardContent className="prose prose-stone dark:prose-invert max-w-none">
        <p>
          Formatting templates are applied <strong>after</strong> the AI Agentic Workflow has completed its analysis. Their purpose is to structure the generated information for a specific audience or use case. The templates themselves do not perform analysis; they only format the results.
        </p>

        <h3>Postmortem Report</h3>
        <p>
          Use this template to generate a formal postmortem document suitable for incident reviews. It takes the AI-generated summary, root cause, and solution and organizes them into standard sections like Summary, Impact, and Action Items.
        </p>

        <h3>Developer Bug Report</h3>
        <p>
          This template formats the analysis into a bug report that can be directly used by a development team. It focuses on technical details, steps to reproduce, and code pointers, pulling the relevant information from the agent workflow output.
        </p>

        <h3>Customer Support Response</h3>
        <p>
            This template helps draft an empathetic and non-technical response for a customer. It uses the summary provided by the agents to generate a reassuring message.
        </p>
      </CardContent>
    </Card>
  );
}
