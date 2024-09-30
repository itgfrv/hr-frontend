import {Header} from "../shared/Header";
import {Loader} from "../shared/Loader";
import {ErrorMessage} from "../shared/ErrorMessage";
import React, {ChangeEvent, useCallback, useEffect, useState} from "react";
import axios, {AxiosError} from "axios";
import {useNavigate, useParams} from "react-router-dom";

interface FileRequest {
    file: FormData
}

export function FileLoader() {
    const { id } = useParams();
    const navigation = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState<File[]>([]);

    async function sendFiles() {
        try {
            setLoading(true);
            let wantSend = confirm("Хотите ли вы отправить данные на проверку?\nПосле отправки данных не будет возможности изменить"); // eslint-disable-line no-restricted-globals
            if (wantSend) {
                const formData = new FormData();
                selectedFile.forEach((file) => {
                    formData.append(`file`, file);
                });
                const token = localStorage.getItem('token');
                if (token) {
                    await axios.post<FormData>(`http://${process.env.REACT_APP_DOMAIN}:8080/api/v1/case-study/load/${id}`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                }
            }
            setLoading(false);
            navigation('/case-task');
        } catch (e: unknown) {
            const error = e as AxiosError;
            setLoading(false);
            setError(error.message);
        }
    }

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const newFiles: File[] = Array.from(event.target.files);
            setSelectedFile(prevFiles => [...prevFiles, ...newFiles]);
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (selectedFile.length > 0) {
            sendFiles();
        }
    };

    const deleteItem = (index: number) => {
        const updatedFiles = selectedFile.filter((_, i) => i !== index);
        setSelectedFile(updatedFiles);
    };

    return (
        <>
            <Header />
            <div className="max-w-md mx-auto content-center">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="file"
                            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-semibold">Нажмите, чтобы загрузить</span>
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Выберете сразу все файлы.</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Вес каждого файла не должен превышать 10 МБ.</p>
                            </div>
                            <input
                                type="file"
                                id="file"
                                name="file"
                                onChange={handleFileChange}
                                className="hidden"
                                multiple
                            />
                        </label>
                    </div>
                </form>

                {selectedFile.length > 0 && selectedFile.map((file, index) => (
                    <div key={index} className="flex items-center justify-between mb-2">
                        <p>{index + 1}. {file.name}</p>
                        <button
                            onClick={() => deleteItem(index)}
                            className="ml-4 text-red-500 hover:text-red-700"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                                 fill="#EA3323">
                                <path
                                    d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
                            </svg>
                        </button>
                    </div>
                ))}

                <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={selectedFile.length === 0 || loading}
                    className={`inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        selectedFile.length === 0 || loading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-red-500 hover:bg-red-700 focus:ring-indigo-500'
                    }`}
                >
                    Отправить
                </button>

                {error && <p className="mt-4 text-red-500">{error}</p>}
            </div>
        </>
    );
}
