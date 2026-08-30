# VitalGuard Bluetooth Swarm + Ultrasonic Mesh — V2.0 중립 감사자 매뉴얼 / 코드 맵

**대상 아티팩트:** `Bluetooth_Swarm_Ultrasonic_Mesh_singlefile_V1_7_1.html`  
**빌드 식별자:** Closed Beta 1.7.1 / Test V7.1  
**매뉴얼 버전:** V2.0  
**작성일:** 2026-05-12 KST  
**대상 독자:** 보안 검토자, 유지보수 담당자, 현장 테스트 코디네이터, 배포 운영자

---

## 1. 범위

이 문서는 `Bluetooth_Swarm_Ultrasonic_Mesh_singlefile_V1_7_1.html`에 대한 중립적인 코드 매뉴얼 및 코드 맵입니다. 파일에 포함된 내용, 런타임 구성 방식, 각 모듈이 구현하는 기능, 검토자가 소스에서 검색해야 하는 위치, 로컬 테스트 및 현장 증거 수집에 사용해야 하는 절차를 설명합니다.

이 아티팩트는 단일 파일 오프라인 인도주의적 연속성 프로토타입입니다. 로컬 BLE 근접 및 구조 조정 인터페이스, 단기 패시브 BLE 관측, 우려값 계산, 관리형 로컬 릴레이 개념, 음향 폴백, QR/SVG SOS 카드 생성, 시각/촉각 비콘, 현장 증거 캡처, 위생 처리된 감사 내보내기, 로컬 AI-Coder 알고리즘 클래스가 포함되어 있으며, 브라우저 BLE 전송, 백그라운드 실행, 음향 신뢰성, JavaScript 삭제에 대한 명시적 한계 사항도 포함합니다.

이 매뉴얼은 구조 성능, 의료 사용, 법 집행 사용, 보장된 전달, 정확한 위치, 또는 하드웨어 신뢰성을 인증하지 않습니다. 해당 주장은 별도의 실제 기기 테스트 기록 및 배포 거버넌스가 필요합니다.

---

## 2. 문서 관리

| 항목 | 값 |
|---|---|
| 문서 제목 | VitalGuard Bluetooth Swarm + Ultrasonic Mesh — V2.0 중립 감사자 매뉴얼 / 코드 맵 |
| 대상 아티팩트 | `Bluetooth_Swarm_Ultrasonic_Mesh_singlefile_V1_7_1.html` |
| 빌드 식별자 | Closed Beta 1.7.1 / Test V7.1 |
| 매뉴얼 버전 | V2.0 |
| 원본 매뉴얼 | `Bluetooth_Swarm_Ultrasonic_Mesh_singlefile_V1_7_1 En (V1.0).md` |
| 작성일 | 2026-05-12 KST |
| 대상 독자 | 보안 검토자, 유지보수 담당자, 현장 테스트 코디네이터, 배포 운영자 |
| 배포 모델 | 단일 파일 HTML, 인라인 범위 지정 CSS, 인라인 바닐라 JavaScript, 외부 의존성 없음 |
| 라이선스 맥락 | M-Corp Ethical AI 라이선스, Hippocratic 3.0 파생 라이선스, 민간/농업/인도주의 목적에만 사용 가능 |
| 매뉴얼 범위 | 코드 맵, 모듈 역할, 검색 토큰, 운영 절차, 현장 증거 워크플로우, 커스터마이징 참고 사항, 잔여 한계 |
| 중요 주의사항 | 이 매뉴얼은 하드웨어 인증 기록이 아닙니다. BLE 범위, 오디오 복조, 토치, 진동, 배터리 지속시간, 현장 오탐지 동작은 별도 기기 증거가 필요합니다. |
| 정적 문법 검사 | 추출된 스크립트가 로컬 작업 공간에서 `node --check`를 통과했습니다. |

---

## 3. 정적 아티팩트 지표

| 지표 | 값 |
|---|---:|
| 파일 크기 | 246,699 bytes (240.92 KiB) |
| 라인 수 | 1,763 줄 |
| 인라인 CSS 크기 | 14,224 bytes |
| 인라인 JavaScript 크기 | 189,391 bytes |
| SHA-256 | `a63543de12c88c4f442de5c66df9eb70d538c0c488c4a1464eced80e51efbf5e` |
| 등록된 모듈 수 | 41개 |
| DOM ID 수 | 130개 |
| 외부 script 태그 | 0개 |
| 외부 stylesheet 링크 | 0개 |
| iframe / embed / object 요소 | 0 / 0 / 0 |
| canvas 요소 | 0개 |
| 네트워크 외부 전송 설계 | CSP `connect-src none` + 런타임 NetworkGuard |

**정적 검토 중 발견된 잔여 버전 레이블:**
- `1.7.0`이 6회 등장합니다. 대부분 호환성 주석, 이력 변경 이력 노트, 이전 ARIA 레이블, 또는 내부 삭제 이유 문자열입니다. 최종 공개 배포 패키지 전에 정리되어야 합니다.
- `V7.0`이 6회 등장합니다. 대부분 호환성 주석, 이력 변경 이력 노트, 이전 ARIA 레이블, 또는 내부 삭제 이유 문자열입니다. 최종 공개 배포 패키지 전에 정리되어야 합니다.

---

## 4. 빠른 검토 경로

아티팩트 검토 시 다음 순서를 따르십시오:

1. 상단 변경 이력 및 운영 한계 주석을 읽습니다.
2. CSP 메타 태그, 특히 `connect-src none`, `object-src none`, `base-uri none`, `form-action none`을 확인합니다.
3. `ETHICAL_MANIFEST`를 검색하여 허용/금지 사용, 라이선스 범위, 보존 한계, 안전장치를 확인합니다.
4. `registerModule('Ethics'`를 검색하여 `OP_POLICY`, `canOperate()`, 위생 처리 동작, 무결성 검사를 검토합니다.
5. `registerModule('NetworkGuard'`를 검색하여 fetch, XHR, WebSocket, EventSource, WebRTC, sendBeacon 차단을 검토합니다.
6. `registerModule('BLE'`를 검색하여 패시브 스캔이 동의 게이트 처리되어 있는지, BLE 광고 TX가 과장되지 않는지 확인합니다.
7. `registerModule('Acoustic'`를 검색하여 원시 오디오가 지속되지 않으며 음향 전달이 폴백 증거로만 문서화되어 있는지 확인합니다.
8. `registerModule('FieldMatrix'` 및 `registerModule('VirtualFieldTest'`를 검색하여 증거 기록이 로컬이고 위생 처리되었는지 확인합니다.
9. 브라우저에서 아티팩트를 실행한 뒤, Start Core, Run Self Tests, Run Field Matrix, Run Virtual Field Test, Export Sanitized Audit, Emergency 7-Pass Wipe를 순서대로 실행합니다.
10. 배포 주장을 위해 Android/데스크톱 Chromium 하드웨어에서 BLE, 마이크/스피커, 플래시, 진동, 배터리, Wake Lock, 범위 테스트를 포함한 실제 기기 증거를 수집합니다.

---

## 5. 아키텍처 개요

이 아티팩트는 하나의 범위 지정 스타일 블록과 하나의 스크립트 블록을 포함하는 단일 HTML 파일을 사용합니다. 스크립트는 IIFE로 감싸져 있으며 `window.VitalGuardClosedBeta17TestV7` 및 `window.VitalGuardClosedBeta171TestV71`을 통해 소규모 공용 진단 API를 노출합니다. 내부 통신은 소형 로컬 이벤트 버스인 `SwarmBus`를 사용합니다.

핵심 아키텍처 계층:

| 계층 | 역할 |
|---|---|
| 신원 및 상태 | 세션 신원, 회전 솔트, 역할, 프로파일, 로컬 트랙, 노드, 큐, 로그, 증거 기록 |
| 윤리적 게이트 | 목적 제한, 운영 화이트리스트, 동의 게이트, 무결성 검사, 위생 처리기, 변조 대응 |
| 로컬 전용 보안 | CSP, 런타임 네트워크 프리미티브 차단, SafeStorage, 위생 처리된 내보내기, 원격 의존성 없음 |
| BLE 근접 | 프로토콜 스캐닝, 동의 기반 패시브 스캔, GATT 폴백, 네이티브 광고주 훅, 로컬 관측 |
| 구조 AI | RSSI 기반 우려값 로직, 움직임 평가, 그룹 페널티, 합의, 상위 트랙 선택 |
| 폴백 채널 | 음향 FSK/모스부호, 카메라 토치 모스부호, 진동 모스부호, SOS 보드, QR/SVG 구조 카드 |
| 증거 | 자가 테스트, FieldMatrix, VirtualFieldTest, 위생 처리된 디버그, 위생 처리된 감사 내보내기 |
| 운영자 UI | 상태 대시보드, 컨트롤, 지도, 나침반, 로그, 모듈 상태, 차트, 수동 노트 |

