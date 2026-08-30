# VitalGuard AI v4.5.8 (Offline AI Potential)

I will do my utmost to fulfill this responsibility.

My greatest strength is architecture—the ability to design systems, define direction, and transform ideas into practical solutions.

Morgan J. (Gyu-Min Jeon) — Architect, Independent Developer

## 0. What changed in v4.5.8 (regression-fix release)

v4.5.8 is a pure regression-fix on the v4.5.7 audited baseline. UI markup, layout, dialogs
and user-visible flows are unchanged except that the fixed features now actually operate;
no interface elements were added, removed, or restyled. All v4.5.7 hardening controls
remain in force unchanged. Fix IDs below match the in-file comments (`VG458-…`).

| ID | Severity | Fix | Where |
|---|---|---|---|
| VG458-01 | Critical (release-blocking) | `VitalGuardActionPolicy.parse()` rejected the allowlisted action `DataManager.handleImport(event)` because the unanchored case-insensitive deny pattern `/import\s*\(/` matched the `Import(` substring inside the method name; the Trusted Types scrubber then stripped `data-vg-onchange` from `#import-input`, so encrypted-backup restore never started. The four call-style deny patterns (`eval/Function/import/fetch`) now require a left identifier boundary; the strict `Namespace.method(args)` grammar plus the allowlist remains the primary security boundary. | `~888-897` |
| VG458-02 | High | `routeAdvertisement()` resolves exact local device-ID bindings **before** metadata clone-candidate detection, and clone suspicion is recorded per tag without aborting the router. Two legitimate same-model tags (identical advertised name / manufacturer data, different local device IDs) no longer quarantine each other, and the correctly bound tag keeps updating. Advertisements with no exact local binding are still never routed (fail-closed rule unchanged). | `~10996-11030` |
| VG458-03 | Medium | Language selection executed `I18N.setLang()` up to three times per user action (`data-vg-onchange` + `data-vg-oninput` + a native `change` listener), repeating the full re-render/persist pass. One policy-governed dispatch path remains and `setLang()` gained an idempotence guard. | `~3154-3166`, `~3245-3252`, markup `#langSelect` |
| VG458-04 | High | SOS and Emergency hold-to-activate timers are now disarmed on every gesture-termination path (`pointerup`/`pointercancel`/`touchend`/`touchcancel`/`mouseup`/`dragend` at document level, window `blur`, page hidden), closing the unintended-activation window left by interrupted gestures (press released outside the button, platform-cancelled touch, drag-off, tab switch). | `V4.5.8 HOLD-CANCEL HARDENING` `~11136` |

Release verification (v4.5.8 final build, all confirmed against the shipped bytes):

* Both inline scripts parse cleanly (syntax-checked on the extracted final blocks).
* All 106 `data-vg-on*` action strings present in the final DOM pass
  `VitalGuardActionPolicy.parse()` (this is the exact test class that would have caught
  VG458-01 before release); representative hostile strings (`import('x')`, `fetch(...)`,
  `eval(...)`, `Function(...)`, non-allowlisted `Namespace.method`, forbidden argument
  atoms) remain rejected.
* CSP: the second inline script hash was recomputed from final content and written into
  the CSP meta; the first inline script (hardening core) and the stylesheet are
  byte-identical to v4.5.7, so their pinned hashes are retained. All three hashes verified
  against the shipped file.
* Detached whole-file reference: `SHA-256(VitalGuard_AI_complete_V45_8.html) =`
  `d2da9fd7ae0a1dfa5ca99bb353179fd1ce3a6314f9159fe26c3430142ae3e62a`
  (584,168 bytes, 11,229 lines).

Intentionally **not** in v4.5.8 (deferred to the next structural release so this build
stays a pure regression-fix on the audited baseline): modal focus-trap and switch-role
accessibility work, per-record vault envelopes and debounced/batched writes, module-source
build pipeline with automated CSP hashing and E2E gate, and product-wording changes.
Internal series banners (`V4.5.7 SECURITY REMEDIATION`, `V4.5.7 FINAL RISK-CLOSURE
ADDENDUM`), console log tags, the first-script hardening-core profile string, and the
in-stylesheet section header intentionally keep their `v4.5.7` names: they identify the
module family, and editing the stylesheet would needlessly invalidate its CSP hash.

---

## 0-a. What changed since v4.3.8

v4.5.7 keeps the entire v4.3.8 hardened base (nonce-era CSP concepts, Trusted Types, action
dispatcher, sanitizer, zero-egress guard, encrypted backup, bounded import) and adds a
remediation stack at the end of the file (banners `V4.5.7 SECURITY REMEDIATION` →
`V4.5.7 FINAL RISK-CLOSURE ADDENDUM`, lines ~10413–11134). Those late blocks re-bind
several earlier behaviors, so for the controls below the **final** definition wins.

