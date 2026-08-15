# Low-Level Design — AIaaS Brain V0.1

## 1. Architectural Style

Use Clean Architecture / Hexagonal principles with dependency inversion:

```text
API -> Application -> Domain
             ^
             |
       Infrastructure
```

The domain and application layers must not depend on Ollama/OpenRouter SDKs, HTTP clients, filesystem details, or environment-variable access.

## 2. Core Domain Concepts

### InferenceRequest

Represents the normalized task sent by an AIaaS service:

- requestId
- messages/context
- application metadata
- constraints

### RoutingProfile

Structured output of the Core LLM:

- difficulty score
- reasoning requirement
- capability requirements
- semantic task classification
- optional routing rationale for observability

RoutingProfile is untrusted external/model output and must be schema-validated before use.

### ModelDefinition

Normalized model-registry entry containing:

- stable model ID
- provider ID
- local/cloud classification
- capabilities
- context limits
- ranking/capability metadata
- endpoint reference
- enabled/fallback flags

### ModelSelection

Immutable result describing the selected model and selection reason/score for observability.

## 3. Ports / Interfaces

The domain/application side should define interfaces such as:

```text
CoreLlmAnalyzer
ModelRegistry
ModelSelector
LlmProvider
ResiliencePolicy
```

Infrastructure implements these interfaces.

## 4. Selection Strategy

The selector should use a deterministic strategy:

```text
candidate models
    -> capability filtering
    -> policy filtering
    -> availability filtering
    -> score candidates
    -> stable tie-breaker
    -> selected model
```

The Core LLM does not directly choose a provider endpoint. It creates requirements; deterministic code maps requirements to an eligible model.

## 5. Provider Adapter Pattern

```text
LlmProvider
   |
   +-- OllamaProvider
   +-- OpenRouterProvider
   +-- GenericHttpProvider
```

The application calls the `LlmProvider` port. Each adapter owns provider-specific request/response mapping, authentication, and protocol details.

## 6. Core LLM Analyzer

The analyzer receives:

```text
InferenceRequest
+ application-known metadata
+ available routing context
```

It asks the Core LLM for a strict structured routing profile. The response is validated. Invalid Core output is a controlled failure, not an unchecked instruction to the selector.

## 7. Resilience

Recommended V0.1 order:

```text
selected model
   |
   +-- timeout/retry according to policy
   |
   +-- fallback candidate #1
   |
   +-- fallback candidate #2
   |
   +-- configured local fallback
   |
   +-- terminal error
```

Retry only failures classified as transient. Do not blindly retry validation errors, authentication errors, malformed requests, or other permanent failures.

## 8. Error Model

Application errors should be normalized into stable categories, for example:

- `INVALID_REQUEST`
- `CORE_ANALYSIS_FAILED`
- `NO_ELIGIBLE_MODEL`
- `PROVIDER_TIMEOUT`
- `PROVIDER_RATE_LIMITED`
- `PROVIDER_UNAVAILABLE`
- `PROVIDER_AUTH_FAILED`
- `INFERENCE_FAILED`
- `INTERNAL_ERROR`

External provider error payloads must not leak directly through the public API.

## 9. Observability

Every request should have a correlation/request ID. Logs should be structured and include safe fields such as:

- request ID
- selected model ID
- provider ID
- routing latency
- inference latency
- fallback count
- outcome/error category

Prompts, credentials, authorization headers, and sensitive context must not be logged by default.

## 10. Concurrency and State

V0.1 should remain stateless at request-processing level. The registry can be loaded at startup and represented as immutable in-memory data. Runtime health state may be introduced through a dedicated component later rather than hidden mutable state spread across providers.

## 11. Testing Boundaries

- Domain: pure unit tests.
- Selector: deterministic table/property-style tests.
- Core analyzer: adapter and contract tests with mocked Core LLM.
- Provider adapters: integration tests against test endpoints/mocks.
- API: request/response contract tests.
- Resilience: failure-matrix tests covering timeout, rate limit, unavailable provider, and local fallback.
