"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Markdown from "@/components/markdown/Markdown";

const Question = ({ question }) => {
  if (!question) return null;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "bg-green-500/20 text-green-500 border-green-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
      case "hard":
        return "bg-red-500/20 text-red-500 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-500 border-gray-500/30";
    }
  };

  // Get public test cases for examples

  return (
    <Card className="h-full border-border/30 bg-background">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-foreground">
            {question.name}
          </CardTitle>
          <div className="flex items-center gap-2">
            {question.point && (
              <Badge variant="outline" className="text-xs">
                {question.point} pts
              </Badge>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-2 uppercase">
          {question.difficulty && (
            <Badge className={getDifficultyColor(question.difficulty)}>
              {question.difficulty}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Problem Description */}
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <div className="text-foreground/90 leading-relaxed">
            <Markdown>{question.description}</Markdown>
          </div>
        </div>

        {/* Input/Output Format */}
        {(question.inputFormat || question.outputFormat) && (
          <div className="space-y-3">
            <Separator className="bg-border/50" />
            {question.inputFormat && (
              <div>
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                  Input Format:
                </h3>
                <div className="text-sm text-muted-foreground leading-relaxed bg-muted/50 p-3 rounded-lg border-l-4 border-muted-foreground/50">
                  <Markdown>{question.inputFormat}</Markdown>
                </div>
              </div>
            )}
            {question.outputFormat && (
              <div>
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                  Output Format:
                </h3>
                <div className="text-sm text-muted-foreground leading-relaxed bg-muted/50 p-3 rounded-lg border-l-4 border-muted-foreground/50">
                  <Markdown>{question.outputFormat}</Markdown>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Examples from public test cases */}
        {question.testCases.length > 0 && (
          <div className="space-y-4">
            <Separator className="bg-border/50" />
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
              Examples:
            </h3>
            {question.testCases.map((testCase, index) => (
              <div key={index} className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                  <div className="w-6 h-6 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  Example {index + 1}:
                </h4>
                <div className="bg-muted/30 rounded-lg p-4 space-y-3 border border-border">
                  <div className="flex flex-col items-start space-y-1">
                    <span className="font-medium text-sm text-foreground flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full"></div>
                      Input:
                    </span>
                    <pre className="bg-background px-3 py-2 rounded-md text-sm whitespace-pre-wrap w-full border border-border text-foreground font-mono">
                      {testCase.input}
                    </pre>
                  </div>
                  <div className="flex flex-col items-start space-y-1">
                    <span className="font-medium text-sm text-foreground flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full"></div>
                      Output:
                    </span>
                    <pre className="bg-background px-3 py-2 rounded-md text-sm whitespace-pre-wrap w-full border border-border text-foreground font-mono">
                      {testCase.output}
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Constraints */}
        {question.constraints && (
          <div className="space-y-2">
            <Separator className="bg-border/50" />
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
              Constraints:
            </h3>
            <div className="text-sm text-muted-foreground leading-relaxed bg-muted/50 p-3 rounded-lg border-l-4 border-muted-foreground/50">
              <Markdown>{question.constraints}</Markdown>
            </div>
          </div>
        )}

        {/* Additional Info */}
        {(question.timeLimit || question.memoryLimit) && (
          <div className="space-y-2">
            <Separator className="bg-border/50" />
            <div className="flex gap-4 text-sm">
              {question.timeLimit && (
                <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-lg border border-border">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                  <span className="text-foreground font-medium">
                    Time Limit:{" "}
                    <span className="font-bold">{question.timeLimit}s</span>
                  </span>
                </div>
              )}
              {question.memoryLimit && (
                <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-lg border border-border">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                  <span className="text-foreground font-medium">
                    Memory Limit:{" "}
                    <span className="font-bold">{question.memoryLimit}MB</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Question;
