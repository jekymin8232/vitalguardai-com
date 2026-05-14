# VitalGuard Bluetooth Swarm + Ultrasonic Mesh / Code Map / Morgan J(Gyu-min Jeon)

**Target artifact:** `Bluetooth_Swarm_Ultrasonic_Mesh_singlefile_V1_7_2.html`
**Build identity:** Closed Beta 1.7.2 / Test V7.2
**Audience:** security reviewers, maintainers, field-test coordinators, and deployment operators

---

## 1. Scope

This document is a neutral code manual and code map for `Bluetooth_Swarm_Ultrasonic_Mesh_singlefile_V1_7_2.html`. It describes what the file contains, how the runtime is organized, which modules implement which functions, where reviewers should search in the source, and which procedures should be used for local testing and field-evidence collection.

The artifact is a single-file offline humanitarian continuity prototype. It contains a local BLE proximity and rescue-coordination interface, short-lived passive BLE observation, concern-value calculation, managed local relay concepts, acoustic fallback, QR/SVG SOS card generation, visual/tactile beacons, field evidence capture, sanitized audit exports, local AI-Coder algorithm classes, and explicit limitations around browser BLE transmission, background execution, acoustic reliability, and JavaScript deletion.

This manual does not certify rescue performance, medical use, law-enforcement use, guaranteed delivery, exact location, or hardware reliability. Those claims require separate real-device test records and deployment governance.

---

## 2. Document Control

| Field | Value |
|---|---|
| Document title | VitalGuard Bluetooth Swarm + Ultrasonic Mesh — V2.0 Neutral Auditor Manual / Code Map |
| Target artifact | `Bluetooth_Swarm_Ultrasonic_Mesh_singlefile_V1_7_2.html` |
| Build identity | Closed Beta 1.7.2 / Test V7.2 |
| Audience | security reviewers, maintainers, field-test coordinators, and deployment operators |
| Distribution model | single-file HTML, inline scoped CSS, inline vanilla JavaScript, zero external dependency |
| License context | M-Corp Ethical AI License, Hippocratic 3.0 derivative, civilian/agricultural/humanitarian use only |
| Manual scope | code map, module roles, search tokens, operational procedures, field-evidence workflow, customization notes, residual limits |
| Important caveat | This manual is not a hardware certification record. BLE range, audio demodulation, torch, vibration, battery endurance, and field false-positive behavior require separate device evidence. |
| Static syntax check | Extracted script passed `node --check` in the local workspace. |

---

## 3. Static Artifact Metrics

| Metric | Value |
|---|---:|
| File size | 246,699 bytes (240.92 KiB) |
| Line count | 1,763 lines |
| Inline CSS size | 14,224 bytes |
| Inline JavaScript size | 189,391 bytes |
| SHA-256 | `69d7bc268bfdc57e1b2f76fea21a0d2c31216b760097a152e3f4f762f8153dad` |
| Registered modules | 41 |
| DOM IDs | 130 |
| External script tags | 0 |
| External stylesheet links | 0 |
| iframe / embed / object elements | 0 / 0 / 0 |
| canvas elements | 0 |
| Network egress design | CSP `connect-src none` plus runtime NetworkGuard |

---

## 4. Fast Reviewer Path

Use this order when reviewing the artifact:

1. Read the top changelog and operational-limit comments.
2. Check the CSP meta tag, especially `connect-src none`, `object-src none`, `base-uri none`, and `form-action none`.
3. Search for `ETHICAL_MANIFEST` and verify allowed/prohibited uses, license scope, retention limits, and safeguards.
4. Search for `registerModule('Ethics'` and review `OP_POLICY`, `canOperate()`, sanitizer behavior, and integrity checks.
5. Search for `registerModule('NetworkGuard'` and review blocking of fetch, XHR, WebSocket, EventSource, WebRTC, and sendBeacon.
6. Search for `registerModule('BLE'` and verify that passive scan is consent-gated and BLE advertisement TX is not overstated.
7. Search for `registerModule('Acoustic'` and verify that raw audio is not persisted and that acoustic delivery is documented as fallback evidence only.
8. Search for `registerModule('FieldMatrix'` and `registerModule('VirtualFieldTest'` and confirm evidence records are local and sanitized.
9. Run the artifact in a browser, then execute Start Core, Run Self Tests, Run Field Matrix, Run Virtual Field Test, Export Sanitized Audit, and Emergency 7-Pass Wipe.
10. For deployment claims, collect real device evidence on Android/desktop Chromium hardware, including BLE, microphone/speaker, flash, vibration, battery, wake lock, and range tests.

---

## 5. Architecture Overview

The artifact uses a single HTML file with one scoped style block and one script block. The script is wrapped in an IIFE and exposes a small public diagnostic API through `window.VitalGuardClosedBeta17TestV7` and `window.VitalGuardClosedBeta171TestV71`. Internal communication uses `SwarmBus`, a compact local event bus.

Core architectural layers:

| Layer | Responsibility |
|---|---|
| Identity and state | Session identity, rotating salt, role, profile, local tracks, nodes, queues, logs, and evidence records |
| Ethical gate | Purpose limitation, operation whitelist, consent gates, integrity check, sanitizer, tamper response |
| Local-only security | CSP, runtime network primitive blocking, SafeStorage, sanitized export, no remote dependencies |
| BLE proximity | Protocol scanning, passive scan with consent, GATT fallback, native advertiser hook, local observation |
| Rescue AI | RSSI-based concern-value logic, movement assessment, group penalty, consensus, top track selection |
| Fallback channels | Acoustic FSK/Morse, camera torch Morse, vibration Morse, SOS board, QR/SVG rescue card |
| Evidence | Self-test, FieldMatrix, VirtualFieldTest, sanitized debug, sanitized audit export |
| Operator UI | Status dashboard, controls, maps, compass, logs, module health, charts, manual notes |

---

## 6. Boot Flow

Boot begins inside `boot()` after module registration. The important order is:

1. `NetworkGuard.install()` arms no-egress runtime blocking.
2. `Watchdog.start()` starts liveness monitoring where workers are available.
3. `Capability.audit()` records browser feature support.
4. `DebugMode.restore()`, `HighContrastMode.apply()`, `IdleTimeout.install()`, and `KeyboardShortcuts.install()` restore operator controls.
5. `MiniChart.start()` starts SVG-only chart sampling.
6. `Ethics.installIntegrity([...])` hashes the core ethical/security functions.
7. `UI.bind()` and `V62Panel.bind()` attach event handlers.
8. `UI.renderAll()` performs initial UI rendering.
9. A visible boot meter reports readiness milestones.

