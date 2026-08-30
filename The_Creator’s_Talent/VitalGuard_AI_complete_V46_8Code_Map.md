# VitalGuard_AI_complete_V46_8 — Code Map and Release Verification

File: `VitalGuard_AI_complete_V46_8.html`  
Release: **V4.6.8**  
Artifact type: single-file, offline-first HTML application  
Copyright (c) 2026 Morgan J. (Gyu-min Jeon) — Licensed under the Apache License 2.0

---

## 0. Release identity

| Property | Final value |
|---|---|
| File size | **599,255 bytes** |
| Lines | **11,479** (`11,478` newline characters) |
| Whole-file SHA-256 | `4f8dafd13bf5e41de28be52ba77a9a8cfdaaadc5f6b6f073877e0e7435751f8b` |
| Early hardening script SHA-256, base64 | `Zb0VEPTvHVDHz3azJ+gLNQ2a5laGcUx07Sq6dc/gRXI=` |
| Main application script SHA-256, base64 | `lLEMGIKDYOlSnQP7s9DAYImRy5xRC7QbCylgP2PIrlY=` |
| Stylesheet SHA-256, base64 | `4L8r+PuvQvTXiLjEyR/lOlpjl+aUSyJJCFZp4ff/T1A=` |
| `APP_VERSION` | `4.6.8` |
| Database compatibility name | `VitalGuardAI_V41` |
| Database version | `2` |
| Local-storage compatibility prefix | `vg41_` |
| License | Apache-2.0; embedded Project Nayuki QR generator retains its MIT notice |

The three inline-resource hashes above were recalculated from the exact final bytes and written into both the applicable `*-src` and `*-src-elem` CSP directives. A post-write audit recalculated the hashes again and confirmed an exact match.

---

## 1. Source lineage and merge policy

V4.6.8 is not a blind union of every previous change. It uses a controlled lineage:

1. **V4.3.8 submission version** is the authority for the visible shell: layout, colors, navigation, cards, labels, dialog structure, settings controls, Rescue Pack control set, and localized presentation.
2. **V4.6.5** is the primary hardened runtime base: hash-pinned CSP, early immutable egress guards, CSPRNG local IDs, safer destructive confirmations, clean malformed-base64 failure, encrypted local vault, bounded transactional import, reserved-ID handling, null-prototype merge maps, strong passphrase rules, and Rescue Pack v2.
3. **V4.5.8** supplies four verified regression closures that were absent or regressed in V4.6.5: action-parser identifier boundaries, exact-bound BLE routing before clone checks, single language dispatch, and global hold cancellation.
4. **V4.5.8 Manual_next** supplies low-risk, nonvisual improvements: modal focus containment, keyboard semantics, live-region announcements, zoom accessibility, and debounced/batched encrypted writes.

High-risk structural work from the manual—record-per-envelope vault migration, source-module decomposition, and broad dead-code removal—was deliberately not mixed into this compatibility release. Those changes require a dedicated migration release and real-device regression program.

---

## 2. V4.3.8 UX and interface preservation proof

### 2.1 Static shell proof

The final `<body>` shell is byte-identical to the V4.3.8 submission shell after only these two normalization operations:

- release text `4.3.8` → `4.6.8`;
- removal of the duplicate, nonvisual `data-vg-oninput` language-dispatch attribute, leaving the single `change` route.

No visible card, navigation item, button, field, label, panel, overlay, or persistent banner was added to the static shell.

### 2.2 Stylesheet proof

The V4.6.8 stylesheet begins with the complete V4.3.8 stylesheet as an exact prefix. Only inactive accessibility-mode rules were appended:

- large text;
- high contrast;
- reduced motion.

They do not alter default rendering unless the corresponding root class is explicitly enabled.

### 2.3 Pixel comparison

A JavaScript-disabled Chromium render compared:

- the V4.3.8 submission shell normalized only as described above; and
- the final V4.6.8 artifact.

Test viewport: `430 × 900`; full-page render size: `430 × 1689`. The pixel-difference bounding box was empty: **pixel-exact match**.

### 2.4 Runtime UI compatibility

Runtime smoke tests confirmed:

- one V4.3.8 Rescue Pack card;
- the original six controls and labels: `Generate for selected pet`, `Share`, `Copy`, `SMS`, `Start Assist`, `Stop`;
- no `v455-vault-banner` persistent card;
- original Home panel active at boot;
- original import control retained;
- accessibility roles added without visual changes.

The only intentional UX behavior exception is removal of mobile zoom blocking. Pinch zoom is now permitted for accessibility; this does not restyle or rearrange the default interface.

---

## 3. V4.6.8 change register

| ID | Severity / class | Change | Final location |
|---|---|---|---:|
| **VG468-01** | Critical regression closure | Action-policy deny expressions for `eval`, `Function`, dynamic `import`, and `fetch` require a left identifier boundary. The allowlisted `DataManager.handleImport(event)` no longer collides with the `Import(` substring while hostile bare calls remain rejected. | `~892` |
| **VG468-02** | High regression closure | BLE routing resolves exact, valid local browser device-ID bindings before metadata clone-candidate checks. Two legitimate same-model tags no longer quarantine each other; unbound advertisements still fail closed. | `~10988–11022` |
| **VG468-03** | Medium regression closure | Language selection uses one policy-governed `change` path. The redundant `input` attribute and native listener were removed; `setLang()` is idempotent. | static selector `~354`; I18N `~3160` |
| **VG468-04** | High regression closure | SOS and Emergency hold timers are cancelled on `pointerup`, `pointercancel`, `touchend`, `touchcancel`, `mouseup`, `dragend`, window blur, and page-hidden transitions. | `11256` |
| **VG468-05** | Release invariant | V4.3.8 visible shell, control set, localized copy, default stylesheet, and Rescue Pack card are retained. V4.6-only persistent banners and replacement cards are suppressed. | build-wide; compatibility layer `11279` |
| **VG468-06** | Accessibility / safety | Common modal focus containment: opener capture, `inert` background, Tab loop, Escape close, focus restoration, ARIA dialog metadata, fallback tab suppression, and rapid-reopen focus-race protection. | `11291` |
| **VG468-07** | Accessibility | Existing custom toggles, cards, chips, presets, scan candidates, and icon choices receive semantic roles, keyboard focus, Enter/Space activation, and synchronized ARIA state. | `11361` |
| **VG468-08** | Accessibility | Toasts use `status`/`alert`, polite/assertive `aria-live`, and `aria-atomic`; viewport no longer blocks zoom. | Toast `1408`; viewport `29` |
| **VG468-09** | Performance / durability | Volume and threshold UI update immediately while encrypted persistence is deduplicated and delayed 260 ms; pending writes flush on change, pointer/touch release, page hide, and background transition. | `11387` |
| **VG468-10** | Security / compatibility | Existing V4.3.8 Rescue Pack buttons are rebound to encrypted Rescue Pack v2. Exact location remains excluded by default; no new card or checkbox is added. | `11414` |
| **VG468-11** | Security / compatibility | Existing import and registration flows can create or unlock the encrypted vault without a new persistent UI card. Locked/migration-state export prompts for vault access; fresh session-only export behavior remains available through the prior confirmation flow. Duplicate automatic unlock prompting was avoided. | `11402` |
| **VG468-12** | Consistency | Runtime diagnostics, release objects, generated backup/recovery filenames, and `V455.version` carry `4.6.8`. Legacy database, storage, and vault key names remain unchanged for backward compatibility. | config/remediation and release layer |

---

## 4. Security controls retained from V4.6.5 and the V4.6 series

### CSPRNG local identifiers

New pet IDs and unknown-device fallback IDs use `crypto.getRandomValues()` through `genLocalIdSuffix()`. `Math.random()` remains only as a compatibility fallback for engines without cryptographic randomness.

### Destructive confirmation safety

`ConfirmModal` behavior:

- dangerous dialogs default-focus **Cancel**;
- Enter resolves according to the focused button;
- Escape, backdrop, and dialog replacement resolve to Cancel;
- normal dialogs retain OK default focus;
- the V4.6.8 modal helper prevents stale focus restoration from stealing focus when a dialog is reopened immediately.

### Clean malformed encoding failure

Malformed base64 is converted into the controlled message `Invalid encoding`, rather than exposing raw platform-specific exceptions.

### Strong passphrase gate

Sensitive passphrase creation requires either:

