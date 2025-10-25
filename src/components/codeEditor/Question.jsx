"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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

  return (
    <Card className="h-full border-border/30 bg-background">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-foreground">
            {question.title}
          </CardTitle>
          {question.difficulty && (
            <Badge className={getDifficultyColor(question.difficulty)}>
              {question.difficulty}
            </Badge>
          )}
        </div>
        {question.tags && question.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {question.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Problem Description */}
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <div
            className="text-foreground/90 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: question.description || question.statement,
            }}
          />
        </div>

        {/* Examples */}
        {question.examples && question.examples.length > 0 && (
          <div className="space-y-4">
            <Separator />
            <h3 className="font-semibold text-foreground">Examples:</h3>
            {question.examples.map((example, index) => (
              <div key={index} className="space-y-2">
                <h4 className="font-medium text-sm text-foreground/80">
                  Example {index + 1}:
                </h4>
                <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                  {example.input && (
                    <div>
                      <span className="font-medium text-sm">Input: </span>
                      <code className="bg-background/50 px-2 py-1 rounded text-sm">
                        {example.input}
                      </code>
                    </div>
                  )}
                  {example.output && (
                    <div>
                      <span className="font-medium text-sm">Output: </span>
                      <code className="bg-background/50 px-2 py-1 rounded text-sm">
                        {example.output}
                      </code>
                    </div>
                  )}
                  {example.explanation && (
                    <div>
                      <span className="font-medium text-sm">Explanation: </span>
                      <span className="text-sm text-foreground/80">
                        {example.explanation}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Constraints */}
        {question.constraints && question.constraints.length > 0 && (
          <div className="space-y-2">
            <Separator />
            <h3 className="font-semibold text-foreground">Constraints:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-foreground/80">
              {question.constraints.map((constraint, index) => (
                <li key={index}>{constraint}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Additional Info */}
        {(question.timeLimit || question.memoryLimit) && (
          <div className="space-y-2">
            <Separator />
            <div className="flex gap-4 text-sm text-foreground/70">
              {question.timeLimit && (
                <span>Time Limit: {question.timeLimit}</span>
              )}
              {question.memoryLimit && (
                <span>Memory Limit: {question.memoryLimit}</span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Question;
