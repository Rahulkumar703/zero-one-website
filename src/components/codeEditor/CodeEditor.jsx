"use client";

import AceEditor from "react-ace";
import { languageConfigs } from "./editorConfigs";
import "./editorConfigs";

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
  // Editor state
  selectedLanguage,
  code,
  markers = [],
  annotations = [],
  loading = false,

  // Editor config  
  fontSize = 14,
  readOnly = false,
  autocomplete = true,

  // Event handlers
  onCodeChange,
  onRunCode,
  onReset,

  // Styling
  className = "",
  height = "100%",
}) => {
  return (
    <div
      className={`border border-border/30 bg-background rounded-lg overflow-hidden ${className}`}
    >
      <AceEditor
        mode={languageConfigs[selectedLanguage]?.mode || "javascript"}
        theme="ZERO_ONE"
        value={code}
        onChange={onCodeChange}
        markers={markers}
        annotations={annotations}
        name="code-editor"
        editorProps={{ $blockScrolling: true }}
        fontSize={fontSize}
        width="100%"
        height={height}
        readOnly={readOnly || loading}
        setOptions={{
          enableBasicAutocompletion: autocomplete,
          enableLiveAutocompletion: autocomplete,
          enableSnippets: autocomplete,
          showLineNumbers: true,
          tabSize: 4,
          useWorker: false,
          wrap: true,
          highlightActiveLine: true,
          highlightSelectedWord: true,
          cursorStyle: "smooth",
          mergeUndoDeltas: true,
          autoScrollEditorIntoView: undefined,
          copyWithEmptySelection: false,
          printMargin: false,
        }}
        showGutter={true}
        commands={[
          {
            name: "runCode",
            bindKey: { win: "Ctrl-R", mac: "Cmd-R" },
            exec: () => {
              if (onRunCode && !loading) {
                onRunCode();
              }
            },
          },
          {
            name: "resetCode",
            bindKey: { win: "Ctrl-Shift-R", mac: "Cmd-Shift-R" },
            exec: () => {
              if (onReset && !loading) {
                onReset();
              }
            },
          },
        ]}
      />
    </div>
  );
};

export default CodeEditor;
