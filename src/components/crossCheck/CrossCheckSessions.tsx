import React, { useEffect, useState } from "react";
import axios from "axios";
import { Header } from "../shared/Header";
import { useNavigate, useParams } from "react-router-dom";

interface Session {
    id: number;
    date: string;
    description: string;
    status: string;
}

export default function CrossCheckSessions() {
    const { id } = useParams();
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [description, setDescription] = useState<string>("");
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        axios
            .get<Session[]>(`${process.env.REACT_APP_DOMAIN}/api/v1/cross-check/sessions/${id}`, {
                headers: { Accept: "*/*" },
            })
            .then((response) => {
                setSessions(response.data);
            })
            .catch((err) => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleClick = (id: number) => {
        navigate(`/cross-check/sessions/${id}`);
    };

    const handleAddSession = () => {
        if (!description.trim()) return;

        axios.post(`${process.env.REACT_APP_DOMAIN}/api/v1/cross-check/session/${id}`, { description })
            .then((response) => {
                setSessions([...sessions, response.data]);
                setIsModalOpen(false);
                setDescription("");
            })
            .catch((err) => {
                console.error("Error adding session:", err);
            });
    };

    return (
        <>
            <Header />
            <div className="p-6 max-w-2xl mx-auto">
                <button
                    className="mb-4 px-4 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition"
                    onClick={() => setIsModalOpen(true)}
                >
                    Добавить сессию
                </button>
                {loading && <p className="text-center">Loading...</p>}
                {error && <p className="text-red-500 text-center">Error: {error}</p>}
                {sessions.length > 0 ? (
                    sessions.map((session) => (
                        <div key={session.id} className="border border-gray-300 rounded-lg p-6 mb-4 shadow-md bg-white">
                            <h2 className="text-xl font-semibold">{session.description}</h2>
                            <p className={`mt-2 font-semibold ${session.status === "COMPLETED" ? "text-green-500" : "text-yellow-500"}`}>
                                {session.status==="COMPLETED"?"Все заполнили":"На заполнении"}
                            </p>
                            {session.status == "COMPLETED" && (
                                <button
                                    className="mt-3 px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition"
                                    onClick={() => handleClick(session.id)}
                                >
                                    Перейти
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-center">No sessions found</p>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-4">Добавить сессию</h2>
                        <input
                            type="text"
                            className="w-full border border-gray-300 p-2 rounded mb-4"
                            placeholder="Введите описание"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Отмена
                            </button>
                            <button
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                onClick={handleAddSession}
                            >
                                Добавить
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
