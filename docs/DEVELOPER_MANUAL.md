# AIaaS Brain Developer Manual

This document is the operating manual for humans and coding agents contributing to AIaaS Brain. Treat the repository documentation as part of the product, not optional commentary.

## 1. Before You Change Code

1. Read `README.md`.
2. Read `docs/PROJECT_STATE.md`.
3. Read `docs/architecture/HLD.md` and `docs/architecture/LLD.md`.
4. Read `docs/DECISIONS.md` before changing an architectural boundary.
5. Search existing code/tests before introducing a new abstraction.
6. Identify the smallest issue that represents the change.

Never assume a design decision from memory. If the repository contradicts your assumption, investigate the documented decision first.

## 2. Layering Rules

### Domain
Pure business concepts and policies. No HTTP framework, provider SDK, filesystem, environment-variable access, or database dependency.

### Application
Coordinates use cases through interfaces/ports. It may depend on domain types, but not concrete infrastructure implementations.

### Infrastructure
Implements ports: HTTP clients, provider adapters, config loaders, registry loaders, logging/telemetry integrations.

### API
HTTP-specific concerns only: parsing, validation, authentication boundary, response mapping, status codes.

A lower-level layer must not import a higher-level layer merely for convenience.

## 3. Dependency Direction

```text
API
 ↓
Application
 ↓
Domain
 ↑
Infrastructure implements ports
```

If a new feature makes the domain import an SDK, HTTP client, or framework type, stop and redesign the boundary.

## 4. How to Add a New LLM Provider

1. Add provider configuration without storing secrets in source control.
2. Define/extend the provider port only if the capability is genuinely provider-independent.
3. Implement the provider adapter in infrastructure.
4. Map provider errors into Brain's normalized error categories.
5. Add unit tests for mapping/policy behavior.
6. Add integration/contract tests where practical.
7. Register the provider/model through validated configuration.
8. Update `MODEL_REGISTRY.md`, `PROJECT_STATE.md`, and relevant decisions/docs.

Do not place provider-specific conditionals throughout application services.

## 5. How to Add a New Model

A model is configuration, not a new code path, unless the provider requires a new adapter/capability.

Validate:

- stable model ID
- provider
- capability scores/flags
- context window
- enabled state
- fallback eligibility
- endpoint reference
- rank/policy metadata

Never let an API caller select an arbitrary endpoint.

## 6. How Model Selection Works

The Core LLM creates semantic requirements. The deterministic selector then:

```text
RoutingProfile
    ↓
Hard capability/constraint filtering
    ↓
Policy filtering
    ↓
Availability/fallback eligibility
    ↓
Deterministic scoring
    ↓
Stable tie-breaker
    ↓
ModelSelection
```

A model recommendation emitted by an LLM is never treated as an unrestricted command.

## 7. Error Handling

Use typed/normalized application errors. Preserve provider details only in safe internal telemetry. Public responses must be stable and non-sensitive.

Classify failures before retrying. Permanent failures should not be retried merely because a retry helper exists.

## 8. Logging and Secrets

- Use structured logs.
- Include correlation/request IDs.
- Do not log API keys, authorization headers, raw prompts, sensitive context, or full provider responses by default.
- Log model/provider IDs and safe latency/outcome metadata.

## 9. Testing Standard

Every behavior change should have tests at the lowest useful layer.

Prefer:

- pure unit tests for domain policies
- deterministic selector tests
- adapter contract tests
- API contract tests
- resilience/failure-matrix tests

Tests must cover both success and failure paths.

## 10. Configuration

Configuration must be validated at startup. Missing required production configuration should fail fast with a useful diagnostic. Secrets come from environment/secret management, never committed files.

## 11. Commit Standard

Use focused conventional-style commits, for example:

```text
feat(selector): add capability-aware model scoring
fix(ollama): normalize timeout failures
 test(api): add inference contract cases
docs(architecture): record provider boundary decision
```

Avoid mixing unrelated refactors with behavior changes.

## 12. Documentation Rule

Every meaningful commit must answer whether documentation changed. At minimum, update `docs/PROJECT_STATE.md` when the architecture, implemented capabilities, limitations, or next milestone changes.

Architectural changes require `docs/DECISIONS.md` updates.

Public API changes require `docs/API.md` updates.

Model-registry semantics require `docs/MODEL_REGISTRY.md` updates.

## 13. Coding-Agent Checklist

Before editing:

- [ ] Read project state.
- [ ] Read relevant HLD/LLD section.
- [ ] Check architecture decisions.
- [ ] Find existing abstraction/tests.

Before committing:

- [ ] Type-check passes.
- [ ] Lint/format passes.
- [ ] Tests pass.
- [ ] No secrets or provider credentials added.
- [ ] Error handling is normalized.
- [ ] Documentation is updated.
- [ ] Commit is focused.

## 14. Definition of Production-Ready

Production-ready does not mean every future feature exists. It means the implemented V0.1 behavior has explicit contracts, validated configuration, controlled dependencies, bounded failures, observability, tests, reproducible packaging, and documentation sufficient for safe maintenance.

## 15. Reference-Service Principle

AIaaS Brain is the reference microservice for the wider AIaaS platform. New services should copy its engineering principles—not blindly copy every file:

- explicit architecture
- strict boundaries
- dependency inversion
- configuration validation
- normalized errors
- observability
- resilience
- automated tests
- reproducible local setup
- living documentation
- small, reviewable commits

When another service has different domain needs, preserve the principles while adapting the implementation.
