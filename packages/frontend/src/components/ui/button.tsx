import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-95",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg hover:shadow-xl hover:from-primary/90 hover:to-secondary/90 transform hover:-translate-y-0.5",
        destructive:
          "bg-gradient-to-r from-destructive to-destructive/80 text-destructive-foreground shadow-lg hover:shadow-xl hover:from-destructive/90 hover:to-destructive/70 transform hover:-translate-y-0.5",
        outline:
          "border-2 border-primary/20 bg-background/50 backdrop-blur-sm shadow-sm hover:bg-primary/5 hover:text-primary hover:border-primary/40 hover:shadow-md transform hover:-translate-y-0.5",
        secondary:
          "bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground shadow-lg hover:shadow-xl hover:from-secondary/90 hover:to-secondary/70 transform hover:-translate-y-0.5",
        ghost: "hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-105",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80 transition-colors duration-300",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-8 rounded-md px-4 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
