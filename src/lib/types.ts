export interface AnalysisReport {
  id: string;
  timestamp: string;
  techStack: string;
  environment: string;
  analysis: string;
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
  };
}