| Area | v4.3.8 | v4.5.7 (reinforced) | Where |
|---|---|---|---|
| CSP authorization | Nonce on one inline script | **Hash-based CSP** (`script-src 'sha256-…'`, `style-src 'sha256-…'`), `default-src 'none'`, no `'self'`; editing any script/style byte requires re-hashing | head `23` |
| Auto-translation | not addressed | `translate="no"` + `<meta name="google"/robots content="notranslate">` (offline/no-telemetry consistency) | head `14, 17-18` |
| BLE identity | Metadata score routed traffic; "verified" via RSSI | **Fail-closed**: `isAuthenticated()` is always `false`; routing needs exact local device-id binding **plus** ≥2 evidence and score ≥0.60; clone/ambiguity quarantine; implausible-RSSI-jump block; no positive SAFE state or directional guidance for generic BLE | `BLE IDENTITY / FAIL-CLOSED SAFETY` 10701, `FINAL RISK-CLOSURE ADDENDUM` 10907 |
| Import flow | Cancel could mean Replace; settings imported broadly | **Tri-state** (Merge/Replace/Cancel) where Escape/backdrop/Cancel = no change; Replace needs typed `REPLACE` + recovery backup; **atomic** vault commit; `autoWipeOnClose` forced `false`; plaintext import double-gated | `TRANSACTIONAL IMPORT / EXPORT` 10828 |
| Data at rest | IndexedDB/localStorage in clear | **Encrypted local vault** (AES-GCM-256, PBKDF2-SHA-256 600k, AAD-bound, v:3 envelope); fallback stores the **encrypted envelope** (never plaintext); legacy plaintext is migration-gated; session-only fail-closed mode | `ENCRYPTED LOCAL VAULT` 10532 |
| Rescue Pack | CRC32 only (integrity, not auth) | **Rescue Pack v2**: passphrase AES-GCM (AEAD), explicit location consent (off by default), expiry + one-time replay control (`jti`) | `RESCUE PACK v2` 10764 |
| `autoWipeOnClose` | A live setting (pagehide wipe) | **Removed**: excluded from import, forced `false` on get/set, toggle disabled, UI shows removed/data-safe | grep `autoWipeOnClose`; vault import |
| Quota handling | evicting | **non-evicting quota failure** option recorded in audit metadata | audit object 10899/11100 |
| Product scope | demo, broad claims | Explicit `security-scope` meta: "Controlled non-operational research demonstrator… not for SAR/pet/emergency/life-critical" | head `28` |
| Release integrity | in-app hash | `release-integrity` meta: in-app hash is **diagnostic only**; verify whole file against a detached SHA-256 manifest via an independent channel | head `27` |

closure of the BLE item requires
independent real-hardware + spoofing-transmitter retest.

---

## 1. v4.5.7 Security Hardening Summary

---

### Hash-based CSP (no nonce, no 'self')

`default-src 'none'`; `script-src`/`script-src-elem` authorize only specific SHA-256
hashes; `style-src` likewise; `script-src-attr 'none'`; `connect-src 'none'`;
`worker-src 'none'`; `object-src/frame-src/child-src 'none'`; `base-uri/form-action 'none'`;
`trusted-types vitalguard-html`; `require-trusted-types-for 'script'`. Because authorization
is by content hash, **any byte change inside a `<script>`/`<style>` block invalidates the
hash and the block will be blocked** until the CSP is recomputed (see §10).

---

### Browser auto-translation disabled

`<html translate="no">` plus `<meta name="google" content="notranslate">` and
`<meta name="robots" content="notranslate">`. The page is never offered to an online
translator, consistent with the offline/no-telemetry posture.

---

### BLE identity fail-closed

`BLEIdentityV455.isAuthenticated()` always returns `false`. `routeAdvertisement` only
processes a packet when a registered signature is `qualified` (exact local `device-id`
binding present **and** ≥2 evidence categories **and** score ≥0.60), blocks when two
registered tags match within 0.18 score, and `observe()` quarantines on simultaneous
multi-device-id observation or an implausible >22 dB jump with a different id within 3 s.
SOS directional guidance and positive SAFE states are disabled for unauthenticated tags.

---

### Tri-state atomic import

`TriChoiceModalV455` returns `'merge' | 'replace' | 'cancel'`; Escape, backdrop, and Cancel
all map to a non-destructive `{cancelled:true}`. Replace requires a typed `REPLACE` and a
recovery backup. Application is a single `SecureVaultV455.atomicUpdate(...)` so there is no
partial-apply state, and `autoWipeOnClose` is forced `false` on every import.

---

### Encrypted local vault (at-rest)

`SecureVaultV455` keeps pets/settings/ai/blobs inside one AES-GCM-256 envelope
(`PBKDF2-SHA-256`, 600,000 iterations, AAD-bound, `v:3`). The session key lives only in
memory. IndexedDB stores the envelope; the localStorage fallback also stores the
**encrypted envelope**, not plaintext. Legacy plaintext data is migration-gated and not
modified until encrypted.