Boot does not automatically start BLE scanning, microphone RX, camera torch, vibration, QR download, or audit export. Those actions require operator gestures or explicit control paths.

---

## 7. Runtime Flows

### 7.1 BLE scan flow

Protocol scan targets VitalGuard service identifiers. Passive scan may use accept-all advertisements, but only after the passive-scan consent path. Advertisements are processed through payload extraction, fingerprint creation, heartbeat decode where applicable, local rescue observation, and managed relay handling. Browser-native BLE advertisement transmission is not claimed as universal; the artifact separates real TX into native bridge, GATT peer write, fixed external beacon hardware, and acoustic fallback.

### 7.2 Rescue assessment flow

`RescueAI.observe()` builds short-lived tracks from BLE observations. The assessment combines profile prior, stationary duration, movement irregularity, time-of-day risk, signal degradation, isolation, SOS-like name flag, group penalty, and the AICoder ensemble. Level changes are used as triage evidence, not as automatic certification of distress.

### 7.3 Acoustic fallback flow

The acoustic module can wake the AudioContext, start RX, calibrate, send FSK text, send Morse, and play beacon patterns. The V7 acoustic protocol uses preamble, bounded length, CRC, Goertzel/FFT checks, and TDMA scheduling. It is still experimental field evidence because microphones, AGC, speaker response, background noise, rain, wind, and mobile browser policies can break delivery.

### 7.4 Evidence flow

Evidence is split into three classes: internal self-test, FieldMatrix records, and VirtualFieldTest scenario records. Exports are JSON Blob downloads created locally. They are sanitized and are not sent to a server.

---

## 8. Module Directory

| # | Module | Variable | Approx. bytes | Search token | Representative functions/classes |
|---:|---|---|---:|---|---|
| 1 | `State` | `State` | 2,506 | `registerModule('State'` | loadStoredId, createNodeId |
| 2 | `Dom` | `Dom` | 1,233 | `registerModule('Dom'` | byId, setText, cls, clear, item, svg |
| 3 | `Logger` | `Logger` | 608 | `registerModule('Logger'` | log, clear, list |
| 4 | `Ethics` | `Ethics` | 6,088 | `registerModule('Ethics'` | redactString, sanitize, validateManifest, hashRefs, installIntegrity, checkIntegrity, consentOk, recordConsent |
| 5 | `NetworkGuard` | `NetworkGuard` | 2,402 | `registerModule('NetworkGuard'` | block, install, probe, status |
| 6 | `Storage` | `Storage` | 2,805 | `registerModule('Storage'` | open, put, all, clearStore, clearAll, deleteDatabase, verifyEmpty, prune |
| 7 | `Identity` | `Identity` | 1,224 | `registerModule('Identity'` | applyMode, rotate |
| 8 | `DataWiper` | `DataWiper` | 5,031 | `registerModule('DataWiper'` | clearLocalStorage, clearSession, clearMemory, wipe, verifyAccessibleDeletion, idbProbe, installTriggers |
| 9 | `Watchdog` | `Watchdog` | 3,275 | `registerModule('Watchdog'` | start, tick, notifyRender, check, stop, status |
| 10 | `Capability` | `Capability` | 1,276 | `registerModule('Capability'` | audit, label |
| 11 | `Profiles` | `Profiles` | 2,736 | `registerModule('Profiles'` | current, apply, estimateDistance, distanceConfidence |
| 12 | `Power` | `Power` | 1,399 | `registerModule('Power'` | start, update, requestWakeLock, scanDutyForConcern |
| 13 | `Bloom` | `Bloom` | 592 | `registerModule('Bloom'` | clear, hash, add, has |
| 14 | `Heartbeat` | `Heartbeat` | 1,958 | `registerModule('Heartbeat'` | sensorFlags, encode, decode |
| 15 | `PacketCodec` | `PacketCodec` | 3,119 | `registerModule('PacketCodec'` | pack, encode, encodeChunks, decode, absorb |
| 16 | `Trust` | `Trust` | 1,662 | `registerModule('Trust'` | get, average, update, clear, restore |
| 17 | `AICoder` | `AICoder` | 13,411 | `registerModule('AICoder'` | finite, distance, normalize, dot, sigmoid, QLearning, UCBBandit, KNN |
| 18 | `RescueAI` | `RescueAI` | 4,703 | `registerModule('RescueAI'` | temporalRisk, distanceFromRssi, level, movement, estimate, observe, groupPenaltyFor, vote |
| 19 | `MeshCore` | `MeshCore` | 2,158 | `registerModule('MeshCore'` | receiveHeartbeat, shouldRelay, relay, prune |
| 20 | `EthicalGateAudit` | `EthicalGateAudit` | 584 | `registerModule('EthicalGateAudit'` | note, snapshot, count |
| 21 | `BLE` | `BLE` | 10,278 | `registerModule('BLE'` | installHandler, optionsFor, start, startAdaptive, cycle, directStart, stopScanOnly, stop |
| 22 | `Acoustic` | `Acoustic` | 17,002 | `registerModule('Acoustic'` | selectBestMode, context, wakeAudio, freqToBin, configure, cleanOscillators, tone, chirp |
| 23 | `Navigator` | `Navigator` | 1,698 | `registerModule('Navigator'` | start, targetTop, bearingToTarget |
| 24 | `FlashBeacon` | `FlashBeacon` | 2,833 | `registerModule('FlashBeacon'` | isSupported, start, torch, sendMorse, next, sendSosLoop, stop |
| 25 | `VibrationBeacon` | `VibrationBeacon` | 1,304 | `registerModule('VibrationBeacon'` | isSupported, sendMorse, sendSos, stop |
| 26 | `QREncoder` | `QREncoder` | 6,086 | `registerModule('QREncoder'` | gf, mul, gen, ecc, dataCodewords, add, blank, set |
| 27 | `SOSCard` | `SOSCard` | 3,821 | `registerModule('SOSCard'` | esc, compactData, makeData, svg, dataUrl, generate, download |
| 28 | `SosStats` | `SosStats` | 1,056 | `registerModule('SosStats'` | update, recordSos, recordRescue, recordConnection, recordFalsePositive, snapshot |
| 29 | `SosQueueV6` | `SosQueueV6` | 3,343 | `registerModule('SosQueueV6'` | scoreOf, digestOf, prune, enqueue, next, flush, clear, snapshot |
| 30 | `MiniChart` | `MiniChart` | 2,354 | `registerModule('MiniChart'` | push, sample, pathFor, draw, add, start, snapshot |
| 31 | `DebugMode` | `DebugMode` | 2,475 | `registerModule('DebugMode'` | queryRequested, restore, set, toggle, isActive, snapshot, exportJson |
| 32 | `HighContrastMode` | `HighContrastMode` | 598 | `registerModule('HighContrastMode'` | apply, toggle |
| 33 | `IdleTimeout` | `IdleTimeout` | 3,105 | `registerModule('IdleTimeout'` | touch, setMinutes, idleMs, remainingMs, stopRadios, autoWipe, check, install |
| 34 | `KeyboardShortcuts` | `KeyboardShortcuts` | 1,111 | `registerModule('KeyboardShortcuts'` | install |
| 35 | `V62Panel` | `V62Panel` | 3,012 | `registerModule('V62Panel'` | renderQueue, renderDebug, renderIdle, render, bind, on |
| 36 | `V5ToV6Migration` | `V5ToV6Migration` | 897 | `registerModule('V5ToV6Migration'` | detectV5Data, migrateV5Config, cleanV5Data |
| 37 | `FieldMatrix` | `FieldMatrix` | 7,034 | `registerModule('FieldMatrix'` | record, run, addNote, list, exportJson |
| 38 | `VirtualFieldTest` | `VirtualFieldTest` | 3,807 | `registerModule('VirtualFieldTest'` | avg, std, classify, runScenario, run, status |
| 39 | `SelfTest` | `SelfTest` | 5,025 | `registerModule('SelfTest'` | run, ok |
| 40 | `PWA` | `PWA` | 810 | `registerModule('PWA'` | createManifest |
| 41 | `UI` | `UI` | 27,196 | `registerModule('UI'` | updateStatus, renderTracks, renderLog, renderModules, renderAI, renderField, renderTests, renderManual |

