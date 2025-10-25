"use client";

/**
 * @deprecated This hook is deprecated and will be removed in future versions.
 * 
 * Please use the new Zustand stores directly instead:
 * - For code editor functionality: import from "@/stores/codeEditorStore"
 * - For playground/testcases functionality: import from "@/stores/playgroundStore"
 * 
 * New architecture:
 * - CodeEditor store: handles code, language, execution
 * - Playground store: handles testcases, results, errors
 * 
 * Example migration:
 * // Old way
 * const { code, setCode, runCode } = useCodeEditor();
 * 
 * // New way
 * import { useCodeEditorCode, useCodeEditorSetCode, useCodeEditorRunCode } from "@/stores/codeEditorStore";
 * const code = useCodeEditorCode();
 * const setCode = useCodeEditorSetCode();
 * const runCode = useCodeEditorRunCode();
 */

// This file is kept for backward compatibility but should not be used
console.warn(
  "useCodeEditor hook is deprecated. Please migrate to the new Zustand stores."
);
