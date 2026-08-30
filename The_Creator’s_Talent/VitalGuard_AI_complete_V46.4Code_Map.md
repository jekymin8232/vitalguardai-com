# VitalGuard_AI_complete_V46.4 — Code Map

File: `VitalGuard_AI_complete_V46.4.html` · Single-file offline app · 1 inline `<style>`, 2 inline `<script>` blocks.

**This is a critical-fix release. It repairs a boot-blocking regression present in V4.6.2 and V4.6.3.**

## 0. What went wrong in V4.6.2 / V4.6.3, and how V4.6.4 fixes it

The Content-Security-Policy in the `<head>` pins the inline scripts and the inline
style by their SHA-256 hashes (`script-src`/`script-src-elem` and
`style-src`/`style-src-elem`), with `script-src-attr 'none'` and
`require-trusted-types-for 'script'`. There is no `'unsafe-inline'` for scripts.

V4.6.2 and V4.6.3 edited the second `<script>` block and the `<style>` block
(version strings, i18n copy, passphrase wording, and the dead-CSS removal) **but
did not recompute those CSP hashes.** As a result the browser rejected the
modified script and style (their hashes no longer matched the pinned values), the
app never booted, and the page rendered as raw, unstyled static markup — exactly
the failure shown in the V4.6.3 defect screenshot.

By contrast, V4.5.7 is healthy because its three pinned hashes (script[0],
script[1], style[0]) still match its actual content.

V4.6.4 fixes this by recomputing the hash of the second `<script>` block and the
`<style>` block from the final file content and writing them into the CSP meta
tag. The first `<script>` block (the early security guard) was never modified, so
its hash is unchanged and retained. Verified: all three inline resources now pass
a browser-equivalent CSP hash check.

Actual (and now CSP-declared) hashes in V4.6.4:

| Resource | Line | SHA-256 (base64) |
|---|---:|---|
| script[0] (early security guard, unchanged) | 33 | `2wh84/KStvU+RbML2tjRqHtPG3GIYNVOOyKtME6T9xk=` |
| script[1] (main app) | 800 | `sxnbe4P37SSfLBY9C6QpBj6M0oLtHG499wd1zJAQaFo=` |
| style[0] | 123 | `wbyqDEB6oPWKxfv7L/lffl0KLVncsSc/wbPGBozSozI=` |

Delta from V4.6.3, in full:
1. Version identifiers bumped 4.6.3 -> 4.6.4 (document title, `APP_VERSION`,
   `hardenLabels()` subtitle stamp, `Diag.snapshot().securityV46.version`,
   `VitalGuardHardeningV46.version`, both `VitalGuardAuditHardeningV455` objects,
   the internal `V46` tag, static markup, and all 7 i18n dictionaries'
   `app_sub` / `hook_html` / `hero_body`).
2. CSP `script-src`/`script-src-elem` hash for script[1] and
   `style-src`/`style-src-elem` hash for style[0] recomputed and written into the
   meta tag (the fix).

No functional logic and no security control was otherwise changed. All V4.6.1
security controls (session-only-registration confirmation, import-vault gate,
passphrase floor, Rescue Pack expiry, reserved-ID import guard, null-prototype
import merge) remain in force. Prior static audits (Node syntax check on both
inline scripts, zero-egress / external-reference scan, `data-vg-on*`
action-dispatch allowlist vs. definitions cross-check, 7-language i18n key-parity,
defect-marker scan) all pass, and a browser-equivalent CSP boot simulation now
reports all inline resources as ALLOW.

## 1. Execution flow

```text
HTML parse
  -> CSP evaluated: inline script[0], script[1], style[0] hashes must match the meta CSP
     (V4.6.4: all three match -> resources execute; V4.6.2/V4.6.3: script[1]/style mismatched -> blocked)
  -> early security guard (frame guard, opener/name clearing, egress lock, prototype freeze, bounded self-check)
  -> UI shell / CSS / body markup
  -> main script modules (sanitizer, action dispatcher, storage, BLE, UI, app core)
       - v4.3.8, v4.6 and v4.6.1 remediation layers rebind final behavior on top of earlier modules
  -> guarded bootstrap
       - App.init() -> Store.init() + encrypted vault state -> Settings/Emergency load -> render, hardening
```

