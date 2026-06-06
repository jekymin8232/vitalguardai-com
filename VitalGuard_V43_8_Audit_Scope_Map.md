# Required Reading: Precision-Mapped Attack Surface for Adversarial Review
## VitalGuard AI v4.3.8 — Security Audit Scope Map
### High-Priority ~3,700 Lines · WP1 / WP2 / WP6 / WP7

**File:** `VitalGuard_AI_complete_V43_8.html`
**Prepared by:** Morgan J. (Gyu-min Jeon)

---

> **A note on this document.**
> A note on this document. This scope map was prepared by the project maintainer prior to engaging an external vendor. It identifies, line by line, every area considered security-sensitive — including the parts where uncertainty is highest. I believe a security audit is most effective when the project itself discloses its own uncertainties first, rather than waiting for an external vendor to discover them independently. All CTRL+F search strings in this document are verbatim extracts from the live source file; paste them directly into a text editor to jump to the exact location.

---

## 0. At-a-Glance — Audit Priority Map

| WP | Domain | Core Line Range | Est. Volume | Priority |
|----|--------|----------------|-------------|----------|
| **WP1** | Zero-Egress — network isolation, outbound suppression | **10,149–10,239** + 787 | ~120 lines | Highest |
| **WP2 / WP7** | Anti-Injection — Trusted Types + data-vg-on dispatcher | **721–949** | ~230 lines | Highest |
| **WP6** | Data Sovereignty — AES-GCM CryptoBox + schema validation | **8,260–8,320** + **10,505–10,531** | ~120 lines | High |
| Secondary | Core signal filters — Kalman / Distance / Q-Learning | **3,639–3,814** | ~175 lines | Medium |
| Secondary | AI anomaly detection — IsolationForest / KNN / RLS | **7,720–7,945** | ~225 lines | Medium |
| Secondary | BLE scan filters / permission boundary | **5,200–5,310** | ~110 lines | High |
| Secondary | Final Hardening Layer (IIFE container) | **10,137–10,560** | ~420 lines | High |

> **Bottom line:**
> 1. **Zero external CDNs or external domains.** A full-file sweep found no active external resources — `cdn`, `cloudflare`, `googleapis`, `jsdelivr`, `unpkg`, and equivalent patterns all return zero hits. The line 672 Cloudflare script conflict noted in the earlier V42.3 review has been resolved; line 672 in V43.8 is ordinary Emergency-overlay HTML.
> 2. **80% of audit effort should concentrate on the top three WP blocks (~470 lines combined).** The remaining secondary areas require only a lighter pass to confirm correct operation and confirm the absence of misuse vectors.

---

## 1. WP1 — Zero-Egress (Network Isolation / Outbound Suppression)

### 1-A. Runtime Network Guard — **Highest-priority detailed review**
**Lines: 10,149 – 10,196**

| Item | Line | CTRL+F string (paste as-is) |
|------|------|-----------------------------|
| Guard object declaration | 10,149 | `const RuntimeNetworkGuard` |
| `fetch` override | ~10,159 | `zero-egress: fetch disabled` |
| `XMLHttpRequest` override | ~10,166 | `zero-egress: XHR disabled` |
| `WebSocket` override | ~10,172 | `zero-egress: WebSocket disabled` |
| `EventSource` override | ~10,178 | `zero-egress: EventSource disabled` |
| `sendBeacon` override | ~10,184 | `navigator.sendBeacon = function` |
| `form.submit` override | ~10,190 | `zero-egress: form submit disabled` |
| Guard installation call | 10,195 | `RuntimeNetworkGuard.install()` |

**What to test:**
- Confirm that all six outbound APIs (fetch / XHR / WebSocket / EventSource / sendBeacon / form.submit) are overridden without exception. Assess whether any egress channel is absent from the list — candidates include `Image().src` ping-back, `<a download>` redirect, `WebRTC RTCPeerConnection` data channels, and `fetch` inside a `Worker(blob:…)` context, which operates in a separate global scope.
- The inline comment reads `original API handle intentionally not exposed`. Verify that the original handle cannot be recovered via prototype chain manipulation or `window.fetch.call(…)` style restoration.

