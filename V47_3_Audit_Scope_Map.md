# VitalGuard AI v4.7.3 — Security Audit Scope Map

*Auditable, zero-network-dependency, offline AI architecture — vendor-facing scope document.*

---

## 0. Document Control

| Field | Value |
|-------|-------|
| Target artifact | `VitalGuard_AI_complete_V47_3.html` |
| Artifact SHA-256 | `b81c067f5523bc68728ae84f2fc93ce05077705ae4cb7e882f1c859885f47615` |
| Artifact size | 713,562 bytes · 13,294 lines |
| Scope-map version | 1.0 (for the v4.7.3 artifact) |
| Lineage | v4.7.3 is an originator-initiated internal reinforcement build produced from the v4.7.2 artifact; it introduces the VG473 hardening set and the VG473A self-audit repairs. |
| Status label | Every v4.7.3 hardening item is **IMPLEMENTED-PENDING-INDEPENDENT-RETEST**; nothing is claimed closed, approved, or certified. |
| Correspondence | All line numbers refer **only** to the artifact whose SHA-256 is stated above. Any modification invalidates the line numbers; re-anchor with the CTRL+F strings and named `VG473_*` anchors provided throughout. |

**CSP resource hashes (from the shipped file):**

| Resource | SHA-256 |
|---|---|
| (one of) | `sha256-+kp2tTsePIO8UPPo8maF16rTjNGqATVspH9eOFQdXQ4=` |
| (one of) | `sha256-9HAmYYBOS+W3tH0LjQyJlCXTl/gEnNVmsxsEB4/kIS8=` |
| (one of) | `sha256-YPoQf9KVLv7ZNqNdVbAAgnX6ncFaIYkxUcpg8K39pQA=` |

**How to use this map.** Sections are grouped as Work Packages (WP). Each high-priority block lists exact line ranges, copy-paste CTRL+F strings, and the properties to test. Section 1 is the priority overview; Section 2 is the threat model; Sections 4–7 are the technical detail. **Section 7 is new for v4.7.3** and covers the VG473 reinforcement controls — the highest-value areas for this build.

---

## 1. At-a-Glance — Audit Priority Map

| WP | Domain | Core Line Range | Priority |
|----|--------|-----------------|----------|
| **WP1** | Zero-Egress — first-executable network / frame / RTC / worker / eval isolation | **44–130** | Highest |
| **WP2 / WP7** | Anti-Injection — allowlist dispatcher + VG473 action pipeline + Trusted Types sinks | **962–1006**, **1003–1090**, **1206–1300**, **1558–1600** | Highest |
| **WP6-a** | Crypto core — PBKDF2 / AES-GCM-256 + purpose-bound AAD | **11,293–11,410** | Highest |
| **WP6-b** | At-rest encrypted vault — atomic writes + write-epoch race guard | **11,479–11,600** | Highest |
| **WP6-c** | Import boundary — schema / depth / size validation + typed plaintext gate | **11,180–11,240**, **12,150**, **7,298** | High |
| **VG473-A** | Single sanitize pass + URL policy + data-attribute allowlist (new) | **1,392–1,600** | Highest |
| **VG473-B** | BLE single authoritative clone/ambiguity state machine (new) | **11,652–~11,760** | High |
| **RP** | Rescue Pack replay guard — hashed bounded JTI ledger | **~12,044–12,130** | High |
| **PP** | Passphrase policy — distinct-word + weak-pattern enforcement | **12,475–~12,500** | High |
| **BQ** | BLE duplicate-binding quarantine — fail-closed routing | **11,493**, **12,113** | High |
| **DESTR** | Destructive coordination — Reset Center + persistence generation guard | **8,907–~8,975**, **11,622–~11,700** | High |
| **VG473-C** | Legacy-precheck + capability-drift guard + security self-test (new) | **7,327**, **11,381**, **12,843** | Medium/audit |
| Secondary | Signal math — Kalman / distance estimator | **2,735–~2,910** | Medium |
| Secondary | On-device AI — IsolationForest / KNN / RLS | **8,507–~8,700** | Medium |
| Secondary | BLE scan filters / permission boundary | **~5,907–6,040** | High |
| Supply-chain | Embedded Project Nayuki QR generator (MIT) | CTRL+F `qrcodegen`; meta line 20 | Integrity check |