---

## 6. 부팅 흐름

부팅은 모듈 등록 후 `boot()` 내부에서 시작됩니다. 중요한 순서는 다음과 같습니다:

1. `NetworkGuard.install()`이 비-외부통신 런타임 차단을 활성화합니다.
2. `Watchdog.start()`가 워커를 사용할 수 있는 경우 활성 상태 모니터링을 시작합니다.
3. `Capability.audit()`가 브라우저 기능 지원을 기록합니다.
4. `DebugMode.restore()`, `HighContrastMode.apply()`, `IdleTimeout.install()`, `KeyboardShortcuts.install()`이 운영자 컨트롤을 복원합니다.
5. `MiniChart.start()`가 SVG 전용 차트 샘플링을 시작합니다.
6. `Ethics.installIntegrity([...])`가 핵심 윤리/보안 함수를 해싱합니다.
7. `UI.bind()` 및 `V62Panel.bind()`가 이벤트 핸들러를 연결합니다.
8. `UI.renderAll()`이 초기 UI 렌더링을 수행합니다.
9. 가시적인 부팅 미터가 준비 완료 마일스톤을 보고합니다.

부팅은 BLE 스캐닝, 마이크 RX, 카메라 토치, 진동, QR 다운로드, 감사 내보내기를 자동으로 시작하지 않습니다. 해당 작업은 운영자 제스처 또는 명시적 제어 경로가 필요합니다.

---

## 7. 런타임 흐름

### 7.1 BLE 스캔 흐름

프로토콜 스캔은 VitalGuard 서비스 식별자를 대상으로 합니다. 패시브 스캔은 전체 광고 수신을 사용할 수 있지만, 패시브 스캔 동의 경로를 통과한 후에만 가능합니다. 광고는 페이로드 추출, 지문 생성, 해당 시 하트비트 디코드, 로컬 구조 관측, 관리형 릴레이 처리를 통해 처리됩니다. 브라우저 네이티브 BLE 광고 전송은 보편적으로 가능하다고 주장하지 않으며, 아티팩트는 실제 TX를 네이티브 브리지, GATT 피어 쓰기, 고정 외부 비콘 하드웨어, 음향 폴백으로 구분합니다.

### 7.2 구조 평가 흐름

`RescueAI.observe()`는 BLE 관측으로부터 단기 트랙을 구성합니다. 평가는 프로파일 사전 확률, 정지 지속시간, 움직임 불규칙성, 시간대별 위험, 신호 저하, 고립, SOS형 이름 플래그, 그룹 페널티, AICoder 앙상블을 결합합니다. 레벨 변경은 분류 증거로 사용되며, 자동 조난 인증으로 사용되지 않습니다.

### 7.3 음향 폴백 흐름

음향 모듈은 AudioContext 활성화, RX 시작, 캘리브레이션, FSK 텍스트 전송, 모스부호 전송, 비콘 패턴 재생이 가능합니다. V7 음향 프로토콜은 프리앰블, 바인딩된 길이, CRC, Goertzel/FFT 검사, TDMA 스케줄링을 사용합니다. 마이크, AGC, 스피커 응답, 배경 소음, 비, 바람, 모바일 브라우저 정책이 전달을 방해할 수 있으므로 여전히 실험적 현장 증거 수준입니다.

### 7.4 증거 흐름

증거는 세 가지 종류로 나뉩니다: 내부 자가 테스트, FieldMatrix 기록, VirtualFieldTest 시나리오 기록. 내보내기는 로컬로 생성된 JSON Blob 다운로드입니다. 위생 처리되어 있으며 서버로 전송되지 않습니다.

---

## 8. 모듈 디렉토리

| # | 모듈 | 변수 | 대략적 크기 | 검색 토큰 | 대표 함수/클래스 |
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

## 9. 모듈 심층 분석

### 9.1 `State`

**역할:** 런타임 상태 트리를 생성합니다: 노드 신원, BLE 상태, 오디오 상태, 큐, 트랙, 로그, 현장 테스트, 운영자 구성.

**검색 토큰:** `registerModule('State'`  
**대표 함수/클래스:** loadStoredId, createNodeId

**수정 확인:** 이 모듈을 변경한 경우 자가 테스트를 다시 실행하고 현장 증거 및 위생 처리된 내보내기 동작을 확인합니다.

### 9.2 `Dom`

**역할:** 요소 조회, 텍스트 업데이트, SVG 생성, CSS 클래스 토글, 목록 항목 렌더링을 위한 안전한 UI 헬퍼를 제공합니다.

**검색 토큰:** `registerModule('Dom'`  
**대표 함수/클래스:** byId, setText, cls, clear, item, svg

**수정 확인:** 이 모듈은 운영자 상호작용에 영향을 미칩니다. 사용자 제어 텍스트를 안전한 렌더링 경로에 유지하고 민감한 작업을 가시적이고 제스처 게이트 처리되도록 유지합니다.

### 9.3 `Logger`

**역할:** 바인딩된 로컬 이벤트 장부를 유지하고 UI에 로그 업데이트 이벤트를 전송합니다.

**검색 토큰:** `registerModule('Logger'`  
**대표 함수/클래스:** log, clear, list

**수정 확인:** 이 모듈을 변경한 경우 자가 테스트를 다시 실행하고 현장 증거 및 위생 처리된 내보내기 동작을 확인합니다.

### 9.4 `Ethics`

**역할:** 매니페스트 검증기, 재귀적 위생 처리기, 동의 인식 운영 화이트리스트, 무결성 해싱, 변조 대응을 보유합니다.

**검색 토큰:** `registerModule('Ethics'`  
**대표 함수/클래스:** redactString, sanitize, validateManifest, hashRefs, installIntegrity, checkIntegrity, consentOk, recordConsent, revokeConsent, operatorGestureOk, canOperate, listOperations

**수정 확인:** 이 모듈은 보안, 개인정보 보호, 증거, 전송, 내보내기, 삭제 동작에 영향을 미칩니다. 변경 후 자가 테스트, 현장 매트릭스 검사, 위생 처리된 내보내기 검토, OP_POLICY 검토를 실행합니다.

### 9.5 `NetworkGuard`

**역할:** 런타임 네트워크 프리미티브를 차단하고 비-외부통신 프로브/상태 정보를 노출합니다.

**검색 토큰:** `registerModule('NetworkGuard'`  
**대표 함수/클래스:** block, install, probe, status

**수정 확인:** 이 모듈은 보안, 개인정보 보호, 증거, 전송, 내보내기, 삭제 동작에 영향을 미칩니다. 변경 후 자가 테스트, 현장 매트릭스 검사, 위생 처리된 내보내기 검토, OP_POLICY 검토를 실행합니다.

### 9.6 `Storage`

**역할:** IndexedDB 접근을 래핑하고, 쓰기를 위생 처리하며, 정리 및 삭제 확인을 지원합니다.

**검색 토큰:** `registerModule('Storage'`  
**대표 함수/클래스:** open, put, all, clearStore, clearAll, deleteDatabase, verifyEmpty, prune

**수정 확인:** 이 모듈은 보안, 개인정보 보호, 증거, 전송, 내보내기, 삭제 동작에 영향을 미칩니다. 변경 후 자가 테스트, 현장 매트릭스 검사, 위생 처리된 내보내기 검토, OP_POLICY 검토를 실행합니다.

### 9.7 `Identity`

**역할:** 임시, 회전 또는 고정 가명 노드 신원 모드를 적용하고 요청 시 신원/솔트를 회전합니다.

**검색 토큰:** `registerModule('Identity'`  
**대표 함수/클래스:** applyMode, rotate

