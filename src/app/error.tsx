
"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-lg text-center neo-outset">
        <CardHeader>
          <div className="mx-auto bg-destructive/20 text-destructive p-3 rounded-full w-fit">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <CardTitle className="mt-4 font-headline text-2xl">
            Oops! Something went wrong.
          </CardTitle>
          <CardDescription>
            An unexpected error occurred. We've been notified and are looking into it.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-md neo-inset text-left">
            <p className="text-sm font-semibold">Error Details:</p>
            <pre className="mt-2 text-xs font-code text-destructive whitespace-pre-wrap">
              {error.message || "An unknown error occurred."}
            </pre>
          </div>
          <Button
            onClick={() => reset()}
            className="neo-button"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
