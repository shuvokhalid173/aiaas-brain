import { z } from 'zod';
const schema=z.object({port:z.number().int().positive(),host:z.string().min(1),registryPath:z.string().min(1),coreModelId:z.string().min(1),requestTimeoutMs:z.number().int().positive()});
export type AppConfig=z.infer<typeof schema>;
export function loadConfig(env:NodeJS.ProcessEnv):AppConfig{return schema.parse({port:Number(env.PORT??8080),host:env.HOST??'0.0.0.0',registryPath:env.MODEL_REGISTRY_PATH??'./config/models.json',coreModelId:env.CORE_LLM_MODEL_ID??'core-openai-compatible',requestTimeoutMs:Number(env.REQUEST_TIMEOUT_MS??30000)});}
