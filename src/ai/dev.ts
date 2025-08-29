import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-error-logs.ts';
import '@/ai/flows/enhance-traceback-analysis.ts';
import '@/ai/flows/generate-solution-from-error.ts';