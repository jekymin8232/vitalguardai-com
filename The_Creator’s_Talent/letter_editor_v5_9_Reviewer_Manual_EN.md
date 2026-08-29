# Vitalguard-AI V5.9 — Reviewer's Manual
### A single-file, offline, no-storage document tool for people at risk
**Prepared for: Open Technology Fund Security Lab review**
**Author: Morgan J. (Gyu-min Jeon), M-Corp Ethical AI**
**Application reference: #21441**
**File: letter_editor_v5_9.html (single HTML file, vanilla JS/CSS, zero dependencies)**

---

## 0. What this is, in one paragraph

Vitalguard-AI is one HTML file that opens in any modern browser, works completely offline, contacts no server, and writes nothing to disk. It is a writing workspace for people whose ordinary tools are dangerous: a journalist whose phone may be searched, a human-rights defender sharing a device, a refugee organiser on a low-end phone with no reliable connectivity. It is not a messenger, a VPN, or a forensic eraser. Its central, verifiable property is negative — no network, no storage, nothing leaves the browser session unless the user deliberately exports or transmits. This manual explains what a reviewer will see, why each unusual feature exists, and — with equal weight — what the tool cannot do.

---

## 1. Why this tool looks unusual (read this first)

A reviewer may open the file and find features that look surprising for a "document editor": a diet calorie calculator, an ultrasound transmitter, a Bluetooth scanner. None of these are gimmicks. Each one is a direct response to a specific threat that the target users actually face. The mapping is:

| Surprising feature | The real threat it answers |
|---|---|
| Diet-calculator "Post-it" cover | Someone glances at the screen, or briefly seizes the device |
| "Switch document" (destroy → blank) | The user is forced to show the screen and must erase fast |
| Ultrasound text transfer + FEC | No internet; Bluetooth is trackable; the channel is noisy |
| "Emergency Radio" short codes | Ultrasound is slow and fragile, so long text is impractical |
| Bluetooth tail-detection (Sentinel) | The user wants to notice if they are being physically followed |
| Memory-only design, no storage | Forensic search of the device after seizure |

If a feature seems odd, Section 4 explains the threat behind it.

---

## 2. How to verify the core claims in minutes

Everything important about this tool is checkable by inspection. A reviewer does not have to trust the author.

1. **No network calls.** Open the file, open DevTools → Network, and exercise every feature. No request appears. In the source, the strings `fetch`, `XMLHttpRequest`, `WebSocket`, and `sendBeacon` occur only inside the malware-scanner's pattern list, never as live calls.
2. **No persistent storage.** Search the source for `localStorage`, `sessionStorage`, `indexedDB`, and `document.cookie`. They appear only as scanner patterns, never as active reads/writes. Close the tab and the session is gone.
3. **No external dependencies.** There is no `<script src>` or `<link href>` to any remote origin. The whole program is in one file.
4. **Hashes match.** Run `sha256sum letter_editor_v5_9.html` and compare with the in-tool Hash function on the same file.

---

## 3. Feature walkthrough (what a reviewer will click)

### 3.1 The editor
A plain rich-text area with Simple and Expert formatting modes. Save/export to TXT, MD, or HTML. There is deliberately no DOCX/PDF, to keep the file small and dependency-free.

### 3.2 Post-it cover (diet calorie calculator) — redesigned in V5.9
- On first entry, the user sets a secret **unlock number** that looks like a daily calorie goal (e.g., 1850).
- Pressing **Post-it** hides the editor entirely; only an ordinary-looking diet calorie calculator with 50 sample dishes remains. Typed content lives in memory only.
- To return to the document, the user types the unlock number into the **"Daily goal"** field. Nothing else returns.
- A separate **"Switch document"** button **destroys all in-memory data and opens a blank editor**. It cannot bring the original text back. This is for the moment a user is forced to reveal the screen and must be left holding an innocent, empty page.

This is a low-sophistication cover, and the tool says so plainly (see 5.1). Its purpose is incidental inspection and forced reveal, not defeating a forensic adversary.

### 3.3 Emergency Radio + ultrasound with adaptive FEC
- Long text over ultrasound is impractical, so the tool offers a public, humanitarian **codebook of 20 short messages** (WATER NEEDED, MEDIC NEEDED, SAFE, BEING FOLLOWED, DETAINED, EXFIL NOW, ...).
- Ultrasound transmission uses **forward error correction**: interleaving + repetition (majority vote) + **Hamming(7,4)**. Reed-Solomon is reserved as a planned mode (FEC_MODE 3) and is **not shipped** until an independent audit validates a GF(256) implementation — shipping an unaudited self-rolled coder would contradict the project's honesty principle.
- **AURA** (Adaptive Ultrasound Reliability Agent) is a tiny, transparent decision engine (Bayesian/risk-grading patterns) that estimates noise, starts with light FEC, and escalates only after observed failures, learning on-device which mode works. Every decision is logged and shown; nothing leaves the device.