> **Bottom line.**
> 1. **No external CDNs or external domains.** A full-file sweep finds no active external resources; `connect-src 'none'` is declared in the meta CSP (line 22) and enforced at runtime by the first-executable core. No `eval`, no `new Function`, no WebSerial/WebUSB, no third-party runtime library except the inline MIT QR generator.
> 2. **~80% of audit effort should concentrate on WP1, WP2/WP7 (including the new VG473 action pipeline), the three WP6 blocks, and the new VG473 injection-pipeline controls.**
> 3. **v4.7.3 is a reinforcement build.** The VG473 set (single sanitize pass, URL policy, data-attribute allowlist, BLE state machine, capability-drift guard, legacy precheck, security self-test) is the newest and least externally reviewed code and warrants a dedicated pass (§7).

---

## 2. Threat Model

Defines who the artifact protects, from whom, and what failure would cost, following OTF Security Lab's focus on users in high-risk, surveillance-heavy contexts.

### 2.1 Protected users
- Individuals operating **offline or in intermittently connected, low-resource environments** (refurbished phones, no reliable server access).
- People for whom **local data disclosure carries elevated personal risk** — the design assumes the device may later be inspected, lost, or seized.

### 2.2 Assets to protect
| Asset | Where it lives | Why it matters |
|-------|----------------|----------------|
| Sensitive user records | At-rest encrypted vault (WP6-b) | Disclosure could expose the user or their contacts. |
| Passphrase-derived keys | In-memory, derived per session (WP6-a) | Compromise defeats all at-rest protection. |
| Rescue Pack contents | Encrypted, manually handed off (RP) | Replay or forgery could mislead a recipient. |
| Integrity of the artifact | The single HTML file | A tampered build could silently exfiltrate or weaken protection. |

### 2.3 Adversaries considered
| Adversary | Capability assumed | Primary defence |
|-----------|--------------------|-----------------|
| Network observer / exfiltration | Can observe or induce outbound traffic | WP1 Zero-Egress (no outbound channel exists) |
| Malicious content / injection | Can supply crafted strings, imports, DOM input, or attributes | WP2/WP7 allowlist + VG473 action pipeline + data-attr allowlist + Trusted Types; WP6-c import boundary |
| Local attacker with post-hoc device access | Can read local storage, attempt offline key guessing | WP6-a/b encryption + passphrase policy |
| Spoofed proximity signals | Can broadcast crafted BLE advertisements | BQ + VG473 BLE state machine (advisory-only, fail-closed) |

### 2.4 Explicitly outside the trust boundary
The host **browser and operating system are trust boundaries outside the artifact's control**. Once arbitrary script execution or a compromised platform is assumed, in-page JavaScript cannot restore integrity. Stated as an operating assumption, not a defended guarantee (see §10). Worst-case harm the design seeks to *bound* — not eliminate — is disclosure of locally stored sensitive data following device compromise.

---

## 3. Architecture & Integrity Model

The artifact is a **single, self-contained static HTML file**, distributed as a fixed file rather than served live per request, so the code a user runs is the code that was audited.

- **Cryptography** uses only the browser-native Web Crypto API (`crypto.subtle`). No custom cryptographic primitive is implemented.
- **Injection defence** enforces a strict CSP (`default-src 'none'`, `connect-src 'none'`, hash-pinned scripts, Trusted Types), routes all HTML sinks through a neutralising policy with a **single sanitize pass** (VG473), and copies only an **allowlisted set of data-/aria-attributes** (VG473).
- **Attack surface** is confined to the one file under audit: no remote scripts, no CDNs, no `eval`, no `new Function`.

