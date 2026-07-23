# VitalGuard AI — Life‑Saving Offline AI Demo (v4.1.2)

VitalGuard AI is a **single‑file, offline‑only** demo that pairs a **tiny on‑device AI engine** with **Bluetooth (BLE) proximity** to keep helping people even when the cloud is unavailable.

- **Runs in shutdown conditions:** no internet, no cloud accounts, no app store dependency  
- **No data collection:** no telemetry, no analytics, no server calls → **GDPR‑friendly by design**  
- **Demo skin:** the current UI is shown as a “Pet Safety Leash” because it’s universal and harmless — **it’s a demo presentation**, not the final product domain.

> **Default UI language:** English  
> **Supported UI languages:** English, 한국어, العربية, 日本語, Français, 繁體中文(台灣), Español

Repository (public source): https://github.com/jekymin8232/luckyvicky-homepage


## What this demo is (plain language)

When networks fail (wildfires, landslides, tsunamis, mass evacuations), many “smart” solutions stop working because they depend on:
- accounts / logins
- cloud APIs
- payments / subscriptions
- background services that require connectivity

VitalGuard AI demonstrates a different approach:

1) **A phone listens to nearby BLE tags** (cheap key‑finder tags, beacons, trackers).  
2) The signal (RSSI) is noisy, so a **small AI layer** stabilizes it.  
3) The app shows simple “zones” (SAFE / CAUTION / WARNING) and can trigger **offline SOS primitives** (QR contact card, audio beacon, etc.).

This is intentionally designed to be understandable by **diplomats, NGOs, universities, and companies** — not only by AI engineers.


## Why it matters (life‑saving focus)

VitalGuard AI is structured as a **resilience primitive**: simple tools that still work during a blackout or shutdown.

Example humanitarian / disaster uses (concept demos):
- **Evacuation centers:** tag medical kits / generators → alert if moved outside a safe zone  
- **Search & rescue:** tag responders or equipment → quickly know what is nearby in low visibility  
- **Family reunification:** proximity monitoring between guardian and child (**not GPS**)  
- **Critical inventory control:** offline zone alerts for water/food/medical supplies


## What makes it credible

- **Auditable:** one HTML file, no external libraries, easy for security review  
- **No silent networking:** no analytics SDKs, no tracking scripts  
- **Tiny AI engine:** the core logic is ~**100 KB**‑class (roughly “smaller than a single photo”) and relies on compact, math‑based processing rather than a heavy cloud model  
- **Deployable:** works on common Android phones + cheap BLE tags  
- **Mesh‑ready:** concept support for cooperative multi‑phone scanning and offline result sharing  
- **Secure hand‑off:** optional encrypted “Rescue Pack” exports for audits / field transfer  
- **Security features:** encrypted export/backup options (when enabled) and local‑first design


## Quick demo (recommended)

**Best environment:** Android + Chrome  
**Note:** Web Bluetooth typically requires a secure context (**https://** or **localhost**). Some browsers may not allow BLE scanning from `file://`.

1. Open the demo page (GitHub Pages or a local HTTPS server).  
2. Prepare a cheap BLE key‑finder tag (keywords: *iTag*, *Key Finder*, *Anti‑lost BLE*).  
3. Home → **Add Demo Tag** → follow the wizard (near → move away → name).  
4. Start monitoring and observe SAFE/CAUTION/WARNING zone changes as proximity changes.  
5. Test **SOS** features (offline QR + audio beacon).

If BLE permission prompts appear: it’s a browser security policy. Installing as a PWA often improves stability.


## Privacy & GDPR

VitalGuard AI is built around a strict privacy posture:
- **No accounts**
- **No telemetry / analytics**
- **No server uploads**
- Data is stored locally on the device (and can be erased anytime)
- Export/backup/diagnostics are **user‑initiated only**


## Important limitations (honest notes)

- **Not GPS:** BLE proximity is affected by walls, crowds, pockets, metal, and weather conditions.  
- Treat zones as **signals**, not exact meters.  
- This is a **technology demonstration**, not a certified life‑critical device.  
- Web Bluetooth support varies by platform (iOS Safari is typically limited).


## Project identity & contact

- Organization: **McorpAI** — mcorpai.org  
- Creator: **Morgan J.** (Korean name: **Gyumin Jeon**)  
- Contact: **contact@mcorpai.org**


## License / Ethical use

This project is intended for **humanitarian, life‑saving purposes**.  
Military or surveillance use is prohibited by the project’s ethical license.

(See the license section inside the HTML for the most current text.)
