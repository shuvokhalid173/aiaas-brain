import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { CapabilityModelSelector } from '../src/application/CapabilityModelSelector.js';
const models=[{id:'smart',provider:'x',model:'smart',endpoint:'https://example.com',deployment:'cloud' as const,enabled:true,core:false,fallbackEligible:true,rank:.9,capabilities:{general:.9,reasoning:.95,coding:.9},contextWindow:1000},{id:'local',provider:'x',model:'local',endpoint:'https://example.com',deployment:'local' as const,enabled:true,core:false,fallbackEligible:true,rank:.4,capabilities:{general:.6,reasoning:.3,coding:.4},contextWindow:1000}];
describe('CapabilityModelSelector',()=>{it('selects the best capability/rank fit',()=>{const selected=new CapabilityModelSelector().select({difficulty:.9,criticality:.8,task_type:'reasoning',requirements:{reasoning:1,coding:.1,general:.8}},models);assert.equal(selected.id,'smart');});});
