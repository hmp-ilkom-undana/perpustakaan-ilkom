import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-md border text-sm font-bold whitespace-nowrap transition-all duration-150 outline-none select-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-orange-500 text-white border-2 border-blue-900 shadow-[3px_3px_0px_#1E3A8A] hover:bg-orange-600 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        outline:
          "border-2 border-blue-900 bg-white text-blue-950 shadow-[2px_2px_0px_#1E3A8A] hover:bg-orange-50 hover:text-orange-950 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none",
        navy:
          "bg-blue-900 text-white border-2 border-blue-950 shadow-[3px_3px_0px_#1E3A8A] hover:bg-blue-800 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        secondary:
          "bg-slate-100 text-slate-800 border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A] hover:bg-slate-200 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none",
        success:
          "bg-emerald-600 text-white border-2 border-blue-950 shadow-[3px_3px_0px_#1E3A8A] hover:bg-emerald-700 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        destructive:
          "bg-rose-600 text-white border-2 border-blue-950 shadow-[3px_3px_0px_#1E3A8A] hover:bg-rose-700 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        amber:
          "bg-amber-400 text-blue-950 border-2 border-blue-900 shadow-[3px_3px_0px_#1E3A8A] hover:bg-amber-500 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        ghost:
          "hover:bg-slate-100 hover:text-blue-900 text-slate-700 border-2 border-transparent shadow-none",
        link:
          "text-blue-900 underline-offset-4 hover:underline border-0 shadow-none",
      },
      size: {
        default: "h-9 gap-2 px-4 py-2",
        xs: "h-6 gap-1 px-2 text-xs rounded-sm",
        sm: "h-7 gap-1.5 px-2.5 text-xs rounded-sm",
        lg: "h-11 gap-2.5 px-6 text-base rounded-md",
        icon: "size-9",
        "icon-sm": "size-7 rounded-sm",
        "icon-lg": "size-11 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