---

## 9. Module Deep Dive

### 10.1 `State`

**Role:** Creates the runtime state tree: node identity, BLE state, audio state, queues, tracks, logs, field tests, and operator configuration.

**Search token:** `registerModule('State'`
**Representative functions/classes:** loadStoredId, createNodeId

**Modification check:** If this module is changed, re-run self-tests and verify field-evidence and sanitized export behavior.

### 10.2 `Dom`

**Role:** Provides safe UI helpers for element lookup, text updates, SVG creation, CSS class toggling, and list item rendering.

**Search token:** `registerModule('Dom'`
**Representative functions/classes:** byId, setText, cls, clear, item, svg

**Modification check:** This module affects operator interaction. Keep user-controlled text on safe rendering paths and keep sensitive actions visible and gesture-gated.

### 10.3 `Logger`

**Role:** Maintains a bounded local event ledger and emits log update events to the UI.

**Search token:** `registerModule('Logger'`
**Representative functions/classes:** log, clear, list

**Modification check:** If this module is changed, re-run self-tests and verify field-evidence and sanitized export behavior.

### 10.4 `Ethics`

**Role:** Holds the manifest verifier, recursive sanitizer, consent-aware operation whitelist, integrity hashing, and tamper response.

**Search token:** `registerModule('Ethics'`
**Representative functions/classes:** redactString, sanitize, validateManifest, hashRefs, installIntegrity, checkIntegrity, consentOk, recordConsent, revokeConsent, operatorGestureOk, canOperate, listOperations

**Modification check:** This module touches security, privacy, evidence, transport, export, or deletion behavior. After changes, run self-tests, field-matrix checks, sanitized export review, and OP_POLICY review.

### 10.5 `NetworkGuard`

**Role:** Blocks runtime network primitives and exposes no-egress probe/status information.

**Search token:** `registerModule('NetworkGuard'`
**Representative functions/classes:** block, install, probe, status

**Modification check:** This module touches security, privacy, evidence, transport, export, or deletion behavior. After changes, run self-tests, field-matrix checks, sanitized export review, and OP_POLICY review.

### 10.6 `Storage`

**Role:** Wraps IndexedDB access, sanitizes writes, and supports pruning and deletion verification.

**Search token:** `registerModule('Storage'`
**Representative functions/classes:** open, put, all, clearStore, clearAll, deleteDatabase, verifyEmpty, prune

**Modification check:** This module touches security, privacy, evidence, transport, export, or deletion behavior. After changes, run self-tests, field-matrix checks, sanitized export review, and OP_POLICY review.

### 10.7 `Identity`

**Role:** Applies ephemeral, rotating, or stationary pseudonymous node identity modes and rotates identity/salt on demand.

**Search token:** `registerModule('Identity'`
**Representative functions/classes:** applyMode, rotate

**Modification check:** If this module is changed, re-run self-tests and verify field-evidence and sanitized export behavior.

### 10.8 `DataWiper`

**Role:** Performs best-effort deletion of browser-accessible stores, runtime maps, typed arrays, and local state.

**Search token:** `registerModule('DataWiper'`
**Representative functions/classes:** clearLocalStorage, clearSession, clearMemory, wipe, verifyAccessibleDeletion, idbProbe, installTriggers

**Modification check:** This module touches security, privacy, evidence, transport, export, or deletion behavior. After changes, run self-tests, field-matrix checks, sanitized export review, and OP_POLICY review.

### 10.9 `Watchdog`

**Role:** Runs a worker-backed liveness monitor where supported and records main-thread health.

**Search token:** `registerModule('Watchdog'`
**Representative functions/classes:** start, tick, notifyRender, check, stop, status

**Modification check:** If this module is changed, re-run self-tests and verify field-evidence and sanitized export behavior.

### 10.10 `Capability`

**Role:** Audits browser support for Bluetooth, audio, battery, wake lock, geolocation, vibration, torch, and secure context.

**Search token:** `registerModule('Capability'`
**Representative functions/classes:** audit, label

**Modification check:** If this module is changed, re-run self-tests and verify field-evidence and sanitized export behavior.

### 10.11 `Profiles`

**Role:** Defines environment profiles and RSSI distance/confidence behavior for cornfield, forest, road, urban, water, and general deployments.

**Search token:** `registerModule('Profiles'`
**Representative functions/classes:** current, apply, estimateDistance, distanceConfidence

**Modification check:** If this module is changed, re-run self-tests and verify field-evidence and sanitized export behavior.

### 10.12 `Power`

**Role:** Tracks battery/wake-lock status and adapts scan duty based on power and concern level.

**Search token:** `registerModule('Power'`
**Representative functions/classes:** start, update, requestWakeLock, scanDutyForConcern

**Modification check:** If this module is changed, re-run self-tests and verify field-evidence and sanitized export behavior.

### 10.13 `Bloom`

**Role:** Provides compact duplicate detection for messages and packet digests.

