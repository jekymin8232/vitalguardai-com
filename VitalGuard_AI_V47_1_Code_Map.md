# VitalGuard AI v4.7.1 — Code Map & Release Verification
---

## 0. Release Identity (measured values)

The values below were measured from the exact shipped bytes of the artifact.

| Property | Value |
|---|---|
| Lines | **11,594** |
| `APP_VERSION` | `4.7.1` |
| Licence | Apache-2.0 (whole artifact); embedded Project Nayuki QR generator retains its own MIT notice |

---

## 1. Release Policy — Version-Relabel Remap (no logic change, one fix)

**Intentionally preserved unchanged** (to avoid breakage or history distortion):

- every internal JavaScript identifier, including `V455…`/`V469…` symbols, storage keys such as `vg_rp_replay_v469` and `__vg_vault_v455__`, and function names such as `v469ReadReplay` — renaming these would break runtime references;
- historical release banners and provenance sentences (e.g. `retained in V4.6.9`, `V4.6.8 HOLD-CANCEL HARDENING`, the V4.6.9 change register) — these record when each control was introduced and remain accurate as history.

**Preservation evidence:**

- the static `<body>` shell is byte-identical to V4.6.9 after version normalization and removal of the main script block;
- the default stylesheet is byte-identical to V4.6.9 (its CSP hash is unchanged);
- JavaScript-disabled Chromium rendering at `430 × 900` produced full-page images of `430 × 1689` with an empty pixel-difference bounding box;
- final-DOM `data-vg-on*` actions passing the policy parser: **106**, policy failures: **0**;
- static DOM IDs: **124**, duplicate IDs: **0**.

---

## 2. Change Register

The functional change set below was introduced in **V4.6.9** and carried unchanged into V4.7.1 (only final anchor line numbers are remapped); the single V4.7.1 functional change is VG471-01.

| ID | Priority | Internal change | Final anchor |
|---|---|---|---:|
| **VG469-01** | P0 | Passphrase checks reject repeated characters, repeated phrases, repeated normalized words, project/common terms, predictable sequences, and low-variety values before the four-word approval path. Four sufficiently long **distinct** normalized words are required. | `11184` |
| **VG469-02** | P0 | Destructive-write generation guard, serialized drain, pet-deletion tombstones, reset blocking, and post-reset re-enable prevent a delayed slider/threshold write from restoring deleted or wiped data. | vault `10568`; persistence `11459` |
| **VG469-03** | P1 | A successful post-boot vault unlock or migration runs one serialized rehydration path for settings, emergency data, pets, V4.1 fields, monitoring intent, timers, rendering, and scan restart. | UI `10931`; bridge `11502` |
| **VG469-04** | P1 | Duplicate exact local BLE device bindings fail closed in routing, are rejected during registration, and are disabled/stripped during normalization until local re-registration. | routing `11032`; normalize `10895` |
| **VG469-05** | P1 | Rescue Pack replay state is stored as bounded SHA-256 JTI hashes with expiry in a profile-local key and mirrored in the encrypted setting. Raw JTI values are not written to the local ledger. | `10825` |
| **VG469-06** | P1 | Full wipe includes `vg_lang_v41`, `vg_lang_v412`, `vg_rp_replay_v469`, the vault fallback, all `vg41_` records, IndexedDB stores, scoped caches, and scoped service-worker registrations where the platform permits. | `10568` |
| **VG469-07** | P2 | Diagnostics self-test is asynchronous and awaits Rescue Pack v2 encryption/decryption; adds passphrase-policy, QR, signal-model, and bounded performance checks without adding UI. | `11537` |
| **VG469-08** | P1 / audit | A nonvisual capability-scope meta record and frozen runtime object align machine-readable audit evidence with implemented transport capabilities. | meta `45`; runtime `11537` |
| **VG469-09** | release invariant | Version objects, diagnostics, generated filenames, release metadata, CSP hashes, and the whole-file digest carry the release label while compatibility storage names remain unchanged. | build-wide |
| **VG471-01** | P1 / fix | *Add Demo Tag* wizard **Start Scan** was dead on real devices: a stacked-modal focus-trap set `inert` on the `ConfirmModal` backdrop opened above the wizard overlay. `rememberLock()` now never inerts an element that is itself an active modal, so the top dialog stays interactive while background inerting is preserved. Recomputes the `script[1]` CSP hash and whole-file SHA-256; +6 lines (all anchors ≥ orig. 11,365 shifted +6). | `ModalA11y` `11358` (fix at `11365`) |

