**INDEPENDENT SECURITY REVIEW**

**VitalGuardAI.com v4.7.1**

**Preliminary Security Audit Report — White-Hat Perspective**

Based on OTF Security Lab public reporting practices · Independent · Unofficial

*Not an official certification · No dynamic/hardware testing performed · Status of all findings: OPEN*

| **Item** | **Value** |
|---|---|
| Target file | VitalGuard_AI_complete_V47_1.html |
| Declared version | APP_VERSION 4.7.1 (a version relabel of the V4.6.9 security baseline) |
| Assessment type | Static source review · White-box · Threat-model based |
| Assessment date | 2026-07-12 |
| Rating scale | OTF 5-tier (Critical / High / Medium / Low / Informational) |
| **Overall result** | **Critical 0 · High 0 · Medium 3 · Low 2 · Informational 3** |

**0. Notice on the Nature of This Document**

This report is an independent, preliminary security review written from a third-party review perspective (white-hat mock audit), not from the code designer's own perspective. It references the audit reporting practices publicly disclosed by the OTF (Open Technology Fund) Security Lab, but it is not an official audit or certification by USAGM or OTF and has no bearing on any funding outcome.

This review is limited to static source analysis and threat modeling. No dynamic testing was performed on actual Android/iOS devices, the Web Bluetooth runtime, spoofing transmitters, or deployment server response headers. Accordingly, the status of every finding is OPEN, and the report does not claim that any issue has been "fixed" or has "passed retesting."

For reference, the submitted build is V4.7.1, which, according to the code map, is a version relabel of the V4.6.9 security baseline (only the display string, CSP hashes, and documentation mapping were changed). Therefore, the security judgments in this review effectively concern the V4.6.9 logic, with only the displayed version being V4.7.1. This fact itself was confirmed through the static comparison in §5.9.

**Addendum (2026-07-19) — display-string reframing, no logic change.** After this review was written, a later revision reworded only human-readable framing strings (title, hero, hook, and the help/about panel across all 7 UI languages) from disaster/pet wording to surveillance/censorship-resistance wording. No security-control logic, control flow, allowlist, or cryptographic path was altered, so every finding and conclusion in this report continues to apply unchanged. As those strings reside inside the CSP-hash-pinned main application script, the main-script CSP SHA-256 and the whole-file SHA-256 were recomputed accordingly; the code map records the updated values.

**1. Executive Summary**

VitalGuardAI.com v4.7.1 is a single-HTML-file, offline-first application whose security maturity has clearly improved relative to the previous generation (v4.5.4). Network egress blocking (zero-egress) is now doubly enforced via CSP and runtime stubs, the BLE tag identity model has shifted to a fail-closed structure that no longer treats advertisement metadata as authentication, and both the destructive-replace path in data import and the Rescue Pack forgery/tampering issue have been structurally redesigned.

As a result, no Critical or High findings were identified in this review. In particular, the two High findings from the previous generation (BLE identity spoofing via advertisement, and cancel=destructive-replace) are assessed as resolved at the design level in this build (see §9, version comparison).

However, the white-box review identified the following three residual Medium risks. First, the regular expression used by the HTML sink sanitizer (neutralizeHTML) is bypassed by slash-delimited event-handler attribute vectors, meaning the defense-in-depth control does not fully meet its advertised guarantee (empirically confirmed). Second, the fail-closed design of BLE clone detection can be converted into an "availability denial" vector, in which a proximate attacker can repeatedly suppress the proximity-tracking feature merely by advertising. Third, the visible UI still labels Swarm/Mesh/autonomous SOS relay functionality, while the actual implementation supports only manual reception and manual cryptographic handoff — a mismatch between claimed capability and actual implementation in a life-safety tool (a residual risk the developer itself acknowledges in the code map).

**Key Conclusions**

- The current state is robust as a "controlled, non-operational research demo." As the file itself explicitly states, it is not recommended for deployment as a standalone tool for actual life-safety decisions such as search and rescue, pet safety, or emergency response.

