# VitalGuard AI v4.7.3 — Full Code Index

*A physical table of contents for `VitalGuard_AI_complete_V47_3.html`.*

---

## What this document is

This is a navigation aid and nothing else. It tells you what is at which line of the artifact, so that a reader can find a module without scrolling through 13,294 lines of a single file.

It makes no judgement about importance, risk or priority, and it defines no review scope. Every part of the file is listed at the same level of standing, in the order it physically appears.

Scope, threat model and review priorities are held in a separate document, `V47_3_Audit_Scope_Map.md`. Nothing here supersedes, extends or qualifies it.

### How to read the tables

- **Lines** are physical line numbers, 1-based, as reported by `wc -l`.
- **Identifier** is the exact string as it appears in the source, so it can be used directly with Ctrl-F. Names in `code font` are real identifiers; names in plain text are descriptive labels for blocks that have no single identifier.
- **Contents** says what the block is, not what it is worth.
- Entries within a part appear in line order. Small gaps between entries are blank separator lines; see Appendix A.

---

## Artifact identification

Line numbers are valid only for the exact build below. Any byte-level change invalidates every number in this document.

| Field | Value |
|---|---|
| File | `VitalGuard_AI_complete_V47_3.html` |
| SHA-256 | `b81c067f5523bc68728ae84f2fc93ce05077705ae4cb7e882f1c859885f47615` |
| Lines | 13,294 |

---

## Quick map

Eighteen contiguous parts covering lines 1 to 13,294 with no gap and no overlap.

| Part | Lines | Size | Title |
|---:|---:|---:|---|
| 1 | 1–40 | 40 | Document head, metadata and content policy |
| 2 | 41–132 | 92 | Pre-guard script |
| 3 | 133–351 | 219 | Stylesheet |
| 4 | 352–846 | 495 | Static markup |
| 5 | 847–2,034 | 1,188 | Main script — foundations |
| 6 | 2,035–3,868 | 1,834 | Internationalisation |
| 7 | 3,869–4,175 | 307 | Dialogs, wipe and storage helpers |
| 8 | 4,176–6,017 | 1,842 | Storage, signal model, QR, voice and BLE |
| 9 | 6,018–7,741 | 1,724 | Screens and feature modules |
| 10 | 7,742–8,217 | 476 | Application core |
| 11 | 8,218–8,904 | 687 | Platform services and on-device AI |
| 12 | 8,905–9,300 | 396 | Reset, encrypted backup and UI injection |
| 13 | 9,301–10,816 | 1,516 | Compatibility patches and v4.1 extensions |
| 14 | 10,817–11,273 | 457 | Final hardening layer |
| 15 | 11,274–12,022 | 749 | Crypto, vault and BLE identity |
| 16 | 12,023–12,441 | 419 | Rescue Pack v2, import/export and routing closure |
| 17 | 12,442–12,810 | 369 | Passphrase policy, maintenance history and accessibility |
| 18 | 12,811–13,294 | 484 | Self-test, bootstrap and document close |

---

## Part 1 — Document head, metadata and content policy
**Lines 1–40**

| Lines | Identifier | Contents |
|---:|---|---|
| 1–11 | file header comment | Project purpose, offline and privacy statements, copyright, Apache-2.0 notice. |
| 12 | `<html lang="en" translate="no">` | Document element. |
| 13–20 | `<meta>` block | Charset, viewport, robots, description, SPDX identifier, third-party licence declaration. |
| 21–24 | `SECURITY_CSP_GUARD` | Content Security Policy meta element. Line **22** carries the full policy string including three pinned SHA-256 hashes and the Trusted Types requirement. |
| 25 | `required-response-headers` | Response headers expected when the file is served over HTTP(S). |
| 26 | `security-limitations` | Declared limits of a meta-delivered CSP. |
| 27–29 | integrity and capability meta | Digest guidance and capability boundary text. |
| 30–32 | `VG473_CAPABILITY_MANIFEST_MACHINE` | Machine-readable capability manifest. |
| 33–36 | release meta | Version, build posture and status declarations. |
| 37–39 | `VG473A_REINFORCEMENT_LOG` | Reinforcement provenance for this build. |
| 40 | `release-lineage` | Statement of which artifact this build was produced from. |

---

## Part 2 — Pre-guard script
**Lines 41–132** · first inline `<script>`, runs before anything else

| Lines | Identifier | Contents |
|---:|---|---|
| 41 | `<script>` | Opening tag. |
| 42 | `WP1_ZERO_EGRESS_CORE` | Start marker. |
| 43–45 | IIFE opening | Strict-mode wrapper. |
| 46 | `T` | Telemetry counters. |
| 47 | `R` | Replacement-stub registry. |
| 48–58 | `note`, `lock`, `locked`, `rejectStub`, `throwStub` | Helpers for recording and installing non-writable property locks. |
| 62–75 | frame detection | `framed=window.top!==window.self` at **62**, followed by the framed-execution response. |
| 77–79 | WebRTC replacement | `RTCPeerConnection` and related constructors. |
| 80–85 | Worker replacement | `Worker`, `SharedWorker`. |
| 86–87 | network stubs | `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`. |
| 88 | request and popup locks | Non-writable locks over the replaced members and `window.open`. |
| 89–91 | beacon, share and Service Worker locks | `sendBeacon`, `navigator.share`, `serviceWorker.register`. |
| 92–94 | form locks | `HTMLFormElement.prototype.submit` and `requestSubmit`. |
| 95 | prototype freeze | `Object.freeze` over selected built-in prototypes. |
| 96–97 | `eval` replacement | `eval` and `Function` constructor. |
| 98–115 | bounded self-check | Descriptor inspection and the invariant `tick()` at **113**. |
| 116–127 | inspection helpers | Report assembly for the diagnostic surface. |
| 128–130 | `api` | Frozen diagnostic object exposing profile, telemetry and status. |
| 131 | IIFE close | End of the guard. |
| 132 | `</script>` | Closing tag. Note the marker at **129** closes before the executable block ends at 131. |

---

## Part 3 — Stylesheet
**Lines 133–351** · the only inline `<style>` element

| Lines | Identifier | Contents |
|---:|---|---|
| 133 | `<style>` | Opening tag. |
| 134–244 | base system | Custom properties, reset, typography, layout, header, panels, cards, buttons, pet status, badges, overlays, wizard, SOS and settings styling. |
| 245–299 | v4.1 feature styles | Language control, install banner, scan-health indicator, pet chips, QR frame, voice controls, emergency screen. |
| 300–310 | v4.2 polish | Hero animation and presentation refinements. |
| 311–326 | secure prompt styles | `.sp-backdrop`, `.sp-*` classes for the in-app input dialog. Implementation is in Part 7. |
| 327–331 | accessibility modes | Large text, high contrast, reduced motion. |
| 332–349 | `VG472_STYLES` | Capability notice, capability manifest panel and clone-state acknowledgement control. |
| 350 | blank | — |
| 351 | `</style>` | Closing tag. |

---

## Part 4 — Static markup
**Lines 352–846**

