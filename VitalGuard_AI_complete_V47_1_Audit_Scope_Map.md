### I do not rely on external libraries. I design and implement my own modules.

**Many software projects do not provide comprehensive code documentation because they do not have direct control over external libraries. When a security vulnerability is discovered, responsibility for fixing the library lies with its maintainers, limiting how quickly application developers can respond.**

**Can software that depends heavily on external libraries truly be considered open source? Can reviewers understand the entire codebase at a glance? True transparency means openly disclosing the code's known limitations, weaknesses, and design trade-offs.**

## Required Reading: Precision-Mapped Attack Surface for Adversarial Review
## VitalGuard AI v4.7.1 — Security Audit Scope Map (Simple update process)
### High-Priority ~900 Lines · WP1 / WP2 / WP6 / WP7 + V4.6.x Hardening Surfaces

### If you have any questions, requests, or areas requiring clarification, I would be glad to cooperate at any time.

* **Research paper:** VitalGuard Offline AI (PDF) — https://mcorpai.org/VitalGuard_Offline_AI.pdf

* **You can see how much the project has improved by comparing it with the initial version.**

* This project was independently designed and built by a single developer (myself). Although every effort has been made to ensure its quality and security, independent security review is essential to strengthen its long-term reliability and resilience.

Initial Release (v1.0, July 2025) https://github.com/jekymin8232/luckyvicky-homepage/blob/main/VitalGuard%20AI_complete_V10.html

* **VitalGuard AI v4.6.9 Full Source Code**
https://github.com/jekymin8232/vitalguardai-com/blob/main/VitalGuard_AI_complete_V46_9.html

* **VitalGuard AI V4.7.1 Full Source Code**
https://github.com/jekymin8232/vitalguardai-com/blob/main/VitalGuard_AI_complete_V47_1.html

### **File:** `VitalGuard_AI_complete_V47_1.html` — single-file, offline-first HTML application

- **Release:** V4.7.1 — the current baseline submitted for audit

- **Whole-file SHA-256:** `650b2cf89f029f36ba1e8e728178efda4c17e4cb1d0b9fd985119806013319c7`

- **Size / lines:** 612,237 bytes · 11,582 lines

* **For a complete code and architecture overview, please refer to the Code Map:**
  https://github.com/jekymin8232/vitalguardai-com/blob/main/VitalGuard_AI_complete_V47_1_Code_Map.md

**The potential of offline AI built entirely with pure vanilla technologies is virtually limitless.**

---

> **A note on this document.**
> **Trust comes from timely updates and thorough verification.**
>
> During the months awaiting audit assignment, the maintainer used the time to strengthen the codebase considerably; the current baseline consolidates the strongest verified controls the project has produced, so that review effort can concentrate on its most current and most defensible version. A security audit is most effective when the project discloses its own uncertainties first, rather than waiting for the vendor to discover them independently. This map identifies, line by line, every area considered security-sensitive — including the parts where uncertainty is highest. All CTRL+F strings below are verbatim extracts from the shipped source file; paste them directly into a text editor to jump to the exact location.

---

## 0. At-a-Glance — Audit Priority Map

| WP | Domain | Core Line Range | Est. Volume | Priority |
|----|--------|-----------------|-------------|----------|
| **WP1** | Zero-Egress — first-executable network/frame/RTC/worker/eval isolation | **46–133** + policy regex **903** | ~90 lines | Highest |
| **WP2 / WP7** | Anti-Injection — allowlist action dispatcher + Trusted Types sinks | **851–1000** | ~150 lines | Highest |
| **WP6-a** | Crypto core — PBKDF2/AES-GCM-256 + purpose-bound AAD | **10,485–10,560** | ~75 lines | Highest |
| **WP6-b** | At-rest encrypted vault — atomic writes + write-epoch race guard | **10,567–10,660** | ~95 lines | Highest |
| **WP6-c** | Import boundary — schema/depth/size validation + typed plaintext gate | **10,388–10,440**, **10,900–10,920**, **6,699** | ~90 lines | High |
| **RP** | Rescue Pack replay guard — hashed bounded JTI ledger | **10,803–10,890** | ~85 lines | High |
| **PP** | Passphrase policy — distinct-word + weak-pattern enforcement | **11,178–11,200** | ~25 lines | High |
| **BQ** | BLE duplicate-binding quarantine — fail-closed routing | **10,889–11,060** | ~170 lines | High |
| **DESTR** | Destructive coordination — Reset Center + persistence generation guard | **8,116–8,180**, **11,447–11,476** | ~100 lines | High |
| Secondary | Signal math — Kalman / distance estimator | **3,744–3,918** | ~175 lines | Medium |
| Secondary | On-device AI — IsolationForest / KNN / RLS | **7,810–7,915** | ~105 lines | Medium |
| Secondary | BLE scan filters / permission boundary | **5,222–5,310** | ~90 lines | High |
| Supply-chain | Embedded Project Nayuki QR generator (MIT) | **4,155–~4,900** | provenance | Integrity check |