---

### Rescue Pack v2 (AEAD + consent + replay)

Passphrase-derived AES-GCM with out-of-band shared-secret verification, location included
only with explicit consent (off by default), an expiry, and one-time `jti` replay control
(`v455ReplaySeen` / `v455MarkReplay`, persisted in `rescuePackUsedV455`).

---

### Carried from v4.3.8

Trusted Types / HTML sink scrubber, action-dispatch allowlist (no eval/Function),
runtime zero-egress guard (fetch/XHR/WebSocket/EventSource/sendBeacon/form.submit),
external-navigation block + copy-only sharing, redacted diagnostics, bounded import schema.

---

## 2. Execution, Permissions, and Offline Rules

- **Recommended runtime:** HTTPS or localhost for Web Bluetooth and PWA behavior. `file://`
  is fine for UI review but Bluetooth/PWA features may be browser-restricted.
- **Hash-CSP constraint:** the artifact only runs unmodified. If a host or proxy rewrites
  the inline scripts/styles (even whitespace), the hashes break and the app will not boot;
  report such rewrites as deployment-context issues.
- **Zero egress:** `connect-src 'none'` plus the runtime guard. Hosted platforms may still
  inject/request resources outside the artifact; treat those as deployment findings.
- **PWA:** blob manifest only; service-worker registration is intentionally absent/disabled.
- **Permissions:** Bluetooth, geolocation, microphone, motion, notifications, clipboard,
  wake lock are user-triggered and fail safely.
- **Scope:** the file declares itself a controlled non-operational research demonstrator;
  generic BLE is not authenticated and must not drive life-critical decisions.

## 3. Core Flow

    DOMContentLoaded / guarded bootstrap (line 11104)
      └─ App.init()
           ├─ Store.init()              // IndexedDB-first, localStorage fallback
           ├─ SecureVaultV455 unlock / session-only mode   // encrypted at-rest
           ├─ Settings.load() / Emergency.load()
           ├─ ErrorShield / SafeMode / ConductorAI / WakeLock hooks
           ├─ render + timers
           ├─ registerPWA()             // manifest only, no service worker
           └─ optional BLE.startScan('track') if monitoringWanted

    advertisementreceived
      └─ BLE._handler → App.onAdvertisement(event)
           ├─ routeAdvertisement(event, App.pets, now)            // rebound by v4.5.7
           │     ├─ BLEIdentityV455.evaluate() → qualified? (device-bound + ≥2 evidence + ≥0.60)
           │     ├─ ambiguity block (two tags within 0.18 score)
           │     └─ BLEIdentityV455.observe() → clone / RSSI-jump quarantine
           ├─ Pet.processRssi() applies Kalman, thresholds, hysteresis, zone
           ├─ App.triggerAlert() local-only
           └─ render / SOS.updateHC() (directional guidance disabled if unauthenticated)

## 4. Data Model and Storage Map

---

### IndexedDB object stores

`pets` `settings` `ai` `alerts` `blobs`. Database `VitalGuardAI_V41`, version `2`.
In v4.5.7 the encrypted vault envelope is stored in `settings` under key
`__vg_vault_v455__`.

---

### localStorage fallback/prefix

`vg41_` prefix for fallback pet/settings/AI/blob data and first-run/install flags.
Vault fallback key `vg41_vault_v455` stores the **encrypted envelope** (not plaintext).
Language keys: `vg_lang_v41`, legacy `vg_lang_v412`.

---

### Encrypted vault / backup envelope (v:3)

`{enc:true, v:3, alg:'AES-GCM', kdf:'PBKDF2-SHA-256', it:600000, purpose, salt, iv, ct}`,
AAD-bound to the metadata. Vault envelope: `{vault:true, v:1, alg:'AES-GCM', it:600000,
salt, iv, ct}`. PBKDF2-SHA-256 600k, AES-GCM-256, salt 16 bytes, IV 12 bytes (fresh per op).

---

### Import constraints

File/text byte and char limits (`V455.maxImportBytes` / `maxTextChars`), depth 10, node cap
12000, pet cap (`V455.maxPets`), per-pet/voice size caps. Keys `__proto__/prototype/
constructor` are rejected (`v455AssertShape`). Plaintext backups are blocked by default and
require a typed `IMPORT PLAINTEXT` approval.

## 5. Module Directory