| Lines | Identifier | Contents |
|---:|---|---|
| 352 | `</head>` | Head close. |
| 353 | `<body>` | Body open. |
| 354–394 | application shell and header | Install banner, application identity, mission and disclaimer text, source, help, about and language controls. |
| 395–426 | home panel opening | Project overview and feature badges. |
| 427–437 | `CAPABILITY_MANIFEST_NOTICE` | User-facing capability notice. |
| 438–508 | home panel body | Pet dashboard, monitoring controls, coach container. |
| 509–555 | SOS panel | Local finder, hand-off notice, location and message controls, alarm, personal emergency entry. |
| 556–561 | guide panel | Container for the translated guide and field notes. |
| 562–661 | settings panel | Alerts, performance, voice and audio, emergency mode, registered pets, backup, import, diagnostics, reset, guides. |
| 662–669 | bottom navigation | Home, SOS, Guide, Settings. |
| 670–747 | registration wizard markup | Scan, verification, calibration, icon and name selection, save. |
| 748–817 | overlay containers | Pet detail, help, legal, language, diagnostics, emergency configuration. |
| 818–844 | full-screen emergency displays | SOS alarm screen; personal emergency siren, strobe, QR and contact screen. |
| 845–846 | shell close | Closes the root application container. |

---

## Part 5 — Main script, foundations
**Lines 847–2,034** · second inline `<script>`, opens at 847 and closes at 13,292

| Lines | Identifier | Contents |
|---:|---|---|
| 847–850 | `<script>` | Opening tag and preamble. |
| 851–924 | changelog | Release history, newest first. Earlier entries are retained rather than replaced. |
| 926–927 | strict mode and frame check | `'use strict'` and the embedded-frame abort. |
| 929–937 | early network stubs | `_deny` at **931**; second-layer neutralisation of `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`, `sendBeacon` before modules load. |
| 940–946 | early guard comment | Notes on the sanitisation posture that follows. |
| 947–955 | `Sanitizer` | `name`, `phone`, `text`, `icon`, `escapeHTML`, `safeId`. |
| 957–959 | dispatcher comment | Introduction to the action policy. |
| 960 | `WP7_ACTION_POLICY` | Start marker. |
| 961 | `VitalGuardActionPolicy` | IIFE containing the whole action system. |
| 962–972 | `allowed` | Frozen namespace-to-method allowlist. |
| 973–991 | `rootFor` | Namespace resolution. |
| 992–1,002 | `normalize`, `splitArgs` | Action-string normalisation and argument splitting. |
| 1,003 | `VG473_ACTION_PIPELINE` | Start marker. |
| 1,024–1,053 | `vg473IsPlaceholder`, `parseAtomToken`, `parseAtom` | Token classification and placeholder handling. |
| 1,054 | `VG473_ARG_CONTRACT` | Start marker. |
| 1,062–1,100 | validator primitives | `VG473_THRESHOLD_RANGE`, `vg473Icons`, `vg473LeashKeys`, `vEnum`, `vEnumLazy`, `vSafeId`, `vBoundedNum`, `vBoundedInt`, `vStrictBool`, `vChangeEvent`. |
| 1,101–1,186 | `VG473_CONTRACTS` | Per-method argument contract table. |
| 1,187–1,200 | `validateResolvedArgumentContract` | Contract evaluation. |
| 1,201 | `VG473_ARG_CONTRACT` | End marker. |
| 1,203–1,216 | `parseActionSyntax` | Grammar parsing; dangerous-token rejection at **1,206**. |
| 1,217–1,219 | `validateMethodAllowlist` | Allowlist lookup. |
| 1,221–1,231 | `validateStaticArgumentTokens` | Phase 1, markup-time validation. |
| 1,232–1,267 | `resolveRuntimeArguments`, `staticParse`, `runtimeParse` | Phase 2, runtime resolution. |
| 1,271–1,278 | `parse` | Legacy signature retained for compatibility. |
| 1,279–1,288 | `isAllowedAction`, `invokeAllowedMethod` | Allowlisted invocation. |
| 1,289–1,293 | `invoke` | Direct invocation entry. |
| 1,294 | `VG473_ACTION_PIPELINE` | End marker. |
| 1,295–1,302 | frozen export | Public surface of the policy object. |
| 1,303 | `WP7_ACTION_POLICY` | End marker. |
| 1,305–1,319 | `VitalGuardActionDispatcher` | Capturing event dispatcher; `handle` at **1,307**. |
| 1,321–1,324 | `VitalGuardTrustedTypesGuard`, `guard` | Guard IIFE opening. |
| 1,325 | `WP2_HTML_SANITIZER_CORE` | Start marker. |
| 1,333–1,357 | `neutralizeHTMLRegex` | Pre-filter used ahead of the parser path. |
| 1,358–1,372 | `VG472_TAGS` | Allowed element names. |
| 1,373–1,380 | `VG472_DROP` | Elements dropped with their subtree. |
| 1,381–1,391 | `VG472_ATTRS` | General attribute allowlist. |
| 1,392 | `VG473_URL_POLICY` | Start marker; `vg473UrlPolicy` at **1,402**, `vg472SafeUrl` at **1,426**. |
| 1,427 | `VG473_URL_POLICY` | End marker. |
| 1,429 | `VG473_DATA_ATTR_ALLOWLIST` | Start marker; `VG473_DATA_ATTRS` at **1,434**, `VG473_ARIA_ATTRS` at **1,442**. |
| 1,452 | `VG473_DATA_ATTR_ALLOWLIST` | End marker. |
| 1,454–1,494 | `vg472CopyAttrs` | Attribute copying under the allowlists and URL policy. |
| 1,495–1,520 | `vg472Copy` | Recursive rebuild with a node budget. |
| 1,521–1,546 | `neutralizeHTML` | `DOMParser` reconstruction. |
| 1,547 | `WP2_HTML_SANITIZER_CORE` | End marker. |
| 1,549–1,557 | policy creation | `trustedTypes.createPolicy` calls at **1,550** and **1,552**. |
| 1,558 | `VG473_SINGLE_SANITIZE_PASS` | Start marker. |
| 1,572 | `VG473_SINGLE_SANITIZE_PASS` | End marker. |
| 1,573–1,590 | `patchInnerHTML` | `innerHTML` setter patch. |
| 1,591–1,597 | `insertAdjacentHTML` patch | Sink wrapper. |
| 1,598–1,604 | `createContextualFragment` patch | Sink wrapper. |
| 1,605–1,645 | `guard.scrubNode`, `isAllowedUrl` | MutationObserver scrubbing; `isAllowedUrl` at **1,608**. |
| 1,646–1,648 | `document.write` block | Replaced with a no-op. |
| 1,649–1,660 | share replacement | Copy-only replacement for the OS share sheet. |
| 1,661–1,663 | guard close | End of the IIFE. |
| 1,665–1,708 | `VGHTML` | Shared safe-sink wrapper and clipboard-only hand-off. |
| 1,710–1,764 | configuration | `DEFAULT_THRESHOLDS` **1,737**, `normalizeThresholds` **1,742**, `LEASH_PRESETS` **1,751**, `PERF_PROFILES` **1,757**, `ZONE_ORDER` **1,763**, plus version and database-name constants. |
| 1,765–1,816 | utilities | `median` **1,768**, `genRescueId` **1,774**, `genLocalIdSuffix` **1,789**, `fmtAgo` **1,804**, `safeJson` **1,812**, `nowMs` **1,815**. |
| 1,817–1,831 | `ETHICAL_MANIFEST` | Frozen licence, purpose and project principles; object at **1,821**. |
| 1,832–1,895 | `EthicalGuard` | Runtime validation of the manifest declarations; object at **1,835**. |
| 1,896–1,899 | shared state | Active performance profile and processing throttle. |
| 1,900–2,014 | `AudioEngine` | Zone alerts, siren, volume, optional keepalive; object at **1,902**. |
| 2,015–2,034 | `Toast` | Transient status and error messaging; object at **2,016**. |

---

## Part 6 — Internationalisation
**Lines 2,035–3,868** · a single IIFE assigned to `I18N`

