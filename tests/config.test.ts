import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig } from '../src/infrastructure/config.js';
describe('configuration',()=>{it('loads defaults',()=>{const c=loadConfig({});assert.equal(c.port,8080);assert.equal(c.host,'0.0.0.0');});it('rejects invalid port',()=>{assert.throws(()=>loadConfig({PORT:'bad'}));});});