> **Bottom line.**
> 1. **No external CDNs or external domains.** A full-file sweep finds no active external resources; `connect-src 'none'` is declared in the meta CSP (line 33) and enforced at runtime by the first-executable core.
> 2. **~80% of audit effort should concentrate on WP1, WP2/WP7 and the three WP6 blocks (~500 lines combined).** The V4.6.x hardening surfaces (replay guard, passphrase policy, BLE duplicate-binding, destructive coordination) are the most recent additions and warrant close attention as a second tier.
> 3. **One embedded third-party component** (Nayuki QR, MIT) exists inline; it is the only supply-chain surface and is called out separately in §6.

---

## 1. WP1 — Zero-Egress (First-Executable Network / Frame / RTC / Worker / eval Isolation)

The entire outbound-suppression guard lives in **script[0]**, the first executable block (lines 46–133), and installs before the visible shell, the stylesheet, and the main application script. This ordering is itself a control: by the time any application code runs, the outbound surface is already locked. The CSP model is **hash-pinned scripts with `default-src 'none'` and `connect-src 'none'`** (line 33); the runtime core below enforces the same boundary defensively even if the meta CSP is bypassed at the platform level.

### 1-A. First-executable hardening core — **Highest-priority detailed review**
**Lines: 46 – 133**

| Item | Line | CTRL+F string (paste as-is) |
|------|------|-----------------------------|
| Telemetry counters | 49 | `var T={rtc:0,worker:0,egress:0` |
| Fail-closed if framed | 65 | `framed=window.top!==window.self` |
| RTC family lock | 81 | `'RTCPeerConnection','webkitRTCPeerConnection'` |
| Worker / SharedWorker lock | 83 | `R.worker=throwStub('Worker','worker')` |
| WebTransport / WebSocketStream lock | 85 | `'WebTransport','WebSocketStream'` |
| fetch / XHR / WS / EventSource stubs | 89 | `R.fetch=rejectStub('fetch')` |
| Guard installation (lock) | 91 | `lock(window,'fetch',R.fetch)` |
| sendBeacon override | 92 | `R.beacon=function(){T.egress++` |
| serviceWorker.register block | 94 | `R.swreg=rejectStub('serviceWorker.register'` |
| Prototype freeze | 98 | `Object.freeze(p);T.proto++` |
| eval block | 99 | `R.eval=function(){T.evalc++` |
| Post-install invariant check | 106 | `['fetch.locked',locked(window,'fetch'` |
| Frozen diagnostic API | 131 | `var api=Object.freeze({profile:'v4.7.1'` |

**What to test.**
- Confirm every outbound and code-execution channel is locked without exception: `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`, `sendBeacon`, `window.open`, `RTCPeerConnection` / `RTCDataChannel`, `Worker` / `SharedWorker`, `WebTransport` / `WebSocketStream`, `serviceWorker.register`, and `eval`. Workers are locked because they own a separate fetch scope (inline comment at line 82).
- The locks are applied via a `lock()` helper intended to make each property non-configurable and non-writable. The central question is whether any locked handle can be **recovered or re-derived** — e.g. via `iframe.contentWindow.fetch`, prototype-chain reconstruction, `Reflect`, or importing a fresh realm. Note that same-origin child frames are themselves fail-closed (line 65), which is part of the intended defence-in-depth.
- Confirm the post-install invariant check (line 106) genuinely reflects the locked state and cannot be satisfied by a partially-applied lock.
- **Disclosed residual (please confirm, do not treat as undisclosed):** a meta CSP cannot enforce `frame-ancestors` or `sandbox`, and top-level `location` navigation cannot be made immutable by in-page JavaScript once arbitrary script execution is assumed. See the `security-limitations` meta tag (line 36). Production hosting is expected to set response headers (see §7).

