import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-[#e8f8f7] text-[#1a7a74] dark:bg-[#1a3a38] dark:text-[#7ececa]',
        pasta:   'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
        rice:    'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
        other:   'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
        outline: 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300',
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
