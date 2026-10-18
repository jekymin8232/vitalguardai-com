# VitalGuard — OTF Security Lab Audit Scope | Application V4.3.8

**VitalGuard**

**Security Audit Scope & Engagement Brief**

Application Artifact: VitalGuard AI V4.3.8

| **Document type** | Formal security audit scope and engagement brief |
| --- | --- |
| **Intended reviewer** | OTF Security Lab independent security audit partner |
| **Application version** | V4.3.8 |
| **Primary audit artifact** | VitalGuard_AI_complete_V43_7.html |
| **Confidentiality** | Responsible disclosure and limited audit-use handling |

---

## 1. Purpose and Audit Goal

VitalGuard AI is a single-file, offline-first humanitarian technology demonstration intended for low-connectivity and outage-prone environments. The application presents strong user-facing claims: no cloud dependency, no telemetry, local-only storage, user-controlled deletion, Bluetooth proximity monitoring, and optional encrypted backup. Those claims are appropriate for independent security verification because the intended users may include people operating in high-risk or resource-constrained settings.

The audit goal is not a broad feature QA cycle. The goal is to produce a precise security verdict for the V4.3.8 artifact: which claims are supported, which are supported only under defined execution contexts, and which require remediation or clearer user guidance.

---

## 2. Primary Audit Artifact

| **Frozen artifact name** | VitalGuard_AI_complete_V43_7.html |
| --- | --- |
| **APP_VERSION** | 4.3.8 (declared in source at line 710) |
| **File size** | 440,577 bytes (430.3 KiB) |
| **Line count** | 9,997 |
| **Architecture** | Single-file HTML with inline CSS and JavaScript; no build system; no external script imports in the submitted artifact |
| **Persistence identifiers** | DB_NAME = VitalGuardAI_V41; DB_VERSION = 2; LS_PREFIX = vg41_ |
| **Scope boundary** | Only this V4.3.8 artifact is in scope unless a replacement artifact is explicitly frozen with a new hash |

### Artifact observations to validate

| **Area** | **Observed in V4.3.8 source** | **Audit implication** |
| --- | --- | --- |
| CSP and browser controls | CSP meta includes connect-src 'none', object-src 'none', base-uri 'none', frame-ancestors 'none', and form-action 'none' at line 8; referrer and nosniff controls appear at lines 9-10. | Verify runtime enforcement in local and hosted contexts; assess residual risk from required unsafe-inline usage. |
| Permissions surface | Permissions-Policy permits geolocation, microphone, bluetooth, and motion sensors for self at line 11. | Verify permissions are user-initiated, disclosed, and not triggered during passive launch. |
| Network APIs | Static inspection did not identify fetch(), XMLHttpRequest, WebSocket, sendBeacon, or EventSource application calls; the Service Worker uses a fetch event handler without a network fallback. | Instrument runtime network traffic and separate application behavior from browser/platform behavior. |
| Service Worker | Install path caches the same-origin start URL; fetch handler is cache-only and returns offline responses on cache miss (lines 7219-7258). | Test install, cache hit, cache miss, navigation fallback, and offline operation. |
| Sensitive prompts | Sensitive data entry is routed through SecurePrompt and ConfirmModal; native window prompt/confirm should not be used for secrets or destructive actions. | Test spoofing, focus behavior, cancellation, password visibility toggle, and accessibility. |
| Ethical manifest | ETHICAL_MANIFEST is Object.freeze-protected, and EthicalGuard validates integrity at boot and periodically. | Verify tamper detection, diagnostics visibility, and claim wording so ethics controls are not overstated. |

---

## 3. Core Audit Questions

Does the V4.3.8 artifact generate any application-initiated network egress during normal use, PWA install, offline operation, backup/export/import, SOS, BLE monitoring, or diagnostics?

Are local storage, reset, factory reset, and optional auto-wipe paths accurate, complete, and clearly described as guaranteed versus best-effort?

Are Bluetooth, geolocation, microphone, motion sensor, notification, clipboard, and share APIs only invoked through clear user action and safe permission flows?

Is the encrypted backup and import path robust against cryptographic misuse, malformed input, denial of service, and state poisoning?

Can attacker-controlled strings from BLE advertisements, imports, rescue packs, QR payloads, emergency fields, or diagnostics reach the DOM unsafely?

Do on-device ML components and persisted model state resist poisoning, leakage, and resource exhaustion within realistic browser constraints?

Are ethics and non-abuse controls represented accurately as integrity and auditability mechanisms rather than as absolute runtime enforcement guarantees?

---

## 4. Proposed Work Packages

### WP0 — Artifact Freeze and Threat Model Alignment

