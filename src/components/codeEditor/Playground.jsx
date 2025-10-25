"use client";

import { useState } from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "../ui/resizable";
import Question from "./Question";
import CodeEditor from "./CodeEditor";
import TestCases from "./TestCases";
import { useCodeEditor } from "../../hooks/useCodeEditor";
import { Badge } from "../ui/badge";
import { EditorControls } from ".";

const Playground = ({
  problem = null,
  initialCode = "",
  initialLanguage = "javascript",
  className = "",
  readOnly = false,
  allowedLanguages = [
    "cpp",
    "c",
    "java",
    "python",
    "javascript",
    "sql",
    "typescript",
  ],
}) => {
  const {
    code,
    testcases,
    visibleTestcase,
    results,
    error,
    loading,
    setCode,
    resetCode,
    runCode,
    setVisibleTestcase,
    addTestcase,
    updateTestcase,
    selectedLanguage,
    handleLanguageChange,
    removeTestcase,
  } = useCodeEditor({
    initialCode,
    initialLanguage,
  });

  const [leftPanelSize, setLeftPanelSize] = useState(40);
  const [rightTopPanelSize, setRightTopPanelSize] = useState(60);

  const getOverallStatus = () => {
    if (loading) return "running";
    if (error) return "error";
    if (results.length === 0) return "pending";

    const allPassed = results.every((result) => result?.status?.id === 3);
    const anyFailed = results.some((result) => result?.status?.id === 4);
    const anyError = results.some((result) => result?.status?.id >= 6);

    if (anyError) return "error";
    if (anyFailed) return "failed";
    if (allPassed && results.length === testcases.length) return "passed";
    return "partial";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "passed":
        return "bg-green-500/20 text-green-500 border-green-500/30";
      case "failed":
        return "bg-red-500/20 text-red-500 border-red-500/30";
      case "error":
        return "bg-red-500/20 text-red-500 border-red-500/30";
      case "partial":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
      case "running":
        return "bg-blue-500/20 text-blue-500 border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-500 border-gray-500/30";
    }
  };

  return (
    <div className={`bg-background text-foreground p-1 ${className}`}>
      {/* Editor Controls */}
      <EditorControls
        selectedLanguage={selectedLanguage}
        onLanguageChange={handleLanguageChange}
        allowedLanguages={allowedLanguages}
        onRunCode={runCode}
        onReset={resetCode}
        loading={loading}
        testcasesCount={testcases.length}
        readOnly={readOnly}
      />

      {/* Main Content */}
      <div className="h-[calc(100vh-150px)]">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left Panel - Problem Description */}
          {problem && (
            <>
              <ResizablePanel
                defaultSize={leftPanelSize}
                minSize={25}
                maxSize={60}
                onResize={setLeftPanelSize}
              >
                <div className="h-full overflow-hidden">
                  <Question
                    problem={problem}
                    className="h-full border-r border-border/30"
                  />
                </div>
              </ResizablePanel>
              <ResizableHandle
                withHandle
                className="w-1 bg-border/30 hover:accent transition-colors"
              />
            </>
          )}

          {/* Right Panel - Code Editor and Test Cases */}
          <ResizablePanel defaultSize={100 - leftPanelSize}>
            <ResizablePanelGroup
              direction={problem ? "vertical" : "horizontal"}
              className="h-full"
            >
              {/* Code Editor */}
              <ResizablePanel
                defaultSize={rightTopPanelSize}
                minSize={30}
                onResize={setRightTopPanelSize}
              >
                <div className="h-full">
                  <CodeEditor
                    selectedLanguage={selectedLanguage}
                    code={code}
                    loading={loading}
                    markers={[]}
                    annotations={[]}
                    readOnly={readOnly}
                    onCodeChange={setCode}
                    onRunCode={runCode}
                    onReset={resetCode}
                    className="h-full"
                  />
                </div>
              </ResizablePanel>

              <ResizableHandle
                withHandle
                className={`${
                  problem ? "h-1" : "h-full"
                } bg-border/30 hover:bg-accent transition-colors`}
              />

              {/* Test Cases */}
              <ResizablePanel
                defaultSize={100 - rightTopPanelSize}
                minSize={25}
              >
                <div className="h-full overflow-hidden">
                  <TestCases
                    testcases={testcases}
                    visibleTestcase={visibleTestcase}
                    results={results}
                    error={error}
                    loading={loading}
                    onVisibleTestcaseChange={setVisibleTestcase}
                    onAddTestcase={addTestcase}
                    onUpdateTestcase={updateTestcase}
                    onRemoveTestcase={removeTestcase}
                    className="h-full"
                  />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Playground;
