import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  "w-full min-w-0 rounded-md border-2 border-blue-900 bg-white px-3 text-sm font-semibold text-slate-900 shadow-[2px_2px_0px_#1E3A8A] transition-all outline-none placeholder:text-slate-400 placeholder:font-normal focus-visible:border-orange-500 focus-visible:shadow-[3px_3px_0px_#F97316] disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-60",
  {
    variants: {
      size: {
        default: "h-9 py-1.5",
        sm: "h-7 py-1 text-xs px-2.5",
        lg: "h-11 py-2 text-base px-4",
      },
      variant: {
        default: "",
        error: "border-rose-600 focus-visible:border-rose-600 focus-visible:shadow-[3px_3px_0px_#E11D48]",
        ghost: "border-transparent shadow-none bg-slate-100 focus-visible:border-blue-900 focus-visible:shadow-[2px_2px_0px_#1E3A8A]",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
)

export interface InputProps
  extends Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof inputVariants> {}

function Input({ className, type, size, variant, ...props }: InputProps) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(inputVariants({ size, variant }), className)}
      {...props}
    />
  )
}

export { Input, inputVariants }
