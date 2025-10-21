"use client";
import { usePlayground } from "@/context/playground";
import { useEffect } from "react";
import Markdown from "../markdown/Markdown";

export const Question = ({ question }) => {
  const { setTestCases } = usePlayground();

  useEffect(() => {
    const initialTestCases = question.testCases.map((testCase) => ({
      stdin: testCase.input,
      expected_output: testCase.output,
      code_output: "",
      status: "Idle",
      message: "",
      token: "",
      time: null,
    }));
    setTestCases(initialTestCases);
  }, [question.testCases, setTestCases]);

  const difficultyColor = () => {
    switch (question?.difficulty) {
      case "easy":
        return "text-green-500";
      case "medium":
        return "text-orange-500";
      default:
        return "text-red-600";
    }
  };

  return (
    <div className={`flex flex-col h-full gap-2 overflow-y-auto`}>
      <div className="bg-secondary p-4">
        <h1 className="font-bold text-xl">{question?.name}</h1>
      </div>
      <div className="p-2 flex flex-col gap-4 pb-4">
        <div className="">
          <Markdown>{question?.description}</Markdown>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-6 ml-auto">
            <p
              className={`font-medium capitalize ${difficultyColor()} font-medium`}
            >
              {question?.difficulty}
            </p>
            <p className="text-foreground/60 font-medium">
              {question?.point} Point
            </p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-foreground/50">Input Format:</h4>

          <div className="bg-foreground/5 rounded-xl p-2 ">
            <Markdown>{question?.inputFormat}</Markdown>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-foreground/50">Output Format:</h4>
          <div className=" p-2 bg-foreground/5 rounded-xl">
            <Markdown>{question?.outputFormat}</Markdown>
          </div>
        </div>

        {question?.testCases.map((testCase, index) => {
          return (
            <div key={index} className={`space-y-2`}>
              <h4 className="font-semibold text-foreground/50">
                Example {index + 1}:
              </h4>
              <div className="p-4 border-l-2 space-y-4">
                <div className="flex flex-col gap-2 flex-wrap">
                  <div className="font-medium text-foreground/50">Input</div>
                  {testCase?.input ? (
                    <div className="font-medium">
                      <Markdown>{testCase.input}</Markdown>
                    </div>
                  ) : (
                    <p key={index} className="font-medium">
                      No Input
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2 flex-wrap">
                  <div className="font-medium text-foreground/50">Output</div>
                  {testCase?.output ? (
                    <div className="font-medium">
                      <Markdown>{testCase.output}</Markdown>
                    </div>
                  ) : (
                    <p key={index} className="font-medium">
                      No Output
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        <div>
          <h4 className="font-semibold text-foreground/50">Constraints:</h4>
          <div className=" p-2 bg-foreground/5 rounded-xl">
            <Markdown>{question?.constraints}</Markdown>
          </div>
        </div>
      </div>
    </div>
  );
};
