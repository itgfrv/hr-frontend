import React from 'react';

interface Answer {
    id: number;
    answer: string;
}

interface Question {
    id: number;
    question: string;
    answers: Answer[];
    img_src: string;
    question_type: string;
}

interface UserAnswerDto {
    question: Question;
    userAnswerId: number;
    correctAnswerId: number;
}

interface QuizResultProps {
    userAnswerDto: UserAnswerDto;
}

export function QuizResultCard({ userAnswerDto }: QuizResultProps) {
    const { question, userAnswerId, correctAnswerId } = userAnswerDto;

    const getButtonClass = (answerId: number) => {
        if (answerId === userAnswerId) {
            return answerId === correctAnswerId ? 'bg-green-500 text-white' : 'bg-red-500 text-white';
        } else if (answerId === correctAnswerId) {
            return 'bg-green-200 text-green-800';
        } else {
            return 'bg-gray-200 text-gray-700';
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl mt-1">
            <div className="flex md:flex flex-col">
                {question.img_src && (
                    <div className="md:flex-shrink-0 flex justify-center">
                        <img className="h-full w-full object-contain md:w-80" src={process.env.REACT_APP_IMAGE_PREFIX +question.img_src} alt="Quiz" />
                    </div>
                )}
                <div className="p-8">
                    <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{question.question_type}</div>
                    <h2 className="block mt-1 text-lg leading-tight font-medium text-black">{question.question}</h2>
                    <div className="mt-4">
                        <ul>
                            {question.answers.map((answer) => (
                                <li key={answer.id} className="text-gray-700">
                                    <button
                                        className={`${getButtonClass(answer.id)} m-1 py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105`}
                                    >
                                        {answer.answer}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