- at least 16 characters with adequate variety; or
- at least four sufficiently long random words.

Common/repeated patterns and project-name-derived weak values are rejected.

### Import object safety

- bounded file/text size;
- depth and node-count limits;
- pet and voice caps;
- rejection of `__proto__`, `prototype`, and `constructor` keys;
- reserved pet IDs regenerated or rejected;
- merge map created with `Object.create(null)`;
- plaintext import blocked by default and separately acknowledged;
- Replace requires typed confirmation and a recovery backup;
- Escape/backdrop/Cancel perform no mutation;
- application through one queued atomic vault update.

### Encrypted at-rest vault

Sensitive state is maintained in an AES-GCM-256 vault envelope with PBKDF2-SHA-256 at 600,000 iterations and AAD-bound metadata. IndexedDB is primary; localStorage fallback stores the encrypted envelope rather than plaintext. Locked, migration-required, unlocked, and ephemeral session modes remain explicit.

### Rescue Pack v2

- `VG-RP2.` encrypted token format;
- AES-GCM with purpose-bound AAD;
- PBKDF2-SHA-256, 600,000 iterations;
- fresh salt and IV;
- short expiry: two hours normally, 30 minutes when location is included by an alternate compatible flow;
- browser-profile replay ledger via JTI;
- generic BLE identity remains unauthenticated;
- directional guidance remains disabled for unauthenticated tags.

The V4.3.8 compatibility bridge always omits exact location because adding a persistent location-consent control would change the submitted interface.

---

## 5. Execution flow

```text
HTML parse
  -> hash-pinned meta CSP authorizes exactly script[0], style[0], script[1]
  -> script[0] early hardening core
       frame fail-close
       opener/name cleanup
       immutable egress API replacement
       WebRTC and worker blocking
       built-in prototype freeze
       bounded invariant checks
  -> V4.3.8 UI shell and stylesheet
  -> script[1] main application
       Trusted Types + action dispatcher
       data/storage/signal/BLE/UI modules
       V4.3.8 hardening layers
       V4.6 encrypted-vault/import/BLE/Rescue controls
       V4.6.8 regression, accessibility, persistence, and compatibility layer
  -> guarded one-time App.init()
```

```text
BLE advertisement
  -> BLE._handler
  -> App.onAdvertisement(event)
  -> final routeAdvertisement(event, pets, now)
       1. exact valid local device-ID bindings are collected
       2. if an exact binding exists, only those records are evaluated
       3. secondary evidence and ambiguity gates remain required
       4. clone/RSSI anomaly observation can quarantine the selected record
       5. if no exact binding exists, metadata clone candidates are marked per tag
       6. no unbound advertisement is routed
  -> Pet.processRssi() or bounded ingestRaw()
  -> advisory rendering / local-only alert
```

```text
Encrypted persistence
  -> Store.savePet / saveSetting / saveAI / saveBlob
  -> SecureVaultV455.atomicUpdate()
  -> serialized write queue
  -> normalize candidate state
  -> AES-GCM envelope with AAD
  -> IndexedDB, or encrypted localStorage fallback
```

---

## 6. Module directory