**Search token:** `registerModule('Bloom'`
**Representative functions/classes:** clear, hash, add, has

**Modification check:** If this module is changed, re-run self-tests and verify field-evidence and sanitized export behavior.

### 10.14 `Heartbeat`

**Role:** Encodes and decodes compact VitalGuard heartbeat payloads and sensor flags.

**Search token:** `registerModule('Heartbeat'`
**Representative functions/classes:** sensorFlags, encode, decode

**Modification check:** If this module is changed, re-run self-tests and verify field-evidence and sanitized export behavior.

### 10.15 `PacketCodec`

**Role:** Packs and unpacks mesh/GATT/native/acoustic packets, including TTL, chunks, and integrity markers.

**Search token:** `registerModule('PacketCodec'`
**Representative functions/classes:** pack, encode, encodeChunks, decode, absorb

**Modification check:** If this module is changed, re-run self-tests and verify field-evidence and sanitized export behavior.

### 10.16 `Trust`

**Role:** Maintains local-only node trust scores for relay and evidence weighting.

**Search token:** `registerModule('Trust'`
**Representative functions/classes:** get, average, update, clear, restore

**Modification check:** If this module is changed, re-run self-tests and verify field-evidence and sanitized export behavior.

### 10.17 `AICoder`

**Role:** Implements ten local AI-Coder engines and a rescue assessment ensemble/self-test runner.

**Search token:** `registerModule('AICoder'`
**Representative functions/classes:** finite, distance, normalize, dot, sigmoid, QLearning, UCBBandit, KNN, RLS, ThompsonSampling, GeneticAlgorithm, PSO

**Modification check:** If this module is changed, re-run self-tests and verify field-evidence and sanitized export behavior.

### 10.18 `RescueAI`

**Role:** Converts BLE observations into short-lived tracks, concern values, movement state, consensus, and estimated area.

**Search token:** `registerModule('RescueAI'`
**Representative functions/classes:** temporalRisk, distanceFromRssi, level, movement, estimate, observe, groupPenaltyFor, vote, topTrack, prune, simulate

**Modification check:** If this module is changed, re-run self-tests and verify field-evidence and sanitized export behavior.

### 10.19 `MeshCore`

**Role:** Receives heartbeats and applies managed flooding/TTL relay logic.

**Search token:** `registerModule('MeshCore'`
**Representative functions/classes:** receiveHeartbeat, shouldRelay, relay, prune

**Modification check:** If this module is changed, re-run self-tests and verify field-evidence and sanitized export behavior.

### 10.20 `EthicalGateAudit`

**Role:** Records local evidence that sensitive operations passed the intended ethical gates.

**Search token:** `registerModule('EthicalGateAudit'`
**Representative functions/classes:** note, snapshot, count

**Modification check:** If this module is changed, re-run self-tests and verify field-evidence and sanitized export behavior.

### 10.21 `BLE`

**Role:** Controls Web Bluetooth scanning, passive-scan consent, GATT connection/write/notify, native-advertiser hook, and heartbeat transmission.

**Search token:** `registerModule('BLE'`
**Representative functions/classes:** installHandler, optionsFor, start, startAdaptive, cycle, directStart, stopScanOnly, stop, extractPayloads, fingerprint, handleAdvertisement, nativeAdvertise

**Modification check:** This module touches security, privacy, evidence, transport, export, or deletion behavior. After changes, run self-tests, field-matrix checks, sanitized export review, and OP_POLICY review.

### 10.22 `Acoustic`

**Role:** Implements audio RX/TX fallback, FSK framing, Goertzel/FFT checks, CRC framing, TDMA scheduling, Morse, and bird-call mode.

**Search token:** `registerModule('Acoustic'`
**Representative functions/classes:** selectBestMode, context, wakeAudio, freqToBin, configure, cleanOscillators, tone, chirp, playSymbol, playBeacon, buildFrame, bytesToBits

**Modification check:** This module touches security, privacy, evidence, transport, export, or deletion behavior. After changes, run self-tests, field-matrix checks, sanitized export review, and OP_POLICY review.

### 10.23 `Navigator`

**Role:** Provides rescuer bearing/distance calculations and sensor start/target selection.

**Search token:** `registerModule('Navigator'`
**Representative functions/classes:** start, targetTop, bearingToTarget

**Modification check:** If this module is changed, re-run self-tests and verify field-evidence and sanitized export behavior.

### 10.24 `FlashBeacon`

**Role:** Uses explicit camera permission and ImageCapture torch, where available, to send visible Morse fallback signals.

**Search token:** `registerModule('FlashBeacon'`
**Representative functions/classes:** isSupported, start, torch, sendMorse, next, sendSosLoop, stop

**Modification check:** If this module is changed, re-run self-tests and verify field-evidence and sanitized export behavior.

### 10.25 `VibrationBeacon`

**Role:** Uses navigator.vibrate, where available, to send tactile SOS/Morse patterns.

**Search token:** `registerModule('VibrationBeacon'`
**Representative functions/classes:** isSupported, sendMorse, sendSos, stop

**Modification check:** If this module is changed, re-run self-tests and verify field-evidence and sanitized export behavior.

### 10.26 `QREncoder`

**Role:** Creates a local SVG QR Code Model 2 matrix with error correction, without canvas, CDN, or QR API.

**Search token:** `registerModule('QREncoder'`
**Representative functions/classes:** gf, mul, gen, ecc, dataCodewords, add, blank, set, finder, align, formatBits, drawFormat

**Modification check:** This module touches security, privacy, evidence, transport, export, or deletion behavior. After changes, run self-tests, field-matrix checks, sanitized export review, and OP_POLICY review.

### 10.27 `SOSCard`

**Role:** Builds a compact short-lived rescue payload and local SVG/QR card download.

**Search token:** `registerModule('SOSCard'`
**Representative functions/classes:** esc, compactData, makeData, svg, dataUrl, generate, download

**Modification check:** This module touches security, privacy, evidence, transport, export, or deletion behavior. After changes, run self-tests, field-matrix checks, sanitized export review, and OP_POLICY review.

### 10.28 `SosStats`

**Role:** Tracks session-only SOS, connection, rescue, and false-positive counters.

**Search token:** `registerModule('SosStats'`
**Representative functions/classes:** update, recordSos, recordRescue, recordConnection, recordFalsePositive, snapshot

**Modification check:** If this module is changed, re-run self-tests and verify field-evidence and sanitized export behavior.

### 10.29 `SosQueueV6`

**Role:** Maintains bounded priority queue behavior for SOS, ACK, triangulation, and status packets; keeps SOS above routine traffic.

