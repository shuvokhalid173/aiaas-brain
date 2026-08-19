# AIaaS Brain — Project State

> Living engineering handoff document. Update this file with every meaningful implementation or architecture commit so a new engineer can understand the current state without reconstructing the project history.

## Current Version

`v0.1.0-dev` — runtime MVP implemented; hardening continues

## Mission

AIaaS Brain is the mandatory inference gateway for the AIaaS platform. AIaaS product services must not directly call individual LLM providers. Brain owns inference routing, model abstraction, provider communication, and resilience.

## Current Runtime Flow

```text
AIaaS Service
    |
    | POST /v1/inference
    v
Request validation
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
Preferred LLM
    |
    +--> retryable failure -> eligible fallback chain
    |
    +--> Core failure -> configured local fallback
    v
Response
```

## Implemented

- Strict TypeScript project and Node.js 22 runtime target.
- Fastify HTTP server.
- `/health`, `/ready`, and `/v1/inference` endpoints.
- Zod request and routing-profile validation.
- Static JSON model registry with startup validation and mandatory local fallback check.
- Core LLM analyzer using an OpenAI-compatible provider interface.
- Deterministic capability/rank model selector.
- OpenAI-compatible and Ollama provider adapters.
- Timeout handling and normalized provider failure categories.
- Retry/fallback traversal for retryable inference failures.
- Direct local degradation when Core routing analysis fails.
- Correlation/request IDs through Fastify.
- Graceful SIGTERM/SIGINT shutdown.
- Docker and Docker Compose setup.
- GitHub Actions typecheck/test/build workflow.
- Initial selector/configuration unit tests.
- Developer manual and contributor guardrails.

## LLM-call Policy

V0.1 intentionally uses at most two normal inference stages when Core succeeds:

1. Core LLM call: semantic routing analysis.
2. Selected LLM call: actual task response.

There is no LLM-powered Fast Router. If Core fails, the availability policy bypasses semantic selection and uses a configured local fallback directly.

## Current Limitations / Hardening Backlog

- No npm lockfile has been committed yet; package versions should be locked before release.
- Streaming is declared in the request contract but V0.1 runtime is non-streaming.
- Readiness is currently process-level and should become dependency-aware.
- Provider health/circuit-breaker state is not persistent.
- Retry policy is intentionally minimal and should gain bounded backoff/jitter before production traffic.
- Authentication/authorization for service-to-service access is not implemented yet.
- Metrics/tracing are not yet exported to an observability backend.
- Core structured output parsing currently expects JSON content directly; tolerant fenced-JSON parsing can be added.
- Model selection should eventually incorporate token/context constraints and richer latency/cost policies.
- CI execution was not observed through the GitHub connector for the current head; local/toolchain validation is the next gate before merge.

## Reference-Service Standard

Future AIaaS microservices should use this project as the architectural reference for layering, configuration, errors, resilience, tests, documentation, and coding-agent onboarding. They should adapt the domain rather than blindly copying implementation details.

## Next Milestone

Run the full toolchain against the branch, fix compile/test issues, lock dependencies, add contract/resilience tests, then merge the v0.1 runtime into `main` after review.

## Change Log

### Runtime MVP

Implemented the first executable Brain runtime and supporting deployment/developer infrastructure on `feat/v0.1-runtime`.

### Documentation contract

Established the developer manual, contributor rules, HLD/LLD, API contract, model registry semantics, ADRs, and living project-state process.
