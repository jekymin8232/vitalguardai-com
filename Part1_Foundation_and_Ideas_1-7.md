# VitalGuard 다층 생존 아키텍처

## 권위주의 환경 활동가를 위한 브라우저 제약 회복력 프레임워크

### OTF Security Lab #21441 및 Radically Open Security 감사 대응 기술 부록

---

**저자**: 전규민 (영문: Gyu-min Jeon, 필명: Morgan J.)
**소속**: M-Corp Ethical AI, Project Director
**연락**: contact@mcorpai.org
**작성일**: 2026년 5월
**버전**: v1.0 (Working Draft)
**문서 분량**: A4 50장 이상 (상세형, 의사 코드 포함)

---

© 2026 Morgan J. (Gyu-min Jeon) | M-Corp Ethical AI
M-Corp 윤리적 AI 라이선스 (Hippocratic 3.0 파생 라이선스)
오직 민간·농업·인도주의 목적에 한해 사용 가능

---

## 목차

**Part 1 — 토대 및 아이디어 1~7 (계층 1: 흔적 회피)**
- 1장. 요약 (Executive Summary)
- 2장. 문제 설정
- 3장. 위협 모델
- 4장. 설계 철학: Always-On에서 Triggered-On으로
- 5장. 계층 1 — 흔적 회피 (일상 모드)
  - 아이디어 1: PWA + 잠금화면 위젯 벡터
  - 아이디어 2: 물리적 제스처 트리거 (DeviceMotion)
  - 아이디어 3: QR 코드 광학 메시 릴레이
  - 아이디어 4: 종이 시드 + 음성 메모 복원
  - 아이디어 5: 군집 심박 네트워크
  - 아이디어 6: 트로이의 게임 위장
  - 아이디어 7: LoRa USB 외장 페어링

**Part 2 — 아이디어 8~15 (계층 2-3: 저빈도 동기화 및 사용자 트리거 위기 발동)**

**Part 3 — 아이디어 16~22 (계층 4-5: 채널 우회 및 최후의 보루)**

**Part 4 — 통합 아키텍처, 결합 예제, 결론, 부록**

---

# 1장. 요약 (Executive Summary)

본 문서는 VitalGuard의 다층 생존 아키텍처를 제시한다. VitalGuard는 권위주의 환경에서 활동하는 활동가, 언론인, 취약 인구를 위한 오프라인 인도주의 AI 시스템이다. 본 문서는 2027년에서 2028년 사이 단계적으로 적용될 것으로 예상되는 브라우저 벤더의 Web Bluetooth 및 백그라운드 오디오 API 제한에 대응하는 작업 가설로 작성되었다.

본 아키텍처는 브라우저 샌드박스 제한을 임시방편으로 우회하는 대신, 패러다임 전환 자체를 중심에 둔다. "24시간 상시 작동" 가정에서 "결정적 순간 트리거 작동" 통신으로의 전환이다. 본 프레임워크는 원칙적으로 현재의 백그라운드 실행 기법이 제한된 조건에서도 VitalGuard가 운영 가능한 상태를 유지할 수 있는 경로를 제시한다.

본 문서는 잠정적 문제 설정이자 기술 검토를 위한 초청으로 제시된다. 완성된 구현이나 확정된 설계를 제시하는 것은 아니다. OTF Security Lab 검토 패널 및 배정될 감사 벤더의 비판적 피드백이 있다면 깊이 감사할 것이다.

총 22개의 아이디어가 5개 계층으로 분류되어 제시된다. 각 아이디어는 (1) 원리, (2) 교차 영역 유추, (3) 의사 코드 및 바닐라 JS 구현 스니펫, (4) 한계 및 결합 권장사항을 포함한다. 본 문서가 다루는 아이디어들은 모두 외부 라이브러리 없는 바닐라 HTML/JavaScript 단일 파일 아키텍처를 유지하며, 100% 오프라인 작동 원칙을 준수한다.

---

# 2장. 문제 설정

## 2.1 브라우저 샌드박스의 점진적 침식

VitalGuard는 현재 형태(v4.3.8 계열)에서 기기 화면이 꺼져 있을 때도 애플리케이션이 운영 응답성을 유지할 수 있도록 하는 두 가지 브라우저 기능에 의존한다. Web Bluetooth 스캔과 백그라운드 오디오 컨텍스트 유지가 그것이다. 최근 브라우저 벤더 워킹 그룹의 공개 자료 및 업계 분석에 따르면, 두 기능 모두 점진적으로 제한되고 있다.

### 현재 상황 (2025-2026)

**Web Bluetooth**:
- Apple WebKit은 핑거프린팅 위험을 이유로 Web Bluetooth를 전혀 구현하지 않고 있다. 모바일 Safari에는 2026년 현재까지 단 1바이트의 Web Bluetooth 코드도 포함되지 않았다.
- Chromium 기반 브라우저는 조건부로 허용하지만, 안드로이드 OS 수준의 배터리 최적화가 사용자 가시 포그라운드 서비스 알림이 없는 백그라운드 BLE 스캔을 점점 더 강하게 억제하고 있다. 명시적인 ScanFilter가 없거나 포그라운드 서비스 알림이 없는 스캔은 수 분 내로 아무런 에러 메시지 없이 마스킹되거나 소리 없이 중단된다.

**백그라운드 오디오**:
- Google은 2025년 2월에 배포한 Chrome 133 버전부터 Energy Saver 모드가 켜졌을 때 CPU 점유율이 높은 백그라운드 탭을 강제로 동결(Freezing)시키는 정책을 공식 도입했다.
- 오디오를 재생하고 있더라도 화면이 꺼진 상태에서 BLE 스캔 연산 등으로 인해 백그라운드 CPU 소모가 감지되면, 브라우저가 탭의 생명주기를 강제로 Freeze 상태로 전환한다.

### 예상 차단 시점 (2027-2028)

**오디오 꼼수 종말 시나리오 (2027년 예상)**:
브라우저 오디오 엔진이 오디오 데이터를 분석하여 "인간 가청 주파수 외 영역" 혹은 "실질적 무음 데이터"가 무한 루프로 재생되는 것을 감지하면, 이를 가짜 오디오 탭으로 자동 분류하고 백그라운드 자원을 즉시 회수하는 패치가 논의 중이다. 이 패치가 메인스트림 Chromium 엔진에 병합되는 순간 Audio Keepalive는 완전히 끝난다.

**Web Bluetooth 백그라운드 완전 단절 (2028년 예상)**:
Google I/O 2026 이후 브라우저의 패러다임은 사용자를 돕는 AI 에이전트와 극단적인 온디바이스 배터리 최적화로 향하고 있다. 모바일 Chrome마저도 "탭이 포그라운드에 있을 때만 Web Bluetooth 스트림을 유지하고, 탭이 가려지거나 화면이 꺼지면 하드웨어 소켓을 물리적으로 Close한다"는 엄격한 정책을 표준화할 가능성이 매우 높다.

VitalGuard v4.3.8이 의존하는 기법들이 2027-2028년경에는 대체로 사용할 수 없게 될 것이라고 예상하는 것이 합리적일 수 있다. 본 문서가 다루고자 하는 질문은 현재 구현을 패치할 수 있는가가 아니라, 그 기반이 되는 임무, 즉 위험에 노출된 개인을 위한 흔적 최소화 비상 통신을 다른 토대 위에서 재구축할 수 있는가이다.

## 2.2 네이티브 앱 전환이 답이 아닌 이유

브라우저 샌드박스 침식에 대한 일반적인 권고는 네이티브 애플리케이션(Android APK, iOS IPA) 또는 하이브리드 래퍼(Capacitor, Tauri)로의 이전이다. 일반 소비자 애플리케이션에는 합리적인 권고이다. VitalGuard의 경우, 권위주의 배포 환경에서는 이 권고에 대한 신중한 재검토가 필요할 수 있다.

**네이티브 앱 전환의 위험성**:

첫째, APK 설치는 기기 패키지 매니저(안드로이드의 `/data/system/packages.xml`)에 영구 기록을 생성하며, 이는 일부 권위주의 관할권의 보안 검문에서 일상적으로 검사된다. 검문관이 `pm list packages` 명령어를 실행하면 모든 설치된 앱이 노출된다.

둘째, 코드 서명 인증서는 개발자 신원과의 포렌식 연결을 만들어 사용자뿐 아니라 개발자의 안전도 위협할 수 있다. 인증서 해시는 변경할 수 없으며, 한번 추적된 인증서로 서명된 모든 앱이 동시에 식별될 수 있다.