| Lines | Identifier | Contents |
|---:|---|---|
| 2,040 | `I18N` | Module open. |
| 2,041–2,042 | storage keys | `vg_lang_v41`, legacy `vg_lang_v412`. |
| 2,043 | `RTL_LANGS` | Right-to-left language set; currently `ar` only. |
| 2,045 | `STR` | Dictionary root. |
| 2,046–2,077 | `en` | English strings. |
| 2,078–2,109 | `ko` | Korean strings. |
| 2,110–2,141 | `ar` | Arabic strings. |
| 2,142–2,173 | `ja` | Japanese strings. |
| 2,174–2,205 | `fr` | French strings. |
| 2,206–2,236 | `zh-TW` | Traditional Chinese strings. |
| 2,237–2,270 | `es` | Spanish strings. |
| 2,271 | `HTML` | Translated markup root. |
| 2,272–2,697 | `HTML.tips` | Guide and field-notes panels, seven languages. |
| 2,698–3,251 | `HTML.help` | Help panels, seven languages. |
| 3,252–3,648 | `HTML.legal` | Legal and about panels, seven languages. |
| 3,649–3,765 | v4.2 additions | Language menu strings and the first-run notice, merged into the dictionaries. |
| 3,766–3,772 | `currentDict`, `t` | Lookup with English fallback. |
| 3,773–3,779 | `setLang` | Language switch with persistence. |
| 3,780–3,781 | `getLang` | Current language. |
| 3,782–3,854 | `apply` | Applies strings to the DOM; `lang` and `dir` set at **3,784–3,786**. |
| 3,855–3,865 | `init` | Restores the stored language on boot. |
| 3,867–3,868 | module close | Public surface `{ init, apply, t, setLang, getLang, HTML }`. |

---

## Part 7 — Dialogs, wipe and storage helpers
**Lines 3,869–4,175**

| Lines | Identifier | Contents |
|---:|---|---|
| 3,870–3,872 | section comment | Global-scope security helpers. |
| 3,873–4,075 | `SecurePrompt` | In-app input dialog replacing the browser `prompt()`. `ensure` **3,877**, `open` **3,917**, masking toggle **3,961**, `close` **4,007**, `cancel` **4,011**, `submit` **4,016**. Public surface `{ open, askPassphrase, askText }` at **4,074**. |
| 4,077–4,132 | `ConfirmModal` | Dialog replacing the browser `confirm()`; object at **4,079**. Destructive variants place initial focus on Cancel at **4,129**. |
| 4,134–4,156 | `Security` | Object at **4,135**. `fullWipe()` **4,137–4,152** clears the store, deletes the IndexedDB database, deletes caches whose key begins with `vitalguard-ai` (**4,145**) and unregisters Service Workers within the current scope (**4,148–4,149**). `maybeAutoWipeOnClose()` at **4,155** returns `false`. |
| 4,158–4,167 | storage wrappers | `safeLocalStorageGet` **4,158**, `safeLocalStorageRemove` **4,159**, `safeLocalStorageKeys` **4,160**, `safeLocalStorageSet` **4,161**; the setter returns `false` on quota exhaustion rather than throwing. |
| 4,168–4,174 | encoders | `_vgE` HTML escaping at **4,168**, `_vgI` identifier filtering at **4,174**. |

---

## Part 8 — Storage, signal model, QR, voice and BLE
**Lines 4,176–6,017**

| Lines | Identifier | Contents |
|---:|---|---|
| 4,176–4,337 | `Store` | IndexedDB with localStorage fallback; object at **4,177**. Members: `init` 4,180, `savePet` 4,201, `getAllPets` 4,214, `_lsPets` 4,225, `deletePet` 4,231, `clearAll` 4,238, `saveSetting` 4,245, `getSetting` 4,257, `saveAI` 4,269, `getAI` 4,281, `saveBlob` 4,293, `getBlob` 4,312. |
| 4,338–4,372 | `KalmanRSSI` | Signal smoothing; class at **4,340**. |
| 4,373–4,408 | `DistanceEstimator` | Filtered RSSI and calibration to approximate distance; class at **4,374**. |
| 4,409–4,468 | `QLearningLite` | Small on-device reinforcement model. |
| 4,469–4,501 | `BehavioralFingerprint` | Per-tag signal pattern learning and similarity output. |
| 4,502–4,512 | `RingBuffer` | Bounded recent-sample storage. |
| 4,513–4,747 | `Pet` | Tag state, RSSI history, zone transitions, thresholds, alerts, ambiguity state, AI state, serialisation. |
| 4,748–4,775 | QR component notice | Project Nayuki attribution and MIT licence text. |
| 4,777–5,617 | `qrcodegen` | Vendored QR encoder. |
| 5,620–5,671 | `QRGenerator` | Local wrapper that renders a payload to canvas. |
| 5,674–5,748 | `VoiceRecall` | Records, stores and plays a short local clip; object at **5,675**. |
| 5,749–5,784 | `VoiceAnnouncer` | Local speech output for zone changes; object at **5,750**. |
| 5,785–5,820 | matching helpers | `_mfgPrefixHexFromEvent` **5,786**, `_matchEvidenceV455Base` **5,801**, `matchScore` **5,810**, `routeAdvertisement` **5,811**. |
| 5,821–6,017 | `BLE` | Scan engine; object at **5,822**. Members: `checkSupport` 5,852, `_resetCounters` 5,859, `markAdv` 5,867, `congestionLevel` 5,881, `_buildTrackFilters` 5,888, `startScan` 5,907, `stopScan` 5,974, `restartScan` 5,985. |

---

## Part 9 — Screens and feature modules
**Lines 6,018–7,741**

