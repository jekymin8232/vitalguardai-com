# VitalGuard AI — Life‑Saving Offline AI Demo (v4.1.3)

VitalGuard AI is a **single‑file, offline‑only** technology demonstration that pairs a **tiny on‑device AI engine (~100KB‑class)** with **Bluetooth (BLE) proximity scanning**.

It’s designed as a *resilience primitive* — something that can still work when the cloud, accounts, app stores, or networks are unavailable.

- **Offline by design:** no server calls, no cloud dependency, no login
- **No data collection:** no telemetry, no analytics, no tracking scripts → **GDPR‑friendly posture**
- **Auditable:** a single HTML file with vanilla JS (no external libraries)
- **Demo skin:** the UI is intentionally presented as a **“Pet Safety Leash”** because it’s universal and harmless — **this is a demo presentation, not the final product domain**

**Public repository:** https://github.com/jekymin8232/luckyvicky-homepage

> **Default UI language:** English  
> **Supported UI languages:** English, 한국어, العربية, 日本語, Français, 繁體中文(台灣), Español  
> (In v4.1.3 you can switch language via the header Language menu or the dropdown.)

---

## What it does (plain language)

When networks fail (wildfires, landslides, tsunamis, evacuations), many “smart” systems stop working because they depend on:
- accounts / logins
- cloud APIs
- subscriptions
- background services that require connectivity

VitalGuard AI demonstrates a different approach:

1) A phone **listens to nearby BLE tags** (cheap key‑finder tags, beacons, small trackers).  
2) BLE signal strength (**RSSI**) is noisy, so a **small AI layer stabilizes it** (math‑based filtering).  
3) The UI shows simple **zones** (SAFE / CAUTION / WARNING) instead of pretending BLE is perfect GPS.  
4) Optional **offline SOS primitives** (QR contact card, audio beacon, etc.) are available for field use.

This is intentionally written so **diplomats, NGOs, universities, and non‑engineers** can understand the system quickly.

---

## Why it matters (life‑saving angle)

VitalGuard AI is not “a pet product”. The leash UI is only a harmless demo wrapper.

The underlying offline engine can support demonstrations such as:
- **Evacuation centers:** tag medical kits / generators → alert if moved outside a safe zone
- **Search & rescue:** tag responders/equipment → quickly know what is nearby in low visibility
- **Family reunification:** proximity monitoring between guardian and child (**not GPS**)
- **Critical inventory control:** offline zone alerts for water/food/medical supplies

---

## What’s inside the demo (key capabilities)

- **Offline BLE proximity monitoring** (scan‑based, RSSI stream)
- **Tiny AI signal stabilizer** (compact math‑based processing; no cloud model)
- **Zone logic** (anti‑flapping / hysteresis to reduce noisy false alerts)
- **Multi‑tag support** (register multiple demo tags)
- **Diagnostics export** (share a self‑contained debug snapshot during field tests)
- **Encrypted local backup** (optional AES‑GCM “Rescue Pack” export for transfer/audit)
- **Single‑file deployment** (easy for security review and offline distribution)

---

## Quick demo (recommended)

**Best environment:** Android + Chrome  
**Important:** Web Bluetooth typically requires a secure context (**https://** or **localhost**). Some browsers restrict BLE scanning from `file://`.

1) Open the demo page (GitHub Pages or a local HTTPS server).  
2) Prepare a cheap BLE key‑finder tag (search keywords: *iTag*, *Key Finder*, *Anti‑lost BLE*).  
3) Home → **Add Demo Tag** → follow the wizard (near → move away → name).  
4) Start monitoring and observe SAFE/CAUTION/WARNING zone changes as proximity changes.  
5) Test **SOS** features (offline QR + audio beacon).

If BLE permission prompts appear: that’s a browser security policy. Installing as a PWA often improves stability.

---

## Privacy & GDPR posture (what we mean)

VitalGuard AI is built around a strict privacy posture:
- **No accounts**
- **No telemetry / analytics**
- **No server uploads**
- Data stays **on the device** (and can be erased anytime)
- Export/backup/diagnostics are **user‑initiated only**

---

## Honest limitations

- **Not GPS:** BLE proximity is affected by walls, crowds, pockets, metal, and weather.
- Treat zones as **signals**, not exact meters.
- This is a **technology demonstration**, not a certified life‑critical medical device.
- Browser BLE support varies by platform.

---

## Identity & contact

- Organization: **McorpAI** — mcorpai.org  
- Creator: **Morgan J.** (Korean name: **Gyumin Jeon**)  
- Contact: **contact@mcorpai.org**
