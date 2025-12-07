'use server';
/**
 * @fileOverview An AI flow for editing website source code.
 *
 * - editCode - A function that handles the code editing process.
 * - EditCodeInput - The input type for the editCode function.
 * - EditCodeOutput - The return type for the editCode function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { SourceCodeSchema } from '@/ai/schemas';

const EditCodeInputSchema = z.object({
  sourceCode: SourceCodeSchema,
  prompt: z.string().describe('The user\'s instruction for how to modify the code.'),
});
export type EditCodeInput = z.infer<typeof EditCodeInputSchema>;

const EditCodeOutputSchema = SourceCodeSchema;
export type EditCodeOutput = z.infer<typeof EditCodeOutputSchema>;

export async function editCode(input: EditCodeInput): Promise<EditCodeOutput> {
  return editCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'editCodePrompt',
  input: { schema: EditCodeInputSchema },
  output: { schema: EditCodeOutputSchema },
  prompt: `You are an expert web developer. Your task is to modify the provided website source code based on the user's request.

You will receive the full HTML, and arrays of CSS and JavaScript files.

Analyze the user's prompt and make the requested changes to the appropriate files.

Return the complete, modified source code in the same JSON structure you received it. Do not omit any files, even if you didn't change them.

User Request: {{{prompt}}}

Here is the source code:
\`\`\`json
{{{json sourceCode}}}
\`\`\`
`,
});

const editCodeFlow = ai.defineFlow(
  {
    name: 'editCodeFlow',
    inputSchema: EditCodeInputSchema,
    outputSchema: EditCodeOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
