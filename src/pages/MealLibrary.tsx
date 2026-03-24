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
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="pt-safe-header bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-5 pb-4">
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-xs font-semibold text-[#226b66] uppercase tracking-widest mb-1">Library</p>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Meals</h1>
          </div>
          <span className="text-sm font-medium text-gray-400 dark:text-gray-500 mb-1">
            {meals.length} meals
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search meals…"
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-gray-100 dark:bg-gray-800 border-0 text-base text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#226b66]"
          />
        </div>

        {/* Category filter pills */}
        <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                'shrink-0 whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition',
                filter === f.value
                  ? 'bg-[#226b66] text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700',
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
            <div className="h-20 w-20 rounded-3xl bg-[#e8f8f7] dark:bg-[#1a3a38] flex items-center justify-center mb-4">
              <UtensilsCrossed className="h-9 w-9 text-[#226b66]" />
            </div>
            <p className="font-semibold text-gray-700 dark:text-gray-200">No meals found</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try adjusting your search</p>
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

      {/* FAB */}
      <button
        onClick={() => setAddOpen(true)}
        className="fixed bottom-24 right-5 z-30 h-14 w-14 rounded-full bg-[#226b66] text-white shadow-fab flex items-center justify-center active:scale-95 transition-transform"
      >
        <Plus className="h-6 w-6" strokeWidth={2.5} />
      </button>

      <AddMealDialog open={addOpen} onOpenChange={setAddOpen} />
    </div>
  )
}
