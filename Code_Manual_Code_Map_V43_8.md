## 1. V4.3.8 Security Hardening Summary


---


### Nonce CSP + no inline event attrs

The app has one nonce-authorized inline script and no raw inline event attributes. UI actions use `data-vg-on\*` tokens routed through `VitalGuardActionPolicy`.


---


### Trusted Types / HTML sink scrubber

HTML written through dynamic sinks is neutralized for script tags, blocked elements, event attributes, unsafe URLs, forms, and javascript: URLs. A mutation observer scrubs inserted nodes.


---


### Runtime zero-egress guard

In addition to `connect-src 'none'`, the final hardening layer disables fetch, XHR, WebSocket, EventSource, sendBeacon, and form.submit.


---


### External navigation blocked

External http(s), mailto, tel, sms, and window.open surfaces are blocked or replaced with copy-only behavior.


---


### Encrypted backup default

`DataManager.exportAll` is overridden by `VitalGuardEncryptedExport`. CryptoBox uses PBKDF2-SHA-256 with 600000 iterations and AES-GCM-256.


---


### Bounded import + redacted diagnostics

Imports have file/text/depth/pet/voice size limits and schema sanitizers. Diagnostics redact pet identifiers, focus IDs, UA, and error locations by default.


## 2. Execution, Permissions, and Offline Rules

- **Recommended runtime:** HTTPS or localhost for Web Bluetooth and PWA behavior. `file://` may work for UI review but Bluetooth/service features can be browser-restricted.
- **Zero egress:** V4.3.8 claims should be tested as application-authored network egress. Hosted platforms may inject/request resources outside the artifact; report those as deployment-context findings.
- **PWA:** manifest generation remains; service worker registration is intentionally absent/disabled by default.
- **Permissions:** Bluetooth, geolocation, microphone, motion sensors, notifications, clipboard, and wake lock must be user-triggered and fail safely.

## 3. Core Flow

    DOMContentLoaded / guarded bootstrap
      └─ App.init()
           ├─ Store.init()
           ├─ Settings.load()
           ├─ Emergency.load()
           ├─ ErrorShield / SafeMode / ConductorAI / WakeLock hooks
           ├─ render + timers
           ├─ registerPWA()  // manifest only, no service worker registration
           └─ optional BLE.startScan('track') if monitoringWanted

    advertisementreceived
      └─ BLE._handler → App.onAdvertisement(event)
           ├─ routeAdvertisement(event, App.pets, now)
           ├─ matchScore() selects pet signature or rejects ambiguous packets
           ├─ Pet.processRssi() applies Kalman, thresholds, hysteresis, zone
           ├─ App.triggerAlert() local-only alert path
           └─ App.render() / SOS.updateHC() / Detail.render()

## 4. Data Model and Storage Map


---


### IndexedDB object stores

`pets` `settings` `ai` `alerts` `blobs`

Database: `VitalGuardAI_V41`; version: `2`.


---


### localStorage fallback/prefix

`vg41\_` prefix for fallback pet/settings/AI/blob data and first-run/install flags. Language keys include `vg_lang_v41` and legacy `vg_lang_v412`.


---


### Encrypted backup format

`{enc:true, v:1, alg:'AES-GCM', it:600000, salt:'b64', iv:'b64', ct:'b64'}`

PBKDF2-SHA-256, AES-GCM-256, salt 16 bytes, IV 12 bytes.


---


### Import constraints

1 MiB file/text limit, depth 12, max 50 pets, voice data URL 614,400 chars, per-pet serialized output max 32,768 chars.


## 5. Module Directory

Use Ctrl+F on the banner text or line number. Patch blocks near the end can override earlier behavior and therefore determine final runtime behavior.

