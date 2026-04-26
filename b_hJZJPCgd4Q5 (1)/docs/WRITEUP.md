# TalentScout AI: Approach, Architecture & Trade-offs

## Problem Statement

Recruiters spend 15-20 hours per week manually reviewing profiles and chasing candidate interest. This agent automates the entire pipeline: parse requirements, discover matches, assess interest, and deliver an actionable ranked shortlist.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           TALENTSCOUT AI PIPELINE                           │
└─────────────────────────────────────────────────────────────────────────────┘

     ┌──────────────┐      ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
     │   STAGE 1    │      │   STAGE 2    │      │   STAGE 3    │      │   STAGE 4    │
     │  JD PARSING  │ ──── │  DISCOVERY   │ ──── │  ENGAGEMENT  │ ──── │   RANKING    │
     └──────────────┘      └──────────────┘      └──────────────┘      └──────────────┘
           │                     │                     │                     │
           ▼                     ▼                     ▼                     ▼
    ┌─────────────┐      ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
    │ • Title     │      │ • Skills    │      │ • Outreach  │      │ • Combined  │
    │ • Skills    │      │   Matching  │      │   Messages  │      │   Score     │
    │ • Experience│      │ • Gap       │      │ • Interest  │      │ • Status    │
    │ • Keywords  │      │   Analysis  │      │   Signals   │      │ • Shortlist │
    └─────────────┘      └─────────────┘      └─────────────┘      └─────────────┘

                              DATA LAYER
    ┌─────────────────────────────────────────────────────────────────────────┐
    │  Candidate Database (12 profiles)  │  Conversation Templates  │  Types  │
    └─────────────────────────────────────────────────────────────────────────┘
```

---

## Scoring Logic

### Match Score (0-100) — How well does the candidate fit?

| Component | Weight | Calculation |
|-----------|--------|-------------|
| Skill Match | 70% | `(matched_skills / required_skills) × 70` |
| Experience | 20% | Years mapped to 0-20 points |
| Availability | 10% | Active=10, Open=7, Passive=4, Not Looking=1 |

**Example:**
- Candidate has 5/7 required skills → 50 points
- 6 years experience (Senior level) → 18 points  
- "Open to opportunities" → 7 points
- **Total: 75/100**

### Interest Score (0-100) — How engaged is the candidate?

| Signal | Points | Detection |
|--------|--------|-----------|
| Enthusiasm keywords | +20 | "excited", "love to", "thrilled" |
| Availability confirmation | +15 | "available", "start immediately" |
| Skill alignment acknowledgment | +15 | "perfect fit", "matches my experience" |
| Questions about role | +10 | "tell me more", "what's the team like" |
| Salary discussion | +10 | "compensation", "salary range" |
| Timeline flexibility | +10 | "flexible", "can adjust" |
| Hesitation language | -15 | "not sure", "need to think" |
| Negative response | -25 | "not interested", "decline" |

**Base score: 50** (neutral). Signals adjust from there.

### Combined Score

```
Combined Score = (Match Score × 0.5) + (Interest Score × 0.5)
```

Equal weighting ensures both fit AND interest are valued. A perfect match who isn't interested ranks lower than a good match who is eager.

### Status Assignment

| Combined Score | Status |
|----------------|--------|
| ≥ 75 | Engaged |
| 60-74 | Interested |
| 45-59 | Considering |
| < 45 | Declined |

---

## Design Decisions & Trade-offs

### 1. Client-Side Processing vs. API Calls

**Decision:** All scouting logic runs client-side with mock data.

**Trade-off:** 
- (+) No API keys required, instant demo, works offline
- (-) Cannot scale to real candidate databases
- **Rationale:** For a prototype, demonstrating the UX flow matters more than backend integration.

### 2. Skill Matching Algorithm

**Decision:** Case-insensitive substring matching with common alias mapping.

**Trade-off:**
- (+) Simple, fast, deterministic
- (-) Misses semantic similarity ("JavaScript" vs "JS" handled, but not "React" vs "Frontend frameworks")
- **Future:** Integrate embeddings for semantic skill matching.

### 3. Conversation Simulation

**Decision:** Template-based responses keyed to candidate availability status.

**Trade-off:**
- (+) Predictable, always grammatically correct
- (-) Less dynamic than LLM-generated responses
- **Rationale:** Ensures demo reliability; production would use real LLM with guardrails.

### 4. Equal Score Weighting (50/50)

**Decision:** Match and Interest scores weighted equally.

**Trade-off:**
- (+) Balances technical fit with genuine interest
- (-) Some recruiters may prefer heavier match weighting
- **Future:** Make weighting configurable per job type.

### 5. Synchronous Pipeline

**Decision:** Each stage completes before the next begins (with visible progress).

**Trade-off:**
- (+) Clear UX feedback, easier to debug
- (-) Slower than parallel processing
- **Rationale:** Sequential flow helps users understand what's happening.

---

## Innovation Highlights

1. **Explainable Matching:** Every score shows WHY — matched skills, gaps, interest signals
2. **Dual-Dimension Scoring:** Separating fit from interest gives recruiters actionable insights
3. **Conversation Transcripts:** Full outreach history attached to each candidate
4. **Progressive Disclosure:** 4-stage visual pipeline demystifies AI processing
5. **Template Quick-Start:** 4 pre-built JD templates for immediate testing

---

## Limitations & Future Work

| Current Limitation | Planned Enhancement |
|--------------------|---------------------|
| Mock candidate database | Integration with LinkedIn/GitHub APIs |
| Template-based conversations | LLM-powered dynamic outreach |
| Substring skill matching | Embedding-based semantic matching |
| No persistence | Database storage for saved searches |
| Single user | Multi-user with role-based access |

---

## Technical Implementation

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 with design tokens
- **Components:** shadcn/ui (accessible, customizable)
- **State:** React useState/useCallback (no external state library needed)
- **Build:** Turbopack for fast development

---

## Conclusion

TalentScout AI demonstrates a complete end-to-end recruitment automation pipeline. The architecture prioritizes explainability (recruiters must trust AI recommendations), UX clarity (visual progress through stages), and actionable output (ranked list with all context needed to act immediately). While using mock data for the prototype, the modular design allows straightforward integration with real APIs and LLMs in production.