- All three identified Medium findings are either "defense-in-depth controls falling short of their advertised guarantee" or "claim-implementation consistency" issues, not vulnerabilities that break the code execution flow. Nonetheless, in high-risk user contexts, documentation, correction, and control hardening are required.

- Deployment-stage server response headers (frame-ancestors, nosniff, Permissions-Policy, COOP/CORP) and verification of a separately signed release manifest remain essential prerequisites and cannot be enforced by in-file defenses alone.

- Until the visible Swarm/Mesh/SOS-relay wording is corrected to match the actual implementation scope (manual reception + manual cryptographic handoff), it is more accurate to label this a "research demo build" rather than "field-deployment ready."

**2. OTF Publication Practices and Rating Scale**

OTF Security Lab publicly describes security audits, verification of privacy/security claims, design/architecture review, code and cryptography review, penetration testing, configuration/infrastructure audits, retesting, and publication of results as its main activities. Individual reports follow the independent methodology and rating scale of the auditing vendor performing the work, so it is more accurate to say "OTF publishes reports from multiple specialized vendors" than "OTF uses a single fixed scoring rubric."

This report uses a 5-tier qualitative rating compatible with audits OTF has published for projects such as VPN Hood, FileZilla, PiRogue, and Briar. Ratings are not CVSS scores; they are judgments that jointly weigh confidentiality/integrity/availability impact, exploitation preconditions, attack complexity, and the target user base and life-safety context.

| **Rating** | **Definition** |
|---|---|
| **Critical** | A flaw that immediately collapses confidentiality/integrity remotely or at low cost, or that constitutes arbitrary code execution. |
| **High** | A flaw that can manipulate a core safety judgment, or that can cause the loss of the entirety of local state through simple manipulation alone. |
| **Medium** | A flaw where a defense-in-depth control fails to meet its advertised guarantee, or where availability/consistency is conditionally degraded. |
| **Low** | A flaw with low practical exploitability but that broadens the attack surface or leaves a future regression risk. |
| **Informational** | A residual risk knowingly accepted by design, or an observation that requires confirmation during deployment/operation. |

**3. Scope, Methodology, and Constraints**

**Areas Covered**

- Initial hardening core: CSP meta tag, frame fail-close, egress stubs (fetch/XHR/WS/ES/beacon/share/ServiceWorker), WebRTC/Worker blocking, prototype freezing, eval blocking, runtime self-check.

- Action dispatcher and Trusted Types guard: allowlist-based first-party method invocation, patches for innerHTML/insertAdjacentHTML/Range sinks, HTML/URL sanitizer.

- Encrypted local vault and backup: AES-GCM-256, PBKDF2-SHA-256 (600,000 iterations), AAD binding, write-epoch-based atomic writes, race-condition prevention for delete/wipe-all.

- BLE identity evaluation and routing: exact local device binding, clone-candidate detection, fail-closed direction-guidance blocking.

- Rescue Pack v2: AEAD encryption, jti replay guard, location-inclusion consent, blocking of legacy packs.

- Import/export: three-state (cancel-safe) modal, prototype-pollution prevention, size/depth limits, mandatory recovery backup, passphrase policy.

**Areas Excluded and Limitations**

- Dynamic testing against actual Android/iOS devices, Chrome/Web Bluetooth implementations, and BLE tags/spoofing transmitters.

- The actual HTTP response headers, TLS configuration, deployment pipeline, and domain/DNS/update channel of the hosting server.

- Penetration testing, fuzzing, browser-extension/malicious-app interaction, physical acquisition/memory forensics, swap/heap analysis.

- Full functional testing of every code path, and evaluation of accessibility, field usability, battery, and background behavior.

- Independent cryptographic/standards verification of third-party code (Project Nayuki QR) and SBOM/license legal review.

**Methodology**

