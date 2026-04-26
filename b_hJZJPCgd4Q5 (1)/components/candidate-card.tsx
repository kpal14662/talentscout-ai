'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { MapPin, Building, GraduationCap, Clock, DollarSign, CheckCircle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MatchedCandidate, EngagedCandidate } from '@/lib/types'

interface CandidateCardProps {
  candidate: MatchedCandidate | EngagedCandidate
  rank?: number
  showEngagement?: boolean
  onClick?: () => void
}

function isEngagedCandidate(candidate: MatchedCandidate | EngagedCandidate): candidate is EngagedCandidate {
  return 'interestScore' in candidate
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

export function CandidateCard({ candidate, rank, showEngagement, onClick }: CandidateCardProps) {
  const engaged = isEngagedCandidate(candidate)

  return (
    <Card 
      className={cn(
        'transition-all duration-200 hover:shadow-lg cursor-pointer',
        engaged && candidate.status === 'engaged' && 'ring-2 ring-accent',
        engaged && candidate.status === 'declined' && 'opacity-60'
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {rank && (
              <div className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold',
                rank === 1 && 'bg-accent text-accent-foreground',
                rank === 2 && 'bg-primary/80 text-primary-foreground',
                rank === 3 && 'bg-primary/60 text-primary-foreground',
                rank > 3 && 'bg-secondary text-secondary-foreground'
              )}>
                #{rank}
              </div>
            )}
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
          {engaged && (
            <Badge className={cn('capitalize', statusColors[candidate.status])}>
              {candidate.status}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
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

        <div className="space-y-3">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Match Score</span>
              <span className="font-semibold text-primary">{candidate.matchScore}%</span>
            </div>
            <Progress value={candidate.matchScore} className="h-2" />
          </div>

          {engaged && showEngagement && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Interest Score</span>
                <span className="font-semibold text-accent">{candidate.interestScore}%</span>
              </div>
              <Progress value={candidate.interestScore} className="h-2 [&>[role=progressbar]]:bg-accent" />
            </div>
          )}

          {engaged && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Combined Score</span>
                <span className="font-bold">{candidate.combinedScore}%</span>
              </div>
              <Progress value={candidate.combinedScore} className="h-2.5 [&>[role=progressbar]]:bg-gradient-to-r [&>[role=progressbar]]:from-primary [&>[role=progressbar]]:to-accent" />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Matching Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {candidate.skillMatches.slice(0, 5).map((skill, i) => (
              <Badge key={i} variant="outline" className="gap-1 text-xs bg-accent/10 text-accent border-accent/30">
                <CheckCircle className="h-3 w-3" />
                {skill}
              </Badge>
            ))}
            {candidate.skillMatches.length > 5 && (
              <Badge variant="outline" className="text-xs">
                +{candidate.skillMatches.length - 5} more
              </Badge>
            )}
          </div>
        </div>

        {candidate.skillGaps.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Skill Gaps</p>
            <div className="flex flex-wrap gap-1.5">
              {candidate.skillGaps.slice(0, 3).map((skill, i) => (
                <Badge key={i} variant="outline" className="gap-1 text-xs text-muted-foreground">
                  <XCircle className="h-3 w-3" />
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {engaged && showEngagement && candidate.interestSignals.length > 0 && (
          <div className="space-y-2 rounded-lg bg-secondary/50 p-3">
            <p className="text-sm font-medium">Interest Signals</p>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              {candidate.interestSignals.map((signal, i) => (
                <li key={i}>{signal}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
