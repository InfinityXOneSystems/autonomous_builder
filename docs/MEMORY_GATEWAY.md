# MEMORY_GATEWAY.md — How to Add Memory Safely (No Runaway)

Infinity Prime is a builder. Your runtime products can add a Memory Gateway with the same safety principles:

## What memory is allowed
- Structured operational facts (schemas, decisions, run ledgers, scoreboards)
- Versioned artifacts (reports, eval results)
- Indexed references (documents) — not secret values

## What memory must NOT store
- Raw secrets / API keys
- PII unless you have explicit legal basis + retention policy

## Safe implementation pattern
- `memory/events` (append-only)
- `memory/snapshots` (periodic state)
- `memory/index` (vector/keyword index)
- All writes go through a policy layer with allowlists and audit

## Runaway prevention
- Hard budgets for writes per run
- Deduplication by stable event IDs
- Backpressure: stop when rate limit reached
