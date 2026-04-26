import { mockCandidates } from './mock-candidates'
import type { ParsedJD, MatchedCandidate, EngagedCandidate, ConversationMessage } from './types'

// Helper to simulate delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Extract skills from job description text
function extractSkillsFromText(text: string): string[] {
  const commonSkills = [
    'React', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'Java', 'Go', 'Rust',
    'AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes', 'PostgreSQL', 'MongoDB', 'Redis',
    'GraphQL', 'REST', 'SQL', 'NoSQL', 'Git', 'CI/CD', 'Terraform', 'Linux',
    'Machine Learning', 'AI', 'Data Science', 'Analytics', 'ETL', 'Spark',
    'System Design', 'Microservices', 'Distributed Systems', 'API Design',
    'Agile', 'Scrum', 'Leadership', 'Mentoring', 'Communication',
    'Ruby', 'Rails', 'Django', 'Flask', 'Spring', 'Next.js', 'Vue', 'Angular',
    'Kafka', 'RabbitMQ', 'Elasticsearch', 'Security', 'DevOps', 'SRE',
    'iOS', 'Android', 'Mobile', 'Swift', 'Kotlin', 'Flutter', 'React Native'
  ]
  
  const textLower = text.toLowerCase()
  return commonSkills.filter(skill => 
    textLower.includes(skill.toLowerCase())
  )
}

// Parse job description client-side
export async function parseJobDescription(jobDescription: string): Promise<ParsedJD> {
  await delay(1500) // Simulate processing time
  
  const lines = jobDescription.split('\n').map(l => l.trim()).filter(Boolean)
  const title = lines[0] || 'Software Engineer'
  
  const textLower = jobDescription.toLowerCase()
  
  // Determine experience level
  let experienceLevel = 'Mid-Level'
  if (textLower.includes('senior') || textLower.includes('staff') || textLower.includes('lead')) {
    experienceLevel = 'Senior'
  } else if (textLower.includes('junior') || textLower.includes('entry') || textLower.includes('graduate')) {
    experienceLevel = 'Junior'
  } else if (textLower.includes('principal') || textLower.includes('director') || textLower.includes('architect')) {
    experienceLevel = 'Principal/Director'
  }
  
  // Determine department
  let department = 'Engineering'
  if (textLower.includes('data') || textLower.includes('analytics')) department = 'Data'
  else if (textLower.includes('devops') || textLower.includes('infrastructure') || textLower.includes('platform')) department = 'Platform/Infrastructure'
  else if (textLower.includes('security')) department = 'Security'
  else if (textLower.includes('mobile')) department = 'Mobile'
  else if (textLower.includes('frontend') || textLower.includes('front-end')) department = 'Frontend'
  else if (textLower.includes('backend') || textLower.includes('back-end')) department = 'Backend'
  else if (textLower.includes('machine learning') || textLower.includes('ml') || textLower.includes('ai')) department = 'Machine Learning'
  
  const allSkills = extractSkillsFromText(jobDescription)
  const requiredSkills = allSkills.slice(0, Math.min(6, allSkills.length))
  const preferredSkills = allSkills.slice(6, 10)
  
  // Extract responsibilities
  const responsibilities: string[] = []
  const respSection = jobDescription.match(/responsibilities[:\s]*([\s\S]*?)(?=requirements|qualifications|nice to have|benefits|$)/i)
  if (respSection) {
    const respLines = respSection[1].split('\n').filter(l => l.trim().startsWith('-') || l.trim().startsWith('•'))
    responsibilities.push(...respLines.slice(0, 5).map(l => l.replace(/^[-•]\s*/, '').trim()))
  }
  if (responsibilities.length === 0) {
    responsibilities.push('Design and implement software solutions', 'Collaborate with cross-functional teams', 'Write clean, maintainable code')
  }
  
  // Extract keywords
  const keywords = [...requiredSkills.slice(0, 3), experienceLevel, department].filter(Boolean)
  
  return {
    title,
    department,
    experienceLevel,
    requiredSkills,
    preferredSkills,
    responsibilities,
    keywords
  }
}

