"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  FileCode,
  FlaskConical,
  Puzzle,
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  Zap,
} from "lucide-react";
import type { AnalysisReport } from "@/lib/types";

import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

function Markdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <SyntaxHighlighter
              style={a11yDark}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code className="bg-muted px-1 py-0.5 rounded-sm font-code" {...props}>
              {children}
            </code>
          );
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
      }}
      className="text-sm leading-relaxed"
    >
      {content}
    </ReactMarkdown>
  );
}

export function AnalysisDisplay({ report }: { report: AnalysisReport }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">
          Analysis Report
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
          <div className="flex flex-col items-center justify-center space-y-2 p-4 bg-secondary/50 rounded-lg">
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

        {report.traceback && (
          <Section
            icon={<AlertTriangle className="text-destructive" />}
            title="Traceback Summary"
          >
            <p className="font-mono text-sm bg-destructive/10 text-destructive p-3 rounded-md">
              {report.traceback.exceptionType}
            </p>
            <ul className="font-code text-xs space-y-1 mt-2 list-disc list-inside bg-muted/50 p-3 rounded-md">
              {report.traceback.relevantFrames.map((frame, i) => (
                <li key={i}>{frame}</li>
              ))}
            </ul>
          </Section>
        )}

        <Section icon={<Lightbulb />} title="AI Analysis">
          <Markdown content={report.analysis} />
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
      </CardContent>
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
      {children}
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
    <div className="flex flex-col items-center justify-center space-y-1 p-4 bg-secondary/50 rounded-lg">
      {React.cloneElement(icon as React.ReactElement, {
        className: "w-6 h-6 text-muted-foreground",
      })}
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}
