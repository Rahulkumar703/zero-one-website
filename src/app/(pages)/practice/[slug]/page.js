import { getCodingQuestion } from "@/action/codingQuestion";
import Playground from "@/components/Playground/Playground";
export const generateMetadata = async ({ params }) => {
  const { slug } = await params;
  const { question } = await getCodingQuestion(slug);
  return {
    title: question?.name || "Problem Not Found",
    description: question?.description || "No description available",
  };
};

const QuestionPage = async ({ params }) => {
  const { slug } = await params;
  const { question } = await getCodingQuestion(slug);

  return <Playground question={question} />;
};

export default QuestionPage;
