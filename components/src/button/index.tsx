import { cn } from "../../../lib/utils"

export function Button({ className, ...props }) {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90",
        className
      )}
      {...props}
    />
  )
}