### 1-B. Action-policy egress token gate (parse-time)
**Line: 903 (single regex line)**
CTRL+F: `if(/constructor|prototype|__proto__`

This regex runs inside the action-policy parser *before* any dispatched call executes, so it is an intersection of WP1 and WP7. It blocks `fetch(`, `import(`, `Function(`, `eval(`, `XMLHttpRequest`, `WebSocket`, `EventSource`, `sendBeacon`, `localStorage`, `indexedDB`, `document.cookie`, `document.write`, `window.open`, and `location =`. Recommended testing: regex bypass via whitespace, Unicode homoglyphs, or string-concatenation such as `window['fe'+'tch']`, and confirmation that the parser rejects rather than best-effort-sanitizes on match.

---

## 2. WP2 / WP7 — Anti-Injection (Allowlist Dispatcher + Trusted Types)

This block (lines 851–1000) is **the single most important area in the audit** — it is the core of the XSS and DOM-injection defence. The design deliberately uses **no `eval` and no `new Function`**; it parses only the `Namespace.method(args)` pattern and checks it against a frozen allowlist.

### 2-A. Allowlist and structural parser — **Core penetration-test target**
**Lines: 851 – 912**

| Item | Line | CTRL+F string |
|------|------|---------------|
| Frozen method allowlist | 851 | `const allowed = Object.freeze({` |
| Main parser | 901 | `function parse(action, el, ev){` |
| Dangerous-token block regex | 903 | `if(/constructor|prototype|__proto__` |
| Allowlist membership check | 906 | `if(!Object.prototype.hasOwnProperty.call(allowed,ns)` |
| Frozen policy export | 912 | `return Object.freeze({normalize,parse,isAllowedAction,invoke});` |

**The single most important test.**
The primary attack objective is to **bypass the structural parser or the allowlist check** without tripping the dangerous-token regex (line 903). Verify argument-boundary handling: can a crafted argument cause a call to resolve to a namespace/method outside the frozen allowlist? Confirm that `hasOwnProperty` is used against `allowed` (line 906) so a polluted prototype cannot inject a phantom namespace — note that built-in prototypes are already frozen in the first-executable core (line 98), which this check depends on.

**Argument-to-sink data flow (the hard part of WP7).**
The allowlist validates the *method name*, not the *semantic effect of arguments*. Review each allowlisted method that reaches a destructive or reflective sink — in particular anything routing to `ResetCenter.factory`, a full-wipe path, or a DOM-writing method — and confirm no such path is reachable with attacker-influenced arguments.

### 2-B. Trusted Types HTML-sink patches — **WP2 core**
**Lines: 984 – 1000**

| Item | Line | CTRL+F string |
|------|------|---------------|
| innerHTML setter patch (Element + HTMLElement) | 984 | `patchInnerHTML(Element && Element.prototype)` |
| insertAdjacentHTML patch | 989 | `Element.prototype.insertAdjacentHTML = function(pos, html)` |
| Range.createContextualFragment patch | 996 | `Range.prototype.createContextualFragment = function(html)` |

**What to test (the hard part).**
- The HTML neutraliser routes writes through a Trusted Types policy (`trusted-types vitalguard-html`, `require-trusted-types-for 'script'` in the CSP). Assess resistance to mutation XSS (mXSS), nested-tag obfuscation (`<scr<script>ipt>`), SVG/MathML namespace confusion, and comment-boundary tricks.
- The `innerHTML` setter is patched at the prototype level. Assess whether the descriptor may be non-configurable in certain engines, whether an `Element.prototype` vs `HTMLElement.prototype` mismatch leaves a gap, or whether `<template>.content` routing bypasses the patch.
- Determine whether any DOM-scrub / MutationObserver step fires *before* a hostile node becomes active, or whether a one-frame TOCTOU window exists.
- Confirm that `data:` / `blob:` URL handling does not permit navigation to `data:text/html` or `blob:` in a new context — this intersects with WP1.

