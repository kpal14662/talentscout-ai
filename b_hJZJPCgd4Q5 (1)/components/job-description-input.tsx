'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Sparkles, FileText, Code, Database, Shield, Smartphone } from 'lucide-react'

const exampleJDs = [
  {
    id: 'fullstack',
    label: 'Full Stack Engineer',
    icon: Code,
    jd: `Senior Full Stack Engineer

About the Role:
We are looking for a Senior Full Stack Engineer to join our Platform team. You will be responsible for building and scaling our core product infrastructure, working across the entire stack from React frontends to distributed backend services.

Requirements:
- 5+ years of software engineering experience
- Strong proficiency in React, TypeScript, and Node.js
- Experience with cloud services (AWS preferred)
- Understanding of system design and distributed systems
- Experience with PostgreSQL or similar relational databases
- Excellent communication and collaboration skills

Nice to have:
- Experience with GraphQL
- Kubernetes and containerization
- Previous startup experience
- Open source contributions

Responsibilities:
- Design and implement new features across our web platform
- Lead technical discussions and code reviews
- Mentor junior engineers
- Collaborate with product and design teams
- Improve system reliability and performance`
  },
  {
    id: 'data',
    label: 'Data Engineer',
    icon: Database,
    jd: `Data Engineer - Analytics Platform

About Us:
Join our data team to build the next generation of analytics infrastructure. We process petabytes of data daily and need engineers who can design scalable data pipelines.

Requirements:
- 4+ years experience in data engineering
- Expert knowledge of Python and SQL
- Experience with Spark, Airflow, or similar tools
- Strong understanding of data modeling and warehousing
- Experience with AWS or GCP data services
- Knowledge of ETL best practices

Nice to have:
- Experience with Kafka or streaming systems
- dbt for data transformations
- Machine learning pipeline experience
- Data governance and quality frameworks

Responsibilities:
- Design and build robust data pipelines
- Optimize data warehouse performance
- Collaborate with data scientists and analysts
- Implement data quality monitoring
- Document data architecture decisions`
  },
  {
    id: 'security',
    label: 'Security Engineer',
    icon: Shield,
    jd: `Senior Security Engineer

About the Role:
We're building a world-class security team and need an experienced engineer to help protect our infrastructure and customer data. You'll work on everything from application security to cloud infrastructure.

Requirements:
- 5+ years in security engineering or related field
- Deep knowledge of cloud security (AWS, GCP, or Azure)
- Experience with penetration testing and vulnerability assessment
- Strong programming skills in Python or Go
- Understanding of compliance frameworks (SOC2, GDPR, etc.)
- Network security and monitoring experience

Nice to have:
- Security certifications (CISSP, CEH, OSCP)
- Bug bounty program experience
- Incident response background
- Security automation and tooling experience

Responsibilities:
- Conduct security assessments and penetration testing
- Design and implement security controls
- Respond to security incidents
- Build security automation tools
- Train engineering teams on security best practices`
  },
  {
    id: 'mobile',
    label: 'Mobile Developer',
    icon: Smartphone,
    jd: `Senior Mobile Developer (iOS/Android)

About the Role:
We're looking for a mobile expert to lead development of our consumer app used by millions. You'll work on both iOS and Android platforms, focusing on performance and user experience.

Requirements:
- 4+ years of mobile development experience
- Proficiency in Swift for iOS or Kotlin for Android
- Experience with React Native or Flutter for cross-platform
- Understanding of mobile architecture patterns (MVVM, Clean Architecture)
- Experience with mobile CI/CD pipelines
- Strong focus on performance optimization

Nice to have:
- Published apps with 100k+ downloads
- Experience with mobile analytics
- Knowledge of mobile security best practices
- Animation and gesture handling expertise

Responsibilities:
- Lead mobile app development
- Improve app performance and stability
- Implement new features and UI components
- Collaborate with design team on UX
- Mentor junior mobile developers`
  }
]

interface JobDescriptionInputProps {
  onSubmit: (jd: string) => void
  isLoading: boolean
}

export function JobDescriptionInput({ onSubmit, isLoading }: JobDescriptionInputProps) {
  const [jobDescription, setJobDescription] = useState('')

  const handleSubmit = () => {
    if (jobDescription.trim()) {
      onSubmit(jobDescription)
    }
  }

  const loadExample = (jd: string) => {
    setJobDescription(jd)
  }

  return (
    <Card className="border-2 border-dashed border-primary/20 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <FileText className="h-6 w-6 text-primary" />
          Job Description
        </CardTitle>
        <CardDescription className="text-base">
          Paste your job description below or select from example templates.
          Our AI will parse it, find matching candidates, and engage them to assess genuine interest.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Paste your job description here..."
          className="min-h-[300px] resize-none text-base leading-relaxed"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
        
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground font-medium">Quick templates:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {exampleJDs.map((example) => {
              const Icon = example.icon
              return (
                <Button
                  key={example.id}
                  variant="outline"
                  size="sm"
                  onClick={() => loadExample(example.jd)}
                  disabled={isLoading}
                  className="flex items-center gap-2 h-auto py-2.5"
                >
                  <Icon className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-xs">{example.label}</span>
                </Button>
              )
            })}
          </div>
        </div>

        <div className="flex items-center justify-end pt-2">
          <Button
            onClick={handleSubmit}
            disabled={!jobDescription.trim() || isLoading}
            size="lg"
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" />
            {isLoading ? 'Processing...' : 'Start AI Scouting'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
