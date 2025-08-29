"use server";

import { z } from "zod";
import type { AnalysisReport } from "@/lib/types";

const analyzeLogsSchema = z.object({
  logs: z.string(),
  includeTraceback: z.boolean(),
});

export async function analyzeLogsAction(
  values: z.infer<typeof analyzeLogsSchema>
): Promise<{ data: AnalysisReport | null; error: string | null }> {
  const validatedFields = analyzeLogsSchema.safeParse(values);

  if (!validatedFields.success) {
    return { data: null, error: "Invalid input." };
  }

  // Simulate network delay and AI processing time
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // In a real implementation, you would call the AI analysis logic here.
  // For now, we return mock data.
  const mockAnalysis: AnalysisReport = {
    id: `analysis_${new Date().getTime()}`,
    timestamp: new Date().toISOString(),
    techStack: "Python/Flask",
    environment: "production",
    analysis:
      "The logs indicate a `TypeError` occurring within the `process_payment` function. This is likely due to an unexpected `None` value being passed to a function expecting a dictionary. The error seems to originate from the `user_data` variable, which is not being correctly populated from the database query.",
    proposedSolution: {
      description:
        "The proposed solution is to add a check to ensure `user_data` is not `None` before attempting to access its keys. If it is `None`, a `ValueError` should be raised to handle the case gracefully.",
      code: "```python\ndef process_payment(user_id):\n    user_data = get_user_from_db(user_id)\n\n    if user_data is None:\n        raise ValueError(f'User with ID {user_id} not found.')\n\n    # ... rest of the payment processing logic ...\n    process_user_payment(user_data)\n```",
    },
    verification:
      "To verify the fix, write a unit test that calls `process_payment` with an invalid `user_id` that is known not to exist in the test database. Assert that a `ValueError` is raised.",
    confidenceScore: 0.92,
    isIntermittent: false,
    needsFix: true,
    traceback: validatedFields.data.includeTraceback
      ? {
          exceptionType: "TypeError: 'NoneType' object is not subscriptable",
          relevantFrames: [
            'File "/app/services/payment_service.py", line 152, in process_payment',
            'File "/app/utils/data_helpers.py", line 45, in process_user_payment',
          ],
        }
      : undefined,
  };

  return { data: mockAnalysis, error: null };
}
