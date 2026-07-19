> **"Cannot rely on OTF forever. Self-reliance is not optional but essential, and OTF security audits are critically important."**
>
> Unlike conventional on-device AI, offline AI is designed to run efficiently on virtually any device, including smartphones released more than a decade ago. It does not collect, transmit, or store any personal data, providing strong privacy protection by design. Despite its extremely small footprint, it incorporates machine learning capabilities while remaining lightweight and resource-efficient. Furthermore, its architecture is fully open source, enabling complete transparency, independent verification, and community-driven development.

# Preface: VitalGuard AI v4.7.1 — Security Audit Scope Map

### The Core Philosophy: Eliminating Supply Chain Risks
My greatest concern is the risk of **supply chain attacks**. 

For this reason, this architecture relies on **zero external libraries**; all modules are custom-designed and implemented from scratch. However, to adhere to industry best practices, no custom cryptographic algorithms were invented. Instead, encrypted backups leverage the browser’s native **Web Crypto API**, deriving a 256-bit key via **PBKDF2-HMAC-SHA-256** and performing authenticated encryption with **AES-256-GCM**.

---

### True Transparency vs. Dependency Overreliance
Many software projects fail to provide comprehensive code documentation because they lack direct control over external libraries. When a security vulnerability is discovered, responsibility for fixing the library lies entirely with its third-party maintainers, severely limiting how quickly application developers can respond.

**True transparency means openly disclosing the code's known limitations, weaknesses, and design trade-offs.**

---

### Precision-Mapped Attack Surface for Adversarial Review

Achieving official validation through a genuine, independent security assessment is essential for this project to earn global trust, stand on its own feet, and continue to grow with absolute confidence. Passing the **OTF security review** remains our vital milestone toward long-term self-sustainability.

For the initial security baseline, a simulated attack exercise was conducted using **Claude Fable 5**, one of today's most capable AI models. Now, to independently validate these security boundaries, **security auditors are invited to personally conduct a thorough security audit and simulated adversarial attack.**

---

## 🛡️ Open Invitation to Adversarial Testing: Challenging the Core Architecture

### (Absolute Transparency) This reference document presents the results of an LLM-assisted static analysis and adversarial threat modeling exercise.