**Deliberately excluded from this release:** record-per-envelope vault migration, source-module decomposition, broad dead-code removal, visible product-copy changes, and new UI controls.

---

## 3. Security Controls Retained from V4.6.9 (unchanged in V4.7.1)

- hash-pinned CSP with `default-src 'none'`, `connect-src 'none'`, `script-src-attr 'none'`, Trusted Types, and no external active resources;
- first-executable frame, egress, WebRTC, worker, popup, opener/name, `eval`, and prototype guards;
- allowlisted `Namespace.method(args)` action dispatcher with the V4.5.8 identifier-boundary fix;
- exact local browser BLE binding before metadata clone checks; unauthenticated generic BLE remains advisory and fail-closed for directional guidance;
- AES-GCM-256 encrypted vault and backups using PBKDF2-SHA-256 at 600,000 iterations, 16-byte salts, fresh 12-byte IVs, and purpose-bound AAD;
- bounded, prototype-safe, tri-state transactional import with recovery backup for Replace;
- CSPRNG local record IDs;
- safe destructive confirmations that default-focus Cancel;
- global hold cancellation, modal focus containment, keyboard semantics, ARIA live announcements, zoom allowance, and debounced encrypted writes;
- the exact V4.3.8 visible shell and existing Rescue Pack controls.

---

## 4. Execution Flow

```text
HTML parse
  -> exact hash-pinned meta CSP authorizes script[0], style[0], script[1]
  -> first-executable hardening core
  -> unchanged V4.3.8-compatible visible shell and stylesheet
  -> main application modules and historical hardening layers
  -> V4.6 encrypted vault / import / BLE / Rescue controls
  -> V4.6.9 write-generation, rehydration, duplicate-binding, replay and audit hotfixes (carried unchanged)
  -> guarded one-time App.init()
```

```text
Destructive pet delete
  -> Store.deletePet(id)
  -> Persistence.beforeDeletePet(id): add tombstone, remove pending pet save, drain queued debounced writes
  -> SecureVaultV455.atomicUpdate(delete id)
  -> any stale pending save for the deleted record is skipped
```

```text
Full wipe
  -> Persistence.beforeClearAll(): block scheduling, advance generation, clear pending work, drain chain
  -> SecureVaultV455.invalidateWrites(): block atomic commits, advance write epoch, await queue
  -> clear app IndexedDB stores + scoped local records + language/replay keys
  -> reset vault state
  -> release both guards so a fresh post-wipe session can save normally
```

```text
Post-boot unlock / migration
  -> VaultBridge.ensure()
  -> flush or cancel pre-transition pending writes
  -> unlockPrompt() or createOrMigrate()
  -> serialized V455UI.hydrate(): Settings + Emergency load, reconstruct Pet records and V4.1 fields,
     restore monitoring intent/timers/rendering, normalize duplicate/unbound BLE records, optionally restart scan
```

```text
Rescue Pack replay check
  -> SHA-256("VitalGuard|VG-RP2|replay|" + jti)
  -> remove expired/invalid entries
  -> compare bounded local profile ledger
  -> compare encrypted-setting compatibility ledger
  -> mark accepted token with hash + capped expiry; never write raw JTI locally
```

---

## 5. Module Directory

