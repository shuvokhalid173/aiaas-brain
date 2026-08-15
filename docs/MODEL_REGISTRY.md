# Model Registry — V0.1

V0.1 uses a configuration-backed model registry. The registry is an inventory of models Brain is allowed to use; it is not caller-controlled routing input.

## Directional schema

```json
{
  "id": "local-gemma",
  "provider": "ollama",
  "model": "gemma",
  "endpointRef": "OLLAMA_ENDPOINT",
  "deployment": "local",
  "enabled": true,
  "fallbackEligible": true,
  "capabilities": {
    "reasoning": 0.45,
    "coding": 0.55,
    "general": 0.65
  },
  "contextWindow": 8192,
  "latency": {
    "targetMs": 1000
  },
  "cost": {
    "inputPer1k": 0,
    "outputPer1k": 0
  },
  "rank": 0.4
}
```

This schema is intentionally directional for the architecture phase. The runtime schema will be finalized with strict validation before implementation.

## Selection semantics

`rank` is not the sole truth. It is one input into model scoring. A model must first satisfy hard constraints/capabilities; only then should ranking and optimization preferences influence the score.

Conceptually:

```text
eligible(model) ?
    score(capability fit, rank, latency, cost, policy) : -infinity
```

## Provider security

The registry must not contain plaintext provider credentials. Credentials are supplied through environment/secret management and referenced by configuration.

## Local fallback

At least one configured local model should be marked `fallbackEligible=true` for the intended production deployment. If no eligible model remains, Brain returns a normalized terminal error rather than pretending a response exists.
