'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { 
  Trophy, Download, RefreshCw, TrendingUp, Users, ThumbsUp,
  MapPin, Building, Clock, DollarSign, CheckCircle, XCircle,
  Bot, User, MessageCircle, ChevronDown, ChevronUp
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { EngagedCandidate } from '@/lib/types'

interface RankedResultsProps {
  candidates: EngagedCandidate[]
  onReset: () => void
}

const availabilityLabels = {
  immediate: 'Available Immediately',
  'two-weeks': '2 Weeks Notice',
  'one-month': '1 Month Notice',
  passive: 'Passive Candidate'
}

const statusColors = {
  engaged: 'bg-accent text-accent-foreground',
  interested: 'bg-primary text-primary-foreground',
  considering: 'bg-secondary text-secondary-foreground',
  declined: 'bg-destructive text-destructive-foreground'
}

function CandidateWithConversation({ 
  candidate, 
  rank,
  isExpanded,
  onToggle
}: { 
  candidate: EngagedCandidate
  rank: number
  isExpanded: boolean
  onToggle: () => void
}) {
  return (
    <Card className={cn(
      'transition-all duration-200',
      candidate.status === 'engaged' && 'ring-2 ring-accent',
      candidate.status === 'declined' && 'opacity-70'
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold',
              rank === 1 && 'bg-accent text-accent-foreground',
              rank === 2 && 'bg-primary/80 text-primary-foreground',
              rank === 3 && 'bg-primary/60 text-primary-foreground',
              rank > 3 && 'bg-secondary text-secondary-foreground'
            )}>
              #{rank}
            </div>
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {candidate.avatar}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{candidate.name}</h3>
              <p className="text-sm text-muted-foreground">{candidate.title}</p>
            </div>
          </div>
          <Badge className={cn('capitalize', statusColors[candidate.status])}>
            {candidate.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Candidate Info */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building className="h-4 w-4" />
            <span>{candidate.company}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{candidate.location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{availabilityLabels[candidate.availability]}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            <span className="truncate">{candidate.salaryExpectation}</span>
          </div>
        </div>

        {/* Scores */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Match</span>
              <span className="font-semibold text-primary">{candidate.matchScore}%</span>
            </div>
            <Progress value={candidate.matchScore} className="h-2" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Interest</span>
              <span className="font-semibold text-accent">{candidate.interestScore}%</span>
            </div>
            <Progress value={candidate.interestScore} className="h-2 [&>[role=progressbar]]:bg-accent" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Combined</span>
              <span className="font-bold">{candidate.combinedScore}%</span>
            </div>
            <Progress value={candidate.combinedScore} className="h-2.5 [&>[role=progressbar]]:bg-gradient-to-r [&>[role=progressbar]]:from-primary [&>[role=progressbar]]:to-accent" />
          </div>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5">
          {candidate.skillMatches.slice(0, 4).map((skill, i) => (
            <Badge key={i} variant="outline" className="gap-1 text-xs bg-accent/10 text-accent border-accent/30">
              <CheckCircle className="h-3 w-3" />
              {skill}
            </Badge>
          ))}
          {candidate.skillGaps.slice(0, 2).map((skill, i) => (
            <Badge key={i} variant="outline" className="gap-1 text-xs text-muted-foreground">
              <XCircle className="h-3 w-3" />
              {skill}
            </Badge>
          ))}
        </div>

        {/* Conversation Toggle */}
        <Button 
          variant="outline" 
          className="w-full gap-2" 
          onClick={onToggle}
        >
          <MessageCircle className="h-4 w-4" />
          {isExpanded ? 'Hide Conversation' : 'View Conversation'}
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>

        {/* Conversation */}
        {isExpanded && (
          <div className="space-y-3 rounded-lg bg-muted/30 p-4 border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground pb-2 border-b">
              <MessageCircle className="h-4 w-4" />
              <span>Simulated Outreach Conversation</span>
            </div>
            
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {candidate.conversation.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex gap-2',
                    message.role === 'agent' ? 'justify-start' : 'justify-end'
                  )}
                >
                  {message.role === 'agent' && (
                    <Avatar className="h-7 w-7 shrink-0">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        <Bot className="h-3.5 w-3.5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'max-w-[85%] rounded-xl px-3 py-2 text-sm',
                      message.role === 'agent'
                        ? 'bg-card border text-card-foreground rounded-tl-sm'
                        : 'bg-primary text-primary-foreground rounded-tr-sm'
                    )}
                  >
                    {message.content}
                  </div>
                  {message.role === 'candidate' && (
                    <Avatar className="h-7 w-7 shrink-0">
                      <AvatarFallback className="bg-accent/20 text-accent text-xs">
                        <User className="h-3.5 w-3.5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>

            {/* Interest Signals */}
            {candidate.interestSignals.length > 0 && (
              <div className="pt-3 border-t space-y-2">
                <p className="text-sm font-medium">Interest Signals</p>
                <ul className="list-inside list-disc text-sm text-muted-foreground space-y-1">
                  {candidate.interestSignals.map((signal, i) => (
                    <li key={i}>{signal}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function RankedResults({ candidates, onReset }: RankedResultsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(candidates[0]?.id || null)

  const engaged = candidates.filter(c => c.status === 'engaged').length
  const interested = candidates.filter(c => c.status === 'interested').length
  const avgMatch = Math.round(candidates.reduce((acc, c) => acc + c.matchScore, 0) / candidates.length)
  const avgInterest = Math.round(candidates.reduce((acc, c) => acc + c.interestScore, 0) / candidates.length)

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Trophy className="h-6 w-6 text-accent" />
              Ranked Shortlist
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={onReset}>
                <RefreshCw className="h-4 w-4" />
                New Search
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-lg bg-card p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
                <Users className="h-4 w-4" />
                <span className="text-sm">Total Candidates</span>
              </div>
              <p className="text-3xl font-bold">{candidates.length}</p>
            </div>
            <div className="rounded-lg bg-card p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
                <ThumbsUp className="h-4 w-4" />
                <span className="text-sm">Engaged</span>
              </div>
              <p className="text-3xl font-bold text-accent">{engaged}</p>
            </div>
            <div className="rounded-lg bg-card p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">Avg Match</span>
              </div>
              <p className="text-3xl font-bold text-primary">{avgMatch}%</p>
            </div>
            <div className="rounded-lg bg-card p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">Avg Interest</span>
              </div>
              <p className="text-3xl font-bold text-accent">{avgInterest}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm text-muted-foreground">Filter:</span>
        <Badge variant="outline" className="cursor-pointer hover:bg-secondary">All ({candidates.length})</Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-accent/20 border-accent/30 text-accent">Engaged ({engaged})</Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-primary/20 border-primary/30 text-primary">Interested ({interested})</Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {candidates.map((candidate, index) => (
          <CandidateWithConversation
            key={candidate.id}
            candidate={candidate}
            rank={index + 1}
            isExpanded={expandedId === candidate.id}
            onToggle={() => setExpandedId(expandedId === candidate.id ? null : candidate.id)}
          />
        ))}
      </div>
    </div>
  )
}
