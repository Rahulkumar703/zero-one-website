"use server";

import { decodeBase64 } from "@/utils/helper";

const JUDGE0_API_URL = process.env.JUDGE0_URI;

const createSubmission = async ({
  source_code,
  language_id,
  testcases = [],
}) => {
  try {
    if (!source_code || !language_id) {
      throw new Error("Code and Language ID are required");
    }

    // If no testcases provided, create a single submission without input/output
    const submissionBody = testcases.map(({ stdin, expected_output }) => {
      return {
        source_code,
        language_id,
        stdin: stdin || null,
        expected_output: expected_output || null,
      };
    });

    const requestBody = { submissions: submissionBody };

    const response = await fetch(
      `${JUDGE0_API_URL}/submissions/batch?base64_encoded=false&wait=false`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: response.status + " Unable to create submission",
      };
    }

    return { success: true, data: result?.map((sub) => sub.token) };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const getSubmissionResult = async (token) => {
  try {
    const response = await fetch(
      `${JUDGE0_API_URL}/submissions/${token}?base64_encoded=true&fields=stdout,stderr,status,time,memory,expected_output,compile_output,finished_at,message`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: response.status + " Unable to fetch submission result",
      };
    }

    const decodedData = {
      ...result,
      stdout: result.stdout ? decodeBase64(result.stdout) : null,
      stderr: result.stderr ? decodeBase64(result.stderr) : null,
      message: result.message ? decodeBase64(result.message) : null,
      compile_output: result.compile_output
        ? decodeBase64(result.compile_output)
        : null,
      expected_output: result.expected_output
        ? decodeBase64(result.expected_output)
        : null,
    };

    // Multiple regex patterns for different language error formats
    const errorPatterns = [
      // C/C++ errors: file.cpp:line:column: error: message
      {
        regex: /^(.+?):(\d+):(\d+):\s+(error|fatal error|warning):\s+(.*)$/gm,
        parser: (match) => {
          const [, file, row, column, type, message] = match;
          return {
            file,
            row: parseInt(row),
            column: parseInt(column),
            type: type.includes("error") ? "error" : "warning",
            message: message.trim(),
          };
        },
      },

      // Java errors: file.java:line: error: message
      {
        regex: /^(.+?):(\d+):\s+(error|warning):\s+(.*)$/gm,
        parser: (match) => {
          const [, file, row, type, message] = match;
          return {
            file,
            row: parseInt(row),
            column: 0,
            type,
            message: message.trim(),
          };
        },
      },

      // Python errors: File "file.py", line N
      {
        regex: /File\s+"(.+?)",\s+line\s+(\d+)/gm,
        parser: (match) => {
          const [, file, row] = match;
          return {
            file,
            row: parseInt(row),
            column: 0,
            type: "error",
            message: "Python error",
          };
        },
      },
      // JavaScript runtime errors: file.js:line\n...^\nErrorType: message
      {
        regex: /^(.+?):(\d+)(?::\d+)?$/gm,
        parser: (match) => {
          const [, file, row] = match;
          return {
            file,
            row: parseInt(row),
            column: 0,
            type: "error",
            message: "JavaScript runtime error",
          };
        },
      },
      // TypeScript errors: file.ts(line,column): error TSxxxx: message
      {
        regex: /^(.+?)\((\d+),(\d+)\):\s+(error|warning)\s+TS\d+:\s+(.*)$/gm,
        parser: (match) => {
          const [, file, row, column, type, message] = match;
          return {
            file,
            row: parseInt(row),
            column: parseInt(column),
            type,
            message: message.trim(),
          };
        },
      },

      // SQL errors: Error: near line N: message
      {
        regex: /Error:\s+near\s+line\s+(\d+):\s+(.*)$/gm,
        parser: (match) => {
          const [, row, message] = match;
          return {
            file: "script.sql",
            row: parseInt(row),
            column: 0,
            type: "error",
            message: message.trim(),
          };
        },
      },

      // Generic SQL errors: Error: message
      {
        regex: /Error:\s+(.*)$/gm,
        parser: (match) => {
          const [, message] = match;
          return {
            file: "script.sql",
            row: 1,
            column: 0,
            type: "error",
            message: message.trim(),
          };
        },
      },
    ];

    if (decodedData.compile_output === null) {
      return { success: true, data: decodedData };
    }

    // Parse errors using all patterns
    let parsed = [];
    for (const pattern of errorPatterns) {
      const matches = [...decodedData.compile_output.matchAll(pattern.regex)];
      if (matches.length > 0) {
        parsed = matches.map(pattern.parser);
        break; // Use the first pattern that matches
      }
    }

    // If no patterns matched, try to parse stderr as well
    if (parsed.length === 0 && decodedData.stderr) {
      for (const pattern of errorPatterns) {
        const matches = [...decodedData.stderr.matchAll(pattern.regex)];
        if (matches.length > 0) {
          parsed = matches.map(pattern.parser);
          break;
        }
      }
    }

    decodedData.annotations = parsed.map(({ row, column, type, message }) => ({
      row: Math.max(0, row - 1), // Ensure row is not negative
      column: Math.max(0, column - 1), // Ensure column is not negative
      type: type === "warning" ? "warning" : "error",
      text: message,
    }));

    decodedData.markers = parsed.map(({ row, column }) => ({
      startRow: Math.max(0, row - 1),
      startCol: 0, // Always start from beginning of line
      endRow: Math.max(0, row - 1),
      endCol: Number.MAX_SAFE_INTEGER, // Extend to end of line
      className: "error-marker",
      type: "text",
    }));

    // If no specific errors were parsed but there's an error output, create a general annotation
    if (
      parsed.length === 0 &&
      (decodedData.compile_output || decodedData.stderr)
    ) {
      const errorMessage = decodedData.compile_output || decodedData.stderr;
      decodedData.annotations = [
        {
          row: 0,
          column: 0,
          type: "error",
          text: errorMessage.split("\n")[0] || "Compilation/Runtime Error",
        },
      ];
      decodedData.markers = [
        {
          startRow: 0,
          startCol: 0, // Start from beginning of line
          endRow: 0,
          endCol: Number.MAX_SAFE_INTEGER, // Extend to end of line
          className: "error-marker",
          type: "text",
        },
      ];
    }

    return { success: true, data: decodedData };
  } catch (error) {
    console.error("Error fetching submission result:", error);
    return { success: false, error: error.message };
  }
};

export { createSubmission, getSubmissionResult };