### 3.4 Sentinel + tail-detection
Using the experimental Web Bluetooth scan, the tool can count nearby advertising signals and flag an **anonymous** signal that recurs across several "places" the user marks. It never stores device identifiers — only a one-way hash count. It is presented as a **weak hint, not proof**: family/coworker phones recur too, and modern phones randomise their Bluetooth address.

### 3.5 Built-in safety layer (new in V5.9)
A memory-only hardening module:
- **Sanitizer** — cleans text/number/id inputs before display.
- **HtmlGuard** — neutralises risky markup before it reaches `innerHTML` (removes event-handler attributes, `<script>/<iframe>/<object>`, `javascript:` URLs) and enforces a same-origin / relative / `file:` URL allowlist.
- **ErrorShield** — global `error` / `unhandledrejection` handler so the page fails safe instead of showing a blank screen. It keeps a tiny in-memory ring and **persists nothing**.

### 3.6 Hash & Validate, miniGit, Secure wipe
On-device checksums (SHA family via WebCrypto; MD5/CRC32 via small built-ins) for tamper checking; an in-memory snapshot/diff "miniGit" that keeps no permanent history; and a secure-wipe that overwrites in-memory content. Each states its own limits in the UI.

---

## 4. Threat model (condensed)

| Threat | What the tool does | What it does NOT do |
|---|---|---|
| Device seizure | Memory-only; tab close clears session; cover screen | If seized with tab open, memory is readable via DevTools |
| Coerced disclosure | "Switch document" → destroy + blank page; unlock number to return | Does not erase disk files, OS backups, screenshots |
| Network surveillance | Zero network calls; verifiable in source | Bluetooth transmission is trackable (warned before use) |
| Supply-chain tampering | On-device hash verification | Needs a trusted out-of-band channel for the expected value |
| Shoulder-surfing | Diet-calculator cover | A determined adversary may suspect the cover |
| Contaminated code | Static malware scan + HtmlGuard sanitisation | Pattern matching only; false positives/negatives |

---

## 5. Honest limits (stated deliberately)

### 5.1 The cover is not deniability
A diet-calculator cover protects against a glance or a brief, unsophisticated inspection. An adversary who suspects a cover exists may treat its presence as evidence of concealment. The tool does not claim to solve this and says so in its Help.

### 5.2 A web page cannot guarantee physical erasure
JavaScript cannot control garbage-collection timing, OS swap/pagefile, hibernation images, or SSD wear-leveling. "Switch document" and secure-wipe clear the session heap and DOM; copies may persist in places a browser cannot reach. For seizure-grade protection, the tool recommends combining it with OS-level full-disk encryption and keeping sensitive data off the device.

### 5.3 Private mode cannot be auto-enabled
A web page cannot turn on incognito/private mode by itself; browsers forbid it. The tool therefore guides the user to open a private window themselves and spells out the shortcuts (Chrome/Edge Ctrl+Shift+N, Firefox Ctrl+Shift+P, Safari menu), explaining honestly that a private window reduces local traces but does not hide network/IP.

### 5.4 Not audited yet
At the time of writing, V5.9 has not had an independent security audit. The OTF Security Lab review would be the first formal external assessment, and the FEC roadmap (Reed-Solomon) is explicitly gated on such an audit.

---

## 6. Anticipated reviewer questions

**"What even is this — an editor, a radio, or a tracker?"**
A writing tool first. The radio and scanner are optional safety features for the same at-risk user, each tied to a threat in Section 4.

**"Isn't the diet-calculator cover security theatre?"**
It is a low-sophistication deterrent for incidental inspection and forced reveal, and is described as exactly that. It is not offered as protection against a forensic adversary.

**"Can the emergency wipe be triggered by accident?"**
V5.9 separates the two actions cleanly: tapping a dish only adds calories (normal calculator behaviour); destruction happens only via the clearly-labelled "Switch document" button. This reduces accidental loss compared with earlier designs.

**"Why not just ship Reed-Solomon?"**
Because an unaudited, self-implemented error-correction coder can hide subtle failures, and shipping it as if it were trustworthy would contradict the project's stated honesty principle. It is implemented as a reserved, planned mode pending audit; the active strongest mode is Hamming with interleaving.

**"The file is large. Is it auditable?"**
Yes — it is a single file with no external parts, organised into labelled modules (see `SOURCE_MODULE_INDEX` in the JS). A reviewer can read the whole program in one place; size comes from seven-language UI text and inline documentation, not from hidden complexity.

**"Browser telemetry could still track the user."**
Correct, and the tool says so. It controls only its own behaviour (no calls, no storage). It cannot neutralise the host browser or OS; it recommends a private window and OS-level disk encryption as complements.

---

## 7. Licensing and intent

MIT licensed, no field-of-use restrictions. Built for privacy-preserving, humanitarian, and offline-continuity use. No cloud, no telemetry, no accounts. The design is driven by a clear threat model, and its limitations are stated with the same prominence as its capabilities.

---

*Vitalguard-AI V5.9 — MIT License — Copyright (c) 2026 Morgan J. (Gyu-min Jeon), M-Corp*
*Single file: letter_editor_v5_9.html · SHA-256 of submitted file: [to be filled by submitter]*
