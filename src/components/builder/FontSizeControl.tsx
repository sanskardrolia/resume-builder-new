"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ZoomIn, ZoomOut } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FontSizeControlProps {
  currentMultiplier: number;
  onMultiplierChange: (newMultiplier: number) => void;
  minMultiplier?: number;
  maxMultiplier?: number;
  step?: number;
}

export function FontSizeControl({
  currentMultiplier,
  onMultiplierChange,
  minMultiplier = 0.8,
  maxMultiplier = 1.5,
  step = 0.05,
}: FontSizeControlProps) {
  const increaseSize = () => {
    onMultiplierChange(parseFloat(Math.min(maxMultiplier, currentMultiplier + step).toFixed(2)));
  };

  const decreaseSize = () => {
    onMultiplierChange(parseFloat(Math.max(minMultiplier, currentMultiplier - step).toFixed(2)));
  };

  const displayValue = `${Math.round(currentMultiplier * 100)}%`;

  return (
    <TooltipProvider delayDuration={150}>
      <div className="flex items-center gap-2">
         <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={decreaseSize}
              disabled={currentMultiplier <= minMultiplier}
              aria-label="Decrease font size"
              className="h-9 w-9"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Decrease Font Size</p>
          </TooltipContent>
        </Tooltip>

        <div id="font-size-display" className="font-semibold text-sm w-12 text-center tabular-nums">
          {displayValue}
        </div>
        <Label htmlFor="font-size-display" className="sr-only">
            Current font size
        </Label>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={increaseSize}
              disabled={currentMultiplier >= maxMultiplier}
              aria-label="Increase font size"
              className="h-9 w-9"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Increase Font Size</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