**수정 확인:** 이 모듈을 변경한 경우 자가 테스트를 다시 실행하고 현장 증거 및 위생 처리된 내보내기 동작을 확인합니다.

### 9.8 `DataWiper`

**역할:** 브라우저 접근 가능한 저장소, 런타임 맵, 타입화된 배열, 로컬 상태의 최선형 삭제를 수행합니다.

**검색 토큰:** `registerModule('DataWiper'`  
**대표 함수/클래스:** clearLocalStorage, clearSession, clearMemory, wipe, verifyAccessibleDeletion, idbProbe, installTriggers

**수정 확인:** 이 모듈은 보안, 개인정보 보호, 증거, 전송, 내보내기, 삭제 동작에 영향을 미칩니다. 변경 후 자가 테스트, 현장 매트릭스 검사, 위생 처리된 내보내기 검토, OP_POLICY 검토를 실행합니다.

### 9.9 `Watchdog`

**역할:** 지원되는 경우 워커 기반 활성 상태 모니터를 실행하고 메인 스레드 상태를 기록합니다.

**검색 토큰:** `registerModule('Watchdog'`  
**대표 함수/클래스:** start, tick, notifyRender, check, stop, status

**수정 확인:** 이 모듈을 변경한 경우 자가 테스트를 다시 실행하고 현장 증거 및 위생 처리된 내보내기 동작을 확인합니다.

### 9.10 `Capability`

**역할:** Bluetooth, 오디오, 배터리, Wake Lock, 지오로케이션, 진동, 토치, 보안 컨텍스트에 대한 브라우저 지원을 감사합니다.

**검색 토큰:** `registerModule('Capability'`  
**대표 함수/클래스:** audit, label

**수정 확인:** 이 모듈을 변경한 경우 자가 테스트를 다시 실행하고 현장 증거 및 위생 처리된 내보내기 동작을 확인합니다.

### 9.11 `Profiles`

**역할:** 옥수수밭, 숲, 도로, 도시, 수변, 일반 배포를 위한 환경 프로파일과 RSSI 거리/신뢰도 동작을 정의합니다.

**검색 토큰:** `registerModule('Profiles'`  
**대표 함수/클래스:** current, apply, estimateDistance, distanceConfidence

**수정 확인:** 이 모듈을 변경한 경우 자가 테스트를 다시 실행하고 현장 증거 및 위생 처리된 내보내기 동작을 확인합니다.

### 9.12 `Power`

**역할:** 배터리/Wake Lock 상태를 추적하고 전력 및 우려 수준에 따라 스캔 듀티를 조정합니다.

**검색 토큰:** `registerModule('Power'`  
**대표 함수/클래스:** start, update, requestWakeLock, scanDutyForConcern

**수정 확인:** 이 모듈을 변경한 경우 자가 테스트를 다시 실행하고 현장 증거 및 위생 처리된 내보내기 동작을 확인합니다.

### 9.13 `Bloom`

**역할:** 메시지 및 패킷 다이제스트의 컴팩트 중복 감지를 제공합니다.

**검색 토큰:** `registerModule('Bloom'`  
**대표 함수/클래스:** clear, hash, add, has

**수정 확인:** 이 모듈을 변경한 경우 자가 테스트를 다시 실행하고 현장 증거 및 위생 처리된 내보내기 동작을 확인합니다.

### 9.14 `Heartbeat`

**역할:** 컴팩트 VitalGuard 하트비트 페이로드와 센서 플래그를 인코딩하고 디코딩합니다.

**검색 토큰:** `registerModule('Heartbeat'`  
**대표 함수/클래스:** sensorFlags, encode, decode

**수정 확인:** 이 모듈을 변경한 경우 자가 테스트를 다시 실행하고 현장 증거 및 위생 처리된 내보내기 동작을 확인합니다.

### 9.15 `PacketCodec`

**역할:** TTL, 청크, 무결성 마커를 포함한 메시/GATT/네이티브/음향 패킷을 패킹하고 언패킹합니다.

**검색 토큰:** `registerModule('PacketCodec'`  
**대표 함수/클래스:** pack, encode, encodeChunks, decode, absorb

**수정 확인:** 이 모듈을 변경한 경우 자가 테스트를 다시 실행하고 현장 증거 및 위생 처리된 내보내기 동작을 확인합니다.

### 9.16 `Trust`

**역할:** 릴레이 및 증거 가중치를 위한 로컬 전용 노드 신뢰 점수를 유지합니다.

**검색 토큰:** `registerModule('Trust'`  
**대표 함수/클래스:** get, average, update, clear, restore

**수정 확인:** 이 모듈을 변경한 경우 자가 테스트를 다시 실행하고 현장 증거 및 위생 처리된 내보내기 동작을 확인합니다.

### 9.17 `AICoder`

**역할:** 10개의 로컬 AI-Coder 엔진과 구조 평가 앙상블/자가 테스트 실행기를 구현합니다.

**검색 토큰:** `registerModule('AICoder'`  
**대표 함수/클래스:** finite, distance, normalize, dot, sigmoid, QLearning, UCBBandit, KNN, RLS, ThompsonSampling, GeneticAlgorithm, PSO

**수정 확인:** 이 모듈을 변경한 경우 자가 테스트를 다시 실행하고 현장 증거 및 위생 처리된 내보내기 동작을 확인합니다.

### 9.18 `RescueAI`

**역할:** BLE 관측을 단기 트랙, 우려값, 움직임 상태, 합의, 추정 영역으로 변환합니다.

**검색 토큰:** `registerModule('RescueAI'`  
**대표 함수/클래스:** temporalRisk, distanceFromRssi, level, movement, estimate, observe, groupPenaltyFor, vote, topTrack, prune, simulate

**수정 확인:** 이 모듈을 변경한 경우 자가 테스트를 다시 실행하고 현장 증거 및 위생 처리된 내보내기 동작을 확인합니다.

### 9.19 `MeshCore`

**역할:** 하트비트를 수신하고 관리형 플러딩/TTL 릴레이 로직을 적용합니다.

**검색 토큰:** `registerModule('MeshCore'`  
**대표 함수/클래스:** receiveHeartbeat, shouldRelay, relay, prune

**수정 확인:** 이 모듈을 변경한 경우 자가 테스트를 다시 실행하고 현장 증거 및 위생 처리된 내보내기 동작을 확인합니다.

### 9.20 `EthicalGateAudit`

**역할:** 민감한 작업이 의도된 윤리적 게이트를 통과했다는 로컬 증거를 기록합니다.

**검색 토큰:** `registerModule('EthicalGateAudit'`  
**대표 함수/클래스:** note, snapshot, count

**수정 확인:** 이 모듈을 변경한 경우 자가 테스트를 다시 실행하고 현장 증거 및 위생 처리된 내보내기 동작을 확인합니다.

### 9.21 `BLE`

**역할:** Web Bluetooth 스캐닝, 패시브 스캔 동의, GATT 연결/쓰기/알림, 네이티브 광고주 훅, 하트비트 전송을 제어합니다.

**검색 토큰:** `registerModule('BLE'`  
**대표 함수/클래스:** installHandler, optionsFor, start, startAdaptive, cycle, directStart, stopScanOnly, stop, extractPayloads, fingerprint, handleAdvertisement, nativeAdvertise

**수정 확인:** 이 모듈은 보안, 개인정보 보호, 증거, 전송, 내보내기, 삭제 동작에 영향을 미칩니다. 변경 후 자가 테스트, 현장 매트릭스 검사, 위생 처리된 내보내기 검토, OP_POLICY 검토를 실행합니다.

### 9.22 `Acoustic`

**역할:** 오디오 RX/TX 폴백, FSK 프레이밍, Goertzel/FFT 검사, CRC 프레이밍, TDMA 스케줄링, 모스부호, 새소리 모드를 구현합니다.

**검색 토큰:** `registerModule('Acoustic'`  
**대표 함수/클래스:** selectBestMode, context, wakeAudio, freqToBin, configure, cleanOscillators, tone, chirp, playSymbol, playBeacon, buildFrame, bytesToBits

**수정 확인:** 이 모듈은 보안, 개인정보 보호, 증거, 전송, 내보내기, 삭제 동작에 영향을 미칩니다. 변경 후 자가 테스트, 현장 매트릭스 검사, 위생 처리된 내보내기 검토, OP_POLICY 검토를 실행합니다.