The review consisted of a full static read-through of the source, identification of trust boundaries, comparison of each control's actual behavior against its advertised guarantee, and isolated reproduction where verifiable (e.g., the regex sanitizer, cryptographic round-trips). Isolated reproduction was performed using minimal scripts that approximate browser parser behavior; any divergence from actual browser parsing is noted separately under the relevant finding.

**4. Threat Model**

VitalGuard uses a "Pet Safety Leash" demo skin, but internally the documentation targets disaster response, search-and-rescue, off-grid continuity, and even surveillance/censorship-resistance contexts. It therefore requires a more conservative threat model than a typical consumer app. This assessment assumed the following adversaries:

- **Proximate BLE attacker:** an adversary near the victim capable of observing/cloning advertisement metadata (name/UUID/manufacturer data) and using a general-purpose transmitter that can manipulate RSSI.

- **Social-engineering attacker:** an adversary capable of delivering a tampered backup file or Rescue Pack code to the victim.

- **Device-access attacker:** an adversary with physical or logical access to an unlocked device, browser profile, or storage (including checkpoint/seizure/sharing situations).

- **Supply-chain attacker:** an adversary capable of tampering with files on the distribution channel or distributing a forged release.

- **DOM-injection-precondition attacker:** a hypothetical attacker assumed for the purpose of verifying whether the defense-in-depth sink filter functions as the last line of defense, on the assumption that a separate, unescaped input path exists.

**5. Summary of Findings**

| **ID** | **Finding** | **Rating** | **Status** |
|---|---|---|---|
| VG47-01 | HTML sink sanitizer regex bypass (slash-delimited attribute) | **Medium** | OPEN |
| VG47-02 | Fail-closed clone detection converted into a proximity-tracking availability-denial vector | **Medium** | OPEN |
| VG47-03 | Capability claim–implementation mismatch (Swarm/Mesh/SOS relay) | **Medium** | OPEN |
| VG47-04 | Legacy backup v=1 envelope AAD (metadata authentication) not applied | **Low** | OPEN |
| VG47-05 | Residual action-dispatcher argument semantics issue | **Low** | OPEN |
| VG47-06 | Deployment response headers cannot be enforced (meta-CSP limitation) | **Info** | OPEN |
| VG47-07 | Rescue Pack replay guard scoped only to local browser profile | **Info** | OPEN |
| VG47-08 | Full re-encryption cost of the single-envelope vault | **Info** | OPEN |

**Basis for the Overall Rating**

No Critical or High findings were identified. The two previous-generation High findings were resolved by (a) the shift to fail-closed BLE handling that never treats advertisement data as authentication, combined with a requirement for exact local binding, and (b) a three-state modal in which cancel/Escape/background click always resolve to Cancel, together with mandatory literal "REPLACE" input and a mandatory recovery backup, respectively. The remaining three Medium findings do not break the code execution flow, but under OTF practice — given the life-safety context — they require disclosure at publication time regarding defense-in-depth guarantees and claim consistency.

**6. Detailed Findings**

**VG47-01 · HTML Sink Sanitizer Regex Bypass (Medium)**

**Description**

The app monkey-patches the innerHTML, insertAdjacentHTML, and Range.createContextualFragment sinks, and routes every HTML string through neutralizeHTML() — via the vitalguard-html Trusted Types policy on browsers that support Trusted Types, and via the same patch on browsers that do not. neutralizeHTML is regex-based, and uses the following pattern to strip event-handler attributes:

```
const rxBadAttrs = /\s+on\w+\s*=/gi; // requires a preceding whitespace character (\s+)
```

This pattern requires a whitespace character before the event-handler attribute. However, HTML parsers also accept a slash (/) as a delimiter between a tag name and an attribute, or between two attributes. Consequently, a vector that uses a slash instead of whitespace passes through the regex and is restored to a functioning event handler when parsed by the browser. This is a classic limitation of regex-based HTML sanitizers (and is associated with mXSS vulnerabilities).

**Quantitative Evidence — Isolated Reproduction**

