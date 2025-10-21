import { decodeBase64 } from "@/utils/helper";
import { NextResponse } from "next/server";

const LANGUAGE_ID = {
  c: 50,
  cpp: 54,
  java: 62,
  python: 71,
  javascript: 63,
  // TODO: Verify the language ID for SQL
  sql: 60,
};

export const POST = async (req) => {
  try {
    const reqBody = await req.json();

    // Validate request body
    const { code, testCases, language } = reqBody;

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        {
          message: "Code is required and must be a string.",
          success: false,
          type: "error",
        },
        { status: 400 }
      );
    }

    if (!testCases || !Array.isArray(testCases) || !testCases.length) {
      return NextResponse.json(
        {
          message: "Test cases are required and must be a non-empty array.",
          success: false,
          type: "error",
        },
        { status: 400 }
      );
    }

    if (!language || typeof language !== "string") {
      return NextResponse.json(
        {
          message: "Language is required and must be a string.",
          success: false,
          type: "error",
        },
        { status: 400 }
      );
    }

    // Prepare payload for submissions
    const payload = testCases.map((testCase) => {
      const { stdin, expected_output } = testCase;

      // Validate each test case
      if (typeof stdin !== "string" || typeof expected_output !== "string") {
        throw new Error(
          "Each test case must have valid input and output as strings."
        );
      }

      return {
        source_code: code,
        language_id: LANGUAGE_ID[language],
        stdin,
        expected_output,
      };
    });

    // Send the request to the Judge0 API
    const res = await fetch(
      `${process.env.JUDGE0_URI}/submissions/batch?base64_encoded=false&wait=false`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ submissions: payload }),
      }
    );

    // Check if the response is OK
    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(
        {
          message: errorData.message || "Failed to submit code for execution.",
          success: false,
          type: "error",
        },
        { status: res.status }
      );
    }

    const data = await res.json();

    return NextResponse.json(
      {
        tokens: data,
        message: "Submissions processed successfully.",
        success: true,
        type: "success",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json(
      {
        message: error.message || "An unexpected error occurred.",
        success: false,
        type: "error",
      },
      { status: 500 }
    );
  }
};

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({
        message: "Invalid Submission token",
        success: false,
        type: "error",
      });
    }

    const res = await fetch(
      `${process.env.JUDGE0_URI}/submissions/${token}?base64_encoded=true&fields=stdout,stderr,status,time,memory,expected_output,compile_output,finished_at,message`
    );

    console.log(token);

    const data = await res.json();

    if (data?.error) {
      return NextResponse.json(
        {
          message: data.error,
          success: false,
          type: "error",
        },
        { status: 400 }
      );
    }

    // Decode outputs if they exist
    const decodedData = {
      ...data,
      stdout: data.stdout ? decodeBase64(data.stdout) : null,
      stderr: data.stderr ? decodeBase64(data.stderr) : null,
      message: data.message ? decodeBase64(data.message) : null,
      compile_output: data.compile_output
        ? decodeBase64(data.compile_output)
        : null,
      expected_output: data.expected_output
        ? decodeBase64(data.expected_output)
        : null,
    };

    return NextResponse.json(
      {
        data: decodedData,
        message: "Code Compiled",
        success: true,
        type: "success",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: error.message || "An unexpected error occurred.",
        success: false,
        type: "error",
      },
      { status: 500 }
    );
  }
};
