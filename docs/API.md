# API Contract — V0.1

## POST `/v1/inference`

The single primary inference endpoint for AIaaS services.

### Request

```json
{
  "request_id": "optional-client-id",
  "messages": [
    {
      "role": "user",
      "content": "Explain this architecture."
    }
  ],
  "metadata": {
    "service": "rag-service",
    "environment": "production",
    "latency_budget_ms": 3000,
    "stream": false
  }
}
```

### Request rules

- `messages` is required.
- `role` must be a supported message role.
- `metadata` contains application-known facts and constraints only.
- Callers must not provide a model endpoint or provider credential.
- Brain owns model selection.

### Response

```json
{
  "request_id": "generated-or-client-id",
  "model": {
    "id": "model-id",
    "provider": "provider-id"
  },
  "response": {
    "role": "assistant",
    "content": "..."
  },
  "routing": {
    "fallback_used": false
  }
}
```

The exact response shape will be frozen during implementation after the streaming/non-streaming contract is finalized.

## GET `/health`

Liveness endpoint. It answers whether the process is alive. It must not require a successful LLM call.

## GET `/ready`

Readiness endpoint. It checks whether required startup dependencies/configuration are available according to the deployment policy.

## Error Response

Errors use a stable envelope:

```json
{
  "error": {
    "code": "PROVIDER_TIMEOUT",
    "message": "Inference provider timed out.",
    "request_id": "..."
  }
}
```

Internal provider details and secrets are never returned.