| Line | Module banner / search keyword | Role |
|---|---|---|
| `320` | `v4.5.7 SECURITY / ACCESSIBILITY` | Head-level CSS for security/accessibility surfaces (part of the hash-authorized stylesheet). |
| `815` | `V4.3.8 EARLY SECURITY GUARD` | Defense-in-depth bootstrap: sanitizer defaults, Trusted Types policy, HTML sink scrubber, mutation scrubber, document.write blocker, copy-only share. |
| `832` | `v4.3.8 ACTION DISPATCHER` | `data-vg-on*` allowlist dispatcher; no eval/Function; validated primitive args. |
| `1107` | `CONFIG` | `APP_VERSION '4.5.8'`, `DB_NAME VitalGuardAI_V41`, `DB_VERSION 2`, `LS_PREFIX vg41_`. |
| `1162` | `UTILS` | DOM lookup, clamp, median RSSI, rescue IDs, time/JSON/clock helpers. |
| `1199` | `OPEN SOURCE MANIFEST` | Frozen `ETHICAL_MANIFEST` (Apache-2.0, principles); validated at boot. |
| `1214` | `OPEN SOURCE NOTICE GUARD` | Runtime integrity check of license/manifest fields. |
| `1278` | `STATE` | Global runtime state for the scan/render loop. |
| `1282` | `AUDIO ENGINE` | Local-only alerts/siren/keepalive oscillator. No network. |
| `1399` | `TOAST` | Transient local UI messages. |
| `1415` | `I18N (7 Languages)` | Localized dictionaries/HTML, RTL Arabic; sets `documentElement.lang/dir`. |
| `3567` | `STORAGE` | IndexedDB-first store + localStorage fallback; `safeLocalStorageSet` quota-safe. |
| `3729` | `SIGNAL FILTER (KALMAN)` | RSSI smoothing with adaptive noise. |
| `3764` | `DISTANCE ESTIMATOR (V20)` | RSSI→distance + calibration points. |
| `3800` | `Q-LEARNING LITE` | Local threshold widen/narrow suggestions. |
| `3860` | `BEHAVIORAL FINGERPRINT` | Local movement/anomaly heuristics. |
| `3893` | `RING BUFFER` | Bounded RSSI/scan/alert/error buffers. |
| `3904` | `PET MODEL` | Per-pet signature, thresholds, RSSI processing, zone, alerts, serialization. |
| `4139` | `QR GENERATOR (V4.1)` | Embedded QR for emergency/rescue payloads. |
| `5065` | `VOICE RECALL (V20)` | Mic capture + IndexedDB blob storage/playback. |
| `5140` | `VOICE ANNOUNCER (TTS)` | SpeechSynthesis zone announcements (says "identity not authenticated" when unauthenticated). |
| `5176` | `BLE MATCHING` | Base advert scoring helpers; `matchScore`/`routeAdvertisement` are **rebound by v4.5.7**. |
| `5209` | `BLE ENGINE` | Web Bluetooth scan engine, filters, restart/congestion, scan health. |
| `5406` | `WIZARD` | Tag registration/reverify with scan consent (v4.5.7 marks signatures `authMode:'advertisement-only'`). |
| `5828` | `SOS MODULE` | SOS finder, saved location, hot/cold UI (directional guidance gated by authentication). |
| `5965` | `EMERGENCY MODE` | Emergency profile, siren/strobe, QR card, shake; copy-only sharing. |
| `6195` | `PET DETAIL OVERLAY` | Per-pet details, thresholds, charts, AI, injected v4.1 controls. |
| `6483` | `NAV` | Panel switching Home/SOS/Tips/Settings. |
| `6518` | `SETTINGS` | Global toggles, notifications, perf, volume, pet management, reset. |
| `6676` | `DATA MANAGER` | Export/import entrypoints (rebound to v4.5.7 encrypted/transactional functions). |
| `6758` | `DIAGNOSTICS` | Snapshot/copy/download; redacted; reports `securityV455` posture. |
| `6867` | `META-COGNITIVE COACH` | Local tips/actions from scan/environment state. |
| `6939` | `APP CORE` | Boot, timers, render, monitoring, demo, advertisement handling, alerts. |
| `7415` | `PWA` | Blob manifest only; no service-worker registration. |
| `7476` | `SAFE TEXT / SANITIZER` | Name/phone/text/icon/HTML-escape/safeId helpers. |
| `7518` | `ERROR SHIELD` | Local error ring buffer, bounded persistence. |
| `7587` | `CAPABILITY MATRIX` | Capability detection + badges. |
| `7653` | `ACCESSIBILITY (UX)` | Large text / high contrast / reduced motion. |
| `7667` | `WAKE LOCK` | Screen wake-lock for monitoring. |
| `7701` | `AI PACK v4.1` | Local kNN / RLS calibrator / isolation-forest-lite. |
| `7969` | `CONDUCTOR AI` | Local self-heal/UX suggestions, battery-aware safe mode. |
| `8102` | `RESET / INITIALIZE CENTER` | Reset/factory UI + `Security.fullWipe`. |
| `8256` | `ENCRYPTED BACKUP (AES-GCM)` | v4.3.8/4.4 CryptoBox (PBKDF2 600k, AES-GCM, AAD v2). |
| `8320` | `V40 UI INJECTION` | Backward-compatible UI injection layer. |
| `8496`–`9940` | `PATCH: …` / v4.1 feature blocks | Settings/BLE-filter/AI/feedback/wizard/diagnostics/coach patches; QR, RLS calibration, Rescue Pack (v1), per-pet alerts, max-active-pets, leash slider, persist v4.1 fields. |
| `10012` | `V4.3.8 FINAL HARDENING LAYER` | Egress kill-switch, external-navigation guard, copy-only sharing, sanitizers, rescue-pack hardening. |
| `10370` | `v4.3.8 FINAL AUDIT HARDENING` | Audit-hardening metadata + redacted diagnostics. |
| `10413` | `V4.5.7 SECURITY REMEDIATION` | IIFE entry for the remediation stack; `V455` frozen config, `V455Crypto`, helpers. |
| `10513` | `TriChoiceModalV455` | Merge/Replace/Cancel modal; abort = non-destructive. |
| `10549` | `ENCRYPTED LOCAL VAULT` | `SecureVaultV455` AES-GCM at-rest vault + `atomicUpdate` write queue. |
| `10718` | `BLE IDENTITY / FAIL-CLOSED SAFETY` | `BLEIdentityV455` evaluate/observe; rebinds `matchScore`/`routeAdvertisement`; clone/RSSI quarantine. |
| `10781` | `RESCUE PACK v2` | AEAD pack build/validate, location consent, `jti` replay control. |
| `10845` | `TRANSACTIONAL IMPORT / EXPORT` | `v455HandleImport`/`v455ApplyImport`, sanitizers, atomic apply; rebinds `DataManager`/`VitalGuardHardenedImport`. |
| `10884` | `UI / CLAIMS / RELEASE INTEGRITY` | Vault status UI, claims text, `VitalGuardAuditHardeningV455`, `VitalGuardReleaseInfoV455`. |
| `10924` | `V4.5.7 FINAL RISK-CLOSURE ADDENDUM` | Final BLE binding enforcement + audit object with `residualRisk`. |
| `11204` | `V4.3.8 GUARDED BOOTSTRAP` | Single boot guard + safe boot failure handling. |

