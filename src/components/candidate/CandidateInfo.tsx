import { useNavigate, useParams } from "react-router-dom";
import { Header } from "../shared/Header";
import { useEffect, useState } from "react";
import { ICandidateInfo } from "../../models";
import axios, { AxiosError } from "axios";
import UpdatePasswordForm from "./UpdatePasswordForm";
import { UserResume } from "./taskInfo/UserResume";
import { UserQuiz } from "./taskInfo/UserQuiz";
import { UserCaseStudy } from "./taskInfo/UserCaseStudy";
import { UserComment } from "./taskInfo/UserComment";
import { UserOralAnswer } from "./taskInfo/UserOralAnswer";

// Добавлен интерфейс для данных интервью
interface InterviewData {
  title: string;
  startTime: string;
  endTime: string;
  participantId: number;
}

interface IComment {
  content: string;
  adminName: string;
  adminLastname: string;
  adminEmail: string;
}

enum TaskView {
  COMMENT,
  QUIZ,
  ORAL,
  RESUME,
  CASE_STUDY,
}

export function CandidateInfo() {
  const { id } = useParams();
  const navigator = useNavigate();
  const [viewMode, setViewMode] = useState<"info" | "changePassword">("info");
  const [loading, setLoading] = useState<boolean>(false);
  const [info, setInfo] = useState<ICandidateInfo>();
  const [error, setError] = useState<string>("");
  const [taskView, setTaskView] = useState<TaskView>(TaskView.RESUME);
  
  // Состояния для модального окна интервью
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [interviewData, setInterviewData] = useState<InterviewData>({
    title: "",
    startTime: "",
    endTime: "",
    participantId: Number(id) || 0,
  });
  const [interviewError, setInterviewError] = useState("");

  async function getInfo() {
    const token = localStorage.getItem("token");
    try {
      setLoading(true);
      const candidateInfo = await axios.get<ICandidateInfo>(
        `${process.env.REACT_APP_DOMAIN}/api/v1/form/` + id,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInfo(candidateInfo.data);
      setLoading(false);
    } catch (e: unknown) {
      const error = e as AxiosError;
      setLoading(false);
      setError(error.message);
    }
  }

  async function changeRole(role: string) {
    const token = localStorage.getItem("token");
    try {
      const isConfirm = confirm("Вы хотите выдать роль " + role + " пользователю " + info?.user_info.firstname + " " + info?.user_info.lastname + "?"); // eslint-disable-line no-restricted-globals
      if (isConfirm) {
        setLoading(true);
        await axios.put(
          `${process.env.REACT_APP_DOMAIN}/api/v1/user/` + id + "/" + role,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLoading(false);
      }
    } catch (e: unknown) {
      const error = e as AxiosError;
      setLoading(false);
      setError(error.message);
    }
  }

  // Функция для создания интервью
  async function createInterview() {
    const token = localStorage.getItem("token");
    if (!interviewData.title || !interviewData.startTime || !interviewData.endTime) {
      setInterviewError("Все поля обязательны для заполнения");
      return;
    }
    
    if (new Date(interviewData.startTime) >= new Date(interviewData.endTime)) {
      setInterviewError("Время окончания должно быть позже времени начала");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `${process.env.REACT_APP_DOMAIN}/api/v1/calendar`,
        interviewData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Закрываем модальное окно и сбрасываем состояние
      setIsInterviewModalOpen(false);
      setInterviewData({
        title: "",
        startTime: "",
        endTime: "",
        participantId: Number(id) || 0,
      });
      setInterviewError("");
      setLoading(false);
      
      alert("Интервью успешно назначено!");
    } catch (e: unknown) {
      const error = e as AxiosError;
      setLoading(false);
      setInterviewError(error.message || "Ошибка при создании интервью");
    }
  }

  // Обработчик изменений в форме
  const handleInterviewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInterviewData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    getInfo();
  }, []);

  return (
    <>
      <Header />
      <div
        className={
          "max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl mt-1 flex-col justify-center"
        }
      >
        {/* Модальное окно для назначения интервью */}
        {isInterviewModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Назначить интервью</h3>
                <button 
                  onClick={() => setIsInterviewModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {interviewError && (
                <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                  {interviewError}
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Название интервью
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={interviewData.title}
                    onChange={handleInterviewChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Техническое интервью"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Дата и время начала
                  </label>
                  <input
                    type="datetime-local"
                    name="startTime"
                    value={interviewData.startTime}
                    onChange={handleInterviewChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Дата и время окончания
                  </label>
                  <input
                    type="datetime-local"
                    name="endTime"
                    value={interviewData.endTime}
                    onChange={handleInterviewChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Участник:</span>{" "}
                    {info?.user_info.firstname} {info?.user_info.lastname}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setIsInterviewModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Отмена
                </button>
                <button
                  onClick={createInterview}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {loading ? "Сохранение..." : "Назначить"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className={"max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl mt-1 flex-col justify-center"}>
          <div className="flex justify-start p-2">
            <button
              onClick={() => navigator(-1)}
              className="flex items-center text-gray-700 font-semibold"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#5f6368"
              >
                <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
              </svg>
              Назад
            </button>
          </div>

          <div className="flex justify-around border-b border-gray-200">
            <button
              className={`p-2 text-gray-700 font-semibold ${
                viewMode === "info" ? "border-b-2 border-red-500" : ""
              }`}
              onClick={() => setViewMode("info")}
            >
              Информация
            </button>
            <button
              className={`p-2 text-gray-700 font-semibold ${
                viewMode === "changePassword" ? "border-b-2 border-red-500" : ""
              }`}
              onClick={() => setViewMode("changePassword")}
            >
              Сменить пароль
            </button>
          </div>
          {viewMode === "info" && (
            <div>
              <div className={"m-4"}>
                <h1 className="text-center font-bold">Информация</h1>
                {info && info.user_info && (
                  <div>
                    <div>
                      <span className={"font-medium"}>Имя: </span>
                      {info.user_info.firstname}
                    </div>
                    <div>
                      <span className={"font-medium"}>Фамилия: </span>
                      {info.user_info.lastname}
                    </div>
                    <div>
                      <span className={"font-medium"}>Статус: </span>
                      {info.user_info.activity}
                    </div>
                    <div>
                      <span className={"font-medium"}>Дата регистрации: </span>
                      {new Date(info.user_info.createdDate).toLocaleDateString()}
                    </div>
                    <div>
                      <span className={"font-medium"}>
                        Дата последнего выполненого задания:{" "}
                      </span>
                      {new Date(
                        info.user_info.lastActivityDate
                      ).toLocaleDateString()}
                    </div>
                  </div>
                )}
                <div className={"m-2 flex justify-center flex-wrap gap-3"}>
                  <button
                    className={
                      "bg-red-500 px-4 py-2 text-white hover:bg-red-600 rounded-full transition-colors"
                    }
                    onClick={() => {
                      changeRole("EMPLOYEE");
                    }}
                  >
                    Сделать сотрудником
                  </button>
                  <button
                    className={
                      "bg-red-500 px-4 py-2 text-white hover:bg-red-600 rounded-full transition-colors"
                    }
                    onClick={() => {
                      changeRole("REJECT");
                    }}
                  >
                    Отказ
                  </button>
                  <button
                    className={
                      "bg-red-500 px-4 py-2 text-white hover:bg-red-600 rounded-full transition-colors"
                    }
                    onClick={() => setIsInterviewModalOpen(true)}
                  >
                    Назначить интервью
                  </button>
                </div>
              </div>
              <div className="flex justify-around border-b border-gray-200">
                <button
                  className={`p-2 text-gray-700 font-semibold ${
                    taskView === TaskView.RESUME
                      ? "border-b-2 border-red-500"
                      : ""
                  }`}
                  onClick={() => setTaskView(TaskView.RESUME)}
                >
                  Анкета
                </button>
                <button
                  className={`p-2 text-gray-700 font-semibold ${
                    taskView === TaskView.QUIZ ? "border-b-2 border-red-500" : ""
                  }`}
                  onClick={() => setTaskView(TaskView.QUIZ)}
                >
                  Результаты теста
                </button>
                <button
                  className={`p-2 text-gray-700 font-semibold ${
                    taskView === TaskView.ORAL ? "border-b-2 border-red-500" : ""
                  }`}
                  onClick={() => setTaskView(TaskView.ORAL)}
                >
                  Устное задание
                </button>
                <button
                  className={`p-2 text-gray-700 font-semibold ${
                    taskView === TaskView.CASE_STUDY
                      ? "border-b-2 border-red-500"
                      : ""
                  }`}
                  onClick={() => setTaskView(TaskView.CASE_STUDY)}
                >
                  Чертеж
                </button>
                <button
                  className={`p-2 text-gray-700 font-semibold ${
                    taskView === TaskView.COMMENT
                      ? "border-b-2 border-red-500"
                      : ""
                  }`}
                  onClick={() => setTaskView(TaskView.COMMENT)}
                >
                  Комментарий
                </button>
              </div>
              {taskView === TaskView.RESUME && (
                <div className="m-4">
                  <UserResume info={info} />
                </div>
              )}
              {taskView === TaskView.QUIZ && (
                <div className="m-4">
                  <UserQuiz info={info} />
                </div>
              )}
              {taskView === TaskView.CASE_STUDY && (
                <div className="m-4">
                  <UserCaseStudy info={info} />
                </div>
              )}
              {taskView === TaskView.COMMENT && (
                <div className="m-4">
                  <UserComment info={info} />
                </div>
              )}
              {taskView === TaskView.ORAL && (
                <div className="m-4">
                  <UserOralAnswer info={info} />
                </div>
              )}
            </div>
          )}
          {viewMode === "changePassword" && (
            <div className="m-4">
              <UpdatePasswordForm userId={Number(id)} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}