import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import {useNavigate, useParams} from "react-router-dom";
import { Header } from "../shared/Header";
import ErrorModal from "../common/ErrorModal";

interface Criteria {
    criteriaId: number;
    criteria: string;
}

interface Evaluation {
    criteriaId: number;
    score: string;
    comment: string;
}
interface FileDTO {
    fileName: string;
    fullPath: string;
}
interface CaseStudyAttemptDTO {
    id: number;
    userId: number;
    status: string;
    link1:string;
    link2:string;
    files: FileDTO[];
    marks:MarkDto[];
}
interface MarkDto {
    mark: number;
    comment: string;
    criteria_id: number
}

export function CriteriaForm() {
    const { id } = useParams();
    const navigator = useNavigate();
    const [criteriaList, setCriteriaList] = useState<Criteria[]>([]);
    const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formError, setFormError] = useState('');
    const [files, setFiles] = useState<FileDTO[]>([]);
    const [showErrorModal, setShowErrorModal] = useState(false); // Для контроля показа модального окна
    const [disabled, setDisabled] = useState(false);
    const [totalScore, setTotalScore] = useState(0);
    const [maxScore, setMaxScore] = useState(0);
        const [link1, setLink1] = useState<string>('');
        const [link2, setLink2] = useState<string>('');
    useEffect(() => {
        const fetchCriteria = async () => {
            const token = localStorage.getItem('token');
            try {
                setLoading(true);
                setError('');
                setShowErrorModal(false);

                const [criteriaResponse, attemptResponse] = await Promise.all([
                    axios.get<Criteria[]>(
                        `${process.env.REACT_APP_DOMAIN}/api/v1/case-study/criteria`,
                        { headers: { "Authorization": `Bearer ${token}` } }
                    ),

                    axios.get<CaseStudyAttemptDTO>(
                        `${process.env.REACT_APP_DOMAIN}/api/v1/case-study/attempt/${id}`,
                        { headers: { "Authorization": `Bearer ${token}` } }
                    )
                ]);

                if(attemptResponse.status!==200){
                    console.log(attemptResponse.status);
                    navigator(-1)
                }
                setFiles(attemptResponse.data.files);
                setLink1(attemptResponse.data.link1);
                setLink2(attemptResponse.data.link2);
                setCriteriaList(criteriaResponse.data);
                if (attemptResponse.data.status==='CHECKED'){
                    setDisabled(true);
                }
                const evaluationsData = criteriaResponse.data.map(criteria => {
                    const attemptMark = attemptResponse.data.marks.find(mark => mark.criteria_id === criteria.criteriaId);
                    return {
                        criteriaId: criteria.criteriaId,
                        score: attemptMark ? attemptMark.mark.toString() : '',
                        comment: attemptMark ? attemptMark.comment : ''
                    };
                });

                setEvaluations(evaluationsData);
                setMaxScore(criteriaResponse.data.length * 2);
            } catch (e: unknown) {
                const error = e as AxiosError;
                setError(error.message);
                setShowErrorModal(true);
                navigator("/cabinet");
            } finally {
                setLoading(false);
            }
        };

        fetchCriteria();
    }, [id]);

    useEffect(() => {
        const scoreSum = evaluations.reduce((sum, evalItem) => {
            const score = parseInt(evalItem.score);
            return sum + (isNaN(score) ? 0 : score);
        }, 0);
        setTotalScore(scoreSum);
    }, [evaluations]);
    const handleChange = (index: number, field: keyof Evaluation, value: string) => {
        setEvaluations(prevEvaluations =>
            prevEvaluations.map((evaluation, i) =>
                i === index ? { ...evaluation, [field]: value } : evaluation
            )
        );
    };

    const validateForm = () => {
        // Проверяем, чтобы все оценки были заполнены
        for (let evaluation of evaluations) {
            if (evaluation.score === '') {
                return false; // Если хотя бы одна оценка не выбрана, возвращаем false
            }
        }
        return true; // Если все оценки заполнены
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Сбрасываем сообщение об ошибке перед проверкой
        setFormError('');

        if (!validateForm()) {
            setFormError('Пожалуйста, заполните все оценки.'); // Устанавливаем сообщение об ошибке
            setShowErrorModal(true);
            return;
        }

        const token = localStorage.getItem('token');

        const requestData = evaluations.map((evaluation) => ({
                criteriaId: evaluation.criteriaId,
                mark: parseInt(evaluation.score),
                comment: evaluation.comment
            }))


        try {
            // Отправляем POST-запрос на сервер
            const response = await axios.post(
                `${process.env.REACT_APP_DOMAIN}/api/v1/case-study/attempt/${id}`,
                requestData,
                { headers: { "Authorization": `Bearer ${token}` } }
            );

            console.log('Ответ сервера:', response.data);

            // При успешной отправке перенаправляем на другой экран или показываем сообщение
            navigator(-1); // Перенаправление, можно настроить по необходимости
        } catch (error: unknown) {
            const axiosError = error as AxiosError;
            console.error('Ошибка при отправке данных:', axiosError.message);
            setFormError('Ошибка при отправке данных. Пожалуйста, попробуйте снова.');
            setShowErrorModal(true); // Показываем модальное окно при ошибке
        }
    };


    if (loading) return <p>Загрузка...</p>;

    return (
        <>
            <Header/>
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-4">
                <div className="flex justify-start p-2">
                    <button onClick={() => navigator(-1)} className="flex items-center text-gray-700 font-semibold">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                             fill="#5f6368">
                            <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/>
                        </svg>
                        Назад
                    </button>
                </div>
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Файлы</h2>
                    {files.length > 0 ? (
                        <ul>
                            {files.map((file, index) => (
                                <li key={index} className="mb-2">
                                    <a href={process.env.REACT_APP_IMAGE_PREFIX + file.fullPath} target="_blank"
                                       rel="noopener noreferrer"
                                       className="text-indigo-600 hover:underline">
                                        {file.fileName}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Файлы отсутствуют</p>
                    )}
                </div>
                  <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Деталь 6. Регулировочный винт

                        </label>
                        <p>{link1}</p>
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Деталь 7. Стопорный винт
                        </label>
                        <p>{link2}</p>
                    </div>

                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Проставить везде</h2>
                    {[0, 1, 2].map((value) => (
                                        <label key={value} className="inline-flex items-center mr-4">
                                            <input
                                                type="radio"
                                                value={value}
                                                name="score-all"
                                                onChange={(e) =>
                                                    setEvaluations(evaluations.map((ev) => ({ ...ev, score: e.target.value })))
                                                }
                                                className="form-radio text-indigo-600"
                                                disabled={disabled}
                                            />
                                            <span className="ml-2">{value}</span>
                                        </label>
                                    ))}
                </div>
<div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
  <table className="w-full">
    <thead className="bg-gray-50">
      <tr>
<th className="w-1/4 px-6 py-3 text-left text-sm font-medium text-gray-700">Критерий</th> {/* Уменьшил ширину */}
        <th className="w-1/6 px-6 py-3 text-left text-sm font-medium text-gray-700">Оценка</th>   {/* Уменьшил ширину */}
        <th className="w-7/12 px-6 py-3 text-left text-sm font-medium text-gray-700">Комментарий</th> {/* Увеличил ширину */}
      </tr>
    </thead>
    <tbody>
      {criteriaList.map((criteria, index) => (
        <tr 
          key={criteria.criteriaId}
          className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
        >
          {/* Критерий */}
          <td className="px-6 py-4 align-top">
            <div className="text-sm font-semibold text-gray-900">
              {index + 1}. {criteria.criteria}
            </div>
          </td>

          {/* Оценка */}
          <td className="px-6 py-4 align-top">
            <div className="flex flex-col gap-2">
              <div className="flex items-center space-x-4">
                {[0, 1, 2].map((value) => (
                  <label key={value} className="inline-flex items-center">
                    <input
                      type="radio"
                      name={`score-${criteria.criteriaId}`}
                      value={value}
                      checked={evaluations[index]?.score === String(value)}
                      onChange={(e) => !disabled && handleChange(index, 'score', e.target.value)}
                      className="form-radio text-indigo-600 disabled:bg-blue-600 disabled:border-blue-600"
                    />
                    <span className="ml-2">{value}</span>
                  </label>
                ))}
              </div>
              {formError && evaluations[index]?.score === '' && (
                <p className="text-red-500 text-sm mt-1">Выберите оценку</p>
              )}
            </div>
          </td>

          {/* Комментарий */}
          <td className="px-6 py-4 align-top">
            <textarea
              id={`comment-${criteria.criteriaId}`}
              name={`comment-${criteria.criteriaId}`}
              value={evaluations[index]?.comment || ''}
              onChange={(e) => handleChange(index, 'comment', e.target.value)}
              className="p-2 border border-gray-300 rounded-lg w-full h-24 focus:ring-indigo-500 focus:border-indigo-500"
              disabled={disabled}
            />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

                {!disabled && (
                    <button
                        type="submit"
                        className="w-full py-3 px-4 mt-6 text-white font-medium bg-red-600 hover:bg-red-700 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        Отправить
                    </button>
                )}
            </form>
            {showErrorModal && (
                <ErrorModal error={formError} onClose={() => setShowErrorModal(false)}/>
            )}
            <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-gray-300">
                <p className="text-lg font-semibold">Баллы: {totalScore} / {maxScore}</p>
            </div>
        </>
    );
}