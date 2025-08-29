export const templates = [
  {
    id: 'postmortem-report',
    name: 'Postmortem Report',
    prompt: `
Generate a detailed postmortem report for a DevOps audience.

Structure the output into the following sections:
- **Summary**: A high-level overview of the incident.
- **Impact**: What was the user-facing impact? Which services were affected?
- **Root Cause**: A deep dive into the technical cause of the issue.
- **Resolution**: What steps were taken to mitigate and resolve the incident?
- **Action Items**: What are the concrete follow-up actions to prevent this from happening again?

Analyze the provided logs and context to fill in these sections.
`,
  },
  {
    id: 'incident-response',
    name: 'Incident Response Playbook',
    prompt: `
Create an incident response playbook for the given error.

The playbook should include:
- **Triage Steps**: Initial steps to validate and assess the alert.
- **Escalation Path**: Who should be contacted and in what order?
- **Diagnostic Queries**: What commands or queries should be run to gather more information?
- **Mitigation Actions**: Short-term fixes to stabilize the system.
- **Communication Template**: A pre-written message for status pages or stakeholders.
`,
  },
  {
    id: 'sre-ticket',
    name: 'SRE Ticket Template',
    prompt: `
Format the analysis as a ticket for a Site Reliability Engineering (SRE) team.

Include these fields:
- **Title**: A concise, descriptive title of the problem.
- **Priority**: (P0, P1, P2, P3) - Assess based on impact.
- **Description**: A summary of the issue and its business impact.
- **Technical Details**: Include relevant log snippets, tracebacks, and error messages.
- **Suggested Owner**: Which team or individual is likely responsible for this area?
`,
  },
  {
    id: 'developer-bug-report',
    name: 'Developer Bug Report',
    prompt: `
Generate a bug report for a software development team.

The report should contain:
- **Title**: Clear and concise bug title.
- **Steps to Reproduce**: If possible to infer, what sequence of events led to the error?
- **Expected Behavior**: What should have happened?
- **Actual Behavior**: What actually happened?
- **Code Pointer**: Suggest the specific file and line number where the issue might be.
- **Proposed Fix**: If you have a high-confidence solution, provide a code snippet.
`,
  },
  {
    id: 'security-vulnerability',
    name: 'Security Vulnerability Brief',
    prompt: `
Analyze the logs from a security perspective and generate a vulnerability brief.

If a potential vulnerability is detected, the brief must include:
- **Vulnerability Name**: (e.g., SQL Injection, Cross-Site Scripting).
- **CVE (if applicable)**: If the pattern matches a known CVE, identify it.
- **Severity**: (Critical, High, Medium, Low) - Based on potential impact.
- **Description**: Explain the vulnerability and how it could be exploited.
- **Affected Component**: The service or code module that is vulnerable.
- **Remediation Steps**: Specific instructions on how to patch the vulnerability.
If no vulnerability is found, state that clearly.
`,
  },
];