**Integrity & reproducibility (stated precisely).** The artifact is hand-authored as a single file with **no build, bundling, or minification pipeline** — *the distributed file is the source*. "Reproducibility" therefore reduces to **byte-for-byte verification of the published file against its SHA-256** (§14); there is no transform step to re-run. The in-app hash display is diagnostic only and is **not** a signature (§10).

---

## 4. WP1 — Zero-Egress (First-Executable Isolation)

The outbound-suppression guard lives in the first executable block (approx. lines **44–130**) and installs before the visible shell, the stylesheet, and the main application script. By the time any application code runs, the outbound surface is already locked. CSP is hash-pinned with `default-src 'none'` and `connect-src 'none'` (line 22); the runtime core enforces the same boundary defensively even if the meta CSP is bypassed at the platform level.

| Item | Line | CTRL+F string |
|------|------|---------------|
| Telemetry counters | 46 | `T={rtc:0` |
| Fail-closed if framed | 62 | `framed=window.top!==window.self` |
| fetch / XHR / WS / EventSource stubs | 86 | `R.fetch=rejectStub('fetch')` |
| Guard installation (lock) | 88 | `lock(window,'fetch'` |
| Prototype freeze | 95 | `Object.freeze(p);T.proto` |
| eval block | 96 | `R.eval=function(){` |
| Bounded self-check | 98 | `Bounded self-check: confirms guards stay locked` |
| Invariant tick | 113 | `function tick(){var inv=inspect()` |
| Frozen diagnostic API | 128 | `var api=Object.freeze({profile:` |

**What to test.**
- Confirm every outbound and code-execution channel is locked without exception: `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`, `sendBeacon`, `window.open`, `RTCPeerConnection`/`RTCDataChannel`, `Worker`/`SharedWorker`, `WebTransport`/`WebSocketStream`, `serviceWorker.register`, and `eval`.
- Locks use `Object.defineProperty(..., {writable:false, configurable:false})`. Central question: whether any locked handle can be **recovered or re-derived** — via `iframe.contentWindow`, prototype-chain reconstruction, `Reflect`, or a fresh realm. Same-origin child frames are themselves fail-closed (line 62).
- Confirm the bounded self-check (lines 98–113) genuinely reflects the locked state and cannot be satisfied by a partially-applied lock.
- **Disclosed residual:** a meta CSP cannot enforce `frame-ancestors`/`sandbox`, and top-level `location` navigation cannot be made immutable by in-page JS once arbitrary script execution is assumed (meta `security-limitations`, line 26). Production hosting is expected to set the response headers in §11.

---

## 5. WP2 / WP7 — Anti-Injection (Allowlist Dispatcher · VG473 Action Pipeline · Trusted Types)

The single most important area in the audit. The design uses **no `eval` and no `new Function`**; it parses only the `Namespace.method(args)` pattern against a frozen allowlist, and in v4.7.3 routes that through the hardened VG473 action pipeline and argument contract.

### 5-A. Allowlist and structural parser
**Lines: 962 – ~1,300**

| Item | Line | CTRL+F string |
|------|------|---------------|
| Frozen method allowlist | 962 | `const allowed = Object.freeze({` |
| VG473 action pipeline (new) | 1003 | `ANCHOR_START: VG473_ACTION_PIPELINE` |
| VG473 argument contract (new) | 1054 | `ANCHOR_START: VG473_ARG_CONTRACT` |
| Dangerous-token block regex | 1206 | `constructor|prototype|__proto__` |
| Main parser | 1271 | `function parse(action, el, ev){` |

**Tests.** Attempt to **bypass the structural parser or allowlist check** without tripping the dangerous-token regex (line 1206): whitespace/Unicode-homoglyph/concatenation tricks such as `window['fe'+'tch']`. Confirm `hasOwnProperty` membership so a polluted prototype cannot inject a phantom namespace (built-ins are frozen at line 95). **Argument-to-sink flow:** the allowlist validates the *method name*, not the *semantic effect of arguments* — review each allowlisted method reaching a destructive/reflective sink (e.g. anything routing to `ResetCenter.factory` or a full-wipe path) and confirm no such path is reachable with attacker-influenced arguments. Note the new namespace `BLEIdentity` (methods restricted to `['acknowledge']`).

