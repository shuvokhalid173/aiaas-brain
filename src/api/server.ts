import Fastify from 'fastify';
import { randomUUID } from 'node:crypto';
import { ZodError } from 'zod';
import { inferenceRequestSchema } from '../domain/schemas.js';
import { BrainError } from '../domain/ports.js';
import type { InferenceService } from '../application/InferenceService.js';
export function buildServer(service:InferenceService){const app=Fastify({logger:true,requestIdHeader:'x-request-id',genReqId:()=>randomUUID()});app.get('/health',async()=>({status:'ok'}));app.get('/ready',async()=>({status:'ready'}));app.post('/v1/inference',async(request,reply)=>{try{const input=inferenceRequestSchema.parse(request.body);const result=await service.execute(input);return reply.send({request_id:request.id,model:{id:result.model.id,provider:result.model.provider},response:{role:'assistant',content:result.content},routing:{fallback_used:result.fallbackUsed,degraded:result.degraded}});}catch(error){const brain=error instanceof BrainError?error:error instanceof ZodError?new BrainError('INVALID_REQUEST','Request validation failed'):new BrainError('INTERNAL_ERROR','Internal server error');request.log.error({err:error,code:brain.code},'inference failed');const status=brain.code==='INVALID_REQUEST'?400:brain.code==='NO_ELIGIBLE_MODEL'?503:502;return reply.code(status).send({error:{code:brain.code,message:brain.message,request_id:request.id}});}});return app;}
