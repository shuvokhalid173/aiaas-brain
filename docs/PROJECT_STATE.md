# AIaaS Brain — Project State

> Living engineering handoff document. Update this file with every meaningful implementation or architecture commit so a new engineer can understand the current state without reconstructing the project history.

## Current Version

`v0.1.0-dev` — architecture/design phase

## Repository

`shuvokhalid173/aiaas-brain`

## Mission

AIaaS Brain is the mandatory inference gateway for the AIaaS platform. AIaaS product services should not know or directly call individual LLM providers. Brain owns inference routing, model abstraction, provider communication, and resilience.

## Current V0.1 Architecture

```text
AIaaS Service
    |
    | prompt + context + application-known metadata
    v
AIaaS Brain HTTP API
    |
    v
Core LLM Analyzer
    |
    | structured Routing Profile
    v
Deterministic Model Selector
    |
    v
Provider Adapter
    |
    v
Selected LLM
    |
    +--> fallback chain when required
    v
Response
```

### LLM-call policy

V0.1 intentionally accepts two possible inference calls per request:

1. Core LLM call: semantic analysis and routing-profile generation.
2. Selected LLM call: actual user/task response.

There is no separate LLM-powered fast router in V0.1. A deterministic fast path may be introduced in a later version after real traffic and routing data justify it.

## Implemented

- Repository created.
- Initial README and architectural principles documented.
- V0.1 documentation structure established.

## Not Yet Implemented

- TypeScript service bootstrap.
- HTTP API.
- Request/response schemas.
- Core LLM adapter.
- Structured routing-profile validation.
- Model registry implementation.
- Deterministic model selector.
- Provider adapters.
- Retry/timeout/fallback policy.
- Health/readiness endpoints.
- Structured logging and request correlation.
- Tests.
- Docker/CI.

## Current Architectural Decisions

- Brain is a standalone microservice.
- HTTP is the V0.1 transport; gRPC/binary protocols are future extension points.
- Core LLM owns semantic analysis rather than the calling AIaaS service.
- Model selection after analysis is deterministic/policy-driven.
- Provider details are hidden behind adapters.
- Local inference is required as the final resilience path where configured and available.

## Current Limitations

- Static model registry is planned for V0.1.
- No persistent model-health history yet.
- No dynamic routing learned from historical traffic yet.
- No streaming contract finalized yet.

## Next Milestone

Freeze the HLD, LLD, API contract, routing-profile schema, model-registry schema, and failure semantics before implementing the runtime.

## Change Log

### Initial foundation

Created the repository documentation baseline and established the V0.1 architecture and non-negotiable boundaries.
