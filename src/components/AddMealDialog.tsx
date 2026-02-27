import { useState, useRef } from 'react'
import { Camera } from 'lucide-react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useStore } from '@/store/useStore'
import type { MealCategory } from '@/data/meals'

interface AddMealDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  addToDate?: string
}

const CATEGORIES: { value: MealCategory; label: string; emoji: string }[] = [
  { value: 'pasta', label: 'Pasta', emoji: '🍝' },
  { value: 'rice',  label: 'Rice',  emoji: '🍚' },
  { value: 'other', label: 'Other', emoji: '🍽️' },
]

export function AddMealDialog({ open, onOpenChange, addToDate }: AddMealDialogProps) {
  const addMeal = useStore((s) => s.addMeal)
  const addMealToDay = useStore((s) => s.addMealToDay)

  const [name, setName] = useState('')
  const [category, setCategory] = useState<MealCategory>('pasta')
  const [photo, setPhoto] = useState<string | undefined>()
  const fileRef = useRef<HTMLInputElement>(null)

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setPhoto(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    const id = addMeal({
      name: name.trim(),
      category,
      emoji: CATEGORIES.find((c) => c.value === category)?.emoji ?? '🍽️',
      photo,
    })
    if (addToDate) addMealToDay(addToDate, id)
    setName('')
    setCategory('pasta')
    setPhoto(undefined)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Meal</DialogTitle>
          <DialogDescription>Add a meal to your library</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Photo + name row */}
          <div className="flex gap-3 items-center">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="h-20 w-20 shrink-0 rounded-2xl border-2 border-dashed border-[#226b66] bg-[#f0fbfa] dark:bg-[#1a3a38] flex flex-col items-center justify-center gap-1 text-[#226b66] transition hover:bg-[#e8f8f7] dark:hover:bg-[#1f4542] overflow-hidden"
            >
              {photo
                ? <img src={photo} alt="preview" className="h-full w-full object-cover" />
                : <><Camera className="h-5 w-5" /><span className="text-[10px] font-medium">Photo</span></>
              }
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />

            <div className="flex-1">
              <Label htmlFor="meal-name">Name *</Label>
              <Input
                id="meal-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Spaghetti Bolognese"
                className="mt-1"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <Label>Category</Label>
            <div className="mt-2 flex gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setCategory(c.value)}
                  className={[
                    'flex-1 flex flex-col items-center gap-1 rounded-2xl border-2 py-2.5 text-sm font-medium transition',
                    category === c.value
                      ? 'border-[#226b66] bg-[#e8f8f7] dark:bg-[#1a3a38] text-[#226b66]'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400',
                  ].join(' ')}
                >
                  <span className="text-xl">{c.emoji}</span>
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg">
            {addToDate ? 'Add to Plan' : 'Add Meal'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