| Line                            | Module banner / search keyword                                                                                        | Role                                                                                                                                                                                             | Function hints                                                                                                                                                                                                                                                                                                                                                                                |
|---------------------------------|-----------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `715`   | `V4.3.8 EARLY SECURITY GUARD`                                                                 | Defense-in-depth bootstrap guard: sanitizer defaults, action-policy dispatch, Trusted Types policy, HTML sink scrubber, mutation scrubber, document.write blocker, and copy-only share override. | —                                                                                                                                                                                                                                                                                                                                                                  |
| `1044`  | `UTILS`                                                                                       | Small utilities for DOM lookup, clamping, median RSSI, rescue IDs, time formatting, JSON, and clock access.                                                                                      | `median` `genRescueId` `fmtAgo` `safeJson` `nowMs`                                                                                                                                                                                                                         |
| `1072`  | `OPEN SOURCE MANIFEST`                                                                        | Apache-2.0 / FOSS notice with no field-of-use restrictions and public-interest guidelines.                                                                                                       | —                                                                                                                                                                                                                                                                                                                                                                  |
| `1087`  | `OPEN SOURCE NOTICE GUARD (Runtime Integrity)`                                                | Runtime integrity checker for FOSS/license/manifest fields, exposed to diagnostics.                                                                                                              | `validate` `getSummary`                                                                                                                                                                                                                                                                                                                         |
| `1151`  | `STATE`                                                                                       | Global runtime state used by the scan/render loop.                                                                                                                                               | —                                                                                                                                                                                                                                                                                                                                                                  |
| `1155`  | `AUDIO ENGINE (Web Audio API)`                                                                | Local-only audio alerts, siren, and keepalive oscillator. No network behavior.                                                                                                                   | `ensure` `setVolume01` `alertForZone` `startEmergencySiren` `stopEmergencySiren` `startKeepAlive` `stopKeepAlive`                                                                                                            |
| `1272`  | `TOAST`                                                                                       | Transient local UI messages.                                                                                                                                                                     | `show`                                                                                                                                                                                                                                                                                                                                                                 |
| `1288`  | `I18N (7 Languages)`                                                                          | Language dictionaries and localized HTML for seven languages, including RTL Arabic.                                                                                                              | `currentDict` `t` `setLang` `getLang` `apply` `init`                                                                                                                                                                                                |
| `3123`  | `V4.3.8 SECURITY HELPERS (global scope)`                                                      | Container section for SecurePrompt, ConfirmModal, Security.fullWipe, and local storage helpers.                                                                                                  | —                                                                                                                                                                                                                                                                                                                                                                  |
| `3125`  | `v4.3.6 SECURITY PATCH: SecurePrompt (replaces prompt() for secrets)`                         | Secure modal for passphrases/text input, with reveal toggle, confirmation option, cancellation, keyboard behavior.                                                                               | `ensure` `open` `close` `cancel` `submit` `askPassphrase` `askText`                                                                                                                                                          |
| `3326`  | `v4.2.5 SECURITY PATCH: ConfirmModal (replaces confirm())`                                    | Custom confirmation modal used for destructive and sensitive flows instead of browser confirm().                                                                                                 | `\_ensure` `addEventListener` `\_resolve` `ask`                                                                                                                                                                                                                                                   |
| `3383`  | `v4.3.6 SECURITY PATCH: Auto-wipe & full wipe helpers`                                        | Best-effort full wipe path for IndexedDB, app localStorage keys, Cache Storage, and service worker registrations.                                                                                | `fullWipe` `maybeAutoWipeOnClose` `safeLocalStorageSet` `sort` `forEach` `\_vgE` `replace` `\_vgI`                                                                                                    |
| `3457`  | `STORAGE`                                                                                     | IndexedDB-first store with localStorage fallback for pets, settings, AI state, alerts, blobs, and reset flows.                                                                                   | `init` `savePet` `getAllPets` `\_lsPets` `deletePet` `clearAll` `saveSetting` `getSetting` `saveAI` `getAI`                                             |
| `3640`  | `SIGNAL FILTER (KALMAN)`                                                                      | Kalman RSSI smoothing with adaptive measurement noise.                                                                                                                                           | `constructor` `update` `getVelocity` `reset`                                                                                                                                                                                                                                                      |
| `3675`  | `DISTANCE ESTIMATOR (V20)`                                                                    | RSSI-to-distance approximation and calibration points.                                                                                                                                           | `constructor` `estimate` `addCalibration` `\_recalc` `export` `import`                                                                                                                                                                              |
| `3711`  | `Q-LEARNING LITE (V20/V35)`                                                                   | Lightweight local learning for threshold widening/narrowing suggestions.                                                                                                                         | `constructor` `\_key` `\_getQ` `chooseAction` `update` `applyAction` `export` `import` `reset`                                                                                 |
| `3771`  | `BEHAVIORAL FINGERPRINT`                                                                      | Local behavioral signal window and movement/anomaly heuristics.                                                                                                                                  | `constructor` `addReading` `getFeatures` `classify`                                                                                                                                                                                                                                               |
| `3804`  | `RING BUFFER`                                                                                 | Small bounded buffers for RSSI, scan-rate, alert, and error history.                                                                                                                             | `constructor` `push` `data` `length` `last` `clear` `slice`                                                                                                                                                                  |
| `3815`  | `PET MODEL`                                                                                   | Core per-pet model: signature, thresholds, RSSI processing, zone stability, alerts, export serialization.                                                                                        | `constructor` `getMinInterval` `ingestRaw` `\_effectiveThresholds` `processRssi` `markLost` `\_addAlert` `getLastSeenText` `signatureStrength` `toJSON` |
| `4054`  | `QR GENERATOR (V4.1: Standard QR)`                                                            | Embedded QR generator used for emergency and rescue-pack payloads.                                                                                                                               | —                                                                                                                                                                                                                                                                                                                                                                  |
| `4871`  | `Constructor and fields`                                                                      | Module or patch section. Use the banner text as a stable Ctrl+F anchor in the source.                                                                                                            | —                                                                                                                                                                                                                                                                                                                                                                  |
| `4898`  | `Constructor and fields`                                                                      | Module or patch section. Use the banner text as a stable Ctrl+F anchor in the source.                                                                                                            | —                                                                                                                                                                                                                                                                                                                                                                  |
| `4980`  | `VOICE RECALL (V20)`                                                                          | Microphone capture and local IndexedDB blob storage/playback for voice recall.                                                                                                                   | `hasClip` `record5s` `play` `clear`                                                                                                                                                                                                                                                               |
| `5052`  | `VOICE ANNOUNCER (TTS)`                                                                       | SpeechSynthesis announcements for zone changes.                                                                                                                                                  | `supported` `speak` `zoneMessage`                                                                                                                                                                                                                                                                                        |
| `5088`  | `BLE MATCHING`                                                                                | BLE advertisement signature scoring and route selection.                                                                                                                                         | `\_mfgPrefixHexFromEvent` `matchScore` `routeAdvertisement`                                                                                                                                                                                                                                                              |
| `5177`  | `BLE ENGINE (V35 hardened + V40 fixes)`                                                       | Web Bluetooth scan engine, filters, restart protection, congestion tracking, and scan health.                                                                                                    | `checkSupport` `\_resetCounters` `markAdv` `congestionLevel` `\_buildTrackFilters` `startScan` `stopScan` `restartScan`                                                                               |
| `5374`  | `WIZARD (V35 + V40 signature hardening)`                                                      | User-initiated tag registration/reverify flow with scan consent and bounded registration scan.                                                                                                   | `isOpen` `open` `close` `\_showStep` `\_startScan` `\_startDemoScan` `handleAdv` `\_tagLikelihood` `\_renderCandidates` `selectCandidate`               |
| `5791`  | `SOS MODULE (V35)`                                                                            | SOS finder, saved local location, lost-pet alert copy, hot/cold search UI, and pet selection.                                                                                                    | `holdStart` `holdEnd` `activate` `deactivate` `\_startStrobe` `updateHC` `updateSnapshot` `saveLocation` `shareMessage` `renderPetSelect`               |
| `5929`  | `EMERGENCY MODE (V20)`                                                                        | Personal emergency profile, siren/strobe, QR contact card, shake trigger, and copy-only emergency sharing after hardening.                                                                       | `load` `save` `open` `close` `render` `saveFromUI` `toggleShake` `requestMotionPermission` `holdStart` `holdEnd`                                        |
| `6161`  | `PET DETAIL OVERLAY (expanded)`                                                               | Per-pet details, thresholds, charts, AI suggestions, and injected V4.1 controls.                                                                                                                 | `open` `close` `render` `setLeash` `updateThreshold` `toggleAI` `suggestAI` `applySuggestion` `aiFeedback` `resetQ`                                     |
| `6451`  | `NAV`                                                                                         | Panel switching for Home/SOS/Tips/Settings.                                                                                                                                                      | `go`                                                                                                                                                                                                                                                                                                                                                                   |
| `6486`  | `SETTINGS`                                                                                    | Global toggles, notification permission flow, performance profile, volume, pet management, and reset entry.                                                                                      | `load` `\_updateToggles` `\_updatePerfUI` `\_updateVolumeUI` `toggle` `toggleNotif` `setPerf` `setVolume` `renderPetList` `removePet`                   |
| `6644`  | `DATA MANAGER`                                                                                | V4.3.8 encrypted-export and hardened-import entrypoints. Legacy plain export is not the default.                                                                                                 | `exportAll` `importFile` `handleImport`                                                                                                                                                                                                                                                                                  |
| `6661`  | `HELP (expanded)`                                                                             | Help placeholder/section boundary.                                                                                                                                                               | —                                                                                                                                                                                                                                                                                                                                                                  |
| `6662`  | `HELP (i18n)`                                                                                 | Localized help overlay renderer.                                                                                                                                                                 | `open` `close` `\_content`                                                                                                                                                                                                                                                                                               |
| `6679`  | `ABOUT / LEGAL (i18n)`                                                                        | Localized About/Legal overlay renderer.                                                                                                                                                          | `open` `close` `\_content`                                                                                                                                                                                                                                                                                               |
| `6696`  | `LANGUAGE MENU`                                                                               | Language chooser overlay and select synchronization.                                                                                                                                             | `open` `close` `choose` `\_syncUI`                                                                                                                                                                                                                                                                |
| `6726`  | `DIAGNOSTICS (Download JSON)`                                                                 | Diagnostics snapshot/copy/download, later redacted by V4.3.8 hardening.                                                                                                                          | `open` `close` `snapshot` `render` `copy` `download`                                                                                                                                                                                                |
| `6835`  | `META-COGNITIVE COACH (Idea Amplifier)`                                                       | Local tips/action suggestions based on scan and environment state.                                                                                                                               | `compute` `render`                                                                                                                                                                                                                                                                                                                              |
| `6907`  | `APP CORE`                                                                                    | Application boot, timers, rendering, monitoring, demo mode, advertisement handling, and alerts.                                                                                                  | `init` `initFirstRunBanner` `dismissFirstRun` `resetTimers` `toggleMonitoring` `toggleDemo` `\_startDemo` `\_stopDemo` `\_demoTick` `setTrackMode`      |
| `7383`  | `PWA`                                                                                         | Blob-based manifest generation only; service worker registration is disabled by default in V4.3.8.                                                                                               | `registerPWA` `setupInstallBanner`                                                                                                                                                                                                                                                                                                              |
| `7450`  | `SAFE TEXT / SANITIZER`                                                                       | Sanitizer methods for names, phone numbers, text, icons, HTML escaping, and safe IDs.                                                                                                            | `name` `phone` `text` `icon` `escapeHTML` `replace` `safeId` `sleep` `downloadText`                                                                                            |
| `7492`  | `ERROR SHIELD (Crash-safe logging)`                                                           | Local error ring buffer with bounded persistence.                                                                                                                                                | `load` `\_schedulePersist` `capture` `hook` `clear`                                                                                                                                                                                                                        |
| `7561`  | `CAPABILITY MATRIX`                                                                           | Browser capability detection and badge rendering.                                                                                                                                                | `battery` `computeSync` `badgeHTML` `renderHTML`                                                                                                                                                                                                                                                  |
| `7627`  | `ACCESSIBILITY (UX)`                                                                          | Large text, high contrast, reduced motion CSS and toggles.                                                                                                                                       | `apply` `injectCSS`                                                                                                                                                                                                                                                                                                                             |
| `7656`  | `WAKE LOCK (Monitoring keep-awake)`                                                           | Screen wake-lock manager for monitoring mode.                                                                                                                                                    | `request` `release` `hookVisibility`                                                                                                                                                                                                                                                                                     |
| `7690`  | `AI PACK v4.1`                                                                                | Local kNN, RLS calibrator, isolation forest-lite, and AI attach/import helpers.                                                                                                                  | `constructor` `\_dist` `add` `predict` `export` `import` `reset` `update` `params` `\_randInt`                                                          |
| `7974`  | `CONDUCTOR AI (Self-heal / UX suggestions)`                                                   | Local self-heal / optimization suggestions, battery-aware safe mode, and coach input.                                                                                                            | `init` `refreshBattery` `batteryInfo` `compute` `tick` `enable` `disable` `load`                                                                                                                      |
| `8107`  | `RESET / INITIALIZE CENTER`                                                                   | Reset/factory-reset UI and Security.fullWipe integration.                                                                                                                                        | `ensureUI` `open` `close` `render` `soft` `\_confirmHard` `hard` `factory`                                                                                                                            |
| `8261`  | `ENCRYPTED BACKUP (AES-GCM)`                                                                  | PBKDF2-SHA-256 + AES-GCM backup encryption/decryption helper.                                                                                                                                    | `supported` `\_b64` `\_u8` `\_deriveKey` `encryptString` `decryptToString`                                                                                                                                                                          |
| `8315`  | `V40 UI INJECTION`                                                                            | Backward-compatible UI injection layer for advanced settings, reset center, backup, diagnostics, and cards.                                                                                      | `inject` `renderSafeBanner` `exportEncrypted` `showPitch`                                                                                                                                                                                                                                         |
| `8490`  | `PATCH: Settings (new prefs + toggles)`                                                       | Extends Settings with scan filters, screen awake, auto optimize, auto wipe, and accessibility toggles.                                                                                           | —                                                                                                                                                                                                                                                                                                                                                                  |
| `8569`  | `PATCH: BLE filters toggle`                                                                   | Allows scan-filter behavior to be toggled globally.                                                                                                                                              | —                                                                                                                                                                                                                                                                                                                                                                  |
| `8576`  | `PATCH: Pet AI attach + safe sanitize`                                                        | Sanitizes pet data and attaches/export local AI state.                                                                                                                                           | —                                                                                                                                                                                                                                                                                                                                                                  |
| `8612`  | `PATCH: Detail feedback =\> kNN learning + extra explain`                                     | Feedback hook for local kNN learning and explanatory detail UI.                                                                                                                                  | —                                                                                                                                                                                                                                                                                                                                                                  |
| `8660`  | `PATCH: Wizard + Emergency sanitize`                                                          | Sanitizes wizard and emergency-profile inputs before save.                                                                                                                                       | —                                                                                                                                                                                                                                                                                                                                                                  |
| `8680`  | `PATCH: App init / monitoring =\> wake lock + conductor + error shield`                       | Wraps boot/monitoring with ErrorShield, SafeMode, ConductorAI, WakeLock, and sanitized pet upgrade.                                                                                              | —                                                                                                                                                                                                                                                                                                                                                                  |
| `8735`  | `PATCH: Diagnostics (capabilities + error log + battery)`                                     | Adds capabilities, safe-mode, error, and battery fields to diagnostics before final redaction layer.                                                                                             | —                                                                                                                                                                                                                                                                                                                                                                  |
| `8802`  | `PATCH: Coach card (tips + one-tap actions)`                                                  | Coach card rendering and action suggestions before final action-registry hardening.                                                                                                              | `register` `run` `map` `forEach` `addEventListener`                                                                                                                                                                                                                        |
| `8853`  | `PATCH: Legal / About (VitalGuard Demo)`                                                      | Legal/About content replacement using localized HTML.                                                                                                                                            | —                                                                                                                                                                                                                                                                                                                                                                  |
| `8869`  | `PATCH: SOS snapshot sanitize`                                                                | Sanitizes pet name/icon before SOS snapshot rendering.                                                                                                                                           | —                                                                                                                                                                                                                                                                                                                                                                  |
| `8881`  | `PATCH: Data import supports encrypted pack`                                                  | In V4.3.8 this legacy wrapper is disabled; hardened import owns plain/encrypted flows.                                                                                                           | —                                                                                                                                                                                                                                                                                                                                                                  |
| `8884`  | `V4.1 EXTRA PATCHES`                                                                          | V4.1 feature pack: QR, RLS calibration, Rescue Pack, per-pet alerts, max active pets, stability fixes.                                                                                           | `v41ZoneRank` `v41EnsureAlertPrefs`                                                                                                                                                                                                                                                                                                             |
| `8915`  | `Lost flip counter fix (batterySuspect)`                                                      | Battery-suspect heuristic and lost-event pruning.                                                                                                                                                | —                                                                                                                                                                                                                                                                                                                                                                  |
| `8959`  | `Per-pet alerts (sound/vibrate/tts + min zone)`                                               | Per-pet alert preferences and zone threshold gating.                                                                                                                                             | —                                                                                                                                                                                                                                                                                                                                                                  |
| `8987`  | `Max 10 active pets: enforce + disable overflow`                                              | Caps active pets for stability and disables overflow on import/restore.                                                                                                                          | —                                                                                                                                                                                                                                                                                                                                                                  |
| `9008`  | `Leash distance slider (2m–15m) in Detail -\> auto thresholds`                                | Per-pet leash distance control and automatic threshold derivation.                                                                                                                               | —                                                                                                                                                                                                                                                                                                                                                                  |
| `9097`  | `Calibration Pro (RLS) UI (Wizard + Detail)`                                                  | RLS calibration UI and model state wiring.                                                                                                                                                       | —                                                                                                                                                                                                                                                                                                                                                                  |
| `9535`  | `Per-pet alerts UI in Detail`                                                                 | Detail overlay controls for per-pet sound/vibrate/TTS/min-zone.                                                                                                                                  | —                                                                                                                                                                                                                                                                                                                                                                  |
| `9622`  | `Rescue Pack (share/import) for SOS panel`                                                    | Offline rescue pack generation, QR/code display, import and copy-only sharing after hardening.                                                                                                   | `b64urlEncodeUtf8` `b64urlDecodeUtf8` `crc32` `crcHex`                                                                                                                                                                                                                                            |
| `9951`  | `Patch Detail.render to inject v4.1 UI blocks`                                                | Injects V4.1 UI blocks into detail render; final layer wraps async order.                                                                                                                        | —                                                                                                                                                                                                                                                                                                                                                                  |
| `9962`  | `Patch V40UI.inject to include v4.1 injections`                                               | Ensures V4.1 wizard/SOS UI injections during V40 injection.                                                                                                                                      | —                                                                                                                                                                                                                                                                                                                                                                  |
| `9972`  | `Diagnostics: implement missing Run Self-Test button`                                         | Adds self-test; final layer overrides to avoid undefined variables/navigation side effects.                                                                                                      | —                                                                                                                                                                                                                                                                                                                                                                  |
| `10066` | `Persist & restore v4.1 per-pet fields (alertPrefs / leashDistanceM / disabled / lostEvents)` | Persists and restores per-pet V4.1 fields.                                                                                                                                                       | —                                                                                                                                                                                                                                                                                                                                                                  |
| `10138` | `V4.3.8 FINAL HARDENING LAYER`                                                                | Runtime egress kill-switch, external navigation guard, copy-only sharing, alert and detail fixes, action-registry coach, rescue pack hardening, self-test fix.                                   | `assertJsonShape` `n` `b` `hex` `sanitizeThresholds` `sanitizeSignature` `sanitizeDistanceCalib` `sanitizeAlertPrefs` `sanitizePet` `sanitizeSettings`  |
| `10540` | `FINAL: boot once`                                                                            | Pre-init UI injection guard.                                                                                                                                                                     | —                                                                                                                                                                                                                                                                                                                                                                  |
| `10546` | `V4.3.8 GUARDED BOOTSTRAP`                                                                    | Single boot guard and safe boot failure handling.                                                                                                                                                | —                                                                                                                                                                                                                                                                                                                                                                  |
| `10566` | `END OF VITALGUARD AI v4.3.8`                                                                 | End marker.                                                                                                                                                                                      | —                                                                                                                                                                                                                                                                                                                                                                  |

