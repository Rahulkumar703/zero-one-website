"use client";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import CodeEditor from "./CodeEditor";
import CodeExecuter from "./CodeExecuter";
import { Question } from "./Question";
import { PlaygroundProvider } from "@/context/playground";
import OutputResult from "./OutputResult";

const Playground = ({ question }) => {
  return (
    <PlaygroundProvider>
      <div className="h-full p-2">
        <PanelGroup
          autoSaveId="question-editor"
          direction="horizontal"
          className="h-full gap-1"
        >
          <Panel
            minSize={30}
            className="h-[calc(100vh-84px-16px)] rounded-2xl overflow-hidden bg-white/5 border border-white/5"
            defaultSize={50}
          >
            <Question question={question} />
          </Panel>

          <PanelResizeHandle className="bg-transparent relative w-[3px] before:w-[1px] before:h-inherit hover:before:bg-accent before:rounded-full before:transition-colors shrink-0" />

          <Panel defaultSize={50} minSize={30}>
            <PanelGroup
              autoSaveId="editor-output"
              direction="vertical"
              className="h-full gap-1"
            >
              <Panel
                minSize={40}
                className="bg-white/5 border border-white/5 rounded-2xl"
                defaultSize={70}
              >
                <CodeExecuter
                  questionId={question._id}
                  allowedLanguages={question.allowedLanguages}
                />
                <CodeEditor />
              </Panel>

              <PanelResizeHandle className="bg-transparent relative h-[3px] before:h-[1px] before:h-inherit hover:before:bg-accent before:rounded-full before:transition-colors shrink-0" />

              <Panel
                minSize={20}
                className="bg-white/5 border border-white/5 rounded-2xl"
                defaultSize={30}
              >
                <OutputResult />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </PlaygroundProvider>
  );
};

export default Playground;
