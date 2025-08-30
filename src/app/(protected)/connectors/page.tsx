"use client";

import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Eye, EyeOff, GitBranch, Briefcase } from "lucide-react";

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

interface ConnectorInputProps {
	label: string;
	type: string;
	placeholder: string;
	value: string;
	onChange: (val: string) => void;
}

function ConnectorInput({ label, type, placeholder, value, onChange }: ConnectorInputProps) {
	const [showSecret, setShowSecret] = useState(false);
	const isSecret = type === "password";
	return (
		<div className="space-y-2">
			<Label>{label}</Label>
			<div className="relative">
				<Input
					type={isSecret && !showSecret ? "password" : "text"}
					placeholder={placeholder}
					className="neo-inset"
					value={value}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
				/>
				{isSecret && (
					<Button
						variant="ghost"
						size="icon"
						className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
						onClick={() => setShowSecret(!showSecret)}
					>
						{showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
					</Button>
				)}
			</div>
		</div>
	);
}

export default function ConnectorsPage() {
	const [configs, setConfigs] = useState(() => {
		if (typeof window !== "undefined") {
			const saved = localStorage.getItem("connectorConfigs");
			return saved ? JSON.parse(saved) : {};
		}
		return {};
	});

	const saveConfigs = () => {
		localStorage.setItem("connectorConfigs", JSON.stringify(configs));
	};

	const handleChange = (connectorName: string, fieldKey: string, value: string) => {
		setConfigs((prev: any) => ({
			...prev,
			[connectorName]: {
				...prev[connectorName],
				[fieldKey]: value,
			},
		}));
	};

	return (
		<div className="flex flex-col h-full">
			<header className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 sticky top-0 z-10 bg-background border-b">
				<div className="flex items-center gap-2">
					<SidebarTrigger className="md:hidden" />
					<h1 className="text-xl font-headline font-semibold">Connectors</h1>
				</div>
			</header>
			<main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
				<div className="mx-auto max-w-6xl space-y-6">
					<Card className="neo-outset">
						<CardHeader>
							<CardTitle className="font-headline">Configuration Guide</CardTitle>
							<CardDescription>Instructions for finding the required credentials for each service.</CardDescription>
						</CardHeader>
						<CardContent>
							<Accordion type="single" collapsible className="w-full">
								<AccordionItem value="teams">
									<AccordionTrigger>Microsoft Teams Webhook URL</AccordionTrigger>
									<AccordionContent className="prose prose-stone dark:prose-invert max-w-none">
										<ol>
											<li>Navigate to the Teams channel where you want to receive notifications.</li>
											<li>Click on the three dots (More options) next to the channel name and select <strong>Connectors</strong>.</li>
											<li>Find <strong>Incoming Webhook</strong> and click <strong>Configure</strong>.</li>
											<li>Provide a name for the webhook (e.g., "LogAlot Alerts") and click <strong>Create</strong>.</li>
											<li>Copy the generated Webhook URL and paste it into the field below.</li>
										</ol>
									</AccordionContent>
								</AccordionItem>
								<AccordionItem value="jira">
									<AccordionTrigger>Jira API Token</AccordionTrigger>
									<AccordionContent className="prose prose-stone dark:prose-invert max-w-none">
										<ol>
											<li>Log in to your Atlassian account that has Jira access.</li>
											<li>Go to <a href="https://id.atlassian.com/manage-profile/security/api-tokens" target="_blank" rel="noopener noreferrer">API Tokens</a> in your profile settings.</li>
											<li>Click <strong>Create API token</strong>.</li>
											<li>Give your token a descriptive label (e.g., "LogAlot-Integration").</li>
											<li>Copy the token immediately and paste it into the field below. You won't be able to see it again.</li>
										</ol>
									</AccordionContent>
								</AccordionItem>
								<AccordionItem value="github">
									<AccordionTrigger>GitHub Personal Access Token (PAT)</AccordionTrigger>
									<AccordionContent className="prose prose-stone dark:prose-invert max-w-none">
										<ol>
											<li>Go to your GitHub account settings and navigate to <strong>Developer settings</strong> {">"} <strong>Personal access tokens</strong> {">"} <strong>Tokens (classic)</strong>.</li>
											<li>Click <strong>Generate new token</strong> and select "Generate new token (classic)".</li>
											<li>Give the token a descriptive name and select the necessary scopes. For creating issues, you will need the <strong>repo</strong> scope.</li>
											<li>Click <strong>Generate token</strong>.</li>
											<li>Copy the token and paste it into the field below. Store it securely.</li>
										</ol>
									</AccordionContent>
								</AccordionItem>
							</Accordion>
						</CardContent>
					</Card>
					{connectors.map(connector => (
						<Card key={connector.name} className="neo-outset">
							<CardHeader className="flex flex-row items-center gap-4">
								{connector.icon}
								<div>
									<CardTitle className="font-headline">{connector.name}</CardTitle>
									<CardDescription>{connector.description}</CardDescription>
								</div>
							</CardHeader>
							<CardContent className="space-y-4">
								{connector.fields.map(field => (
									<ConnectorInput
										key={field.key}
										{...field}
										value={configs[connector.name]?.[field.key] || ""}
										onChange={val => handleChange(connector.name, field.key, val)}
									/>
								))}
								<div className="flex justify-end gap-2">
									<Button variant="outline" className="neo-button">
										Test
									</Button>
									<Button className="neo-button" onClick={saveConfigs}>
										Save
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