| Line | Module / anchor | Responsibility |
|---:|---|---|
| 23 | Content-Security-Policy meta | Hash-pinned inline authorization; zero network connection source; Trusted Types required. |
| 35 | Early hardening core | Frame guard, immutable egress stubs, WebRTC/worker blocking, prototype freeze, runtime invariant checks. |
| 124 | Inline stylesheet | Exact V4.3.8 default stylesheet prefix. |
| 318 | V4.6.8 accessibility CSS | Inactive large-text, contrast, and reduced-motion variants. |
| 803 | Main application script | All application and subsequent hardening modules. |
| 819 | V4.3.8 early security guard | Sanitizer defaults, Trusted Types policy, HTML sink/attribute scrubber, copy-only sharing. |
| 836 | Action dispatcher | Strict allowlisted `Namespace.method(args)` grammar; no eval/Function. |
| 1103 | CONFIG | Version, storage compatibility constants, timing and threshold configuration. |
| 1158 | UTILS | DOM, clamp, median, IDs, JSON, time helpers. |
| 1182 | `genLocalIdSuffix()` | CSPRNG local record-ID suffixes. |
| 1210 | Open-source manifest | Frozen Apache-2.0 / public-interest manifest. |
| 1228 | EthicalGuard | Runtime validation of license and principles metadata. |
| 1293 | Audio engine | Local alert tones, siren, and keepalive. |
| 1408 | Toast | Visual notifications plus ARIA live-region semantics. |
| 1428 | I18N | Seven local language dictionaries; Arabic RTL; single-dispatch switching. |
| 3266 | SecurePrompt | In-page secret/text prompt implementation. |
| 3472 | ConfirmModal | Non-native confirmation with safe destructive focus behavior. |
| 3569 | Storage | IndexedDB-first facade and fallback path. |
| 3731 | Kalman filter | RSSI smoothing. |
| 3766 | Distance estimator | Approximate RSSI-to-distance and calibration. |
| 3802 | Q-learning lite | Local threshold suggestions. |
| 3862 | Behavioral fingerprint | Local signal-trend heuristics. |
| 3895 | Ring buffer | Bounded histories. |
| 3906 | Pet model | Per-tag state, thresholds, zones, history, serialization. |
| 4141 | QR generator | Embedded Project Nayuki generator. |
| 5067 | Voice Recall | Local microphone capture and playback. |
| 5142 | Voice Announcer | SpeechSynthesis advisory announcements. |
| 5178 | BLE matching | Base advertisement scoring helpers. |
| 5211 | BLE engine | Scan setup, filters, restarts, congestion, health. |
| 5408 | Wizard | Registration, movement consistency, calibration. |
| 5830 | SOS module | Selected-tag signal review and hold alarm. |
| 5967 | Emergency mode | Local siren, strobe, contact QR, shake support. |
| 6197 | Pet detail | Per-tag detail, thresholds, chart, AI controls. |
| 6485 | Navigation | Panel switching. |
| 6520 | Settings | Preferences, notifications, performance, volume, pet management. |
| 6678 | Data manager | Import/export entry points, finally rebound to hardened paths. |
| 6695 | Help | Local help overlay. |
| 6713 | About / Legal | License, scope, limitations. |
| 6730 | Language menu | Overlay language choices. |
| 6760 | Diagnostics | Redacted local diagnostics. |
| 6869 | Meta-cognitive coach | Local suggestions only. |
| 6941 | App core | Initialization, rendering, monitoring, alerts. |
| 7417 | PWA | Blob manifest; service-worker registration intentionally disabled. |
| 7475 | Feature-module IIFE | Reset, error, capability, AI, encrypted-backup support. |
| 7520 | Error Shield | Bounded local error capture. |
| 7589 | Capability matrix | Feature detection. |
| 7655 | Accessibility UX | Existing accessibility preference support. |
| 7669 | Wake lock | User-controlled screen wake lock. |
| 7703 | AI pack | Local kNN/RLS/isolation-lite components. |
| 7971 | Conductor AI | Local self-heal and battery-aware suggestions. |
| 8104 | Reset Center | Soft/hard/factory reset surfaces. |
| 8258 | Legacy encrypted backup | Compatible AES-GCM backup path retained for legacy import. |
| 8322 | V40 UI injection | Existing advanced controls and V4.3.8 Rescue Pack card. |
| 10014 | V4.3.8 final hardening | Egress, navigation, copy-only, and sanitization consolidation. |
| 10372 | V4.3.8 audit hardening | Redaction and consistency checks. |
| 10415 | V4.6 security remediation | Encrypted vault, import, BLE, Rescue Pack v2 configuration. |
| 10430 | V455 configuration | Current release identity with compatibility keys and security limits. |
| 10474 | V455Crypto | PBKDF2/AES-GCM, AAD, base64url, SHA-256. |
| 10515 | TriChoiceModalV455 | Merge / Replace / Cancel; non-destructive abort. |
| 10551 | Encrypted local vault | At-rest envelope and serialized atomic updates. |
| 10720 | BLE identity | Fail-closed evaluation and clone/anomaly observation. |
| 10783 | Rescue Pack v2 | Encrypted token, expiry, replay, restricted assist. |
| 10847 | Transactional import/export | Validation, recovery, atomic apply, encrypted export. |
| 10916 | Final risk-closure addendum | Authoritative exact-bound BLE behavior and diagnostics. |
| 11123 | V4.6 final hardening | Passphrase floor, session-only confirmation, import-vault gate. |
| 11256 | V4.6.8 hold cancellation | Global termination-path disarm. |
| 11279 | V4.6.8 compatibility layer | Nonvisual accessibility, write batching, vault/Rescue bridges. |
| 11291 | ModalA11y | Focus trap, inerting, restoration, rapid-reopen protection. |
| 11361 | Semantics | Roles, ARIA state, keyboard activation. |
| 11387 | Persistence | 260 ms deduplication and flush policy. |
| 11402 | VaultBridge | Vault access through existing registration/import/export flows. |
| 11414 | RescueBridge | Rescue Pack v2 through the exact V4.3.8 controls. |
| 11444 | V4.6.8 release note | Final compatibility and identity statement. |
| 11453 | Guarded bootstrap | One-time safe start into `App.init()`. |