셋째, 공식 스토어(Google Play, App Store) 배포는 권위주의 정부가 압박할 수 있는 단일 차단 지점을 도입한다. 정부가 스토어 운영사에 요청하면 특정 지역에서 앱이 즉시 사라질 수 있다.

넷째, 네이티브 바이너리는 비전문 사용자와 현장 감사자가 검증하기 더 어려우며, 이는 M-Corp 윤리적 AI 10원칙의 투명성 원칙(원칙 2)을 약화시킨다.

따라서 본 문서가 제안하는 프레임워크는 바닐라 HTML/JavaScript 단일 파일 아키텍처를 유지하면서, 웹 플랫폼을 떠나지 않는 대안 경로들을 탐색한다.

---

# 3장. 위협 모델

## 3.1 적대자 프로필

본 프레임워크는 다음과 같은 적대자 역량에 대응하여 설계된다. 이는 여러 관할권의 공개 문서화된 관행에서 도출된 복합 프로필이다. 특정 정부에 대한 주장이 아니라, 설계 목적의 작업용 복합 프로필이다.

| 역량 | 설명 | 설계 대응 |
|------|------|----------|
| 기기 압수 | 폰의 물리적 검사, 설치된 패키지·파일 시스템·브라우저 히스토리 점검 | PWA 전용 배포, 패키지 매니저 흔적 없음, 데드맨 타임아웃 시 자동 삭제 |
| 네트워크 감청 | 셀룰러·Wi-Fi·위성 트래픽의 수동 감시, TLS 다운그레이드 시도, CA 핀닝 우회 | 제로 서버 아키텍처, P2P 및 오프라인 채널, 감시할 트래픽 없음 |
| 무선 감시 | BLE 비콘 스캔, Wi-Fi 프로브 요청 캡처, IMSI 캐처, RF 스펙트럼 모니터링 | 버스트 모드 작동, QR·광학·음향 폴백, 군집 브로드캐스트 난독화 |
| 강압 | 강제 잠금 해제, 협박 하에 비밀번호 요구 | 강요 코드(Duress code), UI 더블 레이어, 비밀 분산 |
| 비밀 구금 | 공식 인정 없이 장기간 격리 구금 | 시간차 데드맨 스위치, 군집 심박 경보 |
| 공급망 공격 | 앱 스토어 또는 배포 채널 압박을 통한 악성 버전 강제 배포 | 외부 의존성 제로, 단일 파일 검증 가능, 종이 시드 부활 |

## 3.2 적용 범위 외 (Out of Scope)

본 프레임워크는 다음 사항에 대한 방어를 시도하지 않는다.

1. NSO급 역량을 갖춘 국가 행위자에 의한 표적화된 브라우저 제로데이 익스플로잇
2. 설치 이전의 물리적 기기 침해(공급망 공격)
3. 사용자에 대한 고문에 더해 모든 동료를 장기간 감시하는 강압
4. 사용자가 자발적으로 모든 비밀을 공개하는 모든 시나리오

이는 프레임워크의 실패가 아니라, 기술적 수단이 정치적·법적·제도적 보호에 자리를 양보해야 하는 경계를 나타낸다. 프레임워크의 목표는 적대자 행동의 비용을 높이는 것이지, 불가능하게 만드는 것이 아니다.

## 3.3 사용자 페르소나

본 아키텍처는 다음 페르소나들의 사용 시나리오를 가정하여 설계된다.

**페르소나 A: 도시 활동가**
- 환경: 인터넷은 사용 가능하나 감시 대상
- 위협: 디지털 추적, 가택 수색, 강제 잠금 해제
- 주요 사용 계층: 1, 2, 3

**페르소나 B: 시골/난민 캠프 거주자**
- 환경: 인터넷 간헐적, 전력 불안정, BLE만 작동
- 위협: 물리적 강제 이동, 통신 차단
- 주요 사용 계층: 1, 2, 4, 5

**페르소나 C: 비밀 구금 위험자**
- 환경: 체포 직전, 곧 격리될 가능성 높음
- 위협: 비밀 구금, 증거 압수, 가족과의 단절
- 주요 사용 계층: 2 (시간차 데드맨), 5 (분산 신원)

**페르소나 D: 언론인 및 인권 변호사**
- 환경: 도시, 인터넷 가능
- 위협: 정보원 노출, 증거 압수
- 주요 사용 계층: 1, 4, 5 (Shamir 분산)

---

# 4장. 설계 철학

## 4.1 Always-On에서 Triggered-On으로

본 아키텍처의 핵심 개념적 전환은 상시 작동 가정의 포기이다. 이전 VitalGuard 설계는 지속적인 백그라운드 BLE 스캔을 기본 요구사항으로 취급했다. 재검토 결과, 이 가정은 소비자용 피트니스 트래커 설계 패턴의 잔재일 수 있으며, 고위험 사용자의 실제 운영 요구에 잘 맞지 않을 수 있다.

위험에 노출된 활동가에게 필요한 것은 24시간 감시 수준의 상황 인식이 아니라 결정적 순간 통신이다. 체포 직전의 수 초, 가택 수색 중의 1분, 적발과 증거 파괴 사이의 짧은 시간이다. 프레임워크가 이 결정적 순간 역량을 제공할 수 있다면, 지속적 백그라운드 작동은 불필요해지며, 그렇지 않다면 치명적이었을 브라우저 샌드박스 제한이 관리 가능한 수준이 된다.

**기존 사고 모델**:
```
백그라운드 24시간 BLE 스캔 → 위험 감지 → 알림
```

**전환된 사고 모델**:
```
물리적 트리거 → 30초 활성화 창 → 송출 및 데드맨 무장 → 소멸
```

이 전환을 받아들이면 브라우저 백그라운드 제약 자체가 무의미해진다. 브라우저가 백그라운드에서 무엇을 막든, 사용자가 능동적으로 트리거하는 0.5초의 포그라운드 창에서는 모든 권한이 정상적으로 작동한다.

## 4.2 다층 방어 (Defence in Depth)

본 아키텍처는 생존 메커니즘을 5개 계층으로 조직한다. 최고 운영 빈도와 최저 위험에서 최저 운영 빈도와 최고 위험으로 정렬된다. 각 계층은 다른 계층과 독립적으로 기능하도록 설계되어, 한 계층의 실패 또는 억제가 전체 임무를 위협하지 않는다.

| 계층 | 운영 맥락 | 주요 채널 | 위험 수준 |
|------|----------|----------|----------|
| 계층 1 | 일상 / 흔적 회피 | PWA, 알람 트리거, UI 더블 레이어, 음악 스테가노그래피 | 낮음 (은닉) |
| 계층 2 | 저빈도 동기화 | 군집 심박, 시간차 데드맨, 자기파괴 책, Service Worker 자가 푸시 | 중간 |
| 계층 3 | 사용자 트리거 위기 발동 | 흔들기 트리거, 음성 명령, 침묵의 통화, WebRTC P2P | 높음 |
| 계층 4 | 채널 우회 (검열) | QR 릴레이, 카메라 플래시 모스, Wi-Fi SSID, 침묵의 합창 | 높음 |
| 계층 5 | 최후의 보루 | 종이 시드, Shamir 분산, LoRa USB, 분산 신원, 게임 위장, 걸음걸이 | 결정적 |

## 4.3 윤리적 제약 (M-Corp 10원칙)

모든 아이디어는 M-Corp 윤리적 AI 10원칙에 부합해야 한다. 본 아키텍처와 직접 관련된 원칙들은 다음과 같다.

- **원칙 1 (환각 최소화)**: 모든 보안 결정은 명확한 규칙 기반으로 작동하며, AI 추론에 의존하지 않는다.
- **원칙 2 (투명성)**: 모든 코드는 바닐라 JS로 작성되어 검증 가능하다. 외부 라이브러리 없음.
- **원칙 4 (데이터 착취 제거)**: 중앙 서버 없음. 모든 데이터는 사용자 기기 또는 신뢰하는 동료 기기에만 존재.
- **원칙 6 (법적 책임 제거)**: NGO/국제기구가 본 시스템을 채택해도 법적 책임을 떠안지 않는다. 사용자가 자신의 데이터를 완전히 통제한다.
- **원칙 10 (데이터 미수집 및 간단한 삭제)**: 모든 데이터는 사용자가 언제든 삭제 가능하며, 시간차 데드맨 메커니즘으로 자동 삭제도 보장된다.

---

# 5장. 계층 1 — 흔적 회피 (일상 모드)

