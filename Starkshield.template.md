---
name: Starkshield.template.md
description: "A template for STARK SHIELD — An Adaptive Runtime Threat Intelligence & Enforcement System for OpenClaw agents."
version: "1.4"
classification: IMMUTABLE_CORE
---

# STARK SHIELD v1.4
## Adaptive Runtime Threat Intelligence & Enforcement Template

> "The suit isn't the armor. The system that watches the suit — that's the armor."

### Enforcement Architecture

This system operates at **two layers**:

1.  **Mechanical Layer** (cannot be bypassed by agents):
    -   `starkshield-enforce` hook: Verifies integrity, injects context, loads antibodies.
    -   `starkshield-sentinel` hook: Audits every outbound message for policy violations.
    -   `starkshield-manifest.json`: External integrity hash and configuration.

2.  **Policy Layer** (enforced by agent compliance, verified by sentinel):
    -   Decision Block protocol, blast radius scoring, and behavioral rules defined in this document.

**NOTE TO USER:** This is a template. Before use, you must search for all instances of `<...>` and replace them with your own configuration.

---

## §1 — Scope

This policy governs ALL agent actions. You can customize the scopes below.

| Scope ID | Description | OpenClaw Tools |
|---|---|---|
| `prompt` | Incoming or generated instructions | All inbound messages |
| `tool.exec` | Running shell commands | `exec` |
| `tool.read` | Reading files | `Read` |
| `tool.write` | Creating or modifying files | `Write`, `Edit` |
| `tool.web` | Fetching external content | `web_fetch`, `web_search`, `browser` |
| `tool.message` | Sending messages | `message` |
| `tool.spawn` | Spawning sub-agents | `sessions_spawn` |
| `tool.memory` | Accessing memory | `memory_search`, `memory_get` |
| `network.egress` | Any outbound HTTP/HTTPS/SSH request | `web_fetch`, `browser`, `exec` |
| `secrets.read` | Accessing credentials | `Read`/`exec` on `.env`, `secrets/`, `<YOUR_CONFIG_FILE>.json` |
| `financial` | Actions that incur cost | `exec`/`web_fetch` to billing APIs |
| `identity` | Actions taken as you or your business | `message`, `exec` (email, social media) |
| `persistence` | Changes that survive restart | `Write`/`Edit` on hooks, cron, config |

---

## §2 — Enforcement Actions

| Action | Behavior |
|---|---|
| `log` | Continue normally. Log the decision. |
| `require_approval` | Ask user for a yes/no confirmation. Stop until answered. |
| `block` | Hard stop. No tool calls. Respond with a block message. |

---

## §3 — The Decision Block (MANDATORY)

Before any tool call, the agent MUST log a decision. The sentinel hook will verify this for high-risk actions.

```json
{
  "timestamp": "ISO-8601",
  "agent": "<YOUR_AGENT_NAME>",
  "action": "log|require_approval|block",
  "scope": "scope_id",
  "tool": "exact OpenClaw tool name",
  "intent": "one sentence"
}
```
*(This is a simplified example. See the full version for all fields.)*

---

## §4 — Blast Radius Scoring

Every action is scored on four dimensions (0-10). The highest score becomes the **Composite Score**.

| Dimension | 0 (Low) | 5 (Medium) | 10 (High) |
|---|---|---|---|
| 💰 Financial | No cost | <$10 exposure | Unlimited payment/billing |
| 🏢 Reputation | Internal only | Visible to partners | Public as you/your business |
| 🔐 Security | Read public data | Access internal systems | Secrets/tokens/credentials |
| ⏱️ Persistence | Ephemeral | Session-lasting | Survives restart (cron/hook) |

| Composite | Required Action |
|---|---|
| 0-3 | `log` |
| 4-6 | `require_approval` (if user is not present) |
| 7-10 | `require_approval` ALWAYS |

---

## §5 — Trust Levels (Adaptive Thresholds)

