import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

/**
 * Playground Store - Manages test cases, execution results, and error states
 *
 * This store is specifically designed for the playground/coding challenge environment.
 * It handles test case management, Judge0 execution results, and error states.
 *
 * Architecture:
 * - Completely separated from code editor concerns for better maintainability
 * - Uses Immer middleware for immutable state updates
 * - Provides granular selectors to prevent unnecessary re-renders
 * - Integrates with codeEditorStore for code execution workflow
 *
 * State Management Pattern:
 * - Test cases are stored as array of {stdin, expected_output} objects
 * - Results array corresponds 1:1 with test cases array by index
 * - activeTestcase tracks which test case tab is currently visible
 * - Error state is separate from results for better UX
 */
export const usePlaygroundStore = create(
  immer((set, get) => ({
    // Core State
    testcases: [], // Array of test case objects {stdin, expected_output}
    results: [], // Array of Judge0 execution results (matches testcases by index)
    error: null, // Global error state for compilation/execution errors
    activeTestcase: 0, // Index of currently active/visible test case tab
    loading: false, // Loading state for execution in progress

    // Actions

    /**
     * Initialize or replace all test cases
     * Called when component mounts or when test cases need to be reset
     *
     * @param {Array} testcases - Array of test case objects with stdin/expected_output
     */
    setTestcases: (testcases) =>
      set((state) => {
        state.testcases = testcases;
        state.activeTestcase = 0; // Reset to first test case
        state.results = []; // Clear previous results
        state.error = null; // Clear any errors
      }),

    /**
     * Add a new empty test case
     * Automatically creates a template test case structure
     */
    addTestcase: () =>
      set((state) => {
        state.testcases.push({
          stdin: "",
          expected_output: "",
        });
      }),

    /**
     * Remove a test case by index
     * Prevents removal if only one test case remains (at least one required)
     * Automatically adjusts activeTestcase index if needed
     *
     * @param {number} index - Index of test case to remove
     */
    removeTestcase: (index) =>
      set((state) => {
        if (state.testcases.length > 1) {
          state.testcases.splice(index, 1);

          // Adjust activeTestcase if it's beyond the new array bounds
          if (state.activeTestcase >= state.testcases.length) {
            state.activeTestcase = state.testcases.length - 1;
          }

          // Remove corresponding result to maintain index alignment
          if (state.results[index]) {
            state.results.splice(index, 1);
          }
        }
      }),

    /**
     * Update a specific field of a test case
     *
     * @param {number} index - Test case index
     * @param {string} field - Field name ('stdin' or 'expected_output')
     * @param {string} value - New field value
     */
    updateTestcase: (index, field, value) =>
      set((state) => {
        if (state.testcases[index]) {
          state.testcases[index][field] = value;
        }
      }),

    /**
     * Switch to a different test case tab
     *
     * @param {number} index - Index of test case to make active
     */
    setActiveTestcase: (index) =>
      set((state) => {
        if (index >= 0 && index < state.testcases.length) {
          state.activeTestcase = index;
        }
      }),

    /**
     * Store execution results from Judge0 API
     * Results array should match test cases array by index
     *
     * @param {Array} results - Array of Judge0 execution result objects
     */
    setResults: (results) =>
      set((state) => {
        state.results = results;
        state.error = null; // Clear errors on successful execution
      }),

    /**
     * Set global error state (compilation errors, network errors, etc.)
     *
     * @param {Object} error - Error object with message and optional stderr
     */
    setError: (error) =>
      set((state) => {
        state.error = error;
        state.results = []; // Clear results when error occurs
      }),

    /**
     * Update loading state during code execution
     *
     * @param {boolean} loading - Loading state
     */
    setLoading: (loading) =>
      set((state) => {
        state.loading = loading;
      }),

    /**
     * Clear all execution results and errors
     * Used before starting new execution
     */
    clearResults: () =>
      set((state) => {
        state.results = [];
        state.error = null;
      }),

    /**
     * Initialize playground with default or provided test cases
     * Called when component mounts to ensure proper initial state
     *
     * @param {Array} testcases - Optional initial test cases
     */
    initializeTestcases: (testcases = []) =>
      set((state) => {
        // Provide default empty test case if none specified
        state.testcases =
          testcases.length > 0
            ? testcases
            : [
                {
                  stdin: "",
                  expected_output: "",
                },
              ];
        state.activeTestcase = 0;
        state.results = [];
        state.error = null;
        state.loading = false;
      }),
  }))
);

/**
 * Optimized Selectors for Fine-grained Re-rendering Control
 *
 * These selectors allow components to subscribe only to specific pieces of state,
 * preventing unnecessary re-renders when unrelated state changes occur.
 *
 * Usage Pattern:
 * - Use these selectors in components instead of accessing the full store
 * - Each selector will only trigger re-render when its specific data changes
 * - Improves performance in complex components with multiple state dependencies
 */

// State Selectors - Subscribe to specific pieces of state
export const usePlaygroundTestcases = () =>
  usePlaygroundStore((state) => state.testcases);

export const usePlaygroundResults = () =>
  usePlaygroundStore((state) => state.results);

export const usePlaygroundError = () =>
  usePlaygroundStore((state) => state.error);

export const usePlaygroundActiveTestcase = () =>
  usePlaygroundStore((state) => state.activeTestcase);

export const usePlaygroundLoading = () =>
  usePlaygroundStore((state) => state.loading);

// Action Selectors - Access store actions without subscribing to state changes
export const usePlaygroundSetTestcases = () =>
  usePlaygroundStore((state) => state.setTestcases);

export const usePlaygroundAddTestcase = () =>
  usePlaygroundStore((state) => state.addTestcase);

export const usePlaygroundRemoveTestcase = () =>
  usePlaygroundStore((state) => state.removeTestcase);

export const usePlaygroundUpdateTestcase = () =>
  usePlaygroundStore((state) => state.updateTestcase);

export const usePlaygroundSetActiveTestcase = () =>
  usePlaygroundStore((state) => state.setActiveTestcase);

export const usePlaygroundSetResults = () =>
  usePlaygroundStore((state) => state.setResults);

export const usePlaygroundSetError = () =>
  usePlaygroundStore((state) => state.setError);

export const usePlaygroundSetLoading = () =>
  usePlaygroundStore((state) => state.setLoading);

export const usePlaygroundClearResults = () =>
  usePlaygroundStore((state) => state.clearResults);

export const usePlaygroundInitialize = () =>
  usePlaygroundStore((state) => state.initializeTestcases);