계층 1 메커니즘은 일상적인 사용 중에 작동한다. 주된 목적은 능동적 방어가 아니라, 기기 또는 사용자를 VitalGuard 참여자로 식별할 수 있는 포렌식 시그니처의 회피이다. 이 메커니즘들은 애플리케이션의 휴면 상태 외관을 형성한다는 의미에서 항상 활성 상태이다.

---

## 5.1 아이디어 1 — PWA + 잠금화면 위젯 벡터

### 개념

Progressive Web App (PWA)은 사용자의 기존 브라우저를 통해 배포되고 "홈 화면에 추가" 메커니즘을 통해 설치되며, 기기 패키지 매니저에 항목을 남기지 않는다. 일상적인 기기 검사에서 애플리케이션은 설치된 프로그램이 아닌 브라우저 북마크처럼 보인다. 이는 우회 기법이 아니라 적어도 2018년 이래 모든 주요 모바일 브라우저의 문서화된 동작이다.

잠금화면 알림 표면(Notifications API)과 결합하면, PWA는 사용자가 잠금화면을 흘긋 볼 때 잠시 포그라운드 상태에 진입하여 BLE 및 오디오 권한을 1-2초 창 동안 복원할 수 있다. 이는 계층 2 메커니즘과 결합하여 주기적 하트비트 동기화에 충분할 수 있다.

### 교차 영역 유추

기독교 박해 시대 카타콤(지하 묘지)의 위장 전략에서 유추되었다. 기독교인들은 평범한 묘지처럼 보이는 공간 안에 종교적 실천 공간을 숨겼다. 외부에서 보면 일반 매장 시설이지만, 내부 구조를 아는 사람만이 본래의 목적에 도달했다.

### 위장 표면

가시 인터페이스는 평범한 유틸리티와 닮아야 한다. 다음 위장 옵션들이 가능하다.

- 날씨 위젯
- 메모장 또는 일기장
- 무슬림 사용자를 위한 기도 시간 알림기 (qibla 방향 표시 등)
- 칼로리 추적기
- 단순 계산기
- 운동 타이머
- 가계부

위장의 선택은 맥락에 적합하고 개별적으로 설정 가능해야 한다. 어떤 단일 위장 패턴도 모든 사용자에게 표준화되어서는 안 된다. 표준화 자체가 포렌식 시그니처가 될 수 있기 때문이다.

### 의사 코드: PWA Manifest 및 기본 구조

```html
<!-- index.html: 기존 VitalGuard 코드에 추가 -->
<link rel="manifest" href='data:application/manifest+json,{
  "name": "Weather Widget",
  "short_name": "Weather",
  "start_url": "./",
  "display": "standalone",
  "background_color": "#FFFFFF",
  "theme_color": "#4A90E2",
  "icons": [{
    "src": "data:image/svg+xml;base64,PHN2Z...",
    "sizes": "192x192",
    "type": "image/svg+xml"
  }]
}'>

<script>
// © 2026 Morgan J. (Gyu-min Jeon) | M-Corp Ethical AI
// M-Corp 윤리적 AI 라이선스 (Hippocratic 3.0 파생 라이선스)
// 오직 민간·농업·인도주의 목적에 한해 사용 가능

// PWA 설치 가능 여부 감지
window.addEventListener('beforeinstallprompt', (e) => {
  // 설치 프롬프트를 보류하고 사용자가 위장 UI에서 자연스럽게 트리거하도록 함
  e.preventDefault();
  window.__deferredInstallPrompt = e;
});

// Service Worker 등록 (외부 파일 없이 인라인)
if ('serviceWorker' in navigator) {
  const swCode = `
    self.addEventListener('install', (e) => {
      self.skipWaiting();
    });
    self.addEventListener('activate', (e) => {
      e.waitUntil(self.clients.claim());
    });
    self.addEventListener('fetch', (e) => {
      // 오프라인 우선: 캐시된 자원 우선 반환
      e.respondWith(
        caches.match(e.request).then(r => r || fetch(e.request))
      );
    });
  `;
  const blob = new Blob([swCode], { type: 'application/javascript' });
  const swUrl = URL.createObjectURL(blob);
  navigator.serviceWorker.register(swUrl);
}
</script>
```

### 잠금화면 흘긋 보기 활용 메커니즘

```javascript
// 사용자가 잠금화면을 보는 순간 visibilitychange 이벤트가 발생
// 그 1-2초 창에서 burst 작업을 수행
let lastVisibleAt = 0;
let pendingBurstWork = [];

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    lastVisibleAt = Date.now();
    // 보류된 burst 작업 실행
    executePendingBurstWork();
  }
});

function executePendingBurstWork() {
  // 1-2초 안에 완료 가능한 작업만 수행
  const deadline = Date.now() + 1500;
  while (pendingBurstWork.length > 0 && Date.now() < deadline) {
    const task = pendingBurstWork.shift();
    try {
      task();
    } catch (e) {
      // 조용히 실패 — 포렌식 흔적을 남기지 않음
    }
  }
}

// burst 작업을 큐에 추가하는 헬퍼
function queueBurst(task) {
  pendingBurstWork.push(task);
}
```

### 한계

- iOS의 PWA는 Safari의 더 엄격한 백그라운드 제한 대상으로 남아 있다.
- Notifications API 동작은 브라우저 벤더와 OS 버전에 따라 다르다.
- 잠금화면 흘긋 보기 기법은 신뢰할 수 있는 지속적 채널이 아니라 기회주의적 보충 수단으로 간주되어야 한다.
- iOS 16.4 이상에서 PWA 푸시 알림이 지원되지만, 사용자가 명시적으로 홈 화면에 추가한 경우에만 작동한다.

### 결합 권장사항

- **계층 2의 군집 심박 및 시간차 데드맨**과 결합하면 PWA의 짧은 가시성 창이 충분한 동기화 기회를 제공한다.
- **아이디어 18 (UI 더블 레이어)**와 결합하면 위장의 강도가 극대화된다.

---

## 5.2 아이디어 2 — 물리적 제스처 트리거 (DeviceMotion)

### 개념

DeviceMotion API는 가속도계 및 자이로스코프 이벤트를 브라우저에 보고하며, 대부분의 플랫폼에서 화면이 어두워지거나 잠시 꺼진 상태에서도 보고한다. 사용자가 의도적 제스처로 실행하는 짧고 독특한 흔들기 패턴은 포그라운드 등가의 활성화 트리거로 작동할 수 있다.

평소에는 앱이 완전히 죽어 있다. 배터리 소모 0, 추적 0, 로그 0. 사용자가 다음 중 하나를 하면 0.3초 안에 깨어나 30초간 burst mode로 작동한다.

- 흔들기 패턴 3회 (DeviceMotionEvent, 백그라운드에서도 일부 작동)
- 충전기 연결/분리 2회 (Battery Status API)
- 음량 버튼 시퀀스 (Web Audio의 미디어 키 이벤트)
- 두 폰을 부딪치기 (NFC tap, 권한 없이 URL trigger 가능)

### 교차 영역 유추

곰의 동면 메커니즘에서 가져왔다. 곰은 1년 중 99%는 거의 정지 상태로 있다가, 위협이 다가오면 0.5초 안에 폭발적으로 깨어난다. 평소 에너지 소모를 0에 가깝게 유지하면서도 결정적 순간의 완전한 응답성을 보존하는 자연의 우아한 해법이다.

### 의사 코드: 흔들기 감지 및 Burst Mode