### 5-B. VG473 URL policy + data-attribute allowlist (new in v4.7.3)
**Lines: 1,392 – 1,556**

| Item | Line | CTRL+F string |
|------|------|---------------|
| URL policy | 1392 | `ANCHOR_START: VG473_URL_POLICY` |
| Data-/aria-attribute allowlist | 1429 | `ANCHOR_START: VG473_DATA_ATTR_ALLOWLIST` |

**Tests.** v4.7.2 copied every `data-*`/`aria-*` attribute unconditionally; VG473-03 replaces that with an explicit allowlist (`VG473_DATA_ATTRS` / `VG473_ARIA_ATTRS`) — anything not listed is dropped. Confirm that no action-bearing attribute outside the allowlist survives a clone/paste/import path, and that the URL policy rejects `javascript:`, `data:text/html`, and `blob:` navigation. This directly narrows the "attribute-injection → destructive dispatch" surface; verify completeness against every runtime `setAttribute`/`dataset` write.

### 5-C. Trusted Types HTML sinks + single sanitize pass (new)
**Lines: 1,558 – ~1,620**

| Item | Line | CTRL+F string |
|------|------|---------------|
| Single sanitize pass (new) | 1558 | `ANCHOR_START: VG473_SINGLE_SANITIZE_PASS` |
| innerHTML setter patch | 1573 | `patchInnerHTML` |

**Tests (the hard part).** Assess resistance to mutation XSS (mXSS), nested-tag obfuscation (`<scr<script>ipt>`), SVG/MathML namespace confusion, and comment-boundary tricks. The single sanitize pass is intended to prevent double-sanitize re-parsing mutations — confirm no sink bypasses it (`insertAdjacentHTML`, `Range.createContextualFragment`, `<template>.content` routing). Determine whether a one-frame TOCTOU window exists before a hostile node becomes active.

---

## 6. WP6 — Data Sovereignty (Crypto Core · At-Rest Vault · Import Boundary)

### 6-A. Crypto core (V455Crypto)
**Lines: 11,293 – ~11,410**

| Item | Line | CTRL+F string |
|------|------|---------------|
| Iteration constant (V455 config) | 11,293 | `iterations:600000` |
| V455Crypto object | 11,334 | `const V455Crypto = Object.freeze({` |
| Encrypt with purpose-bound AAD | 11,349 | `additionalData:this.aad` |
| Legacy precheck (new, VG473) | 11,381 | `ANCHOR_START: VG473_LEGACY_PRECHECK` |

**Review points.** **PBKDF2 / 600,000 iterations / SHA-256 / AES-256-GCM** meets the OWASP recommendation. Confirm a **fresh 12-byte IV per encryption** (no reuse; maintainer records 32 distinct IVs across 32 encryptions). Confirm **AAD purpose-binding** is reconstructed identically on decrypt and that metadata tamper is rejected. The **VG473 legacy precheck (line 11,381)** hardens the backward-compatible decrypt path — confirm version/`it`/`alg` checks cannot be coerced to accept a weaker envelope (downgrade/confusion). Note a second PBKDF2 usage at line 9,080 (encrypted-export path); confirm it shares the same parameters.

### 6-B. At-rest encrypted vault
**Lines: 11,479 – ~11,600**

| Item | Line | CTRL+F string |
|------|------|---------------|
| Vault object | 11,479 | `const SecureVaultV455={` |
| Binding version gate | 11,493 | `bindingVersion===` |
| Atomic update | 11,542 | `atomicUpdate(mutator){` |
| Invalidate writes (epoch advance) | 11,556 | `invalidateWrites` |

**Tests.** Confirm `atomicUpdate` serialises concurrent mutators and a mutator observing a stale `writeEpoch` is dropped (guard against a delayed slider/threshold write restoring deleted data). Confirm destructive coordination (§7-DESTR) advances the epoch through `invalidateWrites` so a queued write cannot resurrect wiped state — the most subtle correctness property in the build; a targeted race harness is welcome. **Disclosed residual:** the vault is a single envelope, so a small write re-encrypts the whole sensitive state; record-per-envelope storage is deferred (§11).

