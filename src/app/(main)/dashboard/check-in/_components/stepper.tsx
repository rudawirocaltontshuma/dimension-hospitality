import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export interface Step {
  id: string;
  label: string;
}

export function Stepper({ steps, currentIndex }: { steps: Step[]; currentIndex: number }) {
  return (
    <ol className="flex flex-wrap items-center gap-2 sm:gap-0">
      {steps.map((step, index) => {
        const isComplete = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <li key={step.id} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "grid size-7 shrink-0 place-items-center rounded-full border text-xs",
                  isComplete && "border-primary bg-primary text-primary-foreground",
                  isCurrent && "border-primary text-primary",
                  !isComplete && !isCurrent && "border-muted-foreground/30 text-muted-foreground",
                )}
              >
                {isComplete ? <Check className="size-3.5" /> : index + 1}
              </div>
              <span
                className={cn(
                  "whitespace-nowrap text-sm",
                  isCurrent ? "font-medium text-foreground" : "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 ? (
              <div className={cn("mx-3 h-px w-6 sm:w-10", isComplete ? "bg-primary" : "bg-border")} />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
