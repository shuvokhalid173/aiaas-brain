# Contributing to AIaaS Brain

## Quick Start

1. Clone the repository.
2. Read `README.md`.
3. Read `docs/DEVELOPER_MANUAL.md`.
4. Read `docs/PROJECT_STATE.md`.
5. Run the documented install/test commands once the runtime foundation is present.
6. Pick an issue and keep the change focused.

## Architectural Guardrails

- Do not bypass Brain's provider boundary.
- Do not add an LLM-powered fast router to V0.1.
- Do not allow Core LLM output to directly execute provider calls.
- Do not place provider-specific code in domain/application layers.
- Do not introduce hidden network calls in unit-testable domain logic.
- Do not commit credentials or sensitive configuration.

## Pull Requests

PRs should explain:

- problem
- approach
- architectural impact
- tests
- documentation changes
- operational impact

For architectural changes, link the relevant ADR/issue.

## Review Standard

Reviewers should prioritize correctness, boundaries, failure behavior, security, observability, and maintainability over cleverness or unnecessary abstraction.