**Search token:** `registerModule('SosQueueV6'`
**Representative functions/classes:** scoreOf, digestOf, prune, enqueue, next, flush, clear, snapshot, stats

**Modification check:** This module touches security, privacy, evidence, transport, export, or deletion behavior. After changes, run self-tests, field-matrix checks, sanitized export review, and OP_POLICY review.

### 10.30 `MiniChart`

**Role:** Draws pure SVG mini charts for concern, queue, battery, and event pressure.

**Search token:** `registerModule('MiniChart'`
**Representative functions/classes:** push, sample, pathFor, draw, add, start, snapshot

**Modification check:** If this module is changed, re-run self-tests and verify field-evidence and sanitized export behavior.

### 10.31 `DebugMode`

**Role:** Provides visibly marked sanitized local debug snapshots and exports, including URL activation through ?debug=1.

**Search token:** `registerModule('DebugMode'`
**Representative functions/classes:** queryRequested, restore, set, toggle, isActive, snapshot, exportJson

**Modification check:** This module touches security, privacy, evidence, transport, export, or deletion behavior. After changes, run self-tests, field-matrix checks, sanitized export review, and OP_POLICY review.

### 10.32 `HighContrastMode`

**Role:** Applies high-contrast styling for field visibility and accessibility.

**Search token:** `registerModule('HighContrastMode'`
**Representative functions/classes:** apply, toggle

**Modification check:** This module affects operator interaction. Keep user-controlled text on safe rendering paths and keep sensitive actions visible and gesture-gated.

### 10.33 `IdleTimeout`

**Role:** Stops radios near idle threshold and performs a 30-minute default best-effort browser-sandbox auto-wipe.

**Search token:** `registerModule('IdleTimeout'`
**Representative functions/classes:** touch, setMinutes, idleMs, remainingMs, stopRadios, autoWipe, check, install, status

**Modification check:** This module touches security, privacy, evidence, transport, export, or deletion behavior. After changes, run self-tests, field-matrix checks, sanitized export review, and OP_POLICY review.

### 10.34 `KeyboardShortcuts`

**Role:** Installs operator keyboard shortcuts for queue SOS, high contrast, debug, and emergency wipe.

**Search token:** `registerModule('KeyboardShortcuts'`
**Representative functions/classes:** install

**Modification check:** This module affects operator interaction. Keep user-controlled text on safe rendering paths and keep sensitive actions visible and gesture-gated.

### 10.35 `V62Panel`

**Role:** Renders the reinforcement panel for QR, queue, debug, idle, and compatibility status.

**Search token:** `registerModule('V62Panel'`
**Representative functions/classes:** renderQueue, renderDebug, renderIdle, render, bind, on

**Modification check:** This module affects operator interaction. Keep user-controlled text on safe rendering paths and keep sensitive actions visible and gesture-gated.

### 10.36 `V5ToV6Migration`

**Role:** Detects, migrates, or cleans older VitalGuard storage keys during transition.

**Search token:** `registerModule('V5ToV6Migration'`
**Representative functions/classes:** detectV5Data, migrateV5Config, cleanV5Data

**Modification check:** If this module is changed, re-run self-tests and verify field-evidence and sanitized export behavior.

### 10.37 `FieldMatrix`

**Role:** Records local evidence for capability, deletion, audio, visual/tactile, power, no-egress, and clean-split status.

**Search token:** `registerModule('FieldMatrix'`
**Representative functions/classes:** record, run, addNote, list, exportJson

**Modification check:** This module touches security, privacy, evidence, transport, export, or deletion behavior. After changes, run self-tests, field-matrix checks, sanitized export review, and OP_POLICY review.

### 10.38 `VirtualFieldTest`

**Role:** Runs controlled scenario records for forest, cornfield, remote-road, urban false-positive, water-adjacent, and acoustic-noise assumptions.

**Search token:** `registerModule('VirtualFieldTest'`
**Representative functions/classes:** avg, std, classify, runScenario, run, status

**Modification check:** This module touches security, privacy, evidence, transport, export, or deletion behavior. After changes, run self-tests, field-matrix checks, sanitized export review, and OP_POLICY review.

### 10.39 `SelfTest`

**Role:** Runs internal checks for manifest, sanitizer, network guard, packet codec, AI suite, QR, queue, acoustic, and virtual test registration.

**Search token:** `registerModule('SelfTest'`
**Representative functions/classes:** run, ok

**Modification check:** This module touches security, privacy, evidence, transport, export, or deletion behavior. After changes, run self-tests, field-matrix checks, sanitized export review, and OP_POLICY review.

### 10.40 `PWA`

**Role:** Creates a same-file manifest blob while disclosing that a real cache-first service worker requires a split artifact.

**Search token:** `registerModule('PWA'`
**Representative functions/classes:** createManifest

**Modification check:** If this module is changed, re-run self-tests and verify field-evidence and sanitized export behavior.

### 10.41 `UI`

**Role:** Binds controls, renders all panels, exports sanitized audit records, updates status, maps, logs, modules, AI results, and operator help.

**Search token:** `registerModule('UI'`
**Representative functions/classes:** updateStatus, renderTracks, renderLog, renderModules, renderAI, renderField, renderTests, renderManual, renderMap, renderCompass, applyBuildMode, renderStats

**Modification check:** This module affects operator interaction. Keep user-controlled text on safe rendering paths and keep sensitive actions visible and gesture-gated.

---

## 10. DOM ID Index

The artifact contains 130 DOM IDs. The groups below are intended for quick UI binding review. Some IDs can belong to more than one functional area; this index groups them by primary review use.

### 11.x Status and boot

| DOM ID | Review use |
|---|---|
| `vg6-node-id` | UI element or rendered container |
| `vg6-boot-meter` | status display |
| `vg6-boot-text` | status display |
| `vg6-audit-pill` | status display |
| `vg6-mode-dot` | configuration or operator input |
| `vg6-clock` | status display |
| `vg6-stat-mode` | configuration or operator input |
| `vg6-stat-ble` | status display |
| `vg6-stat-tracks` | status display |
| `vg6-stat-concern` | status display |
| `vg6-stat-consensus` | status display |
| `vg6-stat-outbox` | status display |
| `vg6-stat-power` | status display |
| `vg6-stat-identity` | configuration or operator input |
| `vg6-stat-integrity` | status display |
| `vg6-stat-ai` | status display |
| `vg6-stat-field` | status display |
| `vg6-stat-guard` | status display |
| `vg62-stat-queue` | status display |
| `vg62-stat-debug` | status display |
| `vg62-stat-idle` | status display |
| `vg6-capability-pill` | status display |
| `vg6-passive-pill` | status display |
| `vg6-nav-pill` | status display |
| `vg6-sos-card-status` | status display |
| `vg6-sos-stats-pill` | status display |
| `vg6-sos-stats` | status display |
| `vg6-field-pill` | status display |
| `vg6-ethics-pill` | status display |
| `vg6-test-pill` | status display |