### 9.23 `Navigator`

**역할:** 구조자 방위각/거리 계산과 센서 시작/목표 선택을 제공합니다.

**검색 토큰:** `registerModule('Navigator'`  
**대표 함수/클래스:** start, targetTop, bearingToTarget

**수정 확인:** 이 모듈을 변경한 경우 자가 테스트를 다시 실행하고 현장 증거 및 위생 처리된 내보내기 동작을 확인합니다.

### 9.24 `FlashBeacon`

**역할:** 사용 가능한 경우 명시적 카메라 권한과 ImageCapture 토치를 사용하여 가시적 모스부호 폴백 신호를 전송합니다.

**검색 토큰:** `registerModule('FlashBeacon'`  
**대표 함수/클래스:** isSupported, start, torch, sendMorse, next, sendSosLoop, stop

**수정 확인:** 이 모듈을 변경한 경우 자가 테스트를 다시 실행하고 현장 증거 및 위생 처리된 내보내기 동작을 확인합니다.

### 9.25 `VibrationBeacon`

**역할:** 사용 가능한 경우 navigator.vibrate를 사용하여 촉각 SOS/모스부호 패턴을 전송합니다.

**검색 토큰:** `registerModule('VibrationBeacon'`  
**대표 함수/클래스:** isSupported, sendMorse, sendSos, stop

**수정 확인:** 이 모듈을 변경한 경우 자가 테스트를 다시 실행하고 현장 증거 및 위생 처리된 내보내기 동작을 확인합니다.

### 9.26 `QREncoder`

**역할:** canvas, CDN, QR API 없이 에러 수정 기능이 포함된 로컬 SVG QR Code Model 2 매트릭스를 생성합니다.

**검색 토큰:** `registerModule('QREncoder'`  
**대표 함수/클래스:** gf, mul, gen, ecc, dataCodewords, add, blank, set, finder, align, formatBits, drawFormat

**수정 확인:** 이 모듈은 보안, 개인정보 보호, 증거, 전송, 내보내기, 삭제 동작에 영향을 미칩니다. 변경 후 자가 테스트, 현장 매트릭스 검사, 위생 처리된 내보내기 검토, OP_POLICY 검토를 실행합니다.

### 9.27 `SOSCard`

**역할:** 컴팩트 단기 구조 페이로드와 로컬 SVG/QR 카드 다운로드를 빌드합니다.

**검색 토큰:** `registerModule('SOSCard'`  
**대표 함수/클래스:** esc, compactData, makeData, svg, dataUrl, generate, download

**수정 확인:** 이 모듈은 보안, 개인정보 보호, 증거, 전송, 내보내기, 삭제 동작에 영향을 미칩니다. 변경 후 자가 테스트, 현장 매트릭스 검사, 위생 처리된 내보내기 검토, OP_POLICY 검토를 실행합니다.

### 9.28 `SosStats`

**역할:** 세션 전용 SOS, 연결, 구조, 오탐지 카운터를 추적합니다.

**검색 토큰:** `registerModule('SosStats'`  
**대표 함수/클래스:** update, recordSos, recordRescue, recordConnection, recordFalsePositive, snapshot

**수정 확인:** 이 모듈을 변경한 경우 자가 테스트를 다시 실행하고 현장 증거 및 위생 처리된 내보내기 동작을 확인합니다.

### 9.29 `SosQueueV6`

**역할:** SOS, ACK, 삼각측량, 상태 패킷에 대한 바인딩된 우선순위 큐 동작을 유지하며, SOS를 일반 트래픽보다 위에 유지합니다.

**검색 토큰:** `registerModule('SosQueueV6'`  
**대표 함수/클래스:** scoreOf, digestOf, prune, enqueue, next, flush, clear, snapshot, stats

**수정 확인:** 이 모듈은 보안, 개인정보 보호, 증거, 전송, 내보내기, 삭제 동작에 영향을 미칩니다. 변경 후 자가 테스트, 현장 매트릭스 검사, 위생 처리된 내보내기 검토, OP_POLICY 검토를 실행합니다.

### 9.30 `MiniChart`

**역할:** 우려, 큐, 배터리, 이벤트 압력을 위한 순수 SVG 미니 차트를 그립니다.

**검색 토큰:** `registerModule('MiniChart'`  
**대표 함수/클래스:** push, sample, pathFor, draw, add, start, snapshot

**수정 확인:** 이 모듈을 변경한 경우 자가 테스트를 다시 실행하고 현장 증거 및 위생 처리된 내보내기 동작을 확인합니다.

### 9.31 `DebugMode`

**역할:** ?debug=1을 통한 URL 활성화를 포함하여 가시적으로 표시된 위생 처리된 로컬 디버그 스냅샷 및 내보내기를 제공합니다.

**검색 토큰:** `registerModule('DebugMode'`  
**대표 함수/클래스:** queryRequested, restore, set, toggle, isActive, snapshot, exportJson

**수정 확인:** 이 모듈은 보안, 개인정보 보호, 증거, 전송, 내보내기, 삭제 동작에 영향을 미칩니다. 변경 후 자가 테스트, 현장 매트릭스 검사, 위생 처리된 내보내기 검토, OP_POLICY 검토를 실행합니다.

### 9.32 `HighContrastMode`

**역할:** 현장 가시성과 접근성을 위한 고대비 스타일링을 적용합니다.

**검색 토큰:** `registerModule('HighContrastMode'`  
**대표 함수/클래스:** apply, toggle

**수정 확인:** 이 모듈은 운영자 상호작용에 영향을 미칩니다. 사용자 제어 텍스트를 안전한 렌더링 경로에 유지하고 민감한 작업을 가시적이고 제스처 게이트 처리되도록 유지합니다.

### 9.33 `IdleTimeout`

**역할:** 유휴 임계값 근처에서 라디오를 중지하고 30분 기본 최선형 브라우저 샌드박스 자동 삭제를 수행합니다.

**검색 토큰:** `registerModule('IdleTimeout'`  
**대표 함수/클래스:** touch, setMinutes, idleMs, remainingMs, stopRadios, autoWipe, check, install, status

**수정 확인:** 이 모듈은 보안, 개인정보 보호, 증거, 전송, 내보내기, 삭제 동작에 영향을 미칩니다. 변경 후 자가 테스트, 현장 매트릭스 검사, 위생 처리된 내보내기 검토, OP_POLICY 검토를 실행합니다.

### 9.34 `KeyboardShortcuts`

**역할:** 큐 SOS, 고대비, 디버그, 긴급 삭제를 위한 운영자 키보드 단축키를 설치합니다.

**검색 토큰:** `registerModule('KeyboardShortcuts'`  
**대표 함수/클래스:** install

**수정 확인:** 이 모듈은 운영자 상호작용에 영향을 미칩니다. 사용자 제어 텍스트를 안전한 렌더링 경로에 유지하고 민감한 작업을 가시적이고 제스처 게이트 처리되도록 유지합니다.

### 9.35 `V62Panel`

**역할:** QR, 큐, 디버그, 유휴, 호환성 상태를 위한 강화 패널을 렌더링합니다.

**검색 토큰:** `registerModule('V62Panel'`  
**대표 함수/클래스:** renderQueue, renderDebug, renderIdle, render, bind, on

**수정 확인:** 이 모듈은 운영자 상호작용에 영향을 미칩니다. 사용자 제어 텍스트를 안전한 렌더링 경로에 유지하고 민감한 작업을 가시적이고 제스처 게이트 처리되도록 유지합니다.

### 9.36 `V5ToV6Migration`

**역할:** 전환 중 이전 VitalGuard 저장소 키를 감지, 마이그레이션 또는 정리합니다.

**검색 토큰:** `registerModule('V5ToV6Migration'`  
**대표 함수/클래스:** detectV5Data, migrateV5Config, cleanV5Data

**수정 확인:** 이 모듈을 변경한 경우 자가 테스트를 다시 실행하고 현장 증거 및 위생 처리된 내보내기 동작을 확인합니다.

### 9.37 `FieldMatrix`

**역할:** 기능, 삭제, 오디오, 시각/촉각, 전력, 비-외부통신, 클린 스플릿 상태에 대한 로컬 증거를 기록합니다.

**검색 토큰:** `registerModule('FieldMatrix'`  
**대표 함수/클래스:** record, run, addNote, list, exportJson

