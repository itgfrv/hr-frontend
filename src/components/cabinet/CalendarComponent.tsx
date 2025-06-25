import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

interface InterviewResponseDTO {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  participantId: number;
  participantName: string;
  createdAt: string;
  updatedAt: string;
}

export function CalendarComponent() {
  const navigaton = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [interviews, setInterviews] = useState<InterviewResponseDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Обработчик изменения даты
  const handleDateChange = (value: any) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    } else if (Array.isArray(value) && value[0] instanceof Date) {
      setSelectedDate(value[0]);
    }
  };

  // Получение интервью
  useEffect(() => {
    const fetchInterviews = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        setError("");
        setLoading(true);
        const response = await axios.get<InterviewResponseDTO[]>(
          `${process.env.REACT_APP_DOMAIN}/api/v1/calendar/events`,
          {
            params: {
              month: selectedDate.getMonth() + 1,
              year: selectedDate.getFullYear(),
            },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setInterviews(response.data);
      } catch (err) {
        setError("Ошибка при загрузке интервью");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, [selectedDate]);

  // Функция для форматирования даты в YYYY-MM-DD с учетом локального времени
  const formatDateToLocalYMD = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const tileContent = ({ date }: { date: Date }) => {
    // Используем локальное представление даты
    const dateString = formatDateToLocalYMD(date);

    const hasInterviews = interviews.some((interview) => {
      // Создаем дату из строки и форматируем в YYYY-MM-DD
      const interviewDate = new Date(interview.startTime);
      const interviewDateString = formatDateToLocalYMD(interviewDate);

      return interviewDateString === dateString;
    });

    return hasInterviews ? (
      <div className="absolute bottom-1 w-full flex justify-center">
        <span className="h-2 w-2 bg-red-500 rounded-full"></span>
      </div>
    ) : null;
  };

  // Интервью для выбранной даты
  const getInterviewsForSelectedDate = () => {
    const dateString = formatDateToLocalYMD(selectedDate);

    return interviews.filter((interview) => {
      const interviewDate = new Date(interview.startTime);
      const interviewDateString = formatDateToLocalYMD(interviewDate);

      return interviewDateString === dateString;
    });
  };

  // Форматирование времени
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      // timeZone: "Europe/Moscow", // Можно убрать, чтобы использовать локальное время браузера
    });
  };
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view !== "month") return null;

    const dateString = formatDateToLocalYMD(date);
    const hasInterviews = interviews.some((interview) => {
      const interviewDate = new Date(interview.startTime);
      return formatDateToLocalYMD(interviewDate) === dateString;
    });

    return hasInterviews ? "has-interview" : null;
  };

  return (
    <div className="w-full flex flex-col md:flex-row justify-center p-4">
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 md:mb-0 md:mr-8">
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          locale="ru-RU"
          tileContent={tileContent}
          tileClassName={tileClassName} // Добавлено здесь
          className="border-none w-full max-w-md"
          selectRange={false}
        />
      </div>

      <div className="w-full md:w-1/2">
        <h3 className="text-xl font-semibold mb-4">
          Интервью на{" "}
          {selectedDate.toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
          :
        </h3>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-red-500">{error}</p>
          </div>
        ) : getInterviewsForSelectedDate().length > 0 ? (
          <ul className="space-y-4">
            {getInterviewsForSelectedDate().map((interview) => (
              <li
                key={interview.id}
                className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4
                      className="font-medium text-lg text-gray-800"
                      onClick={() => {
                        navigaton(`/candidates/${interview.participantId}`);
                      }}
                    >
                      {interview.title}
                    </h4>
                    <p className="text-gray-600 mt-1">
                      {formatTime(interview.startTime)} -{" "}
                      {formatTime(interview.endTime)}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-gray-700">
                    <span className="font-medium">Участник:</span>{" "}
                    {interview.participantName}
                  </p>
                </div>

                <div className="mt-3 text-xs text-gray-400 flex justify-between">
                  <span>
                    Создано:{" "}
                    {new Date(interview.createdAt).toLocaleString("ru-RU")}
                  </span>
                  <span>
                    Обновлено:{" "}
                    {new Date(interview.updatedAt).toLocaleString("ru-RU")}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="bg-gray-50 p-6 rounded-lg text-center border border-gray-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-gray-500 mt-3">
              На этот день интервью не запланировано
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
