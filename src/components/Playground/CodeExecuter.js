"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { usePlayground } from "@/context/playground";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { LoaderCircle, Palette, Triangle } from "lucide-react";
import { toast } from "sonner";

const LANGUAGE_MAP = {
  c: "C (GCC 9.2.0)",
  cpp: "C++ (GCC 9.2.0)",
  java: "Java (OpenJDK 9)",
  javascript: "JavaScript (Node 12.14.0)",
  python: "Python (3.8.1)",
  sql: "SQL (SQLite 3.27.2)",
  html: "HTML (HTML5)",
  css: "CSS (CSS3)",
};

const CodeExecuter = ({ testCases, allowedLanguages }) => {
  const { language, setLanguage, runCode, loading, theme, setTheme, error } =
    usePlayground();
  const [selectedLanguage, setSelectedLanguage] = useState(language);

  useEffect(() => {
    setSelectedLanguage(language);
  }, [language]);

  // useEffect(() => {
  //   const handleKeyPress = (e) => {
  //     if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "n") {
  //       executeCode();
  //     }
  //   };

  //   document.addEventListener("keydown", handleKeyPress);
  //   return () => document.removeEventListener("keydown", handleKeyPress);
  // }, []);

  const handleLanguageChange = (value) => {
    setLanguage(value);
    setSelectedLanguage(value);
  };

  const executeCode = async () => {
    try {
      await runCode(testCases);
      if (error) {
        toast.error(error);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 p-2 bg-secondary">
      <Select value={theme} onValueChange={setTheme}>
        <SelectTrigger className="max-w-min">
          <Palette className="w-4 h-4 fill-none stroke-foreground mr-2" />
          {/* <SelectValue placeholder="Theme" /> */}
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="github">Github</SelectItem>
          <SelectItem value="monokai">Monokai</SelectItem>
          <SelectItem value="xcode">Xcode</SelectItem>
        </SelectContent>
      </Select>
      <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger className="">
          <SelectValue placeholder="Select Language" />
        </SelectTrigger>
        <SelectContent>
          {allowedLanguages.map((lang) => (
            <SelectItem key={lang} value={lang}>
              {LANGUAGE_MAP[lang] || lang}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex gap-2">
        <Button
          size="icon"
          className={"font-semibold bg-transparent"}
          onClick={executeCode}
          disabled={loading}
        >
          {loading ? (
            <LoaderCircle className="w-6 h-6 animate-spin fill-transparent stroke-foreground" />
          ) : (
            <Triangle className="w-4 h-4 rotate-90 fill-foreground " />
          )}
        </Button>
        {/* <Button
          size="sm"
          className="bg-green-400 hover:bg-green-400/80 text-primary font-semibold"
          disabled={loading}
        >
          Submit
        </Button> */}
      </div>
    </div>
  );
};

export default CodeExecuter;
