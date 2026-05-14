© 2026 Morgan J. (Gyu-min Jeon) | M-Corp Ethical AI  
M-Corp Ethical AI License (Hippocratic 3.0 derivative)  
For civilian, agricultural, and humanitarian purposes ONLY.

## 0. Safety Scope and Non-Scope

This document does **not** provide any of the following:

- Procedures for unauthorized Bluetooth tracking, interception, bypassing, intrusion, jamming, or transmission disruption
- Steps to reproduce RF attacks against third-party devices
- Methods for illegal radio transmission, output amplification, or frequency disruption
- Operational instructions for covert communication or deniable communication in real-world use

---

## 1. Key Conclusions

### 1.1 Overall Assessment

The two files describe VitalGuard as the following structure:

- BLE-based short-range detection and RSSI-based estimation of possible distress conditions
- FSK / Morse / QR / audio fallback to compensate for iOS Safari Web Bluetooth limitations
- Goertzel + FFT-based acoustic demodulation, CRC-16, preamble lock, and TDMA collision mitigation
- Separation of the native BLE advertising bridge, GATT write, and acoustic fallback paths
- Local-only operation, CSP `connect-src 'none'`, runtime network blocking, recursive sanitization, and short-term fingerprint retention
- Audit evidence collection through a Field Evidence Matrix and Virtual Field Test

### 1.2 Top Risks Requiring Immediate Verification

| Priority | Area | Risk | Current Mitigation | Additional Requirements |
|---|---|---|---|---|
| P0 | Bluetooth hardware specifications | Browser BLE advertisement transmission may be misunderstood as real TX capability | The HTML does not claim browser-native BLE advertisement TX and separates the design into native bridge / GATT / acoustic fallback | Submit native bridge implementation, chipset, firmware, TX power, PHY, and OS/browser matrix |
| P0 | RF / BLE spoofing | Forged or replayed BLE advertisements or acoustic frames could trigger false SOS events or false positives | CRC-16, short retention, consent gate, local-only logs | HMAC/signature, nonce/timestamp, replay window, and key rotation policy required |
| P0 | Covert-communication wording | The text document mentions “steganographic bird-call communication” and “hidden transmission in surveillance environments,” while the HTML limits the bird-call profile to operator-visible, not secret, and not covert | The restrictive wording on the HTML side is safe | Resolve wording conflicts between documents. Remove “covert / surveillance environment / steganographic” wording or explicitly prohibit it |
| P1 | Signal-processing reliability | Goertzel/FFT demodulation is sensitive to microphone AGC, wind, rain, crowd noise, and Safari restrictions | Known limits and FieldMatrix are present | Real measurement logs for BER/PER/SNR, latency, false preamble rate, and CRC fail/pass ratio are required |
| P1 | Frequency interference | TDMA only reduces collisions among VitalGuard nodes and cannot coordinate environmental noise or other RF sources | TDMA guard/slot and adaptive scan duty | Measurements are needed for acoustic noise, Wi-Fi/BLE coexistence, human/vegetation/water-adjacent/building multipath effects |
| P1 | Privacy / RF ethics | Passive BLE scanning is dual-use and carries tracking risk | Consent modal, 60-second raw RSSI, 30-minute fingerprint retention, ephemeral identity | Signage, DPIA-style records, operator training, and audit export redaction verification are required |

---

## 2. Evidence Summary