## 6. Security Line Map

| Control | Source lines | Review note |
|---|---|---|
| Auto-translate off | `14, 17-18` | `translate="no"`, google/robots `notranslate`. |
| License / SPDX | `19-21` | Apache-2.0; SPDX expression `Apache-2.0 AND MIT` (Nayuki QR is MIT). |
| Hash-based CSP | `23` | `default-src 'none'`, `script-src`/`style-src` by SHA-256, TT required, connect/worker/object/frame none. |
| Required response headers (meta note) | `25` | Documents headers to set when served over HTTP(S): `frame-ancestors`, XCTO nosniff, Permissions-Policy, COOP/CORP. |
| Security limitations (meta) | `26` | meta-CSP can't enforce frame-ancestors/sandbox; top-level navigation not immutable from JS. |
| Release integrity (meta) | `27` | In-app hash diagnostic only; verify against detached SHA-256 manifest. |
| Security scope (meta) | `28` | Controlled non-operational research demonstrator; generic BLE not authenticated. |
| APP_VERSION / storage consts | `1108-1114` | `4.5.8`, `VitalGuardAI_V41`, DB v2, `vg41_`. |
| Action dispatcher | `832-…` | `data-vg-on*` allowlist; no eval/Function; validated args. |
| Trusted Types / sink scrubber | `815-…` | TT policy, HTML neutralization, MutationObserver scrubber, document.write/share override. |
| safeLocalStorageSet (quota) | `3567-…` | Quota-safe write; non-evicting failure path recorded in audit metadata. |
| Security.fullWipe | (Reset/Initialize Center) `8102-…` | Best-effort wipe of store, DB, caches, SW registrations. |
| V455 frozen config | `10428-10440` | `vaultKey __vg_vault_v455__`, `vaultFallbackKey vg41_vault_v455`, iterations, limits. |
| V455Crypto | `10472-10508` | PBKDF2-SHA-256 600k, AES-GCM-256, AAD-bound `v:3` envelope, legacy-decrypt path, SHA-256 helper. |
| TriChoiceModalV455 | `10513-10535` | Escape/backdrop/Cancel → `'cancel'` (no change). |
| SecureVaultV455 | `10549-…` | AES-GCM vault, envelope in IndexedDB or encrypted fallback, `atomicUpdate` write queue. |
| BLEIdentityV455 | `10718-10777` | `isAuthenticated()=>false`; qualified gate (device + ≥2 evidence + ≥0.60); clone & RSSI-jump quarantine; SOS guidance gating. |
| Rescue Pack v2 | `10781-10817` | AEAD, location consent, expiry, `jti` replay (`rescuePackUsedV455`). |
| Transactional import | `10845-10883` | Tri-state, typed `REPLACE` + recovery backup, atomic vault commit, `autoWipeOnClose:false`, plaintext double-gate. |
| Audit / release objects | `10916-10918`, `11132-11135` | `VitalGuardAuditHardeningV455` controls + `residualRisk`; release verification note. |
| Guarded bootstrap | `11204-…` | Single boot guard, safe failure. |

