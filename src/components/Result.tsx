import {useNavigate} from "react-router-dom";
interface IResult {
    question_type: string,
    current_result: number,
    max_result: number
}
interface ResultProps{
    result:IResult[]
}

export function Result({result}:ResultProps) {
    const navigation = useNavigate();

    return (
        <div className="bg-white shadow-md rounded-lg p-6 w-80 mx-auto">
            <h2 className="text-xl font-bold mb-4">Результат</h2>
            <ul>
            {result.map((r)=>(
                <li key={r.question_type} className="text-gray-700">
                    {r.question_type}: {r.current_result} из {r.max_result}
                </li>)
            )}
                <li className="font-bold">Всего: {result.map(r=>r.current_result).reduce((a, b) => a + b, 0)} из {result.map(r=>r.max_result).reduce((a, b) => a + b, 0)}</li>
            </ul>

            <p className="text-gray-700">
                Спасибо за прохождение теста, ожидайте ответа!
            </p>
            <div className={"mt-1 flex justify-center"}>
                <button className={"inline-block bg-red-500 rounded-full px-3 py-1  text-white mr-2"}
                        onClick={() => navigation("/cabinet")}>
                    Вернуться на главную
                </button>
            </div>
        </div>
    );
}