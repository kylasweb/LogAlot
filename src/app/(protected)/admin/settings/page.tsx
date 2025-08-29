
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Badge } from "@/components/ui/badge";

interface Setting {
    key: string;
    description: string;
    type: 'secret' | 'model';
    isManaged?: boolean;
    value?: string;
    options?: { value: string; label: string; recommended?: boolean }[];
}

const settingsConfig: { group: string, settings: Setting[] }[] = [
  {
    group: "Gemini",
    settings: [
      {
        key: "gemini_api_key",
        description: "API key for Gemini services, managed via .env file.",
        type: 'secret',
        isManaged: true,
      },
      {
        key: "gemini_model",
        description: "Default model for analysis.",
        type: 'model',
        value: "gemini-2.5-flash",
        options: [
            { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash", recommended: true },
            { value: "gemini-2.5-pro", label: "Gemini 2.5 Pro" },
            { value: "gemini-2.0-pro", label: "Gemini 2.0 Pro" },
        ]
      },
    ],
  },
  {
    group: "Groq",
    settings: [
      {
        key: "groq_api_key",
        description: "API key for Groq services, managed via .env file.",
        type: 'secret',
        isManaged: true,
      },
      {
        key: "groq_model",
        description: "Default model for analysis.",
        type: 'model',
        value: "llama3-70b-8192",
        options: [
            { value: "llama3-70b-8192", label: "Llama3 70b", recommended: true },
            { value: "llama3-8b-8192", label: "Llama3 8b" },
            { value: "mixtral-8x7b-32768", label: "Mixtral 8x7b" },
        ]
      },
    ],
  },
];

export default function SettingsPage() {
  return (
    <div className="flex flex-col h-full">
      <header className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 sticky top-0 z-10 bg-background border-b">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-xl font-headline font-semibold">
            Admin Settings
          </h1>
        </div>
        <UserMenu />
      </header>
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        <div className="mx-auto max-w-6xl">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">
                AI Provider Configuration
              </CardTitle>
              <CardDescription>
                Manage API keys and settings for various AI providers. Keys are stored securely and are not displayed here.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {settingsConfig.map((group) => (
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
  settings: Setting[];
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold font-headline mb-4">{group}</h3>
      <div className="space-y-4">
        {settings.map((setting) => (
          <SettingInput key={setting.key} setting={setting} />
        ))}
      </div>
    </div>
  );
}

function SettingInput({ setting }: { setting: Setting }) {
  const { key, description, type, isManaged, value, options } = setting;
  const [showSecret, setShowSecret] = useState(false);
  const { toast } = useToast();

  const handleTest = () => {
    toast({
      title: "Testing Key...",
      description: `Pinging ${key} endpoint.`,
    });
    // Mock API call to /api/settings/test
    setTimeout(() => {
      const success = Math.random() > 0.3;
      if (success) {
        toast({
          title: "Connection Successful",
          description: `The key for ${key} is valid.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Connection Failed",
          description: `The key for ${key} is invalid or the service is down.`,
        });
      }
    }, 1500);
  };

  const renderInput = () => {
    switch (type) {
        case 'secret':
            return (
                <div className="relative w-full">
                  <Input
                    id={key}
                    defaultValue={"••••••••••••••••"}
                    type={showSecret ? "text" : "password"}
                    readOnly
                    disabled={isManaged}
                  />
                  <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                      onClick={() => setShowSecret(!showSecret)}
                      disabled={isManaged}
                    >
                      {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
            );
        case 'model':
            return (
                <Select defaultValue={value} disabled={isManaged}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a model..." />
                    </SelectTrigger>
                    <SelectContent>
                        {options?.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                                <div className="flex items-center gap-2">
                                    <span>{option.label}</span>
                                    {option.recommended && <Badge variant="secondary">Recommended</Badge>}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )
    }
  }


  return (
    <div className="grid md:grid-cols-3 items-center gap-4">
      <div className="md:col-span-1">
        <Label htmlFor={key} className="font-medium">
          {key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
        </Label>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="md:col-span-2 flex items-center gap-2">
        {renderInput()}
        {type === 'secret' && (
          <Button variant="outline" size="icon" onClick={handleTest} disabled={isManaged}>
            <TestTube className="h-4 w-4" />
          </Button>
        )}
        <Button size="icon" disabled={isManaged}>
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
