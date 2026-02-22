import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 active:scale-[0.97]',
  {
    variants: {
      variant: {
        default: 'bg-[#0f766e] text-white shadow-fab hover:bg-[#0a6158]',
        destructive: 'bg-red-400 text-white hover:bg-red-500',
        outline: 'border border-border bg-surface text-gray-700 hover:bg-muted',
        ghost: 'text-gray-600 hover:bg-muted',
        link: 'text-[#0f766e] underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        default: 'h-12 px-5',
        sm: 'h-9 px-3 text-xs',
        lg: 'h-14 px-8 text-base',
        icon: 'h-11 w-11',
        fab: 'h-14 w-14 rounded-full shadow-fab',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
