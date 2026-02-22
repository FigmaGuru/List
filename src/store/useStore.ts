import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_MEALS, type Meal } from '@/data/meals'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DayPlan {
  date: string       // ISO date string YYYY-MM-DD
  mealIds: string[]
  notes: string
}

export interface ShoppingItem {
  id: string
  name: string
  quantity: string
  category: string
  checked: boolean
}

export interface Article {
  id: string
  url: string
  title: string
  notes: string
  addedAt: string
}

// ─── Store ────────────────────────────────────────────────────────────────────

interface State {
  meals: Meal[]
  plan: Record<string, DayPlan>
  shoppingList: ShoppingItem[]
  articles: Article[]
  theme: 'light' | 'dark'

  // Theme actions
  toggleTheme: () => void

  // Meal actions
  addMeal: (meal: Omit<Meal, 'id'>) => string
  updateMeal: (id: string, updates: Partial<Meal>) => void
  deleteMeal: (id: string) => void

  // Plan actions
  addMealToDay: (date: string, mealId: string) => void
  removeMealFromDay: (date: string, mealId: string) => void
  updateDayNotes: (date: string, notes: string) => void

  // Shopping actions
  addShoppingItem: (item: Omit<ShoppingItem, 'id' | 'checked'>) => void
  toggleShoppingItem: (id: string) => void
  deleteShoppingItem: (id: string) => void
  clearCheckedItems: () => void

  // Article actions
  addArticle: (article: Omit<Article, 'id' | 'addedAt'>) => void
  updateArticle: (id: string, updates: Partial<Article>) => void
  deleteArticle: (id: string) => void
}

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

export const useStore = create<State>()(
  persist(
    (set) => ({
      meals: DEFAULT_MEALS,
      plan: {},
      shoppingList: [],
      articles: [],
      theme: (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches)
        ? 'dark'
        : 'light',

      // ─── Theme actions ─────────────────────────────────────────────────────
      toggleTheme: () =>
        set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),

      // ─── Meal actions ──────────────────────────────────────────────────────
      addMeal: (meal) => {
        const id = uid()
        set((s) => ({ meals: [...s.meals, { ...meal, id }] }))
        return id
      },
      updateMeal: (id, updates) =>
        set((s) => ({
          meals: s.meals.map((m) => (m.id === id ? { ...m, ...updates } : m)),
        })),
      deleteMeal: (id) =>
        set((s) => ({
          meals: s.meals.filter((m) => m.id !== id),
          // Also remove from all day plans
          plan: Object.fromEntries(
            Object.entries(s.plan).map(([date, day]) => [
              date,
              { ...day, mealIds: day.mealIds.filter((mid) => mid !== id) },
            ]),
          ),
        })),

      // ─── Plan actions ──────────────────────────────────────────────────────
      addMealToDay: (date, mealId) =>
        set((s) => {
          const existing = s.plan[date] ?? { date, mealIds: [], notes: '' }
          if (existing.mealIds.includes(mealId)) return s
          return {
            plan: { ...s.plan, [date]: { ...existing, mealIds: [...existing.mealIds, mealId] } },
          }
        }),
      removeMealFromDay: (date, mealId) =>
        set((s) => {
          const existing = s.plan[date]
          if (!existing) return s
          return {
            plan: {
              ...s.plan,
              [date]: { ...existing, mealIds: existing.mealIds.filter((id) => id !== mealId) },
            },
          }
        }),
      updateDayNotes: (date, notes) =>
        set((s) => ({
          plan: {
            ...s.plan,
            [date]: { ...(s.plan[date] ?? { date, mealIds: [] }), notes },
          },
        })),

      // ─── Shopping actions ──────────────────────────────────────────────────
      addShoppingItem: (item) =>
        set((s) => ({
          shoppingList: [...s.shoppingList, { ...item, id: uid(), checked: false }],
        })),
      toggleShoppingItem: (id) =>
        set((s) => ({
          shoppingList: s.shoppingList.map((item) =>
            item.id === id ? { ...item, checked: !item.checked } : item,
          ),
        })),
      deleteShoppingItem: (id) =>
        set((s) => ({ shoppingList: s.shoppingList.filter((item) => item.id !== id) })),
      clearCheckedItems: () =>
        set((s) => ({ shoppingList: s.shoppingList.filter((item) => !item.checked) })),

      // ─── Article actions ───────────────────────────────────────────────────
      addArticle: (article) =>
        set((s) => ({
          articles: [
            { ...article, id: uid(), addedAt: new Date().toISOString() },
            ...s.articles,
          ],
        })),
      updateArticle: (id, updates) =>
        set((s) => ({
          articles: s.articles.map((a) => (a.id === id ? { ...a, ...updates } : a)),
        })),
      deleteArticle: (id) =>
        set((s) => ({ articles: s.articles.filter((a) => a.id !== id) })),
    }),
    {
      name: 'mealplan-store',
      version: 1,
    },
  ),
)
