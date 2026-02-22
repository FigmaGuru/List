import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, UtensilsCrossed } from 'lucide-react'
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

function AddFromLibrarySheet({
  open, onOpenChange, date,
}: {
  open: boolean; onOpenChange: (v: boolean) => void; date: string
}) {
  const meals = useStore((s) => s.meals)
  const plan = useStore((s) => s.plan[date])
  const addMealToDay = useStore((s) => s.addMealToDay)
  const [search, setSearch] = useState('')

  const filtered = meals.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()),
  )

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
          className="w-full h-11 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#7ececa] mb-3"
        />
        <div className="space-y-2 overflow-y-auto pr-0.5">
          {filtered.map((meal) => {
            const alreadyAdded = plan?.mealIds.includes(meal.id)
            return (
              <button
                key={meal.id}
                onClick={() => { if (!alreadyAdded) { addMealToDay(date, meal.id); onOpenChange(false) } }}
                className={cn(
                  'w-full flex items-center gap-3 rounded-2xl p-3 text-left transition',
                  alreadyAdded
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

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="pt-safe bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-5 pt-5 pb-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold text-[#7ececa] uppercase tracking-widest mb-1">
              {MONTH_NAMES[selectedDateObj.getMonth()]} {selectedDateObj.getFullYear()}
            </p>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Meal Plan</h1>
          </div>
          <div className="flex gap-2 mb-1">
            <Button size="sm" variant="outline" onClick={() => setAddNewOpen(true)}>
              <Plus className="h-3.5 w-3.5" /> New
            </Button>
            <Button size="sm" onClick={() => setLibraryOpen(true)}>
              <Plus className="h-3.5 w-3.5" /> Library
            </Button>
          </div>
        </div>
      </header>

      {/* Week strip */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-2 py-3">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setWeekOffset((w) => w - 1)}
            className="p-2 rounded-xl text-gray-400 dark:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
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
                      ? 'bg-[#e8f8f7] dark:bg-[#1a3a38] text-[#2ea29b]'
                      : 'text-gray-500 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800',
                  )}
                >
                  <span className="text-[10px] font-medium uppercase tracking-wide">
                    {DAY_NAMES[i]}
                  </span>
                  <span className="text-base font-bold leading-none">
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
            className="p-2 rounded-xl text-gray-400 dark:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Day label */}
      <div className="px-5 pt-4 pb-2">
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          {isToday(selectedDateObj) ? 'Today' : DAY_NAMES[selectedDateObj.getDay() === 0 ? 6 : selectedDateObj.getDay() - 1]}
        </p>
        <p className="text-lg font-bold text-gray-900 dark:text-white">
          {selectedDateObj.getDate()} {MONTH_NAMES[selectedDateObj.getMonth()]}
        </p>
      </div>

      {/* Day meals */}
      <div className="flex-1 overflow-y-auto px-4 pb-28 scrollbar-hide">
        {dayMeals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-20 w-20 rounded-3xl bg-[#e8f8f7] dark:bg-[#1a3a38] flex items-center justify-center mb-4">
              <UtensilsCrossed className="h-9 w-9 text-[#7ececa]" />
            </div>
            <p className="font-semibold text-gray-700 dark:text-gray-200">Nothing planned yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Tap Library to add meals</p>
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

      <AddFromLibrarySheet open={libraryOpen} onOpenChange={setLibraryOpen} date={selectedDate} />
      <AddMealDialog open={addNewOpen} onOpenChange={setAddNewOpen} addToDate={selectedDate} />
    </div>
  )
}
