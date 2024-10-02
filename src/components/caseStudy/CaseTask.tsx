import {Header} from "../shared/Header";
import axios from "axios";
import {AxiosError} from "axios";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

interface IAttempt {
    id: number,
    status: string
}

export function CaseTask() {
    const [attempts, setAttempts] = useState<IAttempt[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const navigation = useNavigate();

    async function getUserAttempts() {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                setError('');
                setLoading(true);
                const response = await axios.get<IAttempt[]>(`http://${process.env.REACT_APP_DOMAIN}:8080/api/v1/case-study/attempts`, {headers: {"Authorization": `Bearer ${token}`}});
                setAttempts(response.data);
                setLoading(false);
            } catch (e: unknown) {
                const error = e as AxiosError;
                setLoading(false);
                setError(error.message);
            }
        }
    }

    useEffect(() => {
        getUserAttempts();
    }, []);

    return (
        <>
            <Header/>
            <div className="mx-auto max-w-3xl bg-white rounded my-8">
                <h1 className="text-center font-semibold text-3xl mb-4">Чертеж петли</h1>
                <p className="indent-8">Необходимо сделать комплект чертежей изученного вами объекта
                    (петля), <b>достаточный</b> для изготовления полностью
                    работоспособного изделия, аналогичного по геометрии и близкого по свойствам с изученным вами
                    образцом.
                </p>
                <p className="indent-8"> Комплект должен включать в себя сборочный чертеж и в нем ссылки на листы с
                    чертежами конечных
                    деталей, а также подобранные заводские артикулы метизов (или чертежи для их изготовления).
                </p>
                <p className="indent-8">
                    <ul>
                        Детали:
                        <li>1) Флаг петли</li>
                        <li>2) Впрессованная ось</li>
                        <li>3) Основание петли</li>
                        <li>4) Впрессованная гильза</li>
                        <li>5) Опорная шайба</li>
                        <li>6) Регулировочный винт</li>
                        <li>7) Стопорный винт</li>
                    </ul>
                </p>
                <p className="indent-8">
                    <ul>
                        Для всех деталей предложить на Ваше усмотрение подходящие материалы, при подборе материалов
                        учесть:
                        <li>А) назначение каждой детали</li>
                        <li>Б) тот факт, что флаг и основание петли приваривается к конструкции створки/рамы, которые
                            сделаны из
                            стали типа Ст3 (продумать вопрос свариваемости).
                        </li>
                        <li>
                            В) тот факт, что петли будут работать под большой нагрузкой (норма 500кг динамической
                            нагрузки) в диапазоне температур от минус 75 до плюс 50 по Цельсию. Прочностных и иных
                            расчетов делать не нужно Вам, но учесть данный факт при подборе материалов следует.
                        </li>
                        Спроектированные петли должны позволять легкое открывание/закрывание без перекосов и
                        заклинивания
                        (предложить верную геометрию). Мелкие несоответствия с образцом по геометрии допустимы,
                        неработоспособность изделия в целом допускать нельзя.
                    </ul>
                </p>
                <details className="p-4 rounded mt-6">
                    <summary className="cursor-pointer font-semibold text-lg">Критерии проверки</summary>
                    <ul className="ml-6 mt-2 list-disc">
                        <li>Указание масштаба.</li>
                        <li>Расположение вида спереди в положении именно спереди, а не иным любым образом.</li>
                        <li>Маркировка деталей (каждая имеет имя на листе, где ее изобразили).</li>
                        <li>Ссылка на детали, четко указывающая где искать ту или иную деталь.</li>
                        <li>Наличие всех внешних габаритов в сборе и для отдельных деталей.</li>
                        <li>Наличие внутренних габаритов, достаточных для изготовления.</li>
                        <li>Подбор артикулов крепежа обоснованной формы и материалов.</li>
                        <li>Подбор подходящих материалов всех элементов петли, показ на чертеже штриховками.</li>
                        <li>Легенда с указанием где какой предположен материал.</li>
                        <li>Работа петли геометрически по скольжению.</li>
                        <li>Работа петли геометрически по плоскостям приварки.</li>
                        <li>Учет зазоров. Норма 0,2 мм.</li>
                        <li>Показ мест расположения осей всех отверстий.</li>
                        <li>Правильность размещения видов по осям и по плоскостям.</li>
                        <li>Правильность обозначений ЕСКД шероховатости рабочих поверхностей. Норма 12 класс.</li>
                        <li>Правильность обозначений ЕСКД фасок.</li>
                        <li>Правильность обозначений ЕСКД резьб.</li>
                        <li>Не пересечение размерных.</li>
                        <li>Адаптация под лист А4 в масштабе.</li>
                        <li>Читаемые толщины линий. Размерные 0,09, основные разных планов 0,15-0,3.</li>
                    </ul>
                </details>
                {loading ? (
                    <p className="text-center py-4">Загрузка...</p>
                ) : error ? (
                    <p className="text-center py-4 text-red-500">{error}</p>
                ) : (
                    <table className="w-full">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="text-left py-2 px-4">Попытка</th>
                            <th className="text-left py-2 px-4">Статус</th>
                            <th className="text-left py-2 px-4"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {attempts.map((attempt, index) => (
                            <tr key={attempt.id} className="border-b">
                                <td className="text-left py-2 px-4">{index + 1}</td>
                                <td className="text-left py-2 px-4">{attempt.status === 'NOT_DONE' ? 'Открыта попытка' : attempt.status === "CHECKED" ? "Проверена" : 'На проверке'}</td>
                                <td className="text-left py-2 px-4">
                                    {attempt.status === 'NOT_DONE' ? (
                                        <button
                                            className="inline-block bg-red-500 rounded-full px-3 py-1 text-sm text-white mr-2"
                                            onClick={() => navigation(`/file/upload/${attempt.id}`, {replace: false})}>
                                            Перейти
                                        </button>
                                    ) : attempt.status === 'CHECKED' ? (
                                        <button
                                            className="inline-block bg-red-500 rounded-full px-3 py-1 text-sm text-white mr-2"
                                            onClick={() => navigation(`/case-task/check/${attempt.id}`)}>
                                            Перейти
                                        </button>
                                    ) : ''}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
}
