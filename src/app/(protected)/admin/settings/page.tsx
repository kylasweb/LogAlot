
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
import { LogOut, Save, TestTube, Eye, EyeOff } from "lucide-react";
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

const mockSettings = [
  {
    group: "Gemini",
    settings: [
      {
        key: "gemini_api_key",
        value: "gsk-...",
        description: "API key for Gemini services.",
      },
      {
        key: "gemini_model",
        value: "gemini-2.5-flash",
        description: "Default model for analysis.",
      },
    ],
  },
  {
    group: "OpenAI",
    settings: [
      {
        key: "openai_api_key",
        value: "sk-...",
        description: "API key for OpenAI services.",
      },
      {
        key: "openai_model",
        value: "gpt-4-turbo",
        description: "Default model for analysis.",
      },
    ],
  },
  {
    group: "Groq",
    settings: [
      {
        key: "groq_api_key",
        value: "gsk-...",
        description: "API key for Groq services.",
      },
      {
        key: "groq_model",
        value: "llama3-70b-8192",
        description: "Default model for analysis.",
      },
    ],
  },
  {
    group: "HuggingFace",
    settings: [
      {
        key: "huggingface_api_key",
        value: "hf-...",
        description: "API key for HuggingFace Inference.",
      },
      {
        key: "huggingface_model",
        value: "mistralai/Mistral-7B-Instruct-v0.2",
        description: "Default model for analysis.",
      },
    ],
  },
];

export default function SettingsPage() {
  return (
    <div className="flex flex-col h-full">
      <header className="flex h-16 items-center justify-between gap-4 border-b bg-card px-4 sm:px-6 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-xl font-headline font-semibold">
            Admin Settings
          </h1>
        </div>
        <UserMenu />
      </header>
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        <div className="mx-auto max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">
                AI Provider Configuration
              </CardTitle>
              <CardDescription>
                Manage API keys and settings for various AI providers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {mockSettings.map((group) => (
                <SettingsGroup key={group.group} {...group} />
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

function SettingsGroup({
  group,
  settings,
}: {
  group: string;
  settings: { key: string; value: string; description: string }[];
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold font-headline mb-4">{group}</h3>
      <div className="space-y-4">
        {settings.map(({ key, ...settingProps }) => (
          <SettingInput key={key} settingKey={key} {...settingProps} />
        ))}
      </div>
    </div>
  );
}

function SettingInput({
  settingKey,
  value,
  description,
}: {
  settingKey: string;
  value: string;
  description: string;
}) {
  const isSecret = settingKey.includes("api_key");
  const [showSecret, setShowSecret] = useState(false);
  const { toast } = useToast();

  const handleTest = () => {
    toast({
      title: "Testing Key...",
      description: `Pinging ${settingKey} endpoint.`,
    });
    // Mock API call to /api/settings/test
    setTimeout(() => {
      const success = Math.random() > 0.3;
      if (success) {
        toast({
          title: "Connection Successful",
          description: `The key for ${settingKey} is valid.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Connection Failed",
          description: `The key for ${settingKey} is invalid or the service is down.`,
        });
      }
    }, 1500);
  };

  return (
    <div className="grid md:grid-cols-3 items-center gap-4">
      <div className="md:col-span-1">
        <Label htmlFor={settingKey} className="font-medium">
          {settingKey}
        </Label>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="md:col-span-2 flex items-center gap-2">
        <div className="relative w-full">
          <Input
            id={settingKey}
            defaultValue={value}
            type={isSecret && !showSecret ? "password" : "text"}
          />
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
        {isSecret && (
          <Button variant="outline" size="icon" onClick={handleTest}>
            <TestTube className="h-4 w-4" />
          </Button>
        )}
        <Button size="icon">
          <Save className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
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
      <DropdownMenuContent className="w-56" align="end" forceMount>
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
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
