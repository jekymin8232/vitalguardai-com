# VitalGuard Bluetooth Swarm + Ultrasonic Mesh — Code Manual / Code Map

**Target artifact:** `Bluetooth_Swarm_Ultrasonic_Mesh_singlefile_V1_7_1.html`  
**Build identity:** Closed Beta 1.7.1 / Test V7.1  
**Purpose:** 보안 감사, 코드 탐색, 커스터마이징, 현장 테스트 재현을 위한 단일 MD 통합 매뉴얼  
**Prepared for:** Morgan J. (Gyu-min Jeon) / M-Corp Ethical AI  
**Date:** 2026-05-12 KST  

---

## Document Control

| Field | Value |
|---|---|
| Document title | Bluetooth Swarm Ultrasonic Mesh Code Manual / Code Map |
| Artifact | `Bluetooth_Swarm_Ultrasonic_Mesh_singlefile_V1_7_1.html` |
| Prior artifact | `Bluetooth_Swarm_Ultrasonic_Mesh_singlefile_V1_7.html` |
| Version transition | Closed Beta 1.7.0 / Test V7.0 → Closed Beta 1.7.1 / Test V7.1 |
| License context | © 2026 Morgan J. (Gyu-min Jeon) \| M-Corp Ethical AI; M-Corp Ethical AI License, Hippocratic 3.0 derivative |
| Distribution model | Single-file offline HTML; inline scoped CSS; inline vanilla JavaScript; no external dependency |
| Manual scope | Code map + audit partner manual + customization guide + virtual field-test record |
| Important caveat | 이 문서는 하드웨어 인증서가 아니다. 실제 BLE, microphone, speaker, torch, vibration, battery, field-range 검증은 별도 실기기 evidence가 필요하다. |

---

## 1. Executive Summary

`Bluetooth_Swarm_Ultrasonic_Mesh_singlefile_V1_7_1.html`은 VitalGuard Bluetooth Swarm + Ultrasonic Mesh의 Closed Beta 1.7.1, Test V7.1 단일 파일 빌드다. 이 빌드는 재난·수색·구조·농업·오프그리드 환경에서 네트워크가 끊겨도 근접 탐지, SOS 질의, 메시지 릴레이, acoustic fallback, visual/tactile beacon, QR rescue card, local audit evidence를 유지하기 위한 humanitarian continuity prototype이다.

이 매뉴얼은 일반 사용자 설명서가 아니라 감사자와 수정 작업자를 위한 코드 지도다. 파일을 열었을 때 어느 모듈이 어떤 역할을 하는지, 어떤 검색어로 빠르게 이동해야 하는지, 어떤 설정값을 건드려야 하는지, 어떤 부분은 절대 건드리면 안 되는지, 그리고 V1.7.1에서 어떤 보강이 들어갔는지를 한 문서에 모았다.

V1.7.1의 핵심 변경은 네 가지다. 첫째, artifact identity를 1.7.1/Test V7.1로 정리했다. 둘째, `VirtualFieldTest` 모듈을 추가해 가상의 forest, cornfield, remote-road, urban false-positive, water-adjacent, acoustic-noise 시나리오를 반복 가능한 evidence record로 남기도록 했다. 셋째, Field Evidence note에서 browser-native prompt dialog를 제거하고 inline sanitized note 입력으로 바꿨다. 넷째, public diagnostic alias에 virtual field status와 runner를 추가했다.

이 빌드는 코드 구조 면에서 강하다. CSP `connect-src 'none'`, runtime NetworkGuard, scoped CSS, recursive sanitizer, frozen ethical manifest, operation-specific consent gate, best-effort deletion, short-retention fingerprints, QR/SVG-only local SOS card, no canvas chart, no CDN, no external scripts를 유지한다. 다만 이 강점은 브라우저 환경 안에서의 보안·무의존성을 뜻할 뿐, 실제 BLE range, iOS behavior, microphone demodulation, camera torch, battery endurance를 보증하지 않는다.

---

## 2. Artifact Identification

| Item | Value |
|---|---:|
| File size | 246,711 bytes (240.93 KiB) |
| Line count | 1,763 lines |
| Inline CSS size | 14,224 bytes |
| Inline JS size | 189,391 bytes |
| SHA-256 | `e335df0598ef9f41926580af978692dce615e954a761e63890a050d7bd7ce054` |
| Registered modules | 41 modules |
| DOM IDs | 130 IDs |

정적 확인 결과, HTML 내부에 외부 script tag, external stylesheet link, iframe, embed, object, canvas element는 없다. `fetch`, `XMLHttpRequest`, `WebSocket`, `sendBeacon` 문자열은 런타임 차단기와 no-egress probe를 구현하기 위해 존재하며, 외부 호출용 dependency가 아니다. SVG namespace 때문에 `http://www.w3.org/2000/svg` 문자열은 존재하지만 원격 요청이 아니다.

---

## 3. 빠른 감사 방법

감사자는 먼저 다음 순서로 보면 된다.

1. 파일 상단 comment block에서 license, purpose, operational limit, V1.7.1 changelog를 확인한다.
2. `<meta http-equiv="Content-Security-Policy">`에서 `connect-src 'none'`, `object-src 'none'`, `base-uri 'none'`, `form-action 'none'`을 확인한다.
3. `Ctrl+F`로 `var ETHICAL_MANIFEST`를 찾아 copyright, license scope, prohibited use list가 frozen 상태인지 확인한다.
4. `Ctrl+F`로 `registerModule('NetworkGuard'`를 찾아 network primitive 차단을 확인한다.
5. `Ctrl+F`로 `registerModule('Ethics'`를 찾아 `OP_POLICY`와 `canOperate()`가 민감 operation을 gating하는지 확인한다.
6. `Ctrl+F`로 `registerModule('BLE'`를 찾아 passive scan이 consent gate 뒤에 있는지 확인한다.
7. `Ctrl+F`로 `registerModule('Acoustic'`를 찾아 raw audio가 저장되지 않고 Goertzel/FFT/CRC/TDMA가 evidence 중심으로 구현되어 있는지 확인한다.
8. `Ctrl+F`로 `registerModule('FieldMatrix'`와 `registerModule('VirtualFieldTest'`를 확인한다.
9. UI에서 `Run Self Tests`, `Run Field Matrix`, `Run Virtual Field Test`, `Export Sanitized Audit`을 순서대로 실행한다.
10. 실제 배포 전에는 Android/desktop Chromium BLE scan, audio TX/RX, flash/vibration, 30분/2시간 battery duty test를 별도 evidence로 남긴다.

이 코드는 단일 파일 구조이므로 line number는 편집 과정에서 쉽게 바뀐다. 이 매뉴얼은 line number보다 module banner와 search token을 기준으로 한다.

---

## 4. File Anatomy

파일은 크게 네 덩어리로 구성된다.

| Layer | Search hint | Responsibility |
|---|---|---|
| Top operational comments | `VITALGUARD CLOSED BETA` | 목적, 라이선스, 변경 이력, 한계, runbook |
| Head metadata | `<meta http-equiv="Content-Security-Policy"` | CSP, Permissions-Policy, title, license meta |
| Scoped CSS | `<style id="vg6-scoped-style">` | `#vg6-root` 아래 UI styling, high contrast, charts, QR panel |
| Body UI | `<div id="vg6-root">` | hero, status, controls, passive detection, SOS board, mesh map, acoustic fallback, field evidence, self tests |
| Script module system | `registerModule` | 모든 state, security, BLE, acoustic, UI logic |

중요한 설계 원칙은 CSS와 JS가 모두 한 파일 안에 있지만 외부 namespace 오염을 줄이도록 설계되어 있다는 점이다. CSS는 `#vg6-root` 아래로 scoped 되어 있고, JavaScript는 IIFE 안에서 `registerModule`로 모듈을 등록한다. public exposure는 `window.VitalGuardV7`, `window.VitalGuardClosedBeta17TestV7`, `window.VitalGuardClosedBeta171TestV71`로 제한된다.

---

## 5. Version 1.7.1 / Test V7.1 Change Summary

| Change | Why it matters | Audit status |
|---|---|---|
| Artifact identity update | 파일 title, UI, APP_VERSION, TEST_VERSION, public status가 V1.7.1/Test V7.1을 표시한다. | Done |
| `VirtualFieldTest` module | 실제 하드웨어 없이도 위험 assumptions를 반복 가능한 가상 evidence로 기록한다. | Done |
| Field note prompt removal | manual evidence workflow에서 native prompt dialog를 제거하고 inline sanitized note 입력으로 전환했다. | Done |
| OP policy expansion | `field:record`, `field:virtual` operation gate를 추가했다. | Done |
| UI button addition | `Run Virtual Field Test` 버튼을 Field Evidence Matrix에 추가했다. | Done |
| Public diagnostic alias | V7.1 alias와 `runVirtualFieldTest()`를 제공한다. | Done |
| Self-test hook | virtual field suite registration self-test를 추가했다. | Done |

주의: V7 acoustic protocol 이름(`audible_v7`, `near_us_v7`, `birdcall_v7`)은 backward compatibility와 기존 evidence continuity를 위해 유지된다. Test maturity label만 V7.1이다.

---

## 6. Core Execution Flow

### 6.1 Boot Flow

Boot sequence는 `boot()`에서 시작한다. 순서는 다음과 같다.

1. `NetworkGuard.install()`로 no-egress runtime guard를 설치한다.
2. `Watchdog.start()`로 liveness monitoring을 시작한다. worker가 지원되지 않으면 limitation 상태를 기록한다.
3. `Capability.audit()`로 browser capability matrix를 작성한다.
4. `DebugMode.restore()`, `HighContrastMode.apply()`, `IdleTimeout.install()`, `KeyboardShortcuts.install()`를 실행한다.
5. `MiniChart.start()`로 SVG chart sampling을 시작한다.
6. `Ethics.installIntegrity([...])`로 core function integrity hash를 설치한다.
7. `UI.bind()`, `V62Panel.bind()`로 이벤트 핸들러를 연결한다.
8. `UI.renderAll()`로 최초 렌더링을 수행한다.
9. boot meter와 boot text에 readiness status를 표시한다.

Boot flow에서 주의할 점은 UI가 먼저 렌더링된다고 해서 BLE나 microphone이 자동으로 켜지지 않는다는 점이다. BLE scan, passive scan, microphone RX, camera torch, vibration, QR download는 모두 버튼 기반 operator action 뒤에 실행된다.

### 6.2 BLE Scan Flow

BLE flow는 `BLE.start(mode)`에서 시작한다. protocol scan은 VitalGuard service UUID filter를 쓰고, passive scan은 `acceptAllAdvertisements: true`를 사용할 수 있지만 반드시 `Ethics.canOperate('ble:scan:passive')`와 passive scan consent를 통과해야 한다. 광고 수신은 `handleAdvertisement(event)`로 들어오며, 여기서 payload extraction, fingerprinting, RescueAI observation, heartbeat decode, MeshCore relay가 분기된다.

