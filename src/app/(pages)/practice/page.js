import { getCodingQuestions } from "@/action/codingQuestion";
import QuestionsTable from "@/components/codeEditor/questionTable";

const Playground = async () => {
  const { questions } = await getCodingQuestions();

  return (
    <div className="container-70 py-4 h-[calc(100vh-83px)]">
      {questions?.length > 0 ? (
        <QuestionsTable questions={questions} />
      ) : (
        <h2 className="text-xl font-bold">No questions found</h2>
      )}
    </div>
  );
};

export default Playground;
