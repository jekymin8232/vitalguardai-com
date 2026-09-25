# VitalGuard

**Constraint-Based Ethical Design for Ultra-Lightweight Offline AI in Humanitarian Contexts**

Gyu-min Jeon (Morgan J.) · M-Corp Ethical AI · contact@mcorpai.org · February 2026

> VitalGuard is an offline AI artefact constrained to 54 kB, written in vanilla HTML and JavaScript with zero external dependencies. It is presented as a research pathway, not a finished or field-validated product.

---

## 1. Problem and Approach

VitalGuard inverts the usual design question. Instead of asking *"What can AI do?"*, it asks:

> *"What may AI ethically be permitted to do in the most vulnerable settings, and under what institutional conditions?"*

The working proposition is that **minimalism can function as an accountability mechanism**:

- A system that collects no data cannot leak data.
- A system with no network connection cannot be intercepted remotely.
- A system of 54 kB can be inspected end-to-end by a single reviewer.

**What this work does not claim:** it does not outperform existing AI on benchmarks; it is not ready for deployment; and constraint-based design is not presented as universally superior. The design is authored outside the displacement-affected communities it aims to serve, and this power asymmetry is acknowledged as unresolved.

---

## 2. Ten Principles and Architecture

Ten design principles, derived from GDPR, UNCRC, and CRPD, are each mapped to a concrete architectural constraint.

| # | Principle | Constraint in the artefact |
|---|-----------|----------------------------|
| 1 | Minimise hallucinations | Classical probabilistic / rule-based methods only; no generative models |
| 2 | Ensure transparency | Entire system readable in vanilla HTML/JS |
| 3 | Accessibility in low-income settings | No proprietary software, fees, or special hardware |
| 4 | Eliminate data exploitation | No collection, no server, no telemetry |
| 5 | Operate in low-resource environments | Runs on refurbished phones and solar power |
| 6 | Remove legal liability | No organisational custody of personal data |
| 7 | Free of charge and lightweight | No licensing cost for users or institutions |
| 8 | Simplicity and standardisation | Well-characterised classical algorithms |
| 9 | Non-specialist friendly | Extensively commented, field-adaptable code |
| 10 | Collect no data, allow simple deletion | Closing the session removes all traces |

**Four-layer architecture:** Input → Processing (Naïve Bayes, Levenshtein matching, weighted scoring) → Output (explicit confidence indicators) → Session security (volatile in-memory state only).

**Feature inclusion protocol.** A feature is included only if it is (a) necessary for the humanitarian use case, (b) implementable within 54 kB, and (c) compliant with all ten principles. Exclusion is deliberately privileged over inclusion.

**Mandatory human fallback.** Outputs below a confidence threshold of 0.8 are actively deferred to a human decision-maker. The threshold value is configurable; the existence of the fallback is not.

---

## 3. Formal Properties and Auditable Invariants

**Size boundary.** Kolmogorov complexity is uncomputable, so no claim is made about it. Instead, an *auditable description-length proxy* is used: `ADL(S) ≤ 54 kB`, the literal encoded size of the distributed files. This is treated as a practical review envelope, not a proof of optimality.

**Privacy-by-non-collection.** VitalGuard does **not** claim (ε, δ)-differential privacy, as it adds no noise mechanism and runs no population-level loop. Privacy is instead framed through two constraints:

- *No persistent retention:* nothing is written to localStorage, IndexedDB, cookies, or file-system APIs.
- *No exfiltration:* `NetCalls = ∅` (no fetch, XMLHttpRequest, WebSocket, or beacon calls).

**Complexity.** Naïve Bayes: training O(NF), inference O(F). Levenshtein: O(mn) time, reducible to O(min(m,n)) space. Performance is stated as a design target, with a measurement protocol in Appendix A of the paper.

**Threat model.** Protection is meaningful against a *remote* adversary. Against a *local* adversary (device seizure, malware, screen capture), confidentiality cannot be guaranteed; the system is not a secure enclave.

**Four invariants, checkable directly in source code:**

- **I1** — No third-party code (no libraries, CDNs, or dynamic loading)
- **I2** — No outbound network calls
- **I3** — No persistent writes
- **I4** — Deterministic, inspectable algorithmic core

---

## 4. Preliminary Validation and Use Cases

**Design review.** In 2025, a European government development agency conducted a three-week design review covering technical feasibility, ethical alignment, and policy compatibility. It found core claims (offline operation, no server-side custody) technically checkable within its scope, and raised questions about deployment pathways, governance, and field validation. This review **does not constitute endorsement, certification, or approval**.

**Academic engagement.** Exploratory discussions are at an early stage with researchers at the Institute of Development Studies (IDS), University of Sussex, and the UCL Global Disability Innovation Hub. **No formal collaboration agreements have been established.**

**Illustrative use cases (not evaluated):**

- *Refugee identity matching* — local normalisation and Levenshtein matching with phonetic handling of transliteration; ranked candidates with confidence scores. It supplements, rather than replaces, existing UNHCR processes.
- *Basic health screening* — symptom checklist with a Naïve Bayes three-level risk category (Low / Medium / High). This is a screening tool, not a diagnostic instrument.

**Reproducibility checklist.** Independent reviewers can verify: file size, offline operation (e.g. airplane mode), absence of network APIs, absence of persistent storage writes, and deterministic algorithmic pathways.