| Lines | Identifier | Contents |
|---:|---|---|
| 6,018–6,439 | `Wizard` | Registration flow; object at **6,019**. Members: `isOpen` 6,035, `open` 6,039, `close` 6,067, `_showStep` 6,079, `_startScan` 6,105, `_startDemoScan` 6,140, `handleAdv` 6,158, `_tagLikelihood` 6,186, `_renderCandidates` 6,206, `selectCandidate` 6,249, `_goStep2` 6,281, `skipVerify` 6,327, `goStep3` 6,333, `_buildIconPicker` 6,346, `pickIcon` 6,352, `rescan` 6,357, `_currentCandidateMedian` 6,367, `recordCalib` 6,373, `clearCalib` 6,382, `save` 6,389. |
| 6,440–6,576 | `SOS` | Object at **6,441**. Members: `holdStart` 6,449, `holdEnd` 6,450, `activate` 6,452, `deactivate` 6,462, `_startStrobe` 6,470, `updateHC` 6,477, `updateSnapshot` 6,500, `saveLocation` 6,518, `shareMessage` 6,536, `renderPetSelect` 6,552, `selectPet` 6,564. |
| 6,577–6,806 | `Emergency` | Personal emergency mode; object at **6,578**. Members: `load` 6,588, `save` 6,595, `open` 6,603, `close` 6,608, `render` 6,612, `saveFromUI` 6,670, `toggleShake` 6,678, `requestMotionPermission` 6,685, `holdStart` 6,700, `holdEnd` 6,701, `activate` 6,703, `deactivate` 6,748, `_startStrobe` 6,764, `getPayload` 6,772, `share` 6,779, `handleMotion` 6,785. |
| 6,807–7,094 | `Detail` | Pet detail overlay; object at **6,808**. Members: `open` 6,811, `close` 6,825, `render` 6,829, `setLeash` 6,995, `updateThreshold` 7,007, `toggleAI` 7,022, `suggestAI` 7,029, `applySuggestion` 7,059, `aiFeedback` 7,074, `resetQ` 7,085. |
| 7,095–7,129 | `Nav` | Panel switching and tab state; object at **7,096**. |
| 7,130–7,287 | `Settings` | Object at **7,131**. Members: `load` 7,145, `_updateToggles` 7,164, `_updatePerfUI` 7,178, `_updateVolumeUI` 7,184, `toggle` 7,193, `toggleNotif` 7,207, `setPerf` 7,235, `setVolume` 7,246, `renderPetList` 7,253, `removePet` 7,270, `resetApp` 7,280. |
| 7,288–7,304 | `DataManager` | Export and import entry points; object at **7,289**. The import call reaches `window.VitalGuardHardenedImport` at **7,298**. |
| 7,305–7,307 | help section comments | Introduces the help and capability panel. |
| 7,308 | `CAPABILITY_MANIFEST_PANEL` | Start marker. |
| 7,314–7,493 | `VG472CapabilityManifest` | Object at **7,314**. Members: `vg473ParseMachineMeta` 7,347, `vg473Drift` 7,365, `drift` 7,427, `render` 7,441, `mount` 7,482. Contains marker `VG473_CAPABILITY_DRIFT` at **7,327–7,440**. |
| 7,495–7,513 | `Help` | Multilingual help overlay; object at **7,495**. Members: `open` 7,496, `close` 7,505, `_content` 7,508. |
| 7,514–7,530 | `Legal` | Licence, privacy and limitations overlay; object at **7,515**. |
| 7,531–7,560 | `Lang` | Language selection overlay; object at **7,532**. |
| 7,561–7,669 | `Diag` | Diagnostics; object at **7,562**. Members: `open` 7,563, `close` 7,567, `snapshot` 7,569, `render` 7,626, `copy` 7,652, `download` 7,657. |
| 7,670–7,741 | `Coach` | Local suggestions and one-tap actions; object at **7,671**. |

---

## Part 10 — Application core
**Lines 7,742–8,217**

| Lines | Identifier | Contents |
|---:|---|---|
| 7,742–8,217 | `App` | Object at **7,743**. Members: `init` 7,753, `initFirstRunBanner` 7,843, `dismissFirstRun` 7,857, `resetTimers` 7,862, `toggleMonitoring` 7,870, `toggleDemo` 7,899, `_startDemo` 7,915, `_stopDemo` 7,922, `_demoTick` 7,926, `setTrackMode` 7,948, `addPet` 7,964, `onAdvertisement` 7,970, `triggerAlert` 7,999, `_watchdog` 8,024, `renderPetChips` 8,054, `focusFromChip` 8,071, `render` 8,082. |

---

## Part 11 — Platform services and on-device AI
**Lines 8,218–8,904**

| Lines | Identifier | Contents |
|---:|---|---|
| 8,218–8,278 | PWA support | In-memory manifest, install prompt and local install flow. |
| 8,279–8,320 | `Sanitizer` (secondary) | Compatibility sanitisation helpers for later modules; object at **8,280**. `sleep` **8,311**, `downloadText` **8,312**. |
| 8,321–8,389 | `ErrorShield` | Bounded crash capture; object at **8,322**. Members: `load` 8,328, `_schedulePersist` 8,338, `capture` 8,347, `hook` 8,364, `clear` 8,382. |
| 8,390–8,455 | `Capabilities` | Browser feature detection; object at **8,391**. Members: `battery` 8,392, `computeSync` 8,398, `badgeHTML` 8,419, `renderHTML` 8,423. |
| 8,456–8,469 | `Accessibility` | Applies accessibility preferences to the document root; object at **8,457**. |
| 8,470–8,503 | `WakeLockManager` | Screen wake lock during monitoring; object at **8,471**. |
| 8,504–8,546 | `KNNLite` | Nearest-neighbour classifier; class at **8,507**. |
| 8,548–8,600 | `RLSCalibrator` | Recursive least-squares calibration; class at **8,550**. |
| 8,601–8,693 | `IsolationForestLite` | Anomaly detection; class at **8,603**. |
| 8,694–8,771 | `AIPackV4` | Per-pet orchestration; object at **8,695**. Members: `attachPet` 8,698, `featureVector` 8,707, `onPetProcessed` 8,718, `learnFromFeedback` 8,747, `exportState` 8,753, `explain` 8,763. |
| 8,772–8,872 | `ConductorAI` | Health assessment and remediation suggestions; object at **8,773**. Members: `init` 8,781, `refreshBattery` 8,788, `batteryInfo` 8,799, `compute` 8,808, `tick` 8,864. |
| 8,874–8,904 | `SafeMode` | Reduced-function fallback; object at **8,874**. |

---

## Part 12 — Reset, encrypted backup and UI injection
**Lines 8,905–9,300**

| Lines | Identifier | Contents |
|---:|---|---|
| 8,905 | section comment | Reset and initialise centre. |
| 8,906 | `DESTR_RESET_CENTER` | Start marker. |
| 8,907–9,058 | `ResetCenter` | Object at **8,907**. Members: `ensureUI` 8,908, `open` 8,923, `close` 8,928, `render` 8,932, `soft` 8,978, `_confirmHard` 8,995, `hard` 9,008, `factory` 9,024. |
| 9,059 | `DESTR_RESET_CENTER` | End marker. |
| 9,061–9,124 | `CryptoBox` | Earlier encrypted export and import path; object at **9,062**. Members: `supported` 9,063, `_b64` 9,066, `_u8` 9,071, `_deriveKey` 9,077, `_aad` 9,092, `encryptString` 9,097, `decryptToString` 9,115. |
| 9,125–9,300 | `V40UI` | Injects advanced settings, accessibility, diagnostics, coach and encrypted-export controls; object at **9,126**. Members: `inject` 9,129, `renderSafeBanner` 9,212, `exportEncrypted` 9,241, `showPitch` 9,291. |

---

## Part 13 — Compatibility patches and v4.1 extensions
**Lines 9,301–10,816**