> **Potential gap:** `RTCPeerConnection` (STUN/TURN data channels) and Web Worker internal contexts are not in the six-item override list. A Worker thread's `fetch` is a distinct global and is not affected by the main-thread override. A reviewer could note a one-line Worker egress bypass as a finding. We flag this proactively.

### 1-B. External Navigation Guard
**Lines: 10,199 – 10,239**

| Item | Line | CTRL+F string |
|------|------|---------------|
| Guard object declaration | 10,199 | `const ExternalNavigationGuard` |
| `window.open` wrapper | ~10,230 | `originalOpen ? originalOpen` |
| Guard installation call | 10,238 | `ExternalNavigationGuard.install()` |

**Verification point:** Confirm that `mailto:` / `tel:` / `sms:` / `https:` external navigation is blocked. Confirm that the `isAllowedHref` allowlist is strictly limited to same-origin, `#`, `data:`, `blob:`, and `file:` schemes.

### 1-C. Action Policy Static Filter (first-pass token gate)
**Line: 787 (single regex line)**
CTRL+F: `fetch\s*\(|XMLHttpRequest|WebSocket|EventSource|sendBeacon`

This regex operates at parse time, before the dispatcher executes anything, making it an intersection of WP1 and WP7. Recommend testing for regex bypass via whitespace insertion, Unicode homoglyphs, or string-concatenation patterns such as `window['fe'+'tch']`.

---

## 2. WP2 / WP7 — Anti-Injection (Trusted Types + data-vg-on Dispatcher)

This block (lines 721–949) is **the single most important area in the entire audit** — it is the core of the XSS and DOM-injection defence.

### 2-A. Sanitizer Utility
**Lines: 721 – 729**
CTRL+F: `var Sanitizer = window.Sanitizer`

Six sanitizer functions: `name` / `phone` / `text` / `icon` / `escapeHTML` / `safeId`.

**Verification:** Confirm that `escapeHTML` handles all five characters (`& < > ' "`). Confirm that `text()` strips control characters (`\u0000–\u001F`) and the backtick character — the latter appears to be intentional defence against template-literal injection and should be confirmed as such.

### 2-B. Action Policy (method allowlist + parser) — **Core penetration-test target**
**Lines: 734 – 798**

| Item | Line | CTRL+F string |
|------|------|---------------|
| Allowlist object | 735 | `const allowed = Object.freeze` |
| Token normalisation | 765 | `function normalize(action)` |
| Argument splitter | 771 | `function splitArgs(text)` |
| Atomic value parser | 776 | `function parseAtom(tok` |
| Main parser (regex gate) | 785 | `function parse(action, el, ev)` |
| Dangerous-token block regex | 787 | `constructor\|prototype\|__proto__\|eval` |
| Invocation executor | 795 | `function invoke(action, el, ev)` |

**The single most important test:**
The policy never uses `eval` or `new Function`. It parses only the `Namespace.method(args)` pattern via a structural regex (line 788: `^([A-Za-z_$][\w$]*)\.([A-Za-z_$][\w$]*)\(...\)$`), checks the result against the frozen allowlist, then calls `fn.apply()`. The primary attack objective is therefore to **bypass this regex or the allowlist check** without triggering the dangerous-token block.