The three regex patterns from neutralizeHTML were extracted verbatim from the submitted file and executed in isolation (input → sanitized output):

```
[BLOCKED] <img src=x onerror=alert(1)> -> <img src=x data-vg-blocked-on=alert(1)>
[BYPASS ] <img/onerror=alert(1) src=x> -> <img/onerror=alert(1) src=x>
[BYPASS ] <svg/onload=alert(1)> -> <svg/onload=alert(1)>
[BYPASS ] <details/open/ontoggle=alert(1)> -> <details/open/ontoggle=alert(1)>
```

All three slash-delimited vectors passed straight through the filter. Because the same function is also used as the createHTML implementation for the Trusted Types policy, this output is approved as TrustedHTML in Chromium/Edge as well — meaning the bypass is not limited to non-Trusted-Types browsers.

**Impact and Reachability Assessment**

This control is the last line of defense-in-depth advertised as "HTML sink neutralization." Within the scope of this static review, the primary render paths escape user data via Sanitizer.escapeHTML() before inserting it into template strings, so no unescaped injection source directly reachable through this bypass was identified in the current code. The rating is therefore set at Medium rather than High. However, because this last line of defense does not meet its advertised guarantee, any future render path that omits escaping would not be caught by this filter.

**Recommendations**

- Replace the regex-based approach with parser-based neutralization. Under the constraint of no external libraries, an allowlist node-traversal approach using DOMParser (reconstructing only allowed tags/attributes) is recommended. On supporting browsers, the native Element.setHTML() is also a viable alternative.

- If the regex approach is retained, expand the attribute-boundary character class beyond whitespace to include slash (/), backslash, newline, tab, and form-feed, and add regression tests for mXSS-triggering contexts (noscript, svg/mathml namespace switching, false-positive comments).

- For all innerHTML-family sinks in the file (56 locations), re-verify individually whether input always passes through escaping/allowlisting, and document explicitly that the sink filter is a last line of defense, not a primary one.

- To the vendor: *We assess the name-level allowlist as robust. The remaining attack surface is whether an argument passed to an allowed method reaches a sink — we ask that this specific point be attacked directly. If even a single argument is shown to reach a sink, we will accept it as a confirmed finding.*

**VG47-02 · Fail-Closed Clone Detection Converted into an Availability-Denial Vector (Medium)**

**Description**

To prevent clone spoofing, BLEIdentityV455.observe() sets cloneSuspectedUntil = now + 120000 (2 minutes) — blocking that tag's signal — whenever two or more distinct device IDs are observed within an 8-second window, or when RSSI shifts by more than 22 dBm within 3 seconds. The final router (routeAdvertisement) similarly quarantines all matching records whenever there are two or more exact local bindings.

This fail-closed design reliably eliminates the previous generation's problem of "misdirecting the user toward a spoofed direction" (safety misdirection). However, as a trade-off, a proximate attacker can clone the name/UUID/manufacturer data of a tag registered by the victim and, merely by advertising, trigger the "two or more observations" condition — causing the legitimate tag's proximity signal to be repeatedly blocked for two minutes at a time. If the attacker sustains the advertisement, the proximity-tracking feature can be effectively blocked indefinitely.

**Impact**

The risk of safety misdirection (integrity) has been resolved via fail-closed design, but at the cost of introducing an availability-denial vector. In surveillance/censorship contexts, the fact that "an adversary can arbitrarily disable the target-tracking feature" can itself be treated as a safety-relevant failure. That said, since this build already disables direction guidance and prohibits standalone use for life-safety purposes, the actual harm is limited to "denial of the proximity-signal display."

**Recommendations**

- Consider an option that separates the clone-suspected state into "blocked" and "flagged (raw observation retained)." That is, preserve the integrity guarantee (keep direction guidance/SAFE status disabled) while exposing to the user a "multiple signals detected — identity unconfirmed, showing raw RSSI only" state, avoiding complete information suppression.