| Lines | Identifier | Contents |
|---:|---|---|
| 9,301–9,379 | patch: settings | New preferences and toggles. |
| 9,380–9,386 | patch: BLE filters | Scan-filter toggle. |
| 9,387–9,423 | patch: pet AI attach | AI attachment and sanitisation. |
| 9,424–9,471 | patch: detail feedback | Feedback routed into KNN learning, extended explanation text. |
| 9,472–9,491 | patch: wizard and emergency | Input sanitisation on save paths. |
| 9,492–9,546 | patch: init and monitoring | Wake lock, conductor and error shield integration. |
| 9,547–9,613 | patch: diagnostics | Capabilities, error log and battery in the snapshot. |
| 9,614–9,664 | patch: coach card | Tips and one-tap actions. |
| 9,665–9,680 | patch: legal and about | Text corrections. |
| 9,681–9,692 | patch: SOS snapshot | Sanitisation of the location snapshot. |
| 9,693–9,719 | patch: import | Encrypted pack support in the import path. Note at **9,694** records that the legacy importer is disabled. |
| 9,700–9,711 | alert-preference helpers | `V41_DEFAULT_ALERT_PREFS` 9,700, `V41_ZONE_RANK` 9,707, `v41ZoneRank` 9,709, `v41EnsureAlertPrefs` 9,711. |
| 9,720–9,763 | lost-state correction | Repeated LOST transitions and battery-suspect handling. |
| 9,764–9,791 | per-pet alert routing | Sound, vibration, speech and minimum zone per tag. |
| 9,792–9,810 | active-pet limit | Maximum of ten active monitored pets. |
| 9,811–9,899 | `V41UI` | Object at **9,812**; leash-distance slider converting a 2–15 m setting into thresholds. |
| 9,900–9,937 | Calibration Pro — shims | Compatibility guards for base-wizard methods. |
| 9,938–10,116 | Calibration Pro — logic | Wizard state extension 9,938, live model label 10,004, reset 10,011, `Wizard.save` override 10,027, active-pet guard 10,037, input sanitisation 10,046, signature selection 10,052, basic points 10,074, RLS fit 10,081. |
| 10,117–10,200 | Calibration Pro — wizard UI | Injected calibration interface. |
| 10,201–10,337 | Calibration Pro — detail UI | Injected calibration panel in the detail overlay. |
| 10,338–10,424 | per-pet alert UI | Detail-view controls for tag-specific alert preferences. |
| 10,425–10,462 | Rescue Pack v1 — encoding | `b64urlEncodeUtf8` 10,427, `b64urlDecodeUtf8` 10,437, pack generation. |
| 10,463–10,529 | Rescue Pack v1 — routing | `App.onAdvertisement` and BLE filter builder extended for assist mode. |
| 10,530–10,630 | Rescue Pack v1 — UI | SOS panel import, share and periodic update. |
| 10,631–10,650 | injection bridges | `Detail.render` 10,631 and `V40UI.inject` 10,641 extended to include v4.1 blocks. |
| 10,651–10,744 | diagnostics self-test UI | User-triggered local test: QR 10,667, RLS sanity 10,675, Rescue Pack round-trip 10,692, performance micro-benchmark 10,707. |
| 10,745–10,816 | extended-field persistence | Saves and restores alert preferences, leash distance, disabled state and lost-event history. |

---

## Part 14 — Final hardening layer
**Lines 10,817–11,273**

| Lines | Identifier | Contents |
|---:|---|---|
| 10,817–10,827 | layer header | Introduction and helper aliases `vgToast` 10,824, `vgEscape` 10,825, `vgSafeZone` 10,826. |
| 10,828–10,877 | `RuntimeNetworkGuard` | Runtime egress kill-switch; object at **10,829**. |
| 10,878–10,910 | `ExternalNavigationGuard` | Blocks `http(s)`, `mailto`, `tel` and `sms` navigation from the shell; object at **10,879**. |
| 10,911–10,948 | copy-only sharing | App-level override of the OS share sheet. |
| 10,949–10,982 | alert-path fix | Per-pet alert patch aligned with the one-argument `App.triggerAlert(pet)` signature. |
| 10,983–10,995 | detail render wrapper | Ensures injected v4.1 UI runs after the base DOM is painted. |
| 10,996–11,028 | coach action registry | Replaces function-string injection in `Coach.render`. |
| 11,029–11,053 | diagnostics sanitisation | Render-path sanitisation. |
| 11,054–11,077 | Rescue Pack share | Share and SMS paths become copy-only. |
| 11,078–11,093 | emergency call link | Copy-only in zero-egress mode. |
| 11,094–11,117 | decoded pack hardening | Size, expiry, schema and text checks. |
| 11,118–11,131 | label hardening | Source and contact labels remain non-clickable after re-render. |
| 11,132–11,174 | self-test sanity override | Removes undefined locals and navigation side effects from the test path. |
| 11,175–11,191 | audit hardening header | `AuditHardening` object; import limits declared at **11,180**. |
| 11,192 | `WP6C_IMPORT_BOUNDARY` | Start marker. |
| 11,193–11,204 | import sanitisers | `assertJsonShape` 11,193, `n` 11,194, `b` 11,195, `hex` 11,196, `sanitizeThresholds` 11,197, `sanitizeSignature` 11,198, `sanitizeDistanceCalib` 11,199, `sanitizeAlertPrefs` 11,200, `sanitizePet` 11,201, `sanitizeSettings` 11,203. |
| 11,202 | `WP6C_IMPORT_BOUNDARY` | End marker, embedded mid-line. |
| 11,205–11,206 | hardened import handler | First assignment of `window.VitalGuardHardenedImport`. |
| 11,208–11,212 | `redactedSnapshot` | Diagnostic redaction; function at **11,208**. |
| 11,214–11,217 | boot-once header | One-time installation of the final wrappers. |
| 11,218 | `VG473A_SCOPE_EXPORT` | Start marker. |
| 11,219–11,269 | scope exports | Closure-local accessibility, alert-preference and UI helpers exposed to later modules. |
| 11,270 | `VG473A_SCOPE_EXPORT` | End marker. |

---

## Part 15 — Crypto, vault and BLE identity
**Lines 11,274–12,022**

| Lines | Identifier | Contents |
|---:|---|---|
| 11,274–11,288 | remediation header | Section introduction; `V41UI` alias at **11,287**. |
| 11,289–11,300 | `V455` | Frozen configuration. `iterations:600000` **11,293**, `maxImportBytes` **11,294**, `maxTextChars` **11,295**, `maxPets` **11,296**, `maxVoiceChars` **11,297**, `rescueMaxChars` **11,298**, `rescueLifetimeMs` **11,299**. |
| 11,302–11,332 | support helpers | `v455Toast` 11,302, `v455Clone` 11,303, `v455RandomId` 11,307, `v455Download` 11,311, `v455BlobToDataUrl` 11,319, `v455DataUrlToBlob` 11,323. |
| 11,333 | `WP6A_CRYPTO_CORE` | Start marker. |
| 11,334–11,432 | `V455Crypto` | Object at **11,334**. Members: `b64` 11,336, `u8` 11,337, `b64url` 11,338, `fromB64url` 11,339, `derive` 11,340, `aad` 11,344, `encryptPassphrase` 11,345, `decryptPassphrase` 11,352, `vg472LegacyFieldCheck` 11,367, `vg473LegacyPrecheck` 11,394, `vg472LegacyGate` 11,412, `decryptLegacyBackup` 11,417, `sha256Text` 11,430. Contains markers `WP6A_LEGACY_DECRYPT` **11,361–11,427** and `VG473_LEGACY_PRECHECK` **11,381–11,411**. The end marker at **11,431** sits mid-line; the object closes at **11,432**. |
| 11,433 | crypto export | `window.VitalGuardCryptoV455`. |
| 11,435–11,459 | `TriChoiceModalV455` | Merge, replace or cancel dialog; object at **11,437**. Escape resolves to cancel at **11,451**. |
| 11,461–11,472 | quota-safe write helper | Fails a write visibly rather than removing existing records. |
| 11,473–11,477 | vault header | `V455LegacyStore` at **11,474**. |
| 11,478 | `WP6B_SECURE_VAULT` | Start marker. |
| 11,479–11,615 | `SecureVaultV455` | Object at **11,479**. Members: `empty` 11,482, `normalize` 11,483, `rawGetEnvelope` 11,500, `rawPutEnvelope` 11,508, `rawDeleteEnvelope` 11,514, `vaultAad` 11,518, `decryptVault` 11,519, `encryptState` 11,527, `persist` 11,535, `atomicUpdate` 11,542, `invalidateWrites` 11,556, `finishInvalidation` 11,558, `collectLegacy` 11,559, `hasData` 11,571, `clearLegacyPreservingVault` 11,572, `initialize` 11,578, `unlockPrompt` 11,588, `createOrMigrate` 11,597, `clearAllRaw` 11,606, `summary` 11,614. The end marker at **11,557** sits mid-line; the object closes at **11,615**. |
| 11,618–11,629 | Store integration | `Store.savePet` and related methods rebound onto the vault; `Store.clearAll` hook at **11,622–11,623**. |
| 11,631–11,650 | data minimisation | Removes retained histories from persisted state and disables page-close auto-wipe. |
| 11,652 | `VG473_BLE_STATE_MACHINE` | Start marker. |
| 11,653–11,911 | clone-state machine | CLEAR, BLOCKED, FLAGGED and ACKNOWLEDGED_FLAGGED transitions, incident lifetime, quiet close, episode counting, bounded acknowledgement. |
| 11,912 | `VG473_BLE_STATE_MACHINE` | End marker. |
| 11,914–12,022 | `BLEIdentityV455` | Object at **11,915**. Members: `evaluate` 11,916, `cloneState` 11,941, `raiseClone` 11,945, `acknowledge` 11,952, `isAuthenticated` 11,966, `observe` 11,967. Contains marker `BLE_IDENTITY_OBSERVE` at **11,968–11,984**. |

