# System Architecture

## High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              TALENTSCOUT AI SYSTEM                                   │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────┐    │
│  │                            USER INTERFACE LAYER                              │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │    │
│  │  │  JD Input    │  │  Progress    │  │  Candidate   │  │  Ranked      │     │    │
│  │  │  + Templates │  │  Indicator   │  │  Cards       │  │  Results     │     │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘     │    │
│  └─────────────────────────────────────────────────────────────────────────────┘    │
│                                        │                                             │
│                                        ▼                                             │
│  ┌─────────────────────────────────────────────────────────────────────────────┐    │
│  │                           PROCESSING PIPELINE                                │    │
│  │                                                                              │    │
│  │   ┌────────────┐    ┌────────────┐    ┌────────────┐    ┌────────────┐      │    │
│  │   │  STAGE 1   │    │  STAGE 2   │    │  STAGE 3   │    │  STAGE 4   │      │    │
│  │   │            │    │            │    │            │    │            │      │    │
│  │   │  Parse JD  │───▶│  Discover  │───▶│  Simulate  │───▶│   Rank &   │      │    │
│  │   │            │    │  Matches   │    │  Outreach  │    │   Score    │      │    │
│  │   │            │    │            │    │            │    │            │      │    │
│  │   └────────────┘    └────────────┘    └────────────┘    └────────────┘      │    │
│  │        │                  │                  │                  │           │    │
│  │        ▼                  ▼                  ▼                  ▼           │    │
│  │   ┌─────────┐       ┌─────────┐       ┌─────────┐       ┌─────────┐        │    │
│  │   │ParsedJD │       │Candidate│       │Conversa-│       │ Scored  │        │    │
│  │   │ Object  │       │ Match[] │       │  tions  │       │Shortlist│        │    │
│  │   └─────────┘       └─────────┘       └─────────┘       └─────────┘        │    │
│  │                                                                              │    │
│  └─────────────────────────────────────────────────────────────────────────────┘    │
│                                        │                                             │
│                                        ▼                                             │
│  ┌─────────────────────────────────────────────────────────────────────────────┐    │
│  │                              DATA LAYER                                      │    │
│  │                                                                              │    │
│  │   ┌────────────────┐   ┌────────────────┐   ┌────────────────┐              │    │
│  │   │   Candidate    │   │  Conversation  │   │    Skill       │              │    │
│  │   │   Database     │   │   Templates    │   │    Aliases     │              │    │
│  │   │  (12 profiles) │   │  (by status)   │   │   (mappings)   │              │    │
│  │   └────────────────┘   └────────────────┘   └────────────────┘              │    │
│  │                                                                              │    │
│  └─────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                      │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         app/page.tsx                            │
│                    (Main Application State)                     │
│                                                                 │
│  State: stage, parsedJD, candidates, engagedCandidates         │
│  Handlers: handleStartScouting, runScoutingPipeline            │
└─────────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
          ▼                   ▼                   ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ JobDescription  │  │    Progress     │  │    Ranked       │
│     Input       │  │    Indicator    │  │    Results      │
│                 │  │                 │  │                 │
│ - Textarea      │  │ - 4 stages      │  │ - Summary stats │
│ - 4 JD templates│  │ - Active state  │  │ - Candidate list│
│ - Start button  │  │ - Descriptions  │  │ - Conversations │
└─────────────────┘  └─────────────────┘  └─────────────────┘
                                                   │
                              ┌────────────────────┤
                              │                    │
                              ▼                    ▼
                     ┌─────────────────┐  ┌─────────────────┐
                     │  ParsedJD       │  │  Candidate      │
                     │  Display        │  │  Card           │
                     │                 │  │                 │
                     │ - Requirements  │  │ - Profile info  │
                     │ - Skills badges │  │ - Scores        │
                     │ - Experience    │  │ - Skill matches │
                     └─────────────────┘  │ - Conversation  │
                                          └─────────────────┘