**수정 확인:** 이 모듈은 보안, 개인정보 보호, 증거, 전송, 내보내기, 삭제 동작에 영향을 미칩니다. 변경 후 자가 테스트, 현장 매트릭스 검사, 위생 처리된 내보내기 검토, OP_POLICY 검토를 실행합니다.

### 9.38 `VirtualFieldTest`

**역할:** 숲, 옥수수밭, 외딴 도로, 도시 오탐지, 수변, 음향 노이즈 가정에 대한 제어된 시나리오 기록을 실행합니다.

**검색 토큰:** `registerModule('VirtualFieldTest'`  
**대표 함수/클래스:** avg, std, classify, runScenario, run, status

**수정 확인:** 이 모듈은 보안, 개인정보 보호, 증거, 전송, 내보내기, 삭제 동작에 영향을 미칩니다. 변경 후 자가 테스트, 현장 매트릭스 검사, 위생 처리된 내보내기 검토, OP_POLICY 검토를 실행합니다.

### 9.39 `SelfTest`

**역할:** 매니페스트, 위생 처리기, 네트워크 가드, 패킷 코덱, AI 스위트, QR, 큐, 음향, 가상 테스트 등록에 대한 내부 검사를 실행합니다.

**검색 토큰:** `registerModule('SelfTest'`  
**대표 함수/클래스:** run, ok

**수정 확인:** 이 모듈은 보안, 개인정보 보호, 증거, 전송, 내보내기, 삭제 동작에 영향을 미칩니다. 변경 후 자가 테스트, 현장 매트릭스 검사, 위생 처리된 내보내기 검토, OP_POLICY 검토를 실행합니다.

### 9.40 `PWA`

**역할:** 실제 캐시 우선 서비스 워커가 분리된 아티팩트를 필요로 한다는 점을 공개하면서 동일 파일 매니페스트 Blob을 생성합니다.

**검색 토큰:** `registerModule('PWA'`  
**대표 함수/클래스:** createManifest

**수정 확인:** 이 모듈을 변경한 경우 자가 테스트를 다시 실행하고 현장 증거 및 위생 처리된 내보내기 동작을 확인합니다.

### 9.41 `UI`

**역할:** 컨트롤을 바인딩하고, 모든 패널을 렌더링하고, 위생 처리된 감사 기록을 내보내고, 상태, 지도, 로그, 모듈, AI 결과, 운영자 도움말을 업데이트합니다.

**검색 토큰:** `registerModule('UI'`  
**대표 함수/클래스:** updateStatus, renderTracks, renderLog, renderModules, renderAI, renderField, renderTests, renderManual, renderMap, renderCompass, applyBuildMode, renderStats

**수정 확인:** 이 모듈은 운영자 상호작용에 영향을 미칩니다. 사용자 제어 텍스트를 안전한 렌더링 경로에 유지하고 민감한 작업을 가시적이고 제스처 게이트 처리되도록 유지합니다.

---

## 10. DOM ID 색인

이 아티팩트에는 130개의 DOM ID가 포함되어 있습니다. 아래 그룹은 빠른 UI 바인딩 검토를 위한 것입니다. 일부 ID는 하나 이상의 기능 영역에 속할 수 있습니다.

### 상태 및 부팅

| DOM ID | 검토 용도 |
|---|---|
| `vg6-node-id` | UI 요소 또는 렌더링 컨테이너 |
| `vg6-boot-meter` | 상태 표시 |
| `vg6-boot-text` | 상태 표시 |
| `vg6-audit-pill` | 상태 표시 |
| `vg6-mode-dot` | 구성 또는 운영자 입력 |
| `vg6-clock` | 상태 표시 |
| `vg6-stat-mode` | 구성 또는 운영자 입력 |
| `vg6-stat-ble` | 상태 표시 |
| `vg6-stat-tracks` | 상태 표시 |
| `vg6-stat-concern` | 상태 표시 |
| `vg6-stat-consensus` | 상태 표시 |
| `vg6-stat-outbox` | 상태 표시 |
| `vg6-stat-power` | 상태 표시 |
| `vg6-stat-identity` | 구성 또는 운영자 입력 |
| `vg6-stat-integrity` | 상태 표시 |
| `vg6-stat-ai` | 상태 표시 |
| `vg6-stat-field` | 상태 표시 |
| `vg6-stat-guard` | 상태 표시 |
| `vg62-stat-queue` | 상태 표시 |
| `vg62-stat-debug` | 상태 표시 |
| `vg62-stat-idle` | 상태 표시 |
| `vg6-capability-pill` | 상태 표시 |
| `vg6-passive-pill` | 상태 표시 |
| `vg6-nav-pill` | 상태 표시 |
| `vg6-sos-card-status` | 상태 표시 |
| `vg6-sos-stats-pill` | 상태 표시 |
| `vg6-sos-stats` | 상태 표시 |
| `vg6-field-pill` | 상태 표시 |
| `vg6-ethics-pill` | 상태 표시 |
| `vg6-test-pill` | 상태 표시 |

### 구성

| DOM ID | 검토 용도 |
|---|---|
| `vg6-build-mode` | 구성 또는 운영자 입력 |
| `vg6-role` | 구성 또는 운영자 입력 |
| `vg6-profile` | 구성 또는 운영자 입력 |
| `vg6-group-id` | 구성 또는 운영자 입력 |
| `vg6-identity-mode` | 구성 또는 운영자 입력 |
| `vg6-sos-language` | 구성 또는 운영자 입력 |
| `vg6-acoustic-mode` | 구성 또는 운영자 입력 |
| `vg6-message-text` | 구성 또는 운영자 입력 |
| `vg6-ttl` | 구성 또는 운영자 입력 |
| `vg6-tdma-slots` | 구성 또는 운영자 입력 |
| `vg6-measured-power` | 구성 또는 운영자 입력 |
| `vg6-path-loss` | 구성 또는 운영자 입력 |
| `vg62-idle-minutes` | 구성 또는 운영자 입력 |

### 핵심 컨트롤

| DOM ID | 검토 용도 |
|---|---|
| `vg6-save-config` | 운영자 컨트롤 |
| `vg6-rotate-id` | 운영자 컨트롤 |
| `vg6-start-core` | 운영자 컨트롤 |
| `vg6-stop-ble` | 운영자 컨트롤 |
| `vg6-connect-gatt` | 운영자 컨트롤 |
| `vg6-send-heartbeat` | 운영자 컨트롤 |
| `vg6-run-simulation` | 운영자 컨트롤 |
| `vg6-run-tests` | 운영자 컨트롤 |
| `vg6-wipe-all` | 운영자 컨트롤 |
| `vg6-safe-mode` | 구성 또는 운영자 입력 |

### BLE, 구조, SOS

| DOM ID | 검토 용도 |
|---|---|
| `vg6-start-protocol-scan` | 운영자 컨트롤 |
| `vg6-start-passive-scan` | 운영자 컨트롤 |
| `vg6-broadcast-sos` | 운영자 컨트롤 |
| `vg6-device-list` | 렌더링 컨테이너 |
| `vg6-sos-board` | UI 요소 또는 렌더링 컨테이너 |
| `vg6-mark-help` | 운영자 컨트롤 |
| `vg6-mark-safe` | 운영자 컨트롤 |
| `vg6-sos-cycle-toggle` | 운영자 컨트롤 |
| `vg6-fullscreen-sos` | UI 요소 또는 렌더링 컨테이너 |
| `vg6-flash-sos` | UI 요소 또는 렌더링 컨테이너 |
| `vg6-vibrate-sos` | UI 요소 또는 렌더링 컨테이너 |
| `vg6-sos-card-img` | UI 요소 또는 렌더링 컨테이너 |
| `vg6-generate-sos-card` | 운영자 컨트롤 |
| `vg6-download-sos-card` | 운영자 컨트롤 |
| `vg62-queue-sos` | UI 요소 또는 렌더링 컨테이너 |

### 음향, 시각, 촉각

