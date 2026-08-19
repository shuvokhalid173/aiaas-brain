import { loadConfig } from './infrastructure/config.js';
import { JsonModelRegistry } from './infrastructure/JsonModelRegistry.js';
import { OpenAiCompatibleProvider, OllamaProvider } from './infrastructure/providers/httpProviders.js';
import { CoreLlmAnalyzer } from './application/CoreLlmAnalyzer.js';
import { CapabilityModelSelector } from './application/CapabilityModelSelector.js';
import { InferenceService } from './application/InferenceService.js';
import { buildServer } from './api/server.js';
const config=loadConfig(process.env);const registry=new JsonModelRegistry(config.registryPath);const providers=new Map([['openai-compatible',new OpenAiCompatibleProvider()],['ollama',new OllamaProvider()]]);const core=registry.getById(config.coreModelId);if(!core)throw new Error(`Core model not found: ${config.coreModelId}`);const coreProvider=providers.get(core.provider);if(!coreProvider)throw new Error(`Core provider adapter not found: ${core.provider}`);const service=new InferenceService(new CoreLlmAnalyzer(coreProvider,core,config.requestTimeoutMs),new CapabilityModelSelector(),registry,providers,config.requestTimeoutMs);const app=buildServer(service);const shutdown=async(signal:string)=>{app.log.info({signal},'shutting down');await app.close();process.exit(0);};process.once('SIGTERM',()=>void shutdown('SIGTERM'));process.once('SIGINT',()=>void shutdown('SIGINT'));await app.listen({port:config.port,host:config.host});
