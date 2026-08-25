import { Switch as SwitchPrimitive } from "@base-ui/react/switch"

import { cn } from "@/lib/utils"

function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full border-2 border-blue-900 transition-all outline-none cursor-pointer focus-visible:outline-none data-[size=default]:h-6 data-[size=default]:w-11 data-[size=sm]:h-5 data-[size=sm]:w-9 data-checked:bg-orange-500 data-checked:shadow-[2px_2px_0px_#1E3A8A] data-unchecked:bg-slate-300 data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block rounded-full bg-white border border-blue-900 shadow-sm transition-transform data-checked:translate-x-5.5 data-unchecked:translate-x-0.5 group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3.5 group-data-[size=sm]/switch:data-checked:translate-x-4.5"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