BLE TX에 대한 표현은 보수적이어야 한다. 이 파일은 browser-native BLE advertisement transmit이 일반적으로 불안정하거나 불가능하다고 명시한다. 실제 TX는 native bridge, GATT peer write, fixed external beacon hardware, acoustic fallback로 분리된다.

### 6.3 Rescue Scoring Flow

RSSI observation은 `RescueAI.observe()`로 들어간다. 이 함수는 profile prior, stationary duration, RSSI jitter, signal loss, group penalty, temporal risk, consensus vote 등을 조합해 concern score와 level을 만든다. `RescueAI.topTrack()`은 UI status, navigation target, SOS prioritization에서 사용된다.

중요: concern score는 구조 자동 판정이 아니다. 현장 operator가 참고하는 triage signal이다. 사람이 실제 수색 절차, 시야 확인, 음성 호출, 공식 rescue protocol을 함께 사용해야 한다.

### 6.4 Acoustic Flow

Acoustic flow는 `Acoustic.wakeAudio()`, `Acoustic.startRx()`, `Acoustic.sendText()`, `Acoustic.sendMorse()`, `Acoustic.playBeacon()`으로 나뉜다. Test V7 protocol은 Goertzel demodulation, FFT-bin cross-check, preamble lock, bounded frame, CRC-16, TDMA slot scheduling, audible/near-ultrasonic/bird-call modes를 포함한다.

Acoustic은 iOS Safari와 microphone policy 때문에 실제 환경에서 가장 많이 흔들리는 부분이다. 이 매뉴얼의 field test section에 따라 반드시 short-range, wind/rain/noise, crowd, indoor echo, speaker volume, microphone AGC 조건을 나눠 기록해야 한다.

### 6.5 Evidence and Export Flow

Evidence는 세 종류다. `SelfTest`는 코드 구조 sanity check, `FieldMatrix`는 실제/수동 hardware evidence record, `VirtualFieldTest`는 V1.7.1 가상 scenario record다. Export는 `Export Sanitized Audit` 또는 `Export Field Evidence JSON`을 통해 local download blob으로만 생성된다. 외부 서버 전송은 없다.

---

## 7. Module Directory

아래 표는 모든 `registerModule` 기준 코드 지도다. `Ctrl+F`로 Search token을 찾으면 해당 모듈 시작점으로 이동한다.

| # | Module | Variable | Approx. bytes | Search token | Key functions |
|---:|---|---|---:|---|---|
| 1 | `State` | `State` | 2,506 | `registerModule('State'` | createNodeId, loadStoredId |
| 2 | `Dom` | `Dom` | 1,233 | `registerModule('Dom'` | byId, clear, cls, item, setText, svg |
| 3 | `Logger` | `Logger` | 608 | `registerModule('Logger'` | clear, list, log |
| 4 | `Ethics` | `Ethics` | 6,088 | `registerModule('Ethics'` | canOperate, checkIntegrity, consentOk, hashRefs, installIntegrity, listOperations, operatorGestureOk, policySnapshot, … |
| 5 | `NetworkGuard` | `NetworkGuard` | 2,402 | `registerModule('NetworkGuard'` | block, install, probe, status |
| 6 | `Storage` | `Storage` | 2,805 | `registerModule('Storage'` | all, clearAll, clearStore, deleteDatabase, open, prune, put, verifyEmpty |
| 7 | `Identity` | `Identity` | 1,224 | `registerModule('Identity'` | applyMode, rotate |
| 8 | `DataWiper` | `DataWiper` | 5,031 | `registerModule('DataWiper'` | clearLocalStorage, clearMemory, clearSession, idbProbe, installTriggers, verifyAccessibleDeletion, wipe |
| 9 | `Watchdog` | `Watchdog` | 3,275 | `registerModule('Watchdog'` | check, notifyRender, start, status, stop, tick |
| 10 | `Capability` | `Capability` | 1,276 | `registerModule('Capability'` | audit, label |
| 11 | `Profiles` | `Profiles` | 2,736 | `registerModule('Profiles'` | apply, current, distanceConfidence, estimateDistance |
| 12 | `Power` | `Power` | 1,399 | `registerModule('Power'` | requestWakeLock, scanDutyForConcern, start, update |
| 13 | `Bloom` | `Bloom` | 592 | `registerModule('Bloom'` | add, clear, has, hash |
| 14 | `Heartbeat` | `Heartbeat` | 1,958 | `registerModule('Heartbeat'` | decode, encode, sensorFlags |
| 15 | `PacketCodec` | `PacketCodec` | 3,119 | `registerModule('PacketCodec'` | absorb, decode, encode, encodeChunks, pack |
| 16 | `Trust` | `Trust` | 1,662 | `registerModule('Trust'` | average, clear, get, restore, update |
| 17 | `AICoder` | `AICoder` | 13,411 | `registerModule('AICoder'` | BayesianOptimization, GeneticAlgorithm, IsolationForest, KNN, PSO, QLearning, RLS, SimulatedAnnealing, … |
| 18 | `RescueAI` | `RescueAI` | 4,703 | `registerModule('RescueAI'` | distanceFromRssi, estimate, groupPenaltyFor, level, movement, observe, prune, simulate, … |
| 19 | `MeshCore` | `MeshCore` | 2,158 | `registerModule('MeshCore'` | prune, receiveHeartbeat, relay, shouldRelay |
| 20 | `EthicalGateAudit` | `EthicalGateAudit` | 584 | `registerModule('EthicalGateAudit'` | count, note, snapshot |
| 21 | `BLE` | `BLE` | 10,278 | `registerModule('BLE'` | connectGatt, cycle, directStart, extractPayloads, fingerprint, handleAdvertisement, installHandler, nativeAdvertise, … |
| 22 | `Acoustic` | `Acoustic` | 17,000 | `registerModule('Acoustic'` | autoCalibrate, bitsToBytes, buildFrame, bytesToBits, calibrate, chirp, cleanOscillators, configure, … |
| 23 | `Navigator` | `Navigator` | 1,698 | `registerModule('Navigator'` | bearingToTarget, start, targetTop |
| 24 | `FlashBeacon` | `FlashBeacon` | 2,833 | `registerModule('FlashBeacon'` | isSupported, next, sendMorse, sendSosLoop, start, stop, torch |
| 25 | `VibrationBeacon` | `VibrationBeacon` | 1,304 | `registerModule('VibrationBeacon'` | isSupported, sendMorse, sendSos, stop |
| 26 | `QREncoder` | `QREncoder` | 6,086 | `registerModule('QREncoder'` | add, align, bit, blank, dataCodewords, dataUrl, drawFormat, ecc, … |
| 27 | `SOSCard` | `SOSCard` | 3,717 | `registerModule('SOSCard'` | compactData, dataUrl, download, esc, generate, makeData, svg |
| 28 | `SosStats` | `SosStats` | 1,056 | `registerModule('SosStats'` | recordConnection, recordFalsePositive, recordRescue, recordSos, snapshot, update |
| 29 | `SosQueueV6` | `SosQueueV6` | 3,343 | `registerModule('SosQueueV6'` | clear, digestOf, enqueue, flush, next, prune, scoreOf, snapshot, … |
| 30 | `MiniChart` | `MiniChart` | 2,354 | `registerModule('MiniChart'` | add, draw, pathFor, push, sample, snapshot, start |
| 31 | `DebugMode` | `DebugMode` | 2,475 | `registerModule('DebugMode'` | exportJson, isActive, queryRequested, restore, set, snapshot, toggle |
| 32 | `HighContrastMode` | `HighContrastMode` | 598 | `registerModule('HighContrastMode'` | apply, toggle |
| 33 | `IdleTimeout` | `IdleTimeout` | 3,105 | `registerModule('IdleTimeout'` | autoWipe, check, idleMs, install, remainingMs, setMinutes, status, stopRadios, … |
| 34 | `KeyboardShortcuts` | `KeyboardShortcuts` | 1,111 | `registerModule('KeyboardShortcuts'` | install |
| 35 | `V62Panel` | `V62Panel` | 3,012 | `registerModule('V62Panel'` | bind, on, render, renderDebug, renderIdle, renderQueue |
| 36 | `V5ToV6Migration` | `V5ToV6Migration` | 897 | `registerModule('V5ToV6Migration'` | cleanV5Data, detectV5Data, migrateV5Config |
| 37 | `FieldMatrix` | `FieldMatrix` | 7,033 | `registerModule('FieldMatrix'` | addNote, exportJson, list, record, run |
| 38 | `VirtualFieldTest` | `VirtualFieldTest` | 3,807 | `registerModule('VirtualFieldTest'` | avg, classify, run, runScenario, status, std |
| 39 | `SelfTest` | `SelfTest` | 5,025 | `registerModule('SelfTest'` | ok, run |
| 40 | `PWA` | `PWA` | 810 | `registerModule('PWA'` | createManifest |
| 41 | `UI` | `UI` | 26,192 | `registerModule('UI'` | applyBuildMode, bind, boot, broadcastSos, exportAudit, largeSosDisplay, refreshSosCard, renderAI, … |

---

## 8. Module Deep Dive

### 8.1 `State`

**역할:** 런타임 상태의 초기값, ephemeral node ID, 로컬 구성값, BLE/오디오/큐/테스트 상태를 만든다.

**감사/수정 포인트:** 커스터마이징 시 가장 먼저 확인할 곳은 `RETENTION`, `DEFAULT_TTL`, `APP_VERSION`, `STORE_PREFIX`, 그리고 `State`의 state shape이다.

**Search token:** `registerModule('State'`

**Key functions:** `createNodeId`, `loadStoredId`

**주의사항:** 이 모듈을 수정한 뒤에는 `Run Self Tests`, `Run Field Matrix`, 관련 UI 버튼, sanitized export를 함께 확인한다. 모듈이 BLE, acoustic, storage, wipe, debug, export, QR, passive scan 중 하나라도 건드리면 `Ethics.canOperate()`와 `OP_POLICY` 연결을 확인해야 한다.

### 8.2 `Dom`

**역할:** DOM 접근, textContent 갱신, SVG 생성, 리스트 아이템 생성 등 UI가 반복적으로 쓰는 작은 helper 모음이다.

**감사/수정 포인트:** 보안상 사용자 입력을 `innerHTML`에 직접 넣지 않도록 `Dom.item`, `Dom.setText`, `Dom.clear` 흐름을 유지한다.

**Search token:** `registerModule('Dom'`

**Key functions:** `byId`, `clear`, `cls`, `item`, `setText`, `svg`

