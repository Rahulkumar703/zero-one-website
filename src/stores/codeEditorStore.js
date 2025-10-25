/**
 * Code Editor Store - Handles all code editor related state and actions
 *
 * Features:
 * - Code content management
 * - Programming language selection
 * - Code execution with Judge0 API
 * - Integration with playground store for test cases
 *
 * This store is initialized by the CodeEditor component with props from Playground.jsx
 */

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { languageConfigs } from "../components/codeEditor/editorConfigs";
import { createSubmission, getSubmissionResult } from "../action/playground";
import { usePlaygroundStore } from "./playgroundStore";
import { toast } from "sonner";

// Default allowed languages across the platform
const ALL_LANGUAGES = [
  "cpp",
  "c",
  "java",
  "python",
  "javascript",
  "sql",
  "typescript",
];

export const useCodeEditorStore = create(
  immer((set, get) => ({
    // ===== STATE =====
    code: "", // Current code in the editor
    language: "javascript", // Selected programming language
    allowedLanguages: ALL_LANGUAGES, // Languages available for selection
    loading: false, // Code execution/submission state

    // ===== EDITOR ANNOTATIONS & MARKERS =====
    annotations: [], // Array of error/warning annotations for the editor
    markers: [], // Array of markers (highlights, breakpoints, etc.)
    showLineNumbers: true, // Toggle line numbers visibility
    showGutter: true, // Toggle gutter (line numbers + markers) visibility
    highlightActiveLine: true, // Highlight current line
    showPrintMargin: true, // Show print margin guide

    // ===== ACTIONS =====

    /**
     * Set editor annotations (errors, warnings, info)
     * @param {Array} newAnnotations - Array of annotation objects
     * Format: [{ row, column, text, type }] where type is 'error'|'warning'|'info'
     */
    setAnnotations: (newAnnotations) =>
      set((state) => {
        state.annotations = newAnnotations;
      }),

    /**
     * Add a single annotation to the editor
     * @param {Object} annotation - Annotation object {row, column, text, type}
     */
    addAnnotation: (annotation) =>
      set((state) => {
        state.annotations.push(annotation);
      }),

    /**
     * Clear all annotations from the editor
     */
    clearAnnotations: () =>
      set((state) => {
        state.annotations = [];
      }),

    /**
     * Set editor markers (highlights, breakpoints, etc.)
     * @param {Array} newMarkers - Array of marker objects
     * Format: [{ startRow, startCol, endRow, endCol, className, type }]
     */
    setMarkers: (newMarkers) =>
      set((state) => {
        state.markers = newMarkers;
      }),

    /**
     * Add a single marker to the editor
     * @param {Object} marker - Marker object {startRow, startCol, endRow, endCol, className, type}
     */
    addMarker: (marker) =>
      set((state) => {
        state.markers.push(marker);
      }),

    /**
     * Clear all markers from the editor
     */
    clearMarkers: () =>
      set((state) => {
        state.markers = [];
      }),

    /**
     * Toggle line numbers visibility
     */
    toggleLineNumbers: () =>
      set((state) => {
        state.showLineNumbers = !state.showLineNumbers;
      }),

    /**
     * Toggle gutter (line numbers + markers) visibility
     */
    toggleGutter: () =>
      set((state) => {
        state.showGutter = !state.showGutter;
      }),

    /**
     * Toggle active line highlighting
     */
    toggleHighlightActiveLine: () =>
      set((state) => {
        state.highlightActiveLine = !state.highlightActiveLine;
      }),

    /**
     * Update the code content in the editor
     */
    setCode: (newCode) =>
      set((state) => {
        state.code = newCode;
      }),

    /**
     * Change programming language and update code if needed
     */
    setLanguage: (newLanguage) =>
      set((state) => {
        state.language = newLanguage;
        // Update code to default for new language if current code is empty or default
        const currentConfig = languageConfigs[state.language];
        const newConfig = languageConfigs[newLanguage];

        if (!state.code || state.code === currentConfig?.defaultCode) {
          state.code = newConfig?.defaultCode || "";
        }
      }),

    /**
     * Set allowed languages and ensure current language is valid
     */
    setAllowedLanguages: (languages) =>
      set((state) => {
        state.allowedLanguages = languages;
        // If current language is not in allowed languages, switch to first allowed
        if (!languages.includes(state.language)) {
          state.language = languages[0] || "javascript";
          const newConfig = languageConfigs[state.language];
          state.code = newConfig?.defaultCode || "";
        }
      }),

    /**
     * Initialize the editor with props from Playground component
     * Called when CodeEditor component mounts or props change
     */
    initializeEditor: (initialCode = "", allowedLanguages = ALL_LANGUAGES) =>
      set((state) => {
        state.allowedLanguages = allowedLanguages;

        // Set language to first allowed language or keep current if allowed
        if (!allowedLanguages.includes(state.language)) {
          state.language = allowedLanguages[0] || "javascript";
        }

        // Set code - use initialCode if provided, otherwise use default for language
        const config = languageConfigs[state.language];
        state.code = initialCode || config?.defaultCode || "";
        state.loading = false;

        // Reset editor annotations and markers on initialization
        state.annotations = [];
        state.markers = [];
      }),

    runCode: async () => {
      const { code, language } = get();

      if (!code.trim()) {
        toast.error("Please write some code first");
        return;
      }

      set((state) => {
        state.loading = true;
      });

      try {
        // Clear previous annotations and markers
        set((state) => {
          state.annotations = [];
          state.markers = [];
        });

        // Get testcases from playground store
        const playgroundStore = usePlaygroundStore.getState();
        const testcases = playgroundStore.testcases;

        if (testcases.length === 0) {
          toast.error("Please add at least one test case");
          return;
        }

        // Set playground loading state
        playgroundStore.setLoading(true);
        playgroundStore.clearResults();

        const languageConfig = languageConfigs[language];
        if (!languageConfig) {
          toast.error("Unsupported programming language");
          return;
        }

        console.log("Running code with Judge0 API:", {
          language,
          languageId: languageConfig.id,
          testcasesCount: testcases.length,
        });

        // Create batch submission for all test cases
        const submissionResponse = await createSubmission({
          source_code: code,
          language_id: languageConfig.id,
          testcases: testcases,
        });

        if (!submissionResponse.success) {
          throw new Error(
            submissionResponse.message || "Failed to create submission"
          );
        }

        const tokens = submissionResponse.data || [];

        // Polling function to check submission status
        const polling = async (token) => {
          while (true) {
            const response = await getSubmissionResult(token);
            if (!response.success) {
              throw new Error(
                response.error || "Failed to get submission result"
              );
            }

            const result = response.data;
            // Check if execution is complete (status id >= 3)
            if (result.status && result.status.id >= 3) {
              return result;
            }

            // Wait before next poll (1 second interval)
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        };

        // Get results for all test cases in parallel
        const results = await Promise.all(
          tokens.map((token) => polling(token))
        );

        // Handle compilation errors (status id 6)
        const hasCompilationError = results.some(
          (result) => result.status?.id === 6
        );

        if (hasCompilationError) {
          const errorResult = results.find((result) => result.status?.id === 6);

          // Use annotations and markers from the action function if available
          if (errorResult.annotations && errorResult.annotations.length > 0) {
            set((state) => {
              state.annotations = errorResult.annotations;
            });
          } else {
            // Fallback to manual annotation if parsing failed
            const errorMessage =
              errorResult.stderr ||
              errorResult.compile_output ||
              "Compilation Error";
            set((state) => {
              state.annotations = [
                {
                  row: 0,
                  column: 0,
                  text: errorMessage,
                  type: "error",
                },
              ];
            });
          }

          // Use markers from the action function if available
          if (errorResult.markers && errorResult.markers.length > 0) {
            set((state) => {
              state.markers = errorResult.markers;
            });
          }

          playgroundStore.setError({
            message: "Compilation Error",
            stderr:
              errorResult.stderr ||
              errorResult.compile_output ||
              "Compilation Error",
          });
          toast.error("Compilation Error - Check your code syntax");
        } else {
          // Clear annotations and markers on successful execution
          set((state) => {
            state.annotations = [];
            state.markers = [];
          });

          // Set successful results in playground store
          playgroundStore.setResults(results);

          // Show user-friendly success message
          const passedCount = results.filter(
            (result) => result.status?.id === 3 // Accepted
          ).length;

          if (passedCount === results.length) {
            toast.success("All test cases passed! 🎉");
          } else {
            toast.info(`${passedCount}/${results.length} test cases passed`);
          }
        }
      } catch (error) {
        console.error("Code execution failed:", error);

        // Add error annotation to editor for general execution errors
        set((state) => {
          state.annotations = [
            {
              row: 0,
              column: 0,
              text: error.message || "Code execution failed",
              type: "error",
            },
          ];
          state.markers = [];
        });

        const playgroundStore = usePlaygroundStore.getState();
        playgroundStore.setError({
          message: error.message || "Code execution failed",
          stderr: error.stderr || "",
        });
        toast.error("Code execution failed: " + error.message);
      } finally {
        set((state) => {
          state.loading = false;
        });
        const playgroundStore = usePlaygroundStore.getState();
        playgroundStore.setLoading(false);
      }
    },

    /**
     * Submit code for evaluation (placeholder for future implementation)
     */
    submitCode: async () => {
      set((state) => {
        state.loading = true;
      });

      try {
        // TODO: Implement actual submission logic for contests/challenges
        // This would integrate with backend API for code evaluation

        // Simulate async operation for now
        await new Promise((resolve) => setTimeout(resolve, 1500));

        toast.success("Code submitted successfully");
      } catch (error) {
        console.error("Code submission failed:", error);
        toast.error("Code submission failed: " + error.message);
      } finally {
        set((state) => {
          state.loading = false;
        });
      }
    },

    resetCode: () =>
      set((state) => {
        const config = languageConfigs[state.language];
        state.code = config?.defaultCode || "";
        // Clear annotations and markers when resetting code
        state.annotations = [];
        state.markers = [];
      }),
  }))
);

// Selectors for optimized re-rendering
export const useCodeEditorCode = () =>
  useCodeEditorStore((state) => state.code);
export const useCodeEditorLanguage = () =>
  useCodeEditorStore((state) => state.language);
export const useCodeEditorAllowedLanguages = () =>
  useCodeEditorStore((state) => state.allowedLanguages);
export const useCodeEditorLoading = () =>
  useCodeEditorStore((state) => state.loading);

// Annotation and Marker Selectors
export const useCodeEditorAnnotations = () =>
  useCodeEditorStore((state) => state.annotations);
export const useCodeEditorMarkers = () =>
  useCodeEditorStore((state) => state.markers);
export const useCodeEditorShowLineNumbers = () =>
  useCodeEditorStore((state) => state.showLineNumbers);
export const useCodeEditorShowGutter = () =>
  useCodeEditorStore((state) => state.showGutter);
export const useCodeEditorHighlightActiveLine = () =>
  useCodeEditorStore((state) => state.highlightActiveLine);
export const useCodeEditorShowPrintMargin = () =>
  useCodeEditorStore((state) => state.showPrintMargin);

// Action selectors
export const useCodeEditorSetCode = () =>
  useCodeEditorStore((state) => state.setCode);
export const useCodeEditorSetLanguage = () =>
  useCodeEditorStore((state) => state.setLanguage);
export const useCodeEditorRunCode = () =>
  useCodeEditorStore((state) => state.runCode);
export const useCodeEditorSubmitCode = () =>
  useCodeEditorStore((state) => state.submitCode);
export const useCodeEditorResetCode = () =>
  useCodeEditorStore((state) => state.resetCode);
export const useCodeEditorInitialize = () =>
  useCodeEditorStore((state) => state.initializeEditor);

// Annotation and Marker Action Selectors
export const useCodeEditorSetAnnotations = () =>
  useCodeEditorStore((state) => state.setAnnotations);
export const useCodeEditorAddAnnotation = () =>
  useCodeEditorStore((state) => state.addAnnotation);
export const useCodeEditorClearAnnotations = () =>
  useCodeEditorStore((state) => state.clearAnnotations);
export const useCodeEditorSetMarkers = () =>
  useCodeEditorStore((state) => state.setMarkers);
export const useCodeEditorAddMarker = () =>
  useCodeEditorStore((state) => state.addMarker);
export const useCodeEditorClearMarkers = () =>
  useCodeEditorStore((state) => state.clearMarkers);
export const useCodeEditorToggleLineNumbers = () =>
  useCodeEditorStore((state) => state.toggleLineNumbers);
export const useCodeEditorToggleGutter = () =>
  useCodeEditorStore((state) => state.toggleGutter);
export const useCodeEditorToggleHighlightActiveLine = () =>
  useCodeEditorStore((state) => state.toggleHighlightActiveLine);
export const useCodeEditorTogglePrintMargin = () =>
  useCodeEditorStore((state) => state.togglePrintMargin);