- Ensure that cloneSuspectedUntil blocking does not extend indefinitely from the mere presence of attacker advertisements, by providing user confirmation, manual override, and a back-off policy.

- If availability denial is an accepted design trade-off, state this explicitly in the threat-model documentation and user guidance as: "In adversarial environments, proximity signals may be intentionally blocked."

**VG47-03 · Capability Claim–Implementation Mismatch (Medium)**

**Description**

The capability-scope meta tag and diagnostic object in the head accurately declare that this artifact implements only "passive Web Bluetooth advertisement reception, local signal processing, and manual cryptographic handoff," and does not implement "BLE advertisement transmission, GATT relay, P2P mesh routing, autonomous device self-organization, or autonomous SOS relay." However, the visible UI copy (product wording) still labels Swarm/Mesh/SOS relay. Code map §1 and §10 explicitly document this mismatch as "a residual risk intentionally retained due to a release constraint (no UX/copy changes permitted)."

**Impact**

While the machine-readable manifest is accurately stated, actual users rely on the visible wording. In a tool that presents itself as life-safety-oriented, labeling "autonomous mesh relay/autonomous SOS relay" when it is not implemented can lead users to form a false safety expectation of relying on autonomous relay that does not exist. Under OTF practice, "whether a tool behaves as claimed" is a core verification item, and overstated claims are treated as an integrity/trust issue.

**Recommendations**

- Correct the visible UI wording for Swarm/Mesh/autonomous SOS relay to match the actual implementation scope (passive advertisement reception + local processing + manual cryptographic handoff). This is achievable through a copy change alone, independent of the release constraint on code-logic changes.

- Until the correction is made, clearly and repeatedly display "autonomous relay/mesh routing not implemented — manual handoff only" on the first-run screen and the SOS screen.

- At publication, also provide the "implemented/not implemented" table from the capability-scope meta as a user-facing document, so that the machine-readable declaration and user perception are aligned.

**VG47-04 · Legacy Backup v=1 Envelope AAD Not Applied (Low)**

**Description**

V455Crypto.decryptLegacyBackup accepts both v=1 and v=2 legacy envelopes. It applies additionalData (envelope metadata binding) for v≥2, but not for v=1. In other words, the metadata of a v=1 envelope — algorithm, version, iteration count, etc. — is not cryptographically authenticated.

```
if(Number(env.v)>=2) params.additionalData = ...; // v=1 has no AAD
```

**Impact**

The practical risk is low. The iteration count is fixed at 600,000 in the code, and any env.it value other than 600,000 is rejected, so an iteration-count downgrade is not possible. In addition, because the AES-GCM tag guarantees the integrity of the ciphertext itself, plaintext cannot be forged without the correct passphrase. What remains is the downgrade surface of "the v=1 legacy path is still accepted" and the fact that its metadata itself is unauthenticated.

**Recommendations**

- Retire the v=1 legacy decryption path, or allow it only in a limited fashion under explicit user approval (a gate similar to the current IMPORT PLAINTEXT confirmation).

- If the legacy path is retained, add at least minimal metadata binding (or an envelope-field integrity check) to v=1 as well.

**VG47-05 · Residual Action-Dispatcher Argument Semantics Issue (Low)**

**Description**

VitalGuardActionPolicy parses data-vg-on* tokens only in the form Namespace.method(args), and strictly restricts which names can be invoked via hasOwnProperty + allowlist + Object.freeze (the name-level boundary is robust). Arguments are restricted, via parseAtom, to short literals only (strings ≤120 characters, with < >, and backticks blocked; numbers, booleans, this.value, and event). HTML injection via arguments is therefore blocked.

What remains is not a naming issue but an "argument semantics" issue. Whether a (formally harmless) string argument passed to an allowlisted method subsequently flows, inside that specific method's implementation, into a sensitive sink such as a DOM lookup, state mutation, or redirect requires per-method verification. No confirmed vulnerability was identified within the scope of this static review.