### 6-C. Import boundary
**Lines: 11,180 – 11,240, 12,150, 7,298**

| Item | Line | CTRL+F string |
|------|------|---------------|
| Import limits | 11,180 | `importLimits:Object.freeze` |
| JSON shape validator | 11,193 | `function assertJsonShape` |
| Pet sanitiser | 11,201 | `function sanitizePet` |
| VG473A scope export | 11,218 | `ANCHOR_START: VG473A_SCOPE_EXPORT` |
| Typed plaintext-import approval | 12,150 | `Type IMPORT PLAINTEXT` |
| Hardened import entry point | 7,298 | `VitalGuardHardenedImport` |

**Tests.** `assertJsonShape` enforces max depth, node cap, circular-reference rejection, and a child ceiling (JSON-bomb / prototype-pollution defence; `__proto__` cannot traverse — built-ins frozen at line 95). `sanitizePet` forces every field through allowlist/range/length constraints. **Plaintext import requires explicit typed approval** (line 12,150). Confirm encrypted import decrypts and then **re-validates** through `assertJsonShape` (decrypted data is not implicitly trusted).

---

## 7. v4.7.3 Reinforcement Controls (VG473 / VG473A) — Newest, Least-Reviewed

v4.7.3 is an originator-initiated reinforcement build. The controls below are new relative to v4.7.1/v4.7.2 and should receive a dedicated pass. All carry the status **IMPLEMENTED-PENDING-INDEPENDENT-RETEST**.

| Control | Line | CTRL+F anchor | Intent / test focus |
|---|---|---|---|
| **VG473-01 BLE state machine** | 11,652 | `VG473_BLE_STATE_MACHINE` | Single authoritative clone/ambiguity state machine so **no routing path performs ad-hoc security-state assignment**; bounded block window derived centrally. Test: confirm every routing/normalization path consults this one authority and cannot self-assign a "trusted" state. |
| **VG473-03 data-attr allowlist** | 1,429 | `VG473_DATA_ATTR_ALLOWLIST` | Only listed `data-*`/`aria-*` attributes are copied; others dropped. Test: no action-bearing attribute survives clone/import outside the allowlist. |
| **VG473 single sanitize pass** | 1,558 | `VG473_SINGLE_SANITIZE_PASS` | Prevents double-sanitize re-parse mutation. Test: mXSS across all HTML sinks. |
| **VG473 URL policy** | 1,392 | `VG473_URL_POLICY` | Rejects `javascript:`/`data:text/html`/`blob:` navigation. Test: URL-scheme bypasses. |
| **VG473 action pipeline / arg contract** | 1,003 / 1,054 | `VG473_ACTION_PIPELINE` / `VG473_ARG_CONTRACT` | Formalises the dispatch/argument contract. Test: argument-boundary and pipeline-order bypasses. |
| **VG473 capability-drift guard** | 7,327 | `VG473_CAPABILITY_DRIFT` | Detects mismatch between claimed and implemented transport capability. Test: whether the machine manifest and runtime agree. |
| **VG473 legacy precheck** | 11,381 | `VG473_LEGACY_PRECHECK` | Hardens legacy-envelope decrypt. Test: downgrade/version confusion. |
| **VG473 security self-test** | 12,843 | `VG473_SECURITY_SELFTEST` | Boot-time self-test of security invariants (incl. passphrase-policy weak-vector check at line 12,820). Test: that a failed invariant is surfaced, not swallowed. |
| **VG473A repairs (self-audit)** | 37 | `VG473A_REINFORCEMENT_LOG` | Four correctness repairs found by static self-audit (e.g. a ReferenceError that skipped `App.resetTimers()` after a vault reload; unreachable `v41ZoneRank`/`v41EnsureAlertPrefs`). Test: no security control depends on a path made reachable/unreachable by these fixes in an unintended way. |