## 6. Security Line Map

| Control                           | Source lines                          | Review note                                                                                                                                                       |
|-----------------------------------|---------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| License / SPDX metadata           | `19-20`       | Apache-2.0 and SPDX identifier metadata.                                                                                                                          |
| CSP                               | `21`          | Nonce-authorized single inline script, script-src-attr none, connect-src none, worker-src none, Trusted Types, frame/form/base/object restrictions.               |
| Permissions-Policy                | `24`          | Allows geolocation/microphone/bluetooth/motion for self; disables camera/payment/USB.                                                                             |
| Security hardening meta           | `28`          | Summarizes V4.3.8 hardening: nonce CSP, no inline event attributes, encrypted backup default, bounded import, redacted diagnostics, no service worker by default. |
| APP_VERSION and storage constants | `998-1004`    | APP_VERSION 4.3.8; DB_NAME VitalGuardAI_V41; DB_VERSION 2; LS_PREFIX vg41\_.                                                                                      |
| Action policy/dispatcher          | `732-814`     | Strict allowlist for data-vg-on\* actions, no eval/new Function, validated primitive args.                                                                        |
| Trusted Types / DOM guard         | `817-953`     | Trusted Types policy, HTML neutralization, sink patching, MutationObserver scrubber, document.write and share override.                                           |
| Security.fullWipe                 | `3383-3446`   | Best-effort wipe of Store, IndexedDB database, app caches, and service worker registrations.                                                                      |
| BLE scan consent/timeout          | `5462-5493`   | Registration scan asks for user consent and auto-stops after 30 seconds.                                                                                          |
| DataManager entrypoints           | `6644-6659`   | Exports/imports are delegated to encrypted/hardened final functions.                                                                                              |
| PWA manifest only                 | `7383-7406`   | Blob manifest generation; service worker registration is absent/disabled by default.                                                                              |
| CryptoBox                         | `8261-8313`   | PBKDF2-SHA-256 with 600,000 iterations and AES-GCM-256.                                                                                                           |
| Legacy import wrapper disabled    | `8881-8883`   | All plain/encrypted imports handled by VitalGuardHardenedImport.                                                                                                  |
| Runtime network guard             | `10149-10197` | fetch, XHR, WebSocket, EventSource, sendBeacon, and form.submit disabled/blocked.                                                                                 |
| External navigation guard         | `10199-10240` | Blocks external http(s), mailto, tel, sms navigation/window opening in zero-egress mode.                                                                          |
| Copy-only sharing                 | `10242-10278` | SOS and Emergency sharing copy text locally instead of OS/network share.                                                                                          |
| Rescue pack hardening             | `10425-10443` | Size, expiry, version, and schema/text sanitization for decoded rescue packs.                                                                                     |
| Audit hardening object            | `10503-10509` | Exposes final hardening metadata: encrypted-only default, import limits, serviceWorker disabled, diagnostics redacted.                                            |
| Hardened import                   | `10519-10532` | Depth/size/node limits, pet/settings/schema sanitizers, voice data limits, encrypted pack handling.                                                               |
| Redacted diagnostics              | `10534-10536` | Redacts UA, focus ID, pet identifiers, error locations, and attaches audit hardening metadata.                                                                    |
| Guarded bootstrap                 | `10546-10566` | Single boot guard and safe boot failure handling.                                                                                                                 |

