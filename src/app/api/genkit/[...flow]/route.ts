'use server';

import { editCode } from '@/ai/flows/edit-code-flow';
import { nextHandler } from '@genkit-ai/next';

export const POST = nextHandler();