---

## 7. Key security anchors

| Control | Anchor | Review note |
|---|---:|---|
| CSP | 23 | `default-src 'none'`, `connect-src 'none'`, exact hashes, no script attributes. |
| Required response headers note | 25 | Production host must set frame, MIME, permissions, COOP/CORP headers. |
| Security limitations note | 26 | Meta CSP cannot enforce `frame-ancestors`; top-level navigation residual disclosed. |
| Release integrity note | 27 | In-app hashes are diagnostic; distribution requires detached verification. |
| Research scope note | 28 | Generic BLE is not cryptographically authenticated or life-critical. |
| Action boundary fix | ~892 | `handleImport` accepted without allowing bare dynamic `import()`. |
| CSPRNG local IDs | 1182 | `crypto.getRandomValues()`. |
| Destructive confirmation | 3472 | Cancel focus and focused-button Enter behavior. |
| Encrypted backup primitives | 10474 | AES-GCM-256, PBKDF2-SHA-256 600k, purpose-bound AAD. |
| Vault | 10551 | Encrypted at rest, serialized atomic writes. |
| Import | 10847 | Bounded, prototype-safe, tri-state, recovery-gated replacement. |
| Exact-bound BLE routing | ~10988 | Exact binding precedes clone-candidate detection. |
| Strong passphrases | ~11136 | 16+ characters or four random words. |
| Global hold cancellation | 11256 | All interruption paths disarm. |
| Accessibility containment | 11291 | Modal focus and background isolation. |
| Batched encrypted writes | 11387 | Latest-value deduplication and lifecycle flush. |

---

## 8. Action-dispatch allowlist

The dispatcher accepts only explicit first-party calls. Arguments are limited to short quoted strings, finite numbers, booleans, `null`, `this.value`, and the event object.

| Namespace | Allowed methods |
|---|---|
| `App` | `dismissFirstRun`, `setTrackMode`, `toggleDemo`, `toggleMonitoring`, `focusFromChip` |
| `DataManager` | `exportAll`, `importFile`, `handleImport` |
| `Detail` | `aiFeedback`, `applySuggestion`, `close`, `open`, `resetQ`, `setLeash`, `suggestAI`, `toggleAI`, `updateThreshold` |
| `Diag` | `close`, `copy`, `download`, `open` |
| `Emergency` | `close`, `copyPhone`, `deactivate`, `open`, `requestMotionPermission`, `saveFromUI`, `share`, `toggleShake`, `holdStart`, `holdEnd` |
| `ErrorShield` | `clear` |
| `Help` | `close`, `open` |
| `I18N` | `setLang` |
| `Lang` | `choose`, `close`, `open` |
| `Legal` | `close`, `open` |
| `Nav` | `go` |
| `ResetCenter` | `close`, `factory`, `hard`, `open`, `soft` |
| `SOS` | `deactivate`, `saveLocation`, `selectPet`, `shareMessage`, `holdStart`, `holdEnd` |
| `SafeMode` | `disable` |
| `Settings` | `removePet`, `resetApp`, `setPerf`, `toggle`, `toggleNotif`, `toggleV40`, `setVolume` |
| `V40UI` | `exportEncrypted`, `showPitch` |
| `VGHardening` | `runCoachAction` |
| `VoiceRecall` | `play`, `record5s` |
| `Wizard` | `clearCalib`, `close`, `goStep3`, `open`, `pickIcon`, `recordCalib`, `rescan`, `save`, `selectCandidate`, `skipVerify` |

