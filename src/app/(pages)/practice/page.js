import { getCodingQuestions } from "@/action/codingQuestion";
import QuestionTable from "@/components/Playground/questionTable";

const Playground = async () => {
  const { questions } = await getCodingQuestions();

  return (
    <div className="container-70 py-4 h-auto">
      {questions?.length > 0 ? (
        <QuestionTable data={questions} />
      ) : (
        <h2 className="text-xl font-bold">No questions found</h2>
      )}
    </div>
  );
};

export default Playground;