## 7. Action Dispatch Allowlist

The dispatcher permits only explicit first-party `Namespace.method` calls. Arguments are
limited to short strings, numbers, booleans, null, `this.value`, or the event object, and
constructor/prototype/eval/Function/import/network/storage/cookie/document.write/
window.open/location patterns are blocked before dispatch.

| Namespace | Allowed methods |
|---|---|
| `App` | `dismissFirstRun` `focusFromChip` `setTrackMode` `toggleDemo` `toggleMonitoring` |
| `DataManager` | `exportAll` `handleImport` `importFile` |
| `Detail` | `aiFeedback` `applySuggestion` `close` `open` `resetQ` `setLeash` `suggestAI` `toggleAI` `updateThreshold` |
| `Diag` | `close` `copy` `download` `open` |
| `Emergency` | `close` `deactivate` `holdEnd` `holdStart` `open` `requestMotionPermission` `saveFromUI` `share` `toggleShake` |
| `ErrorShield` | `clear` |
| `Help` | `close` `open` |
| `Lang` | `choose` `close` `open` |
| `Legal` | `close` `open` |
| `Nav` | `go` |
| `ResetCenter` | `close` `factory` `hard` `open` `soft` |
| `SOS` | `deactivate` `holdEnd` `holdStart` `saveLocation` `selectPet` `shareMessage` |
| `SafeMode` | `disable` |
| `Settings` | `removePet` `resetApp` `setPerf` `setVolume` `toggle` `toggleNotif` `toggleV40` |
| `V40UI` | `exportEncrypted` `showPitch` |
| `VGHardening` | `runCoachAction` |
| `VoiceRecall` | `play` `record5s` |
| `Wizard` | `clearCalib` `close` `goStep3` `open` `pickIcon` `recordCalib` `rescan` `save` `selectCandidate` `skipVerify` |

v4.5.7 vault/rescue UI controls (`v455-vault-action`, `v455-rp-*`) are wired with bound
listeners inside the remediation IIFE rather than added as new dispatcher namespaces.

## 8. Settings / Storage Key Index

| Key | Meaning |
|---|---|
| `sound` | Global sound alerts. |
| `vibrate` | Haptic alerts. |
| `notifWanted` | Browser-notification intent. |
| `highAlert` | Tighter alert thresholds. |
| `perfMode` | saver / balanced / fast profile. |
| `voiceRecall` | Voice recall on CAUTION. |
| `tts` | SpeechSynthesis announcements. |
| `keepAlive` | Near-silent audio keepalive. |
| `autoWipeOnClose` | **Removed in v4.5.7** — forced `false` on get/set, excluded from import, toggle disabled. |
| `volume` | Master volume. |
| `useScanFilters` | BLE scan-filter toggle. |
| `screenAwake` | Wake Lock toggle. |
| `autoOptimize` | ConductorAI self-heal. |
| `largeText` / `highContrast` / `reduceMotion` | Accessibility toggles. |
| `monitoringWanted` | Persisted monitoring preference. |
| `safeMode` / `safeModeReason` | Conductor/SafeMode state. |
| `coachDismissed` | Coach card dismissal. |
| `lastTab` | Last active panel. |
| `emg_name / emg_phone / emg_medical / emg_shake` | Emergency profile. |
| `rescuePackUsedV455` | One-time Rescue Pack v2 replay ledger (`jti` + expiry). |
| `__vg_vault_v455__` | Encrypted vault envelope (IndexedDB `settings`). |
| `vg41_vault_v455` | Encrypted vault envelope (localStorage fallback). |
| `vg_lang_v41` / `vg_lang_v412` | Language keys outside `LS_PREFIX`. |

## 9. Module Deep Dive

---

### `BLE IDENTITY / FAIL-CLOSED SAFETY` **[line 10701]**

**Role:** Replaces metadata-only routing. Identity is never authenticated; routing needs
exact local device binding plus secondary evidence, and clones/anomalies are quarantined.

    const BLEIdentityV455={
      evaluate(event,sig){
        // device-id binding is the only strong term (+0.42); names/uuids/mfg are weak adds
        // qualified = hasDevice && evidence>=2 && score>=0.60
        return {score, evidence, qualified, why, authenticated:false,
                mode:'local-device-bound-non-cryptographic'};
      },
      // Advertisement-only BLE can be spoofed, so it is never authenticated -> always false.
      isAuthenticated(){return false;},
      observe(pet,event,result){
        // >1 device-id for the same tag within 8s  -> cloneSuspectedUntil (block 120s)
        // different id + >22 dB jump within 3s      -> cloneSuspectedUntil (block)
        // sets pet.identityStatus = 'UNAUTHENTICATED'
      }
    };
    matchScore=function(event,sig){return BLEIdentityV455.evaluate(event,sig).score;};
    routeAdvertisement=function(event,pets,now){
      // pick top qualified; if 2nd qualified within 0.18 -> ambiguous, block
      // observe() -> if blocked, drop packet; else processRssi()
    };