---

## 3. WP6 — Data Sovereignty (Crypto Core · At-Rest Vault · Import Boundary)

Sensitive state is held in an **at-rest encrypted vault** with atomic, serialized writes and a write-epoch race guard; encrypted export/backup uses the same crypto core. All key material is passphrase-derived and never leaves the device.

### 3-A. Crypto core (V455Crypto) — **Core cryptographic review**
**Lines: 10,485 – 10,560**

| Item | Line | CTRL+F string |
|------|------|---------------|
| Iteration constant | 10,445 | `iterations:600000` |
| V455Crypto object | 10,485 | `const V455Crypto = Object.freeze({` |
| Key derivation (PBKDF2 → AES-GCM-256) | 10,493 | `crypto.subtle.deriveKey({name:'PBKDF2'` |
| Fresh salt (16) + IV (12) per encrypt | 10,497 | `const salt=crypto.getRandomValues(new Uint8Array(16)), iv=crypto.getRandomValues(new Uint8Array(12))` |
| Encrypt with purpose-bound AAD | 10,500 | `crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:this.aad(meta)}` |
| Envelope v3 strict validation | 10,504 | `env.kdf!=='PBKDF2-SHA-256'||Number(env.it)!==V455.iterations` |
| Legacy v1/v2 decrypt path | 10,513 | `Unsupported legacy encrypted backup` |

**Cryptographic review points.**
- **PBKDF2 / 600,000 iterations / SHA-256 / AES-256-GCM** meets the OWASP recommendation for SHA-256; this is a verifiable strength worth citing in the report.
- Confirm a **fresh 12-byte IV on every encryption** (line 10,497). GCM nonce reuse is catastrophic; confirm no code path reuses an IV. (The Code Map records a test producing 32 distinct IVs across 32 encryptions.)
- **AAD purpose-binding** (line 10,500): the additional-authenticated-data ties each ciphertext to its declared purpose/metadata. Confirm the AAD is reconstructed identically on decrypt (line 10,509 region) and that metadata tamper is rejected.
- Review the **legacy v1/v2 decrypt path** (lines 10,513–10,517). Backward-compatible decryption of older envelopes is a common place for downgrade or confusion issues; confirm the version/`it`/`alg` checks cannot be coerced to accept a weaker envelope than intended.
- Passphrase memory residency after derivation is not fully controllable in browser JS; worth a note rather than a finding.

### 3-B. At-rest encrypted vault — **race and durability review**
**Lines: 10,567 – 10,660**

| Item | Line | CTRL+F string |
|------|------|---------------|
| Vault object | 10,567 | `const SecureVaultV455={` |
| Serialized write state | 10,568 | `writeQueue:Promise.resolve(), writeEpoch:0, writeBlocked:false` |
| Atomic update | 10,630 | `atomicUpdate(mutator){` |
| Invalidate writes (epoch advance) | 10,644 | `async invalidateWrites(){this.writeBlocked=true;this.writeEpoch++` |

**What to test.**
- The vault is a **single encrypted envelope** committed atomically; there is no partial-state window by design. Confirm `atomicUpdate` (line 10,630) genuinely serializes concurrent mutators and that a mutator observing a stale `writeEpoch` is dropped (the intended guard against a delayed slider/threshold write restoring deleted data).
- Confirm the destructive coordination in §DESTR (delete/wipe) correctly advances the epoch through `invalidateWrites` (line 10,644) so that a queued write cannot resurrect wiped state. This is the most subtle correctness property in the build; a targeted race harness is welcome here.
- **Disclosed residual:** because the vault is one envelope, a small write re-encrypts the whole sensitive state. Record-per-envelope storage is intentionally deferred (see §7 and Code Map §11).

### 3-C. Import boundary (schema / depth / size / typed plaintext gate)
**Lines: 10,388 – 10,440, 10,900 – 10,920, 6,699**