```text
BLE advertisement
  -> BLE._handler -> App.onAdvertisement(event) -> routeAdvertisement(event, App.pets, now)
       - exact local browser device binding plus secondary evidence
       - ambiguity / clone candidate quarantine
       - generic BLE identity remains unauthenticated
  -> Pet.processRssi (only if qualified and not blocked)
  -> advisory zone rendering / local-only alert
```

## 2. Module directory

| Line | Module | Role |
|---:|---|---|
| 22 | CONTENT-SECURITY-POLICY (meta) | Hash-pinned `script-src`/`style-src`; `script-src-attr 'none'`; Trusted Types required. **script[1] and style[0] hashes recomputed in v4.6.4 — this is the fix.** |
| 33 | EARLY SECURITY GUARD (script[0]) | First inline script; frame guard, egress lock, prototype freeze, bounded self-check. Unchanged since before v4.6.2, so its CSP hash is unchanged. |
| 123 | INLINE STYLE (style[0]) | The single inline stylesheet; CSP hash recomputed in v4.6.4. |
| 290 | v4.2 UI polish (CSS only) | Cosmetic CSS layer (inside style[0]). |
| 319 | v4.6 SECURITY / ACCESSIBILITY | Accessibility CSS (dead `#v455-ble-banner` selector removed in v4.6.2). |
| 800 | MAIN APP SCRIPT (script[1]) | Second inline script; all app modules below live here. CSP hash recomputed in v4.6.4. |
| 818 | V4.3.8 EARLY SECURITY GUARD (within script[1]) | Trusted Types, sink scrubber, copy-only sharing, document.write block. |
| 835 | v4.3.8 ACTION DISPATCHER | `data-vg-onclick` allowlist dispatcher (see §5). |
| 1102 | CONFIG | App-wide constants. |
| 1157 | UTILS | DOM/clamp/median/rescue-ID/JSON helpers. |
| 1194 | OPEN SOURCE MANIFEST | `ETHICAL_MANIFEST` constant (frozen). |
| 1209 | OPEN SOURCE NOTICE GUARD | Boot-time integrity check of the manifest. |
| 1273 | STATE | Global scan/render state. |
| 1277 | AUDIO ENGINE | Local alert tones, siren, keepalive (Web Audio API). |
| 1392 | TOAST | Toast notifications. |
| 1408 | I18N (7 languages) | UI dictionaries: en/ko/ar/ja/fr/zh-TW/es. All `app_sub`/`hook_html`/`hero_body` at v4.6.4. |
| 3244 | V4.3.8 SECURITY HELPERS | Shared helpers for the patches below. |
| 3246 | SecurePrompt | Replaces `prompt()` for secrets. |
| 3451 | ConfirmModal | Replaces `confirm()`. |
| 3508 | Auto-wipe / full wipe helpers | Data-erasure primitives. |
| 3550 | STORAGE | IndexedDB/localStorage facade. |
| 3712 | SIGNAL FILTER (Kalman) | RSSI smoothing. |
| 3747 | DISTANCE ESTIMATOR | RSSI-to-distance approximation + calibration. |
| 3783 | Q-LEARNING LITE | Local threshold-suggestion coach. |
| 3843 | BEHAVIORAL FINGERPRINT | Local signal-trend heuristics. |
| 3876 | RING BUFFER | Bounded sample history. |
| 3887 | PET MODEL | Per-beacon model, thresholds, zones, history, serialization. |
| 4122 | QR GENERATOR | Embedded standard QR generator (Project Nayuki, MIT, inlined). |
| 5048 | VOICE RECALL | Microphone clip capture/playback. |
| 5123 | VOICE ANNOUNCER | SpeechSynthesis advisory-zone announcements. |
| 5159 | BLE MATCHING | Base BLE scoring helpers. |
| 5192 | BLE ENGINE | `requestLEScan` advertisement watching, filters, restart/congestion tracking. |
| 5389 | WIZARD | Beacon registration, movement-consistency check, calibration. |
| 5811 | SOS MODULE | Signal review / contact aid. |
| 5948 | EMERGENCY MODE | Local siren, strobe, QR contact card. |
| 6178 | PET DETAIL OVERLAY | Per-beacon detail view, threshold/AI controls. |
| 6466 | NAV | Panel navigation. |
| 6501 | SETTINGS | Preferences, notifications, performance, reset. |
| 6659 | DATA MANAGER | Import/export entrypoints. |
| 6676 | HELP | Help panel content and i18n. |
| 6694 | ABOUT / LEGAL | About/legal panel content and i18n. |
| 6711 | LANGUAGE MENU | Language switcher. |
| 6741 | DIAGNOSTICS | Redacted local diagnostics export (JSON). |
| 6850 | META-COGNITIVE COACH | Local UX/security suggestions. |
| 6922 | APP CORE | Boot, render loop, monitoring, alerts. |
| 8898–9923 | v4.1/v4.2 patch layer | Lost-flip counter fix, per-pet alerts, 10-pet cap, leash slider, Calibration Pro UI, Rescue Pack share/import UI, Diagnostics self-test button, field persistence. Legacy `exportEncrypted()` passphrase wording finalized in v4.6.3. |
| 9995 | V4.3.8 FINAL HARDENING LAYER | Consolidated hardening pass over the modules above. |
| 10353 | v4.3.8 FINAL AUDIT HARDENING | Additional hardening/consistency checks. |
| 10390 | FINAL: boot once | Boot-guard helper used by the bootstrap. |
| 10396 | V4.6 SECURITY REMEDIATION | BLE identity boundary, import validation, Rescue Pack v2 wording/expiry, `V455UI` vault UI. `V455UI.securityBanner()` is a no-op stub. |
| 10899 | `VitalGuardAuditHardeningV455` (layer 1) | `version:'4.6.4'`. Superseded at load by the layer-2 definition at line 11100. |
| 10907 | V4.6 FINAL RISK-CLOSURE ADDENDUM | Diagnostics snapshot fields + `VitalGuardAuditHardeningV455` (layer 2). |
| 11100 | `VitalGuardAuditHardeningV455` (layer 2, final) | `version:'4.6.4'`; authoritative at runtime. |
| 11104 | V4.6 FINAL HARDENING | Passphrase-strength gate, session-only-registration confirmation, import-vault gate, `VitalGuardHardeningV46` (`version:'4.6.4'`). |
| 11129 | V4.6.1 UX CLEANUP | Comment: removed gate/banner UI and retained disclosure. |
| 11141 | V4.6.2 MAINTENANCE | Comment: 4.6.1->4.6.2 bump + dead-CSS removal. |
| 11156 | V4.6.3 FINAL | Comment: four documentation/consistency findings closed. |
| 11185 | V4.6.4 CRITICAL FIX | Comment: CSP hash regression explained and fixed (see §0). |
| 11208 | V4.3.8 GUARDED BOOTSTRAP | Single guarded boot into `App.init()`. |