SOS directional guidance is gated: `SOS.updateHC` shows "UNAUTHENTICATED BLE — directional
guidance disabled" for any tag where `isAuthenticated()` is false. The wizard tags saved
signatures `authMode:'advertisement-only'`, `confirmed:false`.

---

### `ENCRYPTED LOCAL VAULT` **[line 10532]**

**Role:** AES-GCM-256 at-rest vault; the only persisted sensitive state. Fallback persists
the encrypted envelope, never plaintext.

    const V455Crypto = {
      // derive: PBKDF2-SHA-256, it=600000, AES-GCM-256 key
      // encryptPassphrase: v:3 envelope, fresh 16B salt + 12B IV, additionalData = AAD(meta)
      // decryptPassphrase / decryptLegacyBackup / sha256Text
    };
    const SecureVaultV455 = {
      rawGetEnvelope/ rawStoreEnvelope/ rawDeleteEnvelope,  // IndexedDB 'settings' or LS fallback
      encryptState / decryptState,                          // AAD = vaultAad(env)
      atomicUpdate(mutator){ /* writeQueue serializes; encrypt; store; swap state */ }
    };

`atomicUpdate` chains writes through a promise queue so a failed write never leaves partial
state. The vault envelope shape is `{vault:true, v:1, alg:'AES-GCM', it:600000, salt, iv, ct}`.

---

### `TRANSACTIONAL IMPORT / EXPORT` **[line 10828]**

**Role:** Tri-state, validated, atomic import. Replaces the legacy destructive importer.

    // mode = await TriChoiceModalV455.ask(...)  // 'merge' | 'replace' | 'cancel'
    // cancel/Escape/backdrop -> {cancelled:true}  (no change)
    if(mode==='replace'){
      // typed 'REPLACE' required; then v455RecoveryBackup() must succeed
    }
    await SecureVaultV455.atomicUpdate(d=>{
      // merge or replace pets; settings merged with {autoWipeOnClose:false}; voice only on consent
    });
    // rebinds:
    window.VitalGuardHardenedImport = v455HandleImport;
    DataManager.handleImport = v455HandleImport;
    DataManager.exportAll = ()=>v455ExportEncrypted('vitalguard-ai-v4.5.7-backup');

Plaintext backups (`enc!==true`) are blocked by default and require a typed
`IMPORT PLAINTEXT`. `v455AssertShape` enforces depth/node limits and rejects
`__proto__/prototype/constructor` keys.

---

### `RESCUE PACK v2` **[line 10764]**

**Role:** Encrypted, consent-gated, one-time rescue payload.

    // v455BuildPack(pet, includeLocation): AEAD pack; location only if includeLocation
    // v455ValidatePack(pack): shape/expiry checks
    // v455ReplaySeen(jti) / v455MarkReplay(jti,e): one-time use, persisted in rescuePackUsedV455

---

### `V4.3.8 EARLY SECURITY GUARD` **[line 815]** (carried)

**Role:** Sanitizer defaults, Trusted Types policy, HTML sink scrubber, mutation scrubber,
document.write blocker, copy-only share — installed before feature modules.

---

### `OPEN SOURCE MANIFEST` **[line 1191]** (carried)

**Role:** Frozen `ETHICAL_MANIFEST` (Apache-2.0, SPDX, principles), validated at boot by the
notice guard so injected code cannot silently rewrite license claims.

## 10. Hash-based CSP — build & re-hash procedure (important)

v4.5.8 authorizes inline code by SHA-256, so **editing any byte inside a `<script>` or
`<style>` block changes its hash and the browser will block that block until the CSP is
updated.** To re-hash after an edit:

1. Extract the exact inner text of each `<script>…</script>` and `<style>…</style>` block
   (the bytes between `>` and `</`).
2. Compute base64 SHA-256 of each block.
3. Replace the matching `'sha256-…'` values in both `script-src`/`script-src-elem`
   (and `style-src`/`style-src-elem`) in the CSP `<meta>` at head line 23.
4. Reload and confirm no CSP violation in the console.

Reference (Python): `base64.b64encode(hashlib.sha256(inner.encode()).digest())`. The in-app
self-hash is **diagnostic only**; release verification should use a detached whole-file
SHA-256 manifest published through an independent channel (`release-integrity` meta).

## 11. DOM ID Index

