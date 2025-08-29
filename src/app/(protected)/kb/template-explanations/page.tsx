
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TemplateExplanationsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Template Explanations</CardTitle>
        <CardDescription>
          A breakdown of each analysis template and its intended use case.
        </CardDescription>
      </CardHeader>
      <CardContent className="prose prose-stone dark:prose-invert max-w-none">
        <h3>Postmortem Report</h3>
        <p>
          Use this template to generate a formal postmortem document suitable for incident reviews. It structures the output into standard sections like Summary, Impact, and Action Items.
        </p>

        <h3>Developer Bug Report</h3>
        <p>
          This template formats the analysis into a bug report that can be directly used by a development team. It focuses on technical details, steps to reproduce, and code pointers.
        </p>

        <h3>Customer Support Response</h3>
        <p>
            This template drafts an empathetic and non-technical response for a customer who may have been affected by the error.
        </p>
      </CardContent>
    </Card>
  );
}