---

## Part 16 — Rescue Pack v2, import/export and routing closure
**Lines 12,023–12,441**

| Lines | Identifier | Contents |
|---:|---|---|
| 12,023–12,024 | section header | Rescue Pack v2 introduction. |
| 12,025–12,030 | `v455BuildPack` | Pack construction. |
| 12,031–12,038 | `v455ValidatePack` | Envelope and expiry validation. |
| 12,040 | `RP_REPLAY_GUARD` | Start marker. |
| 12,041–12,044 | replay ledger | `V469_REPLAY_KEY` 12,041, `v469ReadReplay` 12,042, `v469WriteReplay` 12,043, `v469ReplayHash` 12,044. Both ledger functions retain the last 64 entries. |
| 12,045–12,053 | `v455ReplaySeen` | Seen check. The end marker at **12,046** sits inside this function, which closes at **12,053**. |
| 12,054–12,061 | `v455MarkReplay` | Mark-used operation. |
| 12,062 | replay API | `window.VitalGuardReplayGuardV469`. |
| 12,063–12,070 | decode path | `SOS.decodeRescuePack` and envelope parsing. |
| 12,071–12,091 | `SOS.startRescueAssist` | Restricted assist entry; replay check at **12,074**, marking at **12,077**. |
| 12,092–12,106 | `installRescuePackUIV455` | UI wiring; function at **12,092**. |
| 12,108–12,109 | section header | Transactional import and export. |
| 12,110–12,121 | import sanitisers | `v455AssertShape` 12,110, `v455Num` 12,111, `v455SanitizeSignature` 12,113, `v455SanitizeDistanceCalib` 12,114, `v455SanitizePet` 12,115, `v455SanitizeSettings` 12,116, `v455PortableSettings` 12,118. |
| 12,122–12,134 | `v455ApplyImport` | Atomic apply. |
| 12,135–12,154 | `v455HandleImport` | Final handler; legacy precheck at **12,143**, typed plaintext gate at **12,150**. |
| 12,155–12,157 | handler assignment | Second assignment of `window.VitalGuardHardenedImport` at **12,156**, plus export binding. |
| 12,158–12,187 | `V455UI` | User-visible claims, diagnostics and release declarations; object at **12,159**. |
| 12,188–12,200 | addendum header | Routing closure introduction; `v455Toast` alias at **12,198**. |
| 12,201–12,228 | binding predicates | `localBinding` 12,201, `secondaryEvidenceCount` 12,205, `signalLabel` 12,213. |
| 12,229–12,277 | phrasing | `neutralPhrase` at **12,229** and related advisory text. |
| 12,278–12,313 | final router | Exact-bound routing. Duplicate exact binding quarantined at **12,286**; metadata-clone candidates raised at **12,287–12,295**; multiple matches raised at **12,300–12,302**; flagged states take raw signal only at **12,304–12,309**. |
| 12,314–12,343 | registration guard | Duplicate rejection at registration **12,317–12,325**; incident reset at **12,333**. |
| 12,344–12,441 | `normalizeBindings` and gates | Function at **12,344**; single alert gate at **12,381**; bounded manual override at **12,409**; clone-state exposure at **12,434**. |

---

## Part 17 — Passphrase policy, maintenance history and accessibility
**Lines 12,442–12,810**

| Lines | Identifier | Contents |
|---:|---|---|
| 12,442–12,453 | `V46` | Hardening namespace at **12,445**, with `toast` 12,446, `esc` 12,447, `vault` 12,448, `vaultSummary` 12,449, `persistent` 12,450, `isKo` 12,451, `hardenLabels` 12,453. |
| 12,454–12,473 | `passScore` | NFKC normalisation and length checks 12,455–12,460, distinct-word rule 12,461–12,466, high-variety alternative 12,468–12,472. |
| 12,474 | `PP_PASSPHRASE_POLICY` | Start marker. |
| 12,475 | policy API | `window.VitalGuardPassphrasePolicyV469`. |
| 12,477 | `patchPrompts` | Wraps `SecurePrompt.askPassphrase`. The end marker sits at the head of this line. |
| 12,478 | `patchSessionPersistence` | Rebinds `Wizard.save`, `DataManager.handleImport`, `DataManager.exportAll` and `Emergency.save` to require an active vault. Third assignment of `window.VitalGuardHardenedImport`. |
| 12,479–12,488 | remaining patches | `patchStoreToasts` 12,479, `patchRescueText` 12,480, `patchDiagnostics` 12,481, `installAll` 12,482. |
| 12,489–12,500 | v4.6.1 | UX cleanup. |
| 12,501–12,515 | v4.6.2 | Maintenance. |
| 12,516–12,542 | v4.6.3 | Final adjustments. |
| 12,543–12,565 | v4.6.4 | Critical fix. |
| 12,566–12,594 | v4.6.5 | Maintenance. |
| 12,595–12,617 | v4.6.8 | Hold-to-cancel hardening; `cancelHolds` at **12,606**. |
| 12,618–12,629 | v4.6.9 header | Accessibility, persistence and UI compatibility. |
| 12,630–12,704 | `ModalA11y` | Focus trap, background inerting, Escape close, opener restoration; object at **12,630**. Active-modal exception at **12,637**; reopen focus handling at **12,682**. |
| 12,705–12,730 | `Semantics` | Roles and keyboard activation for custom controls; object at **12,706**. |
| 12,731–12,750 | `Persistence` | Slider feedback with generation-safe encrypted persistence; object at **12,732**. |
| 12,751 | `DESTR_PERSISTENCE_GUARD` | Start marker; `beforeClearAll` at **12,752**. |
| 12,754 | `DESTR_PERSISTENCE_GUARD` | End marker, embedded mid-line; `afterClearAll` follows. |
| 12,765–12,778 | `VaultBridge` | Ensures vault creation or unlock before import and persistence; object at **12,766**. |
| 12,779–12,798 | `RescueBridge` | Rescue Pack v2 behind the existing card layout; object at **12,780**. |
| 12,799–12,810 | shell compatibility | Keeps the visual shell unchanged while preserving fail-closed routing. |

---

## Part 18 — Self-test, bootstrap and document close
**Lines 12,811–13,294**