| Line | Module / anchor | Responsibility |
|---:|---|---|
| 39 | Content-Security-Policy meta | Exact inline authorization, zero network connection source, Trusted Types requirement. |
| 45 | Capability-scope meta | Nonvisual implemented/not-implemented transport statement. |
| 52 | Early hardening core | Frame fail-close, immutable egress stubs, WebRTC/worker blocking, prototype freeze, bounded invariant checks. |
| 141 | Inline stylesheet | Byte-identical to V4.6.9 (stylesheet CSP hash unchanged). |
| 820 | Main application script | All application and hardening modules. |
| 857 | Action dispatcher | Strict first-party allowlist; no `eval`/`Function`; identifier-boundary deny patterns. |
| 1121 | CONFIG | Release, schema, storage, timing, thresholds, and profiles. |
| 1199 | `genLocalIdSuffix()` | Cryptographic local record-ID suffixes. |
| 1425 | Toast | Visual notifications and ARIA live semantics. |
| 1450 | I18N | Seven local dictionaries and Arabic RTL. |
| 3487 | ConfirmModal | Safe destructive focus and cancel semantics. |
| 3586 | Storage facade | IndexedDB-first API and bounded fallback. |
| 3750 | Kalman filter | RSSI smoothing. |
| 3784 | Distance estimator | Approximate RSSI-to-distance and calibration. |
| 3924 | Pet model | Per-tag state, thresholds, histories, serialization. |
| 5195 | BLE matching | Base advertisement scoring. |
| 5228 | BLE engine | Advertisement scanning, restart/congestion/health. |
| 5425 | Wizard | Registration, verification, calibration. |
| 5847 | SOS | Signal review, alarm, Rescue Pack entry points. |
| 5984 | Emergency | Local siren, strobe, contact card. |
| 6537 | Settings | Preferences, performance, volume, pet management. |
| 6695 | Data manager | Hardened import/export entry points. |
| 6777 | Diagnostics | Redacted local diagnostics and self-test entry. |
| 6958 | App core | Initialization, rendering, monitoring and alerts. |
| 8121 | Reset Center | Soft/hard/factory reset paths. |
| 10447 | V455 configuration | Current crypto/storage/import limits with compatibility key names. |
| 10491 | V455Crypto | PBKDF2, AES-GCM, AAD, base64url, SHA-256. |
| 10568 | Encrypted local vault | Single encrypted state envelope, serialized updates, V4.6.9 write epoch. |
| 10825 | Replay guard | Hashed bounded profile ledger plus encrypted compatibility ledger. |
| 10895 | Binding normalization | Disables unbound and duplicated records until re-registration. |
| 10931 | V455UI | Vault UI bridge and authoritative runtime rehydration. |
| 11032 | Final BLE routing | Exact binding first; duplicate exact binding quarantine. |
| 11184 | Passphrase policy | Distinct-word and weak-pattern enforcement. |
| 11323 | Hold cancellation | All gesture interruption paths disarm SOS/Emergency timers. |
| 11346 | Compatibility layer | Nonvisual accessibility, persistence, vault and Rescue bridges. |
| 11357 | ModalA11y | Focus trap, inert background, restoration. **VG471-01 (2026-07-19b):** `rememberLock()` at 11365 no longer inerts an element that is itself an active modal, so a `ConfirmModal` opened above another overlay (e.g. wizard **Start Scan**) stays interactive. |
| 11434 | Semantics | Keyboard roles and synchronized ARIA state. |
| 11459 | Persistence | Debounce, generation guard, tombstones, destructive coordination. |
| 11502 | VaultBridge | Existing-flow vault access and serialized rehydration. |
| 11520 | RescueBridge | Rescue Pack v2 behind the unchanged V4.3.8 control set. |
| 11537 | V4.6.9 final audit hotfix (carried) | Async self-test, capability object, V4.6.9 diagnostics. |
| 11558 | V4.6.9 release note (historical) | Internal-only hotfix scope and deferred work. |
| 11569 | Guarded bootstrap | One-time safe App initialization. |

---

## 6. Storage & Data Map

