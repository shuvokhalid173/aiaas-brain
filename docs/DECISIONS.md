# Architecture Decision Records — AIaaS Brain

## ADR-001 — Brain is the mandatory inference boundary

**Status:** Accepted

AIaaS product services must not directly call LLM providers. Brain owns access to registered inference resources.

**Why:** Centralizes routing, provider abstraction, resilience, observability, policy, and future cost controls.

## ADR-002 — V0.1 uses HTTP

**Status:** Accepted

The first transport is HTTP/JSON. gRPC or a more efficient protocol can be added behind the transport boundary later.

**Why:** Fast implementation, easy debugging, broad interoperability, and clear contract testing.

## ADR-003 — No LLM-powered Fast Router in V0.1

**Status:** Accepted

Every V0.1 inference request may use one Core LLM call for semantic routing analysis followed by the selected model call.

**Why:** An LLM-powered fast router would add another inference call and undermine the latency/cost objective. A deterministic fast path can be introduced after observing real workload patterns.

## ADR-004 — Application sends facts it already knows; Brain derives semantic routing properties

**Status:** Accepted

AIaaS services may send metadata such as service name, environment, latency budget, streaming requirement, and known constraints. They must not need a preliminary LLM call to calculate difficulty or model suitability. Brain's Core LLM derives semantic routing characteristics.

**Why:** Avoids hidden extra inference calls and keeps semantic routing responsibility centralized.

## ADR-005 — Core LLM does not directly control provider invocation

**Status:** Accepted

The Core LLM produces a validated routing profile. Deterministic application code selects the actual registered model.

**Why:** Keeps model selection auditable, testable, policy-constrained, and resilient to malformed/model-generated output.

## ADR-006 — Local model is the final configured fallback

**Status:** Accepted

Deployments should configure at least one local fallback model. Provider failures may traverse the fallback chain.

**Why:** Preserve best-effort inference availability during cloud rate limits, outages, or network failures.
