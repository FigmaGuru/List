import { useState, useRef } from 'react'
import { ChevronLeft, ChevronRight, Plus, UtensilsCrossed, CalendarCheck } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { Button } from '@/components/ui/button'
import { MealCard } from '@/components/MealCard'
import { AddMealDialog } from '@/components/AddMealDialog'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import {
  formatDate, getWeekDates, isToday, DAY_NAMES, MONTH_NAMES,
} from '@/lib/utils'
import { cn } from '@/lib/utils'

/** Pick-a-meal sheet: shows the full library so user can tap to add */
function AddFromLibrarySheet({
  open,
  onOpenChange,
  date,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  date: string
}) {
  const meals = useStore((s) => s.meals)
  const plan = useStore((s) => s.plan[date])
  const addMealToDay = useStore((s) => s.addMealToDay)
  const [search, setSearch] = useState('')

  const filtered = meals.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()),
  )

  function handleAdd(mealId: string) {
    addMealToDay(date, mealId)
    onOpenChange(false)
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
          className="w-full h-11 rounded-xl border border-border bg-muted px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f766e] mb-3"
        />

        <div className="space-y-2 overflow-y-auto pr-0.5">
          {filtered.map((meal) => {
            const alreadyAdded = plan?.mealIds.includes(meal.id)
            return (
              <button
                key={meal.id}
                onClick={() => !alreadyAdded && handleAdd(meal.id)}
                className={cn(
                  'w-full flex items-center gap-3 rounded-2xl p-3 text-left transition',
                  alreadyAdded
                    ? 'bg-[#e8f8f7] opacity-60 cursor-default'
                    : 'bg-white hover:bg-[#f0faf9] border border-border/60',
                )}
              >
                <span className="text-2xl shrink-0">{meal.photo
                  ? <img src={meal.photo} alt="" className="h-10 w-10 rounded-xl object-cover" />
                  : meal.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900 truncate">{meal.name}</p>
                  <p className="text-xs text-gray-400 truncate">{meal.description}</p>
                </div>
                {alreadyAdded && (
                  <span className="text-xs text-[#0f766e] font-medium shrink-0">Added</span>
                )}
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
  const [selectedDate, setSelectedDate] = useState(formatDate(today))

  const [libraryOpen, setLibraryOpen] = useState(false)
  const [addNewOpen, setAddNewOpen] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)

  const refDate = new Date(today)
  refDate.setDate(today.getDate() + weekOffset * 7)
  const weekDates = getWeekDates(refDate)

  const dayPlan = plan[selectedDate]
  const dayMeals = (dayPlan?.mealIds ?? [])
    .map((id) => meals.find((m) => m.id === id))
    .filter(Boolean) as typeof meals

  const selectedDateObj = new Date(selectedDate + 'T00:00:00')

  // Compute a readable week range label, e.g. "17–23 Feb 2026" or "28 Feb – 6 Mar 2026"
  const firstDay = weekDates[0]
  const lastDay = weekDates[6]
  const weekRangeLabel = firstDay.getMonth() === lastDay.getMonth()
    ? `${firstDay.getDate()}–${lastDay.getDate()} ${MONTH_NAMES[lastDay.getMonth()]} ${lastDay.getFullYear()}`
    : `${firstDay.getDate()} ${MONTH_NAMES[firstDay.getMonth()]} – ${lastDay.getDate()} ${MONTH_NAMES[lastDay.getMonth()]} ${lastDay.getFullYear()}`

  function goToToday() {
    setWeekOffset(0)
    setSelectedDate(formatDate(today))
  }

  function selectDay(iso: string) {
    setSelectedDate(iso)
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="pt-safe bg-white border-b border-border/60 px-4 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Meal Plan</h1>
            <p className="text-sm text-gray-400 mt-0.5">{weekRangeLabel}</p>
          </div>
          {weekOffset !== 0 && (
            <button
              onClick={goToToday}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#e8f8f7] text-[#0f766e] text-xs font-semibold hover:bg-[#ccede9] transition"
            >
              <CalendarCheck className="h-3.5 w-3.5" />
              Today
            </button>
          )}
        </div>
      </header>

      {/* Week strip */}
      <div className="bg-white border-b border-border/40 px-2 py-3">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setWeekOffset((w) => w - 1)}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-muted transition"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex flex-1 gap-1">
            {weekDates.map((date, i) => {
              const iso = formatDate(date)
              const mealCount = plan[iso]?.mealIds.length ?? 0
              const selected = iso === selectedDate
              const todayDate = isToday(date)

              return (
                <button
                  key={iso}
                  onClick={() => setSelectedDate(iso)}
                  className={cn(
                    'flex flex-1 flex-col items-center gap-0.5 py-2.5 rounded-2xl transition-all duration-200',
                    selected
                      ? 'bg-[#0f766e] text-white shadow-sm'
                      : todayDate
                      ? 'bg-[#e8f8f7] text-[#0f766e]'
                      : 'text-gray-500 hover:bg-muted',
                  )}
                >
                  <span className="text-[10px] font-medium uppercase tracking-wide">
                    {DAY_NAMES[i]}
                  </span>
                  <span className={cn('text-base font-bold leading-none', selected && 'text-white')}>
                    {date.getDate()}
                  </span>
                  {/* Meal count badge — keeps consistent height whether meals exist or not */}
                  <span className={cn(
                    'text-[9px] font-bold leading-none min-h-[14px] flex items-center justify-center px-1.5 rounded-full transition-all',
                    mealCount > 0
                      ? selected
                        ? 'bg-white/25 text-white'
                        : 'bg-[#0f766e]/10 text-[#0f766e]'
                      : 'opacity-0',
                  )}>
                    {mealCount > 0 ? mealCount : '·'}
                  </span>
                </button>
              )
            })}
          </div>

          <button
            onClick={() => setWeekOffset((w) => w + 1)}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-muted transition"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 pb-28 scrollbar-hide">

        {/* ── Selected day detail ── */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-[#0f766e] font-semibold uppercase tracking-wider">
              {isToday(selectedDateObj) ? 'Today' : DAY_NAMES[selectedDateObj.getDay() === 0 ? 6 : selectedDateObj.getDay() - 1]}
            </p>
            <p className="text-xl font-bold text-gray-900">
              {selectedDateObj.getDate()} {MONTH_NAMES[selectedDateObj.getMonth()]}
            </p>
            {dayMeals.length > 0 && (
              <p className="text-xs text-gray-400 mt-0.5">
                {dayMeals.length} meal{dayMeals.length !== 1 ? 's' : ''} planned
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setAddNewOpen(true)}>
              <Plus className="h-3.5 w-3.5" /> New
            </Button>
            <Button size="sm" onClick={() => setLibraryOpen(true)}>
              <Plus className="h-3.5 w-3.5" /> Library
            </Button>
          </div>
        </div>

        {dayMeals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="h-16 w-16 rounded-3xl bg-[#e8f8f7] flex items-center justify-center mb-3">
              <UtensilsCrossed className="h-8 w-8 text-[#0f766e]" />
            </div>
            <p className="font-semibold text-gray-700">Nothing planned yet</p>
            <p className="text-sm text-gray-400 mt-1 mb-4">Add meals from your library or create a new one</p>
            <div className="flex gap-3">
              <Button size="sm" variant="outline" onClick={() => setAddNewOpen(true)}>
                <Plus className="h-3.5 w-3.5" /> New Meal
              </Button>
              <Button size="sm" onClick={() => setLibraryOpen(true)}>
                <Plus className="h-3.5 w-3.5" /> From Library
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {dayMeals.map((meal) => (
              <MealCard
                key={meal.id}
                meal={meal}
                compact
                onDelete={() => removeMealFromDay(selectedDate, meal.id)}
              />
            ))}
            <button
              onClick={() => setLibraryOpen(true)}
              className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border py-3 text-sm text-gray-400 hover:border-[#0f766e]/40 hover:text-[#0f766e] transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add another meal
            </button>
          </div>
        )}

        {/* ── Week overview ── */}
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 shrink-0">
              This Week
            </p>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="space-y-2">
            {weekDates.map((date, i) => {
              const iso = formatDate(date)
              const rowMealIds = plan[iso]?.mealIds ?? []
              const rowMeals = rowMealIds
                .map((id) => meals.find((m) => m.id === id))
                .filter(Boolean) as typeof meals
              const isSelected = iso === selectedDate
              const isTodayDate = isToday(date)

              return (
                <button
                  key={iso}
                  onClick={() => selectDay(iso)}
                  className={cn(
                    'w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all',
                    isSelected
                      ? 'bg-[#0f766e]/[0.07] border border-[#0f766e]/25 shadow-sm'
                      : 'bg-white border border-border/60 hover:border-[#0f766e]/30 hover:bg-[#f0faf9]',
                  )}
                >
                  {/* Day label */}
                  <div className="shrink-0 w-10 text-center">
                    <p className={cn(
                      'text-[10px] font-semibold uppercase tracking-wide',
                      isSelected || isTodayDate ? 'text-[#0f766e]' : 'text-gray-400',
                    )}>
                      {DAY_NAMES[i]}
                    </p>
                    <p className={cn(
                      'text-lg font-bold leading-tight',
                      isSelected ? 'text-[#0f766e]' : 'text-gray-900',
                    )}>
                      {date.getDate()}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className={cn(
                    'w-px self-stretch shrink-0 rounded-full',
                    isSelected ? 'bg-[#0f766e]/30' : 'bg-border',
                  )} />

                  {/* Meals list */}
                  <div className="flex-1 min-w-0">
                    {rowMeals.length === 0 ? (
                      <p className="text-xs text-gray-300 italic">Nothing planned</p>
                    ) : (
                      <div className="space-y-0.5">
                        {rowMeals.map((meal) => (
                          <div key={meal.id} className="flex items-center gap-1.5 min-w-0">
                            <span className="text-sm shrink-0">
                              {meal.photo
                                ? <img src={meal.photo} alt="" className="h-4 w-4 rounded object-cover inline" />
                                : meal.emoji}
                            </span>
                            <p className={cn(
                              'text-xs font-medium truncate',
                              isSelected ? 'text-gray-800' : 'text-gray-600',
                            )}>
                              {meal.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Today pill */}
                  {isTodayDate && (
                    <span className="shrink-0 text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-[#0f766e] text-white">
                      Today
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

      </div>

      {/* Sheets */}
      <AddFromLibrarySheet
        open={libraryOpen}
        onOpenChange={setLibraryOpen}
        date={selectedDate}
      />
      <AddMealDialog
        open={addNewOpen}
        onOpenChange={setAddNewOpen}
        addToDate={selectedDate}
      />
    </div>
  )
}