Additional verification points:
- Confirm that `parseAtom` rejects string arguments exceeding 120 characters or containing `< > \`` (line 782).
- Confirm that the quote/escape state machine in `splitArgs` does not mishandle `\` sequences (line 773) in a way that would cause argument-boundary confusion, potentially routing a call to a method outside the allowlist.
- Review the whitelisted methods (lines 735–745) for inherently dangerous side effects — for example, `Settings.resetApp`, `ResetCenter.factory`, and any path leading to `Security.fullWipe` — and confirm that these are not reachable via an unauthenticated argument.

> **Potential gap:** The allowlist validates the method *name* but not the *semantic meaning of arguments*. If a method such as `Nav.go('…')` reflects its argument back into the DOM, a legitimately dispatched call could serve as a secondary sink. Tracing each whitelisted method's argument-to-sink data flow is the core task of WP7.

### 2-C. Action Dispatcher (global event delegation)
**Lines: 800 – 814**
CTRL+F: `const VitalGuardActionDispatcher`

Seven events (click / change / input / mousedown / mouseup / touchstart / touchend) are handled via capture-phase delegation (`true`). On block: attribute removal + `preventDefault` + `stopPropagation` (line 807).

**Verification:** Confirm that capture-phase delegation is not bypassable via synthetic events dispatched directly with `dispatchEvent`.

### 2-D. Trusted Types Guard (HTML sink patching) — **WP2 core**
**Lines: 816 – 949**

| Item | Line | CTRL+F string |
|------|------|---------------|
| Guard IIFE declaration | 816 | `const VitalGuardTrustedTypesGuard` |
| `<script>` removal regex | 818 | `rxScriptTag` |
| iframe/object/embed/base/meta/link removal | 819 | `rxBlockedTags` |
| `on*=` attribute removal | 820 | `rxBadAttrs` |
| Dangerous URL attribute removal | 821 | `rxBadAttrUrl` |
| **HTML neutralisation function** | 822 | `function neutralizeHTML(input)` |
| Trusted Types policy creation | 842 | `createPolicy('vitalguard-html'` |
| Script URL block | 844 | `script URLs are disabled` |
| **innerHTML setter patch** | 852 | `function patchInnerHTML(proto)` |
| insertAdjacentHTML patch | 871 | `insertAdjacentHTML = function` |
| Range.createContextualFragment patch | 878 | `createContextualFragment` |
| URL allowlist check | 884 | `function isAllowedUrl(raw)` |
| **DOM scrubber** | 896 | `guard.scrubNode = function` |
| MutationObserver activation | 920 | `new MutationObserver` |
| `document.write` block | 933 | `document.write = document.writeln` |
| OS Share block | 936 | `const shareKey = 'sh'+'are'` |

**What to test (the hard part):**
- **Inherent limitations of regex-based HTML neutralisation.** `neutralizeHTML` uses regex substitution — not a parser — to remove `<script>` tags, event attributes, and dangerous URLs. Regex-based sanitisers are a well-documented attack surface for mutation XSS (mXSS), nested-tag obfuscation (`<scr<script>ipt>`), SVG/MathML namespace confusion, and comment-boundary tricks (`<!--`). This is the location a reviewer is most likely to probe first.
- The `innerHTML` setter is patched at the prototype level (line 857). Assess whether the descriptor may be `configurable: false` in certain browser/engine combinations, or whether the patch can be bypassed via `Element.prototype` vs `HTMLElement.prototype` mismatch, or via `<template>.content` routing.
- Confirm whether the MutationObserver scrub (lines 896 and 920) executes *synchronously before* a dangerous node becomes active, or whether it fires asynchronously, leaving a one-frame window during which a hostile node exists in the DOM (a potential TOCTOU window).
- `isAllowedUrl` unconditionally permits `data:` and `blob:` schemes (line 887). Confirm that navigation to a `data:text/html` or `blob:` URL in a new context is blocked elsewhere — this intersects with WP1.

---

## 3. WP6 — Data Sovereignty (Encryption + Schema Validation)

### 3-A. CryptoBox (AES-GCM Encrypted Backup) — **Core cryptographic review**
**Lines: 8,260 – 8,320**

| Item | Line | CTRL+F string |
|------|------|---------------|
| CryptoBox object | 8,261 | `const CryptoBox` |
| WebCrypto support check | 8,263 | `crypto.subtle && window.TextEncoder` |
| Key derivation (PBKDF2) | 8,276 | `async _deriveKey(pass, salt)` |
| importKey | 8,278 | `importKey('raw'` |
| **PBKDF2 parameters** | 8,280 | `iterations:600000, hash:'SHA-256'` |
| Salt generation (16 bytes) | 8,289 | `getRandomValues(new Uint8Array(16))` |
| IV generation (12 bytes) | 8,290 | `getRandomValues(new Uint8Array(12))` |
| Encryption call | 8,292 | `subtle.encrypt({name:'AES-GCM'` |
| Decryption call | 8,309 | `subtle.decrypt({name:'AES-GCM'` |

**Cryptographic review points:**
- **PBKDF2 / 600,000 iterations / SHA-256 / AES-256-GCM** meets the OWASP 2023 recommendation for SHA-256 (600k iterations). This is a verifiable strength and should be cited explicitly in the audit report.
- Confirm that the IV (12 bytes) is generated freshly on every encryption call (line 8,290). GCM nonce reuse is catastrophic; confirm that no code path reuses an IV across multiple encrypt calls.
- Confirm that the package structure (the `alg / salt / iv` fields stored alongside the ciphertext, lines 8,289–8,296) follows standard practice for AES-GCM backup containers.
- Passphrase memory residency: after `_deriveKey` completes, confirm whether the passphrase string remains in memory. Complete zeroing is not straightforwardly achievable in a browser JS environment, but the matter is worth noting in the report.

### 3-B. Schema Validation and Import Boundary
**Lines: 10,505 – 10,531** (inside the Final Hardening Layer IIFE)

| Item | Line | CTRL+F string |
|------|------|---------------|
| Audit hardening limits | 10,507 | `importLimits:{maxFileBytes:1048576` |
| **JSON structure validator** (depth / nodes / circular refs) | 10,519 | `function assertJsonShape` |
| Threshold sanitiser | 10,523 | `function sanitizeThresholds` |
| BLE signature sanitiser | 10,524 | `function sanitizeSignature` |
| Distance calibration sanitiser | 10,525 | `function sanitizeDistanceCalib` |
| Alert preferences sanitiser | 10,526 | `function sanitizeAlertPrefs` |
| **Pet object sanitiser** (32 KB ceiling) | 10,527 | `function sanitizePet` |
| Settings sanitiser (key allowlist) | 10,528 | `function sanitizeSettings` |
| Import handler | 10,529 | `async function doImportData` |
| **Hardened import entry point** | 10,530 | `window.VitalGuardHardenedImport` |

**What to test:**
- `assertJsonShape` (line 10,519) enforces depth (maxDepth), node count (12,000), circular-reference detection (WeakSet), and a 1,000-child-per-object ceiling — the intended defence against JSON bomb and prototype pollution attacks. Confirm that a `__proto__` key in import data does not trigger prototype-chain traversal when `Object.values` is called on it.
- `sanitizePet` (line 10,527) converts every field through allowlist, range, and length constraints. **Whether the trust boundary is drawn clearly and completely at the import point** is the central question for WP6 data sovereignty.
- Voice clip data-URL validation (inside line 10,529): a regex `^data:audio/(webm|ogg|mpeg|mp3|wav);base64,...$` is combined with a 450 KB binary ceiling and `atob` processing. Assess whether a maliciously crafted base64 payload can cause significant size expansion after decoding.
- Encrypted backup decryption path (line 10,530): confirm that after the `data.enc` branch decrypts the payload, the resulting plaintext is passed through a second round of `JSON.parse` + `assertJsonShape` — i.e., that decrypted data is not trusted implicitly.

---

## 4. Secondary Areas — Lighter Review Sufficient

### 4-A. Signal Math Filters
**Lines: 3,639 – 3,814**

| Item | Line | CTRL+F string |
|------|------|---------------|
| Kalman RSSI filter | 3,640 | `class KalmanRSSI` |
| Distance estimator | 3,675 | `class DistanceEstimator` |
| Q-Learning Lite | 3,711 | `class QLearningLite` |
| Pet class | 3,815 | `class Pet` |
| Filter application point | 3,899 | `this.smoothedRssi = this.kalman.update` |

**Review perspective:** No military-use vector identified (RSSI smoothing for civilian pet proximity). Review for numerical stability: division-by-zero propagation, NaN propagation, and filter divergence. Deterministic and white-box — consistent with the project's transparency principle.

### 4-B. AI Anomaly Detection Engine
**Lines: 7,720 – 7,945**

| Item | Line | CTRL+F string |
|------|------|---------------|
| IsolationForest Lite | ~7,790 | `class IsolationForestLite` or `this.maxDepth=opts.maxDepth` |
| Ensemble initialisation | 7,890 | `iso: new IsolationForestLite` |
| Velocity-based heuristic | 7,911 | `p.kalman.getVelocity() + 10)/20` |

**Review perspective:** On-device unsupervised learning with no external model download and no remote inference — consistent with WP1 zero-egress. Confirm that learned weights remain local only.

### 4-C. BLE Scan Filters / Permission Boundary
**Lines: 5,200 – 5,310**

| Item | Line | CTRL+F string |
|------|------|---------------|
| Bluetooth availability check | 5,208 | `if(!navigator.bluetooth)` |
| Advertisement receive listener | 5,284 | `addEventListener('advertisementreceived'` |
| **Scan filter build** | ~5,290 | `const filters=this._buildTrackFilters()` |
| requestLEScan execution | 5,306 | `navigator.bluetooth.requestLEScan(options)` |

> **Potential gap:** A fallback branch at lines 5,298 and 5,308 sets `acceptAllAdvertisements=true` during register and wizard modes. Signature-based filtering is applied in tracking mode, so this is intentional by design. However, a reviewer may characterise the unfiltered advertisement reception as indiscriminate BLE device harvesting. **We recommend pre-emptively noting in the audit brief that this branch is transient, consent-gated, and that no harvested advertisement data is transmitted — a point confirmed by WP1 zero-egress.**

### 4-D. Final Hardening Layer (IIFE container)
**Lines: 10,137 – 10,560**
CTRL+F: `FINAL HARDENING LAYER`

Sections 1-A, 1-B, and 3-B above are all encapsulated inside this single IIFE. The key check is **load order**: confirm that this layer executes after all module definitions, ensuring that the original browser APIs are overridden with certainty by the time any application logic runs.

---

## 5. Out-of-Scope Areas (Integrity Check Only)

| Area | Line range | Rationale |
|------|-----------|-----------|
| CSS styles | 29 – 223 | Static styles; no executable logic |
| Static UI markup | 224 – 701 | `data-vg-on*` attributes are validated at runtime by the WP7 dispatcher (covered in 2-C) |
| I18N translation strings | ~1,980 – 2,540 | Static localisation text; Kalman references are descriptive prose only |
| QR engine | Canvas render area | Offline canvas rendering; no outbound transmission — integrity check only |

---

## 6. Vendor-Facing One-Page Summary

The approximately 3,700-line high-priority surface concentrates in three tight blocks: the **Anti-Injection core (lines 721–949)**, the **Zero-Egress enforcement layer (lines 10,149–10,239)**, and the **AES-GCM CryptoBox plus schema-validation boundary (lines 8,260–8,320 and 10,505–10,531)**. We confirm **zero external CDNs or external domains** across the entire 10,569-line file.

Particular scrutiny of the following three areas would be especially welcome, as they represent the project’s highest areas of uncertainty:

1. **Regex-based HTML neutralisation (line 822)** — resistance to mutation XSS and parser-context confusion.
2. **Action-policy parser (line 785)** — resistance to allowlist bypass via argument-boundary manipulation or homoglyph substitution.
3. **Egress channels not covered by the six overridden APIs** — specifically Web Worker internal contexts and RTCPeerConnection data channels.

These are the points where we consider external, adversarial review to be most valuable, and we would be grateful for the vendor's assessment of each.
