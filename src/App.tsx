import { HashRouter, Routes, Route } from 'react-router-dom'
import { Suspense, lazy, useEffect } from 'react'
import { BottomNav } from '@/components/BottomNav'

const MealPlan     = lazy(() => import('@/pages/MealPlan'))
const MealLibrary  = lazy(() => import('@/pages/MealLibrary'))
const ShoppingList = lazy(() => import('@/pages/ShoppingList'))
const Articles     = lazy(() => import('@/pages/Articles'))

function PageLoader() {
  return (
    <div className="flex flex-1 items-center justify-center bg-background">
      <div className="h-8 w-8 rounded-full border-2 border-[#0f766e] border-t-transparent animate-spin" />
    </div>
  )
}

function applyTheme(dark: boolean) {
  const root = document.documentElement
  root.classList.add('theme-transitioning')
  root.classList.toggle('dark', dark)
  setTimeout(() => root.classList.remove('theme-transitioning'), 350)
}

export default function App() {
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    applyTheme(mq.matches)
    const handler = (e: MediaQueryListEvent) => applyTheme(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return (
    <HashRouter>
      <div className="flex flex-col h-dvh overflow-hidden bg-background">
        {/* Main content */}
        <main className="flex-1 overflow-hidden flex flex-col">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/"         element={<MealPlan />} />
              <Route path="/meals"    element={<MealLibrary />} />
              <Route path="/shopping" element={<ShoppingList />} />
              <Route path="/articles" element={<Articles />} />
            </Routes>
          </Suspense>
        </main>

        {/* Bottom navigation */}
        <BottomNav />
      </div>
    </HashRouter>
  )
}
