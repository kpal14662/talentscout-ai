# TalentScout AI - Intelligent Recruitment Agent

An AI-powered talent scouting and engagement platform that automates candidate discovery, matching, and outreach simulation for modern recruiters.

---

## Live Demo

**Deployed URL:** [Click "Publish" in v0 to deploy, then paste your URL here]

**Preview:** Use the v0 preview panel to test the application immediately.

---

## Local Setup Instructions

### Prerequisites

- Node.js 18.17 or later
- pnpm 8+ (recommended) or npm 9+

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/talentscout-ai.git

# 2. Navigate to project directory
cd talentscout-ai

# 3. Install dependencies
pnpm install

# 4. Start the development server
pnpm dev

# 5. Open in browser
# Navigate to http://localhost:3000
```

### Production Build

```bash
# Build optimized production bundle
pnpm build

# Start production server
pnpm start
```

### Deploy to Vercel

```bash
# Option 1: One-click deploy from v0
# Click the "Publish" button in the v0 interface

# Option 2: CLI deployment
npx vercel

# Option 3: GitHub integration
# Push to GitHub, then import at vercel.com/new
```

---

## Project Structure

```
talentscout-ai/
├── app/
│   ├── page.tsx                    # Main application entry point
│   ├── layout.tsx                  # Root layout with metadata
│   └── globals.css                 # Design tokens (Tailwind v4)
│
├── components/
│   ├── job-description-input.tsx   # JD textarea + 4 template buttons
│   ├── parsed-jd-display.tsx       # Visualizes extracted requirements
│   ├── progress-indicator.tsx      # 4-stage pipeline progress
│   ├── candidate-card.tsx          # Individual candidate display
│   └── ranked-results.tsx          # Final shortlist with conversations
│
├── lib/
│   ├── types.ts                    # TypeScript interfaces
│   ├── mock-candidates.ts          # 12 simulated candidate profiles
│   └── mock-scouting.ts            # Core matching & scoring logic
│
├── docs/
│   ├── ARCHITECTURE.md             # System design & scoring formulas
│   ├── SAMPLES.md                  # Example inputs/outputs
│   └── WRITEUP.md                  # Approach & trade-offs
│
└── README.md                       # This file
```

---

## Features

| Feature | Description |
|---------|-------------|
| **JD Parsing** | Extracts title, skills, experience level, and keywords from free-text job descriptions |
| **4 JD Templates** | Pre-built templates for Full Stack, Data, Security, and Mobile roles |
| **Candidate Discovery** | Matches candidates against parsed requirements with skill-gap analysis |
| **Engagement Simulation** | Generates realistic outreach conversations based on candidate availability |
| **Dual Scoring** | Match Score (skills fit) + Interest Score (engagement level) |
| **Explainability** | Every score includes matched skills, gaps, and interest signals |
| **Conversation Transcripts** | Full simulated outreach history for each candidate |

---

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js (App Router) | 15.x |
| UI Library | React | 19.x |
| Styling | Tailwind CSS | 4.x |
| Components | shadcn/ui | Latest |
| Icons | Lucide React | Latest |
| Language | TypeScript | 5.x |

---

## How It Works

### Pipeline Stages

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   STAGE 1   │    │   STAGE 2   │    │   STAGE 3   │    │   STAGE 4   │
│  Parse JD   │───▶│  Discover   │───▶│   Engage    │───▶│    Rank     │
│             │    │  Candidates │    │  Simulate   │    │   Output    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

### Scoring System

**Match Score (0-100):** How well does the candidate fit the role?
- Skill overlap: 70 points max
- Experience level: 20 points max
- Availability status: 10 points max

**Interest Score (0-100):** How engaged is the candidate?
- Based on simulated conversation outcomes
- Positive signals (enthusiasm, questions) add points
- Negative signals (hesitation, decline) subtract points

**Combined Score:** `(Match × 0.5) + (Interest × 0.5)`

**Status Assignment:**
| Score Range | Status | Action |
|-------------|--------|--------|
| 75-100 | Engaged | Schedule interview |
| 60-74 | Interested | Send details |
| 45-59 | Considering | Follow up later |
| 0-44 | Declined | Archive |

---

## Documentation

- **[Architecture & Scoring Logic](./docs/ARCHITECTURE.md)** - System diagrams, data flow, scoring formulas
- **[Sample Inputs/Outputs](./docs/SAMPLES.md)** - Real examples with expected results
- **[Approach & Trade-offs](./docs/WRITEUP.md)** - Design decisions and future enhancements

---

## Usage

1. **Select or Enter JD** - Click a template button (Full Stack, Data, Security, Mobile) or paste your own job description
2. **Start Scouting** - Click "Start AI Scouting" to begin the 4-stage pipeline
3. **Review Progress** - Watch each stage complete with visual feedback
4. **Analyze Results** - Review ranked candidates with scores, skill matches, and conversation transcripts
5. **Take Action** - Use status indicators to prioritize outreach

---

## API Reference (For Extension)

The core logic is in `lib/mock-scouting.ts`:

```typescript
// Parse job description into structured format
parseJobDescription(jd: string): ParsedJD

// Find matching candidates from pool
discoverCandidates(parsedJD: ParsedJD): CandidateMatch[]

// Simulate outreach for each candidate
simulateEngagement(candidates: CandidateMatch[], parsedJD: ParsedJD): EngagedCandidate[]
```

---

## Future Roadmap

- [ ] Real LLM integration for JD parsing (OpenAI/Anthropic)
- [ ] LinkedIn API for live candidate discovery
- [ ] Email integration for actual outreach
- [ ] Recruiter feedback loop for ML improvement
- [ ] Configurable score weighting
- [ ] Multi-user support with saved searches

---

## License

MIT License - see [LICENSE](./LICENSE) for details.

---

