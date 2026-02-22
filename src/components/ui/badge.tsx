import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-teal-subtle text-[#0f766e]',
        pasta: 'bg-amber-100/60 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        rice: 'bg-blue-100/60 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
        other: 'bg-muted text-foreground-3',
        outline: 'border border-border text-foreground-3',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
