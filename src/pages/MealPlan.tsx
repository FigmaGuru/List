import { useState, useRef } from 'react'
import { ChevronLeft, ChevronRight, Plus, UtensilsCrossed, CalendarCheck, BookOpen } from 'lucide-react'
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
          className="w-full h-11 rounded-xl border border-border bg-muted px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#0f766e] mb-3 transition-shadow duration-150"
        />

        <div className="space-y-2 overflow-y-auto pr-0.5">
          {filtered.map((meal) => {
            const alreadyAdded = plan?.mealIds.includes(meal.id)
            return (
              <button
                key={meal.id}
                onClick={() => !alreadyAdded && handleAdd(meal.id)}
                className={cn(
                  'w-full flex items-center gap-3 rounded-2xl p-3 text-left transition-all duration-150 active:scale-[0.98]',
                  alreadyAdded
                    ? 'bg-teal-subtle opacity-60 cursor-default'
                    : 'bg-surface hover:bg-teal-subtle border border-border/60',
                )}
              >
                <span className="text-2xl shrink-0">{meal.photo
                  ? <img src={meal.photo} alt="" className="h-10 w-10 rounded-xl object-cover" />
                  : meal.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground truncate">{meal.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{meal.description}</p>
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
    <div className="flex flex-col h-full animate-fade-in">
      {/* Header */}
      <header className="pt-safe relative overflow-hidden bg-gradient-to-br from-[#0f766e]/10 via-surface to-surface border-b border-border/60 px-4 pt-5 pb-4">
        {/* Decorative blob */}
        <div className="absolute -top-6 -right-6 h-28 w-28 rounded-full bg-[#0f766e]/8 blur-2xl pointer-events-none" />
        <div className="flex items-start justify-between relative">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#0f766e] mb-0.5">Weekly</p>
            <h1 className="text-3xl font-extrabold text-foreground leading-none">Meal Plan</h1>
            <div className="flex items-center gap-1.5 mt-2">
              <CalendarCheck className="h-3.5 w-3.5 text-[#0f766e]" />
              <p className="text-xs font-medium text-foreground-3">{weekRangeLabel}</p>
            </div>
          </div>
          {weekOffset !== 0 && (
            <button
              onClick={goToToday}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0f766e] text-white text-xs font-semibold shadow-fab active:scale-95 transition-all duration-150 mt-1"
            >
              <CalendarCheck className="h-3.5 w-3.5" />
              Today
            </button>
          )}
        </div>
      </header>

      {/* Week strip */}
      <div className="bg-surface border-b border-border/40 px-2 py-3">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setWeekOffset((w) => w - 1)}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground-2 hover:bg-muted active:scale-90 transition-all duration-150"
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
                    'flex flex-1 flex-col items-center gap-0.5 py-2.5 rounded-2xl transition-all duration-200 ease-out active:scale-95',
                    selected
                      ? 'bg-[#0f766e] text-white shadow-sm'
                      : todayDate
                      ? 'bg-teal-subtle text-[#0f766e]'
                      : 'text-foreground-3 hover:bg-muted',
                  )}
                >
                  <span className="text-[10px] font-medium uppercase tracking-wide">
                    {DAY_NAMES[i]}
                  </span>
                  <span className={cn('text-base font-bold leading-none', selected && 'text-white')}>
                    {date.getDate()}
                  </span>
                  <span className={cn(
                    'text-[9px] font-bold leading-none min-h-[14px] flex items-center justify-center px-1.5 rounded-full transition-all duration-200',
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
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground-2 hover:bg-muted active:scale-90 transition-all duration-150"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 pb-28 scrollbar-hide smooth-scroll">

        {/* ── Selected day detail ── */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-[#0f766e] font-semibold uppercase tracking-wider">
              {isToday(selectedDateObj) ? 'Today' : DAY_NAMES[selectedDateObj.getDay() === 0 ? 6 : selectedDateObj.getDay() - 1]}
            </p>
            <p className="text-xl font-bold text-foreground">
              {selectedDateObj.getDate()} {MONTH_NAMES[selectedDateObj.getMonth()]}
            </p>
            {dayMeals.length > 0 && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {dayMeals.length} meal{dayMeals.length !== 1 ? 's' : ''} planned
              </p>
            )}
          </div>
        </div>

        {dayMeals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="h-16 w-16 rounded-3xl bg-teal-subtle flex items-center justify-center mb-3 animate-float">
              <UtensilsCrossed className="h-8 w-8 text-[#0f766e]" />
            </div>
            <p className="font-semibold text-foreground">Nothing planned yet</p>
            <p className="text-sm text-muted-foreground mt-1">Tap + to add meals from your library</p>
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
              className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border py-3 text-sm text-muted-foreground hover:border-[#0f766e]/40 hover:text-[#0f766e] active:scale-[0.98] transition-all duration-150"
            >
              <Plus className="h-4 w-4" />
              Add another meal
            </button>
          </div>
        )}

        {/* ── Week overview ── */}
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground shrink-0">
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
                    'w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all duration-200 ease-out active:scale-[0.98]',
                    isSelected
                      ? 'bg-teal-subtle border border-[#0f766e]/25 shadow-sm'
                      : 'bg-surface border border-border/60 hover:border-[#0f766e]/30 hover:bg-teal-subtle',
                  )}
                >
                  {/* Day label */}
                  <div className="shrink-0 w-10 text-center">
                    <p className={cn(
                      'text-[10px] font-semibold uppercase tracking-wide',
                      isSelected || isTodayDate ? 'text-[#0f766e]' : 'text-muted-foreground',
                    )}>
                      {DAY_NAMES[i]}
                    </p>
                    <p className={cn(
                      'text-lg font-bold leading-tight',
                      isSelected ? 'text-[#0f766e]' : 'text-foreground',
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
                      <p className="text-xs text-foreground-5 italic">Nothing planned</p>
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
                              isSelected ? 'text-foreground-2' : 'text-foreground-3',
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

      {/* FABs — fixed above bottom nav */}
      <div className="fixed bottom-24 right-4 z-30 flex flex-col gap-3 items-end">
        {/* Secondary FAB: create new meal */}
        <button
          onClick={() => setAddNewOpen(true)}
          aria-label="Create new meal"
          className="h-12 w-12 rounded-full bg-surface border border-border shadow-card flex items-center justify-center text-[#0f766e] active:scale-90 transition-all duration-150"
        >
          <Plus className="h-5 w-5" />
        </button>
        {/* Primary FAB: add from library */}
        <button
          onClick={() => setLibraryOpen(true)}
          aria-label="Add from library"
          className="h-14 w-14 rounded-full bg-[#0f766e] shadow-fab flex items-center justify-center text-white active:scale-90 transition-all duration-150"
        >
          <BookOpen className="h-6 w-6" />
        </button>
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
