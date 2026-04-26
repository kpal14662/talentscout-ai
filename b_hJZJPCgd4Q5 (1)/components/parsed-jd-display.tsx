'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Briefcase, GraduationCap, Tags, ListChecks } from 'lucide-react'
import type { ParsedJD } from '@/lib/types'

interface ParsedJDDisplayProps {
  parsedJD: ParsedJD
}

export function ParsedJDDisplay({ parsedJD }: ParsedJDDisplayProps) {
  return (
    <Card className="bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xl">
          <CheckCircle className="h-5 w-5 text-accent" />
          Parsed Job Requirements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              Position
            </div>
            <p className="font-medium">{parsedJD.title}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <GraduationCap className="h-4 w-4" />
              Experience Level
            </div>
            <p className="font-medium capitalize">{parsedJD.experienceLevel}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Tags className="h-4 w-4" />
            Required Skills
          </div>
          <div className="flex flex-wrap gap-2">
            {parsedJD.requiredSkills.map((skill, i) => (
              <Badge key={i} variant="default" className="bg-primary/90">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {parsedJD.preferredSkills.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Tags className="h-4 w-4" />
              Preferred Skills
            </div>
            <div className="flex flex-wrap gap-2">
              {parsedJD.preferredSkills.map((skill, i) => (
                <Badge key={i} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ListChecks className="h-4 w-4" />
            Key Responsibilities
          </div>
          <ul className="list-inside list-disc space-y-1 text-sm text-foreground/80">
            {parsedJD.responsibilities.slice(0, 4).map((resp, i) => (
              <li key={i}>{resp}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
