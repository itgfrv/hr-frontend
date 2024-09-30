import {IAttempt, ICandidateInfo} from "../../../models";
import {useEffect, useState} from "react";
import axios, {AxiosError} from "axios";
interface IComment {
    content: string;
    adminName: string;
    adminLastname: string;
    adminEmail: string;
}
export function UserComment({ info }: { info: ICandidateInfo | undefined }) {
    const [comments, setComments] = useState<IComment[]>([]);
    const [newComment, setNewComment] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    async function addComment() {
        const token = localStorage.getItem('token');
        try {
            setLoading(true);
            const response = await axios.post<IComment>(`http://${process.env.REACT_APP_DOMAIN}:8080/api/v1/comment`, { userId: info?.user_info.id, content: newComment }, { headers: { "Authorization": `Bearer ${token}` } });
            setComments([...comments, response.data]);
            setNewComment('');
            setLoading(false);
        } catch (e: unknown) {
            const error = e as AxiosError;
            setLoading(false);
            setError(error.message);
        }
    }

    async function getUserComments() {
        const token = localStorage.getItem('token');
        try {
            setLoading(true);
            const commentsData = await axios.get<IComment[]>(`http://${process.env.REACT_APP_DOMAIN}:8080/api/v1/comment/` + info?.user_info.id, { headers: { "Authorization": `Bearer ${token}` } });
            setComments(commentsData.data);
            setLoading(false);
        } catch (e: unknown) {
            const error = e as AxiosError;
            setLoading(false);
            setError(error.message);
        }
    }
    useEffect(() => {
        getUserComments();
    }, [])
    return (
        <>
            <div className={"m-2"}>
                <h1 className="text-center font-bold">Комментарии</h1>
                <div className="mb-4">
                    {comments.map((comment, index) => (
                        <div key={index} className="bg-gray-100 p-2 my-2 rounded">
                            <p>
                                <strong>{comment.adminName} {comment.adminLastname}</strong> ({comment.adminEmail}):
                            </p>
                            <p>{comment.content}</p>
                        </div>
                    ))}
                </div>
                <div className="flex">
            <textarea
                className="w-full p-2 border border-gray-300 rounded"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Добавить комментарий"
            />
                    <button
                        className="bg-red-500 text-white p-2 rounded ml-2 hover:bg-red-600"
                        onClick={addComment}
                    >
                        Добавить
                    </button>
                </div>
            </div>
        </>
    )
}