```javascript
// © 2026 Morgan J. (Gyu-min Jeon) | M-Corp Ethical AI
// 흔들기 트리거 감지 모듈

const SHAKE_THRESHOLD = 15; // m/s² (조정 가능)
const SHAKE_COUNT_REQUIRED = 3;
const SHAKE_WINDOW_MS = 2000;
const BURST_DURATION_MS = 30000;

let shakeEvents = [];
let burstModeActive = false;
let burstEndAt = 0;

// iOS 13+ 에서는 권한 요청 필요
async function requestMotionPermission() {
  if (typeof DeviceMotionEvent !== 'undefined' &&
      typeof DeviceMotionEvent.requestPermission === 'function') {
    try {
      const response = await DeviceMotionEvent.requestPermission();
      return response === 'granted';
    } catch (e) {
      return false;
    }
  }
  return true; // Android 및 비-iOS는 기본 허용
}

function startShakeDetection() {
  window.addEventListener('devicemotion', handleMotion);
}

function handleMotion(event) {
  const acc = event.accelerationIncludingGravity;
  if (!acc) return;

  const magnitude = Math.sqrt(
    acc.x * acc.x + acc.y * acc.y + acc.z * acc.z
  );

  // 중력 제외 후 임계값 비교
  if (Math.abs(magnitude - 9.8) > SHAKE_THRESHOLD) {
    const now = Date.now();
    shakeEvents.push(now);

    // 윈도우 밖의 이벤트 제거
    shakeEvents = shakeEvents.filter(t => now - t < SHAKE_WINDOW_MS);

    if (shakeEvents.length >= SHAKE_COUNT_REQUIRED) {
      activateBurstMode();
      shakeEvents = []; // 재트리거 방지
    }
  }
}

function activateBurstMode() {
  burstModeActive = true;
  burstEndAt = Date.now() + BURST_DURATION_MS;

  // 30초 후 자동 비활성화
  setTimeout(deactivateBurstMode, BURST_DURATION_MS);

  // Burst Mode 작업 실행
  runBurstWorkflow();
}

async function runBurstWorkflow() {
  // 1. BLE 메시 송출 시도
  try {
    await broadcastBLEMessage(getCurrentHeartbeat());
  } catch (e) { /* 조용히 실패 */ }

  // 2. 데드맨 카운트다운 리셋
  resetDeadmanCountdown();

  // 3. 군집 동료에게 "살아있음" 신호
  try {
    await sendSwarmHeartbeat();
  } catch (e) { /* 조용히 실패 */ }

  // 4. 보류된 메시지 처리
  processQueuedMessages();
}

function deactivateBurstMode() {
  burstModeActive = false;
  // 모든 활성 채널 닫기
  closeBLEChannels();
  stopActiveListeners();
}
```

### 충전기 트리거 (배터리 이벤트)

```javascript
// 충전기 연결/분리 시퀀스를 트리거로 사용
const CHARGER_SEQUENCE_WINDOW_MS = 5000;
let chargerEvents = [];

async function startBatteryTriggerDetection() {
  if (!navigator.getBattery) return; // 일부 브라우저 미지원

  const battery = await navigator.getBattery();

  battery.addEventListener('chargingchange', () => {
    const now = Date.now();
    chargerEvents.push({ time: now, charging: battery.charging });
    chargerEvents = chargerEvents.filter(
      e => now - e.time < CHARGER_SEQUENCE_WINDOW_MS
    );

    // "연결-분리-연결-분리" 패턴 감지 (4번 토글)
    if (chargerEvents.length >= 4) {
      activateBurstMode();
      chargerEvents = [];
    }
  });
}
```

### 음량 버튼 시퀀스 (실험적)

```javascript
// 일부 PWA 환경에서 작동
// MediaSession + 키보드 이벤트 조합
let volumeKeySequence = [];
const VOLUME_PATTERN = ['up', 'up', 'down', 'up']; // 사용자별 커스텀

document.addEventListener('keydown', (e) => {
  if (e.key === 'AudioVolumeUp') volumeKeySequence.push('up');
  else if (e.key === 'AudioVolumeDown') volumeKeySequence.push('down');
  else return;

  if (volumeKeySequence.length > VOLUME_PATTERN.length) {
    volumeKeySequence.shift();
  }

  if (JSON.stringify(volumeKeySequence) === JSON.stringify(VOLUME_PATTERN)) {
    activateBurstMode();
    volumeKeySequence = [];
  }
});
```

### 한계

- iOS에서는 DeviceMotionEvent.requestPermission()이 사용자 제스처 응답으로만 호출 가능하다.
- 화면이 완전히 꺼진 상태에서는 일부 안드로이드 기기가 가속도계 이벤트를 억제할 수 있다.
- 흔들기 패턴이 너무 일반적이면 우연한 트리거가 발생할 수 있으므로, 임계값과 패턴 복잡도의 균형이 필요하다.

### 결합 권장사항

- **아이디어 15 (시간차 데드맨)**과 결합하여, burst mode 활성화가 데드맨 카운트다운 리셋의 일상적 메커니즘이 되도록 한다.
- **아이디어 12 (걸음걸이 인증)**과 결합하면 더 정교한 사용자 식별이 가능하다.

---

## 5.3 아이디어 3 — QR 코드 광학 메시 릴레이

### 개념

무선 채널이 억제되면 카메라와 화면은 사용 가능한 상태로 남는다. 서로 마주 보는 두 기기는 동적으로 갱신되는 QR 코드를 통해 광학적으로 데이터를 교환할 수 있다. 수신 기기는 getUserMedia와 바닐라 JavaScript QR 디코더를 사용하여 들어오는 프레임을 읽는다. 카메라 권한은 한 번 허용되면 세션 간 유지되며, Web Bluetooth에 영향을 미치는 백그라운드 제한의 대상이 아니다.

### 교차 영역 유추

19세기 등대 시그널링과 봉화에서 가져왔다. 시각적 신호는 도청 불가능하다. 빛은 벽을 통과하지 않으므로 통신 범위가 물리적으로 제한되며, 이는 보안상 장점이다.

### 처리량 및 오류 정정

QR Code Version 40 (오류 정정 레벨 L)은 프레임당 약 2,953바이트를 인코딩할 수 있다. 초당 3 프레임의 갱신 속도에서 지속 처리량은 초당 약 8 킬로바이트이며, 짧은 메시지·암호화된 텍스트·작은 이미지 썸네일에 충분하다. Reed-Solomon 오류 정정은 QR 사양의 본질적 부분이며, 부분 가림이나 경미한 손 떨림을 허용한다.

### 의사 코드: QR 생성 (송신측)

