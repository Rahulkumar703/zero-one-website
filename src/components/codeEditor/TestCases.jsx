"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Plus,
  X,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import {
  usePlaygroundTestcases,
  usePlaygroundActiveTestcase,
  usePlaygroundResults,
  usePlaygroundError,
  usePlaygroundLoading,
  usePlaygroundInitialize,
  usePlaygroundSetActiveTestcase,
  usePlaygroundAddTestcase,
  usePlaygroundUpdateTestcase,
  usePlaygroundRemoveTestcase,
} from "../../stores/playgroundStore";

/**
 * TestCases Component - Comprehensive test case management and result display
 *
 * This component handles:
 * - Test case input/output editing in tabbed interface
 * - Real-time execution results from Judge0 API
 * - Error display for compilation and runtime errors
 * - Status indicators for each test case execution
 *
 * Architecture:
 * - Initializes playground store with props-based data
 * - Uses granular Zustand selectors to prevent unnecessary re-renders
 * - Maintains local UI state (mainTab) while delegating data to store
 * - Integrates with codeEditorStore for code execution workflow
 *
 * Props:
 * @param {Array} testcases - Initial test cases from parent (e.g., Playground.jsx)
 * @param {string} className - Additional CSS classes
 */
const TestCases = ({
  // Props from Playground component (used for initialization only)
  testcases: initialTestcases = [],
  className = "",
}) => {
  // Subscribe to specific pieces of playground state for optimal re-rendering
  const testcases = usePlaygroundTestcases();
  const activeTestcase = usePlaygroundActiveTestcase();
  const results = usePlaygroundResults();
  const error = usePlaygroundError();
  const loading = usePlaygroundLoading();

  // Get store actions (these don't cause re-renders)
  const initializeTestcases = usePlaygroundInitialize();
  const setActiveTestcase = usePlaygroundSetActiveTestcase();
  const addTestcase = usePlaygroundAddTestcase();
  const updateTestcase = usePlaygroundUpdateTestcase();
  const removeTestcase = usePlaygroundRemoveTestcase();

  /**
   * Initialize playground store when component mounts
   * This ensures the store has the correct initial data from props
   */
  useEffect(() => {
    // Normalize testcase format to match store expectations
    const formattedTestcases = initialTestcases.map((tc) => ({
      stdin: tc.input || tc.stdin || "",
      expected_output: tc.output || tc.expected_output || "",
    }));

    initializeTestcases(formattedTestcases);
  }, [JSON.stringify(initialTestcases), initializeTestcases]);

  // Local UI state for main tab navigation (testcases vs results)
  const [mainTab, setMainTab] = useState("testcases");

  /**
   * Auto-switch to results tab when execution starts
   * Provides better UX by showing results immediately
   */
  useEffect(() => {
    if (loading) {
      setMainTab("results");
    }
  }, [loading]);

  /**
   * Map Judge0 status IDs to human-readable descriptions
   * Reference: https://github.com/judge0/judge0/blob/master/CHANGELOG.md
   */
  const getStatusDescription = (statusId) => {
    const statusMap = {
      1: "In Queue",
      2: "Processing",
      3: "Accepted",
      4: "Wrong Answer",
      5: "Time Limit Exceeded",
      6: "Compilation Error",
      7: "Runtime Error (SIGSEGV)",
      8: "Runtime Error (SIGXFSZ)",
      9: "Runtime Error (SIGFPE)",
      10: "Runtime Error (SIGABRT)",
      11: "Runtime Error (NZEC)",
      12: "Runtime Error (Other)",
      13: "Internal Error",
      14: "Exec Format Error",
    };
    return statusMap[statusId] || "Unknown Status";
  };

  const getTestcaseStatus = (index) => {
    const result = results[index];
    if (loading) return "running";
    if (error && index === 0) return "error";
    if (!result) return "pending";

    // Judge0 status codes mapping
    switch (result.status?.id) {
      case 1:
      case 2:
        return "running";
      case 3:
        return "passed";
      case 4:
        return "failed";
      case 5:
        return "timeout";
      case 6:
        return "compilation_error";
      case 7:
      case 8:
      case 9:
      case 10:
      case 11:
      case 12:
        return "runtime_error";
      case 13:
      case 14:
        return "internal_error";
      default:
        return "";
    }
  };

  const isGlobalError = (statusId) => {
    // Global errors that affect all test cases (compilation, certain runtime errors)
    return [6, 13, 14].includes(statusId); // Compilation Error, Internal Error, Exec Format Error
  };

  const isIndividualError = (statusId) => {
    // Errors that can occur on individual test cases
    return [5, 7, 8, 9, 10, 11, 12].includes(statusId); // Time Limit, Runtime Errors
  };

  const isErrorStatus = (status) => {
    return ["compilation_error", "runtime_error", "internal_error"].includes(
      status
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="size-4 text-green-500" />;
      case "failed":
        return <XCircle className="size-4 text-red-500" />;
      case "timeout":
        return <Clock className="size-4 text-yellow-500" />;
      case "compilation_error":
      case "runtime_error":
      case "internal_error":
      case "error":
        return <AlertCircle className="size-4 text-red-500" />;
      case "running":
        return (
          <div className="size-4 animate-spin border-2 border-blue-500 border-t-transparent rounded-full" />
        );
      case "pending":
      default:
        return <div className="size-4 bg-gray-400 rounded-full" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "passed":
        return "bg-green-500/20 text-green-500 border-green-500/30";
      case "failed":
        return "bg-red-500/20 text-red-500 border-red-500/30";
      case "timeout":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
      case "compilation_error":
      case "runtime_error":
      case "internal_error":
      case "error":
        return "bg-red-500/20 text-red-500 border-red-500/30";
      case "running":
        return "bg-blue-500/20 text-blue-500 border-blue-500/30";
      case "pending":
      default:
        return "bg-gray-500/20 text-gray-500 border-gray-500/30";
    }
  };

  return (
    <Card
      className={`border-border/30 bg-background ${className} flex flex-col h-full`}
    >
      <CardContent className="p-0 flex flex-col h-full">
        {/* Main Tabs */}
        <Tabs
          value={mainTab}
          onValueChange={setMainTab}
          className="w-full flex flex-col h-full"
        >
          {/* Sticky Tabs Header */}
          <div className="border-b border-border/30 px-4 pt-4 bg-background sticky top-0 z-10 flex-shrink-0">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="testcases">Test Cases</TabsTrigger>
              <TabsTrigger value="results">Test Results</TabsTrigger>
            </TabsList>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-hidden">
            {/* Test Cases Tab */}
            <TabsContent
              value="testcases"
              className="p-4 h-full overflow-y-auto mt-0"
            >
              <TestCase
                testcases={testcases}
                activeTestcase={activeTestcase}
                loading={loading}
                onAddTestcase={addTestcase}
                onActiveTestcaseChange={setActiveTestcase}
                onUpdateTestcase={updateTestcase}
                onRemoveTestcase={removeTestcase}
              />
            </TabsContent>

            {/* Test Results Tab */}
            <TabsContent
              value="results"
              className="p-4 h-full overflow-y-auto mt-0"
            >
              <TestResult
                testcases={testcases}
                activeTestcase={activeTestcase}
                results={results}
                error={error}
                loading={loading}
                onActiveTestcaseChange={setActiveTestcase}
                getTestcaseStatus={getTestcaseStatus}
                getStatusIcon={getStatusIcon}
                getStatusColor={getStatusColor}
                getStatusDescription={getStatusDescription}
                isErrorStatus={isErrorStatus}
                isGlobalError={isGlobalError}
                isIndividualError={isIndividualError}
              />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const TestCase = ({
  testcases = [],
  activeTestcase = 0,
  loading = false,
  onAddTestcase,
  onActiveTestcaseChange,
  onUpdateTestcase,
  onRemoveTestcase,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Manage Test Cases</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onAddTestcase}
          className="gap-2"
        >
          <Plus className="size-4" />
          Add Case
        </Button>
      </div>

      {/* Testcase Selection */}
      <div className="flex items-start gap-3 overflow-x-auto pb-4">
        {testcases.map((_, index) => {
          return (
            <div key={index} className="relative flex-shrink-0">
              <Button
                size="sm"
                variant={index === activeTestcase ? "secondary" : "outline"}
                onClick={() => onActiveTestcaseChange(index)}
                className="gap-2 min-w-fit pr-6"
              >
                Case {index + 1}
              </Button>
              {testcases.length > 1 && (
                <button
                  onClick={() => onRemoveTestcase(index)}
                  className="absolute top-0 -right-1 p-1 text-red-500 hover:text-red-600 hover:bg-red-500 bg-background border border-red-500/30 rounded-full transition-colors"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Input/Expected Output Tabs */}
      {testcases.length > 0 && (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80">
              Input (stdin):
            </label>
            <Textarea
              placeholder="Enter input for this test case..."
              value={testcases[activeTestcase]?.stdin || ""}
              onChange={(e) =>
                onUpdateTestcase(activeTestcase, "stdin", e.target.value)
              }
              className="min-h-[100px] font-mono text-sm"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80">
              Expected Output:
            </label>
            <Textarea
              placeholder="Enter expected output for this test case..."
              value={testcases[activeTestcase]?.expected_output || ""}
              onChange={(e) =>
                onUpdateTestcase(
                  activeTestcase,
                  "expected_output",
                  e.target.value
                )
              }
              className="min-h-[100px] font-mono text-sm"
              disabled={loading}
            />
          </div>
        </>
      )}
    </div>
  );
};

const TestResult = ({
  testcases = [],
  activeTestcase = 0,
  results = [],
  error = null,
  loading = false,
  onActiveTestcaseChange,
  getTestcaseStatus,
  getStatusIcon,
  getStatusColor,
  getStatusDescription,
  isGlobalError,
  isIndividualError,
}) => {
  // Check if any result has global errors (compilation, internal errors)
  const hasGlobalError = results.some((result) => {
    return isGlobalError(result?.status?.id);
  });

  // Check if all results have individual errors that can be shown per test case
  const hasOnlyIndividualErrors =
    results.length > 0 &&
    results.every((result) => {
      const statusId = result?.status?.id;
      return statusId === 3 || statusId === 4 || isIndividualError(statusId); // Accepted, Wrong Answer, or individual errors
    });

  const getGlobalErrorInfo = () => {
    const errorResult = results.find((result) => {
      return isGlobalError(result?.status?.id);
    });

    if (errorResult) {
      return {
        title: getStatusDescription(errorResult.status?.id),
        message:
          errorResult.stderr ||
          errorResult.compile_output ||
          "An error occurred during execution",
      };
    }

    return null;
  };
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Test Results</h3>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-foreground/60 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="size-4 animate-spin border-2 border-current border-t-transparent rounded-full" />
          Executing test cases...
        </div>
      )}

      {/* Global Error Display - for compilation errors, runtime errors, etc */}
      {(error || hasGlobalError) && (
        <div className="space-y-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="size-5 text-red-500" />
            <h4 className="text-lg font-semibold text-red-500">
              {error?.message || getGlobalErrorInfo()?.title || "Error"}
            </h4>
          </div>
          {(error?.stderr || getGlobalErrorInfo()?.message) && (
            <div className="space-y-2">
              <pre className="text-sm text-red-400 whitespace-pre-wrap font-mono  rounded">
                {error?.stderr || getGlobalErrorInfo()?.message}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Test Case Tabs for Results - show for accepted/wrong answer and individual errors */}
      {!error &&
        !hasGlobalError &&
        testcases.length > 0 &&
        hasOnlyIndividualErrors && (
          <>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {testcases.map((_, index) => {
                const status = getTestcaseStatus(index);
                return (
                  <Button
                    key={index}
                    size="sm"
                    variant={index === activeTestcase ? "secondary" : "outline"}
                    onClick={() => onActiveTestcaseChange(index)}
                    className="gap-2 min-w-fit"
                  >
                    {getStatusIcon(status)}
                    Case {index + 1}
                  </Button>
                );
              })}
            </div>

            {/* Current Test Case Result */}
            {testcases.length > 0 && (
              <div className="space-y-4">
                {(() => {
                  const result = results[activeTestcase];
                  const testcase = testcases[activeTestcase];
                  const status = getTestcaseStatus(activeTestcase);

                  return (
                    <div className={`rounded-lg`}>
                      {/* Test Case Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(status)}>
                            {result?.status?.id
                              ? getStatusDescription(result.status.id)
                              : status.toUpperCase()}
                          </Badge>
                        </div>
                        {result?.time && result?.memory && (
                          <div className="flex items-center gap-3 text-xs text-foreground/60">
                            <span>
                              {result.time}
                              <span className="text-blue-300/50">ms</span>
                            </span>
                            <span>
                              {result.memory}
                              <span className="text-blue-300/50">KB</span>
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Test Case Content in Columns */}
                      <div className="grid grid-cols-1 gap-4">
                        {/* Input */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground/80">
                            Input:
                          </label>
                          <div className="bg-muted/50 border border-border/30 rounded p-3">
                            <pre className="text-sm font-mono whitespace-pre-wrap">
                              {testcase.stdin || "No input"}
                            </pre>
                          </div>
                        </div>

                        {/* Expected Output */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground/80">
                            Expected Output:
                          </label>
                          <div className="bg-muted/50 border border-border/30 rounded p-3">
                            <pre className="text-sm font-mono whitespace-pre-wrap">
                              {testcase.expected_output || "No expected output"}
                            </pre>
                          </div>
                        </div>

                        {/* Actual Output or Error Message */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground/80">
                            {isIndividualError(result?.status?.id)
                              ? "Error Details:"
                              : "Actual Output:"}
                          </label>
                          <div
                            className={`rounded p-3 bg-muted/50 border border-border/30${
                              status === "passed"
                                ? "text-green-500"
                                : status === "timeout" ||
                                  isIndividualError(result?.status?.id)
                                ? "text-yellow-500"
                                : "text-red-500"
                            }`}
                          >
                            {result ? (
                              isIndividualError(result?.status?.id) ? (
                                <div className="space-y-2">
                                  <div className="text-sm font-medium text-yellow-600">
                                    {getStatusDescription(result.status.id)}
                                  </div>
                                  <pre className="text-sm font-mono whitespace-pre-wrap text-yellow-700">
                                    {result.stderr ||
                                      result.message ||
                                      "Error occurred during execution"}
                                  </pre>
                                </div>
                              ) : (
                                <pre className="text-sm font-mono whitespace-pre-wrap">
                                  {result.stdout ||
                                    result.stderr ||
                                    "No output"}
                                </pre>
                              )
                            ) : (
                              <span className="text-sm text-foreground/50">
                                Not executed yet
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </>
        )}

      {/* No Results Message */}
      {!loading && !error && !hasGlobalError && results.length === 0 && (
        <div className="text-center p-8 text-foreground/50">
          <p>No test results yet. Click the run button to execute your code.</p>
        </div>
      )}
    </div>
  );
};

export default TestCases;
