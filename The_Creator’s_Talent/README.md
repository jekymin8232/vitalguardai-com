# VitalGuard Swarm Suite

Three complementary design specifications for an **offline, zero-dependency, serverless** disaster-sensing and emergency-communication mesh built from discarded smartphones, using only vanilla JavaScript and HTML.

> © 2026 Morgan J. (Gyu-min Jeon) · M-Corp Ethical AI · Licensed under the **Apache License 2.0**

---

## 1. Overview

| Module | Role | Channel | Core idea |
|---|---|---|---|
| **bluetooth-swarm-network** | Foundation mesh | BLE (Web Bluetooth) | Managed-flooding BLE mesh with CALM / ALERT / PANIC heartbeats and a local trust score |
| **vg-acoustic-mesh-survival-protocol** | Fallback transport | Audio (ultrasonic / audible / Morse) | Data-over-audio so devices without Web Bluetooth (e.g. iOS Safari) can still take part |
| **silent-witness-swarm-protocol** | Intelligence layer | BLE + ultrasonic Morse | Treats a node's *silence* as a signal: infers disasters from where and when nodes stop reporting |

How they fit together:

```
 silent-witness-swarm-protocol   (inference: silence, trust, last will, scenarios)
        │                │
        ▼                ▼
 bluetooth-swarm-network   vg-acoustic-mesh-survival-protocol
 (BLE 1:1 precise channel) (audio 1:N broadcast / iOS bridge)
```

Shared constraints for all three:

- Vanilla JS + HTML only. No libraries, no CDN, no npm, no external API calls.
- 100% offline; no server, no data collection, instant local deletion.
- Single-file output, **under 400 KB**, delivered as `<style>…</style>` and `<script>…</script>` blocks that can be pasted into an existing `index.html`.
- Designed around the Ten Principles of Ethical AI (minimal hallucination, transparency, low-resource operation, no data exploitation, no legal liability transfer, simplicity).
- Architecture is intended to resist military or surveillance repurposing.

---

## 2. bluetooth-swarm-network

A BLE mesh that needs no cell towers, internet, or cloud.

**Network**
- Managed flooding with a TTL and a ~256-byte rolling Bloom filter for de-duplication; probabilistic relay to prevent broadcast storms.
- Four node roles: **Sentinel** (sensors), **Relay** (range only), **Gateway** (bridge to SMS/HTTP/LoRa), **Commander** (human instructions). One device may hold several roles.
- Self-healing: neighbours detect missing heartbeats and redistribute relay duty.

**Heartbeat modes**

| Mode | Interval | Payload |
|---|---|---|
| CALM | 5–10 s | ID, battery, status byte |
| ALERT | 0.5–1 s | + sensor readings, anomaly score |
| PANIC | 250 ms | full emergency data, top relay priority |

ALERT→PANIC needs a local threshold breach or ≥3 neighbours in ALERT for the same threat.

**Trust (“Friendship”) engine** — `trust = success_rate × time_decay × consistency`, computed locally; new nodes start neutral, which limits Sybil attacks.

**Modules (13):** core mesh engine · heartbeat · trust · wildfire monitor · livestock guardian · human SOS relay · disaster detector (seismic, storm, flood, locust) · AI engine suite (Bayesian, Kalman, FFT, consensus) · acoustic triangulation · steganographic communication · environmental mesh (weather, air quality, epidemic early warning, crowd-crush prevention, dead reckoning) · safety fence · UI dashboard.

**Targets (design/simulation):** up to 2,000 nodes; default TTL 7, PANIC TTL 15; ~50–100 m per node; CALM battery life ≈ 48–72 h on 3,000 mAh.

**Known limitations**
- **iOS cannot run it** (no Web Bluetooth); iPhones are passive only → use the acoustic module.
- Browser BLE scanning needs a user gesture and an active screen (Wake Lock); background use needs a native wrapper (Capacitor/TWA).
- Delivery is probabilistic, not guaranteed. Smartphone-microphone detection has real false-positive rates. Heartbeats are not application-layer encrypted.