Static DOM/template IDs (navigation map, not a complete DOM proof). New in v4.5.7:
`v455-vault-action`, `v455-rp-start`, `v455-rp-stop`, `v455-rp-generate`, `v455-rp-copy`,
`v455-rp-location`.

`ai-feedback` `ai-suggestion` `app` `btn-demo-toggle` `btn-mode-all` `btn-mode-focus`
`btn-scan-toggle` `btn-skip-verify` `btn-verified` `btn-wiz-save` `calib-1m` `calib-10m`
`cm-cancel` `cm-msg` `cm-ok` `cm-title` `coach-body` `coach-card` `congestionBadge`
`custom-thresholds` `dash-controls` `dash-controls2` `detail-alerts` `detail-body`
`detail-overlay` `detail-title` `diag-body` `diag-overlay` `diag-pre` `dt-caution`
`dt-danger` `dt-warning` `emergency-active` `emg-active-name` `emg-active-sub` `emg-body`
`emg-call` `emg-medical` `emg-name` `emg-overlay` `emg-phone` `emg-qr` `emg-strobe`
`empty-state` `first-run-banner` `fr-proto` `hc-arrow` `hc-rssi` `hc-text` `help-body`
`help-overlay` `icon-picker` `import-input` `input-name` `installBanner` `installBtn`
`installDismiss` `lang-overlay` `langSelect` `legal-body` `legal-overlay` `notif-hint`
`panel-home` `panel-settings` `panel-sos` `panel-tips` `perf-balanced` `perf-fast`
`perf-saver` `pet-chips` `pet-list` `pwa-manifest` `reset-body` `reset-overlay`
`scan-health-fill` `scan-health-meta` `scan-health-row` `scan-list` `scan-status`
`scan-status-bar` `settings-pet-list` `sos-active` `sos-active-name` `sos-content`
`sos-focus-banner` `sos-no-pets` `sos-pet-select` `sos-snapshot` `sos-strobe-area`
`sp-1` `sp-2` `sp-3` `sp-cancel` `sp-fields` `sp-hint` `sp-msg` `sp-ok` `sp-title`
`toggle-autoOptimize` `toggle-autoWipeOnClose` `toggle-highContrast` `toggle-highalert`
`toggle-keepAlive` `toggle-largeText` `toggle-notif` `toggle-reduceMotion`
`toggle-scanFilters` `toggle-screenAwake` `toggle-sound` `toggle-tts` `toggle-vibrate`
`toggle-voiceRecall` `v40-adv-hint` `v41-ap-minzone` `v41-ap-sound` `v41-ap-tts`
`v41-ap-vibrate` `v41-calibpro-*` `v41-dcalib-*` `v41-leash-*` `v41-rp-*` `v455-rp-*`
`v455-vault-action` `verify-delta` `verify-status` `volumeSlider` `volumeVal`
`wiz-step-1` `wiz-step-2` `wiz-step-3` `wizard-overlay` `wizard-title`

(`i18n_*` and `tipsI18n` localization anchor IDs are present as in v4.3.8.)

---
### The potential of offline AI is virtually limitless.

During the review period, I continued researching and improving the project, resulting in dozens of iterative updates and refinements. The current version has evolved significantly beyond the V4.3.8 release originally provided to OTF. However, because repeatedly changing a version that has already entered the review process could create unnecessary confusion, I intentionally kept the OTF submission fixed at V4.3.8.

The current V4.5.8 release should not be considered a final or perfect version. Nevertheless, it reflects substantial efforts to eliminate potential risks where possible and to reduce remaining risks to the greatest extent practical.

Offline AI is not limited to Vanilla JavaScript. The underlying concepts can also be implemented and expanded through technologies such as Python and C++. If the project becomes self-sustaining in the future, I intend to continue advancing and hardening the platform accordingly.

I am both the architect and developer of this project. To work efficiently as an independent developer, I utilized AI-assisted tools during the development process. However, all architectural decisions, design choices, system requirements, and implementation directions were personally defined, reviewed, and controlled by me throughout the project.

Today, many experienced and senior developers use AI-assisted tools as part of their workflow. In my view, the important question is not who assisted with implementation, but who designed the system, who defines its direction, and who maintains responsibility for it.

A bricklayer may help construct a building, but that does not make the bricklayer the owner or architect of the structure. An architect may not personally lay every brick, yet remains responsible for the design, vision, and overall integrity of the project. In the same way, I retain complete control over the codebase, architecture, and future direction of this project.

I intentionally avoid reliance on large external dependency chains. Rather than depending on numerous third-party packages, I prefer to build the required modules directly whenever practical. This approach improves transparency, simplifies review, reduces supply-chain risk, and helps maintain long-term security and maintainability.

Should the project achieve greater independence and sustainability, I would be able to further develop, refine, and expand the offline AI platform in alignment with the goals, recommendations, and security expectations identified through the OTF review process.