⭐ **Claude Fable 5 Simulated Security Audit (Reference Only)** [VitalGuard_AI_complete_V47_1_WhiteHat_Security_Audit.md](https://github.com/jekymin8232/vitalguardai-com/blob/main/VitalGuard_AI_complete_V47_1_WhiteHat_Security_Audit.md)

VitalGuard is entirely dependency-free and operates fully offline. This mock audit is provided openly to encourage rigorous security reviews from diverse, adversarial perspectives. One thing is certain: VitalGuard is fully offline, leaving attackers with an exceptionally limited attack surface. Attack vectors need to be identified from a different perspective.

In highly dependency-driven systems—incorporating external APIs, microservices, cloud infrastructure, databases, event queues, and other distributed components—the system's logic and runtime behavior are fragmented across multiple layers. Consequently, an LLM cannot accurately simulate the entire system or perform comprehensive threat modeling from source code alone. **If this remains challenging even for an LLM, it is even more difficult for human reviewers to achieve a complete and accurate analysis.**

As a result, source code fragmented across multiple components and dependencies effectively exhibits black-box characteristics, making comprehensive system analysis significantly more difficult.

### Security auditors are invited to employ the most uncompromising penetration methodologies to validate these boundaries.
### 24-Hour Remediation SLA: Should any practical exploit vector or bypass be verified, a definitive hotfix patch will be deployed within 24 hours.

⭐ **In high-risk and authoritarian environments, time dictates survival. Third-party libraries are never fully under your control; a single external dependency can pull in dozens of transitive packages, unnecessarily expanding the attack surface and dangerously delaying critical security updates.** 

### Achieving official validation from the OTF Security Lab remains our vital milestone toward establishing absolute technical self-sufficiency and accelerating future innovation.

---

# [ Main Body ] v4.7.1 : Security Audit Scope Map 
## Simple update process
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

* **Note: A module I designed myself.**
  
**Note: Core Module v1.0** [VitalGuard_Integrated_Modular_Code_V1_0_MVP.html](https://github.com/jekymin8232/vitalguardai-com/blob/main/VitalGuard_Integrated_Modular_Code_V1_0_MVP.html)

**Note: Core Module v4.3** [VitalGuard_Integrated_Modular_Code_V4_3_FieldPack.html](https://github.com/jekymin8232/vitalguardai-com/blob/main/VitalGuard_Integrated_Modular_Code_V4_3_FieldPack.html)

## External libraries are not a universal solution.

This is the module I mentioned earlier, designed and implemented entirely by myself, and it has now evolved to version 4.3. 

Heavy reliance on external libraries means that updates often depend on their maintainers, making it difficult to respond quickly when security vulnerabilities are discovered. In addition, the more third-party dependencies a project has, the greater its potential exposure to supply chain attacks.

In environments where sophisticated, state-level adversaries must be considered, every external component becomes an additional trust assumption. For this reason, I have chosen to implement as much of the core functionality as possible myself, making transparency, auditability, and verifiability fundamental principles of this project's design.

---

## **File:** `VitalGuard_AI_complete_V47_1.html` — single-file, offline-first HTML application
https://github.com/jekymin8232/vitalguardai-com/blob/main/VitalGuard_AI_complete_V47_1.html

- **Release:** V4.7.1 — the current baseline submitted for audit

- **lines / Size:** 11588 lines (10463 loc) · 612,964 bytes (~599 KB)

> *Revision note (2026-07-19): visible framing strings were reworded (disaster/pet → surveillance/censorship-resistance) to match the audit's mission scope; no control logic changed and the line count is unchanged (11,588), so all scope anchors below remain valid. The whole-file SHA-256 above and the main-script CSP hash in the code map were recomputed accordingly.*


* **For a complete code and architecture overview, please refer to the Code Map:**
  
  https://github.com/jekymin8232/vitalguardai-com/blob/main/VitalGuard_AI_complete_V47_1_Code_Map.md

**The potential of offline AI built entirely with pure vanilla technologies is virtually limitless.**

---

> **A note on this document.**
> **Trust comes from timely updates and thorough verification.**
>
> During the months awaiting audit assignment, the maintainer used the time to strengthen the codebase considerably; the current baseline consolidates the strongest verified controls the project has produced, so that review effort can concentrate on its most current and most defensible version. A security audit is most effective when the project discloses its own uncertainties first, rather than waiting for the vendor to discover them independently. This map identifies, line by line, every area considered security-sensitive — including the parts where uncertainty is highest. All CTRL+F strings below are verbatim extracts from the shipped source file; paste them directly into a text editor to jump to the exact location.

---
# Start

# 0. At-a-Glance — Audit Priority Map

| WP | Domain | Core Line Range | Est. Volume | Priority |
|----|--------|-----------------|-------------|----------|
| **WP1** | Zero-Egress — first-executable network/frame/RTC/worker/eval isolation | **52–139** + policy regex **909** | ~90 lines | Highest |
| **WP2 / WP7** | Anti-Injection — allowlist action dispatcher + Trusted Types sinks | **857–1006** | ~150 lines | Highest |
| **WP6-a** | Crypto core — PBKDF2/AES-GCM-256 + purpose-bound AAD | **10,491–10,566** | ~75 lines | Highest |
| **WP6-b** | At-rest encrypted vault — atomic writes + write-epoch race guard | **10,573–10,666** | ~95 lines | Highest |
| **WP6-c** | Import boundary — schema/depth/size validation + typed plaintext gate | **10,394–10,446**, **10,906–10,926**, **6,705** | ~90 lines | High |
| **RP** | Rescue Pack replay guard — hashed bounded JTI ledger | **10,809–10,896** | ~85 lines | High |
| **PP** | Passphrase policy — distinct-word + weak-pattern enforcement | **11,184–11,206** | ~25 lines | High |
| **BQ** | BLE duplicate-binding quarantine — fail-closed routing | **10,895–11,066** | ~170 lines | High |
| **DESTR** | Destructive coordination — Reset Center + persistence generation guard | **8,122–8,186**, **11,453–11,482** | ~100 lines | High |
| Secondary | Signal math — Kalman / distance estimator | **3,750–3,924** | ~175 lines | Medium |
| Secondary | On-device AI — IsolationForest / KNN / RLS | **7,723–7,918** | ~195 lines | Medium |
| Secondary | BLE scan filters / permission boundary | **5,229–5,358** | ~130 lines | High |
| Supply-chain | Embedded Project Nayuki QR generator (MIT) | **4,161–~4,966** | provenance | Integrity check |

> **Bottom line.**
> 1. **No external CDNs or external domains.** A full-file sweep finds no active external resources; `connect-src 'none'` is declared in the meta CSP (line 39) and enforced at runtime by the first-executable core.
> 2. **~80% of audit effort should concentrate on WP1, WP2/WP7 and the three WP6 blocks (~500 lines combined).** The V4.6.x hardening surfaces (replay guard, passphrase policy, BLE duplicate-binding, destructive coordination) are the most recent additions and warrant close attention as a second tier.
> 3. **One embedded third-party component** (Nayuki QR, MIT) exists inline; it is the only supply-chain surface and is called out separately in §6.

---

## 1. WP1 — Zero-Egress (First-Executable Network / Frame / RTC / Worker / eval Isolation)

The entire outbound-suppression guard lives in **script[0]**, the first executable block (lines 52–139), and installs before the visible shell, the stylesheet, and the main application script. This ordering is itself a control: by the time any application code runs, the outbound surface is already locked. The CSP model is **hash-pinned scripts with `default-src 'none'` and `connect-src 'none'`** (line 39); the runtime core below enforces the same boundary defensively even if the meta CSP is bypassed at the platform level.

### 1-A. First-executable hardening core — **Highest-priority detailed review**
**Lines: 52 – 139**

| Item | Line | CTRL+F string (paste as-is) |
|------|------|-----------------------------|
| Telemetry counters | 55 | `var T={rtc:0,worker:0,egress:0` |
| Fail-closed if framed | 71 | `framed=window.top!==window.self` |
| RTC family lock | 87 | `'RTCPeerConnection','webkitRTCPeerConnection'` |
| Worker / SharedWorker lock | 89 | `R.worker=throwStub('Worker','worker')` |
| WebTransport / WebSocketStream lock | 91 | `'WebTransport','WebSocketStream'` |
| fetch / XHR / WS / EventSource stubs | 95 | `R.fetch=rejectStub('fetch')` |
| Guard installation (lock) | 97 | `lock(window,'fetch',R.fetch)` |
| sendBeacon override | 98 | `R.beacon=function(){T.egress++` |
| serviceWorker.register block | 100 | `R.swreg=rejectStub('serviceWorker.register'` |
| Prototype freeze | 104 | `Object.freeze(p);T.proto++` |
| eval block | 105 | `R.eval=function(){T.evalc++` |
| Post-install invariant check | 112 | `['fetch.locked',locked(window,'fetch'` |
| Frozen diagnostic API | 137 | `var api=Object.freeze({profile:'v4.7.1'` |

**What to test.**
- Confirm every outbound and code-execution channel is locked without exception: `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`, `sendBeacon`, `window.open`, `RTCPeerConnection` / `RTCDataChannel`, `Worker` / `SharedWorker`, `WebTransport` / `WebSocketStream`, `serviceWorker.register`, and `eval`. Workers are locked because they own a separate fetch scope (inline comment at line 88).
- The locks are applied via a `lock()` helper intended to make each property non-configurable and non-writable. The central question is whether any locked handle can be **recovered or re-derived** — e.g. via `iframe.contentWindow.fetch`, prototype-chain reconstruction, `Reflect`, or importing a fresh realm. Note that same-origin child frames are themselves fail-closed (line 71), which is part of the intended defence-in-depth.
- Confirm the post-install invariant check (line 112) genuinely reflects the locked state and cannot be satisfied by a partially-applied lock.
- **Disclosed residual (please confirm, do not treat as undisclosed):** a meta CSP cannot enforce `frame-ancestors` or `sandbox`, and top-level `location` navigation cannot be made immutable by in-page JavaScript once arbitrary script execution is assumed. See the `security-limitations` meta tag (line 42). Production hosting is expected to set response headers (see §7).

### 1-B. Action-policy egress token gate (parse-time)
**Line: 909 (single regex line)**
CTRL+F: `if(/constructor|prototype|__proto__`

This regex runs inside the action-policy parser *before* any dispatched call executes, so it is an intersection of WP1 and WP7. It blocks `fetch(`, `import(`, `Function(`, `eval(`, `XMLHttpRequest`, `WebSocket`, `EventSource`, `sendBeacon`, `localStorage`, `indexedDB`, `document.cookie`, `document.write`, `window.open`, and `location =`. Recommended testing: regex bypass via whitespace, Unicode homoglyphs, or string-concatenation such as `window['fe'+'tch']`, and confirmation that the parser rejects rather than best-effort-sanitizes on match.

---

## 2. WP2 / WP7 — Anti-Injection (Allowlist Dispatcher + Trusted Types)

This block (lines 857–1006) is **the single most important area in the audit** — it is the core of the XSS and DOM-injection defence. The design deliberately uses **no `eval` and no `new Function`**; it parses only the `Namespace.method(args)` pattern and checks it against a frozen allowlist.

### 2-A. Allowlist and structural parser — **Core penetration-test target**
**Lines: 857 – 918**

| Item | Line | CTRL+F string |
|------|------|---------------|
| Frozen method allowlist | 857 | `const allowed = Object.freeze({` |
| Main parser | 907 | `function parse(action, el, ev){` |
| Dangerous-token block regex | 909 | `if(/constructor|prototype|__proto__` |
| Allowlist membership check | 912 | `if(!Object.prototype.hasOwnProperty.call(allowed,ns)` |
| Frozen policy export | 918 | `return Object.freeze({normalize,parse,isAllowedAction,invoke});` |

**The single most important test.**
The primary attack objective is to **bypass the structural parser or the allowlist check** without tripping the dangerous-token regex (line 909). Verify argument-boundary handling: can a crafted argument cause a call to resolve to a namespace/method outside the frozen allowlist? Confirm that `hasOwnProperty` is used against `allowed` (line 912) so a polluted prototype cannot inject a phantom namespace — note that built-in prototypes are already frozen in the first-executable core (line 104), which this check depends on.

**Argument-to-sink data flow (the hard part of WP7).**
The allowlist validates the *method name*, not the *semantic effect of arguments*. Review each allowlisted method that reaches a destructive or reflective sink — in particular anything routing to `ResetCenter.factory`, a full-wipe path, or a DOM-writing method — and confirm no such path is reachable with attacker-influenced arguments.

### 2-B. Trusted Types HTML-sink patches — **WP2 core**
**Lines: 990 – 1006**

| Item | Line | CTRL+F string |
|------|------|---------------|
| innerHTML setter patch (Element + HTMLElement) | 990 | `patchInnerHTML(Element && Element.prototype)` |
| insertAdjacentHTML patch | 995 | `Element.prototype.insertAdjacentHTML = function(pos, html)` |
| Range.createContextualFragment patch | 1002 | `Range.prototype.createContextualFragment = function(html)` |

**What to test (the hard part).**
- The HTML neutraliser routes writes through a Trusted Types policy (`trusted-types vitalguard-html`, `require-trusted-types-for 'script'` in the CSP). Assess resistance to mutation XSS (mXSS), nested-tag obfuscation (`<scr<script>ipt>`), SVG/MathML namespace confusion, and comment-boundary tricks.
- The `innerHTML` setter is patched at the prototype level. Assess whether the descriptor may be non-configurable in certain engines, whether an `Element.prototype` vs `HTMLElement.prototype` mismatch leaves a gap, or whether `<template>.content` routing bypasses the patch.
- Determine whether any DOM-scrub / MutationObserver step fires *before* a hostile node becomes active, or whether a one-frame TOCTOU window exists.
- Confirm that `data:` / `blob:` URL handling does not permit navigation to `data:text/html` or `blob:` in a new context — this intersects with WP1.

---

## 3. WP6 — Data Sovereignty (Crypto Core · At-Rest Vault · Import Boundary)

Sensitive state is held in an **at-rest encrypted vault** with atomic, serialized writes and a write-epoch race guard; encrypted export/backup uses the same crypto core. All key material is passphrase-derived and never leaves the device.

### 3-A. Crypto core (V455Crypto) — **Core cryptographic review**
**Lines: 10,491 – 10,566**

| Item | Line | CTRL+F string |
|------|------|---------------|
| Iteration constant | 10,451 | `iterations:600000` |
| V455Crypto object | 10,491 | `const V455Crypto = Object.freeze({` |
| Key derivation (PBKDF2 → AES-GCM-256) | 10,499 | `crypto.subtle.deriveKey({name:'PBKDF2'` |
| Fresh salt (16) + IV (12) per encrypt | 10,503 | `const salt=crypto.getRandomValues(new Uint8Array(16)), iv=crypto.getRandomValues(new Uint8Array(12))` |
| Encrypt with purpose-bound AAD | 10,506 | `crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:this.aad(meta)}` |
| Envelope v3 strict validation | 10,510 | `env.kdf!=='PBKDF2-SHA-256'||Number(env.it)!==V455.iterations` |
| Legacy v1/v2 decrypt path | 10,519 | `Unsupported legacy encrypted backup` |

**Cryptographic review points.**
- **PBKDF2 / 600,000 iterations / SHA-256 / AES-256-GCM** meets the OWASP recommendation for SHA-256; this is a verifiable strength worth citing in the report.
- Confirm a **fresh 12-byte IV on every encryption** (line 10,503). GCM nonce reuse is catastrophic; confirm no code path reuses an IV. (The Code Map records a test producing 32 distinct IVs across 32 encryptions.)
- **AAD purpose-binding** (line 10,506): the additional-authenticated-data ties each ciphertext to its declared purpose/metadata. Confirm the AAD is reconstructed identically on decrypt (line 10,515 region) and that metadata tamper is rejected.
- Review the **legacy v1/v2 decrypt path** (lines 10,519–10,523). Backward-compatible decryption of older envelopes is a common place for downgrade or confusion issues; confirm the version/`it`/`alg` checks cannot be coerced to accept a weaker envelope than intended.
- Passphrase memory residency after derivation is not fully controllable in browser JS; worth a note rather than a finding.

### 3-B. At-rest encrypted vault — **race and durability review**
**Lines: 10,573 – 10,666**

| Item | Line | CTRL+F string |
|------|------|---------------|
| Vault object | 10,573 | `const SecureVaultV455={` |
| Serialized write state | 10,574 | `writeQueue:Promise.resolve(), writeEpoch:0, writeBlocked:false` |
| Atomic update | 10,636 | `atomicUpdate(mutator){` |
| Invalidate writes (epoch advance) | 10,650 | `async invalidateWrites(){this.writeBlocked=true;this.writeEpoch++` |

**What to test.**
- The vault is a **single encrypted envelope** committed atomically; there is no partial-state window by design. Confirm `atomicUpdate` (line 10,636) genuinely serializes concurrent mutators and that a mutator observing a stale `writeEpoch` is dropped (the intended guard against a delayed slider/threshold write restoring deleted data).
- Confirm the destructive coordination in §DESTR (delete/wipe) correctly advances the epoch through `invalidateWrites` (line 10,650) so that a queued write cannot resurrect wiped state. This is the most subtle correctness property in the build; a targeted race harness is welcome here.
- **Disclosed residual:** because the vault is one envelope, a small write re-encrypts the whole sensitive state. Record-per-envelope storage is intentionally deferred (see §7 and Code Map §11).

### 3-C. Import boundary (schema / depth / size / typed plaintext gate)
**Lines: 10,394 – 10,446, 10,906 – 10,926, 6,705**

| Item | Line | CTRL+F string |
|------|------|---------------|
| Import limits | 10,394 | `importLimits:Object.freeze({maxFileBytes:1048576` |
| JSON shape validator (depth/nodes/circular/child-cap) | 10,406 | `function assertJsonShape(x,maxDepth,maxNodes){` |
| Pet sanitiser (32 KB ceiling) | 10,414 | `function sanitizePet(pd){` |
| Typed plaintext-import approval | 10,922 | `Type IMPORT PLAINTEXT exactly` |
| Hardened import entry point | 6,705 | `if(window.VitalGuardHardenedImport){ return window.VitalGuardHardenedImport(ev); }` |

**What to test.**
- `assertJsonShape` (line 10,406) enforces max depth, a node cap, circular-reference rejection via `WeakSet`, and a 1,000-child ceiling — the intended defence against JSON-bomb and prototype-pollution inputs. Confirm a `__proto__` key in import data cannot trigger prototype traversal (note built-in prototypes are frozen at line 104).
- `sanitizePet` (line 10,414) forces every field through allowlist/range/length constraints with a 32 KB per-entry ceiling. Whether the trust boundary is drawn cleanly and completely at the import point is the central WP6 question.
- **Plaintext import requires an explicit typed approval** ("IMPORT PLAINTEXT", line 10,922), gated behind a danger confirmation. Confirm there is no code path that imports plaintext without this gate, and that encrypted import decrypts and then re-validates through `assertJsonShape` (decrypted data is not implicitly trusted).
- Voice/audio data-URL handling has a bounded character ceiling (`maxVoiceDataUrlChars`, line 10,394). Assess post-`atob` size expansion.

---

## 4. V4.6.x Hardening Surfaces (Most Recent Additions)

These controls are the most recent additions to the codebase and are therefore the least externally reviewed. They are grouped here so the vendor can budget a dedicated pass.

### 4-A. Rescue Pack replay guard
**Lines: 10,809 – 10,896**

| Item | Line | CTRL+F string |
|------|------|---------------|
| Rescue Pack v2 with jti nonce | 10,812 | `const pack={v:2,jti:v455RandomId(16)` |
| jti format validation | 10,818 | `if(!/^[0-9a-f]{32}$/i.test(String(pack.jti` |
| Profile-local replay key | 10,825 | `const V469_REPLAY_KEY='vg_rp_replay_v469'` |
| Replay hash (SHA-256 of jti) | 10,828 | `async function v469ReplayHash(jti){return V455Crypto.sha256Text('VitalGuard|VG-RP2|replay|'` |
| Replay-seen check | 10,829 | `async function v455ReplaySeen(jti){` |

**What to test.** Confirm the ledger stores **only SHA-256 hashes of the jti with a capped expiry** and never writes a raw jti locally; that the bounded ledger has a genuine upper bound (no unbounded growth); and that the encrypted-setting compatibility ledger and the profile-local ledger cannot disagree in a way that allows a single-use token to be replayed. **Disclosed residual:** the ledger is best-effort and browser-profile-local — clearing site data removes it. This is a documented limitation, not a claimed guarantee.

### 4-B. Passphrase policy (distinct-word + weak-pattern)
**Lines: 11,184 – 11,206**

| Item | Line | CTRL+F string |
|------|------|---------------|
| Repeated-pattern rejection | 11,189 | `if(/^(.)\1+$/u.test(compact)` |
| Common/project-term + sequence rejection | 11,190 | `if(/password|passphrase|qwerty|admin` |
| Four-distinct-word rule | 11,194 | `if(new Set(normalized).size<4)return {ok:false,why:'repeated word'}` |
| Frozen policy export | 11,204 | `window.VitalGuardPassphrasePolicyV469=Object.freeze` |

**What to test.** Confirm the creation-strength gate (min 16 chars, no control chars, no repeated/common/sequential patterns, and either four distinct normalized words or a high-variety non-word path) is applied to **new** sensitive passphrases, and that unlocking a **legacy** vault deliberately does not re-apply the gate (so existing users are not locked out). Probe for normalization bypasses (NFKC / locale-casing) that could let near-duplicate words pass the distinct-word count.

### 4-C. BLE duplicate-binding quarantine (fail-closed routing)
**Lines: 10,895 – 11,066**

| Item | Line | CTRL+F string |
|------|------|---------------|
| Imported signatures stay unbound (rebind-required) | 10,896 | `function v455SanitizeSignature(s){` |
| Routing eligibility check | 10,972 | `sig.bindingVersion==='v455-local-exact'` |
| Exact-binding-first routing | 11,032 | `/* V4.6.8 (VG468-02, retained in V4.6.9` |

**What to test.** Confirm that two records with the same exact local browser device ID are **never routed** and are both quarantined for local re-registration; that imported metadata cannot self-promote to a bound state without on-device re-registration; and that exact-binding is resolved before clone-candidate scoring. **Disclosed residual (important):** generic BLE advertisements are not cryptographically authenticated; advertisement-only identity is spoofable and is used only for advisory, fail-closed directional guidance — never for life-critical decisions.

### 4-D. Destructive coordination (Reset Center + persistence generation guard)
**Lines: 8,122 – 8,186, 11,453 – 11,482**

| Item | Line | CTRL+F string |
|------|------|---------------|
| Reset Center | 8,122 | `const ResetCenter = {` |
| Factory reset action | 8,181 | `data-vg-onclick="ResetCenter.factory()"` |
| beforeClearAll (generation advance) | 11,473 | `async function beforeClearAll(){blocked=true;generation++` |
| Frozen persistence API | 11,482 | `window.VitalGuardPersistenceV469=api` |

**What to test.** Confirm full wipe removes app IndexedDB stores, all `vg41_` records, language keys (`vg_lang_v41` / `vg_lang_v412`), the replay ledger (`vg_rp_replay_v469`), and the vault fallback; that persistence is *blocked during* wipe and *unblocked after* so a fresh post-wipe session can save normally; and that no debounced write scheduled before the wipe survives it. This is the counterpart to the vault write-epoch guard in §3-B and should be tested together.

---

## 5. Secondary Areas — Lighter Review Sufficient

### 5-A. Signal math filters
**Lines: 3,750 – 3,924** — Kalman RSSI smoothing and RSSI-to-distance estimation. No military-use vector (civilian pet-proximity smoothing). Review numerical stability: division-by-zero, NaN propagation, filter divergence. Deterministic and white-box, consistent with the project's transparency principle.

### 5-B. On-device AI
**Lines: 7,723 – 7,918** — IsolationForest / KNN / RLS ensemble (CTRL+F: `class IsolationForestLite` / `p.ai4={knn:new KNNLite`). Unsupervised, on-device, no model download and no remote inference — consistent with WP1. Confirm learned weights remain local only.

### 5-C. BLE scan filters / permission boundary
**Lines: 5,229 – 5,358** — advertisement receive listener and scan-filter construction. If any register/wizard branch receives advertisements without signature filtering, note that it is transient, consent-gated, and — confirmed by WP1 zero-egress — that no received advertisement data leaves the device.

---

## 6. Supply-Chain — Embedded Third-Party Component

**Lines: 4,161 – ~4,966** · CTRL+F: `Offline embedded library: Project Nayuki QR Code generator (MIT License).` and `var qrcodegen;`

This is the **only** third-party component in the file, vendored inline under the MIT License (declared in the `third-party-license` meta tag, line 38). It is used for offline QR rendering of the encrypted Rescue Pack and performs no I/O. Suggested checks: confirm the vendored source matches an upstream Nayuki release without local modification (or that any modification is documented), and confirm it is reached only through the allowlisted dispatcher. For accuracy of framing: the project's "zero dependency" property is best stated as **zero network/runtime dependency, with one inline MIT-licensed rendering component** — this document states the boundary explicitly so it is not perceived as an undisclosed dependency.

---

## 7. Disclosed Residual Risks (Confirm, Not Discover)

The maintainer flags the following proactively; they are recorded in the in-file meta tags and Code Map §10 and are not claimed to be resolved.

- **Meta-CSP limits:** `frame-ancestors` and `sandbox` cannot be enforced from a meta tag; the in-file frame guard (line 71) is defence-in-depth, and production hosting must set the response headers listed below. Top-level `location` navigation cannot be made immutable by in-page JS once arbitrary script execution is assumed (meta `security-limitations`, line 42).
- **Capability-scope wording mismatch (please read):** the visible product copy still uses Swarm / Mesh / SOS-relay language, but the artifact implements only **passive BLE advertisement reception, local processing, and manual encrypted hand-off** — not BLE transmission, GATT relay, mesh routing, autonomous self-organization, or autonomous SOS relay. A nonvisual capability manifest documents the true boundary (meta `capability-scope`, line 45). Because this release freezes UX/copy, the visible mismatch is a **deliberately retained residual**; visible-copy correction is scheduled for a subsequent release.
- **Single-envelope vault:** small writes re-encrypt the full sensitive state; record-per-envelope storage is deferred (Code Map §11).
- **Replay ledger** is best-effort and browser-profile-local; clearing site data removes it.
- **Advertisement-only BLE identity** is spoofable and is not cryptographic authentication.
- **Detached SHA-256 is not a signature.** The in-app hash is diagnostic only; the whole-file hash must be verified against a manifest delivered over an independent trusted channel (meta `release-integrity`, line 43).

**Required deployment headers (verify at hosting):** `Content-Security-Policy: frame-ancestors 'none'`; `X-Content-Type-Options: nosniff`; a restrictive `Permissions-Policy`; `Cross-Origin-Opener-Policy: same-origin`; `Cross-Origin-Resource-Policy: same-origin`; a clean dedicated origin with no pre-existing uncontrolled Service Worker; and authenticated release-manifest delivery.

---

## 8. Out-of-Scope Areas (Integrity Check Only)

| Area | Location | Rationale |
|------|----------|-----------|
| Inline stylesheet | line 141 onward | Static; no executable logic; CSP hash covers integrity |
| Static UI markup | body shell | `data-vg-on*` attributes are validated at runtime by the WP7 dispatcher (§2) |
| I18N translation strings | I18N block (line 1,450 onward) | Static localisation text (seven dictionaries + Arabic RTL) |
| CSPRNG local record IDs | line 1,199 (`function genLocalIdSuffix(len){`) | Uses `crypto.getRandomValues`; light confirmation only |

---

## 9. Internal Identifier Provenance

Reviewers performing a whitebox pass will observe internal identifiers that read `V455…` / `V469…` (for example storage keys `__vg_vault_v455__`, `vg_rp_replay_v469`; functions such as `v469ReplayHash`), together with historical change markers in comments (for example `VG468-02`). These identifiers are **intentionally preserved**: they encode the internal module lineage and the point at which each control was introduced, and renaming them would break runtime references and erase accurate history. They are documented here so the naming is not logged as an inconsistency finding. The corresponding functional change register (VG469-01 … VG469-09) is described in Code Map §2.

---

## 10. Vendor-Facing One-Page Summary

The high-priority surface concentrates in a small number of tight blocks: the **first-executable Zero-Egress core (lines 52–139)**, the **allowlist action dispatcher + Trusted Types sinks (lines 857–1006)**, the **crypto core (10,491–10,566)**, the **at-rest encrypted vault (10,573–10,666)**, and the **import boundary (10,394–10,446)**. A second tier covers the V4.6.x hardening surfaces: the **replay guard (10,809–10,896)**, **passphrase policy (11,184–11,206)**, **BLE duplicate-binding quarantine (10,895–11,066)**, and **destructive coordination (8,122–8,186 + 11,453–11,482)**. The file contains **no external CDNs or domains** and **one inline MIT component** (Nayuki QR, §6).

The points where external, adversarial review is considered most valuable — the project's highest areas of uncertainty — are:

1. **Recoverability of the locked egress handles** (line 97 region) — whether any of `fetch`, RTC, Worker, `eval`, etc. can be re-derived from another realm or via prototype reconstruction.
2. **Allowlist-dispatcher argument-boundary bypass** (lines 907–912) — reaching a namespace/method outside the frozen allowlist, or an allowlisted method with an attacker-influenced argument that reaches a destructive or reflective sink.
3. **Trusted Types / regex neutralisation** (lines 990–1002) — mXSS, `<template>.content` routing, and any TOCTOU window before scrubbing.
4. **Vault write-epoch race** (lines 10,636, 10,650 with §4-D) — whether a delayed write can resurrect deleted or wiped data under concurrency.
5. **Legacy envelope decrypt path** (lines 10,519–10,523) — downgrade or version-confusion in backward-compatible decryption.

We would be grateful for the vendor's assessment of each, and we will provide any additional context, build-environment detail, or targeted test harnesses on request.

---

## 📜 Closing Remarks: Open Source Vision & Sustainability Statement

As an open-source pioneer who refuses to be confined to the structural limits of conventional employment, the mission is to expand this foundational architecture into a scalable, decentralized ecosystem—creating a secure digital haven where developers, human rights defenders, and citizens can build, collaborate, and thrive together.

---

### ⏳ Biography & Milestones

*   **November 2025** — Officially reviewed by the Government of Luxembourg.
*   **February 2026** — Reviewed by University College London (UCL) and the Institute of Development Studies (IDS) in the United Kingdom.
*   **Summer 2026 (Expected)** — Officially reviewed by the OTF Security Lab in the United States.
*   **2027 (Target)** — Expected to Achieve Technical Self-Sufficiency.

---

**Morgan J.**  
*Principal Architect & Founder, Republic of Korea*