**주의사항:** 이 모듈을 수정한 뒤에는 `Run Self Tests`, `Run Field Matrix`, 관련 UI 버튼, sanitized export를 함께 확인한다. 모듈이 BLE, acoustic, storage, wipe, debug, export, QR, passive scan 중 하나라도 건드리면 `Ethics.canOperate()`와 `OP_POLICY` 연결을 확인해야 한다.

### 8.3 `Logger`

**역할:** 로컬 로그 ledger를 관리하고 `SwarmBus`에 로그 이벤트를 흘린다.

**감사/수정 포인트:** 현장 로그는 감사 자료이지만 민감한 raw payload가 들어가지 않도록 `Ethics.sanitize`된 데이터만 보내는 습관을 유지한다.

**Search token:** `registerModule('Logger'`

**Key functions:** `clear`, `list`, `log`

**주의사항:** 이 모듈을 수정한 뒤에는 `Run Self Tests`, `Run Field Matrix`, 관련 UI 버튼, sanitized export를 함께 확인한다. 모듈이 BLE, acoustic, storage, wipe, debug, export, QR, passive scan 중 하나라도 건드리면 `Ethics.canOperate()`와 `OP_POLICY` 연결을 확인해야 한다.

### 8.4 `Ethics`

**역할:** ETHICAL_MANIFEST 검증, recursive sanitizer, operation whitelist, consent gate, integrity timer를 담당한다.

**감사/수정 포인트:** 새 기능을 추가하면 반드시 `OP_POLICY`에 목적 기반 operation key를 추가하고 민감 경로에서 `Ethics.canOperate()`를 호출한다.

**Search token:** `registerModule('Ethics'`

**Key functions:** `canOperate`, `checkIntegrity`, `consentOk`, `hashRefs`, `installIntegrity`, `listOperations`, `operatorGestureOk`, `policySnapshot`, `recordConsent`, `redactString`, `revokeConsent`, `sanitize`, `tamperResponse`, `validateManifest`

**주의사항:** 이 모듈을 수정한 뒤에는 `Run Self Tests`, `Run Field Matrix`, 관련 UI 버튼, sanitized export를 함께 확인한다. 모듈이 BLE, acoustic, storage, wipe, debug, export, QR, passive scan 중 하나라도 건드리면 `Ethics.canOperate()`와 `OP_POLICY` 연결을 확인해야 한다.

### 8.5 `NetworkGuard`

**역할:** fetch, XHR, WebSocket, EventSource, WebRTC, sendBeacon를 런타임에서 차단한다.

**감사/수정 포인트:** 외부 네트워크가 필요한 기능을 넣지 않는다. 테스트 probe는 차단 여부를 확인하기 위한 내부 호출이다.

**Search token:** `registerModule('NetworkGuard'`

**Key functions:** `block`, `install`, `probe`, `status`

**주의사항:** 이 모듈을 수정한 뒤에는 `Run Self Tests`, `Run Field Matrix`, 관련 UI 버튼, sanitized export를 함께 확인한다. 모듈이 BLE, acoustic, storage, wipe, debug, export, QR, passive scan 중 하나라도 건드리면 `Ethics.canOperate()`와 `OP_POLICY` 연결을 확인해야 한다.

### 8.6 `Storage`

**역할:** IndexedDB object store와 local persistence gateway이다. 저장 전 sanitize를 거친다.

**감사/수정 포인트:** 새 store를 추가하면 `stores` 배열, export sanitizer, wipe verification에 함께 반영한다.

**Search token:** `registerModule('Storage'`

**Key functions:** `all`, `clearAll`, `clearStore`, `deleteDatabase`, `open`, `prune`, `put`, `verifyEmpty`

**주의사항:** 이 모듈을 수정한 뒤에는 `Run Self Tests`, `Run Field Matrix`, 관련 UI 버튼, sanitized export를 함께 확인한다. 모듈이 BLE, acoustic, storage, wipe, debug, export, QR, passive scan 중 하나라도 건드리면 `Ethics.canOperate()`와 `OP_POLICY` 연결을 확인해야 한다.

### 8.7 `Identity`

**역할:** ephemeral/rotating/stationary identity mode를 적용하고 node ID를 회전한다.

**감사/수정 포인트:** stationary ID는 게시·고지된 Sentinel에만 사용해야 하며 기본값은 ephemeral이다.

**Search token:** `registerModule('Identity'`

**Key functions:** `applyMode`, `rotate`

**주의사항:** 이 모듈을 수정한 뒤에는 `Run Self Tests`, `Run Field Matrix`, 관련 UI 버튼, sanitized export를 함께 확인한다. 모듈이 BLE, acoustic, storage, wipe, debug, export, QR, passive scan 중 하나라도 건드리면 `Ethics.canOperate()`와 `OP_POLICY` 연결을 확인해야 한다.

### 8.8 `DataWiper`

**역할:** localStorage, sessionStorage, IndexedDB, runtime maps, typed arrays, timers 등을 best-effort로 삭제한다.

**감사/수정 포인트:** JavaScript 삭제는 forensic erase가 아니다. 매뉴얼과 UI에 이 한계를 계속 노출한다.

**Search token:** `registerModule('DataWiper'`

**Key functions:** `clearLocalStorage`, `clearMemory`, `clearSession`, `idbProbe`, `installTriggers`, `verifyAccessibleDeletion`, `wipe`

**주의사항:** 이 모듈을 수정한 뒤에는 `Run Self Tests`, `Run Field Matrix`, 관련 UI 버튼, sanitized export를 함께 확인한다. 모듈이 BLE, acoustic, storage, wipe, debug, export, QR, passive scan 중 하나라도 건드리면 `Ethics.canOperate()`와 `OP_POLICY` 연결을 확인해야 한다.

### 8.9 `Watchdog`

**역할:** Blob worker 기반 liveness watchdog와 render-age/memory-growth 감시를 담당한다.

**감사/수정 포인트:** worker가 막힌 브라우저에서는 limitation disclosed 상태로 통과하도록 설계되어 있다.

**Search token:** `registerModule('Watchdog'`

**Key functions:** `check`, `notifyRender`, `start`, `status`, `stop`, `tick`

**주의사항:** 이 모듈을 수정한 뒤에는 `Run Self Tests`, `Run Field Matrix`, 관련 UI 버튼, sanitized export를 함께 확인한다. 모듈이 BLE, acoustic, storage, wipe, debug, export, QR, passive scan 중 하나라도 건드리면 `Ethics.canOperate()`와 `OP_POLICY` 연결을 확인해야 한다.

### 8.10 `Capability`

**역할:** 브라우저 capability matrix를 생성한다. BLE, Audio, vibration, torch, wake lock 등을 점검한다.

**감사/수정 포인트:** 현장 테스트 보고서에는 capability 결과와 실제 하드웨어 모델을 함께 기록한다.

**Search token:** `registerModule('Capability'`

**Key functions:** `audit`, `label`

**주의사항:** 이 모듈을 수정한 뒤에는 `Run Self Tests`, `Run Field Matrix`, 관련 UI 버튼, sanitized export를 함께 확인한다. 모듈이 BLE, acoustic, storage, wipe, debug, export, QR, passive scan 중 하나라도 건드리면 `Ethics.canOperate()`와 `OP_POLICY` 연결을 확인해야 한다.

### 8.11 `Profiles`

**역할:** cornfield, forest, remoteRoad, urban, water, general 환경별 path-loss와 risk prior를 제공한다.

**감사/수정 포인트:** 가장 많이 수정될 부분이다. 현장 calibration 결과에 따라 measuredPower/pathLoss/humidityFactor를 조정한다.

**Search token:** `registerModule('Profiles'`

**Key functions:** `apply`, `current`, `distanceConfidence`, `estimateDistance`

**주의사항:** 이 모듈을 수정한 뒤에는 `Run Self Tests`, `Run Field Matrix`, 관련 UI 버튼, sanitized export를 함께 확인한다. 모듈이 BLE, acoustic, storage, wipe, debug, export, QR, passive scan 중 하나라도 건드리면 `Ethics.canOperate()`와 `OP_POLICY` 연결을 확인해야 한다.

### 8.12 `Power`

**역할:** battery label, scan duty, wake lock 요청, concern 기반 duty profile을 관리한다.

**감사/수정 포인트:** Sentinel 장기 운용은 외부 전원·열관리·화면 유지 정책을 같이 설계해야 한다.

**Search token:** `registerModule('Power'`

**Key functions:** `requestWakeLock`, `scanDutyForConcern`, `start`, `update`

**주의사항:** 이 모듈을 수정한 뒤에는 `Run Self Tests`, `Run Field Matrix`, 관련 UI 버튼, sanitized export를 함께 확인한다. 모듈이 BLE, acoustic, storage, wipe, debug, export, QR, passive scan 중 하나라도 건드리면 `Ethics.canOperate()`와 `OP_POLICY` 연결을 확인해야 한다.

### 8.13 `Bloom`

**역할:** 중복 메시지/packet digest 감지용 lightweight Bloom-like buffer이다.

**감사/수정 포인트:** relay storm을 줄이는 데 쓰며, mission-critical hash 보안 기능으로 과장하지 않는다.

**Search token:** `registerModule('Bloom'`

**Key functions:** `add`, `clear`, `has`, `hash`

**주의사항:** 이 모듈을 수정한 뒤에는 `Run Self Tests`, `Run Field Matrix`, 관련 UI 버튼, sanitized export를 함께 확인한다. 모듈이 BLE, acoustic, storage, wipe, debug, export, QR, passive scan 중 하나라도 건드리면 `Ethics.canOperate()`와 `OP_POLICY` 연결을 확인해야 한다.

### 8.14 `Heartbeat`

**역할:** compact heartbeat payload encode/decode와 sensor flags를 관리한다.

**감사/수정 포인트:** BLE legacy advertisement budget을 고려해 payload 확장을 매우 보수적으로 한다.

**Search token:** `registerModule('Heartbeat'`

**Key functions:** `decode`, `encode`, `sensorFlags`

**주의사항:** 이 모듈을 수정한 뒤에는 `Run Self Tests`, `Run Field Matrix`, 관련 UI 버튼, sanitized export를 함께 확인한다. 모듈이 BLE, acoustic, storage, wipe, debug, export, QR, passive scan 중 하나라도 건드리면 `Ethics.canOperate()`와 `OP_POLICY` 연결을 확인해야 한다.

### 8.15 `PacketCodec`

**역할:** mesh packet encode/decode, chunking, digest, TTL, CRC-like integrity marker를 담당한다.

**감사/수정 포인트:** 새 packet type은 `PACKET` constant, queue priority, relay policy, self-test에 함께 반영한다.

**Search token:** `registerModule('PacketCodec'`

**Key functions:** `absorb`, `decode`, `encode`, `encodeChunks`, `pack`

**주의사항:** 이 모듈을 수정한 뒤에는 `Run Self Tests`, `Run Field Matrix`, 관련 UI 버튼, sanitized export를 함께 확인한다. 모듈이 BLE, acoustic, storage, wipe, debug, export, QR, passive scan 중 하나라도 건드리면 `Ethics.canOperate()`와 `OP_POLICY` 연결을 확인해야 한다.