**Recommendations**

- For each method on the allowlist (App.setTrackMode, Nav.go, I18N.setLang, Settings.setVolume, Detail.setLeash, etc.), map, on a per-call-site basis, which sink its arguments ultimately reach, and document the trust boundary.

- To the vendor: *We assess the name-level allowlist as robust. The remaining attack surface is whether an argument passed to an allowed method reaches a sink — we ask that this specific point be attacked directly. If even a single argument is shown to reach a sink, we will accept it as a confirmed finding.*

**VG47-06 · Deployment Response Headers Cannot Be Enforced (Informational)**

Meta CSP cannot enforce frame-ancestors, X-Content-Type-Options, Permissions-Policy, or COOP/CORP. The file discloses this limitation via the required-response-headers meta tag and the security-limitations meta tag, and provides an in-file frame guard (fail-close when framed) as defense-in-depth. Top-level location-navigation immutability cannot be guaranteed by in-page JavaScript, and this is disclosed as a platform-level residual limitation.

**Recommendation:** When hosting, configure server response headers and confirm them via automated deployment testing. For fully static deployments, retain the current script/style hash-based CSP approach, and provide deployment documentation covering the security/functionality differences among file://, localhost, and HTTPS.

**VG47-07 · Rescue Pack Replay Guard Scoped Only to the Local Browser Profile (Informational)**

The replay guard is a "single-use within a given browser profile" mechanism — not globally single-use — storing a SHA-256(jti) hash in a local profile ledger (vg_rp_replay_v469) and an encrypted-settings ledger. The in-app card copy accurately discloses this. Clearing site data causes the ledger to be lost.

The impact is limited. Decrypting a Rescue Pack requires a passphrase shared over a separate channel, and even on success, the output is an unauthenticated "candidate" BLE signature with direction guidance disabled. However, if a location-inclusive pack is reused on a different device, location and tag metadata could be re-exposed, so this boundary should be clearly stated at publication time. (Recommendation: for contexts where this matters, offer issuer-identifier/recipient-public-key-based encryption or in-person QR pairing as options.)

**VG47-08 · Full Re-Encryption Cost of the Single-Envelope Vault (Informational)**

The current vault keeps pets/settings/ai/blobs in a single AES-GCM envelope. As a result, even a small settings change causes the entire sensitive state to be re-serialized and re-encrypted. This is not a security flaw, but it is a factor in performance, storage wear, and latency at scale. Per-record envelope separation was deferred to a separate release in code map §11, since it changes migration/recovery semantics. **Recommendation:** in a future structural pass, separate the settings/each-pet/AI/voice envelopes, and design an automatic migration path from the single envelope together with a recovery-test matrix.

**7. Confirmed Positive Security Controls**

OTF-style reports record positive design choices worth preserving, not only negative findings. This build implements substantially more defense-in-depth than a typical single-HTML demo.

- **Dual zero-egress enforcement:** CSP's connect-src 'none' plus runtime-locked, immutable stubs for fetch/XHR/WebSocket/EventSource/sendBeacon/navigator.share/serviceWorker.register. Even if a handle recovery attempt is made, CSP blocks the actual connection as a second layer.

- **BLE fail-closed:** isAuthenticated() always returns false; routing requires exact local device binding; direction guidance (HOT/COLD) is disabled for unauthenticated tags. Advertisement data alone can never be promoted to authentication.

- **Import safety:** a three-state modal in which Escape, background click, and modal replacement always resolve to Cancel; a mandatory literal "REPLACE" input plus mandatory encrypted recovery backup for Replace; autoWipeOnClose disabled throughout the codebase.

- **Rescue Pack v2:** AES-GCM plus purpose-bound AAD, jti replay guard, location off-by-default with consent, and blocking of legacy unsigned packs.

