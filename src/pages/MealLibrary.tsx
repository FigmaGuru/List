import { useState } from 'react'
import { Plus, Search, UtensilsCrossed } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { MealCard } from '@/components/MealCard'
import { AddMealDialog } from '@/components/AddMealDialog'
import { cn } from '@/lib/utils'
import type { MealCategory } from '@/data/meals'

const FILTERS: { value: MealCategory | 'all'; label: string }[] = [
  { value: 'all',   label: 'All' },
  { value: 'pasta', label: '🍝 Pasta' },
  { value: 'rice',  label: '🍚 Rice' },
  { value: 'other', label: '🍽️ Other' },
]

export default function MealLibrary() {
  const meals = useStore((s) => s.meals)
  const deleteMeal = useStore((s) => s.deleteMeal)

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<MealCategory | 'all'>('all')
  const [addOpen, setAddOpen] = useState(false)

  const filtered = meals.filter((m) => {
    const matchCat = filter === 'all' || m.category === filter
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Header */}
      <header className="pt-safe relative overflow-hidden bg-gradient-to-br from-[#0f766e]/10 via-surface to-surface border-b border-border/60 px-4 pt-5 pb-4">
        {/* Decorative blob */}
        <div className="absolute -top-6 -right-6 h-28 w-28 rounded-full bg-[#0f766e]/8 blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between relative">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#0f766e] mb-0.5">Library</p>
            <h1 className="text-3xl font-extrabold text-foreground leading-none">Meals</h1>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="inline-flex items-center justify-center h-5 px-2 rounded-full bg-[#0f766e]/15 text-[#0f766e] text-[10px] font-bold">
                {meals.length}
              </span>
              <p className="text-xs font-medium text-foreground-3">in your library</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mt-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search meals…"
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#0f766e] transition-shadow duration-150"
          />
        </div>

        {/* Category filter pills */}
        <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide pb-0.5">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                'shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 active:scale-95',
                filter === f.value
                  ? 'bg-[#0f766e] text-white'
                  : 'bg-muted text-foreground-3 hover:bg-muted/80',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </header>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto pb-28 scrollbar-hide">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="h-20 w-20 rounded-3xl bg-teal-subtle flex items-center justify-center mb-4 animate-float">
              <UtensilsCrossed className="h-9 w-9 text-[#0f766e]" />
            </div>
            <p className="font-semibold text-foreground">No meals found</p>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or add a new meal</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 p-4">
            {filtered.map((meal) => (
              <MealCard
                key={meal.id}
                meal={meal}
                onDelete={() => deleteMeal(meal.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* FAB — fixed above bottom nav */}
      <button
        onClick={() => setAddOpen(true)}
        aria-label="Add meal"
        className="fixed bottom-24 right-4 z-30 h-14 w-14 rounded-full bg-[#0f766e] shadow-fab flex items-center justify-center text-white active:scale-90 transition-all duration-150"
      >
        <Plus className="h-6 w-6" />
      </button>

      <AddMealDialog open={addOpen} onOpenChange={setAddOpen} />
    </div>
  )
}