---

## 3. vg-acoustic-mesh-survival-protocol

Sends data as sound using the Web Audio API (`OscillatorNode` out, `getUserMedia` + `AnalyserNode` FFT in).

**Nine modules:** FSK modem · Morse engine (≤100 characters) · auto-calibration · mesh relay · TDMA collision avoidance · steganographic birdsong · sonar ranging · heartbeat ping · QR + audio dual-channel handshake.

**Key parameters**

| Item | Value |
|---|---|
| Ultrasonic FSK | 17 kHz / 18 kHz, 100 bps |
| Audible FSK | 4 kHz / 5 kHz, 50 bps |
| Chirp mode | 4→8 kHz up/down chirp, 20 bps |
| Morse tone | 800 Hz default (audible) |
| Birdsong carrier | ~4 kHz (3.5–4.5 kHz), ±20 Hz bit shift |
| Sonar ping / pong | 17.5 kHz / 16.5 kHz |
| TDMA | 20 slots × 100 ms, 2 s frame, 10 ms guard |
| Max hops | 5 |
| Integrity | CRC16-CCITT (0x1021); optional SHA-256 / HMAC |

**Layers:** physical (audio) → protocol (packet, CRC, Base45, chunking) → mesh (hop count, de-dup, TDMA) → application (SOS, Rescue Pack, Morse messages, heartbeat).

**Platform behaviour:** Android bridges BLE ↔ audio; iOS uses a three-step fallback — **QR → audio modem → manual Morse**. `AudioContext` must be created inside a user gesture on iOS.

**Build order:** FSK → Morse → calibration → packet/CRC → relay → TDMA → heartbeat → birdsong → sonar.

---

## 4. silent-witness-swarm-protocol

“Absence as information”: the last signal and the sudden silence of a node are treated as evidence of a disaster. Inspired by cockroach, ant and honeybee colony behaviour.

**Dual channel:** BLE for precise 1:1 exchange (trust, death notices, inheritance); ultrasonic Morse for 1:N broadcast (roll call, swarm heartbeat). Matching messages on both channels double confidence.

**25 survival mechanisms (all required to work as one system)**

| Group | Mechanisms |
|---|---|
| Trust & memory | Friendship level (0–100, time decay), trust currency, inheritance, pheromone trail |
| Death & silence | Last Will, obituary weighting, geographic domino inference, hibernation (false-death prevention), decoy death |
| Coordination | Swarm heartbeat, dawn roll call, night lighthouse, territorial tessellation, species diversity, schism & merger, generational handoff |
| Resilience | Glacier mode, node dreams (predictive simulation), vibration Morse |
| Human interface | QR dialogue, human-rescuer call, emergency token, memorial |
| Safety | Byzantine majority verification, location anonymisation (k-anonymity / grid quantisation), false-obituary attack defence |

**Last Will triggers (examples):** wildfire > 80 °C or > 10 °C/min rise · flood free-fall < 0.5 g for > 1 s · landslide 20–50 Hz shock > 0.3 s · earthquake amplitude ×3 within 0.5 s.

**Verification rule:** ≥10 agreeing nodes for a first alert; ≥2 of 3 neighbouring clusters for a wide-area alert.

**14 scenarios:** wildfire, flood/tsunami, landslide, earthquake, activist protection, crowd-crush prevention, and others.

**Honest limits:** it supports, never replaces, human judgement; false positives/negatives remain; no real-time link to the outside internet. Field deployment requires landowner consent and local radio / e-waste / environmental compliance.

---

## 5. Quick start

1. Choose a scenario (e.g. wildfire).
2. Ask the AI to generate a build using the relevant spec(s); BLE and acoustic modules are normally combined, with the silent-witness layer on top.
3. Paste the generated `<style>` and `<script>` blocks into your existing `index.html`.
4. Verify: no external `src`, no `fetch`/`XMLHttpRequest`, 400 KB budget, security audit.
5. Pilot in a small, consented area before scaling.

---

## 6. License

Licensed under the **Apache License, Version 2.0**. See `LICENSE`.