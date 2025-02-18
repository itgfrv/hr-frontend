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

export default function CrossCheckAttemptionList() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        const token = localStorage.getItem('token');
        axios
            .get<Session[]>(`${process.env.REACT_APP_DOMAIN}/api/v1/cross-check/attempts`,{
                headers: {
                    "Authorization": `Bearer ${token}`
                }
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
        navigate(`/cross-check/attempts/${id}`);
    };

    return (
        <>
            <Header />
            <div className="p-6 max-w-2xl mx-auto">
                {loading && <p className="text-center">Loading...</p>}
                {error && <p className="text-red-500 text-center">Error: {error}</p>}
                {sessions.length > 0 ? (
                    sessions.map((session) => (
                        <div key={session.id} className="border border-gray-300 rounded-lg p-6 mb-4 shadow-md bg-white">
                            <h2 className="text-xl font-semibold">{session.description}</h2>
                            <p className="text-gray-700">Дата: {new Date(session.date).toLocaleDateString()}</p>
                            {session.status !== "COMPLETED" && (
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
                    <p className="text-center">No attempts found</p>
                )}
            </div>
        </>
    );
}