- **Encrypted vault:** AES-GCM-256, PBKDF2-SHA-256 with 600,000 iterations, a 16-byte salt, a fresh 12-byte IV per operation, purpose-bound AAD, and write-epoch/writeBlocked mechanisms preventing data resurrection from delayed writes after deletion.

- **Passphrase policy:** rejects repeated characters, repeated phrases, project/common-word terms, and predictable sequences; enforces either four distinct words or a high-entropy alternative.

- **Initial hardening core:** prototype freezing, eval blocking, Trusted Types policy, frame fail-close, and removal of window.name/opener channels, among other measures.

- **Import contamination prevention:** rejection of __proto__/prototype/constructor keys, null-prototype merge maps, size/depth/cycle limits, regeneration of reserved IDs, and routing of signed data through a mandatory rebind-required path.

- **Graceful QuotaExceeded handling:** on QuotaExceeded, core records are not deleted; writes instead fail visibly and warn the user (resolving the previous generation's automatic-deletion problem).

- **Honest integrity disclosure:** the in-app fingerprint is explicitly labeled "for diagnostic use," and users are guided to distribute and verify the full-file SHA-256 through a separate trusted channel (mitigating the previous generation's risk of self-hash misinterpretation).

**8. Remediation Roadmap and Retest Plan**

**Priorities**

- **P1:** VG47-01 (switch to parser-based sanitization or expand the regex boundary, plus regression tests), VG47-03 (correct visible copy).

- **P2:** VG47-02 (separate blocking from warning, and add back-off), VG47-05 (document argument-to-sink mapping).

- **P3:** VG47-04 (review retirement of the legacy v=1 path), VG47-08 (per-record envelope separation — separate release).

- **Deployment prerequisites:** confirm VG47-06 (server headers) and VG47-07 (disclosure of replay-guard boundary).

**Minimum Retest Scenarios**

- **Sink filter:** slash/newline/tab-delimited event handlers, mXSS (noscript, svg/mathml namespace switching), reproduction of actual innerHTML assignment on both Trusted-Types and non-Trusted-Types browsers.

- **BLE:** exact-name only, prefix+manufacturer, service UUID clone, strongly spoofed RSSI, simultaneous presence of the genuine tag, measurement of availability-denial duration under sustained clone advertising, and multiple attacking transmitters.

- **Import:** Escape/background/back navigation, Merge/Replace/Cancel, incorrect REPLACE input, cancellation of the recovery backup, malformed voice data, quota/DB errors during save, and rollback verification.

- **Rescue Pack:** tampering plus re-encryption, expiration/replay, reuse on a different profile, location-inclusive consent, and separation of the passphrase channel.

- **Deployment:** full-file hash/signature verification, detection of a tampered main script, HTTP security headers, and behavioral differences across file://, localhost, and HTTPS.

**9. Version Comparison (v4.5.4 → v4.7.1)**

| **Previous finding (v4.5.4)** | **Rating at the time** | **v4.7.1 status** |
|---|---|---|
| BLE identity spoofing via advertisement | **High** | Resolved — fail-closed + exact local binding |
| Cancel = destructive replace / autoWipe on import | **High** | Resolved — three-state modal + REPLACE input + autoWipe removed |
| Rescue Pack unauthenticated (CRC only) | **Medium** | Resolved — AEAD + jti replay guard |
| At-rest plaintext storage | **Medium** | Substantially mitigated — encrypted vault; new data non-persistent (memory only) |
| Self-hash mistaken for integrity guarantee | **Medium** | Mitigated via disclosure — labeled "for diagnostic use" + guidance to a separate manifest |
| QuotaExceeded auto-deleting core data | **Medium** | Resolved — core records are never deleted; failure is now visible |
| Meta CSP headers cannot be enforced | **Low** | Retained (disclosed residual) — VG47-06 |

**Regression status:** None detected (REGRESSION: NO). The new findings in this review, VG47-01 and VG47-02, are not a regression relative to the previous version; rather, they are residual limitations of strengthened controls (the regex sink filter and fail-closed clone detection) that were surfaced through white-box review.

**10. Conclusion**

VitalGuardAI.com v4.7.1 demonstrates a defense-in-depth design that substantially surpasses the previous generation in terms of single-file architecture, zero-egress, an encrypted vault, fail-closed BLE, and safe import handling. Both High findings from the previous generation have been resolved at the design level, and this review identified no Critical or High findings.

However, the strength of a security boundary is determined by its weakest assumption. The three remaining Medium findings are: (1) the defense-in-depth sink filter is bypassed by slash-delimited vectors; (2) the fail-closed design intended to prevent spoofing can be converted into an availability-denial vector against proximity tracking; and (3) the visible-copy claims of Swarm/Mesh/autonomous SOS relay exceed the actual implementation (manual reception and manual handoff only). None of the three is a flaw that breaks the code execution flow, but in a life-safety context and under OTF practice, they require disclosure, correction, and hardening at publication time.

Aligned with OTF's public reporting practice, the appropriate path is to publish this result as zero High findings and three Medium findings, prioritize fixing VG47-01 and VG47-03, and then update the status through an independent retest. At this point in time, the most accurate publication language is: "Controlled research demo build — retest recommended after correcting the visible capability claims and hardening the sink filter."

**Appendix A. Source Evidence Index**

| **Area** | **Anchor (lines)** | **Notes** |
|---|---|---|
| CSP / capability-scope meta | 39 / 45 | connect-src none, Trusted Types, capability-scope declaration |
| Initial hardening core | 52–139 | Egress stubs, frame fail-close, prototype freezing, self-check |
| Action dispatcher / policy | 857–918 | allowlist + hasOwnProperty + freeze (VG47-05) |
| Trusted Types / regex sanitizer | 942–1002 | rxBadAttrs regex (VG47-01) |
| V455Crypto / legacy decryption | 10491–10523 | v=1 AAD not applied (VG47-04) |
| Encrypted vault / write-epoch | 10568–10722 | atomicUpdate / invalidateWrites |
| BLE identity / observe | 10746–10806 | Clone-detection blocking (VG47-02) |
| Rescue Pack v2 / replay | 10808–10906 | AEAD + jti (VG47-07) |
| Final BLE routing | 11032–11066 | Exact local binding required (fail-closed) |
| Passphrase policy | 11184–11206 | Four-word / high-entropy requirement |

**Appendix B. Reference Practices**

The following are the publicly disclosed OTF/USAGM practices referenced for the rating definitions and the report structure comparison (URLs should be refreshed to the latest versions before publication).

- OTF Security Lab — audit scope, retesting, disclosure principles, high-risk user context.

- OTF Security Lab RFP — scope of code review, penetration testing, threat modeling.

- Published audit examples (VPN Hood / FileZilla / PiRogue / Briar / CoverDrop / AmneziaVPN) — 5-tier rating, finding structure (description, impact, reproduction, recommendation, status), fix/retest notation.

- USAGM — the launch of OTF as an independent grantee and its planned 2027 integration into the State Department; recent developments should be reconfirmed immediately before publication.

**Appendix C. Final Publication Checklist**

☐ The first page of the document states "unofficial, independent review" and clarifies that this is not an official OTF/USAGM audit.

☐ The target file's version, hash, line count, assessment date, scope, and exclusions are recorded.

☐ The definitions of Critical/High/Medium/Low/Informational and the rationale for context-based adjustment are recorded.

☐ Each finding includes an ID, rating, status, description, impact, evidentiary basis (quantitative evidence), and recommendation.

☐ All findings are marked OPEN, and none are claimed as fixed or as having passed retest.

☐ The product is not labeled "field-deployment ready" prior to correcting the visible capability claims (Swarm/Mesh/SOS relay).

☐ Positive controls and residual risks are both recorded.

☐ It is noted that remediation commits and independent retest results are to be added to this same report in the future.

*— End of report · Status of all findings: OPEN · Independent, unofficial preliminary review —*