## 7. Action Dispatch Allowlist

The action dispatcher permits only explicit first-party namespace/method calls. Arguments are limited to short strings, numbers, booleans, null, `this.value`, or the event object. It blocks constructor/prototype/eval/Function/import/network/storage/cookie/document.write/window.open/location assignment patterns before dispatch.

| Namespace                             | Allowed methods                                                                                                                                                                                                                                                                                                                                                  |
|---------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `App`         | `dismissFirstRun` `setTrackMode` `toggleDemo` `toggleMonitoring` `focusFromChip`                                                                                                                                                              |
| `DataManager` | `exportAll` `importFile` `handleImport`                                                                                                                                                                                                                                                     |
| `Detail`      | `aiFeedback` `applySuggestion` `close` `open` `resetQ` `setLeash` `suggestAI` `toggleAI` `updateThreshold`                                        |
| `Diag`        | `close` `copy` `download` `open`                                                                                                                                                                                                                                     |
| `Emergency`   | `close` `copyPhone` `deactivate` `open` `requestMotionPermission` `saveFromUI` `share` `toggleShake` `holdStart` `holdEnd` |
| `ErrorShield` | `clear`                                                                                                                                                                                                                                                                                                                                   |
| `Help`        | `close` `open`                                                                                                                                                                                                                                                                                                     |
| `I18N`        | `setLang`                                                                                                                                                                                                                                                                                                                                 |
| `Lang`        | `choose` `close` `open`                                                                                                                                                                                                                                                                     |
| `Legal`       | `close` `open`                                                                                                                                                                                                                                                                                                     |
| `Nav`         | `go`                                                                                                                                                                                                                                                                                                                                      |
| `ResetCenter` | `close` `factory` `hard` `open` `soft`                                                                                                                                                                                                        |
| `SOS`         | `deactivate` `saveLocation` `selectPet` `shareMessage` `holdStart` `holdEnd`                                                                                                                                           |
| `SafeMode`    | `disable`                                                                                                                                                                                                                                                                                                                                 |
| `Settings`    | `removePet` `resetApp` `setPerf` `toggle` `toggleNotif` `toggleV40` `setVolume`                                                                                                                 |
| `V40UI`       | `exportEncrypted` `showPitch`                                                                                                                                                                                                                                                                                      |
| `VGHardening` | `runCoachAction`                                                                                                                                                                                                                                                                                                                          |
| `VoiceRecall` | `play` `record5s`                                                                                                                                                                                                                                                                                                  |
| `Wizard`      | `clearCalib` `close` `goStep3` `open` `pickIcon` `recordCalib` `rescan` `save` `selectCandidate` `skipVerify`              |

