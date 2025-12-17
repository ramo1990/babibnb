import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { IconType } from "react-icons"

const buttonVariants = cva(
  [" relative inline-flex items-center justify-center whitespace-nowrap rounded-lg transition-all w-full ",
    "disabled:opacity-70 disabled:cursor-not-allowed hover:opacity-80"].join(),
  {
    variants: {
      variant: {
        default: "bg-rose-500 text-white border-2 border-rose-500",
        outline: "bg-white text-black border-2 border-black",
      },
      size: {
        default: "py-3 text-md font-semibold",
        sm: "py-1 text-sm font-light",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
      asChild?: boolean
      icon?: IconType
      label: string
    }

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  icon: Icon,
  label,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      className={cn(buttonVariants({ variant, size}), className )}
      {...props}
    >
      {Icon && <Icon size={24} className='absolute left-4 top-3' />}
      {label}
    </Comp>
  )
}

export { Button, buttonVariants }
