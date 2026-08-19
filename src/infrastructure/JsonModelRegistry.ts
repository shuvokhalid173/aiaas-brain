import { readFileSync } from 'node:fs';
import { z } from 'zod';
import type { ModelDefinition, ModelRegistry } from '../domain/ports.js';
const model=z.object({id:z.string().min(1),provider:z.string().min(1),model:z.string().min(1),endpoint:z.string().url(),apiKeyEnv:z.string().min(1).optional(),deployment:z.enum(['local','cloud']),enabled:z.boolean(),core:z.boolean(),fallbackEligible:z.boolean(),rank:z.number(),capabilities:z.record(z.string(),z.number().min(0).max(1)),contextWindow:z.number().int().positive()}).strict();
const registry=z.object({models:z.array(model).min(1)}).strict();
export class JsonModelRegistry implements ModelRegistry { private readonly models:ModelDefinition[]; constructor(path:string){const parsed=registry.parse(JSON.parse(readFileSync(path,'utf8')));if(new Set(parsed.models.map(m=>m.id)).size!==parsed.models.length)throw new Error('Duplicate model IDs');if(!parsed.models.some(m=>m.fallbackEligible&&m.deployment==='local'))throw new Error('Registry requires a local fallback model');this.models=parsed.models;} getById(id:string){return this.models.find(m=>m.id===id);} listInferenceModels(){return this.models.filter(m=>m.enabled&&!m.core);} }