Static scan: **128** action-attribute occurrences, **106** distinct source forms, zero invalid concrete actions. Nine source forms are template expressions; their rendered runtime forms were checked in Chromium. Runtime boot scan: **80** active action attributes, zero policy failures.

Representative blocked inputs included bare `import()`, `fetch()`, `eval()`, `Function()`, unknown namespaces, constructor access, and forbidden argument atoms.

---

## 9. Storage and data map

| Area | Key / store | Behavior |
|---|---|---|
| IndexedDB | `VitalGuardAI_V41`, version 2 | Compatibility database with `pets`, `settings`, `ai`, `alerts`, `blobs`. |
| Encrypted vault | `__vg_vault_v455__` in settings store | Current AES-GCM vault envelope. |
| Encrypted fallback | `vg41_vault_v455` | localStorage fallback containing encrypted envelope only. |
| Language | `vg_lang_v41`, legacy `vg_lang_v412` | Local UI language preference. |
| Rescue replay | `rescuePackUsedV455` | Browser-profile JTI expiry ledger. |
| Session-only state | memory | Used when no vault is active; warnings/confirmations remain. |
| Compatibility keys | `vg41_`, V41 DB, V455 vault names | Deliberately unchanged so previous data can be recognized. |

Vault state shape, before encryption:

- `pets`: keyed pet/tag records;
- `settings`: preferences and replay ledger;
- `ai`: bounded local model/error state;
- `blobs`: voice clips represented for encrypted storage;
- `meta`: creation/update metadata.

The current release still uses one encrypted state envelope. Record-per-envelope storage from the manual is deferred because it changes migration semantics and requires a dedicated recovery test matrix.

---

## 10. Accessibility and nonvisual behavior

### Modal behavior

- `role="dialog"` or `role="alertdialog"`;
- `aria-modal="true"`;
- title linkage;
- focus moves inside on open;
- background receives `inert` and `aria-hidden`;
- legacy fallback temporarily removes background tab stops;
- Tab/Shift+Tab cycles inside;
- Escape uses the existing close/cancel route;
- focus returns to the opener;
- reopening a dialog before the previous restoration frame cannot steal the new default focus.

### Custom controls

- `.toggle` → switch + `aria-checked`;
- performance/leash presets → radio + `aria-checked`;
- icon and scan candidates → option + `aria-selected`;
- cards/chips/collapsible headers → button semantics;
- Enter and Space invoke the same click path;
- no duplicate business-logic path is introduced.

### Announcements

Normal toasts are polite status messages. Messages containing failure, blocking, invalidity, denial, corruption, unavailability, or tamper terminology are assertive alerts.

---

## 11. Verification matrix

### 11.1 Static release audit — PASS

- two scripts parse with `node --check`;
- CSP calculated hashes equal all declared hashes;
- `default-src 'none'` and `connect-src 'none'` present;
- Trusted Types declaration and requirement present;
- no external active `href`, `src`, form action, script source, stylesheet link, CSS URL, or CSS import;
- V4.3.8 visible shell exact after approved normalization;
- V4.3.8 stylesheet exact prefix;
- zoom blocking absent;
- concrete source actions all accepted;
- import action accepted;
- hostile actions rejected;
- every required V4.6.8 closure marker present.

### 11.2 Chromium runtime regression harness — PASS

Twenty-six result entries completed with no page error and no console error. Twenty-three were executed directly in the opaque-origin browser harness; three WebCrypto-dependent entries were marked environment-deferred and covered by the separate exact-code WebCrypto test.

Directly executed checks included:

- guarded boot;
- immutable egress descriptors and frozen prototypes;
- action parser import regression;
- hostile action rejection;
- all active runtime action attributes;
- exactly one language dispatch;
- same-model exact-bound BLE routing;
- per-tag clone quarantine for an unknown ID;
- SOS/Emergency pointer-cancel hold disarm;
- dangerous and normal confirmation focus/Enter behavior;
- immediate dialog reopen focus race;
- malformed-base64 controlled error;
- 128 CSPRNG-generated local IDs with no collision in the sample;
- thirty rapid volume changes collapsed to one encrypted write while UI reflected the latest value immediately;
- Toast live-region metadata;
- modal Tab containment, Escape close, and opener restoration;
- keyboard switch activation and ARIA synchronization;
- V4.3.8 Rescue Pack control compatibility;
- seven languages, including Arabic RTL and V4.6.8 release text;
- prototype-pollution import rejection;
- bounded hardening-core invariant status;
- V4.6.8 diagnostic marker.

