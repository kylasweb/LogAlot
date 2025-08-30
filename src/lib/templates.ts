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
  {
    id: 'customer-support-response',
    name: 'Customer Support Response',
    prompt: `
Draft a response to a customer who reported being affected by this error.

The response should be empathetic and professional. It must include:
- **Acknowledgement**: Acknowledge the issue and apologize for the inconvenience.
- **Explanation**: A non-technical explanation of what went wrong.
- **Resolution**: Reassure the customer that the issue has been resolved or is being worked on.
- **Next Steps**: Inform them if there's anything they need to do (e.g., refresh the page, clear cache).
- **Contact Info**: Provide a way for them to get further help.
`,
  },
  {
    id: 'system-patch-notification',
    name: 'System Patch Notification',
    prompt: `
Write a system-wide notification about the deployment of a patch for this issue.

The notification should be targeted at internal stakeholders and include:
- **Change Summary**: A brief description of the fix being deployed.
- **Reason for Change**: Explain what incident or bug this patch addresses.
- **Deployment Window**: The date and time the patch will be deployed.
- **Expected Impact**: Note any expected downtime or service degradation during the deployment.
- **Rollback Plan**: Briefly describe the procedure to roll back the change if issues occur.
`,
  },
    {
    id: 'data-corruption-analysis',
    name: 'Data Corruption Analysis',
    prompt: `
Analyze the logs for signs of data corruption and generate a report for a database administration team.

The report should include:
- **Corruption Signature**: Describe the pattern or anomaly in the logs that suggests data corruption.
- **Affected Data**: Identify the specific tables, records, or documents that may be affected.
- **Blast Radius**: Estimate the scope of the potential data corruption.
- **Recovery Steps**: Suggest a plan to verify the corruption and restore the affected data from backups.
- **Data-Level Prevention**: Recommend schema changes, constraints, or validation rules to prevent recurrence.
`,
  },
  {
    id: 'executive-summary-brief',
    name: 'Executive Summary Brief',
    prompt: `
Generate a one-paragraph executive summary for a non-technical leadership audience.

The summary must include:
- **What Happened**: A simple, jargon-free explanation of the problem.
- **Business Impact**: How did this affect customers or the business?
- **Status**: Is the issue resolved? What is the current status?
- **Next Steps**: Briefly mention the plan to prevent future occurrences.
`,
  },
  {
    id: 'qa-regression-plan',
    name: 'QA Regression Plan',
    prompt: `
Create a regression testing plan for the Quality Assurance team based on the fix for this error.

The plan should include:
- **Test Objective**: What is the goal of this regression test?
- **Core Functionality to Test**: List the primary user flows or features that must be re-verified.
- **Edge Cases**: Identify potential edge cases related to the fix that should be tested.
- **Test Environment**: Specify the recommended environment and any required test data.
- **Success Criteria**: Define what constitutes a successful test run.
`,
  },
  {
    id: 'technical-debt-ticket',
    name: 'Technical Debt Ticket',
    prompt: `
Format the analysis as a technical debt ticket for backlog grooming.

The ticket should include:
- **Title**: A clear title starting with "Tech Debt:".
- **Problem Statement**: Why is the current implementation problematic?
- **Proposed Refactor**: What is the recommended long-term solution?
- **Justification**: Why is this refactor important (e.g., improves stability, reduces complexity, enhances performance)?
- **Effort Estimate**: A t-shirt size estimate (S, M, L) for the refactoring effort.
`,
  },
  {
    id: 'social-media-update',
    name: 'Social Media Update (e.g., Twitter)',
    prompt: `
Draft a very brief, public-facing update suitable for a social media platform like Twitter.

The message should be:
- **Concise**: Under 280 characters.
- **Reassuring**: Acknowledge the issue without causing panic.
- **Status-Oriented**: Inform users that you are aware of the issue and are working on it, or that it has been resolved.
- **Actionable (Optional)**: If there's a status page, link to it.
`,
  },
  {
    id: 'billing-impact-analysis',
    name: 'Billing Impact Analysis',
    prompt: `
Analyze the logs for any potential impact on billing systems or customer charges.

The report for the finance and billing team should include:
- **Potential Impact**: Did this error cause overcharging, undercharging, or failed transactions?
- **Affected Customers**: Can you identify a list or segment of customers who might be affected?
- **Data Required for Audit**: What data needs to be pulled to verify the impact (e.g., transaction IDs, user IDs, timestamps)?
- **Urgency Level**: Classify the urgency for the billing team (e.g., Critical, High, Medium, Low).
`,
  },
];
