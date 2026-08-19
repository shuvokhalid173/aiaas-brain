import { z } from 'zod';

export const messageSchema = z.object({ role: z.enum(['system','user','assistant']), content: z.string().min(1) });
export const metadataSchema = z.object({ service: z.string().min(1).max(100), environment: z.enum(['development','staging','production']).optional(), latency_budget_ms: z.number().int().positive().optional(), stream: z.boolean().default(false), tenant_id: z.string().max(200).optional() }).strict();
export const inferenceRequestSchema = z.object({ request_id: z.string().min(1).max(200).optional(), messages: z.array(messageSchema).min(1).max(100), metadata: metadataSchema }).strict();
export const routingProfileSchema = z.object({ difficulty: z.number().min(0).max(1), criticality: z.number().min(0).max(1), task_type: z.string().min(1).max(100), requirements: z.object({ reasoning: z.number().min(0).max(1).default(0), coding: z.number().min(0).max(1).default(0), general: z.number().min(0).max(1).default(0.5) }).strict() }).strict();
export type InferenceRequest = z.infer<typeof inferenceRequestSchema>;
export type RoutingProfile = z.infer<typeof routingProfileSchema>;
