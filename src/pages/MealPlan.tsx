import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, Trash2, UtensilsCrossed } from 'lucide-react'
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
          className="w-full h-11 rounded-xl border border-border bg-muted px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#7ececa] mb-3"
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
                    : 'bg-white hover:bg-[#f0fbfa] border border-border/60',
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
                  <span className="text-xs text-[#2ea29b] font-medium shrink-0">Added</span>
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

  const refDate = new Date(today)
  refDate.setDate(today.getDate() + weekOffset * 7)
  const weekDates = getWeekDates(refDate)

  const dayPlan = plan[selectedDate]
  const dayMeals = (dayPlan?.mealIds ?? [])
    .map((id) => meals.find((m) => m.id === id))
    .filter(Boolean) as typeof meals

  const selectedDateObj = new Date(selectedDate + 'T00:00:00')
  const monthName = MONTH_NAMES[selectedDateObj.getMonth()]

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="pt-safe bg-white border-b border-border/60 px-4 pt-4 pb-3">
        <h1 className="text-2xl font-bold text-gray-900">Meal Plan</h1>
        <p className="text-sm text-gray-400 mt-0.5">{monthName} {selectedDateObj.getFullYear()}</p>
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
              const hasMeals = (plan[iso]?.mealIds.length ?? 0) > 0
              const selected = iso === selectedDate
              const todayDate = isToday(date)

              return (
                <button
                  key={iso}
                  onClick={() => setSelectedDate(iso)}
                  className={cn(
                    'flex flex-1 flex-col items-center gap-1 py-2 rounded-2xl transition-all duration-200',
                    selected
                      ? 'bg-[#7ececa] text-white'
                      : todayDate
                      ? 'bg-[#e8f8f7] text-[#2ea29b]'
                      : 'text-gray-500 hover:bg-muted',
                  )}
                >
                  <span className="text-[10px] font-medium uppercase tracking-wide">
                    {DAY_NAMES[i]}
                  </span>
                  <span className={cn('text-base font-bold leading-none', selected && 'text-white')}>
                    {date.getDate()}
                  </span>
                  {hasMeals && (
                    <span className={cn(
                      'h-1.5 w-1.5 rounded-full',
                      selected ? 'bg-white/70' : 'bg-[#7ececa]',
                    )} />
                  )}
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

      {/* Day content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-28 scrollbar-hide">
        {/* Day label */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
              {isToday(selectedDateObj) ? 'Today' : DAY_NAMES[selectedDateObj.getDay() === 0 ? 6 : selectedDateObj.getDay() - 1]}
            </p>
            <p className="text-lg font-bold text-gray-900">
              {selectedDateObj.getDate()} {MONTH_NAMES[selectedDateObj.getMonth()]}
            </p>
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

        {/* Meals for this day */}
        {dayMeals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-20 w-20 rounded-3xl bg-[#e8f8f7] flex items-center justify-center mb-4">
              <UtensilsCrossed className="h-9 w-9 text-[#7ececa]" />
            </div>
            <p className="font-semibold text-gray-700">Nothing planned yet</p>
            <p className="text-sm text-gray-400 mt-1">Tap Library to add meals</p>
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
          </div>
        )}
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
