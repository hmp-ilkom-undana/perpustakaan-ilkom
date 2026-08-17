import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-md border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A] px-2 py-0.5 text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-amber-400 text-blue-950 [a]:hover:bg-amber-300",
        amber: "bg-amber-400 text-blue-950 [a]:hover:bg-amber-300",
        orange: "bg-orange-500 text-white [a]:hover:bg-orange-600",
        navy: "bg-blue-900 text-white [a]:hover:bg-blue-800",
        sky: "bg-sky-400 text-blue-950 [a]:hover:bg-sky-300",
        emerald: "bg-emerald-400 text-emerald-950 [a]:hover:bg-emerald-300",
        success: "bg-emerald-400 text-emerald-950 [a]:hover:bg-emerald-300",
        rose: "bg-rose-500 text-white [a]:hover:bg-rose-600",
        destructive: "bg-rose-500 text-white [a]:hover:bg-rose-600",
        secondary: "bg-slate-200 text-blue-950 [a]:hover:bg-slate-300",
        outline: "bg-white text-blue-950 [a]:hover:bg-slate-50",
        ghost: "border-transparent shadow-none hover:bg-slate-100 hover:text-blue-900",
        link: "border-transparent shadow-none text-blue-900 underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
