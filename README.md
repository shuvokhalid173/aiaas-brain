# AIaaS Brain

AIaaS Brain is the centralized inference gateway for the AIaaS platform. Every AIaaS service must access local or cloud LLMs through Brain rather than calling model providers directly.

## V0.1 Goal

V0.1 establishes a small, production-oriented HTTP microservice with clear boundaries for:

1. Request validation and normalization.
2. Core LLM analysis of the inference request.
3. Deterministic model selection from a model registry.
4. Provider abstraction for local/cloud LLMs.
5. Resilient fallback to another eligible model, with a local model as the final safety net.
6. Health/readiness, structured errors, logging, configuration validation, and tests.

## V0.1 Request Flow

```text
AIaaS Service
    |
    | POST /v1/inference
    v
AIaaS Brain
    |
    +--> Core LLM Analyzer
    |       |
    |       +--> Routing Profile
    |
    +--> Deterministic Model Selector
    |
    +--> Provider Adapter
    |
    +--> Selected LLM
    |
    +--> Fallback chain on failure
    |
    v
Response
```

The caller provides facts it already knows (for example environment, latency budget, streaming requirement, or service name). It does **not** need to invoke another LLM to calculate difficulty or model suitability. Brain's Core LLM owns semantic routing analysis.

## Architectural Rules

- AIaaS services must not call LLM provider endpoints directly.
- The Core LLM produces a structured routing profile; it does not get unrestricted authority to invoke arbitrary providers.
- Final model selection is deterministic and policy-driven.
- Provider-specific SDK/API details stay behind adapters.
- A failed preferred model must not automatically fail the entire request when another eligible model is available.
- The implementation must remain extensible toward gRPC/binary transport, richer routing policies, persistent model health, and dynamic registries without coupling V0.1 to those features.

## Documentation

- [Project State](docs/PROJECT_STATE.md) — living handoff document updated with meaningful changes.
- [HLD](docs/architecture/HLD.md) — system-level architecture.
- [LLD](docs/architecture/LLD.md) — component and interaction design.
- [API Contract](docs/API.md) — V0.1 HTTP contract.
- [Model Registry](docs/MODEL_REGISTRY.md) — registry semantics and configuration direction.
- [Architecture Decisions](docs/DECISIONS.md) — decisions and rationale.

## Status

V0.1 architecture/design phase. Implementation starts after the contracts are reviewed and frozen.