- The acoustic fallback uses Goertzel demodulation, FFT-bin cross-checking, explicit length framing, CRC-16, preamble lock, RX evidence counters, and bounded message decoding.
- TDMA is a local slot/guard method intended to reduce collisions among VitalGuard nodes during acoustic transmission.
- The bird-call-style acoustic profile is restricted in the HTML as **not** being a secret/covert channel.
- BLE advertisement TX is not claimed as a browser-native capability; it is separated into a native bridge hook, GATT peer write, and acoustic fallback.
- Passive BLE scanning applies a consent modal and short retention.
- The Field Evidence Matrix records BLE real scans, no-egress status, deletion, audio fallback, visual/tactile fallback, power duty, and clean/experimental separation as audit evidence.
- Known limits document RSSI inaccuracy, browser background-execution limits, the need for a native bridge, and the best-effort nature of JavaScript-based deletion.
- The goal is a zero-infrastructure data broadcast system that uses audio communication to work around iOS Safari Web Bluetooth limitations.
- Nine modules are defined: FSK audio modem, Morse engine, auto-calibration, mesh relay, TDMA collision avoidance, bird-call communication, sonar distance measurement, heartbeat, and QR + audio dual-channel handshake.
- The technical constraints are vanilla JS/HTML, no external libraries, no external APIs, a single HTML file, offline operation, and use of built-in browser APIs such as Web Audio, getUserMedia, and Web Crypto.
- The physical layer uses OscillatorNode, AnalyserNode, getUserMedia, and FFT analysis.
- The protocol layer requires VG PACKET, CRC16, Base45, and chunk splitting.
- Security controls mention a SHA-256 payload hash and an HMAC tag based on a pre-shared token.

---

## 3. System Map

```text
[BLE Advertisement / GATT / Native Bridge]
        │
        ├─ BLE scan: centered on browsers that support Web Bluetooth requestLEScan
        ├─ GATT: attempts write/notification with connectable peers
        └─ Native bridge: required outside the browser when actual advertisement TX is needed

[Acoustic Fallback]
        │
        ├─ TX: OscillatorNode / GainNode / FSK / Morse / bird-call-style profile
        ├─ RX: getUserMedia / AnalyserNode / FFT / Goertzel
        ├─ Framing: magic + version + length + payload + CRC-16
        └─ Collision: TDMA slot + guard interval

[Application / Evidence]
        │
        ├─ SOS board / QR SOS card / visual beacon / vibration beacon
        ├─ RescueAI: RSSI, movement, stationarity, consensus, path-loss profile
        ├─ FieldMatrix: evidence JSON
        └─ NetworkGuard / Sanitizer / DataWiper / Ethics gates
```

---

## 4. Signal-Processing Configuration

| Component | Implementation / Design Status | Audit Point |
|---|---|---|
| FSK audio modem | The text document requires FSK as a core module. The HTML provides audible, near-ultrasonic, bird-call, and Morse modes | Measure real BER/PER, symbol-timing drift, and frame loss |
| Goertzel demodulation | The HTML Acoustic module explicitly references Goertzel + FFT V7 | Verify detection accuracy for specific tone pairs, false lock, and noise-floor calibration |
| FFT-bin cross-check | The HTML uses FFT-bin cross-checking and AnalyserNode | Verify FFT size, bin mapping, sample-rate variation, and smoothing impact |
| Preamble lock | The HTML includes preamble lock and bounded decode state | Verify preamble false positives, missed preambles, and lock stability under environmental noise |
| CRC-16 | CRC16 is mentioned in both the HTML acoustic frame and the text protocol layer | Confirm whether CRC fail/pass counters are included in the export |
| TDMA | Both the HTML and text use TDMA for collision avoidance | Verify slot-assignment collision, clock drift, and hidden-node issues |
| Morse | The text requires automatic Morse decode, while the HTML is clearer on Morse TX | Confirm the scope of RX auto-decode implementation and whether it is shown in the UI |
| Auto-calibration | The text requires device-specific frequency-response measurement. The HTML implements noise-floor calibration | Measure speaker/microphone bandwidth and the impact of AGC, AEC, and noise suppression |

### 4.2 P0/P1 Signal-Processing Audit Questions

1. **Can the FSK frequency pairs actually be played and received on each device?**  
   The HTML defaults are divided into audible, near-ultrasonic, bird-call-style, and Morse modes. Performance varies significantly by smartphone speaker, microphone, browser, and OS audio processing.

2. **Are the Goertzel + FFT decision thresholds stable after calibration?**  
   If the noise floor is set too low, false positives increase. If it is set too high, missed packets increase.

3. **CRC-16 is for error detection, not authentication.**  
   CRC is useful for detecting accidental errors, but it does not prevent malicious forgery. RF/audio spoofing defense requires an HMAC or digital-signature layer.

