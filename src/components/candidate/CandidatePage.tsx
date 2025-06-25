import { useEffect, useState, useRef } from "react";
import { ErrorMessage } from "../shared/ErrorMessage";
import { Loader } from "../shared/Loader";
import { Candidate } from "./Candidate";
import { Header } from "../shared/Header";
import { ICandidate } from "../../models";
import axios, { AxiosError } from "axios";

export function CandidatePage() {
  const tableRef = useRef(null);
  const [choice, setChoice] = useState("REGISTERED");
  const [candidates, setCandidates] = useState<ICandidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stuck, setStuck] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleSelect = (id: number, isSelected: number[]) => {
    if (isSelected) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
    }
  };
  const toggleSelectAll = () => {
    if (selectedIds.length === candidates.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(candidates.map((c) => c.id));
    }
  };
  useEffect(() => {
    async function fetchCandidates() {
      const token = localStorage.getItem("token");
      try {
        setError("");
        setLoading(true);
        const response = await axios.get<ICandidate[]>(
          `${process.env.REACT_APP_DOMAIN}/api/v1/form?filter_param=` + choice,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCandidates(response.data);
        setLoading(false);
      } catch (e: unknown) {
        const error = e as AxiosError;
        setLoading(false);
        setError(error.message);
      }
    }

    fetchCandidates();
  }, [choice]);
  const columns = [
    {
      id: "selection",
      title: (
        <input
          type="checkbox"
          className="form-checkbox h-4 w-4 text-blue-600"
          checked={
            selectedIds.length === candidates.length && candidates.length > 0
          }
          onChange={toggleSelectAll}
        />
      ),
      width: "w-12",
    },
    { id: "name", title: "Соискатель", width: 200 },
    { id: "status", title: "Статус", width: 150 },
   // { id: "overall", title: "Общий балл", width: 100 },
    { id: "demo", title: "Демо-тест", width: 100 },
    { id: "test", title: "Тест", width: 100 },
    { id: "oral", title: "Устное", width: 100 },
    { id: "draft", title: "Чертеж", width: 100 },
    { id: "comment", title: "Последний комментарий", width: 150 },
    { id: "buttons", title: "", width: 50 },
  ];

  const getButtonClass = (buttonChoice: string) =>
    `p-2 rounded-full ml-2 transition-all 
         ${
           choice === buttonChoice
             ? "scale-110 bg-red-800 text-white shadow-md"
             : "bg-red-500 text-white hover:bg-red-600"
         }`;

  return (
    <>
      <Header />
      <div className="m-2 flex justify-center flex-wrap gap-2">
        <button
          className={getButtonClass("REGISTERED")}
          onClick={() => setChoice("REGISTERED")}
        >
          Зарегистрировался
        </button>
        <button
          className={getButtonClass("RESUME")}
          onClick={() => setChoice("RESUME")}
        >
          Резюме
        </button>
        <button
          className={getButtonClass("WAITING_INTERVIEW")}
          onClick={() => setChoice("WAITING_INTERVIEW")}
        >
          Демо тест
        </button>
        <button
          className={getButtonClass("INTERVIEW")}
          onClick={() => setChoice("INTERVIEW")}
        >
          Собеседование
        </button>
        <button
          className={getButtonClass("WAITING_RESULT")}
          onClick={() => setChoice("WAITING_RESULT")}
        >
          Финальный тест
        </button>
        <button
          className={getButtonClass("CASE_STUDY")}
          onClick={() => setChoice("CASE_STUDY")}
        >
          Чертежное задание
        </button>
        <button
          className={getButtonClass("CASE_DONE")}
          onClick={() => setChoice("CASE_DONE")}
        >
          Выполнил чертежное задание
        </button>
      </div>
      <div className={"w-full px-10"}>
        {loading && <Loader />}
        {error && <ErrorMessage error={error} />}
        <div className="relative mt-8">
          {/* Плавающий заголовок при скролле */}
          {stuck && (
            <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-30 py-2">
              <div className="flex max-w-full overflow-hidden">
                {columns.map((col) => (
                  <div
                    key={col.id}
                    className={`px-3 py-2 text-sm font-medium text-gray-500 truncate`}
                  >
                    {col.title}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div
            ref={tableRef}
            className="overflow-auto max-h-[70vh] border rounded-lg shadow-sm"
          >
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.id}
                      data-column={col.id}
                      className={`px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50 z-20 ${col.width}`}
                    >
                      <div className="flex items-center">{col.title}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              {candidates.map((candidate) => (
                <Candidate
                  candidate={candidate}
                  key={candidate.id}
                  setCandidates={setCandidates}
                />
              ))}
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
