import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";

// ...existing code...
function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        // base
        "inline-flex items-center justify-center rounded-md border bg-white transition-colors duration-150 ease-in-out shadow-sm",
        // size
        "w-full h-full",
        // borders / color
        "border-gray-300 dark:border-gray-600",
        // checked state
        "data-[state=checked]:bg-yellow-400 data-[state=checked]:border-yellow-400",
        // hover / focus
        "hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2",
        // disabled
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        forceMount
        className="grid place-items-center text-white opacity-0 data-[state=checked]:opacity-100 transition-opacity"
      >
        <CheckIcon className="w-4 h-4" strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