| Item | Line | CTRL+F string |
|------|------|---------------|
| Import limits | 10,388 | `importLimits:Object.freeze({maxFileBytes:1048576` |
| JSON shape validator (depth/nodes/circular/child-cap) | 10,400 | `function assertJsonShape(x,maxDepth,maxNodes){` |
| Pet sanitiser (32 KB ceiling) | 10,408 | `function sanitizePet(pd){` |
| Typed plaintext-import approval | 10,916 | `Type IMPORT PLAINTEXT exactly` |
| Hardened import entry point | 6,699 | `if(window.VitalGuardHardenedImport){ return window.VitalGuardHardenedImport(ev); }` |

**What to test.**
- `assertJsonShape` (line 10,400) enforces max depth, a node cap, circular-reference rejection via `WeakSet`, and a 1,000-child ceiling — the intended defence against JSON-bomb and prototype-pollution inputs. Confirm a `__proto__` key in import data cannot trigger prototype traversal (note built-in prototypes are frozen at line 98).
- `sanitizePet` (line 10,408) forces every field through allowlist/range/length constraints with a 32 KB per-entry ceiling. Whether the trust boundary is drawn cleanly and completely at the import point is the central WP6 question.
- **Plaintext import requires an explicit typed approval** ("IMPORT PLAINTEXT", line 10,916), gated behind a danger confirmation. Confirm there is no code path that imports plaintext without this gate, and that encrypted import decrypts and then re-validates through `assertJsonShape` (decrypted data is not implicitly trusted).
- Voice/audio data-URL handling has a bounded character ceiling (`maxVoiceDataUrlChars`, line 10,388). Assess post-`atob` size expansion.

---

## 4. V4.6.x Hardening Surfaces (Most Recent Additions)

These controls are the most recent additions to the codebase and are therefore the least externally reviewed. They are grouped here so the vendor can budget a dedicated pass.

### 4-A. Rescue Pack replay guard
**Lines: 10,803 – 10,890**

| Item | Line | CTRL+F string |
|------|------|---------------|
| Rescue Pack v2 with jti nonce | 10,806 | `const pack={v:2,jti:v455RandomId(16)` |
| jti format validation | 10,812 | `if(!/^[0-9a-f]{32}$/i.test(String(pack.jti` |
| Profile-local replay key | 10,819 | `const V469_REPLAY_KEY='vg_rp_replay_v469'` |
| Replay hash (SHA-256 of jti) | 10,822 | `async function v469ReplayHash(jti){return V455Crypto.sha256Text('VitalGuard|VG-RP2|replay|'` |
| Replay-seen check | 10,823 | `async function v455ReplaySeen(jti){` |

**What to test.** Confirm the ledger stores **only SHA-256 hashes of the jti with a capped expiry** and never writes a raw jti locally; that the bounded ledger has a genuine upper bound (no unbounded growth); and that the encrypted-setting compatibility ledger and the profile-local ledger cannot disagree in a way that allows a single-use token to be replayed. **Disclosed residual:** the ledger is best-effort and browser-profile-local — clearing site data removes it. This is a documented limitation, not a claimed guarantee.

### 4-B. Passphrase policy (distinct-word + weak-pattern)
**Lines: 11,178 – 11,200**

| Item | Line | CTRL+F string |
|------|------|---------------|
| Repeated-pattern rejection | 11,183 | `if(/^(.)\1+$/u.test(compact)` |
| Common/project-term + sequence rejection | 11,184 | `if(/password|passphrase|qwerty|admin` |
| Four-distinct-word rule | 11,188 | `if(new Set(normalized).size<4)return {ok:false,why:'repeated word'}` |
| Frozen policy export | 11,198 | `window.VitalGuardPassphrasePolicyV469=Object.freeze` |

**What to test.** Confirm the creation-strength gate (min 16 chars, no control chars, no repeated/common/sequential patterns, and either four distinct normalized words or a high-variety non-word path) is applied to **new** sensitive passphrases, and that unlocking a **legacy** vault deliberately does not re-apply the gate (so existing users are not locked out). Probe for normalization bypasses (NFKC / locale-casing) that could let near-duplicate words pass the distinct-word count.

### 4-C. BLE duplicate-binding quarantine (fail-closed routing)
**Lines: 10,889 – 11,060**

| Item | Line | CTRL+F string |
|------|------|---------------|
| Imported signatures stay unbound (rebind-required) | 10,890 | `function v455SanitizeSignature(s){` |
| Routing eligibility check | 10,966 | `sig.bindingVersion==='v455-local-exact'` |
| Exact-binding-first routing | 11,026 | `/* V4.6.8 (VG468-02, retained in V4.6.9` |