### 11.x Configuration

| DOM ID | Review use |
|---|---|
| `vg6-build-mode` | configuration or operator input |
| `vg6-role` | configuration or operator input |
| `vg6-profile` | configuration or operator input |
| `vg6-group-id` | configuration or operator input |
| `vg6-identity-mode` | configuration or operator input |
| `vg6-sos-language` | configuration or operator input |
| `vg6-acoustic-mode` | configuration or operator input |
| `vg6-message-text` | configuration or operator input |
| `vg6-ttl` | configuration or operator input |
| `vg6-tdma-slots` | configuration or operator input |
| `vg6-measured-power` | configuration or operator input |
| `vg6-path-loss` | configuration or operator input |
| `vg62-idle-minutes` | configuration or operator input |

### 11.x Core controls

| DOM ID | Review use |
|---|---|
| `vg6-save-config` | operator control |
| `vg6-rotate-id` | operator control |
| `vg6-start-core` | operator control |
| `vg6-stop-ble` | operator control |
| `vg6-connect-gatt` | operator control |
| `vg6-send-heartbeat` | operator control |
| `vg6-run-simulation` | operator control |
| `vg6-run-tests` | operator control |
| `vg6-wipe-all` | operator control |
| `vg6-safe-mode` | configuration or operator input |

### 11.x BLE, rescue, SOS

| DOM ID | Review use |
|---|---|
| `vg6-start-protocol-scan` | operator control |
| `vg6-start-passive-scan` | operator control |
| `vg6-broadcast-sos` | operator control |
| `vg6-device-list` | rendered container |
| `vg6-sos-board` | UI element or rendered container |
| `vg6-mark-help` | operator control |
| `vg6-mark-safe` | operator control |
| `vg6-sos-cycle-toggle` | operator control |
| `vg6-fullscreen-sos` | UI element or rendered container |
| `vg6-flash-sos` | UI element or rendered container |
| `vg6-vibrate-sos` | UI element or rendered container |
| `vg6-sos-card-img` | UI element or rendered container |
| `vg6-generate-sos-card` | operator control |
| `vg6-download-sos-card` | operator control |
| `vg62-queue-sos` | UI element or rendered container |

### 11.x Acoustic, visual, tactile

| DOM ID | Review use |
|---|---|
| `vg6-play-beacon` | operator control |
| `vg6-rescuer-beacon` | UI element or rendered container |
| `vg6-audio-band` | UI element or rendered container |
| `vg6-start-audio` | operator control |
| `vg6-calibrate-audio` | UI element or rendered container |
| `vg6-send-text` | operator control |
| `vg6-send-morse` | operator control |
| `vg6-flash-pill` | status display |
| `vg6-flash-start` | operator control |
| `vg6-flash-text` | UI element or rendered container |
| `vg6-flash-stop` | operator control |
| `vg6-vibrate-text` | UI element or rendered container |

### 11.x QR, queue, debug, idle

| DOM ID | Review use |
|---|---|
| `vg62-panel` | UI element or rendered container |
| `vg62-panel-pill` | status display |
| `vg62-generate-qr` | operator control |
| `vg62-flush-queue` | UI element or rendered container |
| `vg62-toggle-debug` | operator control |
| `vg62-toggle-contrast` | operator control |
| `vg62-q-depth` | UI element or rendered container |
| `vg62-q-critical` | UI element or rendered container |
| `vg62-q-sent` | UI element or rendered container |
| `vg62-q-dropped` | UI element or rendered container |
| `vg62-mini-chart-svg` | rendered container |
| `vg62-idle-panel` | UI element or rendered container |
| `vg62-idle-pill` | status display |
| `vg62-save-idle` | operator control |
| `vg62-reset-idle` | UI element or rendered container |
| `vg62-export-debug` | operator control |
| `vg62-queue-panel` | UI element or rendered container |
| `vg62-queue-pill` | status display |
| `vg62-queue-list` | rendered container |
| `vg62-debug-panel` | UI element or rendered container |
| `vg62-debug-pill` | status display |
| `vg62-debug-list` | rendered container |

### 11.x Field evidence and tests

| DOM ID | Review use |
|---|---|
| `vg6-run-ai-suite` | operator control |
| `vg6-auto-tune` | UI element or rendered container |
| `vg6-ai-list` | rendered container |
| `vg6-field-note-input` | UI element or rendered container |
| `vg6-run-field` | operator control |
| `vg6-run-virtual-field` | operator control |
| `vg6-export-field-json` | operator control |
| `vg6-add-field-note` | UI element or rendered container |
| `vg6-field-list` | rendered container |

### 11.x Maps, navigation, logs, modules

| DOM ID | Review use |
|---|---|
| `vg6-mesh-svg` | rendered container |
| `vg6-mesh-edges` | UI element or rendered container |
| `vg6-mesh-nodes` | UI element or rendered container |
| `vg6-mesh-tracks` | UI element or rendered container |
| `vg6-compass-arrow` | UI element or rendered container |
| `vg6-nav-distance` | UI element or rendered container |
| `vg6-nav-bearing` | UI element or rendered container |
| `vg6-start-nav` | operator control |
| `vg6-module-list` | rendered container |
| `vg6-test-results` | rendered container |
| `vg6-manual-box` | rendered container |
| `vg6-log` | rendered container |

### 11.x Other UI

| DOM ID | Review use |
|---|---|
| `vg6-scoped-style` | UI element or rendered container |
| `vg6-root` | UI element or rendered container |
| `vg6-export-audit` | operator control |
| `vg6-pulse` | UI element or rendered container |
| `vg6-target-top` | UI element or rendered container |
| `vg6-contact-email` | UI element or rendered container |
| `vg6-show-email` | UI element or rendered container |

---

## 11. Review Checklist Mapping

This section lists what a reviewer should inspect. Hardware-dependent behavior must be verified on target devices.

