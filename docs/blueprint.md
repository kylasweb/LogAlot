# **App Name**: Error Insights AI

## Core Features:

- Log Ingestion: Ingest logs from various sources and formats.
- AI-Powered Analysis: Utilize multiple AI providers to analyze logs and produce structured reports.
- Structured Report Generation: Generate markdown reports with Analysis, Proposed Solutions (including code snippets), and Verification sections. Tool for integrating or not tracebacks into the markdown.
- Admin UI: Provide an admin interface to manage provider keys and settings with role-based access control.
- Secure Key Storage: Securely store and rotate API keys using AES-256-GCM encryption.
- Alerting System: Implement an alerting system for persistent analysis failures, without logging sensitive API keys.
- Provider Configuration: Fetch provider defaults from a database (with encryption) and fallback to edge configuration.

## Style Guidelines:

- Primary color: Deep purple (#6750A4) for a sophisticated, intelligent feel. Purple symbolizes insight and knowledge.
- Background color: Very light gray (#F2F0F7), a desaturated version of the primary hue to give prominence to the primary elements.
- Accent color: Lavender (#D0BCFF), a lighter, less saturated analogous hue to the primary, for secondary buttons and details.
- Headline font: 'Space Grotesk' (sans-serif) for headlines, providing a modern, techy feel. Body Font: 'Inter' (sans-serif)
- Use lucide-react icons for a clean and consistent look.
- Employ a clean and structured layout using Radix UI primitives.
- Subtle transitions and animations to enhance user experience.