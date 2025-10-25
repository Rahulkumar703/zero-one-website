"use client";

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "../ui/resizable";
import Question from "./Question";
import CodeEditor from "./CodeEditor";
import TestCases from "./TestCases";
import { EditorControls } from ".";

const Playground = ({
  problem = null,
  initialCode = "",
  className = "",
  readOnly = false,
  autoComplete = true,
}) => {
  // Static panel sizes for now
  const leftPanelSize = 40;
  const rightTopPanelSize = 60;

  return (
    <div className={`bg-background text-foreground p-1 ${className}`}>
      {/* Editor Controls */}
      <EditorControls readOnly={readOnly} />

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
              >
                <div className="h-full overflow-auto">
                  <Question
                    question={problem}
                    className="h-full border-r border-border/30"
                  />
                </div>
              </ResizablePanel>
              <ResizableHandle
                withHandle
                className="w-1 bg-border/30 hover:bg-accent transition-colors"
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
              <ResizablePanel defaultSize={rightTopPanelSize} minSize={30}>
                <div className="h-full">
                  <CodeEditor
                    autoComplete={autoComplete}
                    initialCode={initialCode}
                    allowedLanguages={problem?.allowedLanguages}
                    readOnly={readOnly}
                    className="h-full"
                  />
                </div>
              </ResizablePanel>

              <ResizableHandle
                withHandle
                className={`${
                  problem ? "h-1 w-full" : "h-full w-1"
                } bg-border/30 hover:bg-accent transition-colors `}
              />

              {/* Test Cases */}
              <ResizablePanel
                defaultSize={100 - rightTopPanelSize}
                minSize={25}
              >
                <div className="h-full overflow-auto relative">
                  <TestCases
                    testcases={problem?.testCases || []}
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
