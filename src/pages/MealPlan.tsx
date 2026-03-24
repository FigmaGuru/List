import { useState } from 'react'
import { Check, ChevronLeft, ChevronRight, Plus, UtensilsCrossed, X } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { AddMealDialog } from '@/components/AddMealDialog'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import {
  formatDate, getWeekDates, isToday, DAY_NAMES, MONTH_NAMES,
} from '@/lib/utils'
import { cn } from '@/lib/utils'

function AddFromLibrarySheet({
  open, onOpenChange, date,
}: {
  open: boolean; onOpenChange: (v: boolean) => void; date: string
}) {
  const meals = useStore((s) => s.meals)
  const plan = useStore((s) => s.plan[date])
  const addMealToDay = useStore((s) => s.addMealToDay)
  const [search, setSearch] = useState('')
  const [addedMealId, setAddedMealId] = useState<string | null>(null)

  const filtered = meals.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()),
  )

  function handleAdd(mealId: string) {
    addMealToDay(date, mealId)
    setAddedMealId(mealId)
    setTimeout(() => onOpenChange(false), 900)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88dvh]">
        <DialogHeader>
          <DialogTitle>Add to Plan</DialogTitle>
        </DialogHeader>
        <input
          type="search"
          placeholder="Search meals…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
          className="w-full h-11 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 px-4 text-base focus:outline-none focus:ring-2 focus:ring-[#226b66] mb-3"
        />
        <div className="space-y-2 overflow-y-auto pr-0.5">
          {filtered.map((meal) => {
            const alreadyAdded = plan?.mealIds.includes(meal.id)
            const justAdded = addedMealId === meal.id
            return (
              <button
                key={meal.id}
                onClick={() => { if (!alreadyAdded && !addedMealId) handleAdd(meal.id) }}
                className={cn(
                  'w-full flex items-center gap-3 rounded-2xl p-3 text-left transition',
                  justAdded
                    ? 'bg-[#e8f8f7] dark:bg-[#1a3a38] border border-[#226b66]/40'
                    : alreadyAdded
                      ? 'bg-[#e8f8f7] dark:bg-[#1a3a38] opacity-60 cursor-default'
                      : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-700',
                )}
              >
                <span className="text-2xl shrink-0">
                  {meal.photo
                    ? <img src={meal.photo} alt="" className="h-10 w-10 rounded-xl object-cover" />
                    : meal.emoji}
                </span>
                <p className="flex-1 font-semibold text-sm text-gray-900 dark:text-white truncate">
                  {meal.name}
                </p>
                {justAdded ? (
                  <span className="shrink-0 flex items-center gap-1 text-xs font-semibold text-[#226b66]">
                    <Check className="h-4 w-4" strokeWidth={2.5} /> Done
                  </span>
                ) : alreadyAdded ? (
                  <span className="text-xs text-[#226b66] font-medium shrink-0">Added</span>
                ) : null}
              </button>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function MealPlan() {
  const plan = useStore((s) => s.plan)
  const removeMealFromDay = useStore((s) => s.removeMealFromDay)
  const meals = useStore((s) => s.meals)

  const today = new Date()
  const [weekOffset, setWeekOffset] = useState(0)
  const [libraryDate, setLibraryDate] = useState<string | null>(null)
  const [addNewDate, setAddNewDate] = useState<string | null>(null)

  const refDate = new Date(today)
  refDate.setDate(today.getDate() + weekOffset * 7)
  const weekDates = getWeekDates(refDate)

  // Month label: show month of the Monday, or range if week spans two months
  const firstDay = weekDates[0]
  const lastDay = weekDates[6]
  const monthLabel =
    firstDay.getMonth() === lastDay.getMonth()
      ? `${MONTH_NAMES[firstDay.getMonth()]} ${firstDay.getFullYear()}`
      : `${MONTH_NAMES[firstDay.getMonth()]} – ${MONTH_NAMES[lastDay.getMonth()]} ${lastDay.getFullYear()}`

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="pt-safe-header bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-5 pb-4">
        <p className="text-xs font-semibold text-[#226b66] uppercase tracking-widest mb-1">
          {monthLabel}
        </p>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Meal Plan</h1>
      </header>

      {/* Week navigation */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setWeekOffset((w) => w - 1)}
          className="p-2 rounded-xl text-gray-400 dark:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {firstDay.getDate()} {MONTH_NAMES[firstDay.getMonth()].slice(0, 3)} –{' '}
          {lastDay.getDate()} {MONTH_NAMES[lastDay.getMonth()].slice(0, 3)}
        </span>
        <button
          onClick={() => setWeekOffset((w) => w + 1)}
          className="p-2 rounded-xl text-gray-400 dark:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Week overview — one card per day */}
      <div className="flex-1 overflow-y-auto px-4 py-3 pb-28 space-y-2 scrollbar-hide">
        {weekDates.map((date, i) => {
          const iso = formatDate(date)
          const dayPlan = plan[iso]
          const dayMeals = (dayPlan?.mealIds ?? [])
            .map((id) => meals.find((m) => m.id === id))
            .filter(Boolean) as typeof meals
          const todayDate = isToday(date)

          return (
            <div
              key={iso}
              className={cn(
                'rounded-2xl border transition-all',
                todayDate
                  ? 'bg-[#e8f8f7] dark:bg-[#1a3a38] border-[#226b66]/30'
                  : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800',
              )}
            >
              {/* Day header */}
              <div className="flex items-center justify-between px-4 pt-3 pb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'text-sm font-bold',
                      todayDate ? 'text-[#226b66]' : 'text-gray-900 dark:text-white',
                    )}
                  >
                    {DAY_NAMES[i]}
                  </span>
                  <span
                    className={cn(
                      'text-sm',
                      todayDate ? 'text-[#226b66]' : 'text-gray-400 dark:text-gray-500',
                    )}
                  >
                    {date.getDate()} {MONTH_NAMES[date.getMonth()].slice(0, 3)}
                  </span>
                  {todayDate && (
                    <span className="text-[10px] font-semibold uppercase tracking-wide bg-[#226b66] text-white px-1.5 py-0.5 rounded-full">
                      Today
                    </span>
                  )}
                </div>
                {/* Add buttons */}
                <div className="flex gap-1">
                  <button
                    onClick={() => setAddNewDate(iso)}
                    className="h-9 px-3 rounded-full border border-[#226b66] text-[#226b66] text-xs font-semibold flex items-center gap-1 hover:bg-[#e8f8f7] dark:hover:bg-[#1a3a38] transition"
                  >
                    <Plus className="h-3 w-3" strokeWidth={2.5} /> New
                  </button>
                  <button
                    onClick={() => setLibraryDate(iso)}
                    className="h-9 px-3 rounded-full bg-[#226b66] text-white text-xs font-semibold flex items-center gap-1 hover:bg-[#1a5550] transition"
                  >
                    <Plus className="h-3 w-3" strokeWidth={2.5} /> Library
                  </button>
                </div>
              </div>

              {/* Meals for this day */}
              {dayMeals.length === 0 ? (
                <div className="flex items-center gap-2 px-4 pb-3">
                  <UtensilsCrossed className="h-4 w-4 text-gray-300 dark:text-gray-700 shrink-0" />
                  <span className="text-xs text-gray-400 dark:text-gray-600">Nothing planned</span>
                </div>
              ) : (
                <div className="px-3 pb-3 space-y-1.5">
                  {dayMeals.map((meal) => (
                    <div
                      key={meal.id}
                      className="flex items-center gap-2 rounded-xl bg-white/60 dark:bg-gray-800/60 px-3 py-2"
                    >
                      <span className="text-lg shrink-0 leading-none">
                        {meal.photo
                          ? <img src={meal.photo} alt="" className="h-6 w-6 rounded-lg object-cover" />
                          : meal.emoji}
                      </span>
                      <span className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                        {meal.name}
                      </span>
                      <button
                        onClick={() => removeMealFromDay(iso, meal.id)}
                        className="shrink-0 text-gray-300 dark:text-gray-700 hover:text-red-400 transition"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {libraryDate && (
        <AddFromLibrarySheet
          open={!!libraryDate}
          onOpenChange={(v) => { if (!v) setLibraryDate(null) }}
          date={libraryDate}
        />
      )}
      {addNewDate && (
        <AddMealDialog
          open={!!addNewDate}
          onOpenChange={(v) => { if (!v) setAddNewDate(null) }}
          addToDate={addNewDate}
        />
      )}
    </div>
  )
}
