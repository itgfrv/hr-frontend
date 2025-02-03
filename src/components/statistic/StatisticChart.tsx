import React, {useState} from "react";
import axios from "axios";
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip} from "chart.js";
import {Bar} from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface StatisticResponse {
    status: string;
    data: Array<{ date: string; count: number }>;
}

interface ChartData {
    labels: string[];
    datasets: Array<{
        label: string;
        data: number[];
        backgroundColor: string;
    }>;
}

interface StatisticChartProps {
    userId: number;
    statistic: string;
    name: string;
}



const StatisticChart: React.FC<StatisticChartProps> = ({ userId, statistic, name}) => {
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [chartData, setChartData] = useState<ChartData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const fetchStatistic = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await axios.post<StatisticResponse>(
                `${process.env.REACT_APP_DOMAIN}/api/v1/statistic/getStatistic`,
                null,
                {
                    params: {
                        statistic,
                        userId,
                        startDate,
                        endDate,
                    },
                }
            );

            const data = response.data.data;

            const labels = data.map((item) => item.date);
            const values = data.map((item) => item.count);

            setChartData({
                labels,
                datasets: [
                    {
                        label: "Количество",
                        data: values,
                        backgroundColor: "rgba(59, 130, 246, 0.7)",
                    },
                ],
            });
        } catch (err) {
            setError("Не удалось загрузить данные. Проверьте параметры запроса.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!startDate || !endDate) {
            setError("Выберите обе даты");
            return;
        }
        fetchStatistic();
    };

    return (
        <div className="p-6 max-w-6xl mx-auto bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-4 text-center">{name}</h1>

            <form className="flex flex-col md:flex-row gap-4 mb-6" onSubmit={handleSubmit}>
                <div className="flex flex-col">
                    <label htmlFor="startDate" className="text-sm font-medium text-gray-700">Начальная дата</label>
                    <input
                        type="date"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="endDate" className="text-sm font-medium text-gray-700">Конечная дата</label>
                    <input
                        type="date"
                        id="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                </div>

                <button
                    type="submit"
                    className="ml-auto bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                    Загрузить
                </button>
            </form>

            {error && <p className="text-red-500 mb-4">{error}</p>}
            {loading && <p className="text-gray-500 mb-4">Загрузка...</p>}

            {chartData && (
                <div style={{height: "400px", width: "100%"}}>
                    <Bar data={chartData} options={{
                        responsive: true,
                        maintainAspectRatio: false, // График адаптируется к контейнеру
                        plugins: {
                            legend: {
                                position: "top",
                                labels: {
                                    font: {
                                        size: 14,
                                        family: "Arial, sans-serif",
                                    },
                                    color: "#4A4A4A",
                                    padding: 10,
                                },
                            },
                            tooltip: {
                                bodyFont: {
                                    size: 14,
                                    family: "Arial, sans-serif",
                                },
                                titleFont: {
                                    size: 16,
                                    weight: "bold",
                                },
                                padding: 10,
                                backgroundColor: "#f9f9f9",
                                borderColor: "#ccc",
                                borderWidth: 1,
                                titleColor: "#333",
                                bodyColor: "#555",
                            },
                        },
                        layout: {
                            padding: {
                                top: 20,
                                bottom: 20,
                                left: 20,
                                right: 20,
                            },
                        },
                        scales: {
                            x: {
                                ticks: {
                                    color: "#4A4A4A",
                                    font: {
                                        size: 12,
                                        family: "Arial, sans-serif",
                                    },
                                },
                                grid: {
                                    color: "#E0E0E0",
                                },
                            },
                            y: {
                                ticks: {
                                    color: "#4A4A4A",
                                    font: {
                                        size: 12,
                                        family: "Arial, sans-serif",
                                    },
                                    padding: 10,
                                },
                                grid: {
                                    color: "#E0E0E0",
                                },
                            },
                        },
                    }}/>
                </div>
            )}
        </div>
    );
};

export default StatisticChart;
