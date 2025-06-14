
"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ZoomIn, ZoomOut, TextQuote } from "lucide-react";
import { ResumeFormSection } from "./ResumeFormSection";

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
  step = 0.05, // Finer control
}: FontSizeControlProps) {
  const increaseSize = () => {
    // Round to 2 decimal places to avoid floating point inaccuracies
    onMultiplierChange(parseFloat(Math.min(maxMultiplier, currentMultiplier + step).toFixed(2)));
  };

  const decreaseSize = () => {
    onMultiplierChange(parseFloat(Math.max(minMultiplier, currentMultiplier - step).toFixed(2)));
  };

  const displayValue = `${Math.round(currentMultiplier * 100)}%`;

  return (
    <ResumeFormSection title="Font Size Adjustment" icon={TextQuote}>
      <div className="flex items-center justify-between space-x-4 p-4 border rounded-md matte-glass bg-card/50">
        <Label htmlFor="font-size-display" className="text-sm font-medium">
          Current Size: <span id="font-size-display" className="font-bold">{displayValue}</span>
        </Label>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={decreaseSize}
            disabled={currentMultiplier <= minMultiplier}
            aria-label="Decrease font size"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={increaseSize}
            disabled={currentMultiplier >= maxMultiplier}
            aria-label="Increase font size"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>
       <p className="text-xs text-muted-foreground mt-2 px-1">
        Adjust the overall font size for the preview and PDF. Default is 100%.
      </p>
    </ResumeFormSection>
  );
}
