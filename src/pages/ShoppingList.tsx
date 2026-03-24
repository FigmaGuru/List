import { useState } from 'react'
import { Plus, Trash2, CheckCheck, ShoppingCart } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

const CATEGORIES = ['TJs', 'Whole Foods', 'Instacart']

function AddItemDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const addShoppingItem = useStore((s) => s.addShoppingItem)
  const [name, setName] = useState('')
  const [category, setCategory] = useState('TJs')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    addShoppingItem({ name: name.trim(), category })
    setName('')
    setCategory('TJs')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Item name…"
            autoFocus
            required
          />
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Store</p>
            <div className="flex gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={cn(
                    'flex-1 px-3 py-1.5 rounded-full text-sm font-medium transition',
                    category === c
                      ? 'bg-[#226b66] text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700',
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <Button type="submit" className="w-full">Add Item</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function ShoppingList() {
  const items = useStore((s) => s.shoppingList)
  const toggleShoppingItem = useStore((s) => s.toggleShoppingItem)
  const deleteShoppingItem = useStore((s) => s.deleteShoppingItem)
  const clearCheckedItems = useStore((s) => s.clearCheckedItems)

  const [addOpen, setAddOpen] = useState(false)

  const unchecked = items.filter((i) => !i.checked)
  const checked = items.filter((i) => i.checked)

  const grouped = CATEGORIES.reduce<Record<string, typeof items>>((acc, cat) => {
    const catItems = unchecked.filter((i) => i.category === cat)
    if (catItems.length) acc[cat] = catItems
    return acc
  }, {})

  // Items with unrecognised categories fall into first store
  const ungrouped = unchecked.filter((i) => !CATEGORIES.includes(i.category))
  if (ungrouped.length) grouped[CATEGORIES[0]] = [...(grouped[CATEGORIES[0]] ?? []), ...ungrouped]

  const allGroupedCategories = Object.keys(grouped)

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="pt-safe-header bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-5 pb-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold text-[#7ececa] uppercase tracking-widest mb-1">Weekly</p>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Shopping</h1>
          </div>
          <div className="flex items-end gap-3 mb-1">
            {checked.length > 0 && (
              <button
                onClick={clearCheckedItems}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-400 dark:text-gray-500 hover:text-red-400 transition"
              >
                <CheckCheck className="h-4 w-4" />
                Clear done
              </button>
            )}
            <span className="text-sm font-medium text-gray-400 dark:text-gray-500">
              {unchecked.length} left
            </span>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-28 scrollbar-hide px-4 py-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-20 w-20 rounded-3xl bg-[#e8f8f7] dark:bg-[#1a3a38] flex items-center justify-center mb-4">
              <ShoppingCart className="h-9 w-9 text-[#7ececa]" />
            </div>
            <p className="font-semibold text-gray-700 dark:text-gray-200">List is empty</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Tap + to add your first item</p>
          </div>
        ) : (
          <>
            {allGroupedCategories.map((cat) => (
              <section key={cat} className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2 px-1">
                  {cat}
                </p>
                <div className="space-y-2">
                  {grouped[cat].map((item) => (
                    <ShoppingItemRow
                      key={item.id}
                      item={item}
                      onToggle={() => toggleShoppingItem(item.id)}
                      onDelete={() => deleteShoppingItem(item.id)}
                    />
                  ))}
                </div>
              </section>
            ))}

            {checked.length > 0 && (
              <section className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2 px-1">
                  Done ({checked.length})
                </p>
                <div className="space-y-2">
                  {checked.map((item) => (
                    <ShoppingItemRow
                      key={item.id}
                      item={item}
                      onToggle={() => toggleShoppingItem(item.id)}
                      onDelete={() => deleteShoppingItem(item.id)}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setAddOpen(true)}
        className="fixed bottom-24 right-5 z-30 h-14 w-14 rounded-full bg-[#226b66] text-white shadow-fab flex items-center justify-center active:scale-95 transition-transform"
      >
        <Plus className="h-6 w-6" strokeWidth={2.5} />
      </button>

      <AddItemDialog open={addOpen} onOpenChange={setAddOpen} />
    </div>
  )
}

interface ShoppingItemRowProps {
  item: ReturnType<typeof useStore.getState>['shoppingList'][number]
  onToggle: () => void
  onDelete: () => void
}

function ShoppingItemRow({ item, onToggle, onDelete }: ShoppingItemRowProps) {
  return (
    <div className={cn(
      'flex items-center gap-3 rounded-2xl px-4 py-3 border transition-all',
      'bg-white dark:bg-gray-800',
      item.checked
        ? 'border-gray-100 dark:border-gray-700/50 opacity-50'
        : 'border-gray-100 dark:border-gray-700 shadow-soft',
    )}>
      <button
        onClick={onToggle}
        className={cn(
          'h-8 w-8 shrink-0 rounded-full border-2 flex items-center justify-center transition-all',
          item.checked
            ? 'bg-[#226b66] border-[#226b66]'
            : 'border-gray-300 dark:border-gray-600 hover:border-[#226b66]',
        )}
      >
        {item.checked && (
          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className={cn(
          'text-sm font-medium truncate',
          item.checked
            ? 'line-through text-gray-400 dark:text-gray-600'
            : 'text-gray-900 dark:text-gray-100',
        )}>
          {item.name}
        </p>
      </div>

      <button
        onClick={onDelete}
        className="shrink-0 text-gray-300 dark:text-gray-600 hover:text-red-400 p-1 rounded-lg transition"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )
}