```javascript
// © 2026 Morgan J. (Gyu-min Jeon) | M-Corp Ethical AI
// 바닐라 JS QR 코드 생성기 (외부 라이브러리 없음)
// 간소화된 QR Code Model 2 인코더

const QR_VERSION = 10; // 약 271바이트 용량, 적당한 인쇄 크기
const QR_ERROR_LEVEL = 'L'; // 7% 오류 정정

class VanillaQRGenerator {
  constructor(version = QR_VERSION) {
    this.version = version;
    this.size = 17 + 4 * version; // QR 모듈 크기
    this.matrix = this.createMatrix();
  }

  createMatrix() {
    const m = [];
    for (let i = 0; i < this.size; i++) {
      m.push(new Array(this.size).fill(null));
    }
    return m;
  }

  // 메시지를 8비트 바이트 모드로 인코딩
  encodeBytes(data) {
    let bits = '';
    // 모드 지시자: 0100 (8비트 바이트)
    bits += '0100';
    // 문자 수 지시자 (Version 10-26: 16비트)
    bits += data.length.toString(2).padStart(16, '0');
    // 데이터
    for (const byte of data) {
      bits += byte.toString(2).padStart(8, '0');
    }
    return bits;
  }

  // Reed-Solomon 오류 정정 코드 생성 (간소화)
  generateECC(dataCodewords, eccLength) {
    // 갈루아 필드 GF(256) 다항식 연산
    // 실제 구현은 약 100줄 — 여기서는 인터페이스만 표시
    const gfExp = new Array(512);
    const gfLog = new Array(256);
    let x = 1;
    for (let i = 0; i < 255; i++) {
      gfExp[i] = x;
      gfLog[x] = i;
      x <<= 1;
      if (x & 0x100) x ^= 0x11d; // QR의 원시 다항식
    }
    for (let i = 255; i < 512; i++) gfExp[i] = gfExp[i - 255];

    // 생성 다항식 계산
    let generator = [1];
    for (let i = 0; i < eccLength; i++) {
      generator = this.polyMul(generator, [1, gfExp[i]], gfExp, gfLog);
    }

    // 데이터를 생성 다항식으로 나누어 ECC 계산
    const ecc = new Array(eccLength).fill(0);
    const buffer = [...dataCodewords, ...ecc];
    for (let i = 0; i < dataCodewords.length; i++) {
      const factor = buffer[i];
      if (factor === 0) continue;
      const logFactor = gfLog[factor];
      for (let j = 0; j < generator.length; j++) {
        buffer[i + j] ^= gfExp[(gfLog[generator[j]] + logFactor) % 255];
      }
    }
    return buffer.slice(dataCodewords.length);
  }

  polyMul(p1, p2, gfExp, gfLog) {
    const result = new Array(p1.length + p2.length - 1).fill(0);
    for (let i = 0; i < p1.length; i++) {
      for (let j = 0; j < p2.length; j++) {
        if (p1[i] !== 0 && p2[j] !== 0) {
          result[i + j] ^= gfExp[(gfLog[p1[i]] + gfLog[p2[j]]) % 255];
        }
      }
    }
    return result;
  }

  // Canvas에 QR 코드 렌더링
  renderToCanvas(canvas, data) {
    const ctx = canvas.getContext('2d');
    const moduleSize = Math.floor(canvas.width / this.size);

    // 인코딩 및 매트릭스 채우기 (간소화)
    this.placeFinderPatterns();
    this.placeTimingPatterns();
    this.placeData(data);
    this.applyMask(0); // 마스크 패턴 0

    // 렌더링
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000000';
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        if (this.matrix[y][x] === 1) {
          ctx.fillRect(x * moduleSize, y * moduleSize, moduleSize, moduleSize);
        }
      }
    }
  }

  placeFinderPatterns() {
    // 세 모서리에 7×7 파인더 패턴 배치
    const positions = [[0, 0], [this.size - 7, 0], [0, this.size - 7]];
    for (const [px, py] of positions) {
      for (let dy = 0; dy < 7; dy++) {
        for (let dx = 0; dx < 7; dx++) {
          const isEdge = dx === 0 || dx === 6 || dy === 0 || dy === 6;
          const isInner = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4;
          this.matrix[py + dy][px + dx] = (isEdge || isInner) ? 1 : 0;
        }
      }
    }
  }

  placeTimingPatterns() {
    for (let i = 8; i < this.size - 8; i++) {
      this.matrix[6][i] = i % 2 === 0 ? 1 : 0;
      this.matrix[i][6] = i % 2 === 0 ? 1 : 0;
    }
  }

  placeData(bits) {
    // 지그재그 패턴으로 데이터 배치 (간소화)
    let bitIndex = 0;
    for (let col = this.size - 1; col > 0; col -= 2) {
      if (col === 6) col--; // 타이밍 컬럼 건너뛰기
      for (let row = 0; row < this.size; row++) {
        const actualRow = (col % 4 === 1) ? this.size - 1 - row : row;
        for (let c = 0; c < 2; c++) {
          if (this.matrix[actualRow][col - c] === null && bitIndex < bits.length) {
            this.matrix[actualRow][col - c] = parseInt(bits[bitIndex++]);
          }
        }
      }
    }
  }

  applyMask(pattern) {
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        if (this.matrix[y][x] !== null && !this.isFunctional(x, y)) {
          if ((x + y) % 2 === 0) {
            this.matrix[y][x] ^= 1;
          }
        }
      }
    }
  }

  isFunctional(x, y) {
    // 파인더, 타이밍, 정렬 패턴 여부 확인
    return (x < 9 && y < 9) ||
           (x < 9 && y >= this.size - 8) ||
           (x >= this.size - 8 && y < 9) ||
           x === 6 || y === 6;
  }
}

// 메시지를 청크로 나누어 연속 QR 프레임으로 송출
function startQRBroadcast(message, canvas) {
  const CHUNK_SIZE = 200; // 바이트
  const chunks = [];
  for (let i = 0; i < message.length; i += CHUNK_SIZE) {
    chunks.push(message.slice(i, i + CHUNK_SIZE));
  }

  let frameIndex = 0;
  const generator = new VanillaQRGenerator(10);

  const interval = setInterval(() => {
    const chunk = chunks[frameIndex % chunks.length];
    const header = `${frameIndex}/${chunks.length}|`;
    const fullData = header + chunk;
    generator.renderToCanvas(canvas, fullData);
    frameIndex++;
  }, 333); // 초당 3프레임

  return () => clearInterval(interval); // 중지 함수
}
```

### 의사 코드: QR 스캐닝 (수신측)

```javascript
// 카메라 스트림에서 QR 코드 읽기
async function startQRScanning(videoElement, onMessage) {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: 'environment' }
  });
  videoElement.srcObject = stream;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const receivedChunks = new Map();
  let expectedFrames = 0;

  const scan = () => {
    if (videoElement.readyState !== videoElement.HAVE_ENOUGH_DATA) {
      requestAnimationFrame(scan);
      return;
    }

    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    ctx.drawImage(videoElement, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const result = decodeQR(imageData); // 바닐라 JS QR 디코더

    if (result) {
      // 헤더 파싱: "프레임번호/전체수|데이터"
      const match = result.match(/^(\d+)\/(\d+)\|(.*)$/s);
      if (match) {
        const [, idx, total, chunk] = match;
        expectedFrames = parseInt(total);
        receivedChunks.set(parseInt(idx), chunk);

        if (receivedChunks.size >= expectedFrames) {
          // 모든 청크 수신 완료
          const sortedKeys = [...receivedChunks.keys()].sort((a, b) => a - b);
          const fullMessage = sortedKeys.map(k => receivedChunks.get(k)).join('');
          onMessage(fullMessage);
          receivedChunks.clear();
        }
      }
    }

    requestAnimationFrame(scan);
  };

  scan();
}

// 간소화된 QR 디코더 (바닐라 JS)
function decodeQR(imageData) {
  // 1. 그레이스케일 변환
  const gray = toGrayscale(imageData);

  // 2. 이진화 (Otsu's method)
  const binary = otsuBinarize(gray);

  // 3. 파인더 패턴 검색
  const finders = findFinderPatterns(binary, imageData.width, imageData.height);
  if (finders.length < 3) return null;

  // 4. 매트릭스 추출 및 디코딩
  // (전체 구현은 약 500줄 — 인터페이스만 표시)
  return extractAndDecodeMatrix(binary, finders, imageData.width);
}
```

### 포렌식 속성

광학 통신은 무선 시그니처를 남기지 않는다. 가시선을 넘어 교환을 감지할 수 있는 IMSI 캐처·BLE 스니퍼·Wi-Fi 분석기는 없다. 카페에 앉아 잠시 폰을 서로를 향해 놓는 두 활동가는 외부에서 관찰 가능한 통신 이벤트를 발생시키지 않는다.

### 한계

- 시선이 직접 닿아야 한다(LOS, Line of Sight).
- 빠른 속도의 QR 전환은 사용자가 폰을 안정적으로 들고 있어야 한다.
- 강한 직사광선에서는 화면 가독성이 떨어진다.

### 결합 권장사항

- **아이디어 9 (WebRTC P2P)**의 초기 시그널링(SDP 교환)을 QR로 수행할 수 있다.
- **아이디어 16 (Shamir 분산)**의 비밀 조각 전달에 QR이 이상적이다.

---

## 5.4 아이디어 4 — 종이 시드 + 음성 메모 복원

### 개념

암호화폐 도메인의 BIP-39 니모닉 시드 관행에서 차용하여, VitalGuard 노드의 핵심 암호 신원(메시에 재참여하고 분산된 증거 공유를 복호화하기에 충분한 정보)이 24개 영어 단어로 표현될 수 있다. 시드 자체는 정보이지 소프트웨어가 아니므로, 어떤 기술적 제거나 차폐의 대상도 되지 않는다. 종이 사본은 기기 파괴를 견디며, 암기 사본은 기기 파괴와 종이 압수 모두를 견딘다.

### 교차 영역 유추

비트코인 페이퍼 월렛에서 가져왔다. 가장 강력한 보안은 종종 가장 원시적이다. 정보가 종이에 있으면 어떤 네트워크 공격도, 어떤 OS 업데이트도, 어떤 브라우저 정책 변경도 그 정보를 건드릴 수 없다.

### 의사 코드: BIP-39 스타일 시드 생성

```javascript
// © 2026 Morgan J. (Gyu-min Jeon) | M-Corp Ethical AI
// 바닐라 JS BIP-39 시드 생성기 (외부 라이브러리 없음)

// BIP-39 영어 단어 목록 일부 (전체 2048단어 중 발췌)
const BIP39_WORDS = [
  'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract',
  'absurd', 'abuse', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid',
  // ... 실제로는 2048개 모두 포함
  'zone', 'zoo'
];

async function generateSeed24() {
  // 256비트 엔트로피 생성
  const entropy = new Uint8Array(32);
  crypto.getRandomValues(entropy);

  // SHA-256 체크섬의 처음 8비트 추가
  const hashBuffer = await crypto.subtle.digest('SHA-256', entropy);
  const hashArray = new Uint8Array(hashBuffer);
  const checksum = hashArray[0]; // 첫 바이트의 8비트

  // 264비트 = 24 × 11비트
  const bits = [];
  for (const byte of entropy) {
    for (let i = 7; i >= 0; i--) {
      bits.push((byte >> i) & 1);
    }
  }
  for (let i = 7; i >= 0; i--) {
    bits.push((checksum >> i) & 1);
  }

  // 11비트씩 끊어서 단어 인덱스 추출
  const words = [];
  for (let i = 0; i < 24; i++) {
    let index = 0;
    for (let j = 0; j < 11; j++) {
      index = (index << 1) | bits[i * 11 + j];
    }
    words.push(BIP39_WORDS[index]);
  }

  return words;
}

async function seedToKey(seedWords) {
  // 시드 단어를 결합하여 PBKDF2로 키 도출
  const seedPhrase = seedWords.join(' ');
  const encoder = new TextEncoder();
  const seedBytes = encoder.encode(seedPhrase);
  const salt = encoder.encode('VitalGuard mnemonic'); // BIP-39 표준 salt

  const keyMaterial = await crypto.subtle.importKey(
    'raw', seedBytes, { name: 'PBKDF2' }, false, ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 2048,
      hash: 'SHA-512'
    },
    keyMaterial,
    512
  );

  return new Uint8Array(derivedBits); // 64바이트 시드
}

async function deriveNodeIdentity(seedWords) {
  const masterKey = await seedToKey(seedWords);

  // 마스터 키에서 메시 노드 ID 도출
  const idMaterial = await crypto.subtle.digest('SHA-256', masterKey);
  const nodeId = new Uint8Array(idMaterial).slice(0, 16);

  return {
    nodeIdHex: Array.from(nodeId).map(b => b.toString(16).padStart(2, '0')).join(''),
    masterKey: masterKey
  };
}
```