**RP — Rescue Pack replay guard.** Lines **~12,044–12,130** (CTRL+F `ReplayHash`, `v455SanitizeSignature` at 12,113). Confirm the ledger stores **only SHA-256 hashes of the jti with capped expiry**, never a raw jti; that the bounded ledger has a real upper bound; and that profile-local and encrypted-compatibility ledgers cannot disagree to allow a single-use token to replay. **Disclosed residual:** best-effort, browser-profile-local — clearing site data removes it.

**PP — Passphrase policy.** Lines **12,475–~12,500** (CTRL+F `VitalGuardPassphrasePolicyV469`). Confirm the creation-strength gate (min length, no control chars, no repeated/common/sequential patterns, four distinct normalised words or high-variety path) applies to **new** passphrases and not to **legacy** unlock. Probe NFKC/locale-casing normalisation bypasses of the distinct-word count.

**BQ — BLE duplicate-binding quarantine.** Line **11,493** (routing eligibility) with the VG473-01 state machine. Confirm two records with the same exact local device ID are **never routed** and both quarantined; imported metadata cannot self-promote to bound without on-device re-registration. **Disclosed residual:** generic BLE advertisements are not cryptographically authenticated — advisory, fail-closed only, never life-critical.

**DESTR — Destructive coordination.** Reset Center at **8,907**; persistence generation guard `beforeClearAll` at **11,623** (`VitalGuardPersistence` at 11,622). Confirm full wipe removes app IndexedDB stores, all `vg41_` records, language keys, the replay ledger, and the vault fallback; that persistence is blocked during wipe and unblocked after; and that no debounced write scheduled before the wipe survives it. Test together with §6-B.

---

## 8. Secondary Areas — Lighter Review Sufficient

- **Signal math** (Kalman RSSI smoothing / distance estimator) — approx. lines **2,735–~2,910** (CTRL+F `Kalman`). Civilian proximity smoothing; review numerical stability (division-by-zero, NaN, divergence). No military-use vector.
- **On-device AI** — approx. lines **8,507–~8,700** (CTRL+F `KNNLite`, `IsolationForestLite`). Unsupervised, on-device, no model download and no remote inference — consistent with WP1. Confirm learned weights stay local.
- **BLE scan filters / permission boundary** — approx. lines **~5,907–6,040** (CTRL+F `startScan`). Advertisement receive/scan-filter construction; confirm no received advertisement data leaves the device (WP1).
- **CSPRNG local record IDs** — `function genLocalIdSuffix` at line **1,789** (uses `crypto.getRandomValues`); light confirmation only.

---

## 9. Supply-Chain — Embedded Third-Party Component

The **only** third-party component is the Project Nayuki QR generator (MIT), vendored inline (CTRL+F `qrcodegen`; `third-party-license` meta at line 20). Used for offline QR rendering of the encrypted Rescue Pack; performs no I/O. Checks: confirm the vendored source matches an upstream Nayuki release (or that any modification is documented) and that it is reached only through the allowlisted dispatcher. Dependency posture is best stated as **zero network/runtime dependency, with one inline MIT-licensed rendering component**.

---

## 10. Disclosed Residual Risks (Confirm, Not Discover)

Flagged proactively; recorded in the in-file meta tags and not claimed to be resolved.

- **Meta-CSP limits:** `frame-ancestors`/`sandbox` cannot be enforced from a meta tag; the in-file frame guard (line 62) is defence-in-depth, and production hosting must set the response headers in §11 (meta `security-limitations`, line 26).
- **Capability-scope wording (corrected in v4.7.3, verify):** unlike v4.7.1, the visible copy now states that autonomous relay, mesh routing and autonomous SOS relay are **not implemented** (approx. lines 434 / 516 region), and a machine-readable manifest (`capability-scope-machine`, line 30) plus the VG473 capability-drift guard (line 7,327) document the true boundary. Reviewers should confirm the visible copy, the machine manifest, and the runtime capability object agree.
- **Single-envelope vault:** small writes re-encrypt the full sensitive state; record-per-envelope storage is deferred (§11).
- **Replay ledger** is best-effort and browser-profile-local; clearing site data removes it.
- **Advertisement-only BLE identity** is spoofable and is not cryptographic authentication.
- **localStorage quota handling remains partial** — most `setItem` paths do not handle `QuotaExceededError`; low-storage devices may fail writes silently. Recommended for a future build.
- **Detached SHA-256 is not a signature.** The in-app hash is diagnostic only; the whole-file hash must be verified against a manifest delivered over an independent trusted channel.