**Objective:** Establish one unambiguous V4.3.8 target and agree how each security claim will be evaluated across execution contexts.

#### Review tasks:

Record exact artifact filename, SHA-256, file size, line count, and browser/runtime assumptions.

Confirm the three execution contexts to be tested: local file open, localhost/local HTTPS, and hosted HTTPS if a hosted deployment is in scope.

Define whether zero-egress means no application-authored external traffic, no third-party traffic, or no network traffic at all after initial page load.

Separate source-level findings, browser-runtime findings, and deployment-layer findings in all conclusions.

**Expected evidence:** A kickoff note that freezes the V4.3.8 artifact and maps every test to a security claim.

---

### WP1 — Zero-Egress and Runtime Network Verification

**Objective:** Validate the no-cloud/no-telemetry claim with both static review and network instrumentation.

#### Review tasks:

Search all JavaScript for network primitives, external script/link imports, automatic navigation, prefetch/preconnect behavior, beaconing, analytics, and telemetry patterns.

Review CSP, especially connect-src 'none', worker-src, manifest-src, script-src, img-src, media-src, and the necessity of unsafe-inline for a single-file architecture.

Review Service Worker installation and cache-only fetch behavior; confirm there is no cache-miss network fallback.

Classify user-clicked external anchors, mailto links, navigator.share, and clipboard actions separately from passive application egress.

#### Runtime / test tasks:

Run browser network capture during launch, tag registration, BLE monitoring, SOS, geolocation save, voice recording, backup/export/import, diagnostics, PWA install, offline restart, cache hit, and cache miss.

Repeat tests in file open, localhost/local HTTPS, and hosted HTTPS contexts as available.

If a hosting platform injects scripts or performs proxy-layer requests, attribute those findings to deployment context and report whether they affect end-user zero-egress wording.

**Expected evidence:** A test matrix with verdicts per context: Supported, Supported with caveats, Partially supported, Not supported, or Not applicable.

---

### WP2 — CSP, Permissions Policy, and Sensitive Browser API Surface

**Objective:** Evaluate whether the browser security boundary and permission prompts match the claimed privacy posture.

#### Review tasks:

Review CSP compatibility with inline single-file architecture, blob workers, data/blob media, and generated manifest behavior.

Review Permissions-Policy for geolocation, microphone, bluetooth, accelerometer, gyroscope, magnetometer, camera, payment, and USB.

Map all sensitive API call sites: Web Bluetooth LE scan, geolocation, MediaRecorder/getUserMedia, notifications, Web Share, clipboard, wake lock, motion events, and speech synthesis.

Confirm no sensitive API is invoked automatically before a clear user action or consent step.

Review the dynamically generated Blob-based Service Worker registration to ensure it cannot be hijacked to bypass CSP or intercept requests maliciously.

#### Runtime / test tasks:

Capture browser permission prompts and denied-permission behavior on representative browsers, especially Android Chrome for Web Bluetooth.

Verify that geolocation and microphone data remain local and are not included in exports unless explicitly expected by the feature design.

Test behavior when permissions are denied, revoked, or unavailable.

**Expected evidence:** A permissions map showing trigger, storage effect, export effect, error behavior, and user-visible disclosure for each sensitive API.

---

### WP3 — Local Storage, Reset, Factory Reset, and Auto-Wipe Verification

**Objective:** Confirm the local-only persistence model and the completeness of data deletion paths.

#### Review tasks:

Review IndexedDB stores: pets, settings, AI state, alerts, blobs, and any upgrade behavior under DB_VERSION = 2.

Review localStorage keys under LS_PREFIX = vg41_, including blob fallback keys and any legacy/migration keys.

Review Store.clearAll(), Security.fullWipe(), ResetCenter hard reset, ResetCenter factory reset, and auto-wipe-on-close behavior.

Identify any residual data in Cache Storage, Service Worker registrations, IndexedDB open-handle edge cases, localStorage, object URLs, clipboard, downloads, and browser history.

#### Runtime / test tasks:

Create data in every relevant store and test normal close, browser crash/reopen, soft reset, hard reset, factory reset, and auto-wipe-on-close.

Test failure modes: blocked IndexedDB deletion, cache deletion failure, service worker unregister failure, quota errors, and partially completed wipe operations.

**Expected evidence:** A deletion assurance table that distinguishes guaranteed deletion, best-effort deletion, browser-dependent residuals, and user-action residuals such as exported files.

---

### WP4 — BLE Scanning Privacy, Matching Safety, and Radio-Side Detectability

**Objective:** Assess Web Bluetooth behavior as a local radio and operational privacy surface rather than as internet egress.

