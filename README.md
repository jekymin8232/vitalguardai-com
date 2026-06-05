# Erase the Trace.
> ### The safest network is a completely offline system that is connected to no network.
> VitalGuard AI operates autonomously even on a single very old floppy disk.
> **Introducing VitalGuard AI 🌍 — AI That Can Save Lives When Everything Else Stops Working.**
> Unlike conventional AI systems that depend on data centers, cloud services, stable internet connections, and continuous power, VitalGuard AI is designed to operate under the opposite assumption: that infrastructure may be unavailable, disrupted, or completely collapsed.
> Built with an offline-first philosophy, VitalGuard AI aims to provide resilient and accessible AI capabilities on simple, widely available hardware, helping support disaster response, > humanitarian operations, remote communities, and other challenging environments where connectivity cannot be guaranteed.
> To learn more about the vision and technology behind VitalGuard AI, please visit [mcorpai.com.](http://mcorpai.com/)

### The strongest security posture is achieved through a fully air-gapped system.

# VitalGuard Integrated Modular Code V3.0 MVP
### Even when all other systems stop working, offline AI can save lives.
**Offline AI can be applied in any shutdown environment. Its potential use cases extend beyond communication infrastructure failures to include natural-disaster scenarios, remote and disconnected regions, and even AI-assisted solutions for challenges such as desert greening and environmental restoration. This architecture also underwent an initial review by the Government of Luxembourg in November 2025.**

**Human-built infrastructure can be disrupted surprisingly easily, whether by natural disasters, conflicts, or large-scale system failures. If AI can operate on extremely simple and widely available devices, it has the potential to help save countless lives.**

**This approach could also support agriculture in regions such as Africa. For example, if low-cost devices can detect and track locust swarm movements, communities may be able to respond earlier and reduce crop losses, helping to mitigate food insecurity.**

**Most large-scale AI systems depend on fully functioning infrastructure, including data centers, cloud services, stable networks, and continuous power. VitalGuard AI is designed with the opposite assumption. Its goal is to remain operational even when conventional infrastructure is unavailable, severely disrupted, or has completely collapsed.**

**In other words, while Big Tech AI is optimized for connected environments, VitalGuard AI is designed for the moments when everything else stops working.**

> A single-file, **zero-dependency**, **100% offline**, **no-auto-render** source bundle that packages four humanitarian survival-AI artifacts and exposes a small, explicit runtime kernel for inspecting, extracting, and re-using their modules.

[![single file](https://img.shields.io/badge/build-single--file-blue)]()
[![offline](https://img.shields.io/badge/runtime-100%25%20offline-success)]()
[![dependencies](https://img.shields.io/badge/dependencies-zero-brightgreen)]()
[![stack](https://img.shields.io/badge/stack-vanilla%20JS%20%2F%20CSS-orange)]()
[![render](https://img.shields.io/badge/policy-no--auto--render-lightgrey)]()

---

## Table of Contents

- [Overview](#overview)
- [What this file is — and is not](#what-this-file-is--and-is-not)
- [Architecture](#architecture)
- [Bundled source payloads](#bundled-source-payloads)
- [Public API](#public-api)
- [Quick start](#quick-start)
- [Working with modules](#working-with-modules)
- [Cognitive Broadcast Bridge](#cognitive-broadcast-bridge)
- [Acoustic Morse / Ultrasonic Mesh](#acoustic-morse--ultrasonic-mesh)
- [Security and privacy model](#security-and-privacy-model)
- [Self-tests](#self-tests)
- [Integrity (SHA-256)](#integrity-sha-256)
- [Browser support](#browser-support)
- [Ethical use](#ethical-use)
- [Maintainer](#maintainer)

---

## Overview

**Apache License 2.0: The entire architecture is fully open source, allowing anyone to inspect, modify, customize, and use it free of charge.**

`VitalGuard Integrated Modular Code V3.0` is a **container and toolkit**, not an application that runs on load.

It stores four separate humanitarian-AI source artifacts as inert, Base64-encoded payloads, and ships a tiny runtime kernel (`window.VitalGuardIntegratedV30`) that lets a developer:

- list the bundled apps and their modules,
- decode any payload back to its original source text,
- extract a single module as a reusable code section,
- parse (without executing) the HTML parts of an embedded app,
- export source or module segments as downloadable blobs,
- and explicitly instantiate two runtime engines (a cognitive broadcast bridge and an acoustic Morse/ultrasonic mesh) **only when called by hand**.

The design goal is **field survivability under total infrastructure collapse**: the entire toolkit is one HTML file, requires no network, no build step, no package manager, and no external library, so it can be archived, audited, and run from a single discarded smartphone or a USB stick.

## What this file is — and is not

**This file IS:**

- A self-contained archive of four source artifacts.
- A non-visual extraction and inspection kernel.
- A set of explicit factories for two opt-in runtime engines.

**This file is NOT:**

- It does **not** mount, render, boot, preview, `iframe`, `canvas`, or execute any embedded application when the page loads.
- It does **not** perform any network request. The integration kernel runs no `fetch`/`XHR`, and the document declares `connect-src none`.
- It does **not** open the microphone, start Web Audio, or emit any ultrasonic signal until a developer (or a real user gesture) explicitly invokes the relevant method.

These guarantees are encoded in the manifest's `activeDocumentPolicy` and re-exposed at runtime through `securityPolicy()`.

## Architecture

```
VitalGuard_Integrated_Modular_Code_V3_0_UltrasonicMorse.html
│
├── <script type="application/json" id="vg-integrated-manifest">
│       └── manifest: versions, payload metadata, SHA-256, module maps, policies
│
├── 4 × inert Base64 source payloads  (type="application/octet-stream")
│       ├── acoustic_mesh_survival_protocol_v1_0
│       ├── cognitive_broadcast_bridge_v1_0
│       ├── vitalguard_ai_v43_7
│       └── swarm_mesh_v1_7_2
│
└── <script type="module"> runtime kernel → window.VitalGuardIntegratedV30
        ├── core.EventBus                  (local, non-UI event bus)
        ├── core.ModuleRegistry            (dependency-aware lazy registry)
        ├── core.SafeText                  (bounded text / filename utilities)
        ├── core.SourcePayloadStore        (lazy Base64 → UTF-8 decode)
        ├── core.HtmlPartExtractor         (DOMParser, no script execution)
        ├── core.ModuleBoundaryExtractor   (per-module source slicing)
        ├── integration.AppCatalog
        ├── integration.Orchestrator       (main non-rendering API)
        ├── integration.ExportTools        (manual blob / download helpers)
        ├── integration.SecurityPolicy     (declarative policy)
        ├── bridge.*                        (Cognitive Broadcast Bridge engine)
        └── acoustic.*                      (Acoustic Morse / ultrasonic engine)
```

Module factories are **lazy**: a factory only runs the first time `require(name)` is called, so simply loading the page instantiates nothing.

## Bundled source payloads

| App key | Original artifact | Size | Module boundary | Modules |
|---|---|---|---|---|
| `vitalguard_ai_v43_7` | VitalGuard AI v4.3.7 (single-file HTML) | ~440 KB | banner-comment / object / class blocks | 69 |
| `swarm_mesh_v1_7_2` | Bluetooth Swarm Ultrasonic Mesh V1.7.2 (single-file HTML) | ~249 KB | `registerModule(name, deps, factory)` calls | 41 |
| `cognitive_broadcast_bridge_v1_0` | Cognitive Broadcast Bridge spec (Markdown) | ~48 KB | Markdown chapters / `bridge.*` modules | 25 |
| `acoustic_mesh_survival_protocol_v1_0` | Acoustic Mesh Survival Protocol (text) | ~13 KB | protocol chapters / `acoustic.*` modules | 24 |

Each payload is decoded lazily and is never executed during decoding. Module maps for every payload are listed in full inside the embedded manifest.

## Public API

Everything is reached through the frozen global object `window.VitalGuardIntegratedV30`.

### Inspection and extraction

| Method | Purpose |
|---|---|
| `.version` | Bundle version string (`"3.0"`). |
| `.manifest()` | Returns the full parsed manifest. |
| `.modules()` | Lists all registered integration module names. |
| `.moduleMeta(name)` | Metadata for a single integration module. |
| `.orchestrator()` | Main non-rendering facade (see below). |
| `.exportTools()` | Manual blob / download helpers. |
| `.securityPolicy()` | Returns the declarative no-render / no-egress policy. |

### Orchestrator facade — `.orchestrator()`

| Method | Purpose |
|---|---|
| `listApps()` | App keys of the four bundled artifacts. |
| `getAppMeta(appKey)` | Metadata (filename, bytes, SHA-256, module hint). |
| `getSource(appKey)` | Decoded original source text. |
| `getHtmlParts(appKey)` | `{ title, head, styles, body, scripts }` parsed without execution. |
| `listModules(appKey)` | Module names for the app. |
| `listModuleRecords(appKey)` | Module name + byte offsets + source slice. |
| `extractModule(appKey, name)` | A single module section (fuzzy name match supported). |

### Runtime engine factories (opt-in)

| Method | Purpose |
|---|---|
| `bridgeFactory().create(options)` | Instantiate a Cognitive Broadcast Bridge. |
| `bridgePacketBuilder()` | Low-level trigger-packet builder. |
| `bridgeSelfTest()` | Run the bridge self-test (no audio). |
| `acousticFactory().create(options)` / `acousticMorseFactory()` | Instantiate the acoustic Morse broadcaster. |
| `acousticMorseCodec()` / `morseCodec()` | Text ↔ Morse codec. |
| `acousticPacketCodec()` | VGM3 packet encode / parse. |
| `acousticToneScheduler()` | Web Audio tone scheduling. |
| `mountMorsePanel(container, options)` | Mount the optional Morse UI panel into an element. |
| `acousticSelfTest()` | Run the acoustic self-test (no audio playback). |

## Quick start

Because the file is fully self-contained, "installation" means opening it.

```bash
# Just open it locally — no server, no build, no install.
xdg-open VitalGuard_Integrated_Modular_Code_V3_0_UltrasonicMorse.html   # Linux
open VitalGuard_Integrated_Modular_Code_V3_0_UltrasonicMorse.html       # macOS
```

Then, in the browser developer console:

```js
const vg = window.VitalGuardIntegratedV30;

vg.version;                       // "3.0"
vg.orchestrator().listApps();     // ["vitalguard_ai_v43_7", "swarm_mesh_v1_7_2", ...]
vg.securityPolicy();              // declarative no-render / no-egress policy
```

> Nothing renders and nothing connects to the network. Every action above is read-only inspection.

## Working with modules

```js
const orch = window.VitalGuardIntegratedV30.orchestrator();

// 1. See what is inside an app
orch.listModules('swarm_mesh_v1_7_2');
// → ["State", "Dom", "Logger", "Ethics", "NetworkGuard", ...]

// 2. Pull one module out as a reusable source section
const ethics = orch.extractModule('swarm_mesh_v1_7_2', 'Ethics');
console.log(ethics.name, ethics.bytes);
console.log(ethics.source);

// 3. Recover a whole artifact's original source
const src = orch.getSource('vitalguard_ai_v43_7');

// 4. Parse HTML parts WITHOUT executing any script
const parts = orch.getHtmlParts('vitalguard_ai_v43_7');
console.log(parts.title, parts.styles.length, parts.scripts.length);
```

Export anything to a file (only runs when you call it):

```js
const tools = window.VitalGuardIntegratedV30.exportTools();
tools.downloadText('swarm-ethics-module', ethics.source);
```

## Cognitive Broadcast Bridge

An explicit decision engine that maps an upstream risk assessment to a broadcast action. It is created by hand and never auto-initializes audio, mic, UI, or transmission.

```js
const bridge = window.VitalGuardIntegratedV30
  .bridgeFactory()
  .create({ mesh: window.vgMesh, brainBus: window.brainAI && window.brainAI.bus });
```

**Risk → action mapping**

| Level | Action |
|---|---|
| `ROUTINE` | none |
| `ELEVATED` | notify / manual heartbeat only |
| `HIGH` | scheduled SOS after a configurable countdown |
| `CRITICAL` | immediate full SOS with relay and Morse options |

**Built-in safety model:** dual consent · user-cancel priority · cooldown · ethical gate · anonymous packets · local-only decision logs.

Inputs are read from two channels (`cortex-e-assessment`, `cortex-m-reliability`); output is sent to `window.vgMesh` or an injected mesh adapter. Audio output requires a real user gesture.

## Acoustic Morse / Ultrasonic Mesh

A zero-infrastructure, data-over-sound layer for environments where Bluetooth is unavailable (for example iOS Safari, which lacks Web Bluetooth). A user types a short message such as `SOS` or `조심하세요`; the engine normalizes it to Morse-compatible text, builds a Morse timeline, and broadcasts it through the Web Audio API.

```js
const acoustic = window.VitalGuardIntegratedV30.acousticFactory().create();
// Transmission begins only after an explicit method call from a user gesture.
```

**Transmission modes**

| Mode | Description |
|---|---|
| `morse_ultrasonic` | Machine carrier, default **18,500 Hz** |
| `morse_audible_fallback` | Human-audible carrier, default **800 Hz** |
| `fsk_packet_ultrasonic` | Binary FSK packet (`VGM3` framing, CRC-checked) |

**Built-in safety model:** manual invocation only · messages bounded to 100 characters · no external network · no personal identifier carried in the Morse stream · local logs only · stop button has priority.

## Security and privacy model

The integration artifact enforces a strict, declarative posture, surfaced via `securityPolicy()`:

- **Single file** — one HTML document, no companion assets.
- **No auto-render / no auto-boot** — payloads are inert on load.
- **No `iframe`, `embed`, or `object`** in the active document.
- **No canvas** in the active document.
- **Content Security Policy:** `connect-src none; object-src none; frame-src none; frame-ancestors none; base-uri none; form-action none`.
- **Payload encoding:** Base64 UTF-8 source payloads, decoded lazily.
- **Network egress:** none — the kernel performs no runtime `fetch`/`XHR`.

This containment design means that decoding or extracting an embedded artifact never starts that artifact, and that the bridge/acoustic engines stay dormant until explicitly created.

## Self-tests

Self-tests validate logic and document-safety invariants **without playing any audio**:

```js
await window.VitalGuardIntegratedV30.acousticSelfTest();
await window.VitalGuardIntegratedV30.bridgeSelfTest();
```

The acoustic self-test verifies, among other things, that `SOS` encodes to `... --- ...`, that a Korean caution phrase is reduced to Morse-safe Latin, that `VGM3` packets round-trip through CRC parsing, that an ultrasonic schedule is generated above 17 kHz, that obvious phone-number-like strings are sanitized, and that the active document contains no external script source and no `iframe`/`embed`/`object`.

## Integrity (SHA-256)

Each embedded payload is pinned in the manifest so it can be verified independently.

| App key | SHA-256 |
|---|---|
| `vitalguard_ai_v43_7` | `2559540320d38cdb1822e002238785f686d8ad498f1d027ecd2b9afad4bfa1bd` |
| `swarm_mesh_v1_7_2` | `1185b964ece894da9badf4560d43762ffb45e5c4a579c5174e0a9633af77d063` |
| `cognitive_broadcast_bridge_v1_0` | `8245b643d76b57dceee0cd95afe54e70aeba176d726282480a28a4ba8a488c3a` |
| `acoustic_mesh_survival_protocol_v1_0` | `0c2fb71df5826a78a5e43bc00c27128412ca42c6e4dd56974ecb4ade0d663678` |

## Browser support

- Any modern evergreen browser (Chromium, Firefox, Safari).
- **Bluetooth features** require a browser with Web Bluetooth (Chromium-based). On iOS Safari, the acoustic layer is the intended fallback.
- **Audio features** (bridge broadcast, acoustic Morse/ultrasonic) require a user gesture to start the Web Audio context, per browser autoplay policy.
- Older / refurbished devices are explicitly a target environment.

## Maintainer

**Morgan J.**
Project home: <https://mcorpai.org/>