## 3. Key anchors

| Line | Anchor | What it is |
|---:|---|---|
| 22 | `<meta http-equiv="Content-Security-Policy">` | Hash-pinned policy. In v4.6.4, script[1] hash = `sxnbe4P37SSfLBY9C6QpBj6M0oLtHG499wd1zJAQaFo=`, style[0] hash = `wbyqDEB6oPWKxfv7L/lffl0KLVncsSc/wbPGBozSozI=`, script[0] hash unchanged. |
| 1103 | `const APP_VERSION` | `'4.6.4'` (single source; drives QR payloads, diagnostics `appVersion`, manifest version). |
| 1198 | `const ETHICAL_MANIFEST` | Frozen license/use-restriction/principles object, checked at boot. |
| 10421 | `rescueLifetimeMs:2*60*60*1000` | Rescue Pack default lifetime (2h; 30 min if a location is included) — unchanged. |
| 10820 | Rescue Pack passphrase prompt | "16+ character passphrase (or 4+ random words)" — unchanged from v4.6.3. |
| 10835 | `reservedIds=new Set([...])` | Reserved prototype-property names rejected/regenerated on pet-ID import — unchanged. |
| 10851 | `const existing=Object.create(null)` | Import merge map cannot mutate `Object.prototype` — unchanged. |
| 10877 | `securityBanner(){ /* no-op */ }` | Duplicate banner body removed in v4.6.1; still a no-op stub. |
| 11115 | `hardenLabels()` | Stamps visible subtitle to `v4.6.4`; logic unchanged. |
| 11117 | `patchPrompts()` | Passphrase floor: 16 chars or 4+ random words, enforced regardless of caller `minLen` — unchanged. |
| 11118 | `patchSessionPersistence()` | Session-only-registration confirmation; import blocked until vault exists — unchanged. |
| 11125 | `window.VitalGuardHardeningV46` | `version:'4.6.4'`; controls list unchanged. |

