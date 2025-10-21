"use server";

import CodingQuestion from "@/models/CodingQuestion";
import connect from "@/utils/dbConnect";
import { convertIdsToString } from "@/utils/helper";
import { cache } from "react";

export const getCodingQuestions = cache(async () => {
  try {
    await connect();

    const questions = await CodingQuestion.find({})
      .select("_id name slug difficulty description")
      .sort({ updated_at: -1 })
      .lean();

    return {
      questions: convertIdsToString(questions),
      type: "success",
      success: true,
    };
  } catch (error) {
    console.log(`Error in fetching questions: ${error}`);
    return { message: error.message, type: "error", success: false };
  }
});

export const getCodingQuestion = cache(
  async (slug, privateTestCases = false) => {
    try {
      await connect();

      const question = await CodingQuestion.findOne({ slug }).lean();
      let questionWithTestCases = question;

      if (!privateTestCases) {
        const publicTestCases = question?.testCases?.filter(
          (testCase) => testCase.isPublic
        );
        questionWithTestCases = { ...question, testCases: publicTestCases };
      }
      return {
        question: convertIdsToString(questionWithTestCases),
        type: "success",
        success: true,
      };
    } catch (error) {
      console.log(`Error in fetching questions: ${error}`);
      return { message: error.message, type: "error", success: false };
    }
  }
);