4. **Is the scope of automatic Morse RX decoding clear?**  
   The text document requires automatic decoding, while the HTML is clearer about button-based TX. If automatic RX is not complete, the document wording should be revised.

5. **Is there sufficient implementation and verification evidence for sonar distance measurement?**  
   The text document requires distance measurement based on acoustic round-trip time, while the HTML’s operational limits are closer to RSSI and dead-reckoning. If sonar functionality is claimed, evidence is needed for round-trip timing, time synchronization, latency correction, and multipath correction.

### 4.3 Recommended Measurement Metrics

| Metric | Description | Minimum Evidence to Submit |
|---|---|---|
| BER | Bit Error Rate | Raw counts by mode, distance, and noise condition |
| PER | Packet Error Rate | Counts for preamble detected, CRC pass, CRC fail, and timeout |
| SNR | Signal-to-noise ratio | dB or relative energy before and after calibration |
| False preamble rate | Frequency with which noise is misidentified as a frame | Logs from at least 10 minutes of no-transmission environment |
| Latency | Time from button input to RX display | median / p95 / p99 |
| TDMA collision rate | Collision ratio by number of simultaneous transmitting nodes | Simulation or measurement for 2 / 4 / 8 / 16 nodes |
| Mode fallback rate | Rate of audio / QR / visual fallback after BLE failure | Field evidence by platform |
| AudioContext recovery | Success rate of recovery after a user gesture from suspended state | Logs for Safari / Chrome / Android / iOS |

### 4.4 Recommended Safety Test Cases

| ID | Purpose | Procedure Summary | Real-world field testing has not yet been conducted |
|---|---|---|---|
| SP-01 | Audible FSK decode | Transmit and receive at 1 m / 5 m / 10 m in an authorized lab | Submit CRC pass rate and PER |
| SP-02 | Near-ultrasonic validation | Transmit/receive primarily on Android devices and confirm iOS limitations | Clearly document supported and unsupported devices |
| SP-03 | Noise robustness | Receive under replayed recordings of wind, rain, and crowd noise | False lock and CRC fail are shown in the UI/logs |
| SP-04 | AGC/mic filtering impact | Repeat across different OS/browser/microphone combinations | Record calibration results and failure causes |
| SP-05 | TDMA collision | Simulate simultaneous transmission from multiple nodes | Provide evidence for emergency-frame priority and collision reduction |
| SP-06 | Raw audio privacy | Check local storage / IndexedDB / export during RX operation | Submit evidence that raw audio is not stored |

---

## 5. Frequency-Interference Audit

### 5.1 Acoustic Interference

The HTML states that Goertzel/FFT demodulation may be vulnerable to browser microphones, wind, rain, crowd noise, AGC, microphone filtering, and Safari audio restrictions. TDMA reduces collisions among VitalGuard nodes, but it cannot coordinate environmental noise or external sound sources.

Auditors should verify the following:

- The actual frequency band and symbol duration of each acoustic mode
- Whether the browser/OS applies noise suppression, echo cancellation, or AGC
- Whether near-ultrasonic mode is neutralized on certain devices because of speaker/microphone cutoff
- Whether the bird-call-style profile is always visible in the UI/logs/export so it cannot be mistaken for “covert communication”
- How emergency/panic frames bypass or shorten TDMA delay

### 5.2 RF Interference

BLE operates in the 2.4 GHz ISM band, so it is affected by Wi-Fi, other BLE devices, Zigbee/Thread, microwave ovens, human-body shielding, vegetation, humidity, water-surface reflections, and building multipath. The HTML also warns that RSSI can be distorted by vegetation, terrain, humidity, buildings, the human body, and device orientation.

Auditors should require the following:

- Evidence for environment-specific path-loss profiles: cornfield, forest, remote road, urban, and water-adjacent
- Evidence for RSSI smoothing, confidence scoring, and false-positive mitigation
- The effect of multiple Sentinels on location-estimation improvement
- BLE scan success rate under Wi-Fi coexistence conditions
- The effect of adaptive scan duty on detection rate when battery is low

### 5.3 Security Perspective on Interference

Interference is not merely a performance issue; it is also a security issue.

