
export interface AnalysisReport {
  id: string;
  timestamp: string;
  techStack: string;
  environment: string;
  summary: string;
  rootCause: string;
  impact: string;
  prevention: string;
  proposedSolution: {
    description: string;
    code: string;
  };
  verification: string;
  confidenceScore: number;
  isIntermittent: boolean;
  needsFix: boolean;
  traceback?: {
    exceptionType: string;
    relevantFrames: string[];
    analysis: string;
  };
}


export interface Agent {
  id: string;
  name: string;
  description: string;
  instructions: string;
  model: string;
}

export interface Workflow {
  agents: Agent[];
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  agents: string[]; // array of agent IDs
}