**What to test.** Confirm that two records with the same exact local browser device ID are **never routed** and are both quarantined for local re-registration; that imported metadata cannot self-promote to a bound state without on-device re-registration; and that exact-binding is resolved before clone-candidate scoring. **Disclosed residual (important):** generic BLE advertisements are not cryptographically authenticated; advertisement-only identity is spoofable and is used only for advisory, fail-closed directional guidance — never for life-critical decisions.

### 4-D. Destructive coordination (Reset Center + persistence generation guard)
**Lines: 8,116 – 8,180, 11,447 – 11,476**

| Item | Line | CTRL+F string |
|------|------|---------------|
| Reset Center | 8,116 | `const ResetCenter = {` |
| Factory reset action | 8,175 | `data-vg-onclick="ResetCenter.factory()"` |
| beforeClearAll (generation advance) | 11,467 | `async function beforeClearAll(){blocked=true;generation++` |
| Frozen persistence API | 11,476 | `window.VitalGuardPersistenceV469=api` |

**What to test.** Confirm full wipe removes app IndexedDB stores, all `vg41_` records, language keys (`vg_lang_v41` / `vg_lang_v412`), the replay ledger (`vg_rp_replay_v469`), and the vault fallback; that persistence is *blocked during* wipe and *unblocked after* so a fresh post-wipe session can save normally; and that no debounced write scheduled before the wipe survives it. This is the counterpart to the vault write-epoch guard in §3-B and should be tested together.

---

## 5. Secondary Areas — Lighter Review Sufficient

### 5-A. Signal math filters
**Lines: 3,744 – 3,918** — Kalman RSSI smoothing and RSSI-to-distance estimation. No military-use vector (civilian pet-proximity smoothing). Review numerical stability: division-by-zero, NaN propagation, filter divergence. Deterministic and white-box, consistent with the project's transparency principle.

### 5-B. On-device AI
**Lines: 7,810 – 7,915** — IsolationForest / KNN / RLS ensemble (CTRL+F: `class IsolationForestLite` / `p.ai4={knn:new KNNLite`). Unsupervised, on-device, no model download and no remote inference — consistent with WP1. Confirm learned weights remain local only.

### 5-C. BLE scan filters / permission boundary
**Lines: 5,222 – 5,310** — advertisement receive listener and scan-filter construction. If any register/wizard branch receives advertisements without signature filtering, note that it is transient, consent-gated, and — confirmed by WP1 zero-egress — that no received advertisement data leaves the device.

---

## 6. Supply-Chain — Embedded Third-Party Component

**Lines: 4,155 – ~4,900** · CTRL+F: `Offline embedded library: Project Nayuki QR Code generator (MIT License).` and `var qrcodegen;`

This is the **only** third-party component in the file, vendored inline under the MIT License (declared in the `third-party-license` meta tag, line 32). It is used for offline QR rendering of the encrypted Rescue Pack and performs no I/O. Suggested checks: confirm the vendored source matches an upstream Nayuki release without local modification (or that any modification is documented), and confirm it is reached only through the allowlisted dispatcher. For accuracy of framing: the project's "zero dependency" property is best stated as **zero network/runtime dependency, with one inline MIT-licensed rendering component** — this document states the boundary explicitly so it is not perceived as an undisclosed dependency.

---

## 7. Disclosed Residual Risks (Confirm, Not Discover)

The maintainer flags the following proactively; they are recorded in the in-file meta tags and Code Map §10 and are not claimed to be resolved.

