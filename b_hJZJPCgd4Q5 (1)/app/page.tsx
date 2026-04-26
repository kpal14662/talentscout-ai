'use client'

import { useState, useCallback } from 'react'
import { JobDescriptionInput } from '@/components/job-description-input'
import { ParsedJDDisplay } from '@/components/parsed-jd-display'
import { ProgressIndicator } from '@/components/progress-indicator'
import { CandidateCard } from '@/components/candidate-card'
import { RankedResults } from '@/components/ranked-results'
import { Card, CardContent } from '@/components/ui/card'
import { Sparkles, Zap, Target, MessageSquare } from 'lucide-react'
import { parseJobDescription, matchCandidates, engageCandidates } from '@/lib/mock-scouting'
import type { ScoutingState } from '@/lib/types'

const initialState: ScoutingState = {
  stage: 'input',
  parsedJD: null,
  matchedCandidates: [],
  engagedCandidates: [],
  currentCandidateIndex: 0,
  error: null
}

export default function TalentScoutPage() {
  const [state, setState] = useState<ScoutingState>(initialState)

  const handleSubmit = useCallback(async (jobDescription: string) => {
    try {
      // Stage 1: Parsing
      setState(prev => ({ ...prev, stage: 'parsing', error: null }))
      const parsedJD = await parseJobDescription(jobDescription)
      setState(prev => ({ ...prev, parsedJD }))

      // Stage 2: Discovering
      setState(prev => ({ ...prev, stage: 'discovering' }))
      const matchedCandidates = await matchCandidates(parsedJD)
      setState(prev => ({ ...prev, matchedCandidates }))

      // Stage 3: Engaging
      setState(prev => ({ ...prev, stage: 'engaging' }))
      const engagedCandidates = await engageCandidates(matchedCandidates, parsedJD)
      setState(prev => ({ ...prev, engagedCandidates }))

      // Stage 4: Complete
      setState(prev => ({ ...prev, stage: 'complete' }))
    } catch (error) {
      console.error('Scouting error:', error)
      setState(prev => ({ 
        ...prev, 
        error: 'An error occurred during scouting. Please try again.',
        stage: 'input'
      }))
    }
  }, [])

  const handleReset = useCallback(() => {
    setState(initialState)
  }, [])

  const isProcessing = state.stage !== 'input' && state.stage !== 'complete'

  return (
    <main className="min-h-screen">
      <header className="border-b bg-card/50 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-xl">TalentScout AI</h1>
                <p className="text-xs text-muted-foreground">Intelligent Recruitment Agent</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {state.stage === 'input' ? (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-balance">
                Find Top Talent in Minutes,{' '}
                <span className="text-primary">Not Hours</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                Our AI agent parses your job description, discovers matching candidates,
                and simulates outreach to gauge genuine interest.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">Smart Matching</h3>
                  <p className="text-sm text-muted-foreground">AI-powered skill matching with explainable scores</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                    <MessageSquare className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-semibold mb-1">Interest Assessment</h3>
                  <p className="text-sm text-muted-foreground">Simulated outreach reveals genuine interest</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">Instant Shortlist</h3>
                  <p className="text-sm text-muted-foreground">Ranked candidates ready for immediate action</p>
                </CardContent>
              </Card>
            </div>

            {state.error && (
              <Card className="border-destructive bg-destructive/5">
                <CardContent className="py-4">
                  <p className="text-destructive text-center">{state.error}</p>
                </CardContent>
              </Card>
            )}

            <JobDescriptionInput onSubmit={handleSubmit} isLoading={isProcessing} />
          </div>
        ) : (
          <div className="max-w-6xl mx-auto space-y-8">
            <ProgressIndicator state={state} />

            {state.parsedJD && state.stage !== 'complete' && (
              <ParsedJDDisplay parsedJD={state.parsedJD} />
            )}

            {state.stage === 'discovering' && (
              <Card>
                <CardContent className="py-12 text-center">
                  <div className="animate-pulse space-y-4">
                    <div className="h-8 w-8 rounded-full bg-primary/20 mx-auto flex items-center justify-center">
                      <Target className="h-4 w-4 text-primary animate-spin" />
                    </div>
                    <div>
                      <p className="font-medium">Discovering matching candidates...</p>
                      <p className="text-sm text-muted-foreground">Analyzing skills, experience, and potential fit</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {state.stage === 'engaging' && state.matchedCandidates.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Top Matches Found</h3>
                  <p className="text-sm text-muted-foreground">Now engaging candidates...</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {state.matchedCandidates.slice(0, 3).map((candidate) => (
                    <CandidateCard key={candidate.id} candidate={candidate} />
                  ))}
                </div>
                <Card>
                  <CardContent className="py-8 text-center">
                    <div className="animate-pulse space-y-4">
                      <div className="h-8 w-8 rounded-full bg-accent/20 mx-auto flex items-center justify-center">
                        <MessageSquare className="h-4 w-4 text-accent animate-bounce" />
                      </div>
                      <div>
                        <p className="font-medium">Simulating outreach conversations...</p>
                        <p className="text-sm text-muted-foreground">Assessing genuine interest levels</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {state.stage === 'complete' && state.engagedCandidates.length > 0 && (
              <RankedResults candidates={state.engagedCandidates} onReset={handleReset} />
            )}
          </div>
        )}
      </div>
    </main>
  )
}
