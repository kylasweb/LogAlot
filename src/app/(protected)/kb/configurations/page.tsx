
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ConfigurationsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Configurations</CardTitle>
        <CardDescription>
          Information on configuring AI providers and other settings.
        </CardDescription>
      </CardHeader>
      <CardContent className="prose prose-stone dark:prose-invert max-w-none">
        <h3>AI Providers</h3>
        <p>
          You can configure different AI providers in the Admin Settings page. API keys are stored securely in a <code>.env</code> file and are not exposed to the client.
        </p>
        
        <h3>Connectors</h3>
        <p>
          Connectors are configured on the Connectors page. You will need to provide authentication details, such as API tokens or webhook URLs, to enable integrations.
        </p>
      </CardContent>
    </Card>
  );
}