## 4. Storage and data map

| Area | Key / store | Behavior |
|---|---|---|
| IndexedDB | `VitalGuardAI_V41`, stores `pets/settings/ai/alerts/blobs` | Primary interface; sensitive state mediated by the encrypted vault layer. |
| Vault envelope | `__vg_vault_v455__` in settings store | AES-GCM/PBKDF2-encrypted state envelope. |
| Vault fallback | `vg41_vault_v455` in localStorage | Used only if IndexedDB is unavailable. |
| Session-only mode | in-memory state | Registration/import require explicit confirmation or are blocked until the vault is active. |
| Rescue replay ledger | `rescuePackUsedV455` | Browser-profile replay ledger for JTI values (not a global single-use guarantee). |
| Language | `vg_lang_v41`, `vg_lang_v412` | Local UI language preference only. |

*(unchanged from V4.6.3)*

## 5. Action-dispatch allowlist (`data-vg-onclick="Namespace.method(...)"`)

| Namespace | Allowed methods |
|---|---|
| `App` | `dismissFirstRun`, `setTrackMode`, `toggleDemo`, `toggleMonitoring`, `focusFromChip` |
| `DataManager` | `exportAll`, `importFile`, `handleImport` |
| `Detail` | `aiFeedback`, `applySuggestion`, `close`, `open`, `resetQ`, `setLeash`, `suggestAI`, `toggleAI`, `updateThreshold` |
| `Diag` | `close`, `copy`, `download`, `open` |
| `Emergency` | `close`, `copyPhone`, `deactivate`, `open`, `requestMotionPermission`, `saveFromUI`, `share`, `toggleShake`, `holdStart`, `holdEnd` |
| `ErrorShield` | `clear` |
| `Help` | `close`, `open` |
| `I18N` | `setLang` |
| `Lang` | `choose`, `close`, `open` |
| `Legal` | `close`, `open` |
| `Nav` | `go` |
| `ResetCenter` | `close`, `factory`, `hard`, `open`, `soft` |
| `SOS` | `deactivate`, `saveLocation`, `selectPet`, `shareMessage`, `holdStart`, `holdEnd` |
| `SafeMode` | `disable` |
| `Settings` | `removePet`, `resetApp`, `setPerf`, `toggle`, `toggleNotif`, `toggleV40`, `setVolume` |
| `V40UI` | `exportEncrypted`, `showPitch` |
| `VGHardening` | `runCoachAction` |
| `VoiceRecall` | `play`, `record5s` |
| `Wizard` | `clearCalib`, `close`, `goStep3`, `open`, `pickIcon`, `recordCalib`, `rescan`, `save`, `selectCandidate`, `skipVerify` |

Verified in v4.6.4: all 106 distinct `data-vg-on*` actions used in markup resolve to an
allowlisted namespace/method, and every allowlisted method has a matching definition.
*(allowlist unchanged from V4.6.3)*

## 6. Static DOM ID index