| Lines | Identifier | Contents |
|---:|---|---|
| 12,811–12,814 | hotfix header | Final inherited fixes. |
| 12,815–12,817 | `capability` | Capability scope object at **12,815**. |
| 12,818–12,825 | `Diag.runQuickTest` | Passphrase weak/strong vectors 12,820, QR 12,821, Kalman and distance 12,822, Rescue Pack v2 12,823, ten-pet routing 12,824. |
| 12,826–12,842 | release preamble | Introduction to the self-test layer. |
| 12,843 | `VG473_SECURITY_SELFTEST` | Start marker. |
| 12,844–12,869 | harness | `res` 12,860, `expect` 12,863, `policy` 12,866, `guard` 12,867, `cs` 12,868. |
| 12,870–12,936 | `testActionContracts` | Function at **12,871**. |
| 12,937–12,987 | `testSanitizer` | Function at **12,938**. |
| 12,988–13,085 | `testCloneStateMachine` | Function at **12,989**. |
| 13,086–13,097 | `testCapabilityDrift` | Function at **13,087**. |
| 13,098–13,134 | `testBackupPrecheck` | Function at **13,099**. |
| 13,135–13,172 | `testRuntimeFinalDefinitions` | Function at **13,136**. |
| 13,173–13,199 | `summarize`, `runAll` | Result aggregation at **13,173** and **13,178**. |
| 13,200–13,266 | `getReport`, `runBootSubset` | Report accessor at **13,200**, boot-time subset at **13,202**. |
| 13,267 | `VG473_SECURITY_SELFTEST` | End marker. |
| 13,269–13,291 | guarded bootstrap | Single-run `App.init()` with frame and duplicate-boot protection. |
| 13,292 | `</script>` | Closes the main script. |
| 13,293–13,294 | `</body></html>` | Document close. |

---

## Appendix A — Coverage

The eighteen parts are contiguous and cover all 13,294 lines. Within the parts, the entry tables account for 13,279 lines. The fifteen lines not named in any entry are blank separators between blocks:

**1,320 · 1,664 · 3,869 · 4,076 · 4,133 · 4,157 · 4,175 · 5,618 · 5,619 · 5,672 · 5,673 · 11,630 · 11,651 · 11,913 · 13,268**

Confirm they are empty:

```bash
awk 'NR==1320||NR==1664||NR==3869||NR==4076||NR==4133||NR==4157||NR==4175||NR==5618||NR==5619||NR==5672||NR==5673||NR==11630||NR==11651||NR==11913||NR==13268 {print NR": ["$0"]"}' VitalGuard_AI_complete_V47_3.html
```

Note that line **3,869** falls between Part 6 and Part 7 and is counted in Part 7's range.

---

## Appendix B — Named comment markers

The source contains 56 marker comment lines forming 28 matched pairs. They are ordinary comments and are listed here only as navigation points.

```bash
grep -n "ANCHOR_START:\|ANCHOR_END:" VitalGuard_AI_complete_V47_3.html
```

| Marker | Start | End | Part |
|---|---:|---:|---:|
| `SECURITY_CSP_GUARD` | 21 | 24 | 1 |
| `VG473_CAPABILITY_MANIFEST_MACHINE` | 30 | 32 | 1 |
| `VG473A_REINFORCEMENT_LOG` | 37 | 39 | 1 |
| `WP1_ZERO_EGRESS_CORE` | 42 | 129 | 2 |
| `VG472_STYLES` | 332 | 349 | 3 |
| `CAPABILITY_MANIFEST_NOTICE` | 427 | 437 | 4 |
| `WP7_ACTION_POLICY` | 960 | 1,303 | 5 |
| `VG473_ACTION_PIPELINE` | 1,003 | 1,294 | 5 |
| `VG473_ARG_CONTRACT` | 1,054 | 1,201 | 5 |
| `WP2_HTML_SANITIZER_CORE` | 1,325 | 1,547 | 5 |
| `VG473_URL_POLICY` | 1,392 | 1,427 | 5 |
| `VG473_DATA_ATTR_ALLOWLIST` | 1,429 | 1,452 | 5 |
| `VG473_SINGLE_SANITIZE_PASS` | 1,558 | 1,572 | 5 |
| `CAPABILITY_MANIFEST_PANEL` | 7,308 | 7,493 | 9 |
| `VG473_CAPABILITY_DRIFT` | 7,327 | 7,440 | 9 |
| `DESTR_RESET_CENTER` | 8,906 | 9,059 | 12 |
| `WP6C_IMPORT_BOUNDARY` | 11,192 | 11,202 | 14 |
| `VG473A_SCOPE_EXPORT` | 11,218 | 11,270 | 14 |
| `WP6A_CRYPTO_CORE` | 11,333 | 11,431 | 15 |
| `WP6A_LEGACY_DECRYPT` | 11,361 | 11,427 | 15 |
| `VG473_LEGACY_PRECHECK` | 11,381 | 11,411 | 15 |
| `WP6B_SECURE_VAULT` | 11,478 | 11,557 | 15 |
| `VG473_BLE_STATE_MACHINE` | 11,652 | 11,912 | 15 |
| `BLE_IDENTITY_OBSERVE` | 11,968 | 11,984 | 15 |
| `RP_REPLAY_GUARD` | 12,040 | 12,046 | 16 |
| `PP_PASSPHRASE_POLICY` | 12,474 | 12,477 | 17 |
| `DESTR_PERSISTENCE_GUARD` | 12,751 | 12,754 | 17 |
| `VG473_SECURITY_SELFTEST` | 12,843 | 13,267 | 18 |

Five end markers sit inside a line or before the block they label finishes. Use the module range from the part tables, not the marker, when you need the whole block:

| Marker | Marker end | Block actually ends |
|---|---:|---:|
| `WP1_ZERO_EGRESS_CORE` | 129 | 131 |
| `WP6C_IMPORT_BOUNDARY` | 11,202 | 11,204 |
| `WP6A_CRYPTO_CORE` | 11,431 | 11,432 |
| `WP6B_SECURE_VAULT` | 11,557 | 11,615 |
| `RP_REPLAY_GUARD` | 12,046 | 12,053 |

---

## Appendix C — Alphabetical identifier index

Module-level objects, classes and named functions, with the line of declaration. Members of an object are listed in that object's row in the part tables.

