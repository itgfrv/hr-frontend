import React, { useEffect, useState } from "react";
import axios from "axios";
import {Chart} from "react-chartjs-2";
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

interface StatisticResponse {
    status: string;
    data: Array<{ date: string; count: number }>;
    trend: Array<number>;
    avg:number;
}

interface ChartData {
    labels: string[];
    datasets: Array<{
        label: string;
        data: number[];
        backgroundColor: string;
        type:"bar"|"line"
    }>;
}

interface StatisticChartProps {
    userId: number;
    statistic: string;
    name: string;
    startDate: string;
    endDate: string;
    render: boolean;
}



const StatisticChart: React.FC<StatisticChartProps> = ({ userId, statistic, name, startDate, endDate, render}) => {
    const [chartData, setChartData] = useState<ChartData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if ((!startDate || !endDate) && render) return;
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
                        type:"line"
                    },
                    {
                        label: "Тренд",
                        data: response.data.trend,
                        backgroundColor: "rgba(255, 99, 132, 1)",
                        type:"line"

                    },
                    {
                        label: "Среднее",
                        data: new Array(labels.length).fill(response.data.avg), 
                        backgroundColor: "rgba(75, 192, 192, 1)",
                        type:"line"
                    },
                ],
            });
        } catch (err) {
            setError("Не удалось загрузить данные. Проверьте параметры запроса.");
        } finally {
            setLoading(false);
        }
    };
    fetchStatistic();

    }, [userId, statistic, startDate, endDate, render]);


    return (
        <div className="p-6 max-w-6xl mx-auto bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-4 text-center">{name}</h1>

            {error && <p className="text-red-500 mb-4">{error}</p>}
            {loading && <p className="text-gray-500 mb-4">Загрузка...</p>}

            {chartData && (
                <div style={{height: "400px", width: "100%"}}>
                    <Chart data={chartData} type="line" options={{
                        responsive: true,
                        maintainAspectRatio: false,
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