| DOM ID | 검토 용도 |
|---|---|
| `vg6-play-beacon` | 운영자 컨트롤 |
| `vg6-rescuer-beacon` | UI 요소 또는 렌더링 컨테이너 |
| `vg6-audio-band` | UI 요소 또는 렌더링 컨테이너 |
| `vg6-start-audio` | 운영자 컨트롤 |
| `vg6-calibrate-audio` | UI 요소 또는 렌더링 컨테이너 |
| `vg6-send-text` | 운영자 컨트롤 |
| `vg6-send-morse` | 운영자 컨트롤 |
| `vg6-flash-pill` | 상태 표시 |
| `vg6-flash-start` | 운영자 컨트롤 |
| `vg6-flash-text` | UI 요소 또는 렌더링 컨테이너 |
| `vg6-flash-stop` | 운영자 컨트롤 |
| `vg6-vibrate-text` | UI 요소 또는 렌더링 컨테이너 |

### QR, 큐, 디버그, 유휴

| DOM ID | 검토 용도 |
|---|---|
| `vg62-panel` | UI 요소 또는 렌더링 컨테이너 |
| `vg62-panel-pill` | 상태 표시 |
| `vg62-generate-qr` | 운영자 컨트롤 |
| `vg62-flush-queue` | UI 요소 또는 렌더링 컨테이너 |
| `vg62-toggle-debug` | 운영자 컨트롤 |
| `vg62-toggle-contrast` | 운영자 컨트롤 |
| `vg62-q-depth` | UI 요소 또는 렌더링 컨테이너 |
| `vg62-q-critical` | UI 요소 또는 렌더링 컨테이너 |
| `vg62-q-sent` | UI 요소 또는 렌더링 컨테이너 |
| `vg62-q-dropped` | UI 요소 또는 렌더링 컨테이너 |
| `vg62-mini-chart-svg` | 렌더링 컨테이너 |
| `vg62-idle-panel` | UI 요소 또는 렌더링 컨테이너 |
| `vg62-idle-pill` | 상태 표시 |
| `vg62-save-idle` | 운영자 컨트롤 |
| `vg62-reset-idle` | UI 요소 또는 렌더링 컨테이너 |
| `vg62-export-debug` | 운영자 컨트롤 |
| `vg62-queue-panel` | UI 요소 또는 렌더링 컨테이너 |
| `vg62-queue-pill` | 상태 표시 |
| `vg62-queue-list` | 렌더링 컨테이너 |
| `vg62-debug-panel` | UI 요소 또는 렌더링 컨테이너 |
| `vg62-debug-pill` | 상태 표시 |
| `vg62-debug-list` | 렌더링 컨테이너 |

### 현장 증거 및 테스트

| DOM ID | 검토 용도 |
|---|---|
| `vg6-run-ai-suite` | 운영자 컨트롤 |
| `vg6-auto-tune` | UI 요소 또는 렌더링 컨테이너 |
| `vg6-ai-list` | 렌더링 컨테이너 |
| `vg6-field-note-input` | UI 요소 또는 렌더링 컨테이너 |
| `vg6-run-field` | 운영자 컨트롤 |
| `vg6-run-virtual-field` | 운영자 컨트롤 |
| `vg6-export-field-json` | 운영자 컨트롤 |
| `vg6-add-field-note` | UI 요소 또는 렌더링 컨테이너 |
| `vg6-field-list` | 렌더링 컨테이너 |

### 지도, 네비게이션, 로그, 모듈

| DOM ID | 검토 용도 |
|---|---|
| `vg6-mesh-svg` | 렌더링 컨테이너 |
| `vg6-mesh-edges` | UI 요소 또는 렌더링 컨테이너 |
| `vg6-mesh-nodes` | UI 요소 또는 렌더링 컨테이너 |
| `vg6-mesh-tracks` | UI 요소 또는 렌더링 컨테이너 |
| `vg6-compass-arrow` | UI 요소 또는 렌더링 컨테이너 |
| `vg6-nav-distance` | UI 요소 또는 렌더링 컨테이너 |
| `vg6-nav-bearing` | UI 요소 또는 렌더링 컨테이너 |
| `vg6-start-nav` | 운영자 컨트롤 |
| `vg6-module-list` | 렌더링 컨테이너 |
| `vg6-test-results` | 렌더링 컨테이너 |
| `vg6-manual-box` | 렌더링 컨테이너 |
| `vg6-log` | 렌더링 컨테이너 |

### 기타 UI

| DOM ID | 검토 용도 |
|---|---|
| `vg6-scoped-style` | UI 요소 또는 렌더링 컨테이너 |
| `vg6-root` | UI 요소 또는 렌더링 컨테이너 |
| `vg6-export-audit` | 운영자 컨트롤 |
| `vg6-pulse` | UI 요소 또는 렌더링 컨테이너 |
| `vg6-target-top` | UI 요소 또는 렌더링 컨테이너 |
| `vg6-contact-email` | UI 요소 또는 렌더링 컨테이너 |
| `vg6-show-email` | UI 요소 또는 렌더링 컨테이너 |

---

## 11. 검토 체크리스트 매핑

하드웨어 의존 동작은 대상 기기에서 확인해야 합니다.

| # | 검토 항목 | 소스 / 검사할 코드 위치 | 검증 참고 사항 |
|---:|---|---|---|
| 1 | 윤리적 매니페스트 | `ETHICAL_MANIFEST`, `U.deepFreeze` | 허용/금지 사용 필드, 라이선스 범위, 보존 필드, 안전장치 목록을 확인합니다. |
| 2 | 운영 게이트 | `registerModule('Ethics'`, `OP_POLICY`, `canOperate()` | 민감한 작업이 명시적으로 화이트리스트에 있고 필요한 경우 동의 게이트 처리되어 있는지 확인합니다. |
| 3 | 위생 처리기 | `Ethics.sanitize`, `redactString` | 중첩 객체, 배열, 위험한 키 이름, 이메일형 문자열, 전화번호형 문자열, 토큰형 문자열, 정밀 좌표가 의도한 대로 처리되는지 확인합니다. |
| 4 | 비-외부통신 자세 | CSP 메타 태그, `registerModule('NetworkGuard'` | `connect-src 'none'`과 fetch, XHR, WebSocket, EventSource, WebRTC 생성자, sendBeacon의 런타임 차단을 확인합니다. |
| 5 | 로컬 저장소 처리 | `SafeStorage`, `registerModule('Storage'` | 로컬 환경 설정 쓰기가 래퍼를 사용하고 IndexedDB 쓰기가 위생 처리를 통과하는지 확인합니다. |
| 6 | 삭제 동작 | `registerModule('DataWiper'`, `Emergency 7-Pass Wipe` 컨트롤 | 삭제를 최선형 브라우저 샌드박스 삭제로 취급하고, 접근 가능한 저장소와 런타임 맵이 지워지는지 확인합니다. |
| 7 | 신원 동작 | `registerModule('Identity'`, `STORE_PREFIX`, 노드 ID 처리 | 임시 모드가 기본값이고 고정 신원은 운영자가 선택하는지 확인합니다. |
| 8 | BLE 프로토콜 스캔 | `registerModule('BLE'`, `optionsFor`, `directStart` | 지원 브라우저에서 서비스 필터 스캔 경로와 사용자 제스처 동작을 확인합니다. |
| 9 | 패시브 BLE 스캔 | `showPassiveConsent`, `ble:scan:passive`, `rescue:observe:passive` | 동의 경로가 완료될 때까지 전체 광고 스캔이 차단되는지 확인합니다. |
| 10 | BLE 전송 한계 | `nativeAdvertise`, `writeGatt`, `sendPacket` | 브라우저 네이티브 광고 전송이 보편적으로 가능하다고 표현되지 않는지 확인합니다. |
| 11 | GATT 경로 | `connectGatt`, `subscribeGatt`, `writeGatt` | 실제 기기에서 피어 연결, 특성 조회, 알림 구독, 쓰기 동작을 확인합니다. |
| 12 | 음향 폴백 | `registerModule('Acoustic'` | RX/TX, 프레임 형식, CRC, TDMA, 모드 선택, 원시 오디오 비지속성, 실패 처리를 확인합니다. |
| 13 | QR/SVG SOS 카드 | `registerModule('QREncoder'`, `registerModule('SOSCard'` | 로컬 SVG 생성과 외부 QR 서비스, canvas, iframe, embed, object, 네트워크 요청의 부재를 확인합니다. |
| 14 | 시각/촉각 비콘 | `FlashBeacon`, `VibrationBeacon` | 명시적 권한 및 사용자 활성화 요건을 확인합니다. |
| 15 | 구조 평가 로직 | `registerModule('RescueAI'`, `AICoder` | 우려값을 신원, 정확한 위치, 조난 인증이 아닌 분류 증거로만 취급합니다. |
| 16 | 큐 동작 | `registerModule('SosQueueV6'` | 우선순위, 중복 제거, TTL, 재시도, 만료, 플러시 동작을 검토합니다. |
| 17 | 현장 증거 | `registerModule('FieldMatrix'`, `registerModule('VirtualFieldTest'` | 증거 기록이 로컬이고 위생 처리되어 있으며 인증 주장이 아닌지 확인합니다. |
| 18 | 디버그 내보내기 | `registerModule('DebugMode'`, `?debug=1`, 내보내기 경로 | 디버그 출력이 가시적으로 표시되고, 로컬 전용이며, 위생 처리되어 있는지 확인합니다. |
| 19 | 유휴 자동 삭제 | `registerModule('IdleTimeout'` | 타임아웃, 라디오 중지, 자동 삭제 경로, 브라우저 샌드박스 한계 공개를 확인합니다. |
| 20 | UI 바인딩 및 안전 렌더링 | `registerModule('UI'`, `Dom.setText`, DOM ID | 사용자 제어 텍스트가 안전한 텍스트 경로를 사용하고 민감한 컨트롤이 가시적인지 확인합니다. |

