
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
  SidebarRail,
  SidebarMenuSub,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Settings, LayoutDashboard, Link2, BookOpen, Bot, BrainCircuit } from "lucide-react";
import { Logo } from "@/components/icons";

export function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar collapsible="icon">
          <SidebarHeader className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 px-2">
              <Logo className="w-8 h-8 text-primary" />
              <span className="font-headline text-lg font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                LogAlot
              </span>
            </Link>
            <SidebarTrigger className="hidden md:flex" />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/"}
                  tooltip={{ children: "Dashboard" }}
                >
                  <Link href="/">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith("/agentic")}
                  tooltip={{ children: "Agentic" }}
                >
                  <Link href="/agentic">
                    <Bot />
                    <span>Agentic</span>
                  </Link>
                </SidebarMenuButton>
                 <SidebarMenuSub>
                  <li>
                    <SidebarMenuSubButton asChild isActive={pathname.startsWith("/agentic/fine-tuning")}>
                        <Link href="/agentic/fine-tuning"><BrainCircuit /> Fine-Tuning</Link>
                    </SidebarMenuSubButton>
                  </li>
                 </SidebarMenuSub>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith("/kb")}
                  tooltip={{ children: "Knowledge Base" }}
                >
                  <Link href="/kb">
                    <BookOpen />
                    <span>Knowledge Base</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith("/admin")}
                  tooltip={{ children: "Settings" }}
                >
                  <Link href="/admin/settings">
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith("/connectors")}
                  tooltip={{ children: "Connectors" }}
                >
                  <Link href="/connectors">
                    <Link2 />
                    <span>Connectors</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
        <SidebarInset>{children}</SidebarInset>
      </div>
    </SidebarProvider>
  );
}
