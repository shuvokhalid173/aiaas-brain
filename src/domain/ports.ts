import type { InferenceRequest, RoutingProfile } from './schemas.js';
export type ChatMessage = InferenceRequest['messages'][number];
export interface ModelDefinition { id:string; provider:string; model:string; endpoint:string; apiKeyEnv?:string; deployment:'local'|'cloud'; enabled:boolean; core:boolean; fallbackEligible:boolean; rank:number; capabilities:Record<string,number>; contextWindow:number; }
export interface ModelRegistry { getById(id:string):ModelDefinition|undefined; listInferenceModels():ModelDefinition[]; }
export interface LlmProvider { chat(model:ModelDefinition,messages:ChatMessage[],timeoutMs:number):Promise<string>; }
export interface CoreLlmAnalyzer { analyze(request:InferenceRequest):Promise<RoutingProfile>; }
export interface ModelSelector { select(profile:RoutingProfile,models:ModelDefinition[]):ModelDefinition; }
export class BrainError extends Error { constructor(public readonly code:string,message:string,public readonly retryable=false){super(message);this.name='BrainError';} }
