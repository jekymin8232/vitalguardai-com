
# VitalGuard AI v4.3.0 — TEST BUILD

**File:** `VitalGuard_AI_complete_V43.html`

---

## Additional Research Direction

**Ultrasonic / Near‑Ultrasonic Morse Signaling**

Exploratory research is underway to enable **text transmission and reception using Morse-coded ultrasonic or near‑ultrasonic audio signals**.  
The objective is to support **browser-based acoustic communication that works even in constrained environments**, including compatibility with **Safari and other mainstream browsers**.

This approach investigates the feasibility of:

- Encoding short text messages into **Morse‑style acoustic pulses**
- Transmitting signals using **high‑frequency or near‑ultrasonic audio bands**
- Decoding messages on nearby devices using standard **browser audio APIs**
- Maintaining compatibility across major browsers including **Safari, Chromium-based browsers, and WebKit environments**

This research aims to expand **offline and infrastructure‑independent communication methods** for emergency or shutdown scenarios.

---

# What Changed

### Added: **Comms Lab Overlay**

The following experimental communication and emergency utilities have been integrated into a dedicated **Comms Lab interface layer**.

- **Audio Text Beacon**  
  Experimental near‑ultrasonic / high‑frequency acoustic channel for **text transmission and reception between nearby devices**.

- **Nearby Share / HTML Handoff**  
  Enables **native OS share sheet integration**, with fallback support for **direct HTML file sharing** when native transfer is unavailable.

- **Web NFC Demo**  
  Demonstrates **NFC-based data exchange**, supporting both:
  - Plain text transmission
  - **Rescue Pack write/read operations**

- **Panic Shield**  
  Provides a **safer local data wipe mechanism** and switches the interface to a **neutral shell mode**.  
  The function **does not delete the original HTML file from disk**.

- **Live BLE Advertisement Packet Panel**  
  Displays **live Bluetooth Low Energy advertising packet data** for debugging and inspection.

---

### UI Updates

- Added a **v4.3 TEST BUILD notification** within the interface.
- Added a **header link directing users to the Comms Lab module**.
- Updated visible version labeling to **v4.3.0**.

---

# Baseline v4.2.4 Issues Fixed

The following structural and runtime issues from **v4.2.4** have been corrected.

- Added **`SOS.selectedPet()` helper function**  
  Allows Rescue Pack generation logic to **correctly resolve the currently selected target object**.

- Patched **`Wizard.open()`**  
  Ensures `Wizard.petRef` is properly assigned for **re‑verification and update workflows**.

- Injected missing **calibration model UI anchors**
  - `calib-tx`
  - `calib-n`

- Patched **`Detail.render()`**  
  Ensures that **v4.1 add‑on injection modules execute against `this.pet`**, while also generating the **`custom-thresholds` runtime anchor**.

---

# Local Smoke Test Results

Basic integration and runtime tests were executed locally.

| Test | Result |
|-----|-----|
| Top-level script evaluation in mocked browser environment | PASS |
| DOMContentLoaded boot sequence | PASS |
| Rescue Pack encode/decode round-trip | PASS |
| Audio Text Beacon encode/decode round-trip ("HELLO") | PASS |
| NearbyShare current HTML build validation | PASS |
| Runtime UI injection verification (Comms overlay, calibration anchors) | PASS |

---

# Important Limitations

### Audio Text Beacon

- This feature remains **experimental**.
- Performance and reliability **depend heavily on hardware characteristics**, including microphone and speaker frequency response.

---

### Nearby File Transfer

- When available, **native OS sharing mechanisms** are used.
- Standard browsers **do not expose classic Bluetooth file transfer (OBEX push)** through the **Web Bluetooth API**.

---

### Web NFC

- Web NFC remains **experimental**.
- Typically requires:
  - A **supported browser**
  - Execution within a **secure context (HTTPS)**

---

### Speech Recognition

Some browsers implement **SpeechRecognition using cloud-backed services**.

As a result:

- **Panic Shield voice activation mode** is marked as **experimental**
- It falls **outside the strict zero-network-egress design guarantees** of the core system.

---

### Panic Shield Limitations

Panic Shield performs the following actions:

- Clears **browser-side local storage and session data**
- Resets the **user interface to a neutral state**

However:

- It **cannot delete the original `.html` file stored on disk** due to browser security restrictions.

---

**Author:** Morgan J.