---

## 12. 보안 및 개인정보 보호 제어

### 12.1 검사할 제어 항목

- 외부 스크립트 또는 스타일시트 의존성이 없는 단일 파일 오프라인 설계.
- CSP가 `connect-src none`을 통해 네트워크 연결 대상을 차단합니다.
- 런타임 `NetworkGuard`가 일반적인 JavaScript 외부 전송 프리미티브를 차단합니다.
- 재귀적 위생 처리기가 위험한 키와 일반적인 PII형 값을 편집합니다.
- 사용자 제어 렌더링이 `innerHTML` 대신 텍스트 지향 DOM 경로를 사용합니다.
- 패시브 BLE 스캐닝은 이중 사용이므로 동의 게이트 처리됩니다.
- 원시 오디오는 지속되지 않습니다.
- 신원은 기본적으로 임시 세션 동작으로 설정됩니다.
- 보존 기간이 짧고 명시적입니다.
- 삭제는 가시적 컨트롤과 키보드 단축키를 통해 가능합니다.

### 12.2 검토 주의 사항

- 인라인 스크립트는 단일 파일 오프라인 전달을 위한 의도적인 트레이드오프입니다. XSS 위험과 렌더링 경로를 검토하십시오.
- Web Bluetooth 기능은 브라우저와 플랫폼에 따라 다릅니다.
- Wake Lock이 요청된 경우에도 브라우저 백그라운드 실행이 중지될 수 있습니다.
- JavaScript 삭제는 브라우저 샌드박스 외부에서 포렌식 삭제를 보장할 수 없습니다.
- 음향 전달은 소음, AGC, 마이크 필터링, 바람, 비, 모바일 브라우저 정책 한계로 인해 실패할 수 있습니다.
- 거버넌스, 안내, 동의, 보존, 삭제 규칙이 제거되면 패시브 BLE 감지가 감시 위험을 초래할 수 있습니다.

---

## 13. 현장 증거 프로토콜

### 13.1 최소 사전 훈련 절차

1. BLE 스캐닝을 위해 지원되는 Android 또는 데스크톱 Chromium 기반 기기를 사용합니다.
2. HTML 파일을 로컬에서 엽니다.
3. 역할, 프로파일, 그룹, 신원 모드, TTL, 측정 전력, 경로 손실 지수를 선택합니다.
4. Start Core를 누릅니다.
5. Run Self Tests를 실행합니다.
6. Run Field Matrix를 실행합니다.
7. Run Virtual Field Test를 실행합니다.
8. 알려진 VitalGuard 노드로 BLE 프로토콜 스캔을 테스트합니다.
9. 인가되고, 안내가 게시되고, 동의를 인식하는 환경에서만 패시브 스캔을 테스트합니다.
10. 대상 기기 종류에서 오디오 TX/RX, 오디오 비콘, 플래시 비콘, 진동 비콘, QR/SVG 카드를 테스트합니다.
11. 위생 처리된 감사 및 현장 증거 JSON 파일을 내보냅니다.
12. 기기 인계 또는 보관 전에 Emergency 7-Pass Wipe를 실행합니다.

### 13.2 필수 실제 증거 필드

| 증거 영역 | 기록할 내용 |
|---|---|
| 기기 | 모델, OS 버전, 브라우저 버전, 배터리 상태, 충전 상태 |
| BLE | 스캔 지원, 프로토콜 스캔 결과, 패시브 스캔 동의 스크린샷/노트, 알려진 비콘 범위 |
| 음향 | 스피커 볼륨, 마이크 설정, 거리, 소음 조건, RX 패킷 카운터, CRC 통과/실패 |
| 시각/촉각 | 토치 지원, 진동 지원, 성공/실패 노트 |
| 전력 | 30분 및 2시간 듀티 사이클 증거, Wake Lock 상태, 열 상태 |
| 삭제 | 저장소 채워짐, 삭제 실행, 이후 저장소 확인 |
| 비-외부통신 | 브라우저 네트워크 패널 또는 제어된 오프라인 테스트 결과 |
| 오탐지 | 일반 방문자/그룹/휴식 시나리오와 관측된 우려값 |
| 긴급 시나리오 | 정지, 불규칙, 수변, 외딴 도로, 야간/시간대 위험 훈련 |

---

## 14. 운영자 빠른 시작

1. 훈련 지역과 일치하는 환경 프로파일을 선택합니다.
2. 노드가 게시된 고정 Sentinel이 아닌 경우 신원 모드를 임시로 유지합니다.
3. Start Core를 실행합니다.
4. Run Self Tests와 Field Matrix를 실행합니다.
5. 알려진 VitalGuard 노드에 BLE Protocol Scan을 사용합니다.
6. 인가, 안내, 동의 프롬프트가 있는 경우에만 Passive BLE Scan을 사용합니다.
7. 우려값을 신원이나 정확한 위치 결론이 아닌 분류 신호로 취급합니다.
8. SOS 보드, 오디오 비콘, 플래시 비콘, 진동 비콘, QR/SVG 카드를 폴백 채널로 사용합니다.
9. 위생 처리된 감사/증거 기록만 내보냅니다.
10. 훈련, 사건, 또는 양도 후 기기를 삭제합니다.

---

## 15. 커스터마이징 가이드

| 변경 대상 | 수정 위치 | 필요한 후속 조치 |
|---|---|---|
| 환경 임계값 | `Profiles` 및 상태 구성값 | RSSI 재캘리브레이션, 가상 및 실제 현장 테스트 재실행 |
| 새 패킷 유형 | `PACKET`, `PacketCodec`, 큐 우선순위값, 릴레이 정책 | 자가 테스트 및 내보내기 증거 추가 |
| 새 민감 작업 | `Ethics.OP_POLICY` + 호출 사이트 | 동의/게이트 감사 및 자가 테스트 추가 |
| 새 UI 버튼 | HTML ID, `UI.bind()`, 렌더 경로 | 키보드 접근성 및 안전 렌더링 확인 |
| 새 내보내기 필드 | 내보내기 빌더 + 위생 처리기 | 기본값으로 PII/원시 식별자/정밀 좌표가 유출되지 않는지 확인 |
| 새 오디오 프로파일 | `Acoustic` 주파수, 프레임, TDMA 설정 | 대상 기기에서 테스트 및 음향 한계 업데이트 |
| 더 긴 보존 기간 | `RETENTION` 및 현장 문서화 | 개인정보, 법적 입장, VECE 거버넌스 재평가 |
| 외부 통합 | 이 아티팩트 내에 일반 네트워크 호출을 추가하지 않음 | 별도의 검토된 게이트웨이/네이티브 래퍼 사용 |

---

## 16. 알려진 문제 및 배포 준비 참고 사항

### 16.1 공개 배포 전 소규모 정리