## 8. Settings / Storage Key Index

| Key                                                                      | Meaning                                        |
|--------------------------------------------------------------------------|------------------------------------------------|
| `sound`                                          | Global sound alerts.                           |
| `vibrate`                                        | Haptic/vibration alerts.                       |
| `notifWanted`                                    | User intent for browser notifications.         |
| `highAlert`                                      | Tighter alert thresholds.                      |
| `perfMode`                                       | saver / balanced / fast runtime profile.       |
| `voiceRecall`                                    | Voice recall playback on CAUTION.              |
| `tts`                                            | SpeechSynthesis announcements.                 |
| `keepAlive`                                      | Near-silent audio keepalive.                   |
| `autoWipeOnClose`                                | Best-effort pagehide full wipe.                |
| `volume`                                         | Master alert/siren volume.                     |
| `useScanFilters`                                 | BLE scan filter toggle.                        |
| `screenAwake`                                    | Wake Lock toggle.                              |
| `autoOptimize`                                   | ConductorAI self-heal suggestions.             |
| `largeText`                                      | Accessibility large text.                      |
| `highContrast`                                   | Accessibility high contrast.                   |
| `reduceMotion`                                   | Accessibility reduced motion.                  |
| `monitoringWanted`                               | Persisted monitoring preference.               |
| `safeMode`                                       | Conductor/SafeMode state.                      |
| `emg_name / emg_phone / emg_medical / emg_shake` | Emergency profile settings.                    |
| `vg_lang_v41`                                    | I18N language selection key outside LS_PREFIX. |
| `vg_lang_v412`                                   | Legacy language key reference.                 |

## 9. Module Deep Dive


---


### `V4.3.8 EARLY SECURITY GUARD` **[line 715]**

