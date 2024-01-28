import React, {useEffect, useState} from 'react';

interface FormData {
    questions: { question: string; question_id: number }[];
    answers: { question_id: number; answer_body: string }[];
}

interface Props {
    formData: FormData;
}

export function FormComponent(props: Props) {
    const [answers, setAnswers] = useState<string[]>([]);

    useEffect(() => {
        const initialAnswers: string[] = [];
        props.formData.questions.forEach((question) => {
            const answer = props.formData.answers.find((a) => a.question_id === question.question_id);
            initialAnswers.push(answer ? answer.answer_body : '');
        });
        setAnswers(initialAnswers);
    }, [props.formData]);

    const handleInputChange = (index: number, answer: string) => {
        const newAnswers = [...answers];
        newAnswers[index] = answer;
        setAnswers(newAnswers);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Отправка данных на сервер
        console.log('Отправленные ответы:', answers);
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 flex flex-col items-center">
            {props.formData.questions.map((question, index) => (
                <div key={question.question_id} className="mb-4">
                    <label htmlFor={`question-${index}`} className="block text-gray-700 font-bold mb-2">
                        {question.question}
                    </label>
                    <input
                        type="text"
                        id={`question-${index}`}
                        value={answers[index]}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline "
                        required
                    />
                </div>
            ))}
            <div className="mt-6">
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Отправить
                </button>
            </div>
        </form>
    );
}