### 스텔스 저장 옵션

시드는 목록으로 나타날 필요가 없다. 다음 방법들이 가능하다.

**1. 시 낭송 음성 메모**

사용자가 시 한 편을 낭송한 음성 파일을 OS 기본 음성 메모 앱에 저장한다. 시의 특정 단어 위치가 시드 단어를 인코딩한다. 예를 들어, 시의 첫 번째 명사가 시드 단어 1, 두 번째 명사가 시드 단어 2…

기기를 수색하면 누군가가 시를 낭송하는 오디오 파일이 발견되며, 이는 그 자체로 활동가 활동의 증거가 되지 않는다.

```javascript
// 시 낭송에서 시드 단어 추출 (사용자가 수동으로 매핑 정의)
function extractSeedFromPoem(poemText, wordPositionsMap) {
  const words = poemText.toLowerCase().split(/\s+/);
  const seedWords = [];

  for (const position of wordPositionsMap) {
    const word = words[position];
    if (BIP39_WORDS.includes(word)) {
      seedWords.push(word);
    } else {
      // 가장 유사한 BIP-39 단어 매핑
      const mapped = mapToClosestBIP39(word);
      seedWords.push(mapped);
    }
  }

  return seedWords;
}
```

**2. 손글씨 노트 위장**

레시피 노트, 쇼핑 목록, 일기에 선택된 단어가 시드를 전달한다. 매 5번째 단어가 시드 단어인 식이다.

**3. 가족 사진 EXIF 메타데이터**

사진의 EXIF "사진가 코멘트" 필드에 암호화된 시드를 저장한다. 일반 사진 뷰어로는 보이지 않으며, VitalGuard가 디코딩한다.

```javascript
// EXIF 메타데이터에 시드 숨기기 (간소화)
async function embedSeedInPhotoEXIF(photoBlob, encryptedSeed) {
  // JPEG의 APP1 마커에 EXIF 데이터 삽입
  const photoArray = new Uint8Array(await photoBlob.arrayBuffer());

  // 간소화: 실제로는 EXIF 구조에 따라 정밀하게 삽입
  const seedSection = new Uint8Array([
    0xFF, 0xE1, // APP1 마커
    // 길이 + EXIF 헤더 + 데이터
    ...encryptedSeed
  ]);

  // SOI(0xFFD8) 뒤에 삽입
  const result = new Uint8Array(photoArray.length + seedSection.length);
  result.set(photoArray.slice(0, 2));
  result.set(seedSection, 2);
  result.set(photoArray.slice(2), 2 + seedSection.length);

  return new Blob([result], { type: 'image/jpeg' });
}
```

### 한계

- 사용자가 시드를 잃어버리면 복구 불가능하다(이는 보안 특성이자 위험).
- 종이 시드는 자연재해(화재·물)에 취약하다. 분산 저장 권장.
- 시 위장 메커니즘은 사용자가 매핑 규칙을 기억해야 한다.

### 결합 권장사항

- **아이디어 16 (Shamir 분산)**과 결합하면 종이 시드 자체를 5개 조각으로 나누어 더 안전하게 보관할 수 있다.
- **아이디어 20 (자기파괴 책)**의 복원 키로 사용된다.

---

## 5.5 아이디어 5 — 군집 심박 네트워크

### 개념

10명의 활동가 그룹이 각자 자신의 기기에서 VitalGuard를 실행하면서 서로의 하트비트 노드로 봉사하기로 합의할 수 있다. 24시간마다 한 번씩, 사용자가 애플리케이션을 정상적으로 여는 동안, 각 기기는 BLE를 통해 다른 9명에게 짧은 "아직 여기 있음" 신호를 브로드캐스트한다. 브로드캐스트는 사용자의 의도적 제스처에 의해 생성된 포그라운드 창 내에서 완전히 발생하며, 백그라운드 제한을 비껴간다.

### 교차 영역 유추

산호초 군집과 균사체 네트워크에서 가져왔다. 개별 폴립은 약하지만 군집은 끊을 수 없다. 균사체는 숲 전체를 연결하는 거대한 네트워크를 형성하며, 한 부분이 파괴되어도 전체는 살아남는다.

### 의사 코드: 군집 심박 프로토콜

