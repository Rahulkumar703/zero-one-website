"use client";

import { useEffect } from "react";
import AceEditor from "react-ace";
import { languageConfigs } from "./editorConfigs";
import "./editorConfigs";
import {
  useCodeEditorCode,
  useCodeEditorLanguage,
  useCodeEditorLoading,
  useCodeEditorSetCode,
  useCodeEditorRunCode,
  useCodeEditorResetCode,
  useCodeEditorInitialize,
  useCodeEditorAnnotations,
  useCodeEditorMarkers,
  useCodeEditorShowLineNumbers,
  useCodeEditorShowGutter,
  useCodeEditorHighlightActiveLine,
  useCodeEditorShowPrintMargin,
  useCodeEditorSubmitCode,
} from "../../stores/codeEditorStore";

// Import language modes
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-typescript";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-sql";

// Import extensions
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/ext-searchbox";

const CodeEditor = ({
  // Props from Playground
  initialCode = "",
  allowedLanguages,
  // Editor config
  fontSize = 14,
  readOnly = false,
  autoComplete = true,
  // Styling
  className = "",
  height = "100%",
}) => {
  // Get state directly from Zustand store
  const code = useCodeEditorCode();
  const language = useCodeEditorLanguage();
  const loading = useCodeEditorLoading();

  // Get annotations and markers from store
  const annotations = useCodeEditorAnnotations();
  const markers = useCodeEditorMarkers();
  const showLineNumbers = useCodeEditorShowLineNumbers();
  const showGutter = useCodeEditorShowGutter();
  const highlightActiveLine = useCodeEditorHighlightActiveLine();
  const showPrintMargin = useCodeEditorShowPrintMargin();

  // Get actions from store
  const setCode = useCodeEditorSetCode();
  const runCode = useCodeEditorRunCode();
  const submitCode = useCodeEditorSubmitCode();
  const resetCode = useCodeEditorResetCode();
  const initializeEditor = useCodeEditorInitialize();

  // Initialize the editor store when component mounts or props change
  useEffect(() => {
    initializeEditor(initialCode, allowedLanguages);
  }, [
    initialCode,
    JSON.stringify(allowedLanguages),
    initializeEditor,
    language,
  ]);

  return (
    <div
      className={`border border-border/30 bg-background rounded-lg overflow-hidden ${className}`}
    >
      <AceEditor
        mode={languageConfigs[language]?.mode || "javascript"}
        theme="ZERO_ONE"
        value={code}
        onChange={setCode}
        name="code-editor"
        editorProps={{ $blockScrolling: true }}
        fontSize={fontSize}
        width="100%"
        height={height}
        readOnly={readOnly || loading}
        annotations={annotations}
        markers={markers}
        setOptions={{
          enableBasicAutocompletion: autoComplete,
          enableLiveAutocompletion: autoComplete,
          enableSnippets: autoComplete,
          showLineNumbers: showLineNumbers,
          tabSize: 4,
          useWorker: false,
          wrap: true,
          highlightActiveLine: highlightActiveLine,
          highlightSelectedWord: true,
          cursorStyle: "smooth",
          mergeUndoDeltas: true,
          autoScrollEditorIntoView: undefined,
          copyWithEmptySelection: false,
          printMargin: showPrintMargin,
        }}
        showGutter={showGutter}
        commands={[
          {
            name: "runCode",
            bindKey: { win: "Ctrl-R", mac: "Cmd-R" },
            exec: () => {
              if (!loading) {
                runCode();
              }
            },
          },
          {
            name: "submitCode",
            bindKey: { win: "Ctrl-S", mac: "Cmd-S" },
            exec: () => {
              if (!loading) {
                submitCode();
              }
            },
          },
          {
            name: "resetCode",
            bindKey: { win: "Ctrl-Shift-R", mac: "Cmd-Shift-R" },
            exec: () => {
              if (!loading) {
                resetCode();
              }
            },
          },
        ]}
      />
    </div>
  );
};

export default CodeEditor;