- **Meta-CSP limits:** `frame-ancestors` and `sandbox` cannot be enforced from a meta tag; the in-file frame guard (line 65) is defence-in-depth, and production hosting must set the response headers listed below. Top-level `location` navigation cannot be made immutable by in-page JS once arbitrary script execution is assumed (meta `security-limitations`, line 36).
- **Capability-scope wording mismatch (please read):** the visible product copy still uses Swarm / Mesh / SOS-relay language, but the artifact implements only **passive BLE advertisement reception, local processing, and manual encrypted hand-off** — not BLE transmission, GATT relay, mesh routing, autonomous self-organization, or autonomous SOS relay. A nonvisual capability manifest documents the true boundary (meta `capability-scope`, line 39). Because this release freezes UX/copy, the visible mismatch is a **deliberately retained residual**; visible-copy correction is scheduled for a subsequent release.
- **Single-envelope vault:** small writes re-encrypt the full sensitive state; record-per-envelope storage is deferred (Code Map §11).
- **Replay ledger** is best-effort and browser-profile-local; clearing site data removes it.
- **Advertisement-only BLE identity** is spoofable and is not cryptographic authentication.
- **Detached SHA-256 is not a signature.** The in-app hash is diagnostic only; the whole-file hash must be verified against a manifest delivered over an independent trusted channel (meta `release-integrity`, line 37).

**Required deployment headers (verify at hosting):** `Content-Security-Policy: frame-ancestors 'none'`; `X-Content-Type-Options: nosniff`; a restrictive `Permissions-Policy`; `Cross-Origin-Opener-Policy: same-origin`; `Cross-Origin-Resource-Policy: same-origin`; a clean dedicated origin with no pre-existing uncontrolled Service Worker; and authenticated release-manifest delivery.

---

## 8. Out-of-Scope Areas (Integrity Check Only)

| Area | Location | Rationale |
|------|----------|-----------|
| Inline stylesheet | line 135 onward | Static; no executable logic; CSP hash covers integrity |
| Static UI markup | body shell | `data-vg-on*` attributes are validated at runtime by the WP7 dispatcher (§2) |
| I18N translation strings | I18N block (line 1,439 onward) | Static localisation text (seven dictionaries + Arabic RTL) |
| CSPRNG local record IDs | line 1,193 (`function genLocalIdSuffix(len){`) | Uses `crypto.getRandomValues`; light confirmation only |

---

## 9. Internal Identifier Provenance

Reviewers performing a whitebox pass will observe internal identifiers that read `V455…` / `V469…` (for example storage keys `__vg_vault_v455__`, `vg_rp_replay_v469`; functions such as `v469ReplayHash`), together with historical change markers in comments (for example `VG468-02`). These identifiers are **intentionally preserved**: they encode the internal module lineage and the point at which each control was introduced, and renaming them would break runtime references and erase accurate history. They are documented here so the naming is not logged as an inconsistency finding. The corresponding functional change register (VG469-01 … VG469-09) is described in Code Map §2.

---

## 10. Vendor-Facing One-Page Summary

The high-priority surface concentrates in a small number of tight blocks: the **first-executable Zero-Egress core (lines 46–133)**, the **allowlist action dispatcher + Trusted Types sinks (lines 851–1000)**, the **crypto core (10,485–10,560)**, the **at-rest encrypted vault (10,567–10,660)**, and the **import boundary (10,388–10,440)**. A second tier covers the V4.6.x hardening surfaces: the **replay guard (10,803–10,890)**, **passphrase policy (11,178–11,200)**, **BLE duplicate-binding quarantine (10,889–11,060)**, and **destructive coordination (8,116–8,180 + 11,447–11,476)**. The file contains **no external CDNs or domains** and **one inline MIT component** (Nayuki QR, §6).

The points where external, adversarial review is considered most valuable — the project's highest areas of uncertainty — are:

1. **Recoverability of the locked egress handles** (line 91 region) — whether any of `fetch`, RTC, Worker, `eval`, etc. can be re-derived from another realm or via prototype reconstruction.
2. **Allowlist-dispatcher argument-boundary bypass** (lines 901–906) — reaching a namespace/method outside the frozen allowlist, or an allowlisted method with an attacker-influenced argument that reaches a destructive or reflective sink.
3. **Trusted Types / regex neutralisation** (lines 984–996) — mXSS, `<template>.content` routing, and any TOCTOU window before scrubbing.
4. **Vault write-epoch race** (lines 10,630, 10,644 with §4-D) — whether a delayed write can resurrect deleted or wiped data under concurrency.
5. **Legacy envelope decrypt path** (lines 10,513–10,517) — downgrade or version-confusion in backward-compatible decryption.

We would be grateful for the vendor's assessment of each, and we will provide any additional context, build-environment detail, or targeted test harnesses on request.

*END OF SCOPE MAP*