```javascript
// © 2026 Morgan J. (Gyu-min Jeon) | M-Corp Ethical AI
// 군집 심박 네트워크 모듈

class SwarmHeartbeat {
  constructor(myNodeId, peerNodeIds, masterKey) {
    this.myNodeId = myNodeId;
    this.peerNodeIds = peerNodeIds; // 신뢰하는 9명의 노드 ID
    this.masterKey = masterKey;
    this.lastSeen = new Map(); // 각 동료의 마지막 신호 시각
    this.HEARTBEAT_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24시간
    this.ALARM_THRESHOLD_MS = 48 * 60 * 60 * 1000; // 48시간
  }

  // 자신의 심박 신호 송출
  async broadcastHeartbeat() {
    const payload = {
      from: this.myNodeId,
      timestamp: Date.now(),
      version: 1
    };

    // 마스터 키로 HMAC 서명
    const hmac = await this.signPayload(payload);
    const message = {
      ...payload,
      hmac: this.bytesToHex(hmac)
    };

    // BLE 광고 패킷에 인코딩 (BLE Advertising Data는 31바이트 제한)
    // 따라서 노드 ID(16바이트) + 타임스탬프 단축(4바이트) + HMAC 단축(8바이트) = 28바이트
    const compactMessage = this.compactEncode(message);

    try {
      await this.sendBLEAdvertisement(compactMessage);
    } catch (e) {
      // BLE 실패 시 대체 채널 (예: 음향, QR)로 폴백
      await this.sendFallbackHeartbeat(message);
    }
  }

  // 동료의 심박 신호 수신 및 검증
  async onReceiveHeartbeat(rawMessage) {
    const message = this.compactDecode(rawMessage);

    // 노드 ID 검증
    if (!this.peerNodeIds.includes(message.from)) {
      return; // 알 수 없는 노드
    }

    // HMAC 검증
    const valid = await this.verifySignature(message);
    if (!valid) {
      return; // 변조된 메시지
    }

    // 타임스탬프 유효성 (1시간 이내)
    if (Math.abs(Date.now() - message.timestamp) > 60 * 60 * 1000) {
      return; // 리플레이 공격 가능성
    }

    this.lastSeen.set(message.from, Date.now());
    this.checkForMissingPeers();
  }

  // 누락된 동료 확인
  checkForMissingPeers() {
    const now = Date.now();
    const missing = [];

    for (const peerId of this.peerNodeIds) {
      const lastTime = this.lastSeen.get(peerId) || 0;
      if (now - lastTime > this.ALARM_THRESHOLD_MS) {
        missing.push({ peerId, lastSeen: lastTime });
      }
    }

    if (missing.length > 0) {
      this.triggerMissingPeerAlarm(missing);
    }
  }

  // 동료 누락 알람 발동
  async triggerMissingPeerAlarm(missing) {
    // 1. 로컬 알림 표시
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Network heartbeat anomaly', {
        body: `${missing.length} peer(s) silent for >48h`,
        silent: false
      });
    }

    // 2. 누락된 동료의 데드맨 메시지를 사전 설정된 외부 채널로 전송
    for (const { peerId } of missing) {
      const deadmanMessage = await this.getDeadmanMessage(peerId);
      if (deadmanMessage) {
        await this.dispatchDeadmanMessage(deadmanMessage);
      }
    }

    // 3. 다른 살아있는 동료에게 누락 사실 전파
    await this.propagateMissingAlert(missing);
  }

  async signPayload(payload) {
    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(payload));
    const key = await crypto.subtle.importKey(
      'raw', this.masterKey, { name: 'HMAC', hash: 'SHA-256' },
      false, ['sign']
    );
    const signature = await crypto.subtle.sign('HMAC', key, data);
    return new Uint8Array(signature);
  }

  async verifySignature(message) {
    const { hmac, ...payload } = message;
    const expectedHmac = await this.signPayload(payload);
    return this.bytesToHex(expectedHmac) === hmac;
  }

  compactEncode(message) {
    // BLE Advertising Data로 압축
    const nodeIdBytes = this.hexToBytes(message.from);
    const tsBytes = new Uint8Array(4);
    new DataView(tsBytes.buffer).setUint32(0, Math.floor(message.timestamp / 1000), false);
    const hmacBytes = this.hexToBytes(message.hmac).slice(0, 8);

    const result = new Uint8Array(28);
    result.set(nodeIdBytes, 0);
    result.set(tsBytes, 16);
    result.set(hmacBytes, 20);
    return result;
  }

  compactDecode(rawBytes) {
    const nodeId = this.bytesToHex(rawBytes.slice(0, 16));
    const timestamp = new DataView(rawBytes.buffer, rawBytes.byteOffset + 16, 4)
      .getUint32(0, false) * 1000;
    const hmacShort = this.bytesToHex(rawBytes.slice(20, 28));
    return { from: nodeId, timestamp, hmac: hmacShort, version: 1 };
  }

  bytesToHex(bytes) {
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  hexToBytes(hex) {
    const result = new Uint8Array(hex.length / 2);
    for (let i = 0; i < result.length; i++) {
      result[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    return result;
  }

  async sendBLEAdvertisement(data) {
    // Web Bluetooth Advertising은 현재 실험적
    // 대안: Eddystone 또는 iBeacon 형식으로 광고
    // 또는 ScanResponse를 통한 응답형 광고
    if (!navigator.bluetooth) throw new Error('Web Bluetooth not supported');

    // 실제 구현은 환경에 따라 다름
    console.log('BLE advertise:', this.bytesToHex(data));
  }

  async sendFallbackHeartbeat(message) {
    // 음향, QR, 또는 WebRTC로 폴백
    // 아이디어 10, 3, 9와 결합
  }

  async getDeadmanMessage(peerId) {
    // localStorage에서 사전에 동료가 위탁한 데드맨 메시지 검색
    const key = `deadman_for_${peerId}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  }

  async dispatchDeadmanMessage(deadmanMessage) {
    // 사전 설정된 채널로 전송 (이메일, 다른 동료, 등)
    // 인터넷이 있으면 이메일, 없으면 다른 동료에게 BLE 전달
  }

  async propagateMissingAlert(missing) {
    // 살아있는 동료들에게 누락 사실 전파
    for (const peerId of this.peerNodeIds) {
      if (!missing.find(m => m.peerId === peerId)) {
        await this.sendDirectMessage(peerId, { type: 'missing_alert', missing });
      }
    }
  }
}
```

### silent-witness-swarm-protocol과의 연결

본 메커니즘은 M-Corp 스킬 생태계의 silent-witness-swarm-protocol 스킬과 정렬된다. 동료의 침묵이 그 자체로 재난 신호로 해석된다. 원리는 일반화된다. 신뢰하는 동료들 사이의 생명 신호 중복성이 단일 기기 하드웨어 중복성보다 견고하다.

### 한계

- 동료들이 24시간마다 폰을 적어도 한 번은 사용해야 한다.
- 동료 그룹의 신뢰가 무너지면(예: 누군가 강압에 굴복) 전체 네트워크가 위험에 노출된다.
- 그룹 크기가 너무 크면 BLE 통신 부하 증가.

### 결합 권장사항

- **아이디어 15 (시간차 데드맨)**과 결합하여 누락 알람이 데드맨 메시지를 자동 발송하도록 한다.
- **아이디어 22 (분산 신원)**과 결합하면 군집 내에서 발신자를 특정하기 어려워진다.

---

## 5.6 아이디어 6 — 트로이의 게임 위장

### 개념

PWA는 첫 실행 및 일상 사용 중에 Tetris 또는 2048과 같은 캐주얼 게임으로 나타난다. 게임은 완전히 기능적이며 다른 캐주얼 타이틀과 구별할 수 없다. 사전에 합의되어 사용자에게만 알려진 특정 게임플레이 패턴이 애플리케이션을 운영 인터페이스로 전환시킨다.

### 교차 영역 유추

2차 세계대전 영국의 SOE(Special Operations Executive)가 사용한 책 표지 위장에서 가져왔다. 평범한 책처럼 보이지만 내부에 무전기 부품이나 비밀 문서가 숨겨져 있었다. 위장의 본질은 "기능적 진정성"이다.

### 의사 코드: 2048 게임 위장 + 비밀 트리거

```javascript
// © 2026 Morgan J. (Gyu-min Jeon) | M-Corp Ethical AI
// 2048 게임 위장 + 비밀 활성화 트리거

class GameDisguise2048 {
  constructor(secretPattern) {
    this.board = this.initBoard();
    this.score = 0;
    this.secretPattern = secretPattern; // 예: [2048, 1024, 512, 256] in specific cells
    this.moveHistory = [];
    this.SECRET_PATTERN_WINDOW = 20; // 최근 20 수 안에 패턴 형성 시 트리거
  }

  initBoard() {
    const board = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
    this.addRandomTile(board);
    this.addRandomTile(board);
    return board;
  }

  addRandomTile(board) {
    const empty = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) empty.push([i, j]);
      }
    }
    if (empty.length === 0) return false;
    const [r, c] = empty[Math.floor(Math.random() * empty.length)];
    board[r][c] = Math.random() < 0.9 ? 2 : 4;
    return true;
  }

  move(direction) {
    // direction: 'up', 'down', 'left', 'right'
    const oldBoard = this.serializeBoard();
    this.executeMove(direction);
    const newBoard = this.serializeBoard();

    if (oldBoard !== newBoard) {
      this.addRandomTile(this.board);
      this.moveHistory.push({ direction, board: newBoard, score: this.score });

      // 비밀 패턴 감지
      if (this.detectSecretPattern()) {
        this.activateVitalGuardMode();
      }
    }

    return this.board;
  }

  executeMove(direction) {
    // 표준 2048 이동 로직
    // (병합, 슬라이드 등 — 약 100줄)
    // 여기서는 인터페이스만 표시
  }

  serializeBoard() {
    return this.board.map(row => row.join(',')).join('|');
  }

  detectSecretPattern() {
    // 보드의 특정 위치에 특정 값이 있는지 확인
    // 예: 좌상단 = 2048, 우상단 = 1024, 좌하단 = 512, 우하단 = 256
    const targetPositions = [
      [0, 0, 2048],
      [0, 3, 1024],
      [3, 0, 512],
      [3, 3, 256]
    ];

    for (const [r, c, expected] of targetPositions) {
      if (this.board[r][c] !== expected) return false;
    }
    return true;
  }

  activateVitalGuardMode() {
    // 게임 UI를 숨기고 VitalGuard UI 표시
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('vitalguard-container').style.display = 'block';

    // 보안 기능 활성화
    initializeVitalGuardCore();
  }

  // 사용자가 우연히 패턴을 만들지 않도록, 보드 초기화 시
  // 의도적으로 도달하기 어려운 패턴을 선택
  static generateSecretPattern() {
    // 매우 도달하기 어려운 조합 선택
    return [
      [0, 0, 2048],
      [0, 3, 1024],
      [3, 0, 512],
      [3, 3, 256]
    ];
  }
}
```

### 패턴 표준화 회피

활성화 패턴이 모든 사용자에게 동일하다면, 그 자체가 포렌식 시그니처가 되어 단일 침해 기기에서 복구될 수 있다. 따라서 프레임워크는 첫 실행 시 로컬 엔트로피에서 도출된 개별 활성화 패턴을 생성하며, 생성 후 기기에서 복구할 수 없도록 한다. 사용자가 패턴을 암기할 것으로 기대된다.

```javascript
async function generateUniqueActivationPattern() {
  // 사용자별 고유 패턴 생성
  const entropy = new Uint8Array(16);
  crypto.getRandomValues(entropy);

  // 패턴: 4개 위치, 각 위치의 목표 값
  const pattern = [];
  for (let i = 0; i < 4; i++) {
    const r = entropy[i * 4] % 4;
    const c = entropy[i * 4 + 1] % 4;
    const valueExponent = (entropy[i * 4 + 2] % 6) + 5; // 32~2048
    pattern.push([r, c, Math.pow(2, valueExponent)]);
  }

  // 사용자에게 패턴 표시 (한 번만!)
  displayPatternToUserOnce(pattern);

  // 패턴 해시만 저장 (원본 패턴은 저장 안 함)
  const patternStr = JSON.stringify(pattern);
  const hashBuffer = await crypto.subtle.digest(
    'SHA-256', new TextEncoder().encode(patternStr)
  );
  localStorage.setItem('activation_pattern_hash',
    Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('')
  );

  return pattern;
}
```

### 한계

- 사용자가 패턴을 잊으면 본인도 VitalGuard에 접근할 수 없다.
- 검문관이 게임을 오래 즐기다 우연히 패턴을 만들 가능성은 매우 낮지만 0은 아니다.
- 패턴 입력 시간이 길어 위기 상황에서 즉시 활성화는 어렵다.

### 결합 권장사항

- **아이디어 2 (흔들기 트리거)**를 패턴 완성 후 추가 인증으로 사용.
- **아이디어 18 (UI 더블 레이어)**의 한 변형으로 볼 수 있다.

---

## 5.7 아이디어 7 — LoRa USB 외장 페어링

### 개념

WebUSB 및 WebSerial API는 단일 사용자 권한 부여 후 USB 연결 주변 장치에 대한 영구 브라우저 접근을 부여한다. Web Bluetooth를 제약하는 백그라운드 제한의 대상이 아니다. 저렴한 LoRa USB 동글(2026년 가격으로 약 10 미국 달러)은 기기의 유효 통신 범위를 BLE의 수십 미터에서 LoRa의 수 킬로미터로 확장하며, 운영 주파수를 국가 무선 감시 인프라의 주된 초점이 아닐 수 있는 대역(보통 아메리카 915 MHz, 유럽 868 MHz, 일부 지역 433 MHz)으로 전환한다.

### 교차 영역 유추

라에네크(Laennec)가 발명한 청진기에서 가져왔다. 의사의 귀로 환자의 심장 소리를 직접 들을 수 없으니, 외부 도구로 확장한 것이다. 폰의 한계를 폰 안에서 해결하려 하지 말고, 외부 하드웨어로 확장한다.

### 의사 코드: WebSerial을 통한 LoRa 통신

```javascript
// © 2026 Morgan J. (Gyu-min Jeon) | M-Corp Ethical AI
// WebSerial API를 통한 LoRa USB 동글 제어

