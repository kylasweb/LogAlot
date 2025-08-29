
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ConfigurationsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Configurations</CardTitle>
        <CardDescription>
          Information on configuring AI providers, agents, and other settings.
        </CardDescription>
      </CardHeader>
      <CardContent className="prose prose-stone dark:prose-invert max-w-none">
        <h3>AI Providers</h3>
        <p>
          You can configure different AI providers in the <strong>Admin Settings</strong> page. API keys are stored securely in a <code>.env</code> file and are not exposed to the client. You can also set default models for different providers.
        </p>

        <h3>Agent Hyper-parameters</h3>
        <p>
          For fine-grained control over your agents' behavior, navigate to <strong>Agentic {">"} Hyper-parameters</strong>. Here, you can adjust settings like `temperature` (randomness) and `top-p` (creativity) for each individual agent to tune their performance.
        </p>
        
        <h3>Connectors</h3>
        <p>
          Connectors are configured on the <strong>Connectors</strong> page. You will need to provide authentication details, such as API tokens or webhook URLs, to enable integrations with third-party services like Jira and Teams.
        </p>
      </CardContent>
    </Card>
  );
}
