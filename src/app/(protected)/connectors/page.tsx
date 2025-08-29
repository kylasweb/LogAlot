
"use client";

import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { LogOut, Save, TestTube, Eye, EyeOff, Link2, GitBranch, Briefcase } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const connectors = [
  {
    name: "Microsoft Teams",
    icon: <Briefcase className="w-6 h-6" />,
    description: "Send analysis reports directly to your Teams channels.",
    fields: [
      {
        key: "teams_webhook_url",
        label: "Webhook URL",
        type: "password",
        placeholder: "https://your-tenant.webhook.office.com/...",
      },
    ],
  },
  {
    name: "Jira / TFS",
    icon: <Briefcase className="w-6 h-6" />,
    description: "Create and update tickets in Jira or TFS.",
    fields: [
      { key: "jira_url", label: "Jira/TFS URL", type: "text", placeholder: "https://your-company.atlassian.net" },
      { key: "jira_user", label: "Username", type: "text", placeholder: "devops@your-company.com" },
      { key: "jira_api_token", label: "API Token", type: "password", placeholder: "Enter your API Token" },
    ],
  },
  {
    name: "GitHub",
    icon: <GitBranch className="w-6 h-6" />,
    description: "Create issues or push code suggestions to GitHub.",
    fields: [
      { key: "github_token", label: "Personal Access Token", type: "password", placeholder: "Enter your GitHub PAT" },
      { key: "github_repo", label: "Default Repository", type: "text", placeholder: "owner/repo-name" },
    ],
  },
];

export default function ConnectorsPage() {
  return (
    <div className="flex flex-col h-full">
      <header className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 sticky top-0 z-10 bg-background border-b">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-xl font-headline font-semibold">
            Connectors
          </h1>
        </div>
        <UserMenu />
      </header>
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        <div className="mx-auto max-w-6xl space-y-6">
          {connectors.map((connector) => (
            <Card key={connector.name} className="neo-outset">
              <CardHeader className="flex flex-row items-center gap-4">
                {connector.icon}
                <div>
                  <CardTitle className="font-headline">{connector.name}</CardTitle>
                  <CardDescription>{connector.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {connector.fields.map((field) => (
                  <ConnectorInput key={field.key} {...field} />
                ))}
                <div className="flex justify-end gap-2">
                  <Button variant="outline" className="neo-button">
                    <TestTube className="mr-2" /> Test
                  </Button>
                  <Button className="neo-button">
                    <Save className="mr-2" /> Save
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}

function ConnectorInput({
  label,
  type,
  placeholder,
}: {
  label: string;
  type: string;
  placeholder: string;
}) {
    const [showSecret, setShowSecret] = useState(false);
    const isSecret = type === 'password';

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="relative">
        <Input type={isSecret && !showSecret ? "password" : "text"} placeholder={placeholder} className="neo-inset" />
        {isSecret && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => setShowSecret(!showSecret)}
            >
              {showSecret ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          )}
      </div>
    </div>
  );
}


function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full neo-button">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src="https://picsum.photos/100"
              alt="User Avatar"
              data-ai-hint="person face"
            />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 neo-outset" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Admin User</p>
            <p className="text-xs leading-none text-muted-foreground">
              admin@example.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link2 className="mr-2 h-4 w-4" />
          <span>Connectors</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