---

## 11. Deployment Requirements (Verify at Hosting)

In-page guards are defence-in-depth; full protection assumes the hosting environment also sets:

- `Content-Security-Policy: frame-ancestors 'none'`
- `X-Content-Type-Options: nosniff`
- a restrictive `Permissions-Policy`
- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Resource-Policy: same-origin`
- a clean, dedicated origin with no pre-existing uncontrolled Service Worker
- authenticated release-manifest delivery (the SHA-256 in §0 delivered over an independent trusted channel)

---

## 12. Out-of-Scope Areas (Integrity Check Only)

| Area | Location | Rationale |
|------|----------|-----------|
| Inline stylesheet | after the first-executable core | Static; no executable logic; CSP hash covers integrity |
| Static UI markup | body shell | `data-vg-*` attributes are validated at runtime by the WP7 dispatcher and VG473 data-attr allowlist |
| I18N translation strings | I18N block | Static localisation text (seven dictionaries + Arabic RTL) |
| CSPRNG local record IDs | line 1,789 | Uses `crypto.getRandomValues`; light confirmation only |

---

## 13. Internal Identifier Provenance

A whitebox pass will observe internal identifiers such as `V455…` / `V469…` / `VG473…` (storage keys like `__vg_vault_v455__`, `vg_rp_replay_v469`; functions such as `v469ReplayHash`) alongside historical change markers in comments. These are **intentionally preserved**: they encode module lineage and the point at which each control was introduced; renaming would break runtime references and erase accurate history. The v4.7.3 change register (VG473-01 … and the VG473A repairs) is described in the companion Code Map. Documented here so the naming is not logged as an inconsistency finding.

---

## 14. Reproducibility & Verification

The artifact is a single hand-authored file with no build pipeline; verification is direct:

1. Obtain the release file and its published SHA-256 through an independent trusted channel.
2. Compute the local hash and compare:
   ```bash
   sha256sum VitalGuard_AI_complete_V47_3.html
   # expected:
   # b81c067f5523bc68728ae84f2fc93ce05077705ae4cb7e882f1c859885f47615
   ```
3. If the hashes match, the file is byte-for-byte identical to the audited artifact and every line number in this map applies. If they differ, treat the file as a different artifact and re-anchor via the CTRL+F strings and `VG473_*` anchors.

---

## 15. Highest-Uncertainty Areas — Where External Review Is Most Valuable

Requested focused, adversarial attention, in priority order:

1. **Recoverability of the locked egress handles** (line 88 region) — whether any of `fetch`, RTC, Worker, `eval`, etc. can be re-derived from another realm or via prototype reconstruction.
2. **Injection pipeline & data-attribute allowlist completeness** (lines 962–1090, 1429, 1558) — reaching a namespace/method outside the frozen allowlist, an attacker-influenced argument reaching a destructive sink, or an action-bearing attribute surviving the allowlist.
3. **Trusted Types / single sanitize pass** (line 1,558–1,600) — mXSS, `<template>.content` routing, TOCTOU windows.
4. **Vault write-epoch race** (lines 11,542, 11,556 with §6-B) — whether a delayed write can resurrect deleted or wiped data under concurrency.
5. **Legacy envelope decrypt / precheck** (line 11,381) — downgrade or version-confusion in backward-compatible decryption.

Additional context, build-environment detail, or targeted test harnesses will be provided on request.

---

*Prepared by Morgan J. (Gyu-min Jeon) — VitalGuard / M-Corp Ethical AI.*
*Licence: Apache-2.0 © mcorpai.org (Creator: ROK and Morgan J.). The embedded Project Nayuki QR generator retains its original MIT notice.*