| Identifier | Line |
|---|---:|
| `_deny` | 931 |
| `_matchEvidenceV455Base` | 5,801 |
| `_mfgPrefixHexFromEvent` | 5,786 |
| `_vgE` | 4,168 |
| `_vgI` | 4,174 |
| `Accessibility` | 8,457 |
| `AIPackV4` | 8,695 |
| `allowed` | 962 |
| `api` | 128 |
| `App` | 7,743 |
| `apply` | 3,782 |
| `assertJsonShape` | 11,193 |
| `AudioEngine` | 1,902 |
| `b64urlDecodeUtf8` | 10,437 |
| `b64urlEncodeUtf8` | 10,427 |
| `BLE` | 5,822 |
| `BLEIdentityV455` | 11,915 |
| `cancel` | 4,011 |
| `cancelHolds` | 12,606 |
| `Capabilities` | 8,391 |
| `capability` | 12,815 |
| `close` | 4,007 |
| `Coach` | 7,671 |
| `ConductorAI` | 8,773 |
| `ConfirmModal` | 4,079 |
| `CryptoBox` | 9,062 |
| `currentDict` | 3,766 |
| `DataManager` | 7,289 |
| `DEFAULT_THRESHOLDS` | 1,737 |
| `Detail` | 6,808 |
| `Diag` | 7,562 |
| `downloadText` | 8,312 |
| `Emergency` | 6,578 |
| `ensure` | 3,877 |
| `ErrorShield` | 8,322 |
| `ETHICAL_MANIFEST` | 1,821 |
| `EthicalGuard` | 1,835 |
| `expect` | 12,863 |
| `ExternalNavigationGuard` | 10,879 |
| `fmtAgo` | 1,804 |
| `genLocalIdSuffix` | 1,789 |
| `genRescueId` | 1,774 |
| `getLang` | 3,780 |
| `getReport` | 13,200 |
| `guard` | 1,322, 12,867 |
| `handle` | 1,307 |
| `hardenLabels` | 12,453 |
| `Help` | 7,495 |
| `HTML` | 2,271 |
| `I18N` | 2,040 |
| `init` | 3,855 |
| `installAll` | 12,482 |
| `installRescuePackUIV455` | 12,092 |
| `invoke` | 1,289 |
| `invokeAllowedMethod` | 1,280 |
| `isAllowedAction` | 1,279 |
| `isAllowedUrl` | 1,608 |
| `isKo` | 12,451 |
| `Lang` | 7,532 |
| `LEASH_PRESETS` | 1,751 |
| `Legal` | 7,515 |
| `localBinding` | 12,201 |
| `lock` | 49 |
| `locked` | 53 |
| `matchScore` | 5,810 |
| `median` | 1,768 |
| `ModalA11y` | 12,630 |
| `Nav` | 7,096 |
| `neutralizeHTML` | 1,521 |
| `neutralizeHTMLRegex` | 1,333 |
| `neutralPhrase` | 12,229 |
| `normalize` | 992 |
| `normalizeBindings` | 12,344 |
| `normalizeThresholds` | 1,742 |
| `note` | 48 |
| `nowMs` | 1,815 |
| `open` | 3,917 |
| `parse` | 1,271 |
| `parseActionSyntax` | 1,203 |
| `parseAtom` | 1,046 |
| `parseAtomToken` | 1,028 |
| `passScore` | 12,454 |
| `patchDiagnostics` | 12,481 |
| `patchInnerHTML` | 1,573 |
| `patchRescueText` | 12,480 |
| `patchSessionPersistence` | 12,478 |
| `patchStoreToasts` | 12,479 |
| `PERF_PROFILES` | 1,757 |
| `Persistence` | 12,732 |
| `persistent` | 12,450 |
| `policy` | 12,866 |
| `QRGenerator` | 5,620 |
| `redactedSnapshot` | 11,208 |
| `rejectStub` | 57 |
| `RescueBridge` | 12,780 |
| `ResetCenter` | 8,907 |
| `resolveRuntimeArguments` | 1,232 |
| `rootFor` | 973 |
| `routeAdvertisement` | 5,811 |
| `runAll` | 13,178 |
| `runBootSubset` | 13,202 |
| `RuntimeNetworkGuard` | 10,829 |
| `runtimeParse` | 1,260 |
| `safeJson` | 1,812 |
| `safeLocalStorageGet` | 4,158 |
| `safeLocalStorageKeys` | 4,160 |
| `safeLocalStorageRemove` | 4,159 |
| `safeLocalStorageSet` | 4,161 |
| `SafeMode` | 8,874 |
| `sanitizeAlertPrefs` | 11,200 |
| `sanitizeDistanceCalib` | 11,199 |
| `sanitizePet` | 11,201 |
| `Sanitizer` | 8,280 |
| `sanitizeSettings` | 11,203 |
| `sanitizeSignature` | 11,198 |
| `sanitizeThresholds` | 11,197 |
| `secondaryEvidenceCount` | 12,205 |
| `SecurePrompt` | 3,873 |
| `SecureVaultV455` | 11,479 |
| `Security` | 4,135 |
| `Semantics` | 12,706 |
| `setLang` | 3,773 |
| `Settings` | 7,131 |
| `signalLabel` | 12,213 |
| `sleep` | 8,311 |
| `SOS` | 6,441 |
| `splitArgs` | 998 |
| `staticParse` | 1,252 |
| `Store` | 4,177 |
| `STR` | 2,045 |
| `submit` | 4,016 |
| `summarize` | 13,173 |
| `testActionContracts` | 12,871 |
| `testBackupPrecheck` | 13,099 |
| `testCapabilityDrift` | 13,087 |
| `testCloneStateMachine` | 12,989 |
| `testRuntimeFinalDefinitions` | 13,136 |
| `testSanitizer` | 12,938 |
| `throwStub` | 58 |
| `Toast` | 2,016 |
| `toast` | 12,446 |
| `TriChoiceModalV455` | 11,437 |
| `V40UI` | 9,126 |
| `V41_DEFAULT_ALERT_PREFS` | 9,700 |
| `V41_ZONE_RANK` | 9,707 |
| `v41EnsureAlertPrefs` | 9,711 |
| `V41UI` | 9,812 |
| `v41ZoneRank` | 9,709 |
| `V455` | 11,289 |
| `v455AssertShape` | 12,110 |
| `v455BlobToDataUrl` | 11,319 |
| `v455BuildPack` | 12,025 |
| `v455Clone` | 11,303 |
| `V455Crypto` | 11,334 |
| `v455DataUrlToBlob` | 11,323 |
| `v455Download` | 11,311 |
| `V455LegacyStore` | 11,474 |
| `v455Num` | 12,111 |
| `v455PortableSettings` | 12,118 |
| `v455RandomId` | 11,307 |
| `v455SanitizeDistanceCalib` | 12,114 |
| `v455SanitizePet` | 12,115 |
| `v455SanitizeSettings` | 12,116 |
| `v455SanitizeSignature` | 12,113 |
| `v455Toast` | 11,302, 12,198 |
| `V455UI` | 12,159 |
| `v455ValidatePack` | 12,031 |
| `V46` | 12,445 |
| `v469ReadReplay` | 12,042 |
| `v469WriteReplay` | 12,043 |
| `validateMethodAllowlist` | 1,217 |
| `validateResolvedArgumentContract` | 1,187 |
| `validateStaticArgumentTokens` | 1,221 |
| `vault` | 12,448 |
| `VaultBridge` | 12,766 |
| `vaultSummary` | 12,449 |
| `vBoundedInt` | 1,085 |
| `vBoundedNum` | 1,077 |
| `vChangeEvent` | 1,090 |
| `vEnum` | 1,074 |
| `vEnumLazy` | 1,075 |
| `VG472_ATTRS` | 1,381 |
| `VG472_DROP` | 1,373 |
| `VG472_TAGS` | 1,358 |
| `VG472CapabilityManifest` | 7,314 |
| `vg472Copy` | 1,495 |
| `vg472CopyAttrs` | 1,454 |
| `vg472SafeUrl` | 1,426 |
| `VG473_ARIA_ATTRS` | 1,442 |
| `VG473_CONTRACTS` | 1,101 |
| `VG473_DATA_ATTRS` | 1,434 |
| `VG473_THRESHOLD_RANGE` | 1,062 |
| `vg473Icons` | 1,066 |
| `vg473IsPlaceholder` | 1,024 |
| `vg473LeashKeys` | 1,070 |
| `vg473UrlPolicy` | 1,402 |
| `vgEscape` | 10,825 |
| `VGHTML` | 1,665 |
| `vgSafeZone` | 10,826 |
| `vgToast` | 10,824 |
| `VitalGuardActionDispatcher` | 1,305 |
| `VitalGuardActionPolicy` | 961 |
| `VitalGuardTrustedTypesGuard` | 1,321 |
| `VoiceAnnouncer` | 5,750 |
| `VoiceRecall` | 5,675 |
| `vSafeId` | 1,076 |
| `vStrictBool` | 1,089 |
| `WakeLockManager` | 8,471 |
| `Wizard` | 6,019 |
| `ZONE_ORDER` | 1,763 |

---

*Index only. Review scope for this artifact is defined in `V47_3_Audit_Scope_Map.md`.*
*Artifact licence: Apache-2.0
