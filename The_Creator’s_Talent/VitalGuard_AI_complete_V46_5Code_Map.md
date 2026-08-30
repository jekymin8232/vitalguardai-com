# VitalGuard_AI_complete_V46.5 — Code Map

File: `VitalGuard_AI_complete_V46_5.html` · Single-file offline app · 1 inline `<style>`, 2 inline `<script>` blocks.

**This is an internal-only hardening release. UI, layout, dialogs and user-visible flows are unchanged from V4.6.4; no interface elements were added or removed.**

## 0. What changed in V4.6.5

V4.6.4 repaired the CSP hash regression that broke V4.6.2/V4.6.3 boot. V4.6.5 builds on
that healthy baseline and closes three internal findings from a fresh OTF-style static
review, without touching any user-facing markup:

1. **VG465-01 (Low, fixed).** New pet IDs and unknown-device fallback IDs previously
   used `Math.random().toString(36)`. Pet IDs flow into Rescue Packs and are vault
   record keys, so both suffixes now come from `crypto.getRandomValues` via a new
   `genLocalIdSuffix()` helper in UTILS (Math.random retained only as a non-crypto
   fallback for ancient engines, matching the existing `genRescueId()` pattern).
2. **VG465-02 (Medium, fixed).** `ConfirmModal` previously focused the OK button on
   every dialog and its Enter handler resolved `true` unconditionally, so a stray
   Enter could confirm a destructive `danger` dialog. Destructive dialogs
   (`opts.danger`) now default-focus **Cancel**, and Enter resolves to the **focused**
   button. Escape / backdrop / dialog replacement continue to always mean Cancel.
   Non-danger dialogs keep the previous OK-focused behavior, so no user-visible flow
   changes. (The hard/factory reset paths were already protected by the typed
   `RESET` gate; this closes the remaining Enter-through paths such as pet removal
   and the plaintext-import first step.)
3. **VG465-03 (Low, fixed).** `V455Crypto.u8()` now rejects malformed base64 with a
   clean `'Invalid encoding'` error instead of surfacing a raw platform
   `InvalidCharacterError` message through toasts.
