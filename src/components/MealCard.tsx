import { Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Meal } from '@/data/meals'

interface MealCardProps {
  meal: Meal
  onDelete?: () => void
  compact?: boolean
  className?: string
}

export function MealCard({ meal, onDelete, compact = false, className }: MealCardProps) {
  if (compact) {
    return (
      <div className={cn(
        'flex items-center gap-3 rounded-2xl p-3 shadow-soft border transition-all',
        'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700',
        className,
      )}>
        <div className="h-12 w-12 shrink-0 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-2xl">
          {meal.photo
            ? <img src={meal.photo} alt={meal.name} className="h-full w-full object-cover" />
            : meal.emoji
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 dark:text-white truncate text-sm">{meal.name}</p>
          <Badge variant={meal.category} className="mt-1">
            {meal.category === 'pasta' ? '🍝 Pasta' : meal.category === 'rice' ? '🍚 Rice' : meal.category}
          </Badge>
        </div>
        {onDelete && (
          <button
            onClick={onDelete}
            className="shrink-0 text-gray-300 dark:text-gray-600 hover:text-red-400 p-1.5 rounded-lg transition"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    )
  }

  return (
    <div className={cn(
      'rounded-3xl overflow-hidden animate-fade-in shadow-card border',
      'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700',
      className,
    )}>
      {/* Photo / emoji area */}
      <div className="h-36 bg-gradient-to-br from-[#e8f8f7] to-[#c5eeeb] dark:from-[#1a3a38] dark:to-[#0f2624] flex items-center justify-center text-6xl relative">
        {meal.photo
          ? <img src={meal.photo} alt={meal.name} className="h-full w-full object-cover absolute inset-0" />
          : <span className="select-none drop-shadow-sm">{meal.emoji}</span>
        }
        {/* Badge top-left */}
        <div className="absolute top-2.5 left-2.5">
          <Badge variant={meal.category}>
            {meal.category === 'pasta' ? '🍝 Pasta' : meal.category === 'rice' ? '🍚 Rice' : meal.category}
          </Badge>
        </div>
        {/* Delete top-right */}
        {onDelete && (
          <button
            onClick={onDelete}
            className="absolute top-2.5 right-2.5 h-7 w-7 rounded-full bg-black/20 dark:bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/80 hover:bg-red-500 hover:text-white transition"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Title only */}
      <div className="px-3 py-3">
        <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-tight line-clamp-2">
          {meal.name}
        </h3>
      </div>
    </div>
  )
}