| Area | Key / store | Behaviour (unchanged from V4.6.9) |
|---|---|---|
| IndexedDB | `VitalGuardAI_V41`, version 2 | Compatibility database with `pets`, `settings`, `ai`, `alerts`, `blobs`. |
| Encrypted vault | `__vg_vault_v455__` | AES-GCM single-state envelope in the settings store. |
| Encrypted fallback | `vg41_vault_v455` | localStorage fallback containing the encrypted envelope only. |
| Language | `vg_lang_v41`, `vg_lang_v412` | Local language preference; removed by full wipe. |
| Replay compatibility | `rescuePackUsedV455` | Encrypted setting containing bounded hash/expiry entries and legacy-read compatibility. |
| Replay profile ledger | `vg_rp_replay_v469` | Bounded array of SHA-256 JTI hashes and expiries; no raw JTI. |
| Session-only state | memory | Used where no vault is active; registration/export warnings remain. |
| Compatibility prefix | `vg41_` | Deliberately unchanged so prior data is recognized. |

The current vault uses one encrypted state envelope. Record-per-envelope storage is deferred because it changes migration and recovery semantics (§11).

---

## 7. Passphrase Policy

Sensitive passphrase creation is accepted only when the normalized value passes all applicable checks:

1. minimum 16 characters;
2. no control characters;
3. no repeated-character or repeated-phrase pattern;
4. no listed common/project term or predictable sequence;
5. word path: at least four sufficiently long, distinct normalized words, at least 19 total characters, and adequate character variety; or
6. non-word path: sufficient character classes/length and unique-character variety.

Unlocking an existing vault does not apply the creation-strength gate, because legacy passphrases must remain usable.

Verified browser vectors: repeated words — rejected; repeated phrase — rejected; project-name phrase — rejected; sequential numeric pattern — rejected; high-variety complex phrase — accepted; four distinct multilingual words — accepted.

---

## 8. BLE Duplicate-Binding Behaviour

- a single exact local device binding is evaluated before metadata clone candidates;
- two records with the same exact local browser device ID are never routed;
- both records are disabled and quarantined for local re-registration;
- the registration wizard rejects a device ID already bound to a different record;
- initialization/rehydration strips duplicated IDs from both records and marks them `rebind-required-v455`;
- generic BLE advertisements remain non-cryptographic and cannot establish authenticated identity.

---

## 9. Verification Matrix

The results below are the maintainer's recorded verification evidence for the shipped artifact.

### 9.1 Static release audit — PASS
- both inline scripts passed `node --check`;
- CSP recomputed hashes equal all three declared hashes in the shipped file;
- stylesheet bytes and stylesheet CSP hash are identical to V4.6.9;
- every executable-block difference versus V4.6.9 is a `v4.6.9` → `v4.7.1` display-string change **plus the single VG471-01 focus-trap fix in `script[1]`** (6 inserted lines in `ModalA11y`), and nothing else (line-level diff of both `<script>` blocks and the `<style>` block);
- external active URL attributes: 0;
- final-DOM `data-vg-on*` actions passing the policy parser: **106**, failures: 0;
- whole-file SHA-256 recomputed only after the CSP was final.

### 9.2 Logic-identity verification 

- line-level diff of `script[0]`, `script[1]`, `style[0]` shows only `v4.6.9` → `v4.7.1` display strings **and the VG471-01 focus-trap fix in `script[1]`**; `script[0]` and the stylesheet are byte-identical to V4.6.9;
- guarded boot path, action dispatcher allowlist, and all `V455…`/`V469…` symbols unchanged;
- final-DOM `data-vg-on*` actions passing the policy parser: **106**, zero failures;
- repeated/common/sequential passphrase rejection and strong/multilingual acceptance;
- delayed threshold save followed by pet deletion: no record restoration after 650 ms;
- duplicate stored bindings disabled and stripped; duplicate exact routing quarantines both records and processes neither; duplicate registration does not add a record;
- rehydration restores volume, V4.1 alert fields, leash distance and lost-event state;
- normal exact-bound routing updates only the intended record;
- full wipe removes pets, language keys and replay ledger; persistence is unblocked after wipe and a new volume setting saves successfully;
- page errors: 0; console errors: 0; external requests: 0.

> The isolated harness has an opaque origin, so Chromium denies IndexedDB and WebCrypto there; one expected IndexedDB warning is recorded. This does not assert that an HTTPS/localhost deployment lacks IndexedDB.