- **Intentional or unintentional noise** can reduce the reception rate of SOS frames.
- **RSSI distortion** can misdirect rescue routing.
- **Congested environments** can produce false positives or alert fatigue.
- **Environmental-sound false preambles** can lead to incorrect frame-decode attempts.

Mitigations include:

- Recording acoustic, BLE, QR, visual, and tactile channels as independent evidence
- Including CRC fail/pass and noise floor in audit exports
- Avoiding rescue decisions based on a single signal; using consensus + human protocol instead
- Performing RF tests only with authorized equipment in shielded or approved environments

---

## 6. Bluetooth Hardware-Specification Audit

### 6.1 Standards Baseline

The audit baseline should use both the latest Bluetooth SIG Core Specification series and the chipset datasheets for the actual target devices. As of 2026-05, Bluetooth Core 6.3 has been adopted, so submissions should separately identify which features the product/test devices actually support across Core 5.x, 6.0, 6.1, 6.2, and 6.3.

Basic BLE physical-layer checks include:

- 2.4 GHz ISM band support
- LE RF channel structure and channel map
- Supported PHY: LE 1M, LE 2M, LE Coded, and Channel Sounding if needed
- TX power range and regulatory limits
- RX sensitivity and packet-error tolerance
- Antenna type, gain, orientation, and enclosure effects
- Power and thermal limits during concurrent scan / GATT / audio operation

### 6.2 Hardware Requirements Based on the VitalGuard Code

| Item | Status Observed in HTML | Audit Requirement |
|---|---|---|
| Web Bluetooth scan | `navigator.bluetooth.requestLEScan` capability audit | Submit actual scan-start logs for Android/Desktop Chromium |
| GATT connect/write/notify | Service UUID and characteristic UUID are defined | Submit logs for GATT permission, write auth, error handling, and notify subscription |
| Native advertising bridge | Only the `VG6NativeAdvertiser.broadcast` hook exists | Submit the actual native bridge source, permission model, and firmware/chipset mapping |
| Browser BLE advertisement TX | The code and UI explain that standalone browser TX is not guaranteed | Prohibit marketing/documentation language that guarantees browser-native TX |
| RSSI location | Path-loss profile and confidence scoring exist | Submit environment-specific calibration datasets |
| iOS support | iOS Safari is centered on audio / QR / manual fallback | Do not claim BLE scan/TX support on iOS. Verify audio performance separately |
| Background operation | Browser background limitations are stated | Submit native-wrapper or foreground-operation policy |

---

## 7. Defensive Threat Model from an RF-Hacking Perspective

### 7.1 Major Attack Surfaces

| Attack Surface | Defensive Description | Current Mitigation | Additional Recommendation |
|---|---|---|---|
| BLE advertisement spoofing | Forged advertisement packets can confuse rescue nodes | Service UUID filter, ephemeral fingerprint, consensus | HMAC/tag, nonce, replay window, allowlist |
| BLE replay | Replaying past SOS/heartbeat frames can trigger false rescue | Timestamp, retention | Monotonic counter, short TTL, signed frame |
| GATT misuse | A malicious actor may attempt false writes to connectable peers | Ethics gate, GATT error handling | Characteristic-level auth, pairing policy, rate limit |
| Passive scan privacy | Nearby BLE advertisements can be over-collected | Consent modal, 60-second raw RSSI, 30-minute fingerprint | Signage, purpose binding, export redaction test |
| Acoustic spoofing | Anyone can imitate similar tones / QR / audio | CRC-16, visible logs | Shared-secret HMAC or public-key signature |
| Acoustic replay | Recorded SOS frames can be replayed | None or limited | Nonce/timestamp, freshness check, repeated-frame detector |
| RF/acoustic interference | Can degrade performance and cause missed rescue events | TDMA, fallback channels | Shielded lab test, PER/SNR records, multi-channel evidence |
| Covert-channel misuse | Bird-call/steganographic wording can be misused | HTML restricts it to operator-visible behavior | Remove “hidden transmission” wording from the text document and keep the policy gate |

### 7.2 Authentication and Integrity Recommendations

CRC-16 should be retained for error detection, but the following layer should be added to pass a security audit more robustly.