#### Review tasks:

Review requestLEScan usage, advertisementreceived routing, filtering by namePrefix, acceptAllAdvertisements fallback, registration scan mode, and Focus mode.

Review tag signature matching, ambiguous-match handling, collision thresholds, scan throttling, congestion detection, restart cooldowns, and bounded restart jitter.

Review whether BLE advertisement names or manufacturer data are attacker-controlled inputs into UI or persisted state.

Assess whether scan patterns, repeated-device handling, or restart timing could be locally detectable by nearby adversaries.

Assess the AudioEngine (Emergency Siren & Keepalive) for potential resource exhaustion or memory leaks during prolonged background execution.

#### Runtime / test tasks:

Test crowded BLE environments with benign and maliciously named devices.

Compare tracking mode versus registration mode, filter mode versus accept-all mode, and Focus mode versus all-pet mode.

Measure whether scan restarts or permission prompts create operationally meaningful signals for high-risk users.

**Expected evidence:** A BLE privacy and reliability assessment that separates local radio detectability, browser permission exposure, and application-level matching risks.

---

### WP5 — Encrypted Backup, Import, and Rescue Pack Review

**Objective:** Verify that backup/export/import flows are safe, understandable, and resistant to malicious input.

#### Review tasks:

Review plain JSON export, optional encrypted backup, rescue pack generation, rescue pack import, diagnostics export, and voice recall inclusion logic.

Validate CryptoBox parameters: PBKDF2 with SHA-256 and 120,000 iterations, random 16-byte salt, random 12-byte AES-GCM IV, and AES-GCM 256-bit derived key.

Review SecurePrompt passphrase collection, password confirmation, cancellation, length enforcement, and password visibility behavior.

Review import allowlists, schema validation, unknown-field stripping, ID/name/icon sanitization, blob restore, settings import, and encrypted pack decryption behavior.

Evaluate the CryptoBox AES-GCM implementation and PBKDF2 derivation for appropriate IV/salt entropy and resistance to side-channel or timing attacks within the browser environment.

#### Runtime / test tasks:

Test malformed JSON, truncated encrypted packs, wrong passphrases, oversized payloads, duplicate IDs, hostile settings, hostile ML state, hostile blob payloads, and repeated import/export cycles.

Verify that restore failures do not leave partial state, expose plaintext secrets, or create persistent corrupt state.

**Expected evidence:** A cryptographic and import-safety report covering confidentiality, integrity, user error handling, and state poisoning risk.

---

### WP6 — DOM Injection, Input Sanitization, and UI Security

**Objective:** Determine whether attacker-controlled strings can execute script, corrupt UI, or mislead users.

#### Review tasks:

Review sanitizer paths for pet names, icons, emergency profile fields, phone numbers, imported backups, rescue packs, QR payload display, diagnostics, and BLE advertisement data.

Confirm BLE advertisement names are escaped before DOM insertion and that inline event handlers receive sanitized identifiers only.

Review usage of innerHTML, dynamically generated modals, QR code payload rendering, diagnostics output, and code strings embedded in Service Worker registration.

Confirm sensitive and destructive flows use SecurePrompt and ConfirmModal rather than native browser prompt/confirm for secrets or reset confirmation.

#### Runtime / test tasks:

Inject HTML/script payloads through BLE names, backup files, rescue packs, emergency fields, pet names, calibration labels, diagnostics, and localization-sensitive text paths.

Test modal focus, cancellation, keyboard behavior, and password masking to evaluate spoofing and accidental confirmation risk.

**Expected evidence:** A DOM/input attack surface map with exploitability, affected paths, remediation guidance, and retest steps.

---

### WP7 — On-Device ML Integrity, Poisoning, and State Leakage

**Objective:** Review lightweight local ML components as security-relevant state that may be poisoned or may leak behavior patterns.

#### Review tasks:

Review KalmanRSSI, QLearningLite, KNNLite, IsolationForestLite, RLSCalibrator, BehavioralFingerprint, and persisted AI state under vg41_ storage.

Assess whether imported model state can bias alerts, suppress warnings, inflate confidence, create denial of service, or reveal historical movement/alert behavior.

Confirm ML output is advisory and that primary safety decisions remain bounded by deterministic thresholds, hysteresis, and rate limits.

#### Runtime / test tasks:

Import malformed, extreme, and adversarial ML state; test repeated false-feedback loops; test resource exhaustion with large samples; verify recovery through reset paths.

**Expected evidence:** A model-state risk assessment covering poisoning, privacy leakage, user control, reset effectiveness, and resilience to malformed imports.

---

### WP8 — Ethical Manifest and Non-Abuse Control Integrity

