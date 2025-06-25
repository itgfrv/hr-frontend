import { ICandidateInfo } from "../../../models";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";

// Интерфейс для данных устного задания
interface IOralTask {
  id: number;
  criteria1: number;
  criteria2: number;
  criteria3: number;
  timeSpent: string; // Формат "HH:MM:SS"
}

// Интерфейс для комментария (оставлен из вашего кода)
interface IComment {
  content: string;
  adminName: string;
  adminLastname: string;
  adminEmail: string;
}

export function UserOralAnswer({ info }: { info: ICandidateInfo | undefined }) {
  // Состояния для устного задания
  const [oralData, setOralData] = useState<IOralTask | null>(null);
  const [loadingOral, setLoadingOral] = useState<boolean>(true);
  const [errorOral, setErrorOral] = useState<string>("");
  
  // Состояния для формы ввода
  const [criteria1, setCriteria1] = useState<number>(0);
  const [criteria2, setCriteria2] = useState<number>(0);
  const [criteria3, setCriteria3] = useState<number>(0);
  const [timeSpent, setTimeSpent] = useState<string>("00:00:00");
  

  // Загрузка данных устного задания
  useEffect(() => {
    const fetchOralData = async () => {
      if (!info?.user_info.id) return;
      
      const token = localStorage.getItem("token");
      try {
        setLoadingOral(true);
        const response = await axios.get<IOralTask>(
          `${process.env.REACT_APP_DOMAIN}/api/v1/oral-task/${info.user_info.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOralData(response.data);
      } catch (e) {
        const error = e as AxiosError;
        if (error.response?.status !== 404) {
          setErrorOral(error.message);
        }
      } finally {
        setLoadingOral(false);
      }
    };

    fetchOralData();
  }, [info]);

  const submitOralTask = async () => {
    if (!info?.user_info.id) return;
    
    const token = localStorage.getItem("token");
    try {
      setLoadingOral(true);
      const response = await axios.post<IOralTask>(
        `${process.env.REACT_APP_DOMAIN}/api/v1/oral-task`,
        {
          userId: info.user_info.id,
          criteria1,
          criteria2,
          criteria3,
          timeSpent
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOralData(response.data);
    } catch (e) {
      const error = e as AxiosError;
      setErrorOral(error.message);
    } finally {
      setLoadingOral(false);
    }
  };
  return (
    <div className="m-2">
      <h1 className="text-center font-bold mb-4">Устное задание</h1>
      {loadingOral ? (
        <p>Загрузка данных задания...</p>
      ) : errorOral ? (
        <p className="text-red-500">Ошибка: {errorOral}</p>
      ) : oralData ? (
        <div className="mb-6 p-4 border rounded bg-gray-50">
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <label className="block text-sm font-medium">Вопрос 1</label>
              <div className="mt-1 p-2 border rounded bg-white">
                {oralData.criteria1}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium">Вопрос 2</label>
              <div className="mt-1 p-2 border rounded bg-white">
                {oralData.criteria2}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium">Вопрос 3</label>
              <div className="mt-1 p-2 border rounded bg-white">
                {oralData.criteria3}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium">Время выполнения</label>
              <div className="mt-1 p-2 border rounded bg-white">
                {oralData.timeSpent}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-4 border rounded bg-gray-50">
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <label className="block text-sm font-medium">Вопрос 1</label>
              <input
                type="number"
                min="0"
                max="5"
                value={criteria1}
                onChange={(e) => setCriteria1(Number(e.target.value))}
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Вопрос 2</label>
              <input
                type="number"
                min="0"
                max="5"
                value={criteria2}
                onChange={(e) => setCriteria2(Number(e.target.value))}
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Вопрос  3</label>
              <input
                type="number"
                min="0"
                max="5"
                value={criteria3}
                onChange={(e) => setCriteria3(Number(e.target.value))}
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Время выполнения (ЧЧ:ММ:СС)</label>
              <input
                type="text"
                pattern="\d{2}:\d{2}:\d{2}"
                value={timeSpent}
                onChange={(e) => setTimeSpent(e.target.value)}
                placeholder="00:00:00"
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
          </div>
          <button
            onClick={submitOralTask}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            disabled={loadingOral}
          >
            {loadingOral ? "Сохранение..." : "Сохранить оценку"}
          </button>
        </div>
      )}
    </div>
  );
}