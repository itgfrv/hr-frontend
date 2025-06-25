import React from "react";
import { ICandidate } from "../../models";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { useState } from "react";

interface CandidateProps {
  candidate: ICandidate;
  setCandidates: React.Dispatch<React.SetStateAction<ICandidate[]>>;
}

export function Candidate(props: CandidateProps) {
  const navigator = useNavigate();
  let date;
  if (props.candidate.lastActivityDate) {
    date = new Date(props.candidate.lastActivityDate);
  }
  const [error, setError] = useState<string>("");
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  async function changeRole(role: string) {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `${process.env.REACT_APP_DOMAIN}/api/v1/user/` +
          props.candidate.id +
          "/" +
          role,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOpen(false);
      props.setCandidates((prev) =>
        prev.filter((emp) => emp.id !== props.candidate.id)
      );
    } catch (e: unknown) {
      const error = e as AxiosError;
      setError(error.message);
      setOpen(false);
    }
  }
  return (
    <tr className="hover:bg-gray-50 cursor-pointer transition-colors">
      <td>
        <input
          type="checkbox"
          className="form-checkbox h-4 w-4 text-blue-600 ml-3"
        />
      </td>
      <td>
        {props.candidate.firstname} {props.candidate.lastname}
        {!props.candidate.viewed && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="0.8em"
            height="0.8em"
            viewBox="0 0 100 100"
            className="ml-1"
            style={{
              display: "inline-block",
              verticalAlign: "middle",
            }}
          >
            <circle cx="50" cy="50" r="40" fill="#4285F4" />
          </svg>
        )}
      </td>

      <td>
        {props.candidate.activityLogs?.length > 0
          ? (() => {
              const lastLog =
                props.candidate.activityLogs[
                  props.candidate.activityLogs.length - 1
                ];
              return (
                <>
                  {lastLog.eventType}
                  <br />
                  {lastLog.createdAt}
                </>
              );
            })()
          : "Нет данных"}
      </td>

      {["DEMO", "FINAL", "ORAL", "CASE_STUDY"].map((type) => {
        const task = props.candidate.taskInfos?.find((t) => t.name === type);
        const attempts = task?.attempts;
        return (
          <td key={type}>
            {attempts ? (
              <div className="d-flex flex-column">
                {attempts.map((attempt, index) => (
                  <div key={index}>
                    Попытка {index + 1}: {attempt.result}/{attempt.maxResult}
                  </div>
                ))}
              </div>
            ) : task ? (
              "нет данных"
            ) : (
              "-"
            )}
          </td>
        );
      })}
      <td>
        {props.candidate.comments[props.candidate.comments.length - 1]?.content}
      </td>
      <td>
        <div>
          <button
            className={
              "bg-red-500 text-white py-1 px-2 rounded-full mr-2 hover:bg-red-600"
            }
            onClick={handleOpen}
          >
            Отказ
          </button>
          <button
            className={
              "bg-red-500 text-white py-1 px-2 rounded-full hover:bg-red-600"
            }
            onClick={() => {
              navigator(`/candidates/${props.candidate.id}`);
            }}
          >
            Подробнее
          </button>
        </div>
      </td>
      {open && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-lg font-bold">Подтверждение</h2>
            <p>
              Вы действительно отказать {props?.candidate.firstname}{" "}
              {props?.candidate.lastname}?
            </p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded mr-2"
                onClick={handleClose}
              >
                Отмена
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => changeRole("REJECT")}
              >
                Отказ
              </button>
            </div>
          </div>
        </div>
      )}
    </tr>
  );
}