// Match candidates against parsed JD
export async function matchCandidates(parsedJD: ParsedJD): Promise<MatchedCandidate[]> {
  await delay(2000) // Simulate processing time
  
  const allRequiredSkills = [...parsedJD.requiredSkills, ...parsedJD.preferredSkills].map(s => s.toLowerCase())
  
  const matched: MatchedCandidate[] = mockCandidates.map(candidate => {
    const candidateSkillsLower = candidate.skills.map(s => s.toLowerCase())
    
    const skillMatches = candidate.skills.filter(skill => 
      allRequiredSkills.some(req => 
        skill.toLowerCase().includes(req) || req.includes(skill.toLowerCase())
      )
    )
    
    const skillGaps = parsedJD.requiredSkills.filter(skill =>
      !candidateSkillsLower.some(cs => 
        cs.includes(skill.toLowerCase()) || skill.toLowerCase().includes(cs)
      )
    )
    
    // Calculate match score
    const skillMatchRatio = skillMatches.length / Math.max(allRequiredSkills.length, 1)
    const experienceBonus = candidate.experience >= 5 ? 0.1 : candidate.experience >= 3 ? 0.05 : 0
    const matchScore = Math.min(100, Math.round((skillMatchRatio * 80 + experienceBonus * 100 + 10) * (0.9 + Math.random() * 0.2)))
    
    // Generate match reasons
    const matchReasons: string[] = []
    if (skillMatches.length >= 3) matchReasons.push(`Strong skill alignment with ${skillMatches.length} matching skills`)
    if (candidate.experience >= 5) matchReasons.push(`${candidate.experience} years of relevant experience`)
    if (skillMatches.some(s => s.toLowerCase().includes('system design') || s.toLowerCase().includes('architecture'))) {
      matchReasons.push('Architecture and system design expertise')
    }
    if (candidate.availability === 'immediate' || candidate.availability === 'two-weeks') {
      matchReasons.push('Available to start soon')
    }
    if (matchReasons.length === 0) matchReasons.push('Solid technical background')
    
    return {
      ...candidate,
      matchScore,
      matchReasons,
      skillMatches,
      skillGaps
    }
  })
  
  // Sort by match score and return top candidates
  return matched
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 6)
}

