# AIaaS Brain

AIaaS Brain is the centralized inference gateway for the AIaaS platform. Every AIaaS service must access local or cloud LLMs through Brain rather than calling model providers directly.

## V0.1

```text
AIaaS Service
  -> POST /v1/inference
  -> Core LLM Analyzer
  -> Routing Profile
  -> deterministic Model Selector
  -> Provider Adapter
  -> selected LLM
  -> fallback chain
  -> response
```

V0.1 uses one Core LLM routing call plus the actual inference call. There is intentionally no LLM-powered Fast Router. If Core analysis fails, Brain can degrade directly to a configured local fallback model.

## Local development

Requirements: Node.js 22+.

```bash
cp .env.example .env
npm install
npm run typecheck
npm test
npm run build
npm run dev
```

The example registry in `config/models.json` contains placeholders. Configure a real Core LLM endpoint and credential before sending inference requests.

## Docker

```bash
docker compose build
docker compose up
```

## API

`POST /v1/inference`, `GET /health`, and `GET /ready` are defined in [API Contract](docs/API.md).

## Engineering documentation

- [Developer Manual](docs/DEVELOPER_MANUAL.md) — contribution rules for humans and coding agents.
- [Contributing](docs/CONTRIBUTING.md) — PR and review workflow.
- [Project State](docs/PROJECT_STATE.md) — living implementation/handoff status.
- [HLD](docs/architecture/HLD.md) — system architecture.
- [LLD](docs/architecture/LLD.md) — component design.
- [API Contract](docs/API.md) — HTTP contract.
- [Model Registry](docs/MODEL_REGISTRY.md) — model configuration semantics.
- [Architecture Decisions](docs/DECISIONS.md) — durable decisions.

## Reference microservice

AIaaS Brain is the reference engineering standard for future AIaaS microservices. Future services should reuse its principles—explicit boundaries, dependency inversion, validated configuration, normalized errors, resilience, observability, tests, reproducible packaging, and living documentation—while adapting implementation details to their domain.

## Status

`v0.1.0-dev` — runtime MVP implemented; hardening and validation continue.
