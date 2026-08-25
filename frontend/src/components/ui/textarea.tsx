import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "w-full min-w-0 rounded-md border-2 border-blue-900 bg-white p-3 text-sm font-semibold text-slate-900 shadow-[2px_2px_0px_#1E3A8A] transition-all outline-none placeholder:text-slate-400 placeholder:font-normal focus-visible:border-orange-500 focus-visible:shadow-[3px_3px_0px_#F97316] disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-60",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