| # | Review item | Source / code location to inspect | Validation note |
|---:|---|---|---|
| 1 | Ethical manifest | `ETHICAL_MANIFEST`, `U.deepFreeze` | Check allowed/prohibited use fields, license scope, retention fields, and safeguard list. |
| 2 | Operation gate | `registerModule('Ethics'`, `OP_POLICY`, `canOperate()` | Confirm sensitive operations are explicitly whitelisted and consent-gated where required. |
| 3 | Sanitizer | `Ethics.sanitize`, `redactString` | Confirm nested objects, arrays, risky key names, email-like strings, phone-like strings, token-like strings, and precise coordinates are handled as intended. |
| 4 | No-egress posture | CSP meta tag, `registerModule('NetworkGuard'` | Check `connect-src 'none'` and runtime blocking of fetch, XHR, WebSocket, EventSource, WebRTC constructors, and sendBeacon. |
| 5 | Local storage handling | `SafeStorage`, `registerModule('Storage'` | Confirm local preference writes use the wrapper and IndexedDB writes pass through sanitization. |
| 6 | Deletion behavior | `registerModule('DataWiper'`, `Emergency 7-Pass Wipe` control | Treat deletion as best-effort browser-sandbox deletion; verify accessible stores and runtime maps are cleared. |
| 7 | Identity behavior | `registerModule('Identity'`, `STORE_PREFIX`, node ID handling | Confirm ephemeral mode is default and stationary identity is operator-selected. |
| 8 | BLE protocol scan | `registerModule('BLE'`, `optionsFor`, `directStart` | Check service-filter scan path and user gesture behavior on supported browsers. |
| 9 | Passive BLE scan | `showPassiveConsent`, `ble:scan:passive`, `rescue:observe:passive` | Confirm accept-all scan is blocked until the consent path is completed. |
| 10 | BLE transmit limitation | `nativeAdvertise`, `writeGatt`, `sendPacket` | Confirm browser-native advertisement transmission is not represented as universally available. |
| 11 | GATT path | `connectGatt`, `subscribeGatt`, `writeGatt` | Verify peer connection, characteristic lookup, notification subscription, and write behavior on real devices. |
| 12 | Acoustic fallback | `registerModule('Acoustic'` | Verify RX/TX, frame format, CRC, TDMA, mode selection, raw-audio non-persistence, and failure handling. |
| 13 | QR/SVG SOS card | `registerModule('QREncoder'`, `registerModule('SOSCard'` | Confirm local SVG generation and absence of external QR service, canvas, iframe, embed, object, or network request. |
| 14 | Visual/tactile beacons | `FlashBeacon`, `VibrationBeacon` | Confirm explicit permission and user activation requirements. |
| 15 | Rescue assessment logic | `registerModule('RescueAI'`, `AICoder` | Treat concern values as triage evidence only, not identity, exact location, or distress certification. |
| 16 | Queue behavior | `registerModule('SosQueueV6'` | Review priority, deduplication, TTL, retries, expiry, and flush behavior. |
| 17 | Field evidence | `registerModule('FieldMatrix'`, `registerModule('VirtualFieldTest'` | Confirm evidence records are local, sanitized, and not certification claims. |
| 18 | Debug export | `registerModule('DebugMode'`, `?debug=1`, export path | Confirm debug output is visibly marked, local-only, and sanitized. |
| 19 | Idle auto-wipe | `registerModule('IdleTimeout'` | Confirm timeout, radio stop, auto-wipe path, and disclosure of browser-sandbox limits. |
| 20 | UI binding and safe rendering | `registerModule('UI'`, `Dom.setText`, DOM IDs | Confirm user-controlled text uses safe text paths and sensitive controls are visible. |

---

## 12. Security and Privacy Controls

### 12.1 Controls to inspect

- Single-file offline design with no external script or stylesheet dependency.
- CSP blocks network connection targets through `connect-src none`.
- Runtime `NetworkGuard` blocks common JavaScript egress primitives.
- Recursive sanitizer redacts risky keys and common PII-like values.
- User-controlled rendering uses text-oriented DOM paths rather than `innerHTML`.
- Passive BLE scanning is consent-gated because it is dual-use.
- Raw audio is not persisted.
- Identity defaults to ephemeral session behavior.
- Retention windows are short and explicit.
- Deletion is available through visible controls and keyboard shortcuts.

### 12.2 Review cautions

- Inline script is a deliberate trade-off for single-file offline delivery. Review XSS risk and rendering paths.
- Web Bluetooth capability differs by browser and platform.
- Browser background execution can stop even when Wake Lock is requested.
- JavaScript deletion cannot guarantee forensic erasure outside the browser sandbox.
- Acoustic delivery can fail under noise, AGC, microphone filtering, wind, rain, or mobile browser policy limits.
- Passive BLE detection can create surveillance risk if governance, signage, consent, retention, and deletion rules are removed.

---

## 13. Field Evidence Protocol

### 13.1 Minimum pre-drill procedure

1. Use a supported Android or desktop Chromium-class device for BLE scanning.
2. Open the HTML file locally.
3. Choose role, profile, group, identity mode, TTL, measured power, and path-loss exponent.
4. Press Start Core.
5. Run Self Tests.
6. Run Field Matrix.
7. Run Virtual Field Test.
8. Test BLE protocol scan with a known VitalGuard node.
9. Test passive scan only in an authorized, posted, consent-aware setting.
10. Test audio TX/RX, audio beacon, flash beacon, vibration beacon, and QR/SVG card on the target device class.
11. Export sanitized audit and field evidence JSON files.
12. Run Emergency 7-Pass Wipe before device handoff or storage.

### 13.2 Required real-world evidence fields

| Evidence area | Record this |
|---|---|
| Device | model, OS version, browser version, battery state, charging state |
| BLE | scan support, protocol scan result, passive scan consent screenshot/note, known-beacon range |
| Acoustic | speaker volume, microphone settings, distance, noise condition, RX packet counters, CRC pass/fail |
| Visual/tactile | torch support, vibration support, success/failure note |
| Power | 30-minute and 2-hour duty-cycle evidence, wake-lock status, thermal state |
| Deletion | stores populated, wipe invoked, storage checked afterward |
| No-egress | browser network panel or controlled offline test result |
| False positives | normal visitor/group/rest scenarios and observed concern values |
| Emergency scenario | stationary, erratic, water-adjacent, remote-road, and night/time-risk drills |

---

## 14. Operator Quick Start

1. Select the environment profile that matches the drill area.
2. Keep identity mode ephemeral unless the node is a posted fixed Sentinel.
3. Start Core.
4. Run Self Tests and Field Matrix.
5. Use BLE Protocol Scan for known VitalGuard nodes.
6. Use Passive BLE Scan only with authorization, signage, and the consent prompt.
7. Treat concern values as triage signals, not identity or exact-location conclusions.
8. Use the SOS board, audio beacon, flash beacon, vibration beacon, and QR/SVG card as fallback channels.
9. Export only sanitized audit/evidence records.
10. Wipe the device after drills, incidents, or custody transfer.