```

---

## Data Flow Diagram

```
┌──────────────┐
│ Raw JD Text  │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│                      STAGE 1: PARSE JD                        │
│                                                               │
│  Input: "Senior Full Stack Engineer... React, Node..."       │
│                          │                                    │
│                          ▼                                    │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Extraction Logic:                                       │  │
│  │ - Title: First line or "Position:" field               │  │
│  │ - Skills: Keywords after "Requirements:", tech terms    │  │
│  │ - Experience: "X+ years" patterns                       │  │
│  │ - Level: junior/mid/senior/lead keywords               │  │
│  └────────────────────────────────────────────────────────┘  │
│                          │                                    │
│                          ▼                                    │
│  Output: ParsedJD { title, requiredSkills[], experience }    │
└──────────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│                    STAGE 2: DISCOVER MATCHES                  │
│                                                               │
│  ┌─────────────────┐      ┌─────────────────┐                │
│  │    ParsedJD     │      │   Candidate DB   │                │
│  │  requiredSkills │      │   12 profiles    │                │
│  └────────┬────────┘      └────────┬────────┘                │
│           │                        │                          │
│           └──────────┬─────────────┘                          │
│                      ▼                                        │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Matching Algorithm:                                     │  │
│  │                                                         │  │
│  │ FOR each candidate:                                     │  │
│  │   matchedSkills = intersection(required, candidate)     │  │
│  │   skillScore = (matchedSkills.length / required) × 70   │  │
│  │   expScore = mapExperience(candidate.years)             │  │
│  │   availScore = mapAvailability(candidate.status)        │  │
│  │   matchScore = skillScore + expScore + availScore       │  │
│  │                                                         │  │
│  │ FILTER candidates where matchScore >= 40                │  │
│  │ SORT by matchScore DESC                                 │  │
│  └────────────────────────────────────────────────────────┘  │
│                      │                                        │
│                      ▼                                        │
│  Output: CandidateMatch[] with matchScore, matchedSkills     │
└──────────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│                  STAGE 3: SIMULATE ENGAGEMENT                 │
│                                                               │
│  FOR each matched candidate:                                  │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Generate Conversation:                                  │  │
│  │                                                         │  │
│  │ 1. AI Outreach Message (personalized to role + skills) │  │
│  │ 2. Candidate Response (based on availability status)   │  │
│  │ 3. AI Follow-up (address concerns/interests)           │  │
│  │ 4. Candidate Reply (commitment level)                  │  │
│  │                                                         │  │
│  │ Extract Interest Signals from responses:                │  │
│  │ - "excited" → +enthusiasm                               │  │
│  │ - "available" → +availability                           │  │
│  │ - "not sure" → -hesitation                              │  │
│  └────────────────────────────────────────────────────────┘  │
│                      │                                        │
│                      ▼                                        │
│  Output: EngagedCandidate[] with conversations, signals      │
└──────────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│                    STAGE 4: RANK & SCORE                      │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Calculate Interest Score:                               │  │
│  │                                                         │  │
│  │ baseScore = 50                                          │  │
│  │ FOR each signal in interestSignals:                     │  │
│  │   IF positive: baseScore += signalWeight                │  │
│  │   IF negative: baseScore -= signalWeight                │  │
│  │ interestScore = clamp(baseScore, 0, 100)                │  │
│  └────────────────────────────────────────────────────────┘  │
│                      │                                        │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Calculate Combined Score:                               │  │
│  │                                                         │  │
│  │ combinedScore = (matchScore × 0.5) + (interestScore × 0.5)│
│  │                                                         │  │
│  │ Assign Status:                                          │  │
│  │   ≥75 → "Engaged"                                       │  │
│  │   60-74 → "Interested"                                  │  │
│  │   45-59 → "Considering"                                 │  │
│  │   <45 → "Declined"                                      │  │
│  └────────────────────────────────────────────────────────┘  │
│                      │                                        │
│                      ▼                                        │
│  SORT candidates by combinedScore DESC                        │
│  Output: Ranked shortlist ready for recruiter action          │
└──────────────────────────────────────────────────────────────┘
```

---

## Scoring Formulas

### Match Score Calculation (0-100)

```
Match Score = Skill Score + Experience Score + Availability Score

┌─────────────────────────────────────────────────────────────────┐
│ SKILL SCORE (0-70 points)                                       │
├─────────────────────────────────────────────────────────────────┤
│ Formula: (matched_skills_count / required_skills_count) × 70    │
│                                                                 │
│ Example:                                                        │
│   Required: [React, Node, TypeScript, PostgreSQL, AWS, Docker]  │
│   Candidate: [React, Node, TypeScript, PostgreSQL, Python]      │
│   Matched: 4/6 = 66.7% → 46.7 points                           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ EXPERIENCE SCORE (0-20 points)                                  │
├─────────────────────────────────────────────────────────────────┤
│ Years       │ Score │ Level                                     │
│ ────────────┼───────┼────────────────                           │
│ 0-1         │ 5     │ Entry                                     │
│ 2-3         │ 10    │ Junior                                    │
│ 4-5         │ 15    │ Mid                                       │
│ 6-8         │ 18    │ Senior                                    │
│ 9+          │ 20    │ Lead/Principal                            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ AVAILABILITY SCORE (0-10 points)                                │
├─────────────────────────────────────────────────────────────────┤
│ Status                │ Score │ Meaning                         │
│ ──────────────────────┼───────┼──────────────────────────       │
│ Actively Looking      │ 10    │ Ready to interview now          │
│ Open to Opportunities │ 7     │ Will consider good offers       │
│ Passively Looking     │ 4     │ Not searching but persuadable   │
│ Not Looking           │ 1     │ Unlikely to engage              │
└─────────────────────────────────────────────────────────────────┘
```

### Interest Score Calculation (0-100)

```
Interest Score = Base Score (50) + Signal Adjustments