4. Version identifiers bumped 4.6.4 → 4.6.5 (document title, meta security-hardening
   summary, `APP_VERSION`, `hardenLabels()` subtitle stamp,
   `Diag.snapshot().securityV46.version`, `VitalGuardHardeningV46.version`, both
   `VitalGuardAuditHardeningV455` objects, the internal `V46` tag, static markup, and
   all 7 i18n dictionaries' `app_sub` / `hook_html` / `hero_body`).
5. CSP `script-src`/`script-src-elem` hash for script[1] recomputed and written into
   the meta tag. The `<style>` block and script[0] are untouched, so their hashes are
   unchanged. A browser-equivalent CSP boot simulation reports all three inline
   resources as **ALLOW**.

Actual (and CSP-declared) hashes in V4.6.5:

| Resource | Line | SHA-256 (base64) |
|---|---:|---|
| script[0] (early security guard, unchanged) | 33 | `2wh84/KStvU+RbML2tjRqHtPG3GIYNVOOyKtME6T9xk=` |
| script[1] (main app) | 800 | `Umo7F3WfQUU+84T7CCmaUiCSF/wvWKRp5U324eP2yGA=` |
| style[0] (unchanged) | 123 | `wbyqDEB6oPWKxfv7L/lffl0KLVncsSc/wbPGBozSozI=` |

Whole-file SHA-256: `ca9b81451599726220c2b8a7f52713e585673e9815b1911a21887427710286b8`
(587,520 bytes, 11,278 lines).

All V4.6.x security controls (session-only-registration confirmation, import-vault
gate, tri-state atomic import, passphrase floor of 16 chars or 4+ random words,
Rescue Pack expiry + browser-profile replay guard, reserved-ID import guard,
null-prototype import merge, non-evicting quota failure, encrypted local vault)
remain in force. Static audits re-run on this build: Node syntax check on both inline
scripts, zero-egress / external-reference scan, `data-vg-on*` action-dispatch
allowlist vs. definitions cross-check (73 distinct actions, 0 violations, 0 missing
definitions), 7-language i18n key-parity, defect-marker scan, and a markup diff that
confirms the DOM outside `<script>`/`<style>` differs from V4.6.4 only in version
strings and the CSP hash — all pass.

## 1. Execution flow

```text
HTML parse
  -> CSP evaluated: inline script[0], script[1], style[0] hashes must match the meta CSP
     (V4.6.5: all three match -> resources execute)
  -> early security guard (frame guard, opener/name clearing, egress lock, prototype freeze, bounded self-check)
  -> UI shell / CSS / body markup
  -> main script modules (sanitizer, action dispatcher, storage, BLE, UI, app core)
       - v4.3.8, v4.6, v4.6.1 and v4.6.5 remediation layers rebind final behavior on top of earlier modules
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
| 22 | CONTENT-SECURITY-POLICY (meta) | Hash-pinned `script-src`/`style-src`; `script-src-attr 'none'`; Trusted Types required. **script[1] hash recomputed in v4.6.5.** |
| 33 | EARLY SECURITY GUARD (script[0]) | First inline script; frame guard, egress lock, prototype freeze, bounded self-check. Unchanged; hash unchanged. |
| 123 | INLINE STYLE (style[0]) | The single inline stylesheet. Unchanged; hash unchanged. |
| 290 | v4.2 UI polish (CSS only) | Cosmetic CSS layer (inside style[0]). |
| 319 | v4.6 SECURITY / ACCESSIBILITY | Accessibility CSS. |
| 800 | MAIN APP SCRIPT (script[1]) | Second inline script; all app modules below live here. CSP hash recomputed in v4.6.5. |
| 818 | V4.3.8 EARLY SECURITY GUARD (within script[1]) | Trusted Types, sink scrubber, copy-only sharing, document.write block. |
| 835 | v4.3.8 ACTION DISPATCHER | `data-vg-onclick` allowlist dispatcher (see §5). |
| 1102 | CONFIG | App-wide constants. |
| 1157 | UTILS | DOM/clamp/median/rescue-ID/JSON helpers. **`genLocalIdSuffix()` (CSPRNG local-ID suffix) added at 1181 in v4.6.5.** |
| 1209 | OPEN SOURCE MANIFEST | `ETHICAL_MANIFEST` constant (frozen). |
| 1224 | OPEN SOURCE NOTICE GUARD | Boot-time integrity check of the manifest. |
| 1288 | STATE | Global scan/render state. |
| 1292 | AUDIO ENGINE | Local alert tones, siren, keepalive (Web Audio API). |
| 1407 | TOAST | Toast notifications. |
| 1423 | I18N (7 languages) | UI dictionaries: en/ko/ar/ja/fr/zh-TW/es. All `app_sub`/`hook_html`/`hero_body` at v4.6.5. |
| 3259 | V4.3.8 SECURITY HELPERS | Shared helpers for the patches below. |
| 3261 | SecurePrompt | Replaces `prompt()` for secrets. |
| 3466 | ConfirmModal | Replaces `confirm()`. **v4.6.5: danger dialogs default-focus Cancel; Enter follows the focused button.** |
| 3523 | Auto-wipe / full wipe helpers | Data-erasure primitives. |
| 3565 | STORAGE | IndexedDB/localStorage facade. |
| 3727 | SIGNAL FILTER (Kalman) | RSSI smoothing. |
| 3762 | DISTANCE ESTIMATOR | RSSI-to-distance approximation + calibration. |
| 3798 | Q-LEARNING LITE | Local threshold-suggestion coach. |
| 3858 | BEHAVIORAL FINGERPRINT | Local signal-trend heuristics. |
| 3891 | RING BUFFER | Bounded sample history. |
| 3902 | PET MODEL | Per-beacon model, thresholds, zones, history, serialization. **v4.6.5: new IDs use `genLocalIdSuffix()`.** |
| 4137 | QR GENERATOR | Embedded standard QR generator (Project Nayuki, MIT, inlined). |
| 5063 | VOICE RECALL | Microphone clip capture/playback. |
| 5138 | VOICE ANNOUNCER | SpeechSynthesis advisory-zone announcements. |
| 5174 | BLE MATCHING | Base BLE scoring helpers. **v4.6.5: unknown-device fallback IDs use `genLocalIdSuffix()`.** |
| 5207 | BLE ENGINE | `requestLEScan` advertisement watching, filters, restart/congestion tracking. |
| 5404 | WIZARD | Beacon registration, movement-consistency check, calibration. |
| 5826 | SOS MODULE | Signal review / contact aid. |
| 5963 | EMERGENCY MODE | Local siren, strobe, QR contact card. |
| 6193 | PET DETAIL OVERLAY | Per-beacon detail view, threshold/AI controls. |
| 6481 | NAV | Panel navigation. |
| 6516 | SETTINGS | Preferences, notifications, performance, reset. |
| 6674 | DATA MANAGER | Import/export entrypoints. |
| 6691 | HELP | Help panel content and i18n. |
| 6709 | ABOUT / LEGAL | About/legal panel content and i18n. |
| 6726 | LANGUAGE MENU | Language switcher. |
| 6756 | DIAGNOSTICS | Redacted local diagnostics export (JSON). |
| 6865 | META-COGNITIVE COACH | Local UX/security suggestions. |
| 6937 | APP CORE | Boot, render loop, monitoring, alerts. |
| 8913–9938 | v4.1/v4.2 patch layer | Lost-flip counter fix, per-pet alerts, 10-pet cap, leash slider, Calibration Pro UI, Rescue Pack share/import UI, Diagnostics self-test button, field persistence. |
| 10010 | V4.3.8 FINAL HARDENING LAYER | Consolidated hardening pass over the modules above. |
| 10368 | v4.3.8 FINAL AUDIT HARDENING | Additional hardening/consistency checks. |
| 10405 | FINAL: boot once | Boot-guard helper used by the bootstrap. |
| 10411 | V4.6 SECURITY REMEDIATION | BLE identity boundary, import validation, Rescue Pack v2 wording/expiry, `V455UI` vault UI. `V455UI.securityBanner()` is a no-op stub. **v4.6.5: `V455Crypto.u8()` clean invalid-encoding failure.** |
| 10914 | `VitalGuardAuditHardeningV455` (layer 1) | `version:'4.6.5'`. Superseded at load by the layer-2 definition at line 11115. |
| 10922 | V4.6 FINAL RISK-CLOSURE ADDENDUM | Diagnostics snapshot fields + `VitalGuardAuditHardeningV455` (layer 2). |
| 11115 | `VitalGuardAuditHardeningV455` (layer 2, final) | `version:'4.6.5'`; authoritative at runtime. |
| 11119 | V4.6 FINAL HARDENING | Passphrase-strength gate, session-only-registration confirmation, import-vault gate, `VitalGuardHardeningV46` (`version:'4.6.5'`). |
| 11144 | V4.6.1 UX CLEANUP | Comment: removed gate/banner UI and retained disclosure. |
| 11156 | V4.6.2 MAINTENANCE | Comment: 4.6.1→4.6.2 bump + dead-CSS removal. |
| 11171 | V4.6.3 FINAL | Comment: four documentation/consistency findings closed. |
| 11200 | V4.6.4 CRITICAL FIX | Comment: CSP hash regression explained and fixed (historical). |
| 11223 | V4.6.5 MAINTENANCE | Comment: this release — VG465-01/02/03 closed, versions bumped, CSP rehashed (see §0). |
| 11252 | V4.3.8 GUARDED BOOTSTRAP | Single guarded boot into `App.init()`. |

## 3. Key anchors

| Line | Anchor | What it is |
|---:|---|---|
| 22 | `<meta http-equiv="Content-Security-Policy">` | Hash-pinned policy. In v4.6.5, script[1] hash = `Umo7F3WfQUU+84T7CCmaUiCSF/wvWKRp5U324eP2yGA=`; script[0] and style[0] hashes unchanged. |
| 1103 | `const APP_VERSION` | `'4.6.5'` (single source; drives QR payloads, diagnostics `appVersion`, manifest version). |
| 1181 | `function genLocalIdSuffix(len)` | **New in v4.6.5.** CSPRNG suffix for local record IDs; Math.random only as a non-crypto fallback. |
| 1213 | `const ETHICAL_MANIFEST` | Frozen license/use-restriction/principles object, checked at boot. |
| 3466 | `ConfirmModal` | **v4.6.5:** `opts.danger` → Cancel focused; Enter resolves to the focused button; Escape/backdrop/replacement always Cancel. |
| 3906 | `Pet` constructor id | `'pet_'+Date.now()+'_'+genLocalIdSuffix(6)` — CSPRNG id suffix. |
| 10436 | `rescueLifetimeMs:2*60*60*1000` | Rescue Pack default lifetime (2h; 30 min if a location is included) — unchanged. |
| 10470 | `V455Crypto.u8()` | **v4.6.5:** malformed base64 fails with clean `'Invalid encoding'`. |
| 10835 | Rescue Pack passphrase prompt | "16+ character passphrase (or 4+ random words)" — unchanged. |
| 10850 | `reservedIds=new Set([...])` | Reserved prototype-property names rejected/regenerated on pet-ID import — unchanged. |
| 10866 | `const existing=Object.create(null)` | Import merge map cannot mutate `Object.prototype` — unchanged. |
| 10892 | `securityBanner(){ /* no-op */ }` | Duplicate banner body removed in v4.6.1; still a no-op stub. |
| 11130 | `hardenLabels()` | Stamps visible subtitle to `v4.6.5`; logic unchanged. |
| 11132 | `patchPrompts()` | Passphrase floor: 16 chars or 4+ random words, enforced regardless of caller `minLen` — unchanged. |
| 11133 | `patchSessionPersistence()` | Session-only-registration confirmation; import blocked until vault exists — unchanged. |
| 11140 | `window.VitalGuardHardeningV46` | `version:'4.6.5'`; controls list unchanged. |

## 4. Storage and data map

| Area | Key / store | Behavior |
|---|---|---|
| IndexedDB | `VitalGuardAI_V41`, stores `pets/settings/ai/alerts/blobs` | Primary interface; sensitive state mediated by the encrypted vault layer. |
| Vault envelope | `__vg_vault_v455__` in settings store | AES-GCM/PBKDF2-encrypted state envelope. |
| Vault fallback | `vg41_vault_v455` in localStorage | Used only if IndexedDB is unavailable. |
| Session-only mode | in-memory state | Registration/import require explicit confirmation or are blocked until the vault is active. |
| Rescue replay ledger | `rescuePackUsedV455` | Browser-profile replay ledger for JTI values (not a global single-use guarantee). |
| Language | `vg_lang_v41`, `vg_lang_v412` | Local UI language preference only. |

*(unchanged from V4.6.4)*

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

Verified in v4.6.5: all distinct `data-vg-on*` actions used in markup resolve to an
allowlisted namespace/method, and every allowlisted method has a matching definition.
*(allowlist unchanged from V4.6.4)*

## 6. Static DOM ID index

Unchanged from V4.6.4 (the markup diff outside `<script>`/`<style>` contains only
version-string and CSP-hash changes). See the V4.6.4 map §6 for the full ID list.
`v455-ble-banner`, `v46-gate-ok`, and `v46-scope-gate` still do not appear — they
were runtime-created elements belonging to removed banner/gate functions.

## 7. CSP hash maintenance rule (important for future edits)

Whenever ANY byte inside the inline `<style>` block or either inline `<script>`
block changes — including version strings, i18n copy, comments, or whitespace — the
corresponding `script-src`/`script-src-elem` and/or `style-src`/`style-src-elem`
SHA-256 in the CSP meta tag MUST be recomputed and updated in the same release.
Skipping this is exactly what broke V4.6.2/V4.6.3. V4.6.5 followed this rule:
script[1] was edited, so its hash was recomputed; script[0] and style[0] were not
edited, so their hashes were retained and re-verified.

Recompute procedure (conceptual): take the exact text between `>` and `</script>`
(or `</style>`), compute SHA-256, base64-encode, and place it as `'sha256-...'` in
both the `-src` and `-src-elem` directives for that resource type. After writing the
CSP, re-verify that the on-disk resource still hashes to the declared value.

END OF CODE MAP