**Role:** Defense-in-depth bootstrap guard: sanitizer defaults, action-policy dispatch, Trusted Types policy, HTML sink scrubber, mutation scrubber, document.write blocker, and copy-only share override.

    /* ----------------------------- V4.3.8 EARLY SECURITY GUARD -----------------------------
       Defense-in-depth for single-file/offline mode.
       - Trusted Types policy for Chromium/Edge; harmless on unsupported browsers.
       - HTML sink scrubber for innerHTML/insertAdjacentHTML/Range fragments.
       - copy-only data flow available before later modules load.
       - OS share, document.write, and external active URL attributes are blocked/neutralized.
    */
    var Sanitizer = window.Sanitizer || {
      name:function(s){ s=String((s===undefined||s===null)?'':s).replace(/[\u0000-\u001F\u007F]/g,'').trim().replace(/[<>`]/g,''); return (s||'My Pet').slice(0,28); },
      phone:function(s){ return String((s===undefined||s===null)?'':s).replace(/[\u0000-\u001F\u007F]/g,'').trim().replace(/[^0-9+\-\s]/g,'').slice(0,24); },
      text:function(s,max){ max=max||220; return String((s===undefined||s===null)?'':s).replace(/[\u0000-\u001F\u007F]/g,'').trim().replace(/[<>`]/g,'').slice(0,max); },
      icon:function(s){ s=String((s===undefined||s===null)?'🐶':s); return (typeof ICONS!=='undefined' && ICONS.includes && ICONS.includes(s)) ? s : '🐶'; },
      escapeHTML:function(s){ if(s==null)return''; return String(s).replace(/[&<>'"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]||c;}); },
      safeId:function(s){ return String(s==null?'':s).replace(/[^a-zA-Z0-9_-]/g,'').slice(0,64); }
    };
    window.Sanitizer = Sanitizer;


---


### `OPEN SOURCE MANIFEST` **[line 1072]**

**Role:** Apache-2.0 / FOSS notice with no field-of-use restrictions and public-interest guidelines.

    /* ----------------------------- OPEN SOURCE MANIFEST ----------------------------- */
    /* v4.3.8 OTF/FOSS PATCH (M-1): Object.freeze applied at both outer and array level.
       Prevents runtime tampering of the open-source notice by injected code or malicious extensions.
       Outer freeze blocks property reassignment; inner freeze blocks array mutation. */
    const ETHICAL_MANIFEST = Object.freeze({
      version: APP_VERSION,
      license: 'Apache-2.0',
      licenseName: 'Apache License 2.0',
      spdx: 'Apache-2.0',
      purpose: 'Life‑saving offline AI demo (no cloud, no telemetry)',
      fieldOfUseRestrictions: Object.freeze([]),
      publicInterestGuidelines: Object.freeze(['privacy_preserving','humanitarian_ready','agricultural_resilience','disaster_continuity','offline_first','no_telemetry_by_default']),
      principles: Object.freeze(['minimize_hallucinations','transparency','accessibility','no_data_exploitation','low_resource','no_liability','affordable','simplicity','non_specialist','allow_deletion'])
    });

    /* ----------------------------- OPEN SOURCE NOTICE GUARD (Runtime Integrity) ----------------------------- */


---


### `OPEN SOURCE NOTICE GUARD (Runtime Integrity)` **[line 1087]**

**Role:** Runtime integrity checker for FOSS/license/manifest fields, exposed to diagnostics.

    /* ----------------------------- OPEN SOURCE NOTICE GUARD (Runtime Integrity) ----------------------------- */
    /* Validates ETHICAL_MANIFEST integrity at boot and exposes status for diagnostics.
       DEFENSE_LEVEL: STRONG (4 checks: manifest, Apache-2.0/SPDX, no field-of-use restrictions, principles list) */
    const EthicalGuard = {
      status: 'UNCHECKED',
      details: [],

      validate(){
        this.details = [];
        let pass = true;

        // Check 1: Manifest exists and has required fields
        if(!ETHICAL_MANIFEST || typeof ETHICAL_MANIFEST !== 'object'){
          this.details.push('FAIL: ETHICAL_MANIFEST missing or corrupted');
          pass = false;
        } else {


---


### `V4.3.8 SECURITY HELPERS (global scope)` **[line 3123]**

**Role:** Container section for SecurePrompt, ConfirmModal, Security.fullWipe, and local storage helpers.

    /* ---- V4.3.8 SECURITY HELPERS (global scope) ---- */

    /* ---- v4.3.6 SECURITY PATCH: SecurePrompt (replaces prompt() for secrets) ---- */
    const SecurePrompt = (()=> {
      let backdrop=null;
      let resolver=null;

      function ensure(){
        if(backdrop) return;
        const wrap=document.createElement('div');
        wrap.id='sp-backdrop';
        wrap.className='sp-backdrop';
        wrap.innerHTML = `
          <div class="sp-dialog" role="dialog" aria-modal="true" aria-labelledby="sp-title">
            <div class="sp-title" id="sp-title">Secure Input
            <div class="sp-msg" id="sp-msg">


---


### `v4.3.6 SECURITY PATCH: SecurePrompt (replaces prompt() for secrets)` **[line 3125]**

**Role:** Secure modal for passphrases/text input, with reveal toggle, confirmation option, cancellation, keyboard behavior.

    /* ---- v4.3.6 SECURITY PATCH: SecurePrompt (replaces prompt() for secrets) ---- */
    const SecurePrompt = (()=> {
      let backdrop=null;
      let resolver=null;

      function ensure(){
        if(backdrop) return;
        const wrap=document.createElement('div');
        wrap.id='sp-backdrop';
        wrap.className='sp-backdrop';
        wrap.innerHTML = `
          <div class="sp-dialog" role="dialog" aria-modal="true" aria-labelledby="sp-title">
            <div class="sp-title" id="sp-title">Secure Input
            <div class="sp-msg" id="sp-msg">
            <div id="sp-fields">
            <div class="sp-hint" id="sp-hint" style="display:none">


---


### `v4.2.5 SECURITY PATCH: ConfirmModal (replaces confirm())` **[line 3326]**

**Role:** Custom confirmation modal used for destructive and sensitive flows instead of browser confirm().

    /* ---- v4.2.5 SECURITY PATCH: ConfirmModal (replaces confirm()) ---- */
    /* Copyright © 2026 Morgan J. (Gyu-min Jeon) | McorpAI
       SPDX-License-Identifier: Apache-2.0 */
    const ConfirmModal = {
      _bd: null,
      _resolver: null,

      _ensure(){
        if(this._bd) return;
        const d=document.createElement('div');
        d.className='sp-backdrop';
        d.innerHTML=`
          <div class="sp-dialog" role="alertdialog" aria-modal="true" aria-labelledby="cm-title" aria-describedby="cm-msg">
            <div class="sp-title" id="cm-title">Confirm
            <div class="sp-msg" id="cm-msg">
            <div class="sp-actions">


---


### `v4.3.6 SECURITY PATCH: Auto-wipe & full wipe helpers` **[line 3383]**

**Role:** Best-effort full wipe path for IndexedDB, app localStorage keys, Cache Storage, and service worker registrations.

    /* ---- v4.3.6 SECURITY PATCH: Auto-wipe & full wipe helpers ---- */
    const Security = {
      // Full wipe: localStorage + IndexedDB + Cache Storage + Service Worker registrations (best effort)
      async fullWipe(){
        try{ await Store.clearAll(); }catch(e){}
        try{
          if('indexedDB' in window){
            await new Promise(res=>{
              try{
                const req=indexedDB.deleteDatabase(DB_NAME);
                req.onsuccess=()=>res();
                req.onerror=()=>res();
                req.onblocked=()=>res();
              }catch(e){ res(); }
            });
          }


---


### `STORAGE` **[line 3457]**

**Role:** IndexedDB-first store with localStorage fallback for pets, settings, AI state, alerts, blobs, and reset flows.

    /* ----------------------------- STORAGE ----------------------------- */
    const Store = {
      db: null,

      async init() {
        return new Promise(resolve=>{
          try{
            const req = indexedDB.open(DB_NAME, DB_VERSION);
            req.onupgradeneeded = e => {
              const db = e.target.result;
              if(!db.objectStoreNames.contains('pets')) db.createObjectStore('pets',{keyPath:'id'});
              if(!db.objectStoreNames.contains('settings')) db.createObjectStore('settings',{keyPath:'key'});
              if(!db.objectStoreNames.contains('ai')) db.createObjectStore('ai',{keyPath:'key'});
              if(!db.objectStoreNames.contains('alerts')) db.createObjectStore('alerts',{keyPath:'id'});
              if(!db.objectStoreNames.contains('blobs')) db.createObjectStore('blobs',{keyPath:'key'});
            };


---


### `BLE MATCHING` **[line 5088]**

**Role:** BLE advertisement signature scoring and route selection.

    /* ----------------------------- BLE MATCHING ----------------------------- */
    function _mfgPrefixHexFromEvent(event){
      try{
        if(!event.manufacturerData) return null;
        let pref=null;
        event.manufacturerData.forEach((v,k)=>{
          if(pref) return;
          const u8=new Uint8Array(v.buffer, v.byteOffset, Math.min(v.byteLength,2));
          pref=[...u8].map(b=>b.toString(16).padStart(2,'0')).join('').toUpperCase();
        });
        return pref;
      }catch(e){
        return null;
      }
    }


---


### `BLE ENGINE (V35 hardened + V40 fixes)` **[line 5177]**

**Role:** Web Bluetooth scan engine, filters, restart protection, congestion tracking, and scan health.

    /* ----------------------------- BLE ENGINE (V35 hardened + V40 fixes) ----------------------------- */
    const BLE = {
      scanning:false,
      scanReq:null,
      _handler:null,
      supported:false,

      // restart protection
      restartCount:0,
      restartWindowStart:0,
      restartInProgress:false,
      lastRestartMs:0,
      lastRestartReason:'',

      // scan mode
      lastScanMode:'track',


---


### `WIZARD (V35 + V40 signature hardening)` **[line 5374]**

**Role:** User-initiated tag registration/reverify flow with scan consent and bounded registration scan.

    /* ----------------------------- WIZARD (V35 + V40 signature hardening) ----------------------------- */
    const Wizard = {
      mode:'add', // 'add' | 'reverify'
      targetPetId:null,

      candidates:{},
      selectedId:null,
      selectedSig:null,
      baselineRssi:null,
      verified:false,
      chosenIcon:'🐶',

      scanTimer:null,
      verifyTimer:null,

      calib:{}, // {1:rssi,10:rssi}


---


### `DATA MANAGER` **[line 6644]**

**Role:** V4.3.8 encrypted-export and hardened-import entrypoints. Legacy plain export is not the default.

    /* ----------------------------- DATA MANAGER ----------------------------- */
    const DataManager = {
      async exportAll(){
        if(window.VitalGuardEncryptedExport){ return window.VitalGuardEncryptedExport(); }
        try{ Toast.show('Encrypted backup module is still loading. Try again.'); }catch(_){}
      },

      importFile(){ $('import-input').click(); },

      async handleImport(ev){
        if(window.VitalGuardHardenedImport){ return window.VitalGuardHardenedImport(ev); }
        try{ Toast.show('Import guard is still loading. Try again.'); }catch(_){}
        try{ if(ev && ev.target) ev.target.value=''; }catch(_){}
      }

    };


---


### `PWA` **[line 7383]**

**Role:** Blob-based manifest generation only; service worker registration is disabled by default in V4.3.8.

      /* ----------------------------- PWA ----------------------------- */
      registerPWA(){
        const startUrl = location.href;
        const manifest = {
          name: "VitalGuard AI v"+APP_VERSION,
          short_name: "VitalGuard AI",
          start_url: startUrl,
          display: "standalone",
          background_color: "#0d1117",
          theme_color: "#c0392b",
          description: "Life-saving offline AI demo — Bluetooth proximity + tiny on-device AI (no cloud).",
          icons: [
            {src:"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='192' height='192'%3E%3Crect width='192' height='192' rx='40' fill='%23c0392b'/%3E%3Ctext x='50%25' y='54%25' dominant-baseline='middle' te …
            {src:"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='512' height='512'%3E%3Crect width='512' height='512' rx='96' fill='%23c0392b'/%3E%3Ctext x='50%25' y='54%25' dominant-baseline='middle' te …
          ],
          vitalguardSecurity:{serviceWorker:"disabled-by-default", workerSrc:"none", networkEgress:"blocked"}


---


### `SAFE TEXT / SANITIZER` **[line 7450]**

**Role:** Sanitizer methods for names, phone numbers, text, icons, HTML escaping, and safe IDs.

      /* ----------------------------- SAFE TEXT / SANITIZER ----------------------------- */
      const Sanitizer = {
        // Remove risky characters while keeping names readable (prevents HTML injection from user input/import).
        name(s){
          s = String((s===undefined||s===null)?'':s).replace(/[\u0000-\u001F\u007F]/g,'').trim();
          s = s.replace(/[<>`]/g,'');
          if(!s) return 'My Pet';
          return s.slice(0, 28);
        },
        phone(s){
          s = String((s===undefined||s===null)?'':s).replace(/[\u0000-\u001F\u007F]/g,'').trim();
          // allow digits + + - space
          s = s.replace(/[^0-9+\-\s]/g,'');
          return s.slice(0, 24);
        },
        text(s, max=220){


---


### `ENCRYPTED BACKUP (AES-GCM)` **[line 8261]**

**Role:** PBKDF2-SHA-256 + AES-GCM backup encryption/decryption helper.

      /* ----------------------------- ENCRYPTED BACKUP (AES-GCM) ----------------------------- */
      const CryptoBox = {
        supported(){
          return !!(window.crypto && crypto.subtle && window.TextEncoder && window.TextDecoder);
        },
        _b64(u8){
          let s='';
          for(let i=0;i<u8.length;i++) s+=String.fromCharCode(u8[i]);
          return btoa(s);
        },
        _u8(b64){
          const bin=atob(b64);
          const u8=new Uint8Array(bin.length);
          for(let i=0;i<bin.length;i++) u8[i]=bin.charCodeAt(i);
          return u8;
        },


---


### `V40 UI INJECTION` **[line 8315]**

**Role:** Backward-compatible UI injection layer for advanced settings, reset center, backup, diagnostics, and cards.

      /* ----------------------------- V40 UI INJECTION ----------------------------- */
      const V40UI = {
        injected:false,

        inject(){
          if(this.injected) return;
          this.injected=true;

          Accessibility.injectCSS();
          ResetCenter.ensureUI();

          // Inject Advanced toggles card into Settings panel (UX)
          const panel=$('panel-settings');
          if(panel && !document.getElementById('v40-advanced-card')){
            const card=document.createElement('div');
            card.className='card';


---


### `V4.3.8 FINAL HARDENING LAYER` **[line 10138]**

**Role:** Runtime egress kill-switch, external navigation guard, copy-only sharing, alert and detail fixes, action-registry coach, rescue pack hardening, self-test fix.

    /* ----------------------------- V4.3.8 FINAL HARDENING LAYER -----------------------------
       Purpose: eliminate low-grade audit findings by adding runtime egress blocks,
       fixing V4.1 add-on edge bugs, and removing external-navigation behavior.
       Version string remains 4.3.8 by design. */
    (function(){
      'use strict';

      function vgToast(msg, dur){ try{ Toast.show(msg, dur||2200); }catch(_){} }
      function vgEscape(s){ try{ return _vgE(s); }catch(_){ return String(s==null?'':s).replace(/[&<>'"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); } }
      function vgSafeZone(z){ return (z && ZONE_ORDER[z] !== undefined) ? z : 'SAFE'; }

      // 1) Runtime network egress kill-switch. CSP is primary; this is defense-in-depth.
      const RuntimeNetworkGuard = {
        blocked: 0,
        _deny(api){
          this.blocked++;


---


### `V4.3.8 GUARDED BOOTSTRAP` **[line 10546]**

**Role:** Single boot guard and safe boot failure handling.

    /* ----------------------------- V4.3.8 GUARDED BOOTSTRAP ----------------------------- */
    (function(){
      try{
        if(window.__VITALGUARD_BOOTED__) return;
        window.__VITALGUARD_BOOTED__ = true;
        const boot = ()=>{
          try{
            if(typeof App !== 'undefined' && App && typeof App.init === 'function'){
              App.init().catch(e=>{
                try{ console.error('[VitalGuard] boot failed:', e); }catch(_){}
                try{ Toast.show('VitalGuard boot failed safely. Open Diagnostics.', 4200); }catch(_){}
              });
            }
          }catch(e){ try{ console.error('[VitalGuard] boot exception:', e); }catch(_){} }
        };
        if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, {once:true});


## 12. DOM ID Index

Extracted static DOM IDs and template IDs. Dynamic runtime may create additional transient nodes; use this as a navigation map, not a complete DOM proof.


`ai-feedback`


`ai-suggestion`


`app`


`btn-demo-toggle`


`btn-mode-all`


`btn-mode-focus`


`btn-scan-toggle`


`btn-skip-verify`


`btn-verified`


`btn-wiz-save`


`calib-10m`


`calib-1m`


`cm-cancel`


`cm-msg`


`cm-ok`


`cm-title`


`coach-body`


`coach-card`


`congestionBadge`


`custom-thresholds`


`dash-controls`


`dash-controls2`


`detail-alerts`


`detail-body`


`detail-overlay`


`detail-title`


`diag-body`


`diag-overlay`


`diag-pre`


`dt-caution`


`dt-danger`


`dt-warning`


`emergency-active`


`emg-active-name`


`emg-active-sub`


`emg-body`


`emg-call`


`emg-medical`


`emg-name`


`emg-overlay`


`emg-phone`


`emg-qr`


`emg-strobe`


`empty-state`


`first-run-banner`


`fr-proto`


`hc-arrow`


`hc-rssi`


`hc-text`


`help-body`


`help-overlay`


`i18n_about_link`


`i18n_app_disclaimer`


`i18n_app_mission`


`i18n_app_sub`


`i18n_app_title`


`i18n_badge_ble`


`i18n_badge_gdpr`


`i18n_badge_offline`


`i18n_badge_tiny`


`i18n_contact_line`


`i18n_empty_btn`


`i18n_empty_text`


`i18n_firstrun_body`


`i18n_firstrun_help`


`i18n_firstrun_ok`


`i18n_firstrun_title`


`i18n_github_link`


`i18n_help_link`


`i18n_help_title`


`i18n_hero_body`


`i18n_hero_pillars`


`i18n_hero_title`


`i18n_install_sub`


`i18n_install_title`


`i18n_lang_link`


`i18n_lang_note`


`i18n_lang_subtitle`


`i18n_lang_title`


`i18n_legal_title`


`i18n_tips_title`


`icon-picker`


`import-input`


`input-name`


`installBanner`


`installBtn`


`installDismiss`


`lang-overlay`


`langSelect`


`legal-body`


`legal-overlay`


`notif-hint`


`panel-home`


`panel-settings`


`panel-sos`


`panel-tips`


`perf-`


`perf-balanced`


`perf-fast`


`perf-saver`


`pet-chips`


`pet-list`


`pwa-manifest`


`reset-body`


`reset-overlay`


`safe-banner`


`scan-health-fill`


`scan-health-meta`


`scan-health-row`


`scan-list`


`scan-status`


`scan-status-bar`


`settings-pet-list`


`sos-active`


`sos-active-name`


`sos-content`


`sos-focus-banner`


`sos-no-pets`


`sos-pet-select`


`sos-snapshot`


`sos-strobe-area`


`sp-1`


`sp-2`


`sp-3`


`sp-backdrop`


`sp-cancel`


`sp-confirm`


`sp-fields`


`sp-hint`


`sp-input`


`sp-msg`


`sp-ok`


`sp-title`


`tipsI18n`


`toggle-autoOptimize`


`toggle-autoWipeOnClose`


`toggle-highContrast`


`toggle-highalert`


`toggle-keepAlive`


`toggle-largeText`


`toggle-notif`


`toggle-reduceMotion`


`toggle-scanFilters`


`toggle-screenAwake`


`toggle-sound`


`toggle-tts`


`toggle-vibrate`


`toggle-voiceRecall`


`v40-a11y-style`


`v40-adv-hint`


`v40-advanced-card`


`v40-ai-explain`


`v41-ap-minzone`


`v41-ap-sound`


`v41-ap-tts`


`v41-ap-vibrate`


`v41-calibpro-clear`


`v41-calibpro-dist`


`v41-calibpro-dist-label`


`v41-calibpro-list`


`v41-calibpro-preview`


`v41-calibpro-record`


`v41-calibpro-stats`


`v41-dcalib-apply-leash`


`v41-dcalib-clear`


`v41-dcalib-dist`


`v41-dcalib-dist-label`


`v41-dcalib-list`


`v41-dcalib-record`


`v41-dcalib-stats`


`v41-leash-apply`


`v41-leash-m`


`v41-leash-m-label`


`v41-rp-assist`


`v41-rp-code`


`v41-rp-copy`


`v41-rp-generate`


`v41-rp-import`


`v41-rp-qr`


`v41-rp-share`


`v41-rp-sms`


`v41-rp-start`


`v41-rp-stop`


`verify-delta`


`verify-status`


`vg3SecondHook`


`vgHero`


`vgact_`


`volumeSlider`


`volumeVal`


`wiz-step-1`


`wiz-step-2`


`wiz-step-3`


`wizard-overlay`


`wizard-title`