### 9.3 Exact shipped WebCrypto & replay test — PASS
Final `V455`, `V455Crypto`, and replay-guard source were extracted from the shipped main-script bytes and executed with Node WebCrypto:

- encrypted round trip passed; wrong passphrase rejected; AAD metadata tamper rejected; malformed base64 produced the controlled error;
- 32 encryptions produced 32 distinct IVs;
- AES-GCM, PBKDF2-SHA-256, 600,000 iterations, 16-byte salt and 12-byte IV confirmed;
- replay mark/seen passed; raw JTI absent from the local replay ledger; replay hash length: 64 hex characters;
- local replay detection remained effective after the encrypted compatibility setting was cleared;
- final self-test source awaits both Rescue Pack encode and decode.

### 9.4 Visual compatibility — PASS
The visible shell and stylesheet are unchanged from V4.6.9; the only user-visible textual difference is the release identifier `4.6.9` → `4.7.1`; pixel-exact after version normalization.

---

## 10. Deployment Requirements & Residual Risk

### Required deployment evidence
When served over HTTP(S), independently verify: server CSP including `frame-ancestors 'none'`; `X-Content-Type-Options: nosniff`; a restrictive Permissions-Policy; `Cross-Origin-Opener-Policy: same-origin`; `Cross-Origin-Resource-Policy: same-origin`; a clean dedicated origin without a prior uncontrolled Service Worker; and signed or independently authenticated release-manifest delivery.

### Retained residual risks
- advertisement-only BLE identity is spoofable and is not cryptographic authentication;
- physical BLE tags, spoofing transmitters, low-end Android, background suspension, battery use and production headers were not tested in this build environment;
- the visible Swarm/Mesh/SOS-relay wording still exceeds the implemented passive-reception transport; the nonvisual manifest documents the actual boundary but does not remove the visible mismatch;
- the replay ledger is best-effort and browser-profile-local; clearing site data removes it;
- OS/browser TTS, clipboard, notifications, geolocation and Bluetooth permission stacks remain platform trust boundaries;
- historical wrappers and multiple rebinding layers remain, increasing audit complexity;
- the vault remains a single envelope, so small writes still re-encrypt the full sensitive state;
- a detached SHA-256 value is not a signature.

---

## 11. Deferred Structural Work

The following require a separately scoped release and migration/recovery test matrix:

- independent encrypted envelopes for settings, each pet, AI state and voice blobs;
- automatic migration from the single V455 envelope;
- source-module decomposition and reproducible single-file bundling;
- removal of historical wrappers and duplicate authority paths;
- visible claim/copy correction for Swarm/Mesh/SOS relay;
- physical-device and deployment-header evidence package.

---

## 12. CSP Maintenance Rule

Any byte change inside either `<script>` block or the `<style>` block invalidates that resource's CSP authorization. Finalization must always:

1. extract exact inner bytes;
2. calculate SHA-256 and base64-encode it;
3. update both applicable `*-src` and `*-src-elem` directives;
4. reread the completed artifact and verify all hashes again;
5. calculate the whole-file SHA-256 only after the CSP is final;
6. rerun syntax, action, runtime, crypto, destructive-race and visual gates.

---

## 13. Independent Verification (for reviewers)

The artifact is a single hand-authored file with no build/bundling pipeline — the distributed file is the source. To confirm you hold the exact audited artifact:

```bash
sha256sum VitalGuard_AI_complete_V47_1.html
# expected:
# 2d3f1a93b027d6a2edf98ff757f9415e3ec3c5850d40c8cfa7d78f97cb5d3aea
```

If the digest matches, every line anchor in this map applies. If it differs, treat the file as a different artifact and re-anchor via the CTRL+F strings in the companion Scope Map.

---

*END OF CODE MAP*

*Prepared by Morgan J. (Gyu-min Jeon) — VitalGuard / M-Corp Ethical AI.*
*Licence: Apache-2.0 © mcorpai.org (Creator: ROK and Morgan J.). The embedded Project Nayuki QR generator retains its original MIT notice.*
