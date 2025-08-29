
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function GuidesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Guides</CardTitle>
        <CardDescription>
          Step-by-step tutorials to help you accomplish specific tasks.
        </CardDescription>
      </CardHeader>
      <CardContent className="prose prose-stone dark:prose-invert max-w-none">
        <h3>Analyzing Your First Log File</h3>
        <p>
          This guide will walk you through the process of submitting your first log file for analysis, from pasting the content to interpreting the results.
        </p>

        <h3>Setting Up a Jira Connector</h3>
        <p>
          Learn how to connect your LogAlot instance to Jira to automatically create bug reports and tickets from an AI analysis.
        </p>
        
        <h3>Creating a Custom Analysis Template</h3>
        <p>
            Find out how to create and use your own custom templates to guide the AI's analysis for your specific needs.
        </p>
      </CardContent>
    </Card>
  );
}
