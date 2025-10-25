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

    const lineRegex =
      /^(.+?):(\d+):(\d+):\s+(error|fatal error|warning):\s+(.*)$/gm;

    if (decodedData.compile_output === null) {
      return { success: true, data: decodedData };
    }

    const parsed = [...decodedData.compile_output.matchAll(lineRegex)].map(
      (match) => {
        const [, file, row, column, type, message] = match;
        return {
          file,
          row: parseInt(row),
          column: parseInt(column),
          type,
          message: message.trim(),
        };
      }
    );

    decodedData.annotations = parsed.map(({ row, column, type, message }) => ({
      row: row - 1,
      column: column - 1,
      type,
      text: message,
    }));

    decodedData.markers = parsed.map(({ row, column }) => ({
      startRow: row - 1,
      startCol: 0,
      endRow: row - 1,
      endCol: column - 1,
      className: "error-marker",
      type: "text",
    }));

    return { success: !decodedData.stderr, data: decodedData };
  } catch (error) {
    console.error("Error fetching submission result:", error);
    return { success: false, error: error.message };
  }
};

export { createSubmission, getSubmissionResult };
