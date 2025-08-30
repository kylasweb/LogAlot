
import React from 'react';
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FeatureToggleProvider } from "@/lib/feature-toggle-context";

export const metadata: Metadata = {
  title: 'LogAlot',
  description: 'Automated Error Analysis using AI',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <FeatureToggleProvider>
          <>
            {children}
            <Toaster />
          </>
        </FeatureToggleProvider>
      </body>
    </html>
  );
}
