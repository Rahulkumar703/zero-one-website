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
import {
  useCodeEditorLanguage,
  useCodeEditorAllowedLanguages,
  useCodeEditorLoading,
  useCodeEditorSetLanguage,
  useCodeEditorRunCode,
  useCodeEditorResetCode,
  useCodeEditorSubmitCode,
} from "../../stores/codeEditorStore";

const EditorControls = ({
  // Editor config
  readOnly = false,
  className = "",
}) => {
  // Get state directly from Zustand store
  const selectedLanguage = useCodeEditorLanguage();
  const allowedLanguages = useCodeEditorAllowedLanguages();
  const loading = useCodeEditorLoading();

  // Get actions from store
  const setLanguage = useCodeEditorSetLanguage();
  const runCode = useCodeEditorRunCode();
  const submitCode = useCodeEditorSubmitCode();
  const resetCode = useCodeEditorResetCode();
  return (
    <div
      className={`w-full z-10 flex items-center justify-end gap-2 bg-background/95 backdrop-blur-sm rounded-lg p-3 shadow-lg ${className}`}
    >
      {/* Language Selector */}
      <Select
        value={selectedLanguage}
        onValueChange={setLanguage}
        disabled={readOnly || loading}
      >
        <SelectTrigger className="w-44 h-8 text-xs">
          <SelectValue defaultChecked placeholder="Select Language" />
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
      <Button
        variant="outline"
        size="sm"
        onClick={resetCode}
        disabled={loading}
        title="Reset to default code (Ctrl+Shift+R)"
        className="h-8 px-2"
      >
        <RotateCcw className="size-3" />
      </Button>

      {/* Run Code Button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={runCode}
              disabled={loading}
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

      {/* <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={runCode}
              disabled={loading}
              size="sm"
              title="Submit code (Ctrl+S)"
              className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-xs gap-1"
            >
              {loading ? (
                <div className="size-3 animate-spin border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Play className="size-3" />
              )}
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <KbdGroup>
              <Kbd>Ctrl</Kbd> + <Kbd>S</Kbd>
            </KbdGroup>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider> */}
    </div>
  );
};

export default EditorControls;
