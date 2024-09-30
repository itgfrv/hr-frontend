import { ICandidateInfo} from "../../../models";
export interface UserInfoProps{
    info: ICandidateInfo
}
export function UserResume({ info }: { info: ICandidateInfo | undefined }) {
    function getAnswer(index: number, answ: { question_id: number; answer_body: string }[]) {
        const a = answ.find((a) => a.question_id === index);
        return a ? a.answer_body : '';
    }
    return (
        <>
            <div className={"m-4"}>
                <h1 className="text-center font-bold">Анкета</h1>
                {info && info.resume &&
                    info.resume.questions.map((question, index) => (
                        <div className={"mt-4"}>
                <span className={"font-medium"}>
                  {index + 1}. {question.question}:
                </span>
                            <div>
                                {getAnswer(question.question_id, info.resume.answers)}
                            </div>
                        </div>
                    ))}
            </div>
        </>
    )
}