### 11.3 Exact extracted WebCrypto test — PASS

The final `V455Crypto` object was extracted from the shipped main-script bytes and executed with Node WebCrypto. Six tests passed:

1. v3 encrypted-backup round trip;
2. wrong-passphrase rejection;
3. AAD/metadata tamper rejection for purpose, iteration, and algorithm changes;
4. `VG-RP2.` token cryptographic round trip;
5. clean malformed-base64 error;
6. SHA-256 helper output.

Observed cryptographic parameters: AES-GCM, PBKDF2-SHA-256, 600,000 iterations, 16-byte salt, 12-byte IV, authenticated ciphertext.

### 11.4 Browser smoke test — PASS with expected isolated-context warning

Final uninstrumented artifact:

- correct title and visible V4.6.8 subtitle;
- Home active;
- one Rescue Pack card;
- no vault banner;
- import action retained;
- switch role and state present;
- zero page errors;
- zero console errors.

The test runner uses an opaque `page.set_content` origin because direct navigation is administratively blocked in the test environment. Chromium therefore denied IndexedDB and emitted one warning. The application continued through its safe fallback path. This warning is a property of the isolated harness, not evidence that HTTPS/localhost deployment has IndexedDB disabled.

### 11.5 Visual compatibility — PASS

Pixel-exact static comparison at `430 × 1689`; empty pixel-difference bounding box.

---

## 12. CSP maintenance rule

Any change to one byte inside either `<script>` block or the `<style>` block—including comments, whitespace, copy, or version text—invalidates that resource's CSP authorization.

Release procedure:

1. extract exact inner text between the opening and closing tag;
2. calculate SHA-256 over the exact UTF-8 bytes;
3. base64-encode the digest;
4. write the value to both applicable `*-src` and `*-src-elem` directives;
5. reread the completed file and verify all hashes again;
6. calculate the whole-file SHA-256 only after the CSP is final.

The V4.6.8 final values are listed in Section 0.

---

## 13. Deployment requirements and residual risk

### Required host response headers

When served over HTTP(S), the hosting layer—not the HTML meta tag—should set at least:

- CSP `frame-ancestors 'none'`;
- `X-Content-Type-Options: nosniff`;
- a restrictive Permissions Policy;
- `Cross-Origin-Opener-Policy: same-origin`;
- `Cross-Origin-Resource-Policy: same-origin`.

The in-file frame guard is defense in depth. Meta CSP cannot enforce `frame-ancestors`.

### BLE identity limitation

Generic advertisement-only BLE identity is not cryptographic. V4.6.8 improves local routing correctness and fails closed for high-risk guidance, but it cannot turn commodity advertisements into authenticated identities. Do not use it as a certified life-critical, operational search-and-rescue, emergency-response, or exact-distance system.

### Platform limitations

- Web Bluetooth behavior varies by browser, OS, permission state, and background policy.
- RSSI is affected by orientation, walls, bodies, crowds, multipath, and transmitter variation.
- Direct top-level navigation cannot be made immutable from in-page JavaScript after arbitrary script execution.
- The whole-file hash in this map is not a digital signature. Publish/sign it through an independent trusted channel.

### Test limits

The release was not tested here with physical BLE tags, a spoofing transmitter, low-end Android hardware, actual background suspension, or the target production response headers. Independent hardware and deployment retesting remains necessary before any review conclusion.

---

## 14. Deliberately deferred structural work

The following manual items are not part of V4.6.8:

- record-per-envelope encrypted vault;
- automatic migration from one vault envelope to independent settings/pet/AI/blob envelopes;
- full source-module split and production bundler;
- broad removal of historical wrappers/rebindings;
- complete physical-device E2E automation.

Reason: these are high-regression-risk architecture changes. V4.6.8 prioritizes verified security closures and nonvisual improvements while preserving the submitted V4.3.8 interface and compatibility data model.

---