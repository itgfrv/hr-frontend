import { useState } from 'react';

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

interface QuizCardProps {
    question: Question;
    onAnswerSelected: (answerId: number) => void;
}

export function QuizCard({ question, onAnswerSelected }: QuizCardProps) {
    const [selectedAnswer, setSelectedAnswer] = useState<number>(0);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleAnswerClick = (answerId: number) => {
        setSelectedAnswer(answerId);
        onAnswerSelected(answerId);
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl mt-1">
            <div className="flex md:flex flex-col">
                {question.img_src && (
                    <div className="md:flex-shrink-0 flex flex-col justify-center items-center"><img
                        className="h-full w-full object-contain md:w-80 cursor-pointer" src={process.env.REACT_APP_IMAGE_PREFIX + question.img_src}
                        alt="Quiz" onClick={toggleModal}/>
                        <p className="mt-2 text-sm text-gray-500 italic">Нажмите на
                        изображение для увеличения</p></div>
                )}
                <div className="p-8">
                    <div
                        className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{question.question_type}</div>
                    <h2 className="block mt-1 text-lg leading-tight font-medium text-black">{question.question}</h2>
                    <div className="mt-4">
                        <ul>
                            {question.answers.map((answer) => (
                                <li key={answer.id} className="text-gray-700">
                                    <button
                                        className={`${
                                            selectedAnswer === answer.id ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'
                                        } m-1 py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105`}
                                        onClick={() => handleAnswerClick(answer.id)}
                                    >
                                        {answer.answer}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                    onClick={closeModal}
                >
                    <div
                        className="relative bg-white p-4 rounded-lg shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                            onClick={closeModal}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <img src={process.env.REACT_APP_IMAGE_PREFIX + question.img_src} alt="Enlarged Quiz" className="max-w-full max-h-screen w-auto h-auto" />
                    </div>
                </div>
            )}

        </div>
    );
}
