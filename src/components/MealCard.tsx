import { Trash2, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Meal } from '@/data/meals'

interface MealCardProps {
  meal: Meal
  onAdd?: () => void
  onDelete?: () => void
  compact?: boolean
  className?: string
}

export function MealCard({ meal, onAdd, onDelete, compact = false, className }: MealCardProps) {
  if (compact) {
    return (
      <div className={cn(
        'flex items-center gap-3 rounded-2xl bg-surface p-3 shadow-soft border border-border/60',
        'transition-all duration-150 hover:shadow-card',
        className,
      )}>
        {/* Photo / Emoji */}
        <div className="h-12 w-12 shrink-0 rounded-xl overflow-hidden bg-muted flex items-center justify-center text-2xl">
          {meal.photo
            ? <img src={meal.photo} alt={meal.name} className="h-full w-full object-cover" />
            : meal.emoji
          }
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground truncate text-sm">{meal.name}</p>
          <Badge variant={meal.category} className="mt-0.5">
            {meal.category === 'pasta' ? '🍝 Pasta' : meal.category === 'rice' ? '🍚 Rice' : meal.category}
          </Badge>
        </div>

        {onDelete && (
          <button
            onClick={onDelete}
            className="shrink-0 text-red-400 hover:text-red-500 p-1 rounded-lg transition-colors duration-150 active:scale-90"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    )
  }

  return (
    <div className={cn(
      'rounded-3xl bg-surface shadow-card border border-border/40 overflow-hidden animate-fade-in',
      'transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5',
      className,
    )}>
      {/* Photo area */}
      <div className="h-36 bg-teal-subtle flex items-center justify-center text-6xl relative">
        {meal.photo
          ? <img src={meal.photo} alt={meal.name} className="h-full w-full object-cover absolute inset-0" />
          : <span className="select-none">{meal.emoji}</span>
        }
        <div className="absolute top-3 left-3">
          <Badge variant={meal.category}>
            {meal.category === 'pasta' ? '🍝 Pasta' : meal.category === 'rice' ? '🍚 Rice' : meal.category}
          </Badge>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="font-bold text-foreground text-base leading-tight">{meal.name}</h3>
        <p className="mt-1 text-sm text-foreground-3 line-clamp-2">{meal.description}</p>

        {/* Tags */}
        {meal.tags.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1">
            {meal.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-xs text-foreground-3">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        {(onAdd || onDelete) && (
          <div className="mt-3 flex gap-2">
            {onAdd && (
              <Button size="sm" className="flex-1" onClick={onAdd}>
                <Plus className="h-3.5 w-3.5" /> Add to Plan
              </Button>
            )}
            {onDelete && (
              <Button size="sm" variant="outline" onClick={onDelete}>
                <Trash2 className="h-3.5 w-3.5 text-red-400" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
