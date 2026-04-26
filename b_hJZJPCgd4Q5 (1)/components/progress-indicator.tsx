'use client'

import { cn } from '@/lib/utils'
import { FileSearch, Users, MessageCircle, Trophy, Check, Loader2 } from 'lucide-react'
import type { ScoutingState } from '@/lib/types'

interface ProgressIndicatorProps {
  state: ScoutingState
}

const stages = [
  { id: 'parsing', label: 'Parsing JD', icon: FileSearch },
  { id: 'discovering', label: 'Finding Candidates', icon: Users },
  { id: 'engaging', label: 'Outreach Simulation', icon: MessageCircle },
  { id: 'complete', label: 'Results Ready', icon: Trophy }
]

export function ProgressIndicator({ state }: ProgressIndicatorProps) {
  const currentStageIndex = stages.findIndex(s => s.id === state.stage)

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {stages.map((stage, index) => {
          const Icon = stage.icon
          const isComplete = currentStageIndex > index || state.stage === 'complete'
          const isCurrent = stage.id === state.stage
          const isPending = currentStageIndex < index && state.stage !== 'complete'

          return (
            <div key={stage.id} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300',
                    isComplete && 'border-accent bg-accent text-accent-foreground',
                    isCurrent && 'border-primary bg-primary/10 text-primary',
                    isPending && 'border-muted bg-muted text-muted-foreground'
                  )}
                >
                  {isComplete ? (
                    <Check className="h-5 w-5" />
                  ) : isCurrent ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <span
                  className={cn(
                    'text-xs font-medium text-center',
                    isComplete && 'text-accent',
                    isCurrent && 'text-primary',
                    isPending && 'text-muted-foreground'
                  )}
                >
                  {stage.label}
                </span>
              </div>
              {index < stages.length - 1 && (
                <div
                  className={cn(
                    'mx-2 h-0.5 flex-1 transition-all duration-300',
                    currentStageIndex > index ? 'bg-accent' : 'bg-muted'
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
