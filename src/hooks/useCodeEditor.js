"use client";

import { useState, useCallback } from "react";
import { createSubmission, getSubmissionResult } from "@/action/playground";
import { toast } from "sonner";
import { languageConfigs } from "@/components/codeEditor/editorConfigs";

export const useCodeEditor = ({
  initialLanguage = "javascript",
  initialCode = "",
  questionTestcases = [{ stdin: null, expected_output: null }],
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage);
  const [code, setCode] = useState(
    initialCode || languageConfigs[initialLanguage]?.defaultCode || ""
  );
  const [testcases, setTestcases] = useState(questionTestcases || []);
  const [visibleTestcase, setVisibleTestcase] = useState(0);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [annotations, setAnnotations] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLanguageChange = useCallback(
    (newLanguage) => {
      setSelectedLanguage(newLanguage);
      if (!initialCode) {
        setCode(languageConfigs[newLanguage]?.defaultCode || "");
      }
    },
    [initialCode]
  );

  const handleCodeChange = useCallback((value) => {
    setCode(value);
  }, []);

  const addTestcase = useCallback(() => {
    setTestcases((prev) => [...prev, { stdin: "", expected_output: "" }]);
  }, []);

  const updateTestcase = useCallback((index, field, value) => {
    setTestcases((prev) => {
      const newTestcases = [...prev];
      newTestcases[index] = { ...newTestcases[index], [field]: value };
      return newTestcases;
    });
  }, []);

  const removeTestcase = useCallback(
    (index) => {
      if (testcases.length > 1) {
        setTestcases((prev) => prev.filter((_, i) => i !== index));
        if (visibleTestcase >= testcases.length - 1) {
          setVisibleTestcase(Math.max(0, testcases.length - 2));
        }
      }
    },
    [testcases.length, visibleTestcase]
  );

  const runCode = useCallback(async () => {
    try {
      setLoading(true);

      // Validation
      if (!code || code.trim() === "") {
        toast.error("Please write some code before running!");
        return;
      }

      if (!languageConfigs[selectedLanguage]?.id) {
        toast.error("Invalid language selected!");
        return;
      }

      const submissionData = {
        source_code: code.trim(),
        language_id: languageConfigs[selectedLanguage].id,
        testcases,
      };

      const submissionResponse = await createSubmission(submissionData);
      if (!submissionResponse.success) {
        toast.error(submissionResponse.message);
        return;
      }

      const tokens = submissionResponse?.data || [];

      // Clear previous state
      setAnnotations([]);
      setMarkers([]);
      setError(null);
      setResults([]);

      const polling = async (callback) => {
        while (true) {
          const response = await callback();
          if (
            (response?.data?.status && response.data.status.id >= 3) ||
            response?.error
          ) {
            return response;
          }
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      };

      // Check first testcase result for compilation errors
      if (tokens.length > 0) {
        const firstResult = await polling(() => getSubmissionResult(tokens[0]));

        setResults([firstResult.data]);

        // If there are compilation errors, set them and cancel other calls
        if (
          firstResult?.data?.annotations &&
          firstResult.data.annotations.length > 0
        ) {
          setError({
            message: firstResult.data.message || "Compilation Error",
            stderr: firstResult.data.stderr,
            compile_output: firstResult.data.compile_output,
          });
          setAnnotations(firstResult.data.annotations);

          if (firstResult.data.markers && firstResult.data.markers.length > 0) {
            setMarkers(firstResult.data.markers);
          }

          toast.error(
            "Compilation Error: Check the highlighted lines in your code"
          );
          return;
        }

        // If no compilation errors, continue with remaining testcases
        const remainingTokens = tokens.slice(1);
        const remainingResults = await Promise.all(
          remainingTokens.map((token) =>
            polling(() => getSubmissionResult(token))
          )
        );

        setResults((prev) => [
          ...prev,
          ...remainingResults.map((res) => res.data),
        ]);

        toast.success(
          `Code executed successfully on ${tokens.length} testcase(s)!`
        );
      }
    } catch (error) {
      toast.error("Error running code: " + error.message);
      console.error("Code execution error:", error);
    } finally {
      setLoading(false);
    }
  }, [code, selectedLanguage, testcases]);

  const resetEditor = useCallback(() => {
    setCode(languageConfigs[selectedLanguage]?.defaultCode || "");
    setResults([]);
    setError(null);
    setMarkers([]);
    setAnnotations([]);
  }, [selectedLanguage]);

  return {
    // State
    selectedLanguage,
    code,
    testcases,
    visibleTestcase,
    results,
    error,
    markers,
    annotations,
    loading,

    // Actions
    handleLanguageChange,
    setCode: handleCodeChange,
    setVisibleTestcase,
    addTestcase,
    updateTestcase,
    removeTestcase,
    runCode,
    resetCode: resetEditor,
  };
};