// Generate conversation based on candidate
function generateConversation(candidate: MatchedCandidate, parsedJD: ParsedJD): ConversationMessage[] {
  const messages: ConversationMessage[] = []
  const now = new Date()
  
  // Agent outreach
  messages.push({
    role: 'agent',
    content: `Hi ${candidate.name.split(' ')[0]}! I came across your profile and was impressed by your experience at ${candidate.company}. We have an exciting ${parsedJD.title} opportunity that seems like a great fit for your background in ${candidate.skillMatches.slice(0, 2).join(' and ')}. Would you be interested in learning more?`,
    timestamp: new Date(now.getTime() - 3600000)
  })
  
  // Candidate response based on availability
  if (candidate.availability === 'passive') {
    messages.push({
      role: 'candidate',
      content: `Thanks for reaching out! I'm quite happy in my current role at ${candidate.company}, but I'm always open to hearing about interesting opportunities. What makes this role unique?`,
      timestamp: new Date(now.getTime() - 3000000)
    })
    messages.push({
      role: 'agent',
      content: `Great question! This role offers the chance to ${parsedJD.responsibilities[0]?.toLowerCase() || 'work on impactful projects'}. The team is working on cutting-edge technology and there's significant growth potential. The compensation is also very competitive.`,
      timestamp: new Date(now.getTime() - 2400000)
    })
    messages.push({
      role: 'candidate',
      content: `That does sound interesting. I'd need to think about it carefully given I'm not actively looking. Could you share more details about the team size and tech stack? My current expectation would be around ${candidate.salaryExpectation}.`,
      timestamp: new Date(now.getTime() - 1800000)
    })
  } else if (candidate.availability === 'immediate') {
    messages.push({
      role: 'candidate',
      content: `Hi! Thank you so much for reaching out. I'm actually actively looking for new opportunities right now and this sounds really interesting! I'd love to learn more about the role and team.`,
      timestamp: new Date(now.getTime() - 3000000)
    })
    messages.push({
      role: 'agent',
      content: `That's great to hear! The team is focused on ${parsedJD.responsibilities[0]?.toLowerCase() || 'building innovative solutions'}. Given your experience with ${candidate.skillMatches[0] || 'relevant technologies'}, you'd be a valuable addition. What's your availability for an initial conversation?`,
      timestamp: new Date(now.getTime() - 2400000)
    })
    messages.push({
      role: 'candidate',
      content: `I'm very flexible and can make time this week. I'm excited about the opportunity to work with ${parsedJD.requiredSkills.slice(0, 2).join(' and ')}. My salary expectation is ${candidate.salaryExpectation} - is that within range?`,
      timestamp: new Date(now.getTime() - 1800000)
    })
  } else {
    messages.push({
      role: 'candidate',
      content: `Hi, thanks for the message! I've been considering making a move and this caught my attention. Can you tell me more about the company culture and what the day-to-day looks like?`,
      timestamp: new Date(now.getTime() - 3000000)
    })
    messages.push({
      role: 'agent',
      content: `Of course! The culture is collaborative and engineering-driven. You'd be ${parsedJD.responsibilities[0]?.toLowerCase() || 'working on challenging problems'}. The team values work-life balance and continuous learning. Would you be open to an exploratory call?`,
      timestamp: new Date(now.getTime() - 2400000)
    })
    messages.push({
      role: 'candidate',
      content: `Yes, I'd be interested in learning more. I'm available in about ${candidate.availability === 'two-weeks' ? 'two weeks' : 'a month'} if things progress. Let me know what the next steps would be.`,
      timestamp: new Date(now.getTime() - 1800000)
    })
  }
  
  return messages
}

// Engage candidates and assess interest
export async function engageCandidates(
  candidates: MatchedCandidate[],
  parsedJD: ParsedJD
): Promise<EngagedCandidate[]> {
  await delay(2500) // Simulate engagement time
  
  return candidates.map(candidate => {
    const conversation = generateConversation(candidate, parsedJD)
    
    // Calculate interest score based on availability and responses
    let baseInterest: number
    switch (candidate.availability) {
      case 'immediate':
        baseInterest = 85 + Math.random() * 15
        break
      case 'two-weeks':
        baseInterest = 70 + Math.random() * 20
        break
      case 'one-month':
        baseInterest = 55 + Math.random() * 25
        break
      case 'passive':
        baseInterest = 35 + Math.random() * 30
        break
      default:
        baseInterest = 50 + Math.random() * 30
    }
    
    const interestScore = Math.round(baseInterest)
    
    // Generate interest signals
    const interestSignals: string[] = []
    if (interestScore >= 80) {
      interestSignals.push('Actively seeking new opportunities')
      interestSignals.push('Enthusiastic about the role')
      interestSignals.push('Flexible on start date')
    } else if (interestScore >= 60) {
      interestSignals.push('Open to exploring opportunities')
      interestSignals.push('Interested in company mission')
    } else if (interestScore >= 40) {
      interestSignals.push('Cautiously interested')
      interestSignals.push('Wants more information')
    } else {
      interestSignals.push('Not actively looking')
      interestSignals.push('May require compelling offer')
    }
    
    // Determine status
    let status: EngagedCandidate['status']
    if (interestScore >= 80) status = 'engaged'
    else if (interestScore >= 60) status = 'interested'
    else if (interestScore >= 40) status = 'considering'
    else status = 'declined'
    
    // Calculate combined score (50% match + 50% interest)
    const combinedScore = Math.round((candidate.matchScore + interestScore) / 2)
    
    return {
      ...candidate,
      interestScore,
      interestSignals,
      conversation,
      combinedScore,
      status
    }
  }).sort((a, b) => b.combinedScore - a.combinedScore)
}
