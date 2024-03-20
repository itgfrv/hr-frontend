import {Header} from "./Header";
import {Loader} from "./Loader";
import {ErrorMessage} from "./ErrorMessage";
import React, {ChangeEvent, useEffect, useState} from "react";
import axios, {AxiosError} from "axios";
import {useNavigate, useParams} from "react-router-dom";

interface FileRequest {
    file: FormData
}

export function FileLoader() {
    const {id} = useParams();
    const navigation = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState<File[]>([]);

    async function sendFiles() {
        try {
            setLoading(true);
            let wantSend = confirm("Хотите ли вы отправить данные на проверку?\nПосле отправки данных не будет возможности изменить");// eslint-disable-line no-restricted-globals
            if (wantSend) {
                const formData = new FormData();
                selectedFile.forEach((file) => {
                    formData.append(`file`, file);
                });
                const token = localStorage.getItem('token');
                if (token) {
                    const data = await axios.post<FormData>(`http://${process.env.REACT_APP_DOMAIN}:8080/api/v1/case-study/load/${id}`, formData, {
                        headers:
                            {
                                'Content-Type':
                                    'multipart/form-data',
                                "Authorization": `Bearer ${token}`
                            }
                    });
                }
            }
            setLoading(false);
            navigation('/case-task')
        } catch (e: unknown) {
            const error = e as AxiosError;
            setLoading(false);
            setError(error.message);
        }
    }

    useEffect(() => {
    }, [selectedFile])


    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const newFiles: File[] = Array.from(event.target.files);
            setSelectedFile(prevFiles => [...prevFiles, ...newFiles]);
        }
    };
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (selectedFile) {
            sendFiles();
        }
    };


    return (
        <>
            <Header/>

            <div className="max-w-md mx-auto content-center">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="file" className="block text-sm font-medium text-gray-700 text-center">
                            Выберете сразу все файлы
                        </label>
                        <input
                            type="file"
                            id="file"
                            name="file"
                            onChange={handleFileChange}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            multiple
                        />
                    </div>
                    <button
                        type="submit"
                        className="inline-flex justify-center  px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Отправить
                    </button>
                </form>
            </div>
        </>
    );
}