### 8.16 `Trust`

**역할:** node trust score를 local-only로 관리한다.

**감사/수정 포인트:** trust는 구조 네트워크 품질 신호이지 사람/기기 identity profiling이 아니다.

**Search token:** `registerModule('Trust'`

**Key functions:** `average`, `clear`, `get`, `restore`, `update`

**주의사항:** 이 모듈을 수정한 뒤에는 `Run Self Tests`, `Run Field Matrix`, 관련 UI 버튼, sanitized export를 함께 확인한다. 모듈이 BLE, acoustic, storage, wipe, debug, export, QR, passive scan 중 하나라도 건드리면 `Ethics.canOperate()`와 `OP_POLICY` 연결을 확인해야 한다.

### 8.17 `AICoder`

**역할:** 10개 local AI-Coder 알고리즘과 self-test/auto-tune을 포함한다.

**감사/수정 포인트:** 모든 알고리즘은 lightweight local scorer이며 certified rescue automation으로 주장하지 않는다.

**Search token:** `registerModule('AICoder'`

**Key functions:** `BayesianOptimization`, `GeneticAlgorithm`, `IsolationForest`, `KNN`, `PSO`, `QLearning`, `RLS`, `SimulatedAnnealing`, `ThompsonSampling`, `Track`, `UCBBandit`, `assess`, `autoTune`, `distance`, `dot`, `features`, `finite`, `normalize`, …

**주의사항:** 이 모듈을 수정한 뒤에는 `Run Self Tests`, `Run Field Matrix`, 관련 UI 버튼, sanitized export를 함께 확인한다. 모듈이 BLE, acoustic, storage, wipe, debug, export, QR, passive scan 중 하나라도 건드리면 `Ethics.canOperate()`와 `OP_POLICY` 연결을 확인해야 한다.

### 8.18 `RescueAI`

**역할:** RSSI observation, distress concern score, movement/temporal risk, topTrack, simulation을 담당한다.

**감사/수정 포인트:** 실제 구조 판단이 아니라 conservative triage signal이다. false positive/negative를 모두 기록한다.

**Search token:** `registerModule('RescueAI'`

**Key functions:** `distanceFromRssi`, `estimate`, `groupPenaltyFor`, `level`, `movement`, `observe`, `prune`, `simulate`, `temporalRisk`, `topTrack`, `vote`

**주의사항:** 이 모듈을 수정한 뒤에는 `Run Self Tests`, `Run Field Matrix`, 관련 UI 버튼, sanitized export를 함께 확인한다. 모듈이 BLE, acoustic, storage, wipe, debug, export, QR, passive scan 중 하나라도 건드리면 `Ethics.canOperate()`와 `OP_POLICY` 연결을 확인해야 한다.

### 8.19 `MeshCore`

**역할:** heartbeat reception, managed flooding relay decision, TTL pruning을 담당한다.

**감사/수정 포인트:** PANIC은 우선 relay하지만 TTL과 deduplication을 유지해야 broadcast storm을 막는다.

**Search token:** `registerModule('MeshCore'`

**Key functions:** `prune`, `receiveHeartbeat`, `relay`, `shouldRelay`

**주의사항:** 이 모듈을 수정한 뒤에는 `Run Self Tests`, `Run Field Matrix`, 관련 UI 버튼, sanitized export를 함께 확인한다. 모듈이 BLE, acoustic, storage, wipe, debug, export, QR, passive scan 중 하나라도 건드리면 `Ethics.canOperate()`와 `OP_POLICY` 연결을 확인해야 한다.

### 8.20 `EthicalGateAudit`

**역할:** 민감 operation의 gate 통과 기록을 local audit row로 남긴다.

**감사/수정 포인트:** audit row도 sanitize해야 하며 external transfer는 금지된다.

**Search token:** `registerModule('EthicalGateAudit'`

**Key functions:** `count`, `note`, `snapshot`

**주의사항:** 이 모듈을 수정한 뒤에는 `Run Self Tests`, `Run Field Matrix`, 관련 UI 버튼, sanitized export를 함께 확인한다. 모듈이 BLE, acoustic, storage, wipe, debug, export, QR, passive scan 중 하나라도 건드리면 `Ethics.canOperate()`와 `OP_POLICY` 연결을 확인해야 한다.

### 8.21 `BLE`

**역할:** Web Bluetooth scan, passive consent, GATT connect/write/notify, native bridge hook, advertisement handler를 담당한다.

**감사/수정 포인트:** acceptAllAdvertisements는 passive scan에서만 consent gate 뒤에 사용한다. browser-native BLE TX는 과장하지 않는다.

**Search token:** `registerModule('BLE'`

**Key functions:** `connectGatt`, `cycle`, `directStart`, `extractPayloads`, `fingerprint`, `handleAdvertisement`, `installHandler`, `nativeAdvertise`, `optionsFor`, `sendHeartbeat`, `sendPacket`, `start`, `startAdaptive`, `stop`, `stopScanOnly`, `subscribeGatt`, `writeGatt`

**주의사항:** 이 모듈을 수정한 뒤에는 `Run Self Tests`, `Run Field Matrix`, 관련 UI 버튼, sanitized export를 함께 확인한다. 모듈이 BLE, acoustic, storage, wipe, debug, export, QR, passive scan 중 하나라도 건드리면 `Ethics.canOperate()`와 `OP_POLICY` 연결을 확인해야 한다.

### 8.22 `Acoustic`

**역할:** AudioContext, FSK frame, Goertzel/FFT demodulation, TDMA slot, Morse, bird-call profile, RX evidence를 담당한다.

**감사/수정 포인트:** raw audio를 저장하지 않는다. microphone/AGC/소음/브라우저 정책에 따라 실패할 수 있음을 기록한다.

**Search token:** `registerModule('Acoustic'`

**Key functions:** `autoCalibrate`, `bitsToBytes`, `buildFrame`, `bytesToBits`, `calibrate`, `chirp`, `cleanOscillators`, `configure`, `context`, `finishFrame`, `freqToBin`, `goertzel`, `maxAround`, `nextSlotDelay`, `parseFrame`, `playBeacon`, `playSymbol`, `processFrame`, …

**주의사항:** 이 모듈을 수정한 뒤에는 `Run Self Tests`, `Run Field Matrix`, 관련 UI 버튼, sanitized export를 함께 확인한다. 모듈이 BLE, acoustic, storage, wipe, debug, export, QR, passive scan 중 하나라도 건드리면 `Ethics.canOperate()`와 `OP_POLICY` 연결을 확인해야 한다.

### 8.23 `Navigator`

**역할:** rescuer compass, bearing/distance calculation, sensor start, top concern targeting을 담당한다.

**감사/수정 포인트:** GPS·compass 신뢰도가 낮은 환경에서 보조 지표로만 사용한다.

**Search token:** `registerModule('Navigator'`

**Key functions:** `bearingToTarget`, `start`, `targetTop`

**주의사항:** 이 모듈을 수정한 뒤에는 `Run Self Tests`, `Run Field Matrix`, 관련 UI 버튼, sanitized export를 함께 확인한다. 모듈이 BLE, acoustic, storage, wipe, debug, export, QR, passive scan 중 하나라도 건드리면 `Ethics.canOperate()`와 `OP_POLICY` 연결을 확인해야 한다.

### 8.24 `FlashBeacon`

**역할:** ImageCapture torch 기반 flash Morse beacon을 담당한다.

**감사/수정 포인트:** 카메라/torch는 반드시 operator action 이후에만 활성화한다.

**Search token:** `registerModule('FlashBeacon'`

**Key functions:** `isSupported`, `next`, `sendMorse`, `sendSosLoop`, `start`, `stop`, `torch`

**주의사항:** 이 모듈을 수정한 뒤에는 `Run Self Tests`, `Run Field Matrix`, 관련 UI 버튼, sanitized export를 함께 확인한다. 모듈이 BLE, acoustic, storage, wipe, debug, export, QR, passive scan 중 하나라도 건드리면 `Ethics.canOperate()`와 `OP_POLICY` 연결을 확인해야 한다.

### 8.25 `VibrationBeacon`

**역할:** navigator.vibrate 기반 tactile Morse/SOS fallback이다.

**감사/수정 포인트:** 지원되지 않는 기기에서는 graceful unsupported 상태로 끝나야 한다.

**Search token:** `registerModule('VibrationBeacon'`

**Key functions:** `isSupported`, `sendMorse`, `sendSos`, `stop`

**주의사항:** 이 모듈을 수정한 뒤에는 `Run Self Tests`, `Run Field Matrix`, 관련 UI 버튼, sanitized export를 함께 확인한다. 모듈이 BLE, acoustic, storage, wipe, debug, export, QR, passive scan 중 하나라도 건드리면 `Ethics.canOperate()`와 `OP_POLICY` 연결을 확인해야 한다.

### 8.26 `QREncoder`

**역할:** single-file QR Code Model 2 SVG encoder와 ECC self-test를 담당한다.

**감사/수정 포인트:** 외부 QR API, canvas, iframe, CDN을 쓰지 않는다.

**Search token:** `registerModule('QREncoder'`

**Key functions:** `add`, `align`, `bit`, `blank`, `dataCodewords`, `dataUrl`, `drawFormat`, `ecc`, `encode`, `finder`, `formatBits`, `functions`, `gen`, `gf`, `mask`, `mul`, `penalty`, `place`, …

**주의사항:** 이 모듈을 수정한 뒤에는 `Run Self Tests`, `Run Field Matrix`, 관련 UI 버튼, sanitized export를 함께 확인한다. 모듈이 BLE, acoustic, storage, wipe, debug, export, QR, passive scan 중 하나라도 건드리면 `Ethics.canOperate()`와 `OP_POLICY` 연결을 확인해야 한다.

### 8.27 `SOSCard`

**역할:** compact local rescue payload, QR/SVG data URL, download flow를 담당한다.

**감사/수정 포인트:** payload는 short-lived이며 permanent personal identifier를 넣지 않는다.

**Search token:** `registerModule('SOSCard'`

**Key functions:** `compactData`, `dataUrl`, `download`, `esc`, `generate`, `makeData`, `svg`

**주의사항:** 이 모듈을 수정한 뒤에는 `Run Self Tests`, `Run Field Matrix`, 관련 UI 버튼, sanitized export를 함께 확인한다. 모듈이 BLE, acoustic, storage, wipe, debug, export, QR, passive scan 중 하나라도 건드리면 `Ethics.canOperate()`와 `OP_POLICY` 연결을 확인해야 한다.

### 8.28 `SosStats`

**역할:** session-only SOS/connection/rescue/false-positive counter를 관리한다.

**감사/수정 포인트:** 정량 지표는 field evidence로 유용하지만 인증 지표로 오해하지 않게 설명한다.

**Search token:** `registerModule('SosStats'`

**Key functions:** `recordConnection`, `recordFalsePositive`, `recordRescue`, `recordSos`, `snapshot`, `update`

**주의사항:** 이 모듈을 수정한 뒤에는 `Run Self Tests`, `Run Field Matrix`, 관련 UI 버튼, sanitized export를 함께 확인한다. 모듈이 BLE, acoustic, storage, wipe, debug, export, QR, passive scan 중 하나라도 건드리면 `Ethics.canOperate()`와 `OP_POLICY` 연결을 확인해야 한다.

### 8.29 `SosQueueV6`

**역할:** bounded priority queue, dedup, expiry, retry cap, SOS 우선순위를 관리한다.

**감사/수정 포인트:** routine traffic이 SOS를 밀어내지 않도록 scoreOf 정책을 유지한다.

**Search token:** `registerModule('SosQueueV6'`

**Key functions:** `clear`, `digestOf`, `enqueue`, `flush`, `next`, `prune`, `scoreOf`, `snapshot`, `stats`

**주의사항:** 이 모듈을 수정한 뒤에는 `Run Self Tests`, `Run Field Matrix`, 관련 UI 버튼, sanitized export를 함께 확인한다. 모듈이 BLE, acoustic, storage, wipe, debug, export, QR, passive scan 중 하나라도 건드리면 `Ethics.canOperate()`와 `OP_POLICY` 연결을 확인해야 한다.

### 8.30 `MiniChart`

**역할:** pure SVG chart로 concern/queue/battery/event pressure를 표시한다.

**감사/수정 포인트:** canvas나 chart library를 추가하지 않는다.

**Search token:** `registerModule('MiniChart'`

**Key functions:** `add`, `draw`, `pathFor`, `push`, `sample`, `snapshot`, `start`

**주의사항:** 이 모듈을 수정한 뒤에는 `Run Self Tests`, `Run Field Matrix`, 관련 UI 버튼, sanitized export를 함께 확인한다. 모듈이 BLE, acoustic, storage, wipe, debug, export, QR, passive scan 중 하나라도 건드리면 `Ethics.canOperate()`와 `OP_POLICY` 연결을 확인해야 한다.

### 8.31 `DebugMode`

**역할:** `?debug=1` local debug mode, sanitized snapshot/export를 담당한다.

**감사/수정 포인트:** debug는 operator-visible이며 secret/covert channel이 아니다.

**Search token:** `registerModule('DebugMode'`

**Key functions:** `exportJson`, `isActive`, `queryRequested`, `restore`, `set`, `snapshot`, `toggle`

**주의사항:** 이 모듈을 수정한 뒤에는 `Run Self Tests`, `Run Field Matrix`, 관련 UI 버튼, sanitized export를 함께 확인한다. 모듈이 BLE, acoustic, storage, wipe, debug, export, QR, passive scan 중 하나라도 건드리면 `Ethics.canOperate()`와 `OP_POLICY` 연결을 확인해야 한다.

### 8.32 `HighContrastMode`

**역할:** high-contrast UI toggle을 적용한다.

**감사/수정 포인트:** 접근성 기능은 현장 야간/저시력 상황에서 중요하다.

**Search token:** `registerModule('HighContrastMode'`

**Key functions:** `apply`, `toggle`

**주의사항:** 이 모듈을 수정한 뒤에는 `Run Self Tests`, `Run Field Matrix`, 관련 UI 버튼, sanitized export를 함께 확인한다. 모듈이 BLE, acoustic, storage, wipe, debug, export, QR, passive scan 중 하나라도 건드리면 `Ethics.canOperate()`와 `OP_POLICY` 연결을 확인해야 한다.

### 8.33 `IdleTimeout`

**역할:** 30분 기본 idle best-effort auto-wipe, radio stop, identity rotation을 담당한다.

**감사/수정 포인트:** auto-wipe는 browser-accessible state에 한정된다는 한계를 유지한다.

**Search token:** `registerModule('IdleTimeout'`

**Key functions:** `autoWipe`, `check`, `idleMs`, `install`, `remainingMs`, `setMinutes`, `status`, `stopRadios`, `touch`

**주의사항:** 이 모듈을 수정한 뒤에는 `Run Self Tests`, `Run Field Matrix`, 관련 UI 버튼, sanitized export를 함께 확인한다. 모듈이 BLE, acoustic, storage, wipe, debug, export, QR, passive scan 중 하나라도 건드리면 `Ethics.canOperate()`와 `OP_POLICY` 연결을 확인해야 한다.

### 8.34 `KeyboardShortcuts`

**역할:** Ctrl+Shift+Delete 3회 wipe 등 emergency shortcut을 설치한다.

**감사/수정 포인트:** 오작동을 줄이기 위해 count threshold와 로그를 유지한다.

**Search token:** `registerModule('KeyboardShortcuts'`

**Key functions:** `install`

**주의사항:** 이 모듈을 수정한 뒤에는 `Run Self Tests`, `Run Field Matrix`, 관련 UI 버튼, sanitized export를 함께 확인한다. 모듈이 BLE, acoustic, storage, wipe, debug, export, QR, passive scan 중 하나라도 건드리면 `Ethics.canOperate()`와 `OP_POLICY` 연결을 확인해야 한다.

### 8.35 `V62Panel`

**역할:** QR/queue/debug/idle reinforcement panel 렌더링과 버튼 binding을 담당한다.

**감사/수정 포인트:** V7.1에서도 module name은 backward compatibility 때문에 유지된다.

**Search token:** `registerModule('V62Panel'`

**Key functions:** `bind`, `on`, `render`, `renderDebug`, `renderIdle`, `renderQueue`

**주의사항:** 이 모듈을 수정한 뒤에는 `Run Self Tests`, `Run Field Matrix`, 관련 UI 버튼, sanitized export를 함께 확인한다. 모듈이 BLE, acoustic, storage, wipe, debug, export, QR, passive scan 중 하나라도 건드리면 `Ethics.canOperate()`와 `OP_POLICY` 연결을 확인해야 한다.

### 8.36 `V5ToV6Migration`

**역할:** V5 storage key 탐지와 cleanup/migration helper를 제공한다.

**감사/수정 포인트:** 이행 시 과거 데이터가 새 버전 claim에 섞이지 않도록 cleanup evidence를 남긴다.

**Search token:** `registerModule('V5ToV6Migration'`

**Key functions:** `cleanV5Data`, `detectV5Data`, `migrateV5Config`

**주의사항:** 이 모듈을 수정한 뒤에는 `Run Self Tests`, `Run Field Matrix`, 관련 UI 버튼, sanitized export를 함께 확인한다. 모듈이 BLE, acoustic, storage, wipe, debug, export, QR, passive scan 중 하나라도 건드리면 `Ethics.canOperate()`와 `OP_POLICY` 연결을 확인해야 한다.

### 8.37 `FieldMatrix`

**역할:** BLE, no-egress, deletion, audio fallback, visual/tactile, power, clean split evidence를 기록한다.

**감사/수정 포인트:** V1.7.1에서 prompt 제거 및 inline note 입력이 적용되었다.

**Search token:** `registerModule('FieldMatrix'`

**Key functions:** `addNote`, `exportJson`, `list`, `record`, `run`

**주의사항:** 이 모듈을 수정한 뒤에는 `Run Self Tests`, `Run Field Matrix`, 관련 UI 버튼, sanitized export를 함께 확인한다. 모듈이 BLE, acoustic, storage, wipe, debug, export, QR, passive scan 중 하나라도 건드리면 `Ethics.canOperate()`와 `OP_POLICY` 연결을 확인해야 한다.

### 8.38 `VirtualFieldTest`

**역할:** V1.7.1 신규. forest/cornfield/remote-road/urban/water/acoustic-noise 가상 scenario evidence를 기록한다.

**감사/수정 포인트:** 가상 현장 테스트는 하드웨어 인증이 아니며 real field matrix와 함께 사용한다.

**Search token:** `registerModule('VirtualFieldTest'`

**Key functions:** `avg`, `classify`, `run`, `runScenario`, `status`, `std`

**주의사항:** 이 모듈을 수정한 뒤에는 `Run Self Tests`, `Run Field Matrix`, 관련 UI 버튼, sanitized export를 함께 확인한다. 모듈이 BLE, acoustic, storage, wipe, debug, export, QR, passive scan 중 하나라도 건드리면 `Ethics.canOperate()`와 `OP_POLICY` 연결을 확인해야 한다.

### 8.39 `SelfTest`

**역할:** 코드 내부 self-test runner이다. manifest, sanitizer, network guard, packet codec, AI suite, QR, queue, acoustic, virtual field suite 등을 확인한다.

**감사/수정 포인트:** 버튼 실행 후 fail 항목이 있으면 먼저 수정하고 audit export를 생성한다.

**Search token:** `registerModule('SelfTest'`

**Key functions:** `ok`, `run`

**주의사항:** 이 모듈을 수정한 뒤에는 `Run Self Tests`, `Run Field Matrix`, 관련 UI 버튼, sanitized export를 함께 확인한다. 모듈이 BLE, acoustic, storage, wipe, debug, export, QR, passive scan 중 하나라도 건드리면 `Ethics.canOperate()`와 `OP_POLICY` 연결을 확인해야 한다.

### 8.40 `PWA`

**역할:** single-file manifest blob을 만든다.

**감사/수정 포인트:** 실제 cache-first PWA는 분리된 service worker가 필요하므로 단일 파일 claim과 혼동하지 않는다.

**Search token:** `registerModule('PWA'`

**Key functions:** `createManifest`

**주의사항:** 이 모듈을 수정한 뒤에는 `Run Self Tests`, `Run Field Matrix`, 관련 UI 버튼, sanitized export를 함께 확인한다. 모듈이 BLE, acoustic, storage, wipe, debug, export, QR, passive scan 중 하나라도 건드리면 `Ethics.canOperate()`와 `OP_POLICY` 연결을 확인해야 한다.

### 8.41 `UI`

**역할:** 모든 panel render/bind, status, map, log, manual, field/test list, SOS board, export flow를 담당한다.

**감사/수정 포인트:** 새 DOM ID를 추가하면 `UI.bind`, `render*`, self-test, manual에 함께 연결한다.

**Search token:** `registerModule('UI'`

**Key functions:** `applyBuildMode`, `bind`, `boot`, `broadcastSos`, `exportAudit`, `largeSosDisplay`, `refreshSosCard`, `renderAI`, `renderAll`, `renderCompass`, `renderField`, `renderLog`, `renderManual`, `renderMap`, `renderModules`, `renderStats`, `renderTests`, `renderTracks`, …

**주의사항:** 이 모듈을 수정한 뒤에는 `Run Self Tests`, `Run Field Matrix`, 관련 UI 버튼, sanitized export를 함께 확인한다. 모듈이 BLE, acoustic, storage, wipe, debug, export, QR, passive scan 중 하나라도 건드리면 `Ethics.canOperate()`와 `OP_POLICY` 연결을 확인해야 한다.

---

## 9. DOM ID Index

DOM ID는 UI binding과 render path의 핵심이다. 새 UI를 추가하면 ID를 추가하는 것만으로 끝나지 않는다. `UI.bind()`, `render*()`, self-test, FieldMatrix evidence, manual text까지 같이 확인해야 한다.

### 9.x Acoustic / visual / tactile fallback

| ID | Primary use |
|---|---|
| `vg6-acoustic-mode` | Configuration selector |
| `vg6-audio-band` | UI element |
| `vg6-calibrate-audio` | UI element |
| `vg6-flash-pill` | Status display |
| `vg6-flash-start` | UI element |
| `vg6-flash-stop` | UI element |
| `vg6-flash-text` | Operator input |
| `vg6-play-beacon` | UI element |
| `vg6-rescuer-beacon` | UI element |
| `vg6-send-morse` | UI element |
| `vg6-start-audio` | UI element |
| `vg6-vibrate-text` | Operator input |

### 9.x Field evidence / self-test / manual

| ID | Primary use |
|---|---|
| `vg6-add-field-note` | Operator input |
| `vg6-export-field-json` | UI element |
| `vg6-field-list` | Rendered container |
| `vg6-field-note-input` | Operator input |
| `vg6-field-pill` | Status display |
| `vg6-manual-box` | Rendered container |
| `vg6-run-field` | UI element |
| `vg6-run-tests` | UI element |
| `vg6-run-virtual-field` | UI element |
| `vg6-stat-field` | Status display |
| `vg6-test-pill` | Status display |
| `vg6-test-results` | UI element |

### 9.x General UI

| ID | Primary use |
|---|---|
| `vg6-ai-list` | Rendered container |
| `vg6-audit-pill` | Status display |
| `vg6-auto-tune` | UI element |
| `vg6-capability-pill` | Status display |
| `vg6-contact-email` | UI element |
| `vg6-device-list` | Rendered container |
| `vg6-ethics-pill` | Status display |
| `vg6-export-audit` | UI element |
| `vg6-log` | Rendered container |
| `vg6-mark-help` | UI element |
| `vg6-mark-safe` | UI element |
| `vg6-message-text` | Operator input |
| `vg6-module-list` | Rendered container |
| `vg6-node-id` | UI element |
| `vg6-passive-pill` | Status display |
| `vg6-pulse` | UI element |
| `vg6-root` | UI element |
| `vg6-rotate-id` | UI element |
| `vg6-run-ai-suite` | UI element |
| `vg6-run-simulation` | UI element |
| `vg6-save-config` | UI element |
| `vg6-scoped-style` | UI element |
| `vg6-send-text` | Operator input |
| `vg6-show-email` | UI element |
| `vg6-start-core` | UI element |
| `vg6-tdma-slots` | UI element |
| `vg6-wipe-all` | UI element |

### 9.x Status / telemetry display

| ID | Primary use |
|---|---|
| `vg6-boot-meter` | Status display |
| `vg6-boot-text` | Operator input |
| `vg6-build-mode` | Configuration selector |
| `vg6-clock` | Status display |
| `vg6-identity-mode` | Configuration selector |
| `vg6-measured-power` | UI element |
| `vg6-mode-dot` | Configuration selector |
| `vg6-safe-mode` | Configuration selector |
| `vg6-stat-ai` | Status display |
| `vg6-stat-concern` | Status display |
| `vg6-stat-consensus` | Status display |
| `vg6-stat-guard` | Status display |
| `vg6-stat-identity` | Status display |
| `vg6-stat-integrity` | Status display |
| `vg6-stat-mode` | Status display |
| `vg6-stat-outbox` | Rendered container |
| `vg6-stat-power` | Status display |
| `vg6-stat-tracks` | Status display |

### 9.x SOS / QR / emergency display

| ID | Primary use |
|---|---|
| `vg6-broadcast-sos` | UI element |
| `vg6-download-sos-card` | UI element |
| `vg6-flash-sos` | UI element |
| `vg6-fullscreen-sos` | UI element |
| `vg6-generate-sos-card` | UI element |
| `vg6-sos-board` | UI element |
| `vg6-sos-card-img` | UI element |
| `vg6-sos-card-status` | Status display |
| `vg6-sos-cycle-toggle` | UI element |
| `vg6-sos-language` | Configuration selector |
| `vg6-sos-stats` | Status display |
| `vg6-sos-stats-pill` | Status display |
| `vg6-vibrate-sos` | UI element |

### 9.x Map / navigation

| ID | Primary use |
|---|---|
| `vg6-compass-arrow` | UI element |
| `vg6-mesh-edges` | UI element |
| `vg6-mesh-nodes` | UI element |
| `vg6-mesh-svg` | UI element |
| `vg6-mesh-tracks` | UI element |
| `vg6-nav-bearing` | UI element |
| `vg6-nav-distance` | UI element |
| `vg6-nav-pill` | Status display |
| `vg6-start-nav` | UI element |
| `vg6-target-top` | UI element |

### 9.x BLE / mesh transport

| ID | Primary use |
|---|---|
| `vg6-connect-gatt` | UI element |
| `vg6-send-heartbeat` | UI element |
| `vg6-start-passive-scan` | UI element |
| `vg6-start-protocol-scan` | UI element |
| `vg6-stat-ble` | Status display |
| `vg6-stop-ble` | UI element |

### 9.x Configuration

| ID | Primary use |
|---|---|
| `vg6-group-id` | UI element |
| `vg6-path-loss` | UI element |
| `vg6-profile` | Configuration selector |
| `vg6-role` | Configuration selector |
| `vg6-ttl` | UI element |

### 9.x V7 reinforcement / queue / debug / idle

| ID | Primary use |
|---|---|
| `vg62-debug-list` | V7 reinforcement panel, queue/debug/idle control, or metric display |
| `vg62-debug-panel` | V7 reinforcement panel, queue/debug/idle control, or metric display |
| `vg62-debug-pill` | V7 reinforcement panel, queue/debug/idle control, or metric display |
| `vg62-export-debug` | V7 reinforcement panel, queue/debug/idle control, or metric display |
| `vg62-flush-queue` | V7 reinforcement panel, queue/debug/idle control, or metric display |
| `vg62-generate-qr` | V7 reinforcement panel, queue/debug/idle control, or metric display |
| `vg62-idle-minutes` | V7 reinforcement panel, queue/debug/idle control, or metric display |
| `vg62-idle-panel` | V7 reinforcement panel, queue/debug/idle control, or metric display |
| `vg62-idle-pill` | V7 reinforcement panel, queue/debug/idle control, or metric display |
| `vg62-mini-chart-svg` | V7 reinforcement panel, queue/debug/idle control, or metric display |
| `vg62-panel` | V7 reinforcement panel, queue/debug/idle control, or metric display |
| `vg62-panel-pill` | V7 reinforcement panel, queue/debug/idle control, or metric display |
| `vg62-q-critical` | V7 reinforcement panel, queue/debug/idle control, or metric display |
| `vg62-q-depth` | V7 reinforcement panel, queue/debug/idle control, or metric display |
| `vg62-q-dropped` | V7 reinforcement panel, queue/debug/idle control, or metric display |
| `vg62-q-sent` | V7 reinforcement panel, queue/debug/idle control, or metric display |
| `vg62-queue-list` | V7 reinforcement panel, queue/debug/idle control, or metric display |
| `vg62-queue-panel` | V7 reinforcement panel, queue/debug/idle control, or metric display |
| `vg62-queue-pill` | V7 reinforcement panel, queue/debug/idle control, or metric display |
| `vg62-queue-sos` | V7 reinforcement panel, queue/debug/idle control, or metric display |
| `vg62-reset-idle` | V7 reinforcement panel, queue/debug/idle control, or metric display |
| `vg62-save-idle` | V7 reinforcement panel, queue/debug/idle control, or metric display |
| `vg62-stat-debug` | V7 reinforcement panel, queue/debug/idle control, or metric display |
| `vg62-stat-idle` | V7 reinforcement panel, queue/debug/idle control, or metric display |
| `vg62-stat-queue` | V7 reinforcement panel, queue/debug/idle control, or metric display |
| `vg62-toggle-contrast` | V7 reinforcement panel, queue/debug/idle control, or metric display |
| `vg62-toggle-debug` | V7 reinforcement panel, queue/debug/idle control, or metric display |

---

## 10. Data Model and Storage

### 10.1 Runtime State

`VG6.state`는 브라우저 세션 안의 중심 상태 객체다. 주요 하위 영역은 다음과 같다.

| State area | Meaning | Customization note |
|---|---|---|
| `nodeId` / `identityMode` | ephemeral/rotating/stationary node identity | default는 ephemeral이어야 한다. |
| `ble` | scan mode, scan starts, passive consent, last errors, GATT state | passive scan은 consent 후에만 실행한다. |
| `audio` | AudioContext state, TX/RX counters, CRC pass/fail, last message | raw audio persistence를 추가하지 않는다. |
| `tracks` | passive/rescue observation track map | retention과 sanitizer를 유지한다. |
| `nodes` | mesh node map | stationary Sentinel 좌표는 posted deployment에서만 쓴다. |
| `outbox` | local mesh packet queue | SOS priority와 TTL을 유지한다. |
| `fieldTests` | FieldMatrix/VirtualFieldTest evidence records | export는 sanitized JSON만 허용한다. |
| `testResults` | SelfTest result list | 실패 시 release하지 않는다. |
| `consent` | passiveScan/operator action consent records | consent scope와 timestamp를 기록한다. |

### 10.2 IndexedDB Stores

`Storage` 모듈의 `stores` 배열은 다음 object store를 만든다: `nodes`, `alerts`, `messages`, `config`, `trust`, `patterns`, `audit`, `field_tests`, `capability_logs`. 저장은 `Storage.put()`을 통해야 하고, 저장 전 `Ethics.sanitize()`가 적용된다.

새 저장소를 추가할 때는 다음 네 곳을 함께 점검한다: store creation, export payload, DataWiper clearing, FieldMatrix evidence. 직접 `localStorage.someKey = value` 형태는 정적 감사에서 불리하므로 `SafeStorage` gateway를 사용한다.

### 10.3 Retention Model

| Data type | Intended retention | Rationale |
|---|---:|---|
| Raw RSSI memory | short-lived, 60 seconds class | 구조에 필요한 즉시 신호만 유지 |
| Passive fingerprint | 30 minutes class | persistent tracking 위험 축소 |
| Audit / field evidence | bounded local records with expiry | reviewer evidence 목적 |
| Debug export | operator-visible, sanitized only | secret channel 금지 |
| QR SOS payload | compact, short-lived | permanent identifier 금지 |

