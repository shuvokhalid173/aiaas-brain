# High-Level Design — AIaaS Brain V0.1

## 1. Purpose

AIaaS Brain is a centralized inference gateway and routing layer. It separates AIaaS product services from concrete LLM providers and model endpoints.

## 2. Goals

- One controlled inference boundary for the AIaaS platform.
- Provider/model abstraction.
- Semantic routing through one Core LLM analysis step.
- Deterministic and testable final model selection.
- Resilient fallback across eligible models.
- Production-oriented operational behavior.
- Clear extension points for future transports and routing intelligence.

## 3. Non-Goals for V0.1

- Distributed model-health control plane.
- Machine-learning-based routing.
- Learned routing from historical traffic.
- gRPC or binary transport.
- Dynamic model discovery.
- Multi-region control plane.
- Billing/chargeback system.

## 4. System Context

```text
+----------------------- AIaaS Platform -----------------------+
|                                                              |
|  RAG Service    Agent Service    Chat Service    Other       |
|       \              |               /                       |
|        \             |              /                        |
|         +---------- AIaaS Brain ------------------+          |
|                    HTTP /v1/inference              |          |
+----------------------------------------------------|----------+
                                                     |
                              +----------------------+------------------+
                              |                                         |
                         Core LLMs                              Inference Models
                              |                                         |
                              |                       +-----------------+--------+
                              |                       |                 |        |
                              |                    Ollama          OpenRouter  Cloud
                              |                                         |
                              +------------------ routing --------------+
```

## 5. Internal Components

### API Layer

Validates requests, creates/propagates correlation IDs, and translates HTTP concerns into application commands.

### Application Layer

Coordinates the inference use case. It should not contain provider SDK details.

### Core LLM Analyzer

Sends the request and application-known metadata to the configured Core LLM and validates its structured routing profile. The Core LLM determines semantic characteristics such as difficulty and reasoning requirements.

### Model Selector

Pure deterministic policy component. It filters ineligible models and scores eligible models using the routing profile, model capabilities, policy constraints, cost/latency preferences, and availability information exposed to the selector.

### Provider Adapters

Translate a normalized inference command into provider-specific HTTP/SDK calls. Adapters isolate provider-specific behavior from the domain and application layers.

### Resilience Layer

Applies timeouts, retry rules, failure classification, and fallback ordering. It must prevent one unavailable provider from unnecessarily taking down the gateway.

### Model Registry

V0.1 configuration-backed registry. It defines available models, capabilities, endpoints/provider references, local/cloud classification, ranking/capability metadata, and fallback eligibility.

## 6. Request Lifecycle

```text
1. Receive HTTP request
2. Validate request
3. Normalize request and metadata
4. Invoke Core LLM Analyzer
5. Validate Routing Profile
6. Resolve eligible models from registry
7. Deterministically select preferred model
8. Invoke selected provider through adapter
9. On retryable failure, execute fallback policy
10. Return normalized response
11. Emit structured telemetry
```

## 7. Reliability Principle

The selected model is a preference, not an unconditional dependency. A provider outage, rate limit, timeout, or transport failure should trigger the configured fallback chain when the failure is classified as retryable/fallback-eligible.

## 8. Extensibility

Future components can be added behind interfaces without changing callers:

- `GrpcInferenceTransport`
- dynamic registry
- model-health service
- learned router
- routing cache
- cost-aware policy engine
- provider-specific streaming adapters
- distributed circuit breakers

## 9. Security Boundaries

- Provider credentials remain in Brain configuration/secrets, not AIaaS services.
- Request metadata must be explicitly allow-listed.
- Secrets must never be logged.
- Provider endpoints must be validated/configured rather than accepted as arbitrary caller-controlled URLs.
- Authentication/authorization for service-to-service access is part of the production hardening milestone.
