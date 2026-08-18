import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cardVariants = cva(
  "group/card flex flex-col overflow-hidden text-sm transition-all",
  {
    variants: {
      variant: {
        default:
          "bg-white text-slate-900 border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A] rounded-lg",
        elevated:
          "bg-white text-slate-900 border-2 border-blue-900 shadow-[6px_6px_0px_#1E3A8A] rounded-lg",
        interactive:
          "bg-white text-slate-900 border-2 border-blue-900 shadow-[2px_2px_0px_#1E3A8A] hover:border-orange-500 hover:shadow-[4px_4px_0px_#F97316] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer rounded-lg",
        dark:
          "bg-gradient-to-b from-blue-950 to-slate-900 text-white border-2 border-blue-900 shadow-[4px_4px_0px_#1E3A8A] rounded-lg",
        muted:
          "bg-slate-50 text-slate-900 border-2 border-blue-900/40 shadow-[2px_2px_0px_#1E3A8A] rounded-lg",
        ghost:
          "bg-transparent border-2 border-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface CardProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof cardVariants> {}

function Card({ className, variant, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(cardVariants({ variant }), className)}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-1.5 p-5 sm:p-6", className)}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-heading text-lg font-black text-blue-950 tracking-tight leading-snug",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-xs font-semibold text-slate-500", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("self-start justify-self-end", className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("p-5 sm:p-6 pt-0", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center p-5 sm:p-6 pt-0 border-t border-slate-100 mt-auto",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  cardVariants,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
