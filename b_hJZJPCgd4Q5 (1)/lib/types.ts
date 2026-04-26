export interface ParsedJD {
  title: string
  department: string
  experienceLevel: string
  requiredSkills: string[]
  preferredSkills: string[]
  responsibilities: string[]
  keywords: string[]
}

export interface Candidate {
  id: string
  name: string
  title: string
  company: string
  location: string
  avatar: string
  skills: string[]
  experience: number
  education: string
  summary: string
  availability: 'immediate' | 'two-weeks' | 'one-month' | 'passive'
  salaryExpectation: string
}

export interface MatchedCandidate extends Candidate {
  matchScore: number
  matchReasons: string[]
  skillMatches: string[]
  skillGaps: string[]
}

export interface ConversationMessage {
  role: 'agent' | 'candidate'
  content: string
  timestamp: Date
}

export interface EngagedCandidate extends MatchedCandidate {
  interestScore: number
  interestSignals: string[]
  conversation: ConversationMessage[]
  combinedScore: number
  status: 'engaged' | 'interested' | 'considering' | 'declined'
}

export interface ScoutingState {
  stage: 'input' | 'parsing' | 'discovering' | 'engaging' | 'ranking' | 'complete'
  parsedJD: ParsedJD | null
  matchedCandidates: MatchedCandidate[]
  engagedCandidates: EngagedCandidate[]
  currentCandidateIndex: number
  error: string | null
}
