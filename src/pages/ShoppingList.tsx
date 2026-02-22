import { useState } from 'react'
import { Plus, Trash2, CheckCheck, ShoppingCart, ShoppingBag } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

const CATEGORIES = ['Bakery', 'Dairy', 'Meat', 'Pantry', 'Produce', 'Frozen', 'Other']

function AddItemDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const addShoppingItem = useStore((s) => s.addShoppingItem)
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [category, setCategory] = useState('Other')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    addShoppingItem({ name: name.trim(), quantity: quantity.trim(), category })
    setName('')
    setQuantity('')
    setCategory('Other')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Item name…"
              autoFocus
              required
            />
          </div>
          <div>
            <Input
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Quantity (e.g. 500g, 2 packs)"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground-2 mb-2">Category</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-150 active:scale-95',
                    category === c
                      ? 'bg-[#0f766e] text-white'
                      : 'bg-muted text-foreground-3 hover:bg-muted/80',
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

  // Group unchecked by category
  const grouped = CATEGORIES.reduce<Record<string, typeof items>>((acc, cat) => {
    const catItems = unchecked.filter((i) => i.category === cat)
    if (catItems.length) acc[cat] = catItems
    return acc
  }, {})

  const allGroupedCategories = Object.keys(grouped)

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Header */}
      <header className="pt-safe relative overflow-hidden bg-gradient-to-br from-[#0f766e]/10 via-surface to-surface border-b border-border/60 px-4 pt-5 pb-4">
        {/* Decorative blob */}
        <div className="absolute -top-6 -right-6 h-28 w-28 rounded-full bg-[#0f766e]/8 blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between relative">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#0f766e] mb-0.5">Groceries</p>
            <h1 className="text-3xl font-extrabold text-foreground leading-none">Shopping</h1>
            <div className="flex items-center gap-2 mt-2">
              {unchecked.length > 0 ? (
                <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full bg-[#0f766e]/15 text-[#0f766e] text-[10px] font-bold">
                  <ShoppingBag className="h-3 w-3" />
                  {unchecked.length} left
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full bg-[#0f766e]/15 text-[#0f766e] text-[10px] font-bold">
                  <CheckCheck className="h-3 w-3" />
                  All done!
                </span>
              )}
              {checked.length > 0 && (
                <button
                  onClick={clearCheckedItems}
                  className="inline-flex items-center gap-1 h-5 px-2 rounded-full bg-muted text-foreground-3 text-[10px] font-semibold hover:bg-muted/80 active:scale-95 transition-all duration-150"
                >
                  <CheckCheck className="h-3 w-3" />
                  Clear done
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-28 scrollbar-hide px-4 py-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-20 w-20 rounded-3xl bg-teal-subtle flex items-center justify-center mb-4 animate-float">
              <ShoppingCart className="h-9 w-9 text-[#0f766e]" />
            </div>
            <p className="font-semibold text-foreground">List is empty</p>
            <p className="text-sm text-muted-foreground mt-1">Tap + to add your first item</p>
          </div>
        ) : (
          <>
            {/* Unchecked — grouped */}
            {allGroupedCategories.map((cat) => (
              <section key={cat} className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-1">
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

            {/* Checked */}
            {checked.length > 0 && (
              <section className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-1">
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

      {/* FAB — fixed above bottom nav */}
      <button
        onClick={() => setAddOpen(true)}
        aria-label="Add item"
        className="fixed bottom-24 right-4 z-30 h-14 w-14 rounded-full bg-[#0f766e] shadow-fab flex items-center justify-center text-white active:scale-90 transition-all duration-150"
      >
        <Plus className="h-6 w-6" />
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
      'flex items-center gap-3 rounded-2xl bg-surface border px-4 py-3 shadow-soft transition-all duration-200',
      item.checked ? 'border-border/30 opacity-50' : 'border-border/60',
    )}>
      {/* Custom checkbox */}
      <button
        onClick={onToggle}
        className={cn(
          'h-6 w-6 shrink-0 rounded-full border-2 flex items-center justify-center transition-all duration-150 active:scale-90',
          item.checked
            ? 'bg-[#0f766e] border-[#0f766e]'
            : 'border-border hover:border-[#0f766e]',
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
          'text-sm font-medium text-foreground truncate transition-all duration-200',
          item.checked && 'line-through text-muted-foreground',
        )}>
          {item.name}
        </p>
        {item.quantity && (
          <p className="text-xs text-muted-foreground">{item.quantity}</p>
        )}
      </div>

      <button
        onClick={onDelete}
        className="shrink-0 text-foreground-5 hover:text-red-400 p-1 rounded-lg transition-colors duration-150 active:scale-90"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )
}