┌─────────────────────────────────────────────────────────────────┐
│ POSITIVE SIGNALS (add points)                                   │
├─────────────────────────────────────────────────────────────────┤
│ Signal                      │ Points │ Example Keywords         │
│ ────────────────────────────┼────────┼─────────────────────     │
│ Enthusiasm                  │ +20    │ "excited", "thrilled"    │
│ Availability Confirmation   │ +15    │ "available", "can start" │
│ Skill Alignment             │ +15    │ "perfect fit", "matches" │
│ Role Questions              │ +10    │ "team size?", "tech?"    │
│ Compensation Discussion     │ +10    │ "salary", "benefits"     │
│ Timeline Flexibility        │ +10    │ "flexible on start"      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ NEGATIVE SIGNALS (subtract points)                              │
├─────────────────────────────────────────────────────────────────┤
│ Signal                      │ Points │ Example Keywords         │
│ ────────────────────────────┼────────┼─────────────────────     │
│ Hesitation                  │ -15    │ "not sure", "maybe"      │
│ Decline                     │ -25    │ "not interested"         │
│ Unavailable                 │ -20    │ "busy", "not right now"  │
└─────────────────────────────────────────────────────────────────┘

Final Score = clamp(baseScore + adjustments, 0, 100)
```

### Combined Score & Status Assignment

```
┌─────────────────────────────────────────────────────────────────┐
│ COMBINED SCORE FORMULA                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Combined Score = (Match Score × 0.5) + (Interest Score × 0.5) │
│                                                                 │
│ Rationale: Equal weighting ensures both fit AND interest matter │
│ - Perfect match + no interest = wasted recruiter time           │
│ - High interest + poor fit = bad hire                           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ STATUS ASSIGNMENT                                               │
├─────────────────────────────────────────────────────────────────┤
│ Combined Score │ Status      │ Recommended Action               │
│ ───────────────┼─────────────┼──────────────────────────        │
│ 75-100         │ Engaged     │ Schedule interview immediately   │
│ 60-74          │ Interested  │ Send detailed role information   │
│ 45-59          │ Considering │ Follow up in 1-2 weeks           │
│ 0-44           │ Declined    │ Archive, try again in 6 months   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Skill Matching Algorithm

```
┌─────────────────────────────────────────────────────────────────┐
│ SKILL ALIAS NORMALIZATION                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Common aliases are normalized to canonical forms:               │
│                                                                 │
│ "js", "javascript", "ecmascript"     → "javascript"             │
│ "ts", "typescript"                   → "typescript"             │
│ "react", "reactjs", "react.js"       → "react"                  │
│ "node", "nodejs", "node.js"          → "node.js"                │
│ "postgres", "postgresql", "pg"       → "postgresql"             │
│ "k8s", "kubernetes"                  → "kubernetes"             │
│ "mongo", "mongodb"                   → "mongodb"                │
│ "aws", "amazon web services"         → "aws"                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

MATCHING PROCESS:
1. Normalize all required skills to lowercase
2. Apply alias mapping to canonical form
3. For each candidate skill:
   a. Normalize to lowercase
   b. Apply alias mapping
   c. Check exact match OR substring containment
4. Return intersection of matched skills
5. Calculate skill gaps (required - matched)
```

---

## File Responsibilities

| File | Purpose |
|------|---------|
| `app/page.tsx` | Main state management, pipeline orchestration |
| `components/job-description-input.tsx` | JD input UI, 4 template buttons |
| `components/progress-indicator.tsx` | Visual 4-stage progress tracker |
| `components/parsed-jd-display.tsx` | Shows extracted requirements |
| `components/candidate-card.tsx` | Individual candidate display |
| `components/ranked-results.tsx` | Final shortlist with conversations |
| `lib/types.ts` | TypeScript interfaces |
| `lib/mock-candidates.ts` | 12 simulated candidate profiles |
| `lib/mock-scouting.ts` | Core parsing, matching, engagement logic |

---

## Future Enhancements

| Current | Future |
|---------|--------|
| Mock candidate database | LinkedIn/GitHub API integration |
| Template-based conversations | LLM-powered dynamic outreach |
| Substring skill matching | Embedding-based semantic matching |
| No persistence | Database storage for saved searches |
| Single user | Multi-user with role-based access |
| Fixed 50/50 weighting | Configurable score weights |