**Objective:** Assess the accuracy and tamper-resistance of ethics-by-design claims without overstating runtime enforcement.

#### Review tasks:

Review ETHICAL_MANIFEST immutability, frozen prohibited/principles arrays, EthicalGuard validation checks, boot validation, periodic revalidation, and diagnostics summary.

Determine whether tampering is detected under realistic JavaScript mutation attempts, injected scripts, malicious extensions, or corrupted imports.

Evaluate whether user-facing claims clearly communicate that ethics controls are integrity and auditability mechanisms, not a universal technical prevention layer.

Recommend wording or UI improvements if ethical restrictions are better represented as policy, warning, transparency, or configuration constraints.

#### Runtime / test tasks:

Attempt runtime tampering of manifest properties and arrays; inspect logs, diagnostics, and continued app behavior.

Test whether any prohibited-use messaging is visible where users or deployers would reasonably see it.

**Expected evidence:** A non-abuse control assessment that supports responsible deployment while keeping security claims technically precise.

---

## 5. Recommended Priority Order

| **Priority** | **Work package** | **Why it matters** | **Suggested depth** |
| --- | --- | --- | --- |
| 1 | WP0/WP1 | Artifact freeze and zero-egress are the primary trust claims. | Deep static + dynamic instrumentation |
| 2 | WP3 | Residual data risk directly affects high-risk users and local-only claims. | Deep storage and deletion testing |
| 3 | WP2 | Sensitive browser APIs define the privacy and permission footprint. | Targeted source review + prompt capture |
| 4 | WP5 | Backup/import can expose secrets or corrupt state. | Crypto review + adversarial input testing |
| 5 | WP4 | BLE is a local radio exposure surface and a matching-safety risk. | Targeted radio/privacy scenarios |
| 6 | WP6 | Attacker-controlled strings can cross into DOM and UI flows. | Focused injection tests |
| 7 | WP7 | ML state is local but security-relevant when imported or persisted. | Targeted poisoning and leakage review |
| 8 | WP8 | Ethics controls should be accurate, auditable, and not overstated. | Integrity and claim-language review |

---

## 6. Suggested Out-of-Scope Boundaries

The following items should remain out of scope unless they materially affect one of the security claims above:

General UX polish, branding, visual design, copy editing, and non-security product feedback.

BLE range accuracy as a product-quality metric, animal-safety validation, or certification of life-critical reliability.

Backend, server, repository, build pipeline, or infrastructure review outside the frozen single-file artifact, except where hosted runtime behavior affects zero-egress or browser security claims.

Future revisions, prior V4.2.x revisions, or delta comparisons unless explicitly frozen into a separate scope with a new artifact hash.

Commercial, licensing, fundraising, governance, or organizational review beyond technical claims that affect user safety or security.

---

## 7. Reporting Requirements

For each material finding, the report should include:

Affected artifact name, SHA-256, execution context, browser/OS, and exact reproduction steps.

Classification as source-level, runtime-level, deployment-context-dependent, or user-action-dependent.

Security claim affected, realistic impact, exploitability, and recommended severity.

Evidence, including static code references, network captures, storage snapshots, permission prompts, or adversarial input payloads as appropriate.

Concrete remediation guidance and, where feasible, a retest procedure with expected passing behavior.

A final claim verdict table using: Supported, Supported with caveats, Partially supported, Not supported, or Not applicable.

---

## 8. Engagement Type Requested

| **Engagement type** | **Scope fit** | **Relevant work packages** |
| --- | --- | --- |
| Static code audit | Primary review mode for a single-file artifact with clearly stated security claims. | WP0-WP8 |
| Dynamic runtime verification | Required for network, storage, Service Worker, permission prompts, and browser-dependent behavior. | WP1-WP6 |
| Focused adversarial testing | Required for imports, rescue packs, backup formats, BLE names, DOM paths, and ML state. | WP4-WP7 |
| Operational privacy review | Required for high-risk user contexts involving BLE, geolocation, microphone, and local residual data. | WP2-WP4 |

---

## 9. Summary

The V4.3.8 scope is intentionally narrow and audit-friendly: one frozen single-file artifact, a fixed hash, clear execution contexts, and claim-based work packages. The audit should verify the strongest user-facing statements first: no telemetry/no cloud egress, local-only storage, deletion behavior, sensitive API prompts, encrypted backup safety, and resilience against malicious local inputs. Findings should be tied to the exact artifact and should distinguish source issues from browser or deployment-layer behavior.

This structure gives the security reviewer a practical path to validate VitalGuard AI without scope drift, while preserving the technical precision required for high-risk humanitarian use cases.