```text
Frame = version || type || seq || timestamp || ttl || payload || crc16 || auth_tag

Recommended auth_tag candidates:
- For field training: HMAC-SHA256 truncated tag
- For long-term operation: offline-provisioned public-key signature or rotating group key

Required freshness elements:
- timestamp
- monotonic sequence
- short TTL
- replay cache
- key rotation / incident revocation
```

Note: Authentication should improve the **operational trustworthiness** of rescue nodes. It must not become a mechanism for creating persistent personal identifiers.

---

## 8. Sonar Distance-Measurement Claim

The text document includes distance measurement based on acoustic round-trip time as a module. The primary operational path in the HTML is closer to RSSI, dead-reckoning, and visual/audio final approach.

**Audit judgment:** If sonar distance measurement remains a product claim, evidence is required for round-trip timing, clock synchronization, audio-latency calibration, multipath rejection, and device-specific latency correction. Without such evidence, it should be separated as “future research / not included in clean audit core.”

---

## 9. Review Checklist

### 9.1 Static Review

| ID | Item | Expected Result |
|---|---|---|
| SR-01 | No external script/link | No remote script, CDN, or external font |
| SR-02 | CSP check | Maintain `connect-src 'none'`, `object-src 'none'`, `base-uri 'none'`, and `form-action 'none'` |
| SR-03 | Network API guard | fetch / XHR / WebSocket / EventSource / WebRTC / sendBeacon are blocked or explicitly limited |
| SR-04 | Direct storage write | Direct localStorage writes are minimized outside the SafeStorage wrapper |
| SR-05 | Raw audio persistence | No raw audio is stored in audio buffers, Blob, or IndexedDB |
| SR-06 | BLE TX claim | No language guarantees browser-native advertisement TX |
| SR-07 | Covert-channel language | Hidden/covert/steganographic claims are removed or accompanied by explicit prohibition |
| SR-08 | Consent gate | Operator/consent gates exist for passive BLE scan, acoustic TX/RX, QR download, debug export, etc. |

### 9.2 Dynamic Review

| ID | Item | Expected Result |
|---|---|---|
| DR-01 | Start Core | NetworkGuard, Watchdog, and Capability audit run |
| DR-02 | BLE Protocol Scan | Supported browsers clearly record either scan start or unsupported status |
| DR-03 | Passive BLE Scan | acceptAll scan cannot run without a consent modal |
| DR-04 | GATT Peer | Safe error logs appear when connect/write/notify fails |
| DR-05 | Acoustic RX | After a user gesture, AudioContext resume, microphone permission, and calibration log are recorded |
| DR-06 | Acoustic TX | CRC pass/fail counter, TDMA slot, and mode are shown |
| DR-07 | QR SOS Card | SVG is generated without external QR API/CDN/canvas |
| DR-08 | Audit Export | Sanitized JSON is exported without raw identifiers |
| DR-09 | Emergency Wipe | Browser-accessible state is deleted, while limitation wording is preserved |
| DR-10 | Idle Auto-Wipe | According to the 30-minute policy or configured value, radio/audio/flash stops and best-effort wipe runs |

### 9.3 RF/Acoustic Lab Review

| ID | Item | Safety Condition | Evidence to Submit |
|---|---|---|---|
| RF-01 | BLE scan reliability | Use only authorized test beacons | Scan success rate, RSSI variance |
| RF-02 | Wi-Fi coexistence | Authorized test environment | BLE scan-rate change, packet loss |
| RF-03 | Antenna orientation | Repeat at the same distance/angle | RSSI heatmap or table |
| RF-04 | Human/vegetation attenuation | Human-body / vegetation / water-adjacent environment | Path-loss profile calibration |
| AC-01 | Audible FSK | Authorized indoor test | BER/PER/SNR |
| AC-02 | Near-ultrasonic | Minimize discomfort to animals/people; limit output | Device-by-device pass/fail |
| AC-03 | Crowd/wind/rain noise | Recorded replay or authorized field setting | False preamble, CRC fail/pass |
| AC-04 | Bird-call profile | Confirm visibility in UI/logs/export | Evidence that no covert claim is made |