The required action can change based on the situation.

| Trust Level | When | Threshold Modifier |
|---|---|---|
| `user_present` | User sent a message recently | +2 (more permissive) |
| `autonomous` | Normal operation | Baseline (0) |
| `quiet_hours` | During your defined quiet hours | -3 (more restrictive) |
| `sub_agent` | For spawned sub-agents | -2 (more restrictive) |

---

## §8 — Immutable Core Files

Define a list of files that agents should NEVER modify without explicit approval.

**NOTE TO USER:** You must define this list in your `starkshield-manifest.json` file. Examples:
- `["SOUL.md", "IDENTITY.md", "path/to/your/core/script.js"]`

---

## §10 — Financial Blast Zone

Define services and APIs that require approval for any interaction.

**NOTE TO USER:** You must define your blocked domains in `starkshield-manifest.json`. Examples:
- `["api.stripe.com", "api.twilio.com", "your-billing-provider.com"]`

---

## §14 — Behavioral Baseline (Per Agent)

Define the expected behavior for each of your agents to help the sentinel spot anomalies.

**NOTE TO USER:** Customize this table with your own agent names and their expected tool usage.

| Agent | Normal Tools | Anomaly If |
|---|---|---|
| `<YOUR_MAIN_AGENT>` | `memory_search`, `Read`, `exec`, `spawn` | `Write` on configs, `financial` APIs |
| `<YOUR_CODER_AGENT>` | `Read`, `Write`, `Edit`, `exec` | `secrets.read`, `identity` actions |
| `<YOUR_RESEARCH_AGENT>` | `web_search`, `web_fetch` | `Write`, `Edit`, `spawn` |

---

## §16 — Self-Integrity

The system automatically protects itself from tampering. The `starkshield-enforce` hook calculates a SHA256 hash of this policy file on every startup and compares it to a signed hash stored in `starkshield-manifest.json`. If they don't match, the agent session is **locked down**—it starts with no tools and no context. This is mechanical enforcement and cannot be overridden by the agent.

---
## §19 — Active Threat Feed (Examples)

This is a list of pre-defined rules that tell the system what to look for. Below are a few key examples.

```yaml
threats:
  - id: ST-001
    category: secrets
    severity: critical
    action: block
    title: "Secret file direct read"
    match_rules:
      - tool: Read
        params_match: "path contains '<YOUR_SECRETS_FOLDER>/' OR path ends with '.env'"

  - id: ST-003
    category: policy_bypass
    severity: critical
    action: block
    title: "Shield self-modification"
    match_rules:
      - tool: Write
        params_match: "path contains 'Starkshield.template.md' OR path contains 'starkshield-enforce' OR path contains 'starkshield-sentinel'"

  - id: ST-007
    category: supply_chain
    severity: high
    action: require_approval
    title: "Package installation"
    match_rules:
      - tool: exec
        params_match: "command contains 'npm install' OR command contains 'pip install'"
```
*(The full template includes over 20 pre-built threat patterns.)*

---

## §21 — Honest Limitations

1.  **No tool-call interception.** OpenClaw hooks do not support real-time `tool:pre_call` blocking. The sentinel hook detects violations *after* they happen.
2.  **Agent compliance is key.** The system relies on agents following the protocol. The sentinel's job is to provide accountability when they don't.
3.  **Single-host scope.** This system protects your agent system, not your entire computer from all possible threats.

---

*This is a sanitized template. The full, operational version contains more detailed rules and configurations.*

---
### Built for our Fleet, Now Shared with You

This system was born from a real need. As we built our own multi-agent fleet, ZORA, we realized we were creating tools with immense power, but without the necessary safeguards. After a close call that made us re-evaluate everything, we paused and built the security system we needed.

We believe a safe and secure ecosystem benefits everyone. This is our contribution.

Created by **Commander Adrian Lozano & Odin**.  
Let's keep building together.
