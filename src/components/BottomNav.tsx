import { NavLink } from 'react-router-dom'
import { CalendarDays, UtensilsCrossed, ShoppingCart, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { to: '/',         label: 'Plan',     Icon: CalendarDays    },
  { to: '/meals',    label: 'Meals',    Icon: UtensilsCrossed },
  { to: '/shopping', label: 'Shopping', Icon: ShoppingCart    },
  { to: '/articles', label: 'Saved',    Icon: BookOpen        },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-surface/90 backdrop-blur border-t border-border">
      <div className="flex items-stretch pb-safe">
        {tabs.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex flex-1 flex-col items-center gap-0.5 py-2.5 transition-colors duration-150',
                isActive ? 'text-[#0f766e]' : 'text-muted-foreground',
              )
            }
          >
            {({ isActive }) => (
              <>
                <span className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-xl',
                  'transition-all duration-200 ease-out',
                  isActive && 'bg-teal-subtle scale-110',
                )}>
                  <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 1.8} />
                </span>
                <span className={cn(
                  'text-[10px] transition-all duration-150',
                  isActive ? 'font-semibold' : 'font-medium',
                )}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
