import { useState, useRef } from 'react'
import { Camera, X } from 'lucide-react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useStore } from '@/store/useStore'
import type { MealCategory } from '@/data/meals'

interface AddMealDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** If set, the created meal is immediately added to this date */
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
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<MealCategory>('pasta')
  const [ingredients, setIngredients] = useState('')
  const [tags, setTags] = useState('')
  const [photo, setPhoto] = useState<string | undefined>()
  const [emoji, setEmoji] = useState('🍽️')

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
      description: description.trim(),
      category,
      emoji,
      ingredients: ingredients.split(',').map((s) => s.trim()).filter(Boolean),
      tags: tags.split(',').map((s) => s.trim()).filter(Boolean),
      photo,
    })

    if (addToDate) addMealToDay(addToDate, id)

    // reset
    setName('')
    setDescription('')
    setCategory('pasta')
    setIngredients('')
    setTags('')
    setPhoto(undefined)
    setEmoji('🍽️')
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
          {/* Photo upload */}
          <div className="flex gap-3 items-start">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="h-20 w-20 shrink-0 rounded-2xl border-2 border-dashed border-[#0f766e] bg-teal-subtle flex flex-col items-center justify-center gap-1 text-[#0f766e] transition-colors duration-150 hover:bg-teal-subtle-hover active:scale-95"
            >
              {photo
                ? <img src={photo} alt="preview" className="h-full w-full rounded-2xl object-cover" />
                : <>
                    <Camera className="h-5 w-5" />
                    <span className="text-[10px] font-medium">Photo</span>
                  </>
              }
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />

            <div className="flex-1 space-y-2">
              <div>
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
                  className={`flex-1 flex flex-col items-center gap-1 rounded-2xl border-2 py-2.5 text-sm font-medium transition-all duration-150 active:scale-95 ${
                    category === c.value
                      ? 'border-[#0f766e] bg-teal-subtle text-[#0f766e]'
                      : 'border-border bg-surface text-foreground-3'
                  }`}
                >
                  <span className="text-xl">{c.emoji}</span>
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="meal-desc">Description</Label>
            <Textarea
              id="meal-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short description…"
              className="mt-1 min-h-[70px]"
            />
          </div>

          {/* Ingredients */}
          <div>
            <Label htmlFor="meal-ing">Ingredients</Label>
            <Input
              id="meal-ing"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="pasta, beef, tomatoes… (comma separated)"
              className="mt-1"
            />
          </div>

          {/* Tags */}
          <div>
            <Label htmlFor="meal-tags">Tags</Label>
            <Input
              id="meal-tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="quick, family favourite… (comma separated)"
              className="mt-1"
            />
          </div>

          <Button type="submit" className="w-full" size="lg">
            {addToDate ? 'Add & Add to Today' : 'Add Meal'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
