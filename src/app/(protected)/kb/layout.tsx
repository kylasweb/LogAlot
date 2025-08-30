
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";

import React, { useContext } from "react";
import Link from "next/link";
import { FeatureToggleContext } from "@/lib/feature-toggle-context";

const kbNav = [
  { name: "Introduction", href: "/kb" },
  { name: "Guides", href: "/kb/guides", agentic: true },
  { name: "How to Use", href: "/kb/how-to-use", agentic: true },
  { name: "Logics Used", href: "/kb/logics-used", agentic: true },
  { name: "Template Explanations", href: "/kb/template-explanations", templates: true },
  { name: "Configurations", href: "/kb/configurations", agentic: true },
];


export default function KnowledgeBaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { toggles } = useContext(FeatureToggleContext);
  return (
    <div className="flex flex-col h-full">
      <header className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 sticky top-0 z-10 bg-background border-b">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-xl font-headline font-semibold">Knowledge Base</h1>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="grid md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Navigation</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <nav className="flex flex-col space-y-2">
                            {kbNav.filter(item => {
                              if (item.agentic && !toggles.agentic) return false;
                              if (item.templates && !toggles.templates) return false;
                              return true;
                            }).map((item) => (
                                <Button key={item.name} variant="ghost" className="justify-start" asChild>
                                    <Link href={item.href}>{item.name}</Link>
                                </Button>
                            ))}
                        </nav>
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-3">
                {children}
            </div>
        </div>
      </main>
    </div>
  );
}
