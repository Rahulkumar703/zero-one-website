"use server";

import QuizQuestion from "@/models/QuizQuestion";
import connect from "@/utils/dbConnect";
import { revalidatePath } from "next/cache";
import { validateQuizQuestionForm } from "@/lib/validators";
import { cache } from "react";
import { convertIdsToString } from "@/utils/helper";

export const getQuizQuestions = cache(async (fields) => {
  try {
    await connect();

    const questions = await QuizQuestion.find({})
      .select(fields)
      .sort({ created_at: -1 })
      .lean();

    return {
      questions: convertIdsToString(questions),
      type: "success",
      success: true,
    };
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    return { message: error.message, type: "error", success: false };
  }
});

export const addQuizQuestion = async (questionData) => {
  try {
    await connect();

    const {
      name,
      slug,
      description,
      point,
      difficulty,
      questionSnippet,
      correctCodeSnippet,
      optionsEnabled,
      options,
      questionType,
      answerType,
      codeLanguage,
    } = questionData;

    validateQuizQuestionForm(questionData);

    const payload =
      questionType === "DEBUGGING"
        ? {
            name,
            slug,
            description,
            point,
            difficulty,
            questionSnippet,
            ...(optionsEnabled ? { options } : { correctCodeSnippet }),
            codeLanguage,
            questionType,
            answerType,
          }
        : {
            name,
            slug,
            description,
            point,
            difficulty,
            questionType,
            options,
            answerType,
          };

    // Create new question
    await QuizQuestion.create(payload);

    // Invalidate caches
    revalidatePath("/events/contests");
    revalidatePath("/events/contests/questions");

    return {
      message: "Quiz question successfully added",
      type: "success",
      success: true,
    };
  } catch (error) {
    console.error("Failed to add quiz question:", error);
    return { message: error.message, type: "error", success: false };
  }
};

// export const updateQuizQuestion = async (question) => {
//   try {
await connect();

//     const { _id, name, desc, point, difficulty, link } = question;

//     const updatedQuestion = await QuizQuestion.updateOne(
//       { _id },
//       { $set: { name, desc, point, difficulty, link } }
//     );

//     return {
//       message: "Question Updated",
//       question: updatedQuestion,
//       type: "success",
//       success: true,
//     };
//   } catch (error) {
//     console.log(error);
//     return { message: error.message, type: "error", success: false };
//   }
// };

export const deleteQuizQuestion = async (questionId) => {
  try {
    await connect();

    await QuizQuestion.deleteOne({ _id: questionId });
    revalidatePath("/events/contests");
    revalidatePath("/events/contests/questions");
    return { message: "Question deleted", type: "success", success: true };
  } catch (error) {
    console.log(error);
    return { message: error.message, type: "error", success: false };
  }
};