- 변경 이력의 의도적인 부분이 아닌 나머지 호환성/이력 `1.7.0` 참조를 교체합니다. 발견 횟수: 6회.
- 변경 이력의 의도적인 부분이 아닌 나머지 호환성/이력 `V7.0` 참조를 교체합니다. 발견 횟수: 6회.
- 흔들기 트리거 삭제가 실제로 구현되어 있는지, 아니면 UI/매니페스트 언어에만 설명되어 있는지 확인합니다. 구현되지 않은 경우 해당 주장을 제거하거나 트리거를 추가합니다.
- `SosQueueV6`의 이름을 변경하거나 가시적 패널에 `SosQueueV7 Priority Queue`라고 표시되어 있으므로 호환성 이름으로 일관되게 문서화하는 것을 고려합니다.
- 실제 현장 검증 후 테스트된 브라우저/기기 버전의 소규모 표를 추가합니다.
- 광범위한 배포를 위해 단일 파일 서비스 워커 확실성을 주장하는 대신 프로덕션 PWA/네이티브 래퍼 아티팩트를 분리합니다.

### 16.2 협상 불가 주장 한계

- 보장된 구조를 주장하지 않습니다.
- RSSI에서 정확한 위치를 주장하지 않습니다.
- 보편적인 iOS 메시 노드 지원을 주장하지 않습니다.
- 검증된 네이티브 브리지 또는 하드웨어 비콘이 없는 경우 브라우저 네이티브 BLE 광고 TX를 주장하지 않습니다.
- 브라우저 접근 가능한 상태를 넘어선 포렌식 삭제를 주장하지 않습니다.
- 측정된 증거 없이 음향 전달 인증을 주장하지 않습니다.

---

## 17. 문제 해결

| 증상 | 가능한 원인 | 조치 |
|---|---|---|
| BLE 스캔 버튼 실패 | 지원되지 않는 브라우저, 비보안 컨텍스트, 권한 거부, 사용자 제스처 누락 | 지원되는 Android/데스크톱 Chromium 사용, 권한 확인, 명시적 버튼 누르기로 시작 |
| 패시브 스캔 차단 | 동의 미수락 또는 OP_POLICY 게이트 트리거 | 동의 텍스트 읽기, 인가된 배포 확인, UI를 통해 재시도 |
| 오디오 TX/RX 없음 | AudioContext 일시 중단, 마이크 권한 거부, 기기 필터링, 소음 환경 | 오디오 시작/캘리브레이션 버튼 누르기, 거리 줄이기, 소음 줄이기, 가청 모드 먼저 사용 |
| QR 카드 미표시 | QR 생성 실패 또는 이미지 업데이트 지연 | QR 자가 테스트 실행, 다시 생성, 로컬 SVG 데이터 URL 확인 |
| Field Matrix에 수동 필요 항목 존재 | 업타임/전력 증거 부족 또는 지원되지 않는 기능 | 런타임 계속 또는 지원되지 않는 기능 솔직하게 기록 |
| 디버그 내보내기가 희박해 보임 | 디버그 모드 비활성화 또는 설계에 의해 위생 처리됨 | `?debug=1` 또는 Ctrl+Shift+D 활성화; 원시 식별자를 기대하지 않음 |
| 삭제로 포렌식 삭제 불가 | 브라우저/OS/플래시 내부가 JS 제어 외부에 있음 | 삭제를 최선형으로 취급하고 고위험 작업에 전용 기기/암호화된 OS 저장소 사용 |
| 군중 속에서 우려값 높음 | 조밀한 그룹/기기 동작 또는 프로파일 임계값 | 프로파일 조정, FieldMatrix/VirtualFieldTest 사용, 오탐지 훈련 기록 |

---

## 18. 공용 진단 API

이 아티팩트는 검토자 사용을 위한 소규모 진단 별칭을 노출합니다:

```javascript
window.VitalGuardClosedBeta17TestV7.runSelfTests()
window.VitalGuardClosedBeta17TestV7.runFieldMatrix()
window.VitalGuardClosedBeta17TestV7.runVirtualFieldTest()
window.VitalGuardClosedBeta17TestV7.status()
window.VitalGuardClosedBeta171TestV71.status()
```

상태 객체에는 버전, 표시 버전, 테스트 버전, 가드 상태, 워치독 상태, 등록된 모듈, 현장 테스트 수, 가상 현장 상태, 큐 통계, QR 자가 테스트 결과, 음향 자가 테스트 결과, 게이트 수가 포함됩니다.

---

## 19. 권장 최종 배포 체크리스트

- 이력 변경 이력 맥락을 보존하면서 의도하지 않은 이전 1.7.0/V7.0 레이블을 제거합니다.
- 적어도 하나의 지원 브라우저에서 모든 자가 테스트가 통과하는지 확인합니다.
- 네트워크 패널에서 외부 리소스 로드가 없는지 확인합니다.
- 전체 광고 스캔 전에 패시브 BLE 동의 모달이 나타나는지 확인합니다.
- 위생 처리된 감사 내보내기에 기본값으로 원시 MAC형 식별자, 전화번호형 문자열, 이메일, 원시 오디오, 정밀 좌표가 포함되지 않는지 확인합니다.
- 현장 증거 내보내기가 지원되지 않는 기능을 솔직하게 기록하는지 확인합니다.
- 긴급 삭제가 브라우저 접근 가능한 저장소를 지우고 신원을 회전하는지 확인합니다.
- QR/SVG 카드 생성이 오프라인에서 작동하는지 확인합니다.
- 단거리 및 적어도 하나의 소음 시나리오에서 음향 RX/TX 동작을 확인합니다.
- 대상 기기 종류에 대한 배터리 및 Wake Lock 참고 사항이 기록되는지 확인합니다.
- 백그라운드 BLE 또는 실제 BLE 광고 TX가 필요한 경우 별도의 네이티브 래퍼 또는 분리된 PWA를 준비합니다.

---

## 20. 검토자 대상 설명

검토 패키지에서 이 아티팩트를 설명해야 할 때 다음 중립적 표현을 사용하십시오:

> VitalGuard Bluetooth Swarm + Ultrasonic Mesh Closed Beta 1.7.1 (Test V7.1)은 인도주의적 연속성 시나리오를 위한 단일 파일, 외부 의존성 없음, 로컬 전용 BLE 근접 및 폴백 통신 프로토타입입니다. 범위 지정 UI, 내장 윤리적 매니페스트, 재귀적 위생 처리, 런타임 비-외부통신 차단, 단기 패시브 관측, 로컬 우려값 계산, 현장 증거 기록, 브라우저 기능 공개를 사용합니다. 이는 인증된 구조 기기, 의료 기기, 법 집행 시스템, 보장된 감지 또는 전달 제품이 아니며, 훈련된 수색 및 구조 절차의 대안이 아닙니다.

---

## 21. 부록 — 추출된 상수 및 구조적 사실

| 상수 | 값 |
|---|---|
| `APP_VERSION` | `'1.7.1-cbt'` |
| `TEST_VERSION` | `'V7.1'` |
| `APP_DISPLAY_VERSION` | `'Closed Beta 1.7.1 (Test V7.1)'` |
| `SERVICE_UUID` | `'7d6b7001-5654-414c-4755-415244563730'` |
| `CHARACTERISTIC_UUID` | `'7d6b7002-5654-414c-4755-415244563730'` |
| `MAGIC` | `0x5647` |
| `VERSION_BYTE` | `7` |
| `STORE_PREFIX` | `'vg7_cbt_'` |
| `DB_NAME` | `'VitalGuard_CBT_1_7_1_Test_V7_1_LocalOnly_DB'` |
| `MAX_LOG` | `360` |
| `MAX_TRACKS` | `700` |
| `DEFAULT_TTL` | `7` |

### 구조적 스캔 결과

| 검사 항목 | 결과 |
|---|---|
| `prompt()` 호출 | 0 |
| `alert()` 호출 | 0 |
| `eval()` 호출 | 0 |
| `new Function` | 없음 |
| `innerHTML` 사용 | 0 |
| 직접 `localStorage.setItem` 사용 | 0 |

---

한국어 매뉴얼 끝.

---

© 2026 Morgan J. (Gyu-min Jeon) | M-Corp Ethical AI  
M-Corp Ethical AI 라이선스 (Hippocratic 3.0 파생 라이선스)  
오직 민간·농업·인도주의 목적에 한해 사용 가능  
연락처: contact@mcorpai.org | mcorpai.org

---

V2.0 중립 감사자 매뉴얼 끝.