class LoRaUSBBridge {
  constructor() {
    this.port = null;
    this.reader = null;
    this.writer = null;
    this.isConnected = false;
  }

  // 사용자 클릭으로 USB 장치 요청 (한 번만)
  async connect() {
    if (!navigator.serial) {
      throw new Error('WebSerial API not supported');
    }

    // 사용자가 LoRa 동글 선택
    this.port = await navigator.serial.requestPort({
      filters: [
        // LilyGo, Heltec 등의 VID/PID
        { usbVendorId: 0x10c4 }, // Silicon Labs CP210x (LilyGo)
        { usbVendorId: 0x1a86 }  // CH340 (일부 Heltec)
      ]
    });

    await this.port.open({
      baudRate: 115200,
      dataBits: 8,
      stopBits: 1,
      parity: 'none',
      flowControl: 'none'
    });

    this.reader = this.port.readable.getReader();
    this.writer = this.port.writable.getWriter();
    this.isConnected = true;

    this.startReceiveLoop();

    // LoRa 모듈 초기화
    await this.initializeLoRa();
  }

  async initializeLoRa() {
    // SX1276/SX1278 LoRa 칩 AT 명령어 (LilyGo T-Beam 기준)
    await this.sendCommand('AT+MODE=LWOTAA');
    await this.sendCommand('AT+FREQUENCY=915000000'); // 또는 868000000
    await this.sendCommand('AT+SPREADING_FACTOR=7'); // SF7
    await this.sendCommand('AT+BANDWIDTH=125'); // 125kHz
    await this.sendCommand('AT+CODING_RATE=4/5');
    await this.sendCommand('AT+TX_POWER=14'); // 14 dBm
  }

  async sendCommand(cmd) {
    const encoder = new TextEncoder();
    await this.writer.write(encoder.encode(cmd + '\r\n'));
    // 응답 대기 (최대 1초)
    return new Promise((resolve) => {
      setTimeout(resolve, 100);
    });
  }

  async startReceiveLoop() {
    let buffer = '';
    const decoder = new TextDecoder();

    while (this.isConnected) {
      try {
        const { value, done } = await this.reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // 줄 단위로 처리
        const lines = buffer.split('\r\n');
        buffer = lines.pop(); // 마지막은 미완성

        for (const line of lines) {
          this.handleLoRaMessage(line);
        }
      } catch (e) {
        console.error('LoRa read error:', e);
        await this.disconnect();
        break;
      }
    }
  }

  handleLoRaMessage(rawLine) {
    // LoRa 수신 메시지 파싱
    // 예: "+RCV=12,5,HELLO,-72,38"
    const match = rawLine.match(/^\+RCV=(\d+),(\d+),(.+),(-?\d+),(\d+)$/);
    if (match) {
      const [, sender, length, data, rssi, snr] = match;
      this.onMessage({
        from: parseInt(sender),
        data: data,
        rssi: parseInt(rssi),
        snr: parseInt(snr)
      });
    }
  }

  // 메시지 송신
  async send(targetNode, data) {
    if (!this.isConnected) throw new Error('Not connected');

    // 데이터를 HEX로 인코딩
    const hexData = Array.from(new TextEncoder().encode(data))
      .map(b => b.toString(16).padStart(2, '0')).join('');

    await this.sendCommand(`AT+SEND=${targetNode},${data.length},${hexData}`);
  }

  onMessage(msg) {
    // 메시지 핸들러 (오버라이드)
    console.log('LoRa received:', msg);
  }

  async disconnect() {
    this.isConnected = false;
    if (this.reader) {
      await this.reader.cancel();
      this.reader.releaseLock();
    }
    if (this.writer) {
      await this.writer.close();
      this.writer.releaseLock();
    }
    if (this.port) {
      await this.port.close();
    }
  }
}

// 사용 예
async function setupLoRaMesh() {
  const bridge = new LoRaUSBBridge();
  bridge.onMessage = (msg) => {
    // VitalGuard 메시 프로토콜로 라우팅
    handleIncomingMeshMessage(msg.data, msg.from);
  };

  // 사용자 버튼 클릭 시 실행
  document.getElementById('connect-lora-btn').onclick = async () => {
    try {
      await bridge.connect();
      document.getElementById('status').textContent = 'LoRa connected';
    } catch (e) {
      document.getElementById('status').textContent = 'Connection failed';
    }
  };
}
```

### 하드웨어 은닉

동글의 물리적 외관은 USB 플래시 드라이브와 닮았다. 일상적인 검사에서 저장 장치와 구별할 수 없다. 활동가는 주의를 끌지 않고 키체인이나 필통에 휴대할 수 있다. 활성 상태일 때의 전자기 시그니처는 충분히 훈련된 적대자에게 식별 가능하지만, ISM 대역 통신이 면허 불요인 대부분의 관할권에서 그 자체로 불법 활동의 증거가 되지는 않는다.

### 한계

- 하드웨어 의존성은 실제 비용이다. 일부 맥락에서는 조달 자체가 추적된 이벤트일 수 있다.
- LoRa는 기본적으로 익명성을 제공하지 않으며, 전송 패턴이 삼각측량될 수 있다.
- 동글이 압수되면 즉시 LoRa 채널이 단절된다.

### 결합 권장사항

- **계층 4의 모든 무선 차단 시나리오**에서 최종 폴백 채널.
- **아이디어 17 (침묵의 합창)**과 결합하면 동시 송출로 발신자 특정이 어려워진다.

---

# Part 1 끝 — 다음 Part 2에서 아이디어 8~15 계속

체크포인트: Part 1 완료. 토큰 분할 지점.

---

© 2026 Morgan J. (Gyu-min Jeon) | M-Corp Ethical AI
M-Corp 윤리적 AI 라이선스 (Hippocratic 3.0 파생 라이선스)
오직 민간·농업·인도주의 목적에 한해 사용 가능
