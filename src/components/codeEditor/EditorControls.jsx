"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Play, RotateCcw } from "lucide-react";
import { languageConfigs } from "./editorConfigs";
import { Kbd, KbdGroup } from "../ui/kbd";
import { Tooltip, TooltipContent, TooltipProvider } from "../ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";

const EditorControls = ({
  // Language state
  selectedLanguage,
  onLanguageChange,
  allowedLanguages,

  // Actions
  onRunCode,
  onReset,

  // State
  loading = false,
  testcasesCount = 0,
  readOnly = false,

  // Styling
  className = "",
}) => {
  return (
    <div
      className={`w-full z-10 flex items-center justify-end gap-2 bg-background/95 backdrop-blur-sm rounded-lg p-3 shadow-lg ${className}`}
    >
      {/* Language Selector */}
      <Select
        value={selectedLanguage}
        onValueChange={onLanguageChange}
        disabled={readOnly || loading}
      >
        <SelectTrigger className="w-44 h-8 text-xs">
          <SelectValue placeholder="Select Language" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(languageConfigs)
            .filter(([key]) => allowedLanguages.includes(key))
            .map(([key, config]) => (
              <SelectItem key={key} value={key} className="text-xs">
                {config.name}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>

      {/* Reset Button */}
      {onReset && (
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          disabled={loading}
          title="Reset to default code (Ctrl+Shift+R)"
          className="h-8 px-2"
        >
          <RotateCcw className="size-3" />
        </Button>
      )}

      {/* Run Code Button */}
      {onRunCode && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onRunCode}
                disabled={loading || testcasesCount === 0}
                size="sm"
                title="Run code (Ctrl+R)"
                className="h-8 px-3 bg-green-600 hover:bg-green-700 text-xs gap-1"
              >
                {loading ? (
                  <div className="size-3 animate-spin border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <Play className="size-3" />
                )}
                {loading ? "Running..." : "Run"}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <KbdGroup>
                <Kbd>Ctrl</Kbd> + <Kbd>R</Kbd>
              </KbdGroup>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default EditorControls;