```text
ai-feedback  ai-suggestion  app  btn-demo-toggle  btn-mode-all  btn-mode-focus
btn-scan-toggle  btn-skip-verify  btn-verified  btn-wiz-save  calib-10m  calib-1m
cm-cancel  cm-msg  cm-ok  cm-title  coach-body  coach-card
congestionBadge  custom-thresholds  dash-controls  dash-controls2  detail-alerts  detail-body
detail-overlay  detail-title  diag-body  diag-overlay  diag-pre  dt-caution
dt-danger  dt-warning  emergency-active  emg-active-name  emg-active-sub  emg-body
emg-call  emg-medical  emg-name  emg-overlay  emg-phone  emg-qr
emg-strobe  empty-state  first-run-banner  fr-proto  hc-arrow  hc-rssi
hc-text  help-body  help-overlay  i18n_about_link  i18n_app_disclaimer  i18n_app_mission
i18n_app_sub  i18n_app_title  i18n_badge_ble  i18n_badge_gdpr  i18n_badge_offline  i18n_badge_tiny
i18n_contact_line  i18n_empty_btn  i18n_empty_text  i18n_firstrun_body  i18n_firstrun_help  i18n_firstrun_ok
i18n_firstrun_title  i18n_github_link  i18n_help_link  i18n_help_title  i18n_hero_body  i18n_hero_pillars
i18n_hero_title  i18n_install_sub  i18n_install_title  i18n_lang_link  i18n_lang_note  i18n_lang_subtitle
i18n_lang_title  i18n_legal_title  i18n_tips_title  icon-picker  import-input  input-name
installBanner  installBtn  installDismiss  lang-overlay  langSelect  legal-body
legal-overlay  notif-hint  panel-home  panel-settings  panel-sos  panel-tips
perf-  perf-balanced  perf-fast  perf-saver  pet-chips  pet-list
pet_  pwa-manifest  qr-${p.id}  reset-body  reset-overlay  safe-banner
scan-health-fill  scan-health-meta  scan-health-row  scan-list  scan-status  scan-status-bar
settings-pet-list  sos-active  sos-active-name  sos-content  sos-focus-banner  sos-no-pets
sos-pet-select  sos-snapshot  sos-strobe-area  sp-1  sp-2  sp-3
sp-backdrop  sp-cancel  sp-confirm  sp-fields  sp-hint  sp-input
sp-msg  sp-ok  sp-title  tipsI18n  toggle-autoOptimize  toggle-autoWipeOnClose
toggle-highContrast  toggle-highalert  toggle-keepAlive  toggle-largeText  toggle-notif  toggle-reduceMotion
toggle-scanFilters  toggle-screenAwake  toggle-sound  toggle-tts  toggle-vibrate  toggle-voiceRecall
v40-adv-hint  v40-advanced-card  v40-ai-explain  v41-ap-minzone  v41-ap-sound  v41-ap-tts
v41-ap-vibrate  v41-calibpro-clear  v41-calibpro-dist  v41-calibpro-dist-label  v41-calibpro-list  v41-calibpro-preview
v41-calibpro-record  v41-calibpro-stats  v41-dcalib-apply-leash  v41-dcalib-clear  v41-dcalib-dist  v41-dcalib-dist-label
v41-dcalib-list  v41-dcalib-record  v41-dcalib-stats  v41-leash-apply  v41-leash-m  v41-leash-m-label
v41-rescuepack-card  v41-rp-assist  v41-rp-code  v41-rp-copy  v41-rp-generate  v41-rp-import
v41-rp-qr  v41-rp-share  v41-rp-sms  v41-rp-start  v41-rp-stop  v455-detail-identity
v455-rp-copy  v455-rp-generate  v455-rp-location  v455-rp-start  v455-rp-stop  v455-vault-action
v455-vault-banner  volumeSlider  volumeVal  wiz-step-1  wiz-step-2  wiz-step-3
wizard-overlay  wizard-title
```

Note: `v455-ble-banner`, `v46-gate-ok`, and `v46-scope-gate` do not appear — they were
runtime-created elements belonging to removed banner/gate functions. The last CSS
reference to `#v455-ble-banner` was removed in v4.6.2.

## 7. CSP hash maintenance rule (important for future edits)

Whenever ANY byte inside the inline `<style>` block or the second inline `<script>`
block changes — including version strings, i18n copy, comments, or whitespace — the
corresponding `script-src`/`script-src-elem` and/or `style-src`/`style-src-elem`
SHA-256 in the CSP meta tag MUST be recomputed and updated in the same release.
Skipping this is exactly what broke V4.6.2/V4.6.3. The first `<script>` block (early
security guard) does not currently receive edits, so its hash rarely changes, but the
same rule applies to it if it is ever modified.

Recompute procedure (conceptual): take the exact text between `>` and `</script>`
(or `</style>`), compute SHA-256, base64-encode, and place it as `'sha256-...'` in
both the `-src` and `-src-elem` directives for that resource type. After writing the
CSP, re-verify that the on-disk resource still hashes to the declared value (editing
the CSP in `<head>` does not change the script/style content, so the hashes remain
valid — but always re-verify).

END OF CODE MAP