Retention을 늘리면 구조 성능이 약간 좋아질 수 있지만 감시 위험이 커진다. 이 프로젝트의 철학은 구조 기능보다 감시 저항을 우선한다.

---

## 11. Security Architecture

### 11.1 CSP and Runtime Guard

CSP는 `connect-src 'none'`로 모든 outbound connection을 브라우저 레벨에서 막는다. `NetworkGuard`는 런타임에서 `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`, `RTCPeerConnection`, `webkitRTCPeerConnection`, `navigator.sendBeacon`를 차단한다. 이중 방어 구조이므로 hosting layer가 실수로 외부 script를 삽입하더라도 전송 경로가 막힌다.

단, CSP가 `unsafe-inline`을 허용하는 것은 단일 파일 architecture 때문이다. 따라서 보상 통제로 no dynamic code execution, no external src, no eval, no new Function, no external import, `connect-src none`를 함께 유지해야 한다.

### 11.2 Sanitizer

`Ethics.sanitize()`는 nested object, arrays, circular references, dangerous keys, email-like strings, phone-like strings, token-like values, coordinate precision을 처리한다. 새 export나 debug view를 만들면 반드시 이 sanitizer를 통과해야 한다.

### 11.3 Operation Policy

`OP_POLICY`는 민감 기능의 whitelist다. 예를 들어 passive BLE scan은 `passiveScan` consent, acoustic TX/RX는 operator action, QR download는 operator action, wipe는 operator action을 요구한다. V1.7.1에서는 `field:record`와 `field:virtual`이 추가되었다. 이는 field evidence 기록이 명시적 목적을 가진 operation이라는 점을 감사자가 확인할 수 있게 한다.

### 11.4 Ethical Manifest

`ETHICAL_MANIFEST`는 copyright, license, allowed/prohibited uses, privacy principles를 포함하고 deep freeze된다. `Ethics.validateManifest()`와 integrity timer가 이 값을 계속 확인한다. 수정자는 manifest를 단순 문구로 취급하지 말고 실제 operation gate의 일부로 봐야 한다.

### 11.5 No Preview / No Render Exposure Note

이 산출물은 다운로드용 HTML 파일이다. 감사자가 파일을 실행하기 전까지 응답 화면, iframe, embed, object, live preview, code preview, automatic render panel이 생성되지 않아야 한다. V1.7.1 파일 내부에도 iframe/embed/object/canvas element는 없고, QR와 chart는 SVG로만 생성된다.

---

## 12. Customization Guide

### 12.1 환경 profile 수정

가장 흔한 수정은 `Profiles` 모듈의 environment profile 조정이다. `cornfield`, `forest`, `remoteRoad`, `urban`, `water`, `general` 각각에 `prior`, `stationaryMs`, `pathLoss`, `measuredPower`, `humidityFactor`, `nightBoost`, `edgeBoost`, `groupPenalty`, `passiveEscalation`이 있다.

수정 기준은 다음과 같다.

| Situation | Parameter to adjust | Direction |
|---|---|---|
| Dense vegetation에서 distance가 너무 짧게 추정됨 | `pathLoss`, `humidityFactor` | pathLoss/humidityFactor를 높인다. |
| Open road에서 distance가 너무 길게 추정됨 | `pathLoss` | pathLoss를 낮춘다. |
| 야간 risk가 과도함 | `nightBoost` | 낮춘다. |
| 그룹 휴식이 false alert를 만듦 | `groupPenalty` | 높인다. |
| water-adjacent emergency를 더 빨리 올리고 싶음 | `stationaryMs`, `prior`, `edgeBoost` | stationaryMs 낮추고 prior/edgeBoost 높인다. |

수정 후에는 `VirtualFieldTest`와 실제 calibration walk를 모두 실행한다. profile을 바꾸고 self-test만 통과했다고 현장 성능을 주장하면 안 된다.

### 12.2 SOS language 수정

SOS board language는 `UI.updateSosBoard()` 내부 dictionary와 `<select id="vg6-sos-language">` option이 같이 맞아야 한다. Arabic/Urdu처럼 RTL 언어는 `dir='rtl'` 대상에 포함해야 한다. 새 언어는 native script로 넣고, 긴 문장보다 짧고 명확한 emergency instruction을 우선한다.

### 12.3 Acoustic mode 수정

Acoustic mode는 `Acoustic` 모듈의 `modes` 객체에서 관리한다. `space`, `mark`, `preamble`, `bitMs`, `iosSafariOK`, `chirp`가 핵심이다. iOS Safari compatibility를 우선하면 audible mode를 기본으로 둔다. near-ultrasonic은 덜 거슬릴 수 있지만 speaker/microphone 필터와 OS processing에 더 취약하다.

bird-call profile은 operator-visible experimental field-audio channel로만 유지해야 한다. secret channel, covert messaging, deniable communication처럼 보이는 문구나 기능을 추가하면 프로젝트 철학과 라이선스에 반한다.

### 12.4 BLE transport 수정

BLE 수정 시 지켜야 할 원칙은 세 가지다.

첫째, passive scan은 local-only, short retention, no identification notice 뒤에만 실행한다. 둘째, browser-native advertisement TX를 universal API처럼 주장하지 않는다. 셋째, payload에 개인 정보나 permanent identifier를 넣지 않는다.

### 12.5 UI theme 수정

CSS는 반드시 `#vg6-root` 아래로 scoped 되어야 한다. `html`, `body`, `*` 전역 reset을 추가하지 않는다. 새 panel은 `.vg6-card`, `.vg6-body`, `.vg6-buttons`, `.vg6-field` 계열을 재사용하는 것이 좋다.

### 12.6 Export 수정

새 export를 만들면 filename, payload, sanitizer, license fields, buildMode, guard status, field evidence scope를 포함한다. export는 Blob download로만 생성하고 서버 전송을 추가하지 않는다.

---

## 13. Field Testing Guide

### 13.1 V1.7.1 가상 현장 테스트 결과

아래 결과는 V1.7.1 `VirtualFieldTest` 모듈이 생성하도록 설계된 controlled scenario evidence다. 이 결과는 hardware certification이 아니라 assumption check다.

| Scenario | Profile | Observed level | Expected | Score | Avg RSSI | Confidence | Status |
|---|---|---|---|---:|---:|---:|---|
| `forest-stationary` | forest | ALERT | ALERT | 0.780 | -76.7 | 0.911 | Pass |
| `cornfield-closing` | cornfield | ALERT | ALERT | 0.750 | -71.0 | 0.909 | Pass |
| `remote-road-pedestrian` | remoteRoad | ALERT | ALERT | 0.810 | -84.5 | 0.905 | Pass |
| `urban-group-rest` | urban | SAFE | SAFE | 0.090 | -59.8 | 0.925 | Pass |
| `water-signal-loss` | water | RESCUE | RESCUE | 1.000 | -76.0 | 0.242 | Pass |
| `acoustic-noise` | general | CONCERN | WARN threshold | 0.550 | -69.2 | 0.883 | Pass |

해석: forest/cornfield/remote-road/water 조건은 구조 관점에서 충분히 강한 escalation을 보였고, urban group rest는 SAFE로 내려가 false-positive 억제가 작동한다. acoustic-noise는 WARN threshold를 넘어 CONCERN으로 기록되며, 이는 acoustic reliability가 흔들릴 수 있음을 보수적으로 드러내는 결과다.

### 13.2 실제 현장 테스트 체크리스트

| Test | Minimum procedure | Pass criterion | Evidence to record |
|---|---|---|---|
| BLE protocol scan | Android Chrome 또는 desktop Chromium에서 `BLE Protocol Scan` 실행 | scan start가 기록되고 fatal error 없음 | device model, browser version, scan mode, lastError |
| Passive scan consent | `Passive BLE Scan` 클릭 후 consent modal/notice 확인 | consent 없이는 accept-all scan 실행 안 됨 | consent timestamp, scope |
| GATT peer | connectable peer와 `Connect GATT Peer` 시도 | 실패해도 graceful log, 성공 시 notification subscription attempt | error/status log |
| Audio TX/RX short range | 두 기기 사이 1–5m에서 audible FSK text 송수신 | preamble lock/CRC pass 증가 또는 실패 원인 기록 | mode, noise, distance, speaker volume |
| Acoustic noise stress | 바람/비/군중/echo 조건에서 RX | failure를 과장하지 않고 evidence 기록 | raw audio not persisted, crcFail |
| Flash Morse | Android Chrome + torch 지원 기기에서 실행 | explicit click 이후 torch loop 동작 | torch supported, permission result |
| Vibration Morse | supported phone에서 실행 | navigator.vibrate 동작 또는 unsupported graceful | vibration supported |
| 30-minute battery | Sentinel role로 30분 실행 | thermal/battery trend 기록 | starting/ending battery, wake lock, duty mode |
| 2-hour battery | 외부 전원 없는 sentinel readiness 확인 | drop rate와 heat 기록 | battery trend, device model |
| Idle auto-wipe | idle timeout 단축 후 auto-wipe 확인 | browser-accessible state cleared | deletion verification output |

### 13.3 현장 시나리오별 권장 profile

| Scenario | Recommended profile | Notes |
|---|---|---|
| Corn maze closing time | `cornfield` | 이벤트 스케줄과 closing-time sensitivity를 같이 운영한다. |
| Dense forest hiking trail | `forest` | GPS가 약하면 audio/visual final approach를 함께 쓴다. |
| Outback or isolated road | `remoteRoad` | pedestrian detection은 높은 risk prior를 둔다. |
| Elder-care perimeter | `urban` | false positive 억제를 위해 group/rest/time pattern을 보수적으로 조정한다. |
| Lake/river/coast | `water` | signal loss와 edge movement를 공격적으로 escalate한다. |

---

## 14. Security Audit Checklist

### 14.1 Static Search Checklist

| Search | Expected result |
|---|---|
| `cdn.jsdelivr`, `cdnjs`, `unpkg`, `fonts.googleapis`, `tailwind` | 0 external dependency references |
| `<script src=` | no external script tag |
| `<iframe`, `<embed`, `<object`, `<canvas` | no such elements |
| `eval(`, `new Function` | no dynamic code execution |
| `prompt(`, `confirm(`, `alert(` | no browser-native dialog dependency |
| `connect-src 'none'` | present in CSP |
| `navigator.sendBeacon` | only inside NetworkGuard blocking/probe logic |
| `acceptAllAdvertisements` | only after passive scan consent flow |
| `raw audio` | no persistence path; only limitation/evidence text |

### 14.2 Runtime Checklist

