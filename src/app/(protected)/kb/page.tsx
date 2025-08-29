
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function KnowledgeBasePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Welcome to the Knowledge Base</CardTitle>
        <CardDescription>
          Your central hub for documentation, guides, and technical explanations.
        </CardDescription>
      </CardHeader>
      <CardContent className="prose prose-stone dark:prose-invert max-w-none">
        <p>
          This knowledge base is designed to help you get the most out of the LogAlot platform.
          Whether you're a new user getting started or an experienced engineer looking for advanced configurations,
          you'll find valuable information here.
        </p>
        <p>
          Use the navigation on the left to explore the different sections:
        </p>
        <ul>
          <li><strong>Guides:</strong> Step-by-step tutorials for common tasks.</li>
          <li><strong>How to Use:</strong> Detailed explanations of core features.</li>
          <li><strong>Logics Used:</strong> A look under the hood at the AI and system logic.</li>
          <li><strong>Template Explanations:</strong> Breakdowns of the various analysis templates.</li>
          <li><strong>Configurations:</strong> Information on how to configure AI providers and connectors.</li>
        </ul>
        <p>
          We are constantly updating this documentation. If you have any questions or can't find what you're looking for,
          please don't hesitate to reach out to our support team.
        </p>
      </CardContent>
    </Card>
  );
}