---

## 15. Customization Guide

| Change target | Where to modify | Required follow-up |
|---|---|---|
| Environment thresholds | `Profiles` and state config values | Recalibrate RSSI, rerun virtual and real field tests |
| New packet type | `PACKET`, `PacketCodec`, queue priority value, relay policy | Add self-test and export evidence |
| New sensitive operation | `Ethics.OP_POLICY` plus call site | Add consent/gate audit and self-test |
| New UI button | HTML ID, `UI.bind()`, render path | Check keyboard accessibility and safe rendering |
| New export field | export builder plus sanitizer | Verify no PII/raw identifiers/precise coordinates leak by default |
| New audio profile | `Acoustic` frequencies, frame, TDMA settings | Test on target devices and update acoustic limitations |
| Longer retention | `RETENTION` and field documentation | Reassess privacy, legal posture, and VECE governance |
| External integration | Do not add normal network calls inside this artifact | Use a separate reviewed gateway/native wrapper |

---

## 16. Known Issues and Release-Readiness Notes

### 16.1 Minor cleanup before public release

- Confirm whether shake-trigger deletion is actually implemented or only described in UI/manifest language. If not implemented, remove that claim or add the trigger.
- Consider renaming `SosQueueV6` or documenting it consistently as a compatibility name, because the visible panel says `SosQueueV7 Priority Queue`.
- Add a small table of tested browser/device versions after real field validation.
- For broad deployment, split a production PWA/native wrapper artifact rather than claiming single-file service-worker certainty.

### 16.2 Non-negotiable claim limits

- Do not claim guaranteed rescue.
- Do not claim exact location from RSSI.
- Do not claim universal iOS mesh-node support.
- Do not claim browser-native BLE advertisement TX unless a verified native bridge or hardware beacon is present.
- Do not claim forensic deletion beyond browser-accessible state.
- Do not claim acoustic delivery certification without measured evidence.

---

## 17. Troubleshooting

| Symptom | Likely cause | Action |
|---|---|---|
| BLE scan button fails | Unsupported browser, insecure context, permission denial, missing user gesture | Use supported Android/desktop Chromium, check permissions, start from explicit button press |
| Passive scan blocked | Consent not accepted or OP_POLICY gate triggered | Read consent text, confirm authorized deployment, retry through UI |
| No audio TX/RX | AudioContext suspended, microphone permission denied, device filtering, noisy environment | Press audio start/calibrate button, reduce distance, lower noise, use audible mode first |
| QR card not shown | QR generation failed or image update delayed | Run QR self-test, generate again, verify local SVG data URL |
| Field Matrix has manual-required entries | Uptime/power evidence not long enough or unsupported capability | Continue runtime or record unsupported capability honestly |
| Debug export seems sparse | Debug mode disabled or sanitized by design | Enable `?debug=1` or Ctrl+Shift+D; do not expect raw identifiers |
| Wipe cannot prove forensic erase | Browser/OS/flash internals are outside JS control | Treat wipe as best-effort and use dedicated devices/encrypted OS storage for high-risk work |
| Concern value seems high in crowds | Dense group/device behavior or profile thresholds | Adjust profile, use FieldMatrix/VirtualFieldTest, and record false-positive drills |

---

## 18. Public Diagnostic API

The artifact exposes a small diagnostic alias for reviewer use:

```javascript
window.VitalGuardClosedBeta17TestV7.runSelfTests()
window.VitalGuardClosedBeta17TestV7.runFieldMatrix()
window.VitalGuardClosedBeta17TestV7.runVirtualFieldTest()
window.VitalGuardClosedBeta17TestV7.status()
window.VitalGuardClosedBeta171TestV71.status()
```

The status object includes version, display version, test version, guard status, watchdog status, registered modules, field-test count, virtual field status, queue statistics, QR self-test result, acoustic self-test result, and gate count.

---

## 19. Recommended Final Release Checklist

- Remove unintended old 1.7.0/V7.0 labels while preserving historical changelog context.
- Confirm all self-tests pass in at least one supported browser.
- Confirm no external resource load in a network panel.
- Confirm passive BLE consent modal appears before accept-all scan.
- Confirm sanitized audit export contains no raw MAC-like identifiers, phone-like strings, emails, raw audio, or precise coordinates by default.
- Confirm field-evidence export records unsupported capabilities honestly.
- Confirm emergency wipe clears browser-accessible storage and rotates identity.
- Confirm QR/SVG card generation works offline.
- Confirm acoustic RX/TX behavior at short distance and in at least one noise scenario.
- Confirm battery and wake-lock notes are recorded for the target device class.
- Prepare a separate native wrapper or split PWA if background BLE or real BLE advertisement TX is required.

---

## 20. Reviewer-Facing Description

> VitalGuard Bluetooth Swarm + Ultrasonic Mesh Closed Beta 1.7.2 (Test V7.2) is a single-file, zero-dependency, local-only BLE proximity and fallback communication prototype for humanitarian continuity scenarios. It uses scoped UI, an embedded ethical manifest, recursive sanitization, runtime no-egress blocking, short-lived passive observations, local concern-value calculation, field evidence records, and browser capability disclosures. It is not a certified rescue device, not a medical device, not a law-enforcement system, not a guaranteed detection or delivery product, and not a substitute for trained search-and-rescue procedures.

---

## 21. Appendix — Extracted Constants and Structural Facts

| Constant | Value |
|---|---|
| `APP_VERSION` | `'1.7.2-cbt'` |
| `TEST_VERSION` | `'V7.2'` |
| `APP_DISPLAY_VERSION` | `'Closed Beta 1.7.2 (Test V7.2)'` |
| `SERVICE_UUID` | `'7d6b7001-5654-414c-4755-415244563730'` |
| `CHARACTERISTIC_UUID` | `'7d6b7002-5654-414c-4755-415244563730'` |
| `MAGIC` | `0x5647` |
| `VERSION_BYTE` | `7` |
| `STORE_PREFIX` | `'vg7_cbt_'` |
| `DB_NAME` | `'VitalGuard_CBT_1_7_1_Test_V7_1_LocalOnly_DB'` |
| `MAX_LOG` | `360` |
| `MAX_TRACKS` | `700` |
| `DEFAULT_TTL` | `7` |

### Structural scan results

| Check | Result |
|---|---|
| `prompt()` calls | 0 |
| `alert()` calls | 0 |
| `eval()` calls | 0 |
| `new Function` | absent |
| `innerHTML` usage | 0 |
| Direct `localStorage.setItem` usage | 0 |

---

End of English manual.

---

End of V2.0 neutral auditor manual.