1. Open the file in a local test browser.
2. Run `Run Self Tests`.
3. Run `Run Field Matrix`.
4. Run `Run Virtual Field Test`.
5. Toggle `Build view` from Clean Audit Core to Full Review and confirm experimental panels hide/show as intended.
6. Use `Export Sanitized Audit` and inspect that license, buildMode, guard status, QR/acoustic status, field evidence, and no raw identifiers are included.
7. Use emergency wipe in a controlled environment and verify accessible state deletion.

### 14.3 High-Risk Review Areas

| Area | Why high-risk | Review focus |
|---|---|---|
| Passive BLE scan | Dual-use detection of nearby devices | consent, retention, no identification, local-only evidence |
| Acoustic fallback | Can be misunderstood as covert channel | operator-visible, logs, no secret signaling, raw audio not stored |
| QR SOS card | May accidentally include personal details | short payload, no permanent ID, sanitized metadata |
| Debug mode | Can leak state if not sanitized | `DebugMode.snapshot`, `debug:export`, local-only visibility |
| Wipe | Browser deletion has hard limits | best-effort language, no forensic overclaim |
| Inline script CSP | Necessary single-file tradeoff | no external sources, no dynamic execution, no egress |

---

## 15. Known Limits and Honest Disclosure

이 파일은 구조 가능성을 높이는 local humanitarian aid이지 certified rescue device가 아니다. 다음 한계를 항상 같이 표시해야 한다.

- BLE RSSI는 거리계가 아니다. vegetation, humidity, body absorption, terrain, device orientation, antenna design에 따라 크게 흔들린다.
- Browser Web Bluetooth는 iOS Safari에서 mesh node 역할을 하기 어렵다. iPhone은 감지 대상이 될 수는 있지만 browser node로는 제한된다.
- Browser background execution은 screen off, tab background, OS policy에 의해 멈출 수 있다.
- BLE advertisement TX는 browser-native universal capability가 아니다. native wrapper 또는 external BLE beacon이 필요할 수 있다.
- Acoustic FSK는 microphone AGC, wind, rain, crowd noise, echo, Safari constraint에 의해 실패할 수 있다.
- Camera torch는 ImageCapture torch 지원 기기에서만 가능하다.
- Vibration은 OS/browser support에 따라 다르다.
- JavaScript wipe는 browser-accessible state에 대한 best-effort deletion이다. OS caches, crash dumps, wear leveling, already-garbage-collected copies는 통제할 수 없다.
- Virtual field test는 assumption simulation이다. 실제 hardware field evidence를 대체하지 않는다.

---

## 16. 커스터마이징 안전 규칙

수정자가 가장 자주 실수하는 지점은 기능을 추가하면서 외부 의존성, 전역 CSS, raw identifier, persistent tracking, 과장 claim을 넣는 것이다. 다음 규칙을 지켜야 한다.

1. 외부 CDN, npm, import/export, external fetch는 추가하지 않는다.
2. CSS는 `#vg6-root` scope 밖으로 나가지 않는다.
3. 새 storage path는 `SafeStorage` 또는 `Storage.put`을 통한다.
4. 새 export는 `Ethics.sanitize`를 통한다.
5. 새 sensor/radio/action 기능은 `OP_POLICY`와 `Ethics.canOperate()`를 통한다.
6. raw BLE identifiers, MAC-like strings, exact coordinates, personal notes를 일반 export에 넣지 않는다.
7. passive scan, acoustic TX/RX, flash, vibration, QR download, wipe는 operator action 또는 consent를 요구한다.
8. actual rescue success, detection guarantee, certified accuracy 같은 표현을 쓰지 않는다.
9. field evidence와 virtual evidence를 구분한다.
10. 수정 후 `node --check`, self-test, field matrix, static dependency scan을 실행한다.

---

## 17. Audit-Oriented Search Map

| Goal | Search token |
|---|---|
| Version constants | `var APP_VERSION` |
| License manifest | `var ETHICAL_MANIFEST` |
| Operation whitelist | `var OP_POLICY` |
| No-egress guard | `registerModule('NetworkGuard'` |
| Recursive sanitizer | `function sanitize` inside `Ethics` |
| IndexedDB stores | `var stores=[` |
| Identity rotation | `registerModule('Identity'` |
| Wipe implementation | `registerModule('DataWiper'` |
| Watchdog | `registerModule('Watchdog'` |
| Environment profiles | `registerModule('Profiles'` |
| BLE scan options | `function optionsFor` |
| Passive consent | `showPassiveConsent` |
| GATT subscription | `function subscribeGatt` |
| Acoustic modes | `var modes={` inside `Acoustic` |
| Goertzel demodulation | `function goertzel` |
| Frame CRC | `function buildFrame`, `function parseFrame` |
| TDMA slot | `function nextSlotDelay` |
| Flash Morse | `registerModule('FlashBeacon'` |
| Vibration Morse | `registerModule('VibrationBeacon'` |
| QR encoder | `registerModule('QREncoder'` |
| SOS card | `registerModule('SOSCard'` |
| Priority queue | `registerModule('SosQueueV6'` |
| Virtual field tests | `registerModule('VirtualFieldTest'` |
| Self-tests | `registerModule('SelfTest'` |
| UI binding | `function bind()` inside `UI` |
| Manual text | `function renderManual` |
| Public diagnostic alias | `window.VitalGuardClosedBeta171TestV71` |

---

## 18. Maintenance Procedure

### 18.1 Before editing

1. Save a copy of the current HTML.
2. Record SHA-256 and file size.
3. Decide whether the change is security, UI, transport, acoustic, evidence, or profile customization.
4. Find the module with the search map above.
5. Check whether the change needs OP policy and consent gate.

### 18.2 After editing

1. Run JavaScript syntax check by extracting the script block and executing `node --check`.
2. Run static external dependency scan.
3. Run self-test in browser.
4. Run field matrix.
5. Run virtual field test.
6. Export sanitized audit JSON and inspect it manually.
7. Update this MD manual if module names, IDs, fields, or procedures changed.

### 18.3 Release note format

Every future release should state: version, test maturity, changed modules, security impact, field evidence status, residual risk, and whether hardware tests were actually performed.

---

## 19. Appendix A — Current Module Size Ranking

| Rank | Module | Approx. bytes | Why it is large |
|---:|---|---:|---|
| 1 | `UI` | 26,192 | UI render/bind/manual |
| 2 | `Acoustic` | 17,000 | FSK/Goertzel/TDMA/acoustic protocol |
| 3 | `AICoder` | 13,411 | 10 AI algorithms |
| 4 | `BLE` | 10,278 | BLE scan/GATT/native bridge |
| 5 | `FieldMatrix` | 7,033 | Field evidence logic |
| 6 | `Ethics` | 6,088 | module logic |
| 7 | `QREncoder` | 6,086 | module logic |
| 8 | `DataWiper` | 5,031 | module logic |
| 9 | `SelfTest` | 5,025 | module logic |
| 10 | `RescueAI` | 4,703 | module logic |
| 11 | `VirtualFieldTest` | 3,807 | module logic |
| 12 | `SOSCard` | 3,717 | module logic |
| 13 | `SosQueueV6` | 3,343 | module logic |
| 14 | `Watchdog` | 3,275 | module logic |
| 15 | `PacketCodec` | 3,119 | module logic |
| 16 | `IdleTimeout` | 3,105 | module logic |
| 17 | `V62Panel` | 3,012 | module logic |
| 18 | `FlashBeacon` | 2,833 | module logic |
| 19 | `Storage` | 2,805 | module logic |
| 20 | `Profiles` | 2,736 | module logic |
| 21 | `State` | 2,506 | module logic |
| 22 | `DebugMode` | 2,475 | module logic |
| 23 | `NetworkGuard` | 2,402 | module logic |
| 24 | `MiniChart` | 2,354 | module logic |
| 25 | `MeshCore` | 2,158 | module logic |
| 26 | `Heartbeat` | 1,958 | module logic |
| 27 | `Navigator` | 1,698 | module logic |
| 28 | `Trust` | 1,662 | module logic |
| 29 | `Power` | 1,399 | module logic |
| 30 | `VibrationBeacon` | 1,304 | module logic |
| 31 | `Capability` | 1,276 | module logic |
| 32 | `Dom` | 1,233 | module logic |
| 33 | `Identity` | 1,224 | module logic |
| 34 | `KeyboardShortcuts` | 1,111 | module logic |
| 35 | `SosStats` | 1,056 | module logic |
| 36 | `V5ToV6Migration` | 897 | module logic |
| 37 | `PWA` | 810 | module logic |
| 38 | `Logger` | 608 | module logic |
| 39 | `HighContrastMode` | 598 | module logic |
| 40 | `Bloom` | 592 | module logic |
| 41 | `EthicalGateAudit` | 584 | module logic |

---

## 20. Appendix B — Practical Review Notes

### 20.1 보수적 감사자가 물을 가능성이 높은 질문

**Q. 왜 inline script인데 안전하다고 보는가?**  
A. 단일 파일 오프라인 배포가 목적이어서 inline script는 구조적 trade-off다. 보상 통제로 external dependency 0, dynamic code execution 0, `connect-src none`, runtime NetworkGuard, sanitizer, frozen manifest, consent gate가 있다.

**Q. passive BLE scan은 surveillance 아닌가?**  
A. dual-use 위험이 있다. 그래서 local-only, short retention, no identification, operator consent, visible logs, no cloud, no persistent tracking, no biometric features를 구조적으로 넣었다. 그래도 governance 없는 공공장소 scanning은 피해야 한다.

**Q. acoustic bird-call profile은 covert channel 아닌가?**  
A. 아니다. UI에 보이고, 로그와 export에 드러나며, operator-visible experimental fallback으로 명시된다. secret/deniable communication 목적으로 사용하면 license와 ethics에 반한다.

**Q. QR SOS card에 개인정보가 들어갈 수 있는가?**  
A. 설계상 compact short-lived payload를 목표로 한다. permanent personal identifier를 넣지 말아야 하며, export와 debug는 sanitizer를 통과해야 한다.

**Q. wipe가 forensic deletion인가?**  
A. 아니다. browser-accessible state best-effort deletion이다. 이 한계를 UI와 comment, manual에 명시한다.

### 20.2 현장 operator에게 전달할 한 문장

이 도구는 통신망이 없는 상황에서 구조 가능성을 높이는 보조 장치이며, 실제 구조 절차·시각 수색·음성 호출·공식 프로토콜을 대체하지 않는다.

---

## 21. Final Handoff Checklist

| Item | Status |
|---|---|
| Single-file HTML output created | Done |
| Version upgraded to V1.7.1 / Test V7.1 | Done |
| No HTML/code preview required | Done; file is download artifact only |
| Code manual / code map MD created | Done |
| Static syntax check | Passed with `node --check` on extracted script |
| Virtual field-test module added | Done |
| Manual evidence prompt path removed | Done |
| Self-test hook for virtual field suite | Done |
| Real hardware field test | Not performed; must be done by operator on target devices |

End of manual.
