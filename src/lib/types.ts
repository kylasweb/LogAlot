

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

export interface FineTuningJob {
    id: string;
    agentName: string;
    baseModel: string;
    dataset: string;
    status: 'queued' | 'running' | 'completed' | 'failed';
    progress: number;
    createdAt: Date;
    fineTunedModelId?: string;
    error?: string;
}
