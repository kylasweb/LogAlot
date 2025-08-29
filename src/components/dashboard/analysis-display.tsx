
"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  FileCode,
  FlaskConical,
  Puzzle,
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  Zap,
  Briefcase,
  GitBranch,
  ShieldCheck,
  TrendingUp,
  Siren,
  Activity,
  Users,
  Code,
  TestTube
} from "lucide-react";
import type { AnalysisReport } from "@/lib/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import ReactMarkdown, { type Components } from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { useToast } from "@/hooks/use-toast";


const team = [
  { name: "Anu", title: "Project Lead", icon: <Briefcase /> },
  { name: "Akhil", title: "Senior Developer", icon: <Code /> },
  { name: "Shincy", title: "QA Engineer", icon: <TestTube /> },
];


const markdownComponents: Components = {
    code(props) {
        const {children, className, node, ...rest} = props
        const match = /language-(\w+)/.exec(className || '')
        return match ? (
            <SyntaxHighlighter
                style={a11yDark}
                language={match[1]}
                PreTag="div"
            >
            {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
        ) : (
            <code {...rest} className="bg-muted px-1 py-0.5 rounded-sm font-code">
                {children}
            </code>
        )
    },
    p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
    ul: ({ node, ...props }) => (
      <ul className="list-disc pl-5 space-y-1 my-2" {...props} />
    ),
    ol: ({ node, ...props }) => (
      <ol className="list-decimal pl-5 space-y-1 my-2" {...props} />
    ),
    h3: ({ node, ...props }) => (
      <h3
        className="font-headline text-lg font-semibold mt-4 mb-2"
        {...props}
      />
    ),
}

function Markdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={markdownComponents}
      className="text-sm leading-relaxed"
    >
      {content}
    </ReactMarkdown>
  );
}

export function AnalysisDisplay({ report }: { report: AnalysisReport }) {
  const { toast } = useToast();
  
  const handleShare = (platform: string) => {
    toast({
      title: `Sending to ${platform}...`,
      description: `Your analysis report is being sent.`,
    });
  }

  return (
    <Card className="w-full neo-outset">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">
          Comprehensive AI Analysis Report
        </CardTitle>
        <CardDescription>
          Generated on {new Date(report.timestamp).toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <InfoBox
            icon={<Puzzle />}
            label="Tech Stack"
            value={report.techStack}
          />
          <InfoBox
            icon={<FlaskConical />}
            label="Environment"
            value={report.environment}
          />
          <InfoBox
            icon={<Zap />}
            label="Confidence"
            value={`${(report.confidenceScore * 100).toFixed(0)}%`}
          />
          <div className="flex flex-col items-center justify-center space-y-2 p-4 bg-secondary/50 rounded-lg neo-inset">
            <div className="flex gap-2">
              {report.needsFix && (
                <Badge variant="destructive">Fix Required</Badge>
              )}
              {report.isIntermittent && (
                <Badge variant="secondary">Intermittent</Badge>
              )}
            </div>
          </div>
        </div>

        <Separator />
        
        <Section icon={<Lightbulb />} title="Executive Summary">
          <Markdown content={report.summary} />
        </Section>
        
        <Separator />
        <Section icon={<Users />} title="Analyzed by">
            <div className="flex space-x-6">
                {team.map((member) => (
                    <TeamAvatar key={member.name} name={member.name} title={member.title} icon={member.icon} />
                ))}
            </div>
        </Section>

        {report.traceback && (
          <>
            <Separator />
            <Section
              icon={<Siren className="text-destructive" />}
              title="Traceback Analysis"
            >
              <p className="font-mono text-sm bg-destructive/10 text-destructive p-3 rounded-md neo-inset">
                {report.traceback.exceptionType}
              </p>
              <h4 className="font-headline text-md font-semibold mt-4 mb-2">Detailed Flow Analysis</h4>
              <Markdown content={report.traceback.analysis} />
              <h4 className="font-headline text-md font-semibold mt-4 mb-2">Relevant Frames</h4>
              <ul className="font-code text-xs space-y-1 mt-2 list-disc list-inside bg-muted/50 p-3 rounded-md neo-inset">
                {report.traceback.relevantFrames.map((frame, i) => (
                  <li key={i}>{frame}</li>
                ))}
              </ul>
            </Section>
          </>
        )}

        <Separator />
        <Section icon={<Activity />} title="Root Cause Analysis">
          <Markdown content={report.rootCause} />
        </Section>

        <Separator />
        <Section icon={<TrendingUp />} title="Business Impact Assessment">
          <Markdown content={report.impact} />
        </Section>

        <Separator />
        <Section icon={<FileCode />} title="Proposed Solution">
          <Markdown content={report.proposedSolution.description} />
          <div className="mt-4">
            <Markdown content={report.proposedSolution.code} />
          </div>
        </Section>

        <Separator />
        <Section icon={<CheckCircle />} title="Verification Steps">
          <Markdown content={report.verification} />
        </Section>
        
        <Separator />
        <Section icon={<ShieldCheck />} title="Prevention Recommendations">
          <Markdown content={report.prevention} />
        </Section>

      </CardContent>
      <CardFooter className="gap-2 justify-end">
          <Button variant="outline" className="neo-button" onClick={() => handleShare('Teams')}>
              <Briefcase className="mr-2" /> Send to Teams
          </Button>
          <Button variant="outline" className="neo-button" onClick={() => handleShare('Jira')}>
              <Briefcase className="mr-2" /> Create Jira Ticket
          </Button>
          <Button variant="outline" className="neo-button" onClick={() => handleShare('GitHub')}>
              <GitBranch className="mr-2" /> Push to GitHub
          </Button>
      </CardFooter>
    </Card>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="font-headline text-lg font-semibold flex items-center gap-2 mb-3">
        {React.cloneElement(icon as React.ReactElement, {
          className: "w-5 h-5",
        })}
        {title}
      </h3>
      <div className="pl-7">
        {children}
      </div>
    </div>
  );
}

function InfoBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center space-y-1 p-4 bg-secondary/50 rounded-lg neo-inset">
      {React.cloneElement(icon as React.ReactElement, {
        className: "w-6 h-6 text-muted-foreground",
      })}
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}


function TeamAvatar({ name, title, icon }: { name: string, title: string, icon: React.ReactNode }) {
    return (
        <div className="flex items-center gap-3">
            <Avatar>
                <AvatarFallback className="bg-secondary text-secondary-foreground">
                    {React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5" })}
                </AvatarFallback>
            </Avatar>
            <div>
                <p className="font-semibold text-sm">{name}</p>
                <p className="text-xs text-muted-foreground">{title}</p>
            </div>
        </div>
    )
}
