"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { defaultCode } from "@/components/Playground/defaultCodeTemplate";
import { decodeBase64 } from "@/utils/helper";
import { set } from "mongoose";
import { time } from "framer-motion";

const initialState = {
  theme: "github",
  setTheme: () => {},
  code: "",
  setCode: () => {},
  language: "cpp",
  testCases: [],
  setTestCases: () => {},
  setLanguage: () => {},
  output: "",
  loading: false,
  runCode: async () => {},
  error: "",
};

const PlaygroundContext = createContext(initialState);

export const PlaygroundProvider = ({ children }) => {
  const [language, setLanguage] = useState("cpp");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [testCases, setTestCases] = useState([]);
  const [theme, setTheme] = useState("github");
  const [code, setCode] = useState("");

  useEffect(() => {
    setCode(defaultCode[language]);
  }, [language]);

  const runCode = async () => {
    try {
      setTestCases((prev) =>
        prev.map((tc) => ({ ...tc, status: "Running", code_output: "" }))
      );

      setLoading(true);
      setError("");

      if (!code) {
        throw new Error("Can't run empty code.");
      }

      // Step 1: Submit the code
      const res = await fetch("/api/playground", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          language,
          testCases,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message);
        return;
      }

      const tokens = data.tokens; // Assuming tokens is an array of tokens
      // Poll in client (not serverless function)
      tokens.forEach((t, index) => pollResult(t.token, index));

      // const updatedTestCases = testCases.map((testCase, index) => ({
      //   ...testCase,
      //   token: tokens[index]?.token, // Ensure token exists
      // }));

      // setTestCases(updatedTestCases);

      // // Step 3: Poll each test case's token
      // await Promise.all(
      //   updatedTestCases.map(async (testCase, index) => {
      //     const token = testCase.token;

      //     while (true) {
      //       const response = await fetch(`/api/playground?token=${token}`);
      //       const result = await response.json();

      //       if (result?.data?.status?.id >= 3) {
      //         const code_output =
      //           result.data.stdout ||
      //           result.data.stderr ||
      //           result.data.compile_output ||
      //           "No Output";

      //         // Update the specific test case
      //         setTestCases((prev) =>
      //           prev.map((tc, i) =>
      //             i === index
      //               ? {
      //                   ...tc,
      //                   code_output,
      //                   status: result.data.status.description,
      //                   time: result.data.time,
      //                 }
      //               : tc
      //           )
      //         );
      //         break;
      //       }
      //       // Handle potential errors in the result
      //       if (result?.error) {
      //         setTestCases((prev) =>
      //           prev.map((tc, i) =>
      //             i === index
      //               ? {
      //                   ...tc,
      //                   code_output: result.error,
      //                   status: "Error",
      //                 }
      //               : tc
      //           )
      //         );
      //         break;
      //       }

      //       // Wait before polling again
      //       await new Promise((resolve) => setTimeout(resolve, 1000));
      //     }
      //   })
      // );
    } catch (error) {
      setError(error.message);
    }
  };
  // Client-side polling
  const pollResult = async (token, index) => {
    try {
      let completed = false;

      while (!completed) {
        const res = await fetch(`/api/playground?token=${token}`);
        const result = await res.json();

        console.log(result, res);

        if (result?.data?.status?.id >= 3) {
          const output =
            result.data.stdout ||
            result.data.stderr ||
            result.data.compile_output ||
            "No Output";

          setTestCases((prev) =>
            prev.map((tc, i) =>
              i === index
                ? {
                    ...tc,
                    message: result.data.message,
                    time: result.data.time,
                    code_output: output,
                    status: result.data.status.description,
                  }
                : tc
            )
          );

          completed = true;
        } else {
          await new Promise((res) => setTimeout(res, 1000)); // wait 1s
        }
      }
    } catch (err) {
      setError("Polling failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PlaygroundContext.Provider
      value={{
        code,
        setCode,
        language,
        theme,
        setTheme,
        setLanguage,
        loading,
        runCode,
        error,
        testCases,
        setTestCases,
      }}
    >
      {children}
    </PlaygroundContext.Provider>
  );
};

export const usePlayground = () => {
  return useContext(PlaygroundContext